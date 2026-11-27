import {useLanguage} from '../../../locales/LanguageContext.jsx';
import React,{useEffect,useRef} from 'react';
// Shared viewer for the approved whole composite; no simulated individual scene crops.
export default function HeroSceneViewer({src,onClose}){const {t}=useLanguage();
 const ref=useRef(null);
 useEffect(()=>{const d=ref.current;const focus=document.activeElement;d.showModal();return()=>{if(d.open)d.close();focus?.focus()}},[]);
 return <dialog ref={ref} className="vectra-hero-dialog" aria-label={t("Capa do Vectra ampliada")} onCancel={e=>{e.preventDefault();onClose()}}><div className="vectra-hero-dialog-controls"><a href={src} download="VectraHeroTriptych.png">{t("Baixar PNG")}</a><button type="button" onClick={onClose} autoFocus>{t("Fechar")}</button></div><img src={src} width="1672" height="941" alt={t("Composição completa do Vectra em alta resolução")}/></dialog>
}
