import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {addInterior,interiorViews} from './InteriorReconstruction.js';

export const structuralViews={
 ...interiorViews,
 Pedais:{eye:[.36,.78,.12],target:[.34,.55,.67]},
 'Porta-objetos superior':{eye:[-.35,1.05,.12],target:[-.39,.84,.72]},
 'Porta-luvas':{eye:[-.36,.91,.12],target:[-.4,.59,.69]},
 'Lateral interna':{eye:[-.59,1.12,.03],target:[.42,.74,.55]}
};
const boxOf=o=>new T.Box3().setFromObject(o,true);
const mid=b=>b.getCenter(new T.Vector3());
const size=b=>b.getSize(new T.Vector3());
const clamp=T.MathUtils.clamp;
const valid=b=>!b.isEmpty()&&[...b.min,...b.max].every(Number.isFinite);
function named(o,pattern){for(let p=o;p;p=p.parent)if(pattern.test(p.name||''))return true;return false}
function bounds(meshes){const b=new T.Box3();for(const m of meshes)b.union(boxOf(m));return b}
function gap(a,b){return Math.hypot(...['x','y','z'].map(k=>Math.max(0,a.min[k]-b.max[k],b.min[k]-a.max[k])))}
export function connectionGap(a,b){return gap(boxOf(a),boxOf(b))}
function floorAt(meshes,x,z,fallback){const ray=new T.Raycaster(new T.Vector3(x,1.05,z),new T.Vector3(0,-1,0));const hits=ray.intersectObjects(meshes,false).filter(h=>h.point.y<.47&&h.point.y>.02);return hits[0]?.point.y??fallback}
export function addStructuralInterior(root){
 root.updateMatrixWorld(true);
 const stock=[];root.traverse(o=>{if(o.isMesh&&o.visible)stock.push(o)});
 const roles=role=>stock.filter(o=>o.userData.automotiveRole===role);
 const dashboard=roles('dashboard'),steering=roles('steering'),carpet=roles('carpet'),seats=roles('suede');
 const dash=bounds(dashboard),wheel=bounds(steering),floor=bounds(carpet);
 // The stock GLB is the coordinate authority; fallbacks are explicitly diagnostic.
 const dashOK=valid(dash)&&size(dash).x>.65&&size(dash).x<2.1&&size(dash).z<1.5;
 const wheelOK=valid(wheel)&&size(wheel).x<.85&&size(wheel).y<.85;
 const face=dashOK?clamp(dash.min.z,.46,.85):.59;
 const top=dashOK?clamp(dash.max.y,.83,1.10):.94;
 const half=dashOK?clamp(size(dash).x/2,.56,.78):.69;
 const wheelCenter=wheelOK?mid(wheel):new T.Vector3(.36,.70,.52);
 const wx=clamp(wheelCenter.x,.21,.53),wy=clamp(wheelCenter.y,.60,.95),wz=clamp(wheelCenter.z,.30,.76);
 const ground=(x,z)=>floorAt(carpet,x,z,valid(floor)?clamp(floor.min.y,.10,.30):.20);
 const old=addInterior(root),g=old.group;g.name='InteriorV52';g.updateMatrixWorld(true);
 const all=[...g.children],byName=new Map(all.map(o=>[o.name,o]));
 const groups={};
 function group(name){if(!groups[name]){groups[name]=new T.Group();groups[name].name=name;g.add(groups[name])}return groups[name]}
 const plastic=new T.MeshPhysicalMaterial({color:'#24272a',roughness:.86}),dark=new T.MeshPhysicalMaterial({color:'#141719',roughness:.91}),trim=new T.MeshPhysicalMaterial({color:'#4c5054',roughness:.63}),metal=new T.MeshPhysicalMaterial({color:'#53585c',roughness:.66,metalness:.35}),fabric=new T.MeshPhysicalMaterial({color:'#2a2b2d',roughness:1});
 function box(parent,id,name,dimensions,p,mat=plastic){const geometry=new RoundedBoxGeometry(...dimensions,2,Math.min(.014,Math.min(...dimensions)/4));const o=new T.Mesh(geometry,mat.clone());o.name=name;o.userData.referenceComponent=id;o.userData.interiorV5=true;o.userData.structural=true;o.position.set(...p);group(parent).add(o);byName.set(name,o);return o}
 function bar(parent,id,name,a,b,w,h,mat=dark){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const o=box(parent,id,name,[w,h,d.length()+.024],av.clone().add(bv).multiplyScalar(.5).toArray(),mat);o.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),d.normalize());return o}
 // Reposition the existing detail meshes relative to the dashboard face and wheel,
 // then parent them into physically related assemblies instead of loose siblings.
 for(const o of all){const id=o.userData.referenceComponent;
  if(id==='Dashboard'){o.position.z+=face-.49;o.position.y+=top-.94;group('DashboardAssembly').add(o)}
  else if(id==='InstrumentCluster'){o.position.x+=wx-.36;o.position.y+=top-.94;o.position.z+=face-.76;group('DriverAssembly').add(o)}
  else if(id==='SteeringWheel'){o.position.x+=wx-.366;o.position.y+=wy-.70;o.position.z+=wz-.526;group('SteeringAssembly').add(o)}
  else if(id==='CenterConsole'||id==='AutomaticSelector'){o.position.z+=face-.59;group('ConsoleAssembly').add(o)}
 }
 const front=face-.015,back=face+.12,stackY=.72+top-.94,consoleZ=.16+face-.59;
 // The dash skin joins the stock dash and fills the mounting volume behind the center stack.
 box('DashboardAssembly','Dashboard','DashCrossMember',[half*2,.18,.15],[0,top-.105,back],plastic);
 box('DashboardAssembly','Dashboard','DashboardLowerCarrier',[half*1.94,.16,.12],[0,top-.28,back],plastic);
 for(const side of [-1,1])box('DashboardAssembly','Dashboard',side<0?'PassengerSideMount':'DriverSideMount',[.10,.24,.16],[side*(half-.055),top-.19,back],plastic);
 box('DashboardAssembly','Dashboard','CenterStackMount',[.25,.31,.14],[0,stackY,front+.075],plastic);
 // Integrated center stack transitions down into the molded tunnel; no independent suspended radio module.
 const consoleGround=ground(0,consoleZ),consoleBottom=Math.min(.27,consoleGround);
 box('ConsoleAssembly','CenterConsole','FloorTunnel',[.19,.14,.76],[0,consoleBottom+.055,consoleZ-.025],fabric);
 box('ConsoleAssembly','CenterConsole','ConsoleFloorMount',[.20,Math.max(.08,.31-consoleBottom),.57],[0,(.31+consoleBottom)/2,consoleZ],plastic);
 bar('ConsoleAssembly','CenterConsole','StackTunnelBridge',[0,.39,consoleZ+.22],[0,stackY-.115,front+.015],.23,.13,plastic);
 box('DashboardAssembly','Dashboard','InformationDisplay',[.105,.054,.025],[.10,top-.095,front-.046],dark);
 // Recess with five surrounding walls: no solid block covering the opening.
 const px=-half*.57,py=top-.145,pz=front-.035,pw=half*.73;
 box('PassengerAssembly','UpperStorage','UpperPocketBack',[pw,.095,.025],[px,py,pz+.075],dark);
 box('PassengerAssembly','UpperStorage','UpperPocketFloor',[pw,.022,.105],[px,py-.046,pz+.025],plastic);
 box('PassengerAssembly','UpperStorage','UpperPocketTop',[pw,.019,.105],[px,py+.048,pz+.025],plastic);
 for(const s of [-1,1])box('PassengerAssembly','UpperStorage',s<0?'PocketLeft':'PocketRight',[.023,.11,.105],[px+s*(pw/2-.009),py,pz+.025],plastic);
 box('PassengerAssembly','Dashboard','PocketDashMount',[pw,.12,.055],[px,py,pz+.105],plastic);
 box('PassengerAssembly','Glovebox','GloveboxHousing',[pw,.15,.14],[px,py-.132,pz+.035],plastic);
 box('PassengerAssembly','Glovebox','GloveboxDoor',[pw-.012,.128,.025],[px,py-.132,pz-.043],plastic);
 box('PassengerAssembly','Glovebox','GloveboxLatch',[.065,.018,.013],[px,py-.102,pz-.059],dark);
 // Column from the real steering hub toward the dashboard carrier. Housing encloses the shaft.
 const hub=[wx,wy,wz],columnEnd=[wx,wy-.045,Math.max(wz+.09,back)];
 bar('SteeringAssembly','SteeringWheel','SteeringColumn',hub,columnEnd,.075,.075,dark);
 box('SteeringAssembly','SteeringWheel','ColumnFirewallBracket',[.14,.12,.09],columnEnd,metal);
 box('DriverAssembly','InstrumentCluster','ClusterDashMount',[.32,.15,.10],[wx,top-.10,front+.026],plastic);
 // Suppress specifically named stock pedal variants, not unrelated meshes.
 const suppressed=[];
 for(const m of stock.filter(o=>named(o,/(?:^|[_ .-])(?:pedals?|clutch|accelerator|brakepedal|gas[_-]?pedal)(?:$|[_ .-])/i))){m.visible=false;m.userData.structuralSuppressed=true;suppressed.push(m.name)}
 const pedalZ=front+.15,pedalFloor=ground(wx,pedalZ);
 const pedalY=clamp(pedalFloor+.14,.25,.43);
 box('PedalAssembly','Pedals','PedalFirewall',[.37,.29,.085],[wx,pedalY+.12,pedalZ+.11],dark);
 bar('PedalAssembly','Pedals','PedalCarrier',[wx,pedalY+.22,pedalZ+.10],[wx,top-.28,back],.16,.085,dark);
 for(const [name,x,w,h] of [['Brake',wx+.045,.105,.059],['Accelerator',wx-.087,.047,.10]]){
  const pad=[x,pedalY,pedalZ-.045],mount=[x,pedalY+.23,pedalZ+.075];
  bar('PedalAssembly','Pedals',name+'Arm',mount,pad,.025,.026,metal);
  const o=box('PedalAssembly','Pedals',name+'Pad',[w,h,.024],pad,dark);o.rotation.x=-.24;
 }
 // Seat support is measured from the existing stock seats to the carpet under them.
 const seatGroups=new Map();
 for(const o of seats){const sb=boxOf(o);if(!valid(sb))continue;const c=mid(sb);if(size(sb).y<.02||size(sb).x>.95)continue;const key=(c.z>-.45?'Front':'Rear')+(c.x>0?'Driver':'Passenger');const old=seatGroups.get(key)||new T.Box3();old.union(sb);seatGroups.set(key,old)}
 let rails=0;
 for(const [name,sb] of seatGroups){const c=mid(sb),s=size(sb),id=name.startsWith('Front')?'FrontSeats':'RearSeats';const z=clamp(c.z,-1.13,.30);
  for(const side of [-1,1]){const x=c.x+side*Math.min(.15,s.x*.25),y=ground(x,z),seatY=sb.min.y;const h=seatY-y+.016;if(h<.015||h>.32)continue;
   box('SeatAssembly',id,name+'Rail'+(side<0?'L':'R'),[.045,h,Math.min(.38,Math.max(.12,s.z*.55))],[x,(y+seatY)/2,z],metal);rails++;
  }
 }
 // Closed roof: identify source sunroof meshes; hide only that assembly and close its measured opening.
 const sunroof=stock.filter(o=>named(o,/sun[_ -]?roof|moon[_ -]?roof/i));
 let roofClosed=false;
 if(sunroof.length){const rb=bounds(sunroof),s=size(rb),c=mid(rb);if(valid(rb)&&s.x>.12&&s.z>.12&&s.x<1.8&&s.z<2.2&&c.y>1){
  const paint=stock.find(o=>o.userData.automotiveRole==='paint')?.material;for(const m of sunroof){m.visible=false;m.userData.structuralSuppressed=true}
  const cover=box('RoofAssembly','Dashboard','ClosedRoofSkin',[s.x+.024,.035,s.z+.024],[c.x,rb.max.y-.012,c.z],paint||plastic);
  cover.material.name='vectra';cover.userData.automotiveRole='paint';
  box('RoofAssembly','Dashboard','ClosedHeadliner',[s.x+.018,.025,s.z+.018],[c.x,rb.min.y+.008,c.z],fabric);roofClosed=true;
 }}
 root.updateMatrixWorld(true);
 const pairs=[['DashCrossMember','DashboardLowerCarrier'],['CenterStackMount','CenterStack'],['StackTunnelBridge','CenterStackMount'],['StackTunnelBridge','ConsoleBase'],['ConsoleFloorMount','FloorTunnel'],['UpperPocketBack','PocketDashMount'],['GloveboxDoor','GloveboxHousing'],['SteeringColumn','ColumnFirewallBracket'],['SteeringColumn','SteeringHub'],['PedalCarrier','PedalFirewall'],['PedalCarrier','DashboardLowerCarrier'],['BrakeArm','BrakePad'],['AcceleratorArm','AcceleratorPad']];
 const links=pairs.map(([a,b])=>({a,b,gap:byName.has(a)&&byName.has(b)?connectionGap(byName.get(a),byName.get(b)):null}));
 const report={revision:2,dashAnchor:dashOK,wheelAnchor:wheelOK,carpetAnchor:valid(floor),seatRails:rails,sunroofMeshes:sunroof.length,roofClosed,suppressedPedals:suppressed,anchors:{dashboard:dashboard.map(o=>({name:o.name,parent:o.parent?.name})),steering:steering.map(o=>({name:o.name,parent:o.parent?.name})),seats:seats.map(o=>({name:o.name,parent:o.parent?.name})),sunroof:sunroof.map(o=>({name:o.name,parent:o.parent?.name})),dash:dashOK?{min:dash.min.toArray(),max:dash.max.toArray()}:null,wheel:wheelOK?{min:wheel.min.toArray(),max:wheel.max.toArray()}:null},links};
 for(const m of [plastic,dark,trim,metal,fabric])m.dispose();
 let count=0;g.traverse(o=>{if(o.isMesh)count++});return {group:g,count,report};
}
