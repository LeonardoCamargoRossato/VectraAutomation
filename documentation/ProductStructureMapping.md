# Product structure mapping
| ID estável | Menu | Código | Asset |
|---|---|---|---|
| explorar | Explorar Vectra | code/src/pages/Viewer.jsx | code/public/assets/explorar/ModelCatalog.json |
| garagem | Minha Garagem | code/src/pages/Garage.jsx; code/src/lib/garage/ | IndexedDB privado; GLB stock compartilhado; miniaturas locais |
| inventario | Inventário | code/src/pages/Inventory.jsx | Google autorizado em runtime; sem cópia pública |
| galeria | Galeria | code/src/pages/Gallery.jsx | IndexedDB privado no navegador |
| acervo-fotografico | Acervo Fotográfico | code/src/pages/PhotoLibrary.jsx; code/src/lib/photo-reference/ | Referências estáticas: code/src/lib/photo-reference/ReferenceCatalog.json → code/public/assets/acervo-fotografico/{interior,exterior}/{webp,png}; originais em documentation/asset-source/acervo-fotografico; novas importações: IndexedDB privado |
| sobre | Sobre o Projeto | code/src/Main.jsx | sem assets |
