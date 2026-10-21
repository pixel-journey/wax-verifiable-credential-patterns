import { HISTORY_ORIGIN, historyActions } from "./api";
import { SAMPLE_CREDENTIAL, present, verify } from "./credentials";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const shown = present(SAMPLE_CREDENTIAL, ["course"]);
const checked = verify(shown);

export const USE_CASES: UseCase[] = [
  {
    title: "History is not the verifier",
    detail: "A memo could later carry a root. This query would find transfer memos for the issuer. verify() does not call it, and a matching root is not an Antelope signature.",
    request: historyActions(HISTORY_ORIGIN, SAMPLE_CREDENTIAL.issuer, "eosio.token:transfer", 10),
    transaction: null,
  },
  {
    title: "Selective disclosure of one claim",
    detail: `Revealed keys: ${shown.revealed.map((claim) => claim.key).join(", ")}. The score stays a commitment. No transaction anchors this presentation.`,
    request: historyActions(HISTORY_ORIGIN, SAMPLE_CREDENTIAL.subject, "eosio.token:transfer", 5),
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (!checked.disclosureConsistent) throw new Error(checked.problems.join("; "));
  if (checked.signature !== "not-checked") throw new Error("signature must stay unchecked");
  if (shown.revealed.some((claim) => claim.key === "score")) throw new Error("score was revealed");
}
