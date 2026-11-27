import React from 'react';
import {Icon} from '../Icon.jsx';
import LanguageMenu from '../navigation/LanguageMenu.jsx';
import {publicAssets} from '../../content/ProjectContent.js';
const links=[['home','Início','#'],['sobre-o-autor','Sobre o autor','#sobre-o-autor'],['saiba-mais','Saiba mais','#saiba-mais']];
export default function TopHeader({page,collapsed,onToggle}){return <header className="vectra-topbar"><div className="vectra-brand"><button className="sidebar-toggle" aria-label={collapsed?'Expandir menu':'Recolher menu'} aria-expanded={!collapsed} aria-controls="vectra-sidebar" onClick={onToggle}><Icon name="menu"/></button><a className="vectra-brand-link" href="#" aria-label="Vectra Virtual Lab — Início"><img src={publicAssets.logo} width="42" height="42" alt=""/><span><strong>Vectra Virtual Lab</strong><small>VECTRA AUTOMATION</small></span></a></div><nav className="vectra-topnav" aria-label="Menu superior">{links.map(([id,label,url])=><a key={id} href={url} className={page===id?'active':''} aria-current={page===id?'page':undefined}>{label}</a>)}<LanguageMenu/></nav></header>}
