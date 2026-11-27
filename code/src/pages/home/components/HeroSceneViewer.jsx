import React from 'react';
import {useLanguage} from '../../../locales/LanguageContext.jsx';
import ReferenceImageViewer from '../../../components/viewers/ReferenceImageViewer.jsx';
// The Home delegates all zoom, pan, fullscreen, focus and download behavior to the LCR viewer.
export default function HeroSceneViewer({artwork,onClose}){const {t}=useLanguage();return <ReferenceImageViewer src={artwork.detailPNG} title={t('Capa do Vectra ampliada')} imageAlt={t(artwork.alt)} caption={artwork.width+' × '+artwork.height+' · PNG'} downloadName={artwork.downloadName||artwork.artworkId+'.png'} downloadLabel="Baixar PNG" onClose={onClose}/>}
