function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open('vectra-gallery-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('captures',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function operation(mode,fn){const db=await open();return new Promise((resolve,reject)=>{const t=db.transaction('captures',mode);let r;try{r=fn(t.objectStore('captures'))}catch(e){db.close();reject(e);return}t.oncomplete=()=>{db.close();resolve(r.result)};t.onerror=()=>{db.close();reject(t.error)};t.onabort=()=>{db.close();reject(t.error)}})}
export const addCapture=v=>operation('readwrite',s=>s.put(v));
export const listCaptures=()=>operation('readonly',s=>s.getAll());
export const removeCapture=id=>operation('readwrite',s=>s.delete(id));
export function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
