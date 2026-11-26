import {metadata,suggest,MAX_PHOTO,MAX_BATCH,MAX_EXPANDED,parseManifest,hashValid} from './PhotoSchema.js';
import {unpackZip} from './SafeZip.js';
function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open('vectra-photo-references',1);r.onupgradeneeded=()=>{r.result.createObjectStore('photos',{keyPath:'photoId'});r.result.createObjectStore('blobs',{keyPath:'id'})};r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();resolve(r.result)};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Feche outras abas'))})}
async function tx(stores,mode,fn){const db=await open();return new Promise((resolve,reject)=>{const t=db.transaction(stores,mode);let result;try{fn(t,x=>{result=x})}catch(e){t.abort();db.close();reject(e);return}t.oncomplete=()=>{db.close();resolve(result)};t.onabort=()=>{db.close();reject(t.error||Error('Transação interrompida'))};t.onerror=()=>{}})}
export const listPhotos=()=>tx(['photos'],'readonly',(t,done)=>{t.objectStore('photos').getAll().onsuccess=e=>done(e.target.result)});
export const getPhoto=id=>tx(['photos'],'readonly',(t,done)=>{t.objectStore('photos').get(id).onsuccess=e=>done(e.target.result)});
export const getBlob=id=>tx(['blobs'],'readonly',(t,done)=>{t.objectStore('blobs').get(id).onsuccess=e=>done(e.target.result?.blob)});
export const updatePhoto=row=>tx(['photos'],'readwrite',(t,done)=>{const s=t.objectStore('photos');s.get(row.photoId).onsuccess=e=>{if(!e.target.result){t.abort();return}const m=metadata({...e.target.result,...row});s.put(m);done(m)}});
export async function digest(blob){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),x=>x.toString(16).padStart(2,'0')).join('')}
async function prepare(file){if(file.size>MAX_PHOTO||file.size<12)throw Error('Imagem fora dos limites');const h=new Uint8Array(await file.slice(0,12).arrayBuffer());const type=h[0]===255&&h[1]===216?'image/jpeg':h[0]===137&&h[1]===80&&h[2]===78&&h[3]===71?'image/png':String.fromCharCode(...h.slice(0,4))==='RIFF'&&String.fromCharCode(...h.slice(8,12))==='WEBP'?'image/webp':null;if(!type)throw Error('Formato não permitido');const original=new Blob([file],{type}),id=await digest(original);if(await getPhoto(id))return null;const bitmap=await createImageBitmap(original);try{if(bitmap.width*bitmap.height>40000000)throw Error('Resolução excede 40 MP');const c=document.createElement('canvas'),scale=Math.min(1,600/Math.max(bitmap.width,bitmap.height));c.width=Math.max(1,Math.round(bitmap.width*scale));c.height=Math.max(1,Math.round(bitmap.height*scale));c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);const thumb=await new Promise((resolve,reject)=>c.toBlob(b=>b?.type==='image/webp'?resolve(b):reject(Error('WebP indisponível')),'image/webp',.82));const row=metadata({photoId:id,originalName:file.name,logicalName:file.name,...suggest(file.name),width:bitmap.width,height:bitmap.height,format:type,imported:new Date().toISOString()});return {row,original,thumb}}finally{bitmap.close()}}
export async function importBatch(files){let all=[];if(files.length>MAX_BATCH)throw Error('Limite de 100 arquivos');for(const file of files){if(/\.zip$/i.test(file.name))all.push(...await unpackZip(file));else all.push(file)}if(all.length>MAX_BATCH||all.reduce((n,f)=>n+f.size,0)>MAX_EXPANDED)throw Error('Lote excede limites');let added=0,duplicates=0,errors=[],manifests=[];for(const file of all){try{if(/\.json$/i.test(file.name)){if(file.size>2*1024*1024)throw Error('Manifesto muito grande');manifests.push(...parseManifest(await file.text()));continue}const p=await prepare(file);if(!p){duplicates++;continue}const inserted=await tx(['photos','blobs'],'readwrite',(t,done)=>{const photos=t.objectStore('photos');photos.get(p.row.photoId).onsuccess=e=>{if(e.target.result){done(false);return}photos.add(p.row);const s=t.objectStore('blobs');s.add({id:p.row.photoId,blob:p.original});s.add({id:p.row.photoId+':thumb',blob:p.thumb});done(true)}});if(inserted)added++;else duplicates++}catch(e){errors.push(file.name+': '+e.message)}}let matched=0;for(const m of manifests){const old=await getPhoto(m.photoId);if(old){await updatePhoto({...old,logicalName:m.logicalName||old.logicalName,categories:m.categories,components:m.components,perspective:m.perspective,notes:m.notes,author:m.author,license:m.license,origin:m.origin,classification:'Manifesto importado — revisão humana necessária',approval:'Aguardando revisão',rights:old.rights});matched++}}return {added,duplicates,matched,errors}}

