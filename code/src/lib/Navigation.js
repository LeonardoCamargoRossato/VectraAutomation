export const topPages=['home','sobre-o-autor','saiba-mais'];
export const sidePages=['explorar','garagem','inventario','galeria','acervo-fotografico','sobre'];
const routes={home:'home','sobre-o-autor':'about-author','saiba-mais':'learn-more',explorar:'explore-vectra',garagem:'my-garage',inventario:'inventory',galeria:'gallery','acervo-fotografico':'photo-library',sobre:'about-project'};
export const canonicalHash=id=>'#'+(routes[id]||'home');
export function getPage(hash=location.hash){const id=hash.replace(/^#\/?/,'').replace(/\/$/,'');const page=Object.keys(routes).find(k=>routes[k]===id)||({'':'home',inicio:'home'})[id]||id;return [...topPages,...sidePages].includes(page)?page:'home'}
