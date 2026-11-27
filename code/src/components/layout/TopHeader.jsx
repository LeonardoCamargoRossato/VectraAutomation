import {useLanguage} from '../../locales/LanguageContext.jsx';
import React from 'react';
import {Icon} from '../Icon.jsx';
import LanguageMenu from '../navigation/LanguageMenu.jsx';
import {publicAssets} from '../../content/ProjectContent.js';
const links=[['home','Início','#home'],['sobre-o-autor','Sobre o autor','#about-author'],['saiba-mais','Saiba mais','#learn-more']];
export default function TopHeader({page,collapsed,onToggle}){const {t}=useLanguage();return <header className="vectra-topbar"><div className="vectra-brand"><button className="sidebar-toggle" aria-label={t(collapsed?'Expandir menu':'Recolher menu')} aria-expanded={!collapsed} aria-controls="vectra-sidebar" onClick={onToggle}><Icon name="menu"/></button><a className="vectra-brand-link" href="#home" aria-label={t("Vectra Virtual Lab — Início")}><img src={publicAssets.logo} width="42" height="42" alt=""/><span><strong>Vectra Virtual Lab</strong><small>VECTRA AUTOMATION</small></span></a></div><nav className="vectra-topnav" aria-label={t("Menu superior")}>{links.map(([id,label,url])=><a key={id} href={url} className={page===id?'active':''} aria-current={page===id?'page':undefined}>{t(label)}</a>)}<LanguageMenu/></nav></header>}
