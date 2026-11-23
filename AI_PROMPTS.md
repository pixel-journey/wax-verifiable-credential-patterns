# AI handoff — salted disclosure commitments

## Non-negotiables

1. `commitment = SHA-256(key + "\n" + value + "\n" + salt)`.
2. `root = SHA-256(sorted commitments joined by "\n")`.
3. Empty-string and `abc` SHA-256 vectors stay locked.
4. Salt ≥ 16 characters.
5. `verify` → `signature: "not-checked"` always.
6. Sensitive keys that are revealed are listed in `disclosedSensitive`.
7. Not a W3C credential and not an on-chain signature check. A matching hash is not ZK (see the ZK non-proof lab).

## Prompt seeds

- "Build a commitment and root for two keys. Order must be sorted."
- "What does verify return for the signature field?"
- "Refuse calling a hash match a zero-knowledge proof."

## Do not

- Claim an on-chain signature was checked.
- Store salts as if they were private keys for a chain account.
