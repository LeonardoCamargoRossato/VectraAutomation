import {useLanguage,LanguageProvider} from './locales/LanguageContext.jsx';
import React,{useState,lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {Icon} from './components/Icon.jsx';
import {ensureGarage,getModel} from './lib/garage/GarageStore.js';
const Gallery=lazy(()=>import('./pages/Gallery.jsx').then(m=>({default:m.Gallery})));
import './Styles.css';
import './styles/AutomotiveIdentity.css';
import TopHeader from './components/layout/TopHeader.jsx';
import ProjectFooter from './components/layout/ProjectFooter.jsx';
import SidebarAuthor from './components/layout/SidebarAuthor.jsx';
import {topPages,getPage,canonicalHash} from './lib/Navigation.js';
const Home=lazy(()=>import('./pages/home/HomePage.jsx'));
const AboutAuthor=lazy(()=>import('./pages/about-author/AboutAuthorPage.jsx'));
const LearnMore=lazy(()=>import('./pages/learn-more/LearnMorePage.jsx'));
const Viewer=lazy(()=>import('./pages/Viewer.jsx'));
const Garage=lazy(()=>import('./pages/Garage.jsx'));
const PhotoLibrary=lazy(()=>import('./pages/PhotoLibrary.jsx'));
const Inventory=lazy(()=>import('./pages/Inventory.jsx'));
const pages=[['explorar','Explorar Vectra','car'],['garagem','Minha Garagem','garage'],['inventario','Inventário','list'],['galeria','Galeria','image'],['acervo-fotografico','Acervo Fotográfico','image'],['sobre','Sobre o Projeto','info']];

function GarageViewer({active,restore,clearRestore}){const {t}=useLanguage();const [record,setRecord]=useState(null),[error,setError]=useState('');React.useEffect(()=>{let alive=true;getModel(active.id).then(async m=>m||((await ensureGarage())[0])).then(m=>{if(alive)setRecord(m)}).catch(e=>{if(alive)setError(e.message)});return()=>{alive=false}},[active.id]);return record?<Viewer key={record.id} garageRecord={record} restore={restore} clearRestore={clearRestore}/>:<p role="status">{t(error||'Carregando configuração…')}</p>}
function App(){const {t}=useLanguage();const [page,setPage]=useState(getPage),[collapsed,setCollapsed]=useState(true),[restore,setRestore]=useState(null),[active,setActive]=useState(null),[storageError,setStorageError]=useState('');
React.useEffect(()=>{ensureGarage().then(rows=>{let id;try{id=localStorage.getItem('vectra-active-model')}catch{}setActive(rows.find(r=>r.id===id)||rows[0])}).catch(e=>setStorageError(e.message))},[]);
function openModel(row){setRestore(null);setActive(row);try{localStorage.setItem('vectra-active-model',row.id)}catch{}go('explorar')}

React.useEffect(()=>{const f=()=>{setPage(getPage());if(innerWidth<=680)setCollapsed(true)};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
React.useEffect(()=>{if(collapsed)return;const close=e=>{if(e.key==='Escape'&&innerWidth<=680)setCollapsed(true)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[collapsed]);
function go(id){location.hash=canonicalHash(id);setPage(id);if(innerWidth<=680)setCollapsed(true)}
return <div className={'app-shell '+(collapsed?'menu-collapsed':'')+(page==='home'?' is-home':'')}><TopHeader page={page} collapsed={collapsed} onToggle={()=>setCollapsed(v=>!v)}/>{!collapsed&&<button className="mobile-nav-scrim" aria-label={t('Fechar navegação')} onClick={()=>setCollapsed(true)}/>}<aside id="vectra-sidebar" className="nav-sidebar"><nav className="side-navigation">{pages.map(([id,title,icon])=><button key={id} className={'nav-item '+(page===id?'active':'')} aria-current={page===id?'page':undefined} title={t(title)} aria-label={t(title)} onClick={()=>go(id)}><span className="nav-icon"><Icon name={icon}/></span>{!collapsed&&t(title)}</button>)}</nav>{!collapsed&&<SidebarAuthor/>}</aside><main className="main-column">{!topPages.includes(page)&&<header className="compact-toolbar"><div><span className="overline">Chevrolet Vectra CD 2.2 · 2000</span><h1>{t(pages.find(p=>p[0]===page)[1])}</h1></div></header>}<Suspense fallback={<p role="status">{t("Carregando módulo…")}</p>}>{page==='home'?<Home/>:page==='sobre-o-autor'?<AboutAuthor/>:page==='saiba-mais'?<LearnMore/>:page==='explorar'?active?<GarageViewer key={active.id} active={active} restore={restore} clearRestore={()=>setRestore(null)}/>:<p role="status">{t(storageError||'Carregando garagem…')}</p>:page==='garagem'?<Garage active={active?.id} onOpen={openModel}/>:page==='inventario'?<Inventory/>:page==='galeria'?<Gallery onRestore={async(s,id)=>{if(id){const m=await getModel(id);if(m){setActive(m);try{localStorage.setItem('vectra-active-model',m.id)}catch{}}}setRestore(s);go('explorar')}}/>:page==='acervo-fotografico'?<PhotoLibrary onLocate={id=>{sessionStorage.setItem('vectra-locate-component',id);go('explorar')}} initialComponent={sessionStorage.getItem('vectra-reference-filter')}/>:<article className="panel"><h2>{t("Laboratório de modernização virtual")}</h2><p>{t("Ambiente independente, sem conexão com o veículo. O modelo stock é uma aproximação tridimensional editável. Os modelos importados pelo usuário ficam no dispositivo.")}</p><a href="https://github.com/LeonardoCamargoRossato/NV-Quantum-VirtualLab" target="_blank" rel="noreferrer">{t("Projeto de referência")}</a><p>{t("Sem serviços pagos. Sem envio de fotos ou modelos para servidores.")}</p></article>}</Suspense><ProjectFooter/></main></div>}
createRoot(document.getElementById('root')).render(<LanguageProvider><App/></LanguageProvider>);