# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Account name context |
| [ZK non-proof](https://github.com/pixel-journey/wax-client-side-zk-attestation-interface) | Matching hash is not ZK |
| [privacy sharer](https://github.com/pixel-journey/wax-privacy-preserving-attestation-sharer) | Omission vs hashing |

## Product facts locked by tests

```text
commitment = SHA-256(key + "\n" + value + "\n" + salt)
root       = SHA-256(sorted commitments joined by "\n")
```

- Empty-string and `abc` SHA-256 vectors locked.
- Salt ≥ 16 characters.
- `verify` → `signature: "not-checked"` always.
- Sensitive keys revealed are listed in `disclosedSensitive`.
- Not a W3C credential and not an on-chain signature check.
