# Product structure mapping
| ID estável | Menu | Código | Asset |
|---|---|---|---|
| explorar | Explorar Vectra | code/src/pages/Viewer.jsx | code/public/assets/explorar/ModelCatalog.json |
| garagem | Minha Garagem | code/src/pages/Garage.jsx; code/src/lib/garage/ | IndexedDB privado; GLB stock compartilhado; miniaturas locais |
| inventario | Inventário | code/src/pages/Inventory.jsx | Google autorizado em runtime; sem cópia pública |
| galeria | Galeria | code/src/pages/Gallery.jsx | IndexedDB privado no navegador |
| acervo-fotografico | Acervo Fotográfico | code/src/pages/PhotoLibrary.jsx; code/src/lib/photo-reference/; code/src/components/viewers/ReferenceImageViewer.jsx | ReferenceCatalog.json; code/public/assets/acervo-fotografico/{interior,exterior}/{webp,png}/; JPEG fonte em documentation/asset-source/acervo-fotografico/; importações dinâmicas em IndexedDB privado |
| sobre | Sobre o Projeto | code/src/Main.jsx | sem assets |

| home | Início (superior) | code/src/pages/home/HomePage.jsx | vectra-twin |
| sobre-o-autor | Sobre o autor (superior) | code/src/pages/about-author/AboutAuthorPage.jsx | author-profile |
| saiba-mais | Saiba mais (superior) | code/src/pages/learn-more/LearnMorePage.jsx | textual, sem raster próprio |
| shared | Cabeçalho / idioma / rodapé | code/src/components/layout/; code/src/components/navigation/ | vectra-mark, flag-br |

Novos assets: [AssetInventory.json](AssetInventory.json). Catálogos existentes permanecem canônicos para fotos e GLB.
