import catalog from './ReferenceCatalog.json';
import {components} from './PhotoSchema.js';
export const referenceCatalog=Object.freeze(catalog);
export const referenceComponents={...components,Body:'Carroceria',Wheels:'Rodas',Headlights:'Faróis',Mirrors:'Retrovisores',FrontBumper:'Para-choque dianteiro',RearLights:'Lanternas',RearBumper:'Para-choque traseiro',Trunk:'Porta-malas'};
export function referenceUrl(asset){return import.meta.env.BASE_URL+asset.path.replace(/^code\/public\//,'')}
export function matchesReference(row,filter){return !filter||row.categories.includes(filter)||row.components.includes(filter)}
