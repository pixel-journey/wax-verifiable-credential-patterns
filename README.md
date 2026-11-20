# Selective disclosure without pretending it is a signature

**Trust label:** `educational-reference`  
**Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

A credential that puts a legal name in a public NFT attribute is not a privacy pattern. This repo shows a smaller thing that is still easy to overclaim: each claim is a salted hash, the root is a hash of those hashes, and a holder can reveal some claims by handing over the value and the salt.

`verify` checks that the revealed claims sit in the published set and that the root matches the set. The result always says `signature: "not-checked"`. Nothing here is a W3C Verifiable Credential, a BBS+ proof, or an `eosio` signature.

## What you can learn

- Why a single hash of every claim concatenated does not let you hide one field. Per-claim commitments do.
- What "reveal" actually sends: plaintext plus salt. Anyone who sees both learns the claim. That is not zero knowledge.
- Why a short salt is rejected. A name field with salt `"1"` can be guessed.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `src/sha256.ts` | UTF-8 SHA-256, so the demo does not import `node:crypto` |
| `src/credentials.ts` | `issue`, `present`, `verify` |
| `src/credentials.test.ts` | Test vectors and the disclosure cases |
| `src/Demo.tsx` | Toggle claims on the sample credential |

The sample issuer `pxjlearn.gm` and subject `alice` are names that fit the Antelope charset. They are not accounts this repo queried.

## The commitment

```
commitment = SHA-256(key + "\n" + value + "\n" + salt)
root       = SHA-256(sorted commitments joined by "\n")
```

Salts are at least 16 characters. Claim keys are lowercase identifiers. Values cannot contain a newline, so the encoding stays unambiguous. Duplicate keys and duplicate commitments throw.

## Use it somewhere else

Copy `src/credentials.ts` and `src/sha256.ts`. Keep salts with the holder if the holder is supposed to choose what to reveal. If the issuer stores every salt, the issuer can open every claim; say that in the product.

The root is the only value worth putting somewhere public (an immutable AtomicAssets attribute, or the memo of an attestation you have actually specified). Putting `holder_name` in that attribute is the anti-pattern this demo's "sensitive" flag is about.

## Edge cases

- Revealing an unknown key throws before a presentation exists.
- Editing a revealed value fails verification. Editing the root fails verification.
- Two identical commitment strings throw. You cannot hide a collision by listing it twice.
- Account names must match `a-z`, `1-5`, and `.`, length 1–12, no leading, trailing, or doubled dot. `Not_A_Name` is rejected. This is a format check, not a proof the account exists.
- `disclosureConsistent: true` never upgrades `signature`. Do not render a checkmark that says "verified on WAX".

## Best practice and the opposite

**Do** show the holder which sensitive keys are inside the presentation they are about to share. The demo lists them in a sentence.

**Do not** call this zero knowledge. A verifier who receives the salt and the value learns the claim, and can recompute the hash.

**Do not** skip the signature step in a real issuer and still tell the subject the credential is "on-chain" because a hash exists in a browser.

## Antelope notes

The name check is the WAX/Antelope-specific part. SHA-256 and the root are ordinary. A real verify step would be an Antelope signature over the root by `issuer`, checked with the account's authority. That step is deliberately absent. The same shape works on other Antelope chains; the signature check still has to be written per chain library. This repo did not run one.

## Live path, not shipped

```
holder salts + claims --> root
        |
        +--> issuer signature over the root (not implemented)
        |
        +--> present(subset) --> verify disclosure, then verify the signature separately
```

## Related

- [wax-on-chain-quest-and-achievement-system](https://github.com/pixel-journey/wax-on-chain-quest-and-achievement-system) — a credential id with no disclosure rules
- [wax-private-attestation-and-encrypted-vault](https://github.com/pixel-journey/wax-private-attestation-and-encrypted-vault) — a different privacy sketch; read its own log before trusting it


## Queries and unsigned transactions

`src/api.ts` builds the HTTP requests. `src/usecases.ts` is the worked case for this repo: those requests, and the unsigned transaction when the feature actually has an action. `executed` is false. Nothing is sent.

The engines used to sit in `examples/`. GitHub treats that directory as documentation, so the language bar showed the stylesheet and almost none of the TypeScript.

## Run

```bash
npm install
npm test
npm run dev
```
