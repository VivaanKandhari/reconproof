# ReconProof — Galuxium submission payload

Status: registered solo; built after registration on 18 October 2026. Source and demo published. Public browser-local deployment is being published on GitHub Pages at the user's requested address without a branded hostname. The separate Worker preview remains private. Devpost draft and final submission are NOT yet created/confirmed because its verification page blocks access.

Solo entrant: Vivaan Kandhari.

Tagline: Exact payment allocation with ambiguity witnesses and checkable certificates.

Source: https://github.com/VivaanKandhari/reconproof

Public app: https://vivaankandhari.github.io/reconproof/ (verify deployment before saving to Devpost).

Demo: https://youtu.be/mD1z-3-djWc . YouTube confirmed Video published, Unlisted selected, no issues found; displayed duration 2:17.

## Problem and intended user

A small-business bookkeeper may have several partial payments and several invoices for the same counterparty. A single proposed match can hide the fact that the available data supports multiple equally good allocations. ReconProof is an exploratory tool for reviewing this ambiguity. The problem and market need are hypotheses; no customer interviews or commercial results are invented.

## Working product

Users enter JSON or import two CSV files, configure a date window, and reconcile locally in the hosted browser app. It permits partial allocation, keeps currencies separate, displays unallocated money and outstanding invoices, and exposes an alternative allocation when the optimum is non-unique. A downloaded audit can be re-imported into a separate verifier. The browser saves a draft only when requested. Its public deployment sends no records to a solver server.

## Technical architecture

A dependency-free JavaScript module implements exact integer minor-unit arithmetic, candidate constraints and min-cost maximum flow. GitHub Pages serves the public browser-local app. The same engine also runs behind an optional stateless Worker JSON API, reproducible locally; its hosted preview remains private. The independent verifier rebuilds the network and checks allocation capacities, objective values, a max-flow cut and nonnegative reduced costs under supplied node potentials. A zero-cost residual cycle produces an ambiguity witness.

Candidates must share normalized counterparty and currency and lie within the configured absolute date gap. The lexicographic objective is maximum allocated amount followed by minimum amount-weighted date gap. This is a chosen matching model, not evidence that a payment belongs to the corresponding invoice. Established optimization/certificate methods are combined; a new global algorithm is not claimed.

## Verification

Eleven core checks pass. An independent exhaustive enumerator agrees on allocation, cost and ambiguity across 120 deterministic tiny networks. API validation checks include malformed JSON, content type, unknown routes and streamed size limits. The actual browser alternate view and exported audit re-import were checked. The narrated demo renders real executed Worker API responses for readability; it is not claimed to be a browser screen recording. Its full encoded video was decoded successfully and an encoded frame inspected.

## Monetization blueprint

Proposed free bounded sandbox, then subscriptions based on batch volume, saved organization workspaces and accounting exports. Those paid features, billing, integrations and production SLAs are not implemented. No revenue, users, measured business impact or scale claims are made.

## Limits and future work

The current sandbox caps input at 30 payments and 30 invoices and uses explicit exact identity matching. There is no bank connection, automatic ledger posting, FX, refund handling, fraud detection, distributed rate limiter or user-organization system. A production service would need stronger isolation, quotas, retention controls and accounting integration. Future work includes reviewer-approved candidate rules and persisted review decisions, with evaluation on independently obtained authorized data.

Implementation and materials were AI-assisted. The entrant is the sole registered participant and should review and understand the code. No team member or real-world validation is invented.

## Remaining submission gate

- Verify the GitHub Pages deployment and all public interactions; keep its address free of the prior platform hostname.
- [x] YouTube publication confirmed. Public watch-page playback recheck is blocked by the network's Google traffic verification.
- Resolve Devpost verification; create draft, fill all actual fields and check required assets.
- Obtain action-time agreement approval at final submission if required, submit and verify actual Submitted state.
- Deadline: 31 October 2026 19:30 HKT; recheck official event before final action.
