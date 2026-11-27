import {chromium,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import {mkdir,readFile} from 'node:fs/promises';
const root='https://leonardocamargorossato.github.io/VectraAutomation/';
const output='test-results/LiveRelease';
await mkdir(output,{recursive:true});
const inv=JSON.parse(await readFile('../documentation/AssetInventory.json','utf8'));
const migration=JSON.parse(await readFile('../documentation/AssetMigrationMap.json','utf8'));
const assets=[...inv.assets.filter(x=>x.id.startsWith('vectra-hero-triptych-')),...migration.entries.filter(x=>x.assetId==='vectra-stock').map(x=>({path:x.newPath,sha256:x.sha256,bytes:x.bytes}))];
if(assets.length!==4)throw Error('Expected three approved hero assets and stock GLB');
for(const a of assets){
 const url=root+a.path.replace(/^code\/public\//,'');
 const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(60000)});
 if(!r.ok)throw Error('Public asset HTTP '+r.status+' '+url);
 const b=Buffer.from(await r.arrayBuffer());
 if(b.length!==a.bytes||createHash('sha256').update(b).digest('hex')!==a.sha256)throw Error('Public asset digest mismatch: '+url);
 console.log('HTTP '+r.status+' · SHA-256 verified · '+url);
}
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const response=await page.goto(root,{waitUntil:'domcontentloaded',timeout:60000});if(!response?.ok())throw Error('Home HTTP response failed');
 await expect(page.locator('html')).toHaveAttribute('lang','en-US',{timeout:30000});
 await expect(page.getByRole('link',{name:'Explore Vectra'})).toBeVisible({timeout:30000});
 await expect.poll(()=>page.locator('.vectra-hero-trigger img').evaluate(i=>i.complete&&i.naturalWidth===1672)).toBe(true);
 await page.screenshot({path:output+'/DesktopEnglish.png'});
 await page.setViewportSize({width:390,height:844});
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
 await page.screenshot({path:output+'/MobileEnglish.png'});
 await page.locator('.vectra-language > button').click();await page.getByRole('button',{name:'Português — PT-BR'}).click();
 await expect(page.getByRole('link',{name:'Explorar Vectra'})).toBeVisible();
 await page.screenshot({path:output+'/MobilePortuguese.png'});
 await page.setViewportSize({width:1440,height:900});
 await page.locator('.vectra-language > button').click();await page.getByRole('button',{name:'English — EN-US'}).click();
 await page.getByRole('link',{name:'Explore Vectra'}).click();
 await expect(page.locator('.viewport')).toHaveAttribute('data-model-status','stock',{timeout:90000});await page.screenshot({path:output+'/Stock.png'});
 await page.getByRole('button',{name:'Photo Library',exact:true}).click();await expect(page.getByTestId('real-count')).toHaveText('56/56');await expect(page.getByTestId('external-count')).toHaveText('6');await page.screenshot({path:output+'/PhotoLibrary.png'});
 console.log('Published Home, English/Portuguese, mobile, stock GLB and public photo counts passed.');
}finally{await browser.close()}
