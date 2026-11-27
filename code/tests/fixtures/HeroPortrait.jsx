import React from 'react';
import {createRoot} from 'react-dom/client';
import VectraInteractiveHero from '../../src/pages/home/components/VectraInteractiveHero.jsx';
import '../../src/Styles.css';import '../../src/styles/AutomotiveIdentity.css';
const canvas=document.createElement('canvas');canvas.width=480;canvas.height=720;const ctx=canvas.getContext('2d');ctx.fillStyle='#729ec5';ctx.fillRect(20,20,440,680);ctx.fillStyle='#071526';ctx.fillRect(60,80,360,560);
const artwork={artworkId:'portrait-fixture',previewWebP:canvas.toDataURL('image/webp'),detailPNG:canvas.toDataURL('image/png'),sourceSVG:'',width:480,height:720,alt:'Portrait fixture',version:'test'};
createRoot(document.getElementById('root')).render(<div className="app-shell is-home menu-collapsed"><main className="main-column"><section className="vectra-hero"><div className="vectra-hero-copy"><h1>Portrait test</h1></div><VectraInteractiveHero artwork={artwork}/></section></main></div>);
