import { describe, expect, it } from "vitest";
import { SAMPLE_CREDENTIAL, issue, present, verify } from "./credentials";
import { sha256 } from "./sha256";

describe("sha256", () => {
  it("matches the empty-string and abc test vectors", () => {
    expect(sha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("issue and present", () => {
  it("hides a claim that was not revealed", () => {
    const shown = present(SAMPLE_CREDENTIAL, ["course"]);
    const result = verify(shown);
    expect(result.disclosureConsistent).toBe(true);
    expect(result.signature).toBe("not-checked");
    expect(result.disclosedSensitive).toEqual([]);
    expect(JSON.stringify(shown)).not.toContain("Alice Example");
    expect(JSON.stringify(shown)).not.toContain("hidden-on-purpose");
  });

  it("flags a sensitive claim that the holder chose to reveal", () => {
    const shown = present(SAMPLE_CREDENTIAL, ["course", "holder_name"]);
    const result = verify(shown);
    expect(result.disclosureConsistent).toBe(true);
    expect(result.disclosedSensitive).toEqual(["holder_name"]);
  });

  it("rejects a revealed value that was swapped", () => {
    const shown = present(SAMPLE_CREDENTIAL, ["course"]);
    shown.revealed[0] = { ...shown.revealed[0]!, value: "A different course" };
    const result = verify(shown);
    expect(result.disclosureConsistent).toBe(false);
    expect(result.problems.join(" ")).toMatch(/not in the commitment set/);
  });

  it("rejects a root that was edited", () => {
    const shown = present(SAMPLE_CREDENTIAL, ["course"]);
    shown.root = sha256("not-the-root");
    expect(verify(shown).disclosureConsistent).toBe(false);
  });

  it("refuses a short salt, a bad account name, and a public newline", () => {
    expect(() =>
      issue({
        ...SAMPLE_CREDENTIAL,
        claims: [{ key: "course", value: "x", sensitive: false, salt: "too-short" }],
      }),
    ).toThrow(/salt/);
    expect(() => issue({ ...SAMPLE_CREDENTIAL, issuer: "Not_A_Name", claims: SAMPLE_CREDENTIAL.claims })).toThrow(
      /Antelope name/,
    );
    expect(() =>
      issue({
        ...SAMPLE_CREDENTIAL,
        claims: [{ key: "course", value: "a\nb", sensitive: false, salt: "0123456789abcdef" }],
      }),
    ).toThrow(/newline/);
  });
});
