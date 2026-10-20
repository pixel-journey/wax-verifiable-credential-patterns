# Verification log

**Trust label:** educational-reference  
**Updated:** 2026-10-20

| Claim | Evidence | State |
| --- | --- | --- |
| SHA-256 of `""` and `"abc"` | `examples/credentials.test.ts` | verified (unit) |
| Hiding claims removes their plaintext from the presentation JSON | same | verified (unit) |
| Revealing `holder_name` lists it as sensitive | same | verified (unit) |
| A swapped value fails disclosure | same | verified (unit) |
| An edited root fails disclosure | same | verified (unit) |
| Short salts and non-names throw | same | verified (unit) |
| `signature` is `not-checked` on success | same | verified (unit) |
| Demo toggles the sample credential | `examples/Demo.tsx` | partial (inspection) |
| Issuer signature or account existence | none | untested |
| W3C VC / zero-knowledge | none | not claimed |
| WCAG audit | none | not claimed |
