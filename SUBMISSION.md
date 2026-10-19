# ReconProof — Galuxium submission payload

Status: submitted to Galuxium Nexus V2 on 19 October 2026 at approximately 11:43 HKT. Devpost displayed "Project submitted!" and "Submitted to Galuxium Nexus V2". Entry 1244894-reconproof; public page https://devpost.com/software/reconproof . The private Worker preview remains private.

Solo entrant: Vivaan Kandhari.

Tagline: Exact payment allocation with ambiguity witnesses and checkable certificates.

Source: https://github.com/VivaanKandhari/reconproof

Public app: https://vivaankandhari.github.io/reconproof/ (live allocation and certificate verification checked).

Demo: https://youtu.be/29TzWDxyqrY . YouTube confirmed Video published, Unlisted selected and no issues found; displayed 2:17. Embedded playback on the submitted Devpost page progressed to 22 seconds of 2:16 before pausing.

## Problem and intended user

A small-business bookkeeper may have several partial payments and several invoices for the same counterparty. A single proposed match can hide the fact that the available data supports multiple equally good allocations. ReconProof is an exploratory tool for reviewing this ambiguity. The problem and market need are hypotheses; no customer interviews or commercial results are invented.

## Working product

Users enter JSON or import two CSV files, configure a date window, and reconcile locally in the hosted browser app. It permits partial allocation, keeps currencies separate, displays unallocated money and outstanding invoices, and exposes an alternative allocation when the optimum is non-unique. A downloaded audit can be re-imported into a separate verifier. The browser saves a draft only when requested. Its public deployment sends no records to a solver server.

## Technical architecture

A dependency-free JavaScript module implements exact integer minor-unit arithmetic, candidate constraints and min-cost maximum flow. GitHub Pages serves the public browser-local app. The same engine also runs behind an optional stateless Worker JSON API, reproducible locally; its hosted preview remains private. The independent verifier rebuilds the network and checks allocation capacities, objective values, a max-flow cut and nonnegative reduced costs under supplied node potentials. A zero-cost residual cycle produces an ambiguity witness.

Candidates must share normalized counterparty and currency and lie within the configured absolute date gap. The lexicographic objective is maximum allocated amount followed by minimum amount-weighted date gap. This is a chosen matching model, not evidence that a payment belongs to the corresponding invoice. Established optimization/certificate methods are combined; a new global algorithm is not claimed.

## Verification

Eleven core checks pass. An independent exhaustive enumerator agrees on allocation, cost and ambiguity across 120 deterministic tiny networks. API validation checks include malformed JSON, content type, unknown routes and streamed size limits. The actual browser alternate view and exported audit re-import were checked. The embedded UI walkthrough combines real captures of the working public app with executed Worker API results. The additional [UI workflow demo](https://raw.githubusercontent.com/VivaanKandhari/reconproof/main/ReconProof-UI-demo.mp4) combines real captures of the public app with executed API results, including allocation alternatives and audit verification. It is also included in the prepared source ZIP. These are annotated captures, not a continuous screen recording. The full encoded videos decoded successfully and encoded frames were inspected.

## Monetization blueprint

Proposed free bounded sandbox, then subscriptions based on batch volume, saved organization workspaces and accounting exports. Those paid features, billing, integrations and production SLAs are not implemented. No revenue, users, measured business impact or scale claims are made.

## Limits and future work

The current sandbox caps input at 30 payments and 30 invoices and uses explicit exact identity matching. There is no bank connection, automatic ledger posting, FX, refund handling, fraud detection, distributed rate limiter or user-organization system. A production service would need stronger isolation, quotas, retention controls and accounting integration. Future work includes reviewer-approved candidate rules and persisted review decisions, with evaluation on independently obtained authorized data.

Implementation and materials were AI-assisted. The entrant is the sole registered participant and should review and understand the code. No team member or real-world validation is invented.

## Submission verification

- [x] Public app and source links saved and visible on the submitted project page.
- [x] New Unlisted UI demo saved as the embedded video; actual playback checked and paused at 22 seconds.
- [x] Actual application screenshot saved in the image gallery with a fictional-example caption.
- [x] Additional info confirmed Current File: ReconProof-Galuxium-UI-complete.zip, containing source/tests/docs/screenshot/transcript/UI video.
- [x] Sole registered entrant confirmed as Vivaan Kandhari.
- [x] User explicitly confirmed final Official Rules and Devpost Terms agreement; checked and submitted.
- [x] Actual Devpost confirmation observed: Project submitted! and Submitted to Galuxium Nexus V2.

This confirms submission and the listed required materials, not judging acceptance, production readiness or a prize. Edits remain possible until 31 October 2026 19:30 HKT.
