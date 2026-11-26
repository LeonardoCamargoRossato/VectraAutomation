import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export const defaultPaint='#18191b';
export const qualityProfiles={Econômico:{pixel:1,shadow:512},Equilibrado:{pixel:1.5,shadow:1024},'Alta qualidade':{pixel:2,shadow:2048},Fotografia:{pixel:2.5,shadow:2048}};
export function roleFor(name,parent=''){
 if(name==='vectra')return 'paint';
 if(name==='vectra_glass')return parent.includes('headlight')?'headlightLens':'glass';
 if(name==='vectra_headlight')return parent.includes('door')?'mirror':'headlight';
 if(name==='vectra_taillight')return 'tailLens';
 if(name==='taillightrefl')return 'tailReflector';
 if(name==='seats')return 'suede';
 if(name==='dash')return 'dashboard';
 if(/steer/i.test(name))return 'steering';
 if(name==='intcarpet')return 'carpet';
 if(/doorinner|sunroofinner/.test(name))return 'lining';
 if(name==='tyre')return 'tyre';
 if(name==='alloy15')return 'rim';
 if(/chrome|chro|silver|mirror|exhaust/i.test(name))return 'metal';
 if(name==='numplate')return 'plate';
 if(name==='sideindicator')return 'indicator';
 if(name==='material_0'||name==='ignoreme')return 'proxy';
 return 'trim';
}
const settings={
 paint:{color:defaultPaint,metalness:.42,roughness:.29,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.15},
 glass:{color:'#a0b2bb',roughness:.075,metalness:0,transparent:true,opacity:.23,depthWrite:false,clearcoat:1,clearcoatRoughness:.07,side:T.DoubleSide},
 headlightLens:{color:'#e5eff8',roughness:.08,metalness:0,transparent:true,opacity:.20,depthWrite:false,clearcoat:1},
 headlight:{color:'#a8adb4',metalness:.88,roughness:.23,emissive:'#fff1d0',emissiveIntensity:0},
 tailLens:{color:'#950d1c',metalness:.05,roughness:.17,transparent:true,opacity:.76,depthWrite:false,clearcoat:1},
 tailReflector:{color:'#7b1220',metalness:.38,roughness:.32,emissive:'#ff1726',emissiveIntensity:0},
 suede:{color:'#17212e',metalness:0,roughness:.95,sheen:.9,sheenColor:'#344557',sheenRoughness:.9,envMapIntensity:.35},
 dashboard:{color:'#24272a',metalness:0,roughness:.87,envMapIntensity:.42},
 steering:{color:'#151719',metalness:0,roughness:.83,envMapIntensity:.45},
 carpet:{color:'#191c22',metalness:0,roughness:1,envMapIntensity:.25},
 lining:{color:'#242a33',metalness:0,roughness:.93,envMapIntensity:.3},
 tyre:{color:'#17191b',metalness:0,roughness:.93,envMapIntensity:.32},
 rim:{color:'#bcc2c9',metalness:.78,roughness:.35,envMapIntensity:1.15},
 metal:{color:'#aeb6bf',metalness:.78,roughness:.32},
 mirror:{color:'#d3dbe4',metalness:1,roughness:.12},
 plate:{color:'#b5b8bd',metalness:.08,roughness:.68},
 indicator:{color:'#d58b31',metalness:.08,roughness:.26,clearcoat:.8},
 trim:{color:'#25282b',metalness:0,roughness:.8}
};
function suedeNormal(){const s=64,bytes=new Uint8Array(s*s*4);let seed=713;for(let i=0;i<s*s;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;bytes[i*4]=112+(seed&31);bytes[i*4+1]=112+((seed>>>8)&31);bytes[i*4+2]=253;bytes[i*4+3]=255}const tex=new T.DataTexture(bytes,s,s,T.RGBAFormat);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(16,16);tex.magFilter=T.LinearFilter;tex.minFilter=T.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.needsUpdate=true;return tex}
function plateTexture(){const c=document.createElement('canvas');c.width=256;c.height=80;const ctx=c.getContext('2d');ctx.fillStyle='#d6d8da';ctx.fillRect(0,0,256,80);ctx.fillStyle='#243a65';ctx.fillRect(0,0,256,13);ctx.font='bold 32px sans-serif';ctx.textAlign='center';ctx.fillStyle='#171b20';ctx.fillText('VECTRA',128,54);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.flipY=false;return t}
// Rebuild only alloy mesh in source-local Z-up coordinates; preserve axle, tire and all body vertices.
function fiveSpoke(source){source.computeBoundingBox();const b=source.boundingBox,c=b.getCenter(new T.Vector3()),s=b.getSize(new T.Vector3()),r=Math.min(s.y,s.z)*.5;if(!Number.isFinite(r)||r<=0)return null;const sign=Math.sign(c.x)||1,face=sign>0?b.max.x:b.min.x,depth=Math.min(s.x,.055),parts=[];
 const ring=new T.LatheGeometry([new T.Vector2(r*.82,-depth),new T.Vector2(r*.82,0),new T.Vector2(r*.98,0),new T.Vector2(r, -depth),new T.Vector2(r*.82,-depth)],48);ring.rotateZ(-sign*Math.PI/2);ring.translate(face,c.y,c.z);parts.push(ring.toNonIndexed());
 const hub=new T.CylinderGeometry(r*.29,r*.32,depth,32);hub.rotateZ(Math.PI/2);hub.translate(face-sign*depth/2,c.y,c.z);parts.push(hub.toNonIndexed());
 for(let i=0;i<5;i++){const shape=new T.Shape();shape.moveTo(r*.19,-r*.115);shape.lineTo(r*.89,-r*.08);shape.lineTo(r*.89,r*.08);shape.lineTo(r*.19,r*.115);shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:depth*.6,bevelEnabled:true,bevelThickness:r*.018,bevelSize:r*.018,bevelSegments:2,steps:1});g.translate(0,0,-depth*.6);g.rotateY(sign*Math.PI/2);g.rotateX(i*Math.PI*2/5);g.translate(face,c.y,c.z);parts.push(g.index?g.toNonIndexed():g)}
 const geo=mergeGeometries(parts);parts.forEach(g=>g.dispose());ring.dispose();hub.dispose();return geo}
