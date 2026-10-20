"use client";

import { useMemo, useState } from "react";
import { SAMPLE_CREDENTIAL, present, verify } from "./credentials";

export function Demo() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({ course: true });

  const view = useMemo(() => {
    const keys = SAMPLE_CREDENTIAL.claims.filter((claim) => revealed[claim.key]).map((claim) => claim.key);
    const presentation = present(SAMPLE_CREDENTIAL, keys);
    return { presentation, result: verify(presentation) };
  }, [revealed]);

  return (
    <main className="wrap">
      <p className="kicker">educational-reference · signature not checked</p>
      <h1>Show one claim, hide the rest</h1>
      <p className="lede">
        Each claim is a salted hash. The root is the hash of those hashes, sorted. Revealing a claim means
        handing over the value and the salt. A consistent disclosure is not an Antelope signature, and it is
        not a zero-knowledge proof.
      </p>
      <p className="note">
        Issuer <code>{SAMPLE_CREDENTIAL.issuer}</code> · subject <code>{SAMPLE_CREDENTIAL.subject}</code> ·
        schema <code>{SAMPLE_CREDENTIAL.schema}</code>
      </p>
      <ul className="plain">
        {SAMPLE_CREDENTIAL.claims.map((claim) => (
          <li key={claim.key}>
            <button
              type="button"
              aria-pressed={Boolean(revealed[claim.key])}
              onClick={() => setRevealed((prev) => ({ ...prev, [claim.key]: !prev[claim.key] }))}
            >
              {revealed[claim.key] ? "Revealed" : "Hidden"}: {claim.key}
              {claim.sensitive ? " (sensitive)" : ""}
            </button>
          </li>
        ))}
      </ul>
      <p className="summary" role="status">
        Disclosure {view.result.disclosureConsistent ? "matches the root" : "does not match the root"}.
        Signature: {view.result.signature}.
        {view.result.disclosedSensitive.length > 0
          ? ` Sensitive claims in this presentation: ${view.result.disclosedSensitive.join(", ")}.`
          : " No sensitive claim is in this presentation."}
      </p>
      <pre>
        <code>{JSON.stringify(view.presentation, null, 2)}</code>
      </pre>
    </main>
  );
}
