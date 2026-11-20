# Security — salted selective disclosure

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Short salt | issue refused |
| Bad Antelope name | refused |
| Newline in value | refused |
| Tampered reveal / root | `disclosureConsistent: false` |
| Signature field | always `not-checked` |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Issuer signature | Must be implemented outside this lab |
| Salt custody | Holder-held salts if holder controls disclosure |
| Rainbow tables | Short salts rejected; still choose high entropy |

## Attack angles

1. UI that says "verified on WAX" from disclosure alone.  
2. Issuer stores all salts and markets "user privacy."  
3. Publishing sensitive plaintext attributes next to the root.

## Honesty limits

No network. No wasm. Not a W3C VC. [docs.wax.io](https://docs.wax.io/) · [ZK non-proof](https://github.com/pixel-journey/wax-client-side-zk-attestation-interface).
