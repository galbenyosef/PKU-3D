# Rendering performance

## Current result

The maintained scene retains full model detail, original image resolution, shadows, reflections and antialiasing. The latest comparison covers the research-building entrance and glazing-grid correction, dormitory canopy, Resource Hotel, union building mass, Qiu roof and east sports field. All six incremental checks remain within the original thresholds; three of six checks against the original frozen reference fail. This is not a performance-improvement claim.

| Metric | Change from preceding maintained scene | Change from frozen reference | Frozen result |
| --- | ---: | ---: | --- |
| First-frame submission time | -1.151% | +20.096% | Fail |
| GPU-ready time | -1.345% | -15.200% | Pass |
| Reported heap | +5.488% | +4.893% | Pass |
| Campus FPS | +1.448% | -21.523% | Fail |
| Lake FPS | -1.034% | -26.711% | Fail |
| Lake main-thread median time | -0.847% | -25.595% | Pass |

The incremental result and the three-of-six frozen result remain separate. First-frame submission, campus FPS and lake FPS remain unresolved global gaps. Both this and the preceding comparison passed three frozen checks; these runs do not establish a causal speedup or slowdown from the geometry changes alone. Heap API precision, shared browser processes and unobserved external GPU activity limit interpretation. All 24 phases completed with stable inputs, the registered environment decision and owned-process cleanup. Values are measurements from the retained comparison, not portable device promises. Physical-phone and whole-campus fidelity acceptance remain open.

## Delivered cost reductions

- Cache startup defers the two road meshes until the live builder actually needs them, preserving captured inputs and retry behavior. This removes unnecessary computation; the retained startup median difference of 5.2 ms does not establish a large speedup.
- Prebuilt scene loading retains lossless mesh reuse and compression, checksum verification, two decoding workers, bounded uploads, visibility caches, ordered instance streams, the two-frame GPU queue and idle scheduling.
- Deferred builder data, shared geometry pages and conservative visibility handling retain ordinary fallback paths. Context recovery, lazy photos and local-file/offline behavior remain supported.
- Reflection scissoring and conservative reflection culling retain full-resolution targets and fall back where bounds cannot prove a safe restriction.

## Validation protocol

Validate modified geometry and interactions in actual desktop and narrow-screen WebGL views. For rendering-path changes, compare matching cameras, state, ordered instance streams and final pixels where equivalence is expected. Include real context recovery and offline loading; unit tests do not replace these checks.

Formal comparisons retain the original 24 stages: three alternating A/B pairs and three alternating frozen-reference/B pairs, with startup and motion recorded separately. Compare matching builds, viewport, browser and quality settings; use the original median formulas and thresholds. Never replace the frozen reference, relax thresholds or repeat unchanged failed candidates to obtain a pass. Preserve source identity, raw samples, failed attempts and cleanup receipts in the local evidence archive.

The original frozen bundle and machine-specific measurement harness are not distributed as public product assets. A fresh checkout can run the portable tests and the exact packaged scene, but cannot independently reproduce the historical table without that retained measurement archive.

## Candidates not adopted

| Direction | Reason for stopping |
| --- | --- |
| Deferred decorative strokes | Formal incremental comparison failed the reported-heap limit. |
| Immutable texture-array storage | Texture mip and scene comparisons passed, but startup differences were near zero and inconsistent across pairs. |
| Lossless binary encoding of range metadata | Reduced script bytes, but all seven offline compilation/execution pairs were slower; no browser performance claim. |
| Repeated mesh positions and large ceramic-tile indexing | Insufficient supported reuse to justify implementation. |

These investigations are not delivered optimizations. Detailed chronological reports and intermediate captures remain local. New candidates need a substantive change or new evidence before further testing.
