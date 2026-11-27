import React,{useState} from 'react';
import {publicAssets} from '../../../content/ProjectContent.js';
import HeroSceneViewer from './HeroSceneViewer.jsx';
// The approved composite is indivisible. Independent scenes will be added only when supplied.
export default function VectraInteractiveHero(){
 const [expanded,setExpanded]=useState(false);
 return <figure className="vectra-hero-visual"><button type="button" className="vectra-hero-trigger" aria-label="Ampliar capa do Vectra" onClick={()=>setExpanded(true)}><img src={publicAssets.hero} width="1672" height="941" fetchPriority="high" alt="Composição do Vectra na oficina, no estacionamento e em seu interior"/></button><figcaption>VEÍCULO FÍSICO · GÊMEO DIGITAL <span>Clique para ampliar</span></figcaption>{expanded&&<HeroSceneViewer src={publicAssets.heroDetail} onClose={()=>setExpanded(false)}/>}</figure>
}
