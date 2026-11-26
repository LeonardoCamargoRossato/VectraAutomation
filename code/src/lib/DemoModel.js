import * as T from 'three';
export function demoModel(){const g=new T.Group();g.name='Sedã esquemático';function box(name,x,y,z,w,h,d,color,extra={}){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color,roughness:.35,metalness:.2,...extra}));m.name=name;m.position.set(x,y,z);g.add(m);return m}
box('Carroceria',0,.8,0,1.8,.65,4.45,0x526477,{metalness:.55});
box('Capô',0,1.12,1.45,1.73,.15,1.3,0x526477);box('Porta-malas',0,1.12,-1.55,1.73,.15,.95,0x526477);
box('Teto',0,1.65,-.1,1.48,.14,1.8,0x526477);box('Vidros',0,1.38,-.1,1.45,.49,1.74,0x38546a,{transparent:true,opacity:.65});
for(const side of [-1,1]){box('Retrovisor '+side,side*1.02,1.28,.7,.25,.16,.22,0x526477);for(const z of [-1.39,1.39]){const m=new T.Mesh(new T.CylinderGeometry(.36,.36,.22,32),new T.MeshStandardMaterial({color:0x17191d}));m.rotation.z=Math.PI/2;m.position.set(side*.91,.38,z);m.name='Roda '+side+' '+z;g.add(m);const hub=new T.Mesh(new T.CylinderGeometry(.22,.22,.23,24),new T.MeshStandardMaterial({color:0x9ca5ad,metalness:.8,roughness:.28}));hub.rotation.z=Math.PI/2;hub.position.copy(m.position);hub.name='Aro '+side+' '+z;g.add(hub)}
box('Farol '+side,side*.63,.91,2.24,.46,.19,.06,0xe5ebff,{emissive:0xffffff,emissiveIntensity:0});box('Lanterna '+side,side*.68,.93,-2.24,.38,.2,.06,0xaa1717,{emissive:0xff1717,emissiveIntensity:0});box('Banco '+side,side*.42,1.1,.2,.5,.55,.55,0x454545)}
box('Placa fictícia',0,.75,-2.26,.45,.13,.04,0xeeeeee);return g}
