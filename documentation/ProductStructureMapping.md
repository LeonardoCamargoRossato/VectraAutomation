# Product structure mapping

Stable route IDs remain unchanged. Paths below are canonical; only pages with static assets have directories.

| Stable ID | EN-US menu | Implementation | Static assets |
|---|---|---|---|
| home | Home (top) | code/src/pages/home/HomePage.jsx | top-menu/home/webp/VectraHeroTriptych.webp; png/VectraHeroTriptych.png; svg/VectraHeroTriptych.svg; svg/VectraTwin.svg (archived alternative) |
| sobre-o-autor | About the Author (top) | code/src/pages/about-author/AboutAuthorPage.jsx | top-menu/about-author/webp/AuthorProfile.webp |
| saiba-mais | Learn More (top) | code/src/pages/learn-more/LearnMorePage.jsx | None |
| shared | Header, locale, footer | code/src/components/layout/; code/src/components/navigation/ | top-menu/shared/branding/svg/; top-menu/shared/language/svg/ |
| explorar | Explore Vectra | code/src/pages/Viewer.jsx | side-menu/explore-vectra/models/ModelCatalog.json; models/glb/VectraStock.glb |
| garagem | My Garage | code/src/pages/Garage.jsx; code/src/lib/garage/ | Shared stock GLB; private IndexedDB |
| inventario | Inventory | code/src/pages/Inventory.jsx | Authorized Sheets at runtime; no static assets |
| galeria | Gallery | code/src/pages/Gallery.jsx | Private IndexedDB; no static assets |
| acervo-fotografico | Photo Library | code/src/pages/PhotoLibrary.jsx; code/src/lib/photo-reference/ | side-menu/photo-library/{interior,exterior}/; interior/real-vehicle/; private imports remain local |
| sobre | About the Project | code/src/Main.jsx | None |

Asset root: code/public/assets/. Canonical catalogs: [AssetInventory.json](AssetInventory.json), its referenced model and photo catalogs. [AssetMigrationMap.json](AssetMigrationMap.json) is historical migration evidence, not a competing inventory. Old public paths are temporarily retained for validation and authorized cleanup.

`assets-novos/.gitkeep` is the empty intake directory marker, not a production asset.

## V7.2 Home additions

- `top-menu/home/png/VectraExplorerExterior.png` and `top-menu/home/webp/VectraExplorerExterior.webp`: real V7.1 deployed stock simulator crop, recorded in AssetInventory.json.
- `top-menu/shared/language/svg/FlagUs.svg`: existing LCR template flag; no duplicate author image.
- `homeArtwork` in ProjectContent.js is the single editable artwork record; the Home uses WebP, the shared ReferenceImageViewer opens the matching PNG on demand, and SVG remains archived. Home hides the rail only when collapsed; all legacy routes remain valid.