/** Prepared private batches are not public assets. Validate all entries before committing each batch. */
export async function importPreparedDataset(files,onProgress=()=>{}){
 if(!files.length||files.length>4)throw Error('Selecione de 1 a 4 lotes V6.1');
 let added=0,duplicates=0,processed=0;
 for(const file of files){
  if(!/\.zip$/i.test(file.name))throw Error('O lote preparado deve ser ZIP');
  const entries=await unpackZip(file),byName=new Map(entries.map(f=>[f.name,f]));
  if(byName.size!==entries.length)throw Error('Nomes de arquivo duplicados');
  const manifest=byName.get('PhotoInventory.json');
  if(!manifest||manifest.size>2*1024*1024)throw Error('Inventário ausente ou inválido');
  const data=JSON.parse(await manifest.text());
  if(data.format!=='VectraPreparedDataset'||data.schema!==1||!Array.isArray(data.photos)||!data.photos.length||data.photos.length>14||entries.length!==data.photos.length*2+1)throw Error('Formato de lote preparado inválido');
  const staged=[],ids=new Set(),names=new Set(),sourceIds=new Set();
  for(const x of data.photos){
   if(!x||x.dataset!=='VectraReal20261126'||!/^VectraReal(?:0[1-9]|[1-4][0-9]|5[0-6])$/.test(x.assetId)||!hashValid(x.sourceSha256)||sourceIds.has(x.sourceSha256))throw Error('Identidade de fotografia inválida');
   const pngName=x.assetId+'.png',webpName=x.assetId+'.webp',png=byName.get(pngName),webp=byName.get(webpName);
   if(!png||!webp||names.has(pngName)||names.has(webpName)||x.png?.name!==pngName||x.webp?.name!==webpName||x.photoId!==x.png.sha256||ids.has(x.photoId)||!hashValid(x.photoId)||!hashValid(x.webp.sha256))throw Error('Par PNG/WebP inválido');
   names.add(pngName);names.add(webpName);ids.add(x.photoId);sourceIds.add(x.sourceSha256);
   if(png.size!==x.png.bytes||webp.size!==x.webp.bytes||await digest(png)!==x.photoId||await digest(webp)!==x.webp.sha256)throw Error('SHA-256 ou tamanho divergente: '+x.assetId);
   const ph=new Uint8Array(await png.slice(0,12).arrayBuffer()),wh=new Uint8Array(await webp.slice(0,12).arrayBuffer());
   if(![137,80,78,71,13,10,26,10].every((n,i)=>ph[i]===n)||String.fromCharCode(...wh.slice(0,4))!=='RIFF'||String.fromCharCode(...wh.slice(8,12))!=='WEBP')throw Error('Assinatura de imagem inválida');
   const original=new Blob([png],{type:'image/png'}),thumb=new Blob([webp],{type:'image/webp'});
   for(const [blob,expected,limit] of [[original,x.png,1600],[thumb,x.webp,600]]){
    const bitmap=await createImageBitmap(blob);
    try{if(bitmap.width!==expected.width||bitmap.height!==expected.height||Math.max(bitmap.width,bitmap.height)>limit||!bitmap.width||!bitmap.height)throw Error('Dimensões divergentes')}finally{bitmap.close()}
   }
   if(x.width!==x.png.width||x.height!==x.png.height)throw Error('Dimensões do catálogo divergentes');
   const row=metadata({...x,originalName:pngName,origin:'Própria',rights:'Uso local autorizado',approval:'Aguardando revisão',format:'image/png',detailSha256:x.photoId,previewSha256:x.webp.sha256,imported:new Date().toISOString()});
   staged.push({row,original,thumb});
  }
  const count=await tx(['photos','blobs'],'readwrite',(t,done)=>{
   const photos=t.objectStore('photos'),blobs=t.objectStore('blobs');let inserted=0,remaining=staged.length;
   for(const item of staged)photos.get(item.row.photoId).onsuccess=e=>{if(!e.target.result){photos.add(item.row);blobs.add({id:item.row.photoId,blob:item.original});blobs.add({id:item.row.photoId+':thumb',blob:item.thumb});inserted++}if(--remaining===0)done(inserted)};
  });
  added+=count;duplicates+=staged.length-count;processed+=staged.length;onProgress({added,duplicates,processed});
 }
 return {added,duplicates,processed,errors:[]};
}
