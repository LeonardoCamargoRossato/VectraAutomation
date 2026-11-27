import React from 'react';
import {project,publicAssets} from '../../content/ProjectContent.js';
export default function SidebarAuthor(){return <div className="sidebar-bottom vectra-sidebar-author"><a className="vectra-author-link" href={project.portfolio} target="_blank" rel="noopener noreferrer"><img src={publicAssets.author} width="54" height="54" alt="" loading="lazy"/><span><strong>{project.author}</strong><small>AI Engineering &amp; Software Development</small></span></a></div>}
