// Pure configuration and normalized pointer math; no animation loop.
export const heroMotion=Object.freeze({maxTranslateX:12,maxTranslateY:8,hoverScale:1.035,maxTilt:1.25,transitionDuration:350});
export function heroOffset(clientX,clientY,rect,settings=heroMotion){
 const clamp=v=>Math.max(-1,Math.min(1,v));
 const x=clamp(2*(clientX-rect.left)/Math.max(1,rect.width)-1);
 const y=clamp(2*(clientY-rect.top)/Math.max(1,rect.height)-1);
 return {x:x*settings.maxTranslateX,y:y*settings.maxTranslateY,tilt:x*settings.maxTilt};
}
