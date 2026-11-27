import React from 'react';import {project} from '../../content/ProjectContent.js';
export default function ProjectFooter(){return <footer className="vectra-footer">por <a href={project.portfolio} target="_blank" rel="noopener noreferrer">{project.author}</a></footer>}
