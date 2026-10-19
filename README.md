# ReconProof

Exact-money partial reconciliation, equal-optimum ambiguity witnesses, and independent maximum-flow/minimum-cost certificate verification. Built after solo Galuxium registration on 18 October 2026. Submitted to Galuxium Nexus V2 on 19 October 2026; Devpost displayed "Project submitted!". Sole entrant: Vivaan Kandhari.

Video: https://youtu.be/29TzWDxyqrY (Unlisted; YouTube displays 2:17). It combines real public browser UI captures with executed Worker API responses. These are annotated captures, not a continuous screen recording. Embedded playback was checked on the submitted Devpost page.

Live app: https://vivaankandhari.github.io/reconproof/ . This deployment runs the same solver and verifier locally in the browser. It does not send submitted records to the separate Worker service. The optional Worker API remains available for local reproduction; its hosted preview is private. The public app's allocation and certificate verification were checked on 18 October 2026.

UI workflow video: [Download/watch the 136-second demo](https://raw.githubusercontent.com/VivaanKandhari/reconproof/main/ReconProof-UI-demo.mp4). It combines real captures of the working public browser app with executed API results, including the alternative allocation and independent audit verification. These are annotated captures, not a continuous screen recording. The earlier API-focused video remains at https://youtu.be/mD1z-3-djWc .

## Run

Node 20+; no packages, credentials or external model APIs needed.

```
node test.mjs
node scripts/build.mjs
node scripts/build-static.mjs
node scripts/validate-artifact.mjs
node scripts/preview.mjs
```

Open http://127.0.0.1:4185 for the Worker API mode. The generated docs/ site uses browser-local execution with the same engine. Edit src/, not generated docs/, worker/index.js or dist/. Deployment identity belongs in .openai/hosting.json; never add credentials.

## Model

Input JSON contains payments, invoices and maxDays (0–120, default 30). Each row has id, counterparty, currency, decimal-string amount and ISO calendar date. CSV import accepts exactly these five headers, including quoted fields. Browser save is explicit and local.

Candidate pairs share a currency and a counterparty normalized by case/whitespace, with absolute date gap inside the configured window. Partial allocations are allowed. HKD, USD, EUR, GBP, SGD, AUD, CAD, CHF and CNY use two decimals; JPY uses zero. No FX or negative/refund amounts. Safe integer minor units preserve exact arithmetic; each amount is at most 100,000,000 minor units. At most 30 rows per side, 900 candidate edges, 62 vertices, 2,000 augmentations and 256 KB request body.

For each currency separately, source→payment→invoice→sink capacities represent money. Candidate cost is absolute date gap. Successive shortest augmenting paths using Bellman–Ford maximize allocated money, then minimize minor-unit-days. Different currencies are never summed. The default fictional batch allocates HKD 300, leaves HKD 40 unmatched and has more than one optimum.

## Certificate and ambiguity

A source/sink cut whose original capacity equals the flow certifies maximum allocation. Node potentials making all positive-capacity residual edges have nonnegative reduced cost certify minimum cost for that flow. The independent verifier rebuilds the graph and checks allocation validity, capacities, objective, cut and potentials without rerunning the optimizer. Display strings and ambiguity annotations are explicitly outside its certificate scope.

A simple zero-reduced-cost residual cycle containing an allocation edge yields another feasible optimum. Its exact two-arc reverse backtrack is excluded because that changes nothing. The alternate allocation can itself be checked by the verifier. The interface shows both optima and an audit export rather than silently choosing one.

## API and privacy

- GET /api/health: version and limit.
- POST /api/reconcile: input → audit/certificate.
- POST /api/verify: audit → valid/scope or error.

In Worker mode, POST requires application/json; the service is stateless and bounded. The public browser demo does not use these endpoints and sends no records to a solver server. Hosting infrastructure can process page-request metadata. Use fictional or authorized records. There is no distributed rate limiting, production SLA or hardened multi-tenant financial infrastructure.

## Validation and limits

Eleven core checks pass. An independent exhaustive enumerator verifies maximum allocation, minimum cost and ambiguity on 120 deterministic tiny networks. Other checks cover decimals, currency isolation, dates, invalid input, empty batches, alternate feasibility and tampering. Finite tests are not a proof of implementation correctness. Browser/API results and verification limits are recorded in VALIDATION.md.

A certified optimum is not evidence that a payment truly belongs to an invoice, that identity is correct or that a liability is legally discharged. Date gaps do not establish intent. There is no automatic accounting posting, bank connection, refund processing, fraud detection or legal determination.

## Product hypothesis

For bookkeepers reviewing ambiguous small-business batches: expose equally valid allocations and make the mathematical result checkable. Proposed monetization is a free bounded sandbox followed by paid batch volume, saved organization workspaces and accounting exports. Billing, organizations, integrations, paid plans and revenue are not implemented or claimed. No user study, commercial validation or new optimization algorithm is claimed.

Background: https://cp-algorithms.com/graph/min_cost_flow.html and https://developers.google.com/optimization/flow/mincostflow . Established flow, cut and potential techniques are implemented directly; no external solver source was copied. Implementation and materials were prepared with AI assistance for the solo entrant to review and understand.
