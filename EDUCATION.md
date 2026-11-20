# Education — salted disclosure, not a W3C credential

> **Rung:** `npm test` passes. `verify` may set `disclosureConsistent: true` while `signature` stays **`not-checked`**.  
> **The test is the rule.** This is not BBS+, not ZK, and not an `eosio` signature check.

Official context: [docs.wax.io](https://docs.wax.io/). ZK refusal: [client-side ZK interface](https://github.com/pixel-journey/wax-client-side-zk-attestation-interface). Omission: [privacy sharer](https://github.com/pixel-journey/wax-privacy-preserving-attestation-sharer).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Issue commitments, present a subset, see sensitive flags |
| Intermediate | Explain salt length, empty-string SHA vector, root check |
| Masterclass | Keep `disclosureConsistent` from upgrading `signature` |

---

## Beginner — one scene

```text
commitment = SHA-256(key + "\n" + value + "\n" + salt)
root       = SHA-256(sorted commitments joined by "\n")
```

| Call | Locked result |
| --- | --- |
| `sha256("")` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `sha256("abc")` | `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` |
| present only `course` | verify disclosureConsistent true, signature **not-checked**, no `Alice Example` in JSON |
| present `course` + `holder_name` | `disclosedSensitive` includes `holder_name` |
| swap a revealed value | disclosureConsistent false |
| edit the root | disclosureConsistent false |
| salt shorter than 16 | issue throws |
| issuer `Not_A_Name` | throws |
| value with newline | throws |

```bash
npm test
```

---

## Intermediate — rules

| Rule | Detail |
| --- | --- |
| Salt | at least 16 characters |
| Keys | lowercase identifiers |
| Values | no newline |
| Names | Antelope-style 1..12 |
| Duplicate keys / commitments | refused |

Reveal sends **plaintext + salt**. Anyone with both recomputes the hash. That is selective disclosure, not zero knowledge.

---

## Masterclass

### Common mistakes

1. Rendering a green check because `disclosureConsistent` is true.  
2. Calling this a W3C Verifiable Credential.  
3. Storing every salt at the issuer and still claiming holder-controlled privacy.  
4. Putting `holder_name` in a public AtomicAssets attribute.

### Exercises

1. Empty-string SHA-256? (standard vector above.)  
2. Does verify check an Antelope signature? (`not-checked`.)  
3. Is a 15-character salt accepted? (No.)

---

## What this course will not teach

- Issuer signatures over the root
- BBS+ or circuit proofs
- That a browser hash is "on-chain verified"
