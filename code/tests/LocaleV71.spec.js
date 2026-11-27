import {test,expect} from '@playwright/test';
test.use({storageState:{cookies:[],origins:[]}});
const root='/VectraAutomation/';
async function change(page,language){const button=page.locator('.vectra-language > button');await button.click();await page.getByRole('button',{name:language,exact:false}).click();}
for(const width of [390,768,1120,1440])test('English default and both languages at '+width,async({page},info)=>{
 await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(root);
 await expect(page.locator('html')).toHaveAttribute('lang','en-US');await expect(page.getByRole('link',{name:'Explore Vectra'})).toBeVisible();await expect(page.getByText('From a real vehicle to an intelligent digital twin.')).toBeVisible();
 await expect.poll(()=>page.locator('.vectra-hero-trigger img').evaluate(i=>i.complete&&i.naturalWidth===1672)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
 await page.screenshot({path:info.outputPath('HomeEnglish.png')});
 await page.getByRole('button',{name:'Expand menu'}).click();await expect(page.getByRole('button',{name:'Collapse menu'})).toBeVisible();
 if(width===390){await page.getByRole('button',{name:'Close navigation'}).click({position:{x:340,y:100}});await expect(page.getByRole('button',{name:'Expand menu'})).toBeVisible();await page.getByRole('button',{name:'Expand menu'}).click();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Expand menu'})).toBeVisible()}else await page.getByRole('button',{name:'Collapse menu'}).click();
 await page.getByRole('link',{name:'About the Author',exact:true}).click();await expect(page.getByRole('heading',{name:'About the Author'})).toBeVisible();
 await change(page,'Português — PT-BR');await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');await expect(page.getByRole('heading',{name:'Sobre o autor'})).toBeVisible();expect(page.url()).toContain('#about-author');
 await page.reload();await expect(page.getByRole('heading',{name:'Sobre o autor'})).toBeVisible();await page.getByRole('link',{name:'Início',exact:true}).click();await expect(page.getByText('Do veículo real ao gêmeo digital inteligente.')).toBeVisible();await page.screenshot({path:info.outputPath('HomePortuguese.png')});
 await change(page,'English — EN-US');await expect(page.getByRole('link',{name:'Explore Vectra'})).toBeVisible();expect(errors).toEqual([]);
});
test('English operational routes and legacy aliases preserve model state',async({page},info)=>{
 test.setTimeout(180000);await page.goto(root+'#explorar');const view=page.locator('.viewport');await expect(view).toHaveAttribute('data-model-status','stock',{timeout:60000});
 await expect(page.getByRole('heading',{name:'Explore Vectra'})).toBeVisible();
 const env=page.getByLabel('Environment',{exact:true});await env.selectOption('Oficina');await expect(env).toHaveValue('Oficina');
 await expect(page.getByText(/All changes saved/)).toBeVisible({timeout:30000});
 await page.getByRole('button',{name:'Interior',exact:true}).click();await expect(page.getByRole('button',{name:'Driver',exact:true})).toBeVisible();
 await page.screenshot({path:info.outputPath('ExploreEnglish.png')});
 await change(page,'Português — PT-BR');await expect(page.getByRole('button',{name:'Motorista',exact:true})).toBeVisible();await expect(page.getByLabel('Ambiente',{exact:true})).toHaveValue('Oficina');await expect(view).toHaveAttribute('data-model-status','stock');
 await change(page,'English — EN-US');await page.getByRole('button',{name:'My Garage',exact:true}).click();await expect(page.getByRole('heading',{name:'Original Vectra'})).toBeVisible();await page.screenshot({path:info.outputPath('GarageEnglish.png')});
 await page.getByRole('button',{name:'Photo Library',exact:true}).click();await expect(page.getByTestId('real-count')).toHaveText('56/56');await expect(page.getByTestId('external-count')).toHaveText('6');await expect(page.getByRole('heading',{name:'01 — Steering wheel'})).toBeVisible();await page.getByLabel('Filter references').selectOption('source:real');await expect(page.getByTestId('real-collection')).toBeVisible();await page.screenshot({path:info.outputPath('PhotoLibraryEnglish.png')});
 await page.getByRole('button',{name:'Inventory',exact:true}).click();await expect(page.getByText('Disconnected',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Gallery',exact:true}).click();await expect(page.getByText('No saved captures.')).toBeVisible();await page.getByRole('button',{name:'About the Project',exact:true}).click();await expect(page.getByRole('heading',{name:'Virtual modernization lab'})).toBeVisible();
 await page.goto(root+'#explore-vectra');await expect(view).toHaveAttribute('data-model-status','stock',{timeout:60000});await expect(page.getByLabel('Environment',{exact:true})).toHaveValue('Oficina');
});
