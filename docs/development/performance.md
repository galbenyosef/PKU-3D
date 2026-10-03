# Rendering performance

## Current result

The maintained scene retains full model detail, original image resolution, shadows, reflections and antialiasing. It does **not** meet the original frozen performance reference in three metrics. The most recent formal comparison follows the Yannan Garden No. 55 platform repair; it is not a claim that this repair improves performance.

| Metric | Change from preceding maintained scene | Change from frozen reference | Frozen result |
| --- | ---: | ---: | --- |
| First-frame submission time | −3.663647% | +11.403301% | Fail |
| GPU-ready time | −3.417324% | −10.674191% | Pass |
| Reported heap | −0.037007% | +2.849589% | Pass |
| Campus FPS | +0.175763% | −15.716023% | Fail |
| Lake FPS | +0.007976% | −27.715539% | Fail |
| Lake main-thread median time | −0.746268% | −19.526628% | Pass |

All six incremental checks passed; only three of six frozen-reference checks passed. Keep these separate. Heap API precision, shared browser processes and unobserved external GPU activity limit interpretation. Values are measurements from the retained comparison, not portable device promises or isolated causal estimates. Physical-phone and whole-campus fidelity acceptance remain open.

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
