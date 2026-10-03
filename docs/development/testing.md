# Maintained tests

Run `npm run setup` before `npm test`. The explicit list in `app/tests/suite.json` is the public regression suite; the runner uses that list even when a maintainer's workspace also contains historical research scripts.

The suite covers rendering routes, texture/material handling, visibility and ordered instance transfers, lossless scene decoding, upload budgets, shader startup, deferred builder data, shared pages, camera framing and selected current model repairs. Packaging tests check that the release projection preserves the source scene's values and ordering. Fixtures required by these tests are committed with them.

Tests exercise a defined scope. Mock WebGL checks do not establish rendered quality, frame rate, physical-phone behavior or reference fidelity. The actual scene's retained visual and performance review is described in [performance](performance.md) and [model status](model-status.md).

## Historical research checks

The local research collection also contains hundreds of per-stage comparison scripts. Many reconstruct old components, old campus feature coordinates or an intermediate module order. They are not copied into the public suite automatically. Their source, fixtures and failed results remain in the local evidence archive.

The historical collection has unresolved failures and has not been declared passing. Examples include obsolete parcel/height expectations, historical whole-stream digests affected by later repairs, and scene fixtures that omit dependencies added afterward. These checks need individual migration before being used as current regression gates; their omission does not establish equivalent coverage or acceptance of the affected buildings.

Portable startup and decoder tests retain the current scan-texture dependency and the single compressed-response read. The north-building window test keeps its old digest on an explicit pre-ground-extension control, then verifies the current extension separately. Do not replace historical digests or loosen tolerances merely to make a test pass.

The winter-foliage fixture keeps its original checksum. A test-only adapter adds the later scan-texture binding to the control trace; all foliage decisions and draw ordering still compare against the unchanged fixture and the live renderer method.

When adding a public regression, include it in `suite.json`, allow the file and its dependencies in `.gitignore`, and run it from a clean checkout with the packaged assets. Keep machine reports, absolute personal paths, development photos and intermediate captures outside Git.
