# Validation — 18 October 2026

- node test.mjs: 11 checks pass, including an independent exhaustive oracle on 120 tiny networks comparing allocation, cost and uniqueness.
- Build and artifact ESM validation pass.
- Browser default batch: HKD 300 allocated; HKD 40 unmatched; ambiguity reported. Alternate view changes allocations while retaining totals.
- Actual audit JSON downloaded and re-imported into the browser verifier; UI confirmed certificate verified, stating its exact scope.
- API solve/verify, content type rejection, malformed JSON, unknown route and streamed request-size limit checks pass.
- Browser screenshot capture fails in this session: visual screenshot QA and demo footage remain pending. Do not claim a completed demo.
- Private Worker deployment succeeded through Sites and remains private. Public app https://vivaankandhari.github.io/reconproof/ loads successfully and computes the HKD 300 allocation plus certificate verification. Its hostname has no prior-platform branding. Final competition submission remains pending.
- Actual browser CSV imports with quoted commas and embedded newlines produced correct JSON records and a certified HKD 0.30 allocation from HKD 0.10 and 0.20 payments. Editing JSON clears the previous result; status text was tightened to avoid stale success messages.
- Demo video made from recorded Worker responses, fully decoded and an encoded frame inspected. YouTube confirmed Unlisted publication, no issues found and 2:17 displayed runtime.
- Browser-local deployment mode: allocation, certificate checks and equally optimal alternative confirmed using a plain static server, with no solver API available. This verifies the intended mode does not depend on a private server.
- Public app screenshot saved as ReconProof-public-proof.png via the supported browser screenshot wrapper. Full-page screenshot API remains unavailable; do not claim full-page visual QA.
