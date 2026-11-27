import test from 'node:test';
import assert from 'node:assert/strict';
import {heroOffset,heroMotion} from '../src/pages/home/components/HeroMotion.js';
test('hero motion bounded, centered and independent of aspect ratio',()=>{
 const r={left:10,top:20,width:1000,height:600};
 assert.deepEqual(heroOffset(510,320,r),{x:0,y:0,tilt:0});
 assert.deepEqual(heroOffset(9999,9999,r),{x:12,y:8,tilt:heroMotion.maxTilt});
 assert.deepEqual(heroOffset(-1,-1,r),{x:-12,y:-8,tilt:-heroMotion.maxTilt});
 assert.deepEqual(heroOffset(210,620,{left:10,top:20,width:400,height:1200}),{x:0,y:0,tilt:0});
});
