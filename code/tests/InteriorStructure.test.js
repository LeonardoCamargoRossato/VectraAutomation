import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {roleFor} from '../src/lib/AutomotiveMaterials.js';
import {addStructuralInterior,connectionGap} from '../src/lib/interior/InteriorStructure.js';

test('connection distance distinguishes disconnected and intersecting bounds',()=>{
 const a=new T.Mesh(new T.BoxGeometry(1,1,1)),b=new T.Mesh(new T.BoxGeometry(1,1,1));
 b.position.x=2;b.updateMatrixWorld();assert.equal(connectionGap(a,b),1);
 b.position.x=.9;b.updateMatrixWorld();assert.equal(connectionGap(a,b),0);
});
test('stock GLB structural diagnostic (CPU geometry, not visual certification)',async()=>{
 const source=fs.readFileSync(new URL('../public/assets/side-menu/explore-vectra/models/glb/VectraStock.glb',import.meta.url));
 const jsonLength=source.readUInt32LE(12),data=JSON.parse(source.toString('utf8',20,20+jsonLength));
 // Strip image/texture references for CPU-only Node test; original bytes are never modified.
 const strip=o=>{if(!o||typeof o!=='object')return;for(const k of Object.keys(o)){if(/texture$/i.test(k))delete o[k];else strip(o[k])}};
 for(const material of data.materials||[])strip(material);
 delete data.images;delete data.textures;delete data.samplers;
 const js=Buffer.from(JSON.stringify(data)),aligned=Buffer.alloc((js.length+3)&~3,32);js.copy(aligned);
 const binary=source.subarray(20+jsonLength),header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(20+aligned.length+binary.length,8);header.writeUInt32LE(aligned.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const bytes=Buffer.concat([header,aligned,binary]);const oldDocument=globalThis.document;globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)})})};
 try{
  const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
  const root=gltf.scene,bb=new T.Box3().setFromObject(root),s=bb.getSize(new T.Vector3()),c=bb.getCenter(new T.Vector3()),f=4.45/Math.max(s.x,s.y,s.z);
  root.scale.multiplyScalar(f);root.position.sub(c.multiplyScalar(f));root.position.y+=s.y*f/2;
  root.traverse(o=>{if(o.isLine)o.visible=false;if(o.isMesh&&!Array.isArray(o.material)){const role=roleFor(o.material.name,o.parent?.name||'');o.userData.automotiveRole=role;if(role==='proxy')o.visible=false}});
  const result=addStructuralInterior(root);console.log('STOCK_STRUCTURE_REPORT '+JSON.stringify(result.report));
  assert.ok(result.count>40);assert.equal(result.report.revision,3);assert.ok(result.report.dashAnchor&&result.report.wheelAnchor&&result.report.carpetAnchor);assert.ok(result.report.links.every(x=>typeof x.gap==='number'&&x.gap<=.045));assert.ok(result.report.seatSupports.length>=6&&result.report.seatSupports.every(s=>s.attached||s.added));assert.equal(result.group.getObjectByName('ClosedHeadliner'),undefined);
 }finally{globalThis.document=oldDocument}
});
