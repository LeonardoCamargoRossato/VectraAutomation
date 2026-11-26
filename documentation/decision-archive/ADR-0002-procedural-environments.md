# ADR-0002 — Procedural environments and capture feedback
Status: implemented pending validation.
Decision: use existing Three.js, procedural environment modules and Web Audio, one active scene and PMREM at a time, no third-party assets or service. IndexedDB remains photo source of truth; localStorage only preferences. Alternatives: panorama alone (perspective limitations), external HDRI/GLB (extra transfer/license), full city (GPU cost). Reversible through Git; no GLB rewrite. Evidence: AutomotiveRealismV3.md and CI artifacts.
