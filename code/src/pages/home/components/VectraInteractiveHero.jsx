import {useLanguage} from '../../../locales/LanguageContext.jsx';
import React,{useState,useRef,useEffect} from 'react';
import HeroSceneViewer from './HeroSceneViewer.jsx';
import {heroMotion,heroOffset} from './HeroMotion.js';
// One stable hit area; transform only the visual layer. The catalog can describe any aspect ratio.
export default function VectraInteractiveHero({artwork,motion=heroMotion}){
 const {t}=useLanguage(),[expanded,setExpanded]=useState(false),trigger=useRef(null),frame=useRef(0);
 const reset=()=>{cancelAnimationFrame(frame.current);frame.current=0;const el=trigger.current;if(el){el.removeAttribute('data-motion');for(const key of ['--hero-x','--hero-y','--hero-tilt'])el.style.removeProperty(key)}};
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{if(media.matches)reset()};media.addEventListener('change',change);return()=>{cancelAnimationFrame(frame.current);media.removeEventListener('change',change)}},[]);
 const move=e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=trigger.current;if(!el)return;const p=heroOffset(e.clientX,e.clientY,el.getBoundingClientRect(),motion);cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>{if(!trigger.current)return;el.style.setProperty('--hero-x',p.x+'px');el.style.setProperty('--hero-y',p.y+'px');el.style.setProperty('--hero-tilt',p.tilt+'deg');el.dataset.motion='active'})};
 return <figure className="vectra-hero-visual"><button ref={trigger} type="button" className="vectra-hero-trigger" style={{'--hero-hover-scale':motion.hoverScale,'--hero-duration':motion.transitionDuration+'ms'}} aria-label={t('Ampliar capa do Vectra')} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} onClick={()=>{reset();setExpanded(true)}}><img src={artwork.previewWebP} width={artwork.width} height={artwork.height} fetchPriority="high" alt={t(artwork.alt)}/></button><figcaption>{t('VEÍCULO FÍSICO · GÊMEO DIGITAL')}<span>{t('Clique para ampliar')}</span></figcaption>{expanded&&<HeroSceneViewer artwork={artwork} onClose={()=>setExpanded(false)}/>}</figure>
}