export function upgradeAutomotive(root){const normal=suedeNormal(),plate=plateTexture();let wheels=0,paints=0,hidden=0;root.traverse(o=>{if(o.isLine){o.visible=false;hidden++;return}if(!o.isMesh)return;const old=o.material;if(Array.isArray(old))return;const name=old.name,parent=o.parent?.name||'',role=roleFor(name,parent);o.userData.automotiveRole=role;
 if(role==='proxy'){o.visible=false;hidden++;return}
 if(role==='rim'){const g=fiveSpoke(o.geometry);if(g){o.geometry.dispose();o.geometry=g;wheels++}}
 if(name==='chrome'&&parent.startsWith('wheel_')){o.visible=false;return}
 if(role==='paint')paints++;
 const definition=settings[role]??settings.trim;const props={...definition,name,side:definition.side??old.side};
 if(role==='suede'&&o.geometry.attributes.uv){props.normalMap=normal;props.normalScale=new T.Vector2(.17,.17)}
 if(role==='plate'&&o.geometry.attributes.uv){props.map=plate;props.color='#ffffff'}
 if(role==='glass'||role.endsWith('Lens')){o.castShadow=false;o.renderOrder=3}
 o.material=new T.MeshPhysicalMaterial(props);old.dispose();
 });return {wheels,paints,hidden,normal,plate}}
export function lampRole(o){const p=o.parent?.name||'';if(o.userData.automotiveRole==='headlight'&&(p.includes('headlight')||p==='vectra_bumper_F'))return 'front';if(o.userData.automotiveRole==='tailReflector')return 'rear';return null}
