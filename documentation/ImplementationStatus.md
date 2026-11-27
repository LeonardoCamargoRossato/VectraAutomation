# Estado da implementação
Código inicial: viewer com GLB local e sedã esquemático, seleção de malha, transform controls, material, histórico, luzes, câmera de ré, capturas, galeria, inventário por OAuth sob configuração.
Não validado: fidelidade, interior real, edição de vértices, importação de GLB real, sincronização real, navegação mobile, desempenho, segurança final. Anexos DevelopmentPrompt.md e ArchitectureDecisionProposal.md do Vectra não encontrados; não substituir pelo template do NV. Site de referência indisponível via HTTP nesta sessão; código inspecionado. Nenhuma alteração na planilha ou no projeto de referência. Sem publicação, merge, backup Drive ou auditoria independente. 
OAuth: criar credencial Web no Google Cloud autorizado, ativar Sheets API, configurar origem http://localhost:5173 (e origem Pages somente após aprovação), consentimento e usuário de teste. Inserir Client ID e ID da planilha na interface. Escopo spreadsheets permite acesso às planilhas do usuário; autorização explícita exigida. Token apenas em memória e descartado ao desmontar inventário. Não publicar segredos. Testar primeiro em cópia privada com fórmulas e IDs, sem alterar fonte original.

## V7.1 — Asset migration candidate
The menu-based hierarchy was introduced on an isolated branch. Existing public assets were copied, original paths retained, and runtime/catalog references switched. No garage, photo IDs, routes, geometry, or locale behavior changed. Cleanup and full gates are pending; the approved triptych package was not available to this Builder. English-first localization is a separate pending PR.

## V7.1 — approved hero intake
Three Drawer image formats are imported and verified against the approved ZIP, the intake images removed, and an empty intake marker retained. Static Home integration uses WebP and on-demand PNG. SVG and previous VectraTwin.svg retained. Independent scene assets, full English localization, and final release gates remain pending.
