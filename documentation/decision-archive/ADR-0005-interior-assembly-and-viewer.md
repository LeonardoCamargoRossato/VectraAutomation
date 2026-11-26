# ADR-0005 — V5.2 structural assemblies and reference viewer

Status: proposed in PR #8; activation requires structural/visual review and CI.

Decision: preserve VectraStock.glb; derive component anchors from actual stock dashboard, wheel, carpet and seats; add independent assemblies in normalized vehicle coordinates. Suppress identified conflicting stock pedal and sunroof pieces, not arbitrary mesh names. Keep original asset and V5.1 read-only comparator. On legacy scene restore, carry over materials/textures where identifiable, not V5.1 structural offsets. Existing custom GLBs are not rebuilt. This is a procedural approximation, not measured CAD or a claim of engineering correctness.

Use the Foton ImageZoomDialog carousel control order and modal behavior in a reusable, dependency-free React viewer for public references and authorized local originals. Published cards use strict viewport WebP; detailed PNG is requested only when opening. No change to original assets, hashes or private IndexedDB boundary. Virtual capture gallery remains separate.

Risks: legacy custom interior transformations are intentionally superseded when migrating; AABB proximity does not guarantee real surface contact or absence of unwanted intersections; stock mesh semantics may require refinement; no sunroof closure claim until visually inspected; source rights remain unverified. Rollback: revert PR before publication, preserve GLB and reference catalog asset paths.
