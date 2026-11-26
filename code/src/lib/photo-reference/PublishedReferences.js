import catalog from './ReferenceCatalog.json';
import {components} from './PhotoSchema.js';
export const referenceCatalog=Object.freeze(catalog);
export const referenceComponents={...components,Body:'Carroceria',Wheels:'Rodas',Headlights:'Faróis',Mirrors:'Retrovisores',FrontBumper:'Para-choque dianteiro',RearLights:'Lanternas',RearBumper:'Para-choque traseiro',Trunk:'Porta-malas'};
export function referenceUrl(asset){return import.meta.env.BASE_URL+asset.path.replace(/^code\/public\//,'')}
export function matchesReference(row,filter){return !filter||filter==='source:real'&&row.dataset==='VectraReal20261126'||filter==='source:external'&&row.origin!=='Própria'&&!row.dataset||filter.startsWith('perspective:')&&row.perspective===filter.slice(12)||filter.startsWith('quality:')&&row.quality?.includes(filter.slice(8))||filter.startsWith('review:')&&row.approval===filter.slice(7)||filter.startsWith('reconstruction:')&&row.reconstructionStatus===filter.slice(15)||(filter.startsWith("group:")?row.categories.some(t=>t.startsWith(filter.slice(6)+" / ")):row.categories.includes(filter)||row.components.includes(filter))}
