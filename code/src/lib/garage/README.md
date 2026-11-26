# Garage — local vehicle persistence
| Arquivo ou pasta | Descrição sucinta | Descrição detalhada |
|---|---|---|
| GarageSchema.js | Schema versionado | Validação, migração, identidade, exportação e importação JSON. |
| GarageStore.js | Persistência | IndexedDB, transação de revisão, autosave, armazenamento de GLB local e recuperação. |
Não contém UI nem credenciais. Testes: Garage.test.js e Garage.spec.js.
