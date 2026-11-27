export const topPages=['home','sobre-o-autor','saiba-mais'];
export const sidePages=['explorar','garagem','inventario','galeria','acervo-fotografico','sobre'];
export function getPage(hash=location.hash){
 const id=hash.replace(/^#\/?/,'').replace(/\/$/,'');
 const page=({'':'home','inicio':'home','about-author':'sobre-o-autor'})[id]||id;
 return [...topPages,...sidePages].includes(page)?page:'home';
}
