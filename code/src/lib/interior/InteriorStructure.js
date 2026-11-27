import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {addInterior,interiorViews} from './InteriorReconstruction.js';

export const structuralViews={
 ...interiorViews,
 Motorista:{eye:[.36,1.08,.29],target:[.36,.74,.74]},
 Passageiro:{eye:[-.36,1.08,.29],target:[-.32,.74,.75]},
 Painel:{eye:[0,1.10,.13],target:[0,.75,.71]},
 Volante:{eye:[.36,1.00,.27],target:[.36,.70,.59]},
 'Instrumentação':{eye:[.36,1.01,.43],target:[.36,.83,.70]},
 'Console central':{eye:[0,1.13,.12],target:[0,.66,.66]},
 'Câmbio automático':{eye:[0,1.04,.32],target:[0,.43,.31]},
 'Visão ampla dos bancos':{eye:[0,1.16,.43],target:[0,.70,-.76]},
 Pedais:{eye:[.36,.77,.37],target:[.34,.34,.81]},
 'Porta-objetos superior':{eye:[-.33,1.05,.29],target:[-.39,.80,.68]},
 'Porta-luvas':{eye:[-.34,.89,.33],target:[-.4,.60,.65]},
 'Lateral interna':{eye:[-.49,1.11,.26],target:[.38,.75,.61]}
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
 const top=dashOK?clamp(dash.max.y,.83,1.10):.94;
 const dashSurface=(x,y,fallback)=>{const ray=new T.Raycaster(new T.Vector3(x,y,-.7),new T.Vector3(0,0,1));return ray.intersectObjects(dashboard,false).find(h=>h.point.z>.27&&h.point.z<1.12)?.point.z??fallback};
 const face=dashOK?clamp(dashSurface(0,top-.23,.59),.38,.86):.59;
 const half=dashOK?clamp(size(dash).x/2,.56,.78):.69;
 const wheelCenter=wheelOK?mid(wheel):new T.Vector3(.36,.70,.52);
 const wx=clamp(wheelCenter.x,.21,.53),wy=clamp(wheelCenter.y,.60,.95),wz=clamp(wheelCenter.z,.30,.76);
 const clusterY=top-.075,clusterFace=clamp(Math.min(dashSurface(wx,clusterY,.73)-.045,face+.012),wz+.055,.91);
 const ground=(x,z)=>floorAt(carpet,x,z,valid(floor)?clamp(floor.min.y,.10,.30):.20);
 const old=addInterior(root),g=old.group;g.name='InteriorV63';g.updateMatrixWorld(true);
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
  else if(id==='InstrumentCluster'){o.position.x+=wx-.36;o.position.y+=clusterY-.84;o.position.z+=clusterFace-.735;group('DriverAssembly').add(o)}
  else if(id==='SteeringWheel'){o.position.x+=wx-.366;o.position.y+=wy-.70;o.position.z+=wz-.526;group('SteeringAssembly').add(o)}
  else if(id==='CenterConsole'||id==='AutomaticSelector'){o.position.z+=face-.59;group('ConsoleAssembly').add(o)}
 }
 const front=face-.015,back=face+.12,stackY=.72+top-.94,consoleZ=.16+face-.59;
 // The dash skin joins the stock dash and fills the mounting volume behind the center stack.
 box('DashboardAssembly','Dashboard','DashCrossMember',[half*2,.18,.15],[0,top-.105,back+.012],plastic);
 box('DashboardAssembly','Dashboard','DashboardLowerCarrier',[half*1.94,.17,.12],[0,top-.275,back+.012],plastic);
 for(const side of [-1,1])box('DashboardAssembly','Dashboard',side<0?'PassengerSideMount':'DriverSideMount',[.10,.24,.16],[side*(half-.055),top-.19,back],plastic);
 box('DashboardAssembly','Dashboard','CenterStackMount',[.25,.31,.14],[0,stackY,front+.075],plastic);
 // Integrated center stack transitions down into the molded tunnel; no independent suspended radio module.
 const consoleGround=ground(0,consoleZ),consoleBottom=Math.min(.27,consoleGround);
 box('ConsoleAssembly','CenterConsole','FloorTunnel',[.19,.14,.76],[0,consoleBottom+.055,consoleZ-.025],fabric);
 box('ConsoleAssembly','CenterConsole','ConsoleFloorMount',[.20,Math.max(.08,.31-consoleBottom),.57],[0,(.31+consoleBottom)/2,consoleZ],plastic);
 bar('ConsoleAssembly','CenterConsole','StackTunnelBridge',[0,.36,consoleZ+.24],[0,stackY-.15,front+.09],.19,.085,plastic);
 box('DashboardAssembly','Dashboard','InformationDisplay',[.105,.054,.025],[.10,top-.095,dashSurface(.10,top-.095,front)-.018],dark);
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
 const hub=[wx,wy,wz],columnEnd=[wx,wy-.045,Math.max(wz+.09,dashSurface(wx,wy-.045,back)+.025,back)];
 bar('SteeringAssembly','SteeringWheel','SteeringColumn',hub,columnEnd,.075,.075,dark);
 box('SteeringAssembly','SteeringWheel','ColumnFirewallBracket',[.14,.12,.09],columnEnd,metal);
 box('DriverAssembly','InstrumentCluster','ClusterDashMount',[.32,.135,.055],[wx,clusterY,clusterFace+.045],plastic);
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
 for(const o of seats){const sb=boxOf(o);if(!valid(sb)||size(sb).y<.02)continue;const c=mid(sb),parent=o.parent?.name||o.name,key=/seats_R$|rear/i.test(parent)?'RearBench':/seat_FR$/i.test(parent)?'FrontPassenger':/seat_FL$/i.test(parent)?'FrontDriver':(c.z>-.45?'Front':'Rear')+(c.x>0?'Driver':'Passenger');const entry=seatGroups.get(key)||{bounds:new T.Box3(),meshes:[]};entry.bounds.union(sb);entry.meshes.push(o);seatGroups.set(key,entry)}
 let rails=0;const seatSupports=[];
 for(const [name,entry] of seatGroups){const sb=entry.bounds,c=mid(sb),s=size(sb),id=name.startsWith('Front')?'FrontSeats':'RearSeats';const z=clamp(c.z,-1.16,.36),offset=Math.min(name==='RearBench'?.39:.15,s.x*.28);
  for(const side of [-1,1]){const x=c.x+side*offset,y=ground(x,z);const ray=new T.Raycaster(new T.Vector3(x,.015,z),new T.Vector3(0,1,0));const hit=ray.intersectObjects(entry.meshes,false).find(h=>h.point.y<.65);const bottom=hit?.point.y??sb.min.y,gapToFloor=bottom-y;
   // When the original seat already meets the carpet, retain the existing support; do not
   // lift the complete seat or invent a large rail that would intersect the cabin.
   const attached=gapToFloor<=.025&&gapToFloor>=-.09;
   let added=false;
   if(!attached&&gapToFloor>.025&&gapToFloor<=.32){box('SeatAssembly',id,name+'Rail'+(side<0?'L':'R'),[.045,gapToFloor+.016,Math.min(.34,Math.max(.12,s.z*.5))],[x,(y+bottom)/2,z],metal);rails++;added=true}
   seatSupports.push({seat:name,side:side<0?'left':'right',x,z,floorY:y,seatBottom:bottom,boundsMin:sb.min.toArray(),boundsMax:sb.max.toArray(),surfaceHit:!!hit,gapToFloor,attached,added});
  }
 }
 // Retain curved stock headliner: former flat replacement intersected cabin.
 const sunroof=stock.filter(o=>named(o,/sun[_ -]?roof|moon[_ -]?roof/i));let roofClosed=false,roofBounds=null;
 root.updateMatrixWorld(true);
 const pairs=[['DashCrossMember','DashboardLowerCarrier'],['CenterStackMount','CenterStack'],['StackTunnelBridge','CenterStackMount'],['StackTunnelBridge','ConsoleBase'],['ConsoleFloorMount','FloorTunnel'],['UpperPocketBack','PocketDashMount'],['GloveboxDoor','GloveboxHousing'],['SteeringColumn','ColumnFirewallBracket'],['SteeringColumn','SteeringHub'],['PedalCarrier','PedalFirewall'],['PedalCarrier','DashboardLowerCarrier'],['BrakeArm','BrakePad'],['AcceleratorArm','AcceleratorPad']];
 const links=pairs.map(([a,b])=>({a,b,gap:byName.has(a)&&byName.has(b)?connectionGap(byName.get(a),byName.get(b)):null}));
 const cameraSightlines=Object.entries(structuralViews).map(([name,pose])=>{const eye=new T.Vector3(...pose.eye),target=new T.Vector3(...pose.target),direction=target.clone().sub(eye),distance=direction.length();const ray=new T.Raycaster(eye,direction.normalize(),.02,distance+.08);const first=ray.intersectObjects([...stock.filter(o=>o.visible),...Array.from(byName.values())],false)[0];return {name,first:first?{mesh:first.object.name,role:first.object.userData.automotiveRole,component:first.object.userData.referenceComponent,distance:first.distance}:null,targetDistance:distance}});
 const report={revision:3,cameraSightlines,dashAnchor:dashOK,wheelAnchor:wheelOK,carpetAnchor:valid(floor),seatRails:rails,seatSupports,sunroofMeshes:sunroof.length,roofClosed,suppressedPedals:suppressed,anchors:{centerDashFace:face,clusterFace,roofBounds,columnEnd,footwell:stock.filter(o=>{const b=boxOf(o),c=mid(b);return valid(b)&&c.y<.62&&c.y>.08&&c.z>.32&&c.z<1.12&&c.x>.12&&c.x<.65}).map(o=>({name:o.name,parent:o.parent?.name,role:o.userData.automotiveRole,bounds:{min:boxOf(o).min.toArray(),max:boxOf(o).max.toArray()}})),dashboard:dashboard.map(o=>({name:o.name,parent:o.parent?.name})),steering:steering.map(o=>({name:o.name,parent:o.parent?.name})),seats:seats.map(o=>({name:o.name,parent:o.parent?.name})),sunroof:sunroof.map(o=>({name:o.name,parent:o.parent?.name})),dash:dashOK?{min:dash.min.toArray(),max:dash.max.toArray()}:null,wheel:wheelOK?{min:wheel.min.toArray(),max:wheel.max.toArray()}:null},links};
 for(const m of [plastic,dark,trim,metal,fabric])m.dispose();
 let count=0;g.traverse(o=>{if(o.isMesh)count++});return {group:g,count,report};
}
