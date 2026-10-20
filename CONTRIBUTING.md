# Contributing

`npm test` must pass, including the SHA-256 vectors. Do not swap in `node:crypto` unless the demo stays a client component without it, and the vectors stay.

Do not add a branch of `verify` that returns a signature status other than `not-checked` until a real check exists and the verification log says so.

MIT.
