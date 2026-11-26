import * as T from 'three';
export const environmentNames=['Estúdio','Oficina','Estacionamento'];
export function validEnvironment(name){return environmentNames.includes(name)?name:'Estúdio'}
function concrete(){const size=256,c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d'),im=ctx.createImageData(size,size);let seed=2819;for(let y=0;y<size;y++)for(let x=0;x<size;x++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const g=139+((seed>>>24)-128)*.17+7*Math.sin(x*.09)*Math.cos(y*.12);const i=(y*size+x)*4;im.data[i]=g;im.data[i+1]=g-2;im.data[i+2]=g-5;im.data[i+3]=255}ctx.putImageData(im,0,0);ctx.strokeStyle='#77766f';ctx.lineWidth=1;ctx.strokeRect(.5,.5,255,255);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(9,9);return t}
function contact(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,8,64,64,62);g.addColorStop(0,'rgba(0,0,0,.72)');g.addColorStop(.55,'rgba(0,0,0,.32)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c)}
export function createEnvironment(requested){const name=validEnvironment(requested),group=new T.Group();group.name='Environment:'+name;const mats=new Map(),geos=new Map(),textures=[];let count=0;
function mat(color,roughness=.8,metalness=0,extra={}){const key=JSON.stringify([color,roughness,metalness,extra.map?.uuid,extra.emissive,extra.emissiveIntensity]);if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness,metalness,...extra}));return mats.get(key)}
function box(w,h,d,x,y,z,m,shadow=false){const key=[w,h,d].join(',');if(!geos.has(key))geos.set(key,new T.BoxGeometry(w,h,d));const o=new T.Mesh(geos.get(key),m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=shadow;group.add(o);count++;return o}
const white=mat('#dce0de',.45,0,{emissive:'#ecf6ff',emissiveIntensity:2.2}),steel=mat('#454e54',.53,.55),dark=mat('#242b30'),yellow=mat('#cba747'),wall=mat('#898a83'),stripe=mat('#d7d2be');
const tex=concrete();textures.push(tex);const floor=new T.Mesh(new T.PlaneGeometry(28,28),mat(name==='Estúdio'?'#d7d8d8':'#b1b0aa',.92,0,{map:tex}));floor.rotation.x=-Math.PI/2;floor.position.y=-.019;floor.receiveShadow=true;group.add(floor);
const sh=contact();textures.push(sh);const contactMesh=new T.Mesh(new T.PlaneGeometry(3.4,5.5),new T.MeshBasicMaterial({map:sh,transparent:true,opacity:.62,depthWrite:false,toneMapped:false}));contactMesh.rotation.x=-Math.PI/2;contactMesh.position.y=-.009;group.add(contactMesh);
function lamp(x,z,y=4.2){box(2.6,.12,.34,x,y,z,steel);box(2.38,.035,.24,x,y-.08,z,white)}
function wallSegment(x,z,w,d,h=4.5){box(w,h,d,x,h/2,z,wall);box(w,.75,d+.02,x,.375,z,dark);box(w,.11,d+.04,x,1.02,z,yellow)}
if(name==='Estúdio'){const m=mat('#c7cbce',.9);box(24,5,.15,0,2.5,-12,m);for(const x of [-7,7]){box(.1,3,4.4,x,2.1,0,white)}lamp(0,-3,5);lamp(0,3,5)}
if(name==='Oficina'){
 wallSegment(0,-10,22,.22);wallSegment(-10,0,.22,20);wallSegment(10,0,.22,20);
 const shutter=mat('#6c7479',.52,.55);box(5.4,3.4,.15,0,1.7,-9.83,shutter);for(let i=0;i<20;i++)box(5.3,.035,.12,0,.12+i*.165,-9.72,dark);for(const x of [-2.8,2.8])box(.14,3.7,.3,x,1.85,-9.67,steel);
 const cabinet=mat('#8e2928',.58,.25),wood=mat('#8a7761');box(4.2,.12,.84,-5.5,1.1,-9.1,wood,true);for(const x of [-7.4,-3.6])box(.12,1.1,.76,x,.55,-9.1,steel,true);box(3.3,.95,.72,-5.5,.53,-9.14,cabinet,true);for(let i=0;i<5;i++){box(3.15,.016,.025,-5.5,.15+i*.17,-8.76,dark);box(.7,.045,.065,-5.5,.21+i*.17,-8.70,steel)}
 box(4.2,1.6,.12,-5.5,2.05,-9.66,dark);for(let i=0;i<12;i++){const x=-7.15+i*.30;box(.065,.45+(i%4)*.1,.055,x,2.05+(i%3)*.1,-9.56,steel);box(.17,.07,.06,x,1.8+(i%3)*.1,-9.52,yellow)}
 for(let i=0;i<3;i++){box(.78,2.1,.65,5.3+i*.88,1.05,-9.1,steel,true);box(.72,1.94,.025,5.3+i*.88,1.08,-8.76,mat('#7f8b8e',.64,.45));box(.045,.28,.08,5.53+i*.88,1.08,-8.72,dark)}
 const tireGeo=new T.TorusGeometry(.29,.105,12,28);geos.set('tire',tireGeo);for(let i=0;i<5;i++){const tire=new T.Mesh(tireGeo,dark);tire.rotation.x=Math.PI/2;tire.position.set(8.15,.11+i*.20,-7.6);group.add(tire);count++}
 for(const x of [-8,-3,3,8]){box(.17,.26,20,x,4.4,0,steel);for(const z of [-6,0,6])lamp(x,z)}
 for(const x of [-2.25,2.25]){box(.12,.008,7,x,-.006,0,yellow);for(let i=0;i<4;i++)box(.5,.009,.12,x,-.005,-3+i*2,yellow)}
}
if(name==='Estacionamento'){
 for(const z of [-10,10])wallSegment(0,z,24,.25,4);
 for(const x of [-9,-4.5,4.5,9])for(const z of [-8,0,8]){box(.65,4,.65,x,2,z,wall,true);box(.69,.68,.69,x,.34,z,dark);box(.70,.16,.70,x,.78,z,yellow)}
 for(const x of [-7,-2.3,2.3,7])box(.09,.01,5.8,x,-.006,0,stripe);box(14,.01,.1,0,-.005,-3,stripe);
 for(const z of [-8,-4,0,4,8]){box(22,.28,.35,0,4.15,z,steel);for(const x of [-6,0,6])lamp(x,z,3.95)}
}
const background=name==='Estúdio'?'#c7cbce':name==='Oficina'?'#777d80':'#828c94';
return {name,group,background,meshCount:count+2,dispose(){group.removeFromParent();group.traverse(o=>{if(o===floor||o===contactMesh){o.geometry.dispose();if(o===contactMesh)o.material.dispose()}});for(const g of geos.values())g.dispose();for(const m of mats.values())m.dispose();for(const t of textures)t.dispose()}};
}
