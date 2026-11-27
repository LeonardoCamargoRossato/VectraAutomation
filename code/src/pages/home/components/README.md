# Home artwork components

- VectraInteractiveHero.jsx: stable keyboard/touch/mouse trigger, catalog-provided dimensions and one image transform. Pointer movement schedules at most one animation frame; reduced-motion and touch disable motion.
- HeroMotion.js: bounded, pure pointer coordinate normalization and configurable defaults.
- HeroSceneViewer.jsx: thin adapter to the shared ReferenceImageViewer, not a separate lightbox.

Replace homeArtwork in ProjectContent.js with approved WebP/PNG/SVG paths, dimensions, alt and version. Keep old assets until approval. The source SVG is archival; preview only requests WebP, detail only requests PNG on expansion. Independent scenes may later each use the same component with separate artwork records; never crop the current triptych into pretend modules.
