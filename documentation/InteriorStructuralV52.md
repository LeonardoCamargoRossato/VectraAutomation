# V5.2 Interior structural reconstruction and gallery

Status: candidate, not visually accepted. Baseline fd20971e152bba364ec910c908d45f0586c95b3b.

References reviewed: three published interior photos (DashboardSteering, AutomaticSelector, FrontCabin), Foton code/src/components/viewers/ImageZoomDialog.tsx on main, LCR Asset Organization Standard v1.2 (Drive). External cross-check: https://www.opelbook.ru/en/vectra/B/body/interior/panel-priborov-snyatie-i-ustanovka ; https://www.opelbook.ru/en/vectra/B/main/manual/organy-upravleniya-i-kontrolnye-pribory ; https://www.clubedovectra.com.br/forum/viewtopic.php?p=187298 ; https://www.folhadelondrina.com.br/carro-e-cia/sofisticacao-e-o-destaque-do-vectra-com-cambio-automatico-264094.html .

The dashboard photo contains a manual lever, whereas the selector and wide cabin photos show automatic transmission. The automatic selector reference governs this model. The open upper pocket is based on the owner's explicit configuration, not a claim about all CD variants.

The original GLB and all original/optimized photographs remain unchanged. Structural assemblies are derived at load from stock dashboard, wheel, carpet and seat bounds, with a report of missing anchors. V5.1 remains a read-only comparison route. Old interior transformations are replaced by the new assembly coordinates; material/texture data is migrated by stable mesh name where possible. New V5.2 scenes retain edited transforms. Stock suppressed components cannot be resurrected by old saved visibility. The gallery uses a reusable modal and viewport-gated WebP, PNG only on opening, no new dependencies.

Quality gates: unit/browser/build/naming/audit, measured AABB gaps (not a collision or engineering certification), real stock anchor detection, roof closure and seat supports, 12 matched before/after views. Manual screenshot review still required: AABB proximity cannot establish visible mounting quality, absence of intersections or photographic fidelity. No merge solely on this report. Rights of source photos/model remain unverified; no new external image redistribution.
