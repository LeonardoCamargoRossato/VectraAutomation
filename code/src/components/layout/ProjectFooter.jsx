import {useLanguage} from '../../locales/LanguageContext.jsx';
import React from 'react';import {project} from '../../content/ProjectContent.js';
export default function ProjectFooter(){const {t}=useLanguage();return <footer className="vectra-footer">{t('por')} <a href={project.portfolio} target="_blank" rel="noopener noreferrer">{project.author}</a></footer>}
