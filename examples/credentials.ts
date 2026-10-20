/**
 * Selective disclosure with per-claim salted hashes.
 * A matching root does not mean an Antelope account signed it.
 */
import { sha256 } from "./sha256";

export type Claim = {
  key: string;
  value: string;
  sensitive: boolean;
};

export type ClaimInput = Claim & { salt: string };

export type IssuedCredential = {
  id: string;
  schema: string;
  issuer: string;
  subject: string;
  issuedAt: string;
  claims: Array<Claim & { salt: string; commitment: string }>;
  commitments: string[];
  root: string;
};

export type Presentation = {
  credentialId: string;
  schema: string;
  issuer: string;
  subject: string;
  issuedAt: string;
  root: string;
  commitments: string[];
  revealed: ClaimInput[];
};

export type VerifyResult = {
  /** True only when revealed claims recompute into the published commitment set and the root matches that set. */
  disclosureConsistent: boolean;
  /** Always this value. This module does not check an eosio signature. */
  signature: "not-checked";
  problems: string[];
  disclosedSensitive: string[];
};

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;
const KEY = /^[a-z][a-z0-9._-]{0,63}$/;

export function assertAccountName(value: string, label: string): void {
  if (!NAME.test(value)) throw new Error(`${label} must be an Antelope name (a-z, 1-5, dot, 1-12 chars)`);
}

export function claimCommitment(claim: Claim, salt: string): string {
  if (salt.length < 16) throw new Error(`salt for ${claim.key} must be at least 16 characters`);
  if (!KEY.test(claim.key)) throw new Error(`bad claim key ${claim.key}`);
  if (claim.value.includes("\n")) throw new Error(`claim ${claim.key} cannot contain a newline`);
  return sha256(`${claim.key}\n${claim.value}\n${salt}`);
}

export function rootFromCommitments(commitments: readonly string[]): string {
  const unique = new Set(commitments);
  if (unique.size !== commitments.length) throw new Error("duplicate claim commitment");
  return sha256([...commitments].sort().join("\n"));
}

export function issue(input: {
  id: string;
  schema: string;
  issuer: string;
  subject: string;
  issuedAt: string;
  claims: ClaimInput[];
}): IssuedCredential {
  if (!input.id || !input.schema || !input.issuedAt) throw new Error("id, schema, and issuedAt are required");
  assertAccountName(input.issuer, "issuer");
  assertAccountName(input.subject, "subject");
  if (input.claims.length === 0) throw new Error("a credential needs at least one claim");
  const keys = new Set<string>();
  const claims = input.claims.map((claim) => {
    if (keys.has(claim.key)) throw new Error(`duplicate claim key ${claim.key}`);
    keys.add(claim.key);
    return { ...claim, commitment: claimCommitment(claim, claim.salt) };
  });
  const commitments = claims.map((claim) => claim.commitment);
  return { ...input, claims, commitments, root: rootFromCommitments(commitments) };
}

export const SAMPLE_CREDENTIAL: IssuedCredential = issue({
  id: "cred:sample-course",
  schema: "pxj.course.v1",
  issuer: "pxjlearn.gm",
  subject: "alice",
  issuedAt: "2026-10-20T12:00:00Z",
  claims: [
    { key: "course", value: "Reading a transaction", sensitive: false, salt: "course-salt-0001-aaaa" },
    { key: "holder_name", value: "Alice Example", sensitive: true, salt: "name-salt-0002-bbbb" },
    { key: "score", value: "hidden-on-purpose", sensitive: true, salt: "score-salt-0003-cccc" },
  ],
});

export function present(credential: IssuedCredential, revealKeys: readonly string[]): Presentation {
  const known = new Set(credential.claims.map((claim) => claim.key));
  const wanted = new Set<string>();
  for (const key of revealKeys) {
    if (!known.has(key)) throw new Error(`unknown claim ${key}`);
    if (wanted.has(key)) throw new Error(`claim ${key} listed twice`);
    wanted.add(key);
  }
  const revealed = credential.claims
    .filter((claim) => wanted.has(claim.key))
    .map(({ key, value, sensitive, salt }) => ({ key, value, sensitive, salt }));
  return {
    credentialId: credential.id,
    schema: credential.schema,
    issuer: credential.issuer,
    subject: credential.subject,
    issuedAt: credential.issuedAt,
    root: credential.root,
    commitments: [...credential.commitments],
    revealed,
  };
}

export function verify(presentation: Presentation): VerifyResult {
  const problems: string[] = [];
  let root = "";
  try {
    root = rootFromCommitments(presentation.commitments);
  } catch (err) {
    problems.push(err instanceof Error ? err.message : "bad commitments");
  }
  if (root && root !== presentation.root) problems.push("root does not match the commitment set");

  const pool = new Set(presentation.commitments);
  const seen = new Set<string>();
  for (const claim of presentation.revealed) {
    if (seen.has(claim.key)) problems.push(`claim ${claim.key} revealed twice`);
    seen.add(claim.key);
    try {
      const commitment = claimCommitment(claim, claim.salt);
      if (!pool.has(commitment)) problems.push(`revealed claim ${claim.key} is not in the commitment set`);
    } catch (err) {
      problems.push(err instanceof Error ? err.message : `bad claim ${claim.key}`);
    }
  }

  return {
    disclosureConsistent: problems.length === 0,
    signature: "not-checked",
    problems,
    disclosedSensitive: presentation.revealed.filter((claim) => claim.sensitive).map((claim) => claim.key),
  };
}
