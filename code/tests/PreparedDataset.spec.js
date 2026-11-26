import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
function crc32(b){let c=0xffffffff;for(const n of b){c^=n;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function zip(files){
 const chunks=[],central=[];let offset=0;
 for(const [name,body] of files){const n=Buffer.from(name),v=Buffer.from(body),h=Buffer.alloc(30),c=Buffer.alloc(46),crc=crc32(v);
 h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt32LE(crc,14);h.writeUInt32LE(v.length,18);h.writeUInt32LE(v.length,22);h.writeUInt16LE(n.length,26);
 c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt32LE(crc,16);c.writeUInt32LE(v.length,20);c.writeUInt32LE(v.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);
 chunks.push(h,n,v);central.push(c,n);offset+=h.length+n.length+v.length}
 const cd=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...chunks,cd,end])
}
function pack(rows,n,tamper=false){
 const files=[],photos=[];
 for(const [i,im] of rows.entries()){const num=(n-1)*14+i+1,id='VectraReal'+String(num).padStart(2,'0'),png=Buffer.from(im.png,'base64'),webp=Buffer.from(im.webp,'base64'),hash=sha(png),wh=sha(webp);
 photos.push({dataset:'VectraReal20261126',assetId:id,photoId:hash,sourceSha256:sha('synthetic-source-'+num),sourceName:'fixture-'+num+'.jpg',logicalName:'Fixture '+num,primaryComponent:'Dashboard',categories:['Interior / Painel'],components:['Dashboard'],perspective:'Frontal',quality:['Referência geométrica'],reconstructionStatus:'Referência candidata',modelVersion:'V6.1',width:32,height:32,png:{name:id+'.png',sha256:hash,bytes:png.length,width:32,height:32},webp:{name:id+'.webp',sha256:tamper&&i===rows.length-1?'0'.repeat(64):wh,bytes:webp.length,width:32,height:32}});
 files.push([id+'.png',png],[id+'.webp',webp])
 }files.push(['PhotoInventory.json',JSON.stringify({format:'VectraPreparedDataset',schema:1,photos})]);return {name:'Fixture'+n+'.zip',mimeType:'application/zip',buffer:zip(files)}
}
test('private prepared dataset: 56 verified pairs, filters, persistence, duplicate and tamper handling',async({page})=>{
 test.setTimeout(180000);await page.goto('/VectraAutomation/#acervo-fotografico');
 const rows=await page.evaluate(()=>Array.from({length:56},(_,i)=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.fillStyle='rgb('+i+',80,160)';x.fillRect(0,0,32,32);x.fillStyle='white';x.fillRect(i%16,0,2,16);return {png:c.toDataURL('image/png').split(',')[1],webp:c.toDataURL('image/webp',.82).split(',')[1]}}));
 const input=page.getByLabel('Importar lotes preparados V6.1'),count=page.getByTestId('real-count');
 await expect(count).toHaveText('0/56');await input.setInputFiles(pack(rows.slice(0,14),1,true));await expect(page.getByText(/Lote interrompido: SHA-256/)).toBeVisible();await expect(count).toHaveText('0/56');
 const packs=Array.from({length:4},(_,i)=>pack(rows.slice(i*14,(i+1)*14),i+1));await input.setInputFiles(packs);await expect(count).toHaveText('56/56',{timeout:90000});
 await page.getByLabel('Filtrar referências').selectOption('source:real');await expect(page.locator('.reference-card')).toHaveCount(56);await expect(page.locator('[data-reference-id]')).toHaveCount(0);
 const card=page.locator('.reference-card').first();await card.getByRole('button',{name:/Ampliar Fixture/}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect.poll(()=>dialog.locator('img').evaluate(e=>e.complete&&e.naturalWidth===32)).toBe(true);await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
 await page.getByLabel('Filtrar referências').selectOption('quality:Referência geométrica');await expect(page.locator('.reference-card')).toHaveCount(56);
 await input.setInputFiles(packs);await expect(page.getByText(/0 importada\(s\), 56 duplicata/)).toBeVisible({timeout:90000});
 await page.reload();await expect(count).toHaveText('56/56');await page.getByLabel('Filtrar referências').selectOption('source:external');await expect(page.locator('[data-reference-id]')).toHaveCount(6);await expect(page.locator('.reference-card')).toHaveCount(0);
});
