# Security — salted selective disclosure

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Salt shorter than **16** | issue refused |
| Bad Antelope name | refused |
| Newline in value | refused |
| Tampered reveal / root | `disclosureConsistent: false` |
| Signature field | always **`not-checked`** |
| Empty-string SHA-256 | standard vector `e3b0c442…` |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Issuer signature | Must be implemented outside this lab |
| Salt custody | Holder-held salts if holder controls disclosure |
| Rainbow tables | Short salts rejected; still choose high entropy |
| W3C VC / BBS+ | Not this product |

## Attack angles

1. UI that says "verified on WAX" from `disclosureConsistent` alone.  
2. Issuer stores all salts and markets "user privacy."  
3. Publishing sensitive plaintext attributes next to the root.  
4. Upgrading `signature` from `not-checked` because disclosure matched.  
5. Calling this a zero-knowledge proof (reveal sends plaintext + salt).

## Honesty limits

No network. No wasm. Not a W3C VC. Not an `eosio` signature check.

| Sibling | Distinction |
| --- | --- |
| [reputation exporter](https://github.com/pixel-journey/wax-on-chain-reputation-attestation-exporter) | Typed score 0..100, no hash |
| [ZK interface](https://github.com/pixel-journey/wax-client-side-zk-attestation-interface) | Proof always false |
| [privacy sharer](https://github.com/pixel-journey/wax-privacy-preserving-attestation-sharer) | Omission triangle |

[docs.wax.io](https://docs.wax.io/).
