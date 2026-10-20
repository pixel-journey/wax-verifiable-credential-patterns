# Architecture

```
claims + salts
    |
    +--> claimCommitment(each) --> sorted hash = root
    |
    +--> present(revealKeys) --> plaintext for those keys only
    |
    +--> verify --> disclosureConsistent, signature always "not-checked"
```

`examples/sha256.ts` is included so a client bundle does not need Node's `crypto`. The test file checks the empty string and `"abc"` against known vectors.

## Decisions

**Per-claim salts, not one hash of the whole document.** A single hash cannot be opened part-way. That is the whole lesson.

**Verify does not fetch the issuer.** A presentation carries the commitment set. Consistency is local. Authority is a different function that this repo refuses to fake.

**Sensitive is a label, not a lock.** The holder can still reveal it. The result lists those keys so a UI can warn.

## Live path (not shipped)

Publish the root where a verifier can retrieve it without trusting the presenter's JSON. Check an Antelope signature on that root. Then run `verify` on the disclosure. Either check alone is incomplete.
