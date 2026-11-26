# Product structure mapping
| ID estável | Menu | Código | Asset |
|---|---|---|---|
| explorar | Explorar Vectra | code/src/pages/Viewer.jsx | code/public/assets/explorar/ModelCatalog.json |
| garagem | Minha Garagem | code/src/pages/Garage.jsx; code/src/lib/garage/ | IndexedDB privado; GLB stock compartilhado; miniaturas locais |
| inventario | Inventário | code/src/pages/Inventory.jsx | Google autorizado em runtime; sem cópia pública |
| galeria | Galeria | code/src/pages/Gallery.jsx | IndexedDB privado no navegador |
| acervo-fotografico | Acervo Fotográfico | code/src/pages/PhotoLibrary.jsx; code/src/lib/photo-reference/ | IndexedDB privado, originais e miniaturas WebP por SHA-256; nenhum asset público |
| sobre | Sobre o Projeto | code/src/Main.jsx | sem assets |
