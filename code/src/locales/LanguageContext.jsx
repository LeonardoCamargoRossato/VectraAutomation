import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {EnUs} from './EnUs.js';
export const LANGUAGE_KEY='vectra-language-choice';
export function translate(value,locale='en-US'){
 if(typeof value!=='string'||locale==='pt-BR')return value;
 if(Object.hasOwn(EnUs,value))return EnUs[value];
 if(/^\d+ — /.test(value)){const [n,...rest]=value.split(' — ');return n+' — '+translate(rest.join(' — '),locale)}
 if(value.includes(' / '))return value.split(' / ').map(x=>translate(x,locale)).join(' / ');
 for(const key of Object.keys(EnUs).filter(k=>k.endsWith(':')).sort((a,b)=>b.length-a.length))if(value.startsWith(key+' '))return EnUs[key]+' '+translate(value.slice(key.length+1),locale);
 // Structured legacy status strings and catalog labels can carry numeric or diagnostic suffixes.
 for(const key of ['Sincronizado às','Opel Vectra B 2001 — adaptação stock'])if(value.startsWith(key+' '))return EnUs[key]+value.slice(key.length);
 if(value.endsWith(' — orientação e componentes não validados'))return value.slice(0,-' — orientação e componentes não validados'.length)+' — orientation and components not validated';
 if(value.endsWith('. Importe o GLB preparado.'))return translate(value.slice(0,-' Importe o GLB preparado.'.length),locale)+' Import the prepared GLB.';
 if(value.endsWith(' — câmera de ré'))return translate(value.slice(0,-' — câmera de ré'.length),locale)+' — reversing camera';
 if(/^\d+ (importada\(s\)|verificadas;)/.test(value)){return value.replace('importada(s),','imported,').replace('duplicata(s),','duplicates,').replace('manifesto(s) associado(s).','associated manifests.').replace('verificadas;','verified;').replace('importadas','imported').replace('duplicata(s) — lote privado V6.1','duplicates — V6.1 private batch')}
 return value;
}
const Context=createContext({locale:'en-US',setLocale:()=>{},t:v=>translate(v)});
export function LanguageProvider({children}){
 const [locale,update]=useState(()=>{try{const v=localStorage.getItem(LANGUAGE_KEY);return v==='pt-BR'?'pt-BR':'en-US'}catch{return 'en-US'}});
 useEffect(()=>{document.documentElement.lang=locale},[locale]);
 const value=useMemo(()=>({locale,t:v=>translate(v,locale),setLocale:v=>{if(v!=='en-US'&&v!=='pt-BR')return;try{localStorage.setItem(LANGUAGE_KEY,v)}catch{}update(v)}}),[locale]);
 return <Context.Provider value={value}>{children}</Context.Provider>
}
export const useLanguage=()=>useContext(Context);
