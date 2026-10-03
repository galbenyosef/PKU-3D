/* South perimeter: street-facing buildings, rendered wall and a ref-only OSM
   checkpoint omitted by the old name-only gate selection. See perimeter.md.
   Dimensions are display fits to 2019/2023 images, not a current access survey. */
(function(Y){'use strict';
const gateId='node/10076453368',point=[389.698,742.254],rotation=Math.atan2(5.008,265.307);
function style(q){
 if(q[0]<-300&&q[1]>=-427.982&&q[1]<=622.903)return 'rubble';
 if(q[1]<740)return null;
 if(q[0]>=140.6&&q[0]<=386.563&&q[1]>741)return 'building-frontage';
 if(q[0]>=-302.184&&q[0]<124.391)return 'masonry';
 return null;
}
function clearance(g){return g.properties.id===gateId?3.1:g.properties.id==='node/380721886'?6:null;}
// Keep the raw import intact; restore this additional public map feature only
// to the display set. Its ref, rather than name, identifies the checkpoint.
if(!Y.CAMPUS.features.some(f=>f.properties.id===gateId)){
 const pickId=Math.max(...Y.CAMPUS.features.map(f=>f.properties.pickId||0))+1;
 Y.CAMPUS.features.push({type:'Feature',geometry:{type:'Point',coordinates:point.slice()},properties:{
  id:gateId,pickId,kind:'gate',name:'资源楼出入口',label:'资源楼出入口',category:'校门',
  tags:{barrier:'border_control',ref:'资源楼出入口'},source:'OpenStreetMap / registered street panorama',
  url:'https://www.openstreetmap.org/node/10076453368',centre:point.slice(),bounds:[...point,...point],
  height:2.6,heightSource:'2023街景比例拟合，非实测',width:4,displayRadius:9,rotation,gate33:true,
  reviewed:false,confidence:'coordinate-reference-not-survey',aliases:['邱德拔路南端出入口'],
  architecture:{summary:'资源楼东端与高层楼之间的门控通道',limits:'点位由地图门控节点确定；围挡、栏杆尺寸据2023街景拟合，当前门禁状态未核。'},
  scopeNote:'原始地图以ref记录的门控点；2023街景可见侧向金属围挡和低栏杆。仅恢复入口关系，不表示当前对外开放。'
}});
}
const westPoint=[-457.901,33.777];
if(!Y.CAMPUS.features.some(f=>f.properties.id==='node/380721886')){
 Y.CAMPUS.features.push({type:'Feature',geometry:{type:'Point',coordinates:westPoint.slice()},properties:{
  id:'node/380721886',pickId:Math.max(...Y.CAMPUS.features.map(f=>f.properties.pickId||0))+1,
  kind:'gate',name:'西侧门',label:'西侧门',category:'校门',aliases:['勺园北路西侧门'],
  tags:{barrier:'border_control',access:'permissive',motor_vehicle:'yes',bicycle:'no',foot:'no'},
  source:'OpenStreetMap / registered street panorama',url:'https://www.openstreetmap.org/node/380721886',
  centre:westPoint.slice(),bounds:[...westPoint,...westPoint],height:2.5,width:9.6,displayRadius:16,rotation:-Math.PI/2,gate33:true,
  reviewed:false,confidence:'coordinate-reference-not-survey',heightSource:'2023街景比例拟合，非实测',
  architecture:{summary:'勺园北路西端车行门，与西校门及西南门分别表示'},
  scopeNote:'恢复原始地图西侧门节点；2023街景可见金属门扇和车行门控。模型表示入口关系和示意开启姿态，非当前通行安排。'
 }});
}
const resource=Y.CAMPUS.features.find(f=>f.properties.id==='way/240832252');
if(resource){
 const p=resource.properties;p.aliases=[...new Set([...(p.aliases||[]),'南门驿站','资源西配楼'])];
 p.architecture={...p.architecture,summary:'西端一层配楼为南门驿站；向东为主楼及低连接'};
 p.scopeNote='南门驿站设于楼组最西端的一层西配楼，南侧面向校外、北侧面向校内。沿街建筑承担校园边界，楼前不再附加连续校园围栏。主楼高度、未见细部和精确门前配准仍为参考拟合。';
 const u=-9.05,r=Math.atan2(7.606,222.494),x=164.069+u*Math.cos(r),z=740.678-u*Math.sin(r);
 p.frontObservation46={target:[x,2.15,z+.65],bounds:[x-3.1,0,z-1.1,x+3.1,4.5,z+2.5],yaw:r,elevation:.16};
}
const previous=Y.Gates33.render;
function west(b,f){
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[westPoint[0],.12,westPoint[1]];b.rotation=-Math.PI/2;b.id=f.properties.pickId;b.anim=0;
 try{
  for(const side of[-1,1]){
   b.box(side*4.9,1.22,0,.16,2.44,.16,'#3d4f44',29);
   b.local(side*4.9,0,0,side*Math.PI/2,()=>{
    for(const y of[.24,2.3])b.box(side*1.9,y,0,3.8,.075,.075,'#3d4f44',29);
    for(let j=0;j<=19;j++)b.box(side*j*.2,1.27,0,.035,2.06,.04,'#3d4f44',29);
   });
  }
  b.box(0,.32,-3,.75,.64,3.2,'#abae9f',10);
  b.box(0,1.05,-3,.42,1.45,.45,'#aea48a',29);
  // Raised boom is a display pose, never a statement about present access.
  b.beam([0,1.72,-3],[2.5,3.8,-3],.075,'#e0ded0',29);
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {profile:'west-side-vehicle-gate-street2023',currentAccessVerified:false};
}
function render(b,f){
 if(f.properties.id==='node/380721886')return west(b,f);
 if(f.properties.id!==gateId)return previous(b,f);
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[point[0],.12,point[1]];b.rotation=rotation;b.id=f.properties.pickId;b.anim=0;
 try{
  // Tall green-framed side screens and a low metal barrier are visible in the
  // dated street panorama. Leave a pedestrian-width passage; no invented arch,
  // guardhouse, checkpoint sign, scanner or current opening schedule.
  for(const side of[-1,1]){
   const x=side*2.45;
   for(const edge of[-.5,.5])b.box(x+edge,1.22,0,.07,2.44,.09,'#40584d',29);
   for(const y of[.18,2.38])b.box(x,y,0,1.05,.07,.09,'#40584d',29);
   b.box(x,1.28,.01,.92,1.96,.035,'#b4b9b1',29);
   for(let i=1;i<8;i++)b.box(x-.46+i*.115,1.28,.036,.015,1.96,.018,'#969f96',29);
  }
  for(const x of[-1.9,.6])b.box(x,.57,0,.07,1.14,.07,'#c5cac2',29);
  for(const y of[.22,1.08])b.box(-.65,y,0,2.5,.055,.065,'#c5cac2',29);
  for(let i=1;i<10;i++)b.box(-1.9+i*.25,.65,0,.032,.86,.035,'#c5cac2',29);
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {profile:'resource-checkpoint-street2023',currentAccessVerified:false};
}
// Small shared irregular-stone panels retain physical surface relief on both
// faces. Cells meet mortar; no bitmap substitution or reduction of existing
// building/vegetation detail. Four variants avoid one repeated seam pattern.
function rubbleMeshes(variant){
 let seed=1777+variant*107;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const meshes=Array.from({length:4},()=>new Y.Geo.Geometry()),sites=[],W=2.4,H=2.03;
 for(let row=0;row<7;row++)for(let col=0;col<8;col++)sites.push([(col+.5+(random()-.5)*.75)*W/8,(row+.5+(random()-.5)*.75)*H/7]);
 function clip(poly,nx,ny,limit){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],da=a[0]*nx+a[1]*ny-limit,dc=c[0]*nx+c[1]*ny-limit;if(da<=0)out.push(a);if((da<0)!==(dc<0)){const t=da/(da-dc);out.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t]);}}return out;}
 for(const side of[-1,1])for(let i=0;i<sites.length;i++){
  const center=sites[i];let shape=[[.008,.01],[W-.008,.01],[W-.008,H-.01],[.008,H-.01]];
  for(let j=0;j<sites.length;j++){if(i===j)continue;const p=sites[j],nx=p[0]-center[0],ny=p[1]-center[1];if(Math.hypot(nx,ny)>1)continue;shape=clip(shape,nx,ny,(p[0]*p[0]+p[1]*p[1]-center[0]*center[0]-center[1]*center[1])/2-.009*Math.hypot(nx,ny));}
  if(shape.length<3)continue;
  const cx=shape.reduce((s,p)=>s+p[0],0)/shape.length,cy=shape.reduce((s,p)=>s+p[1],0)/shape.length,outline=[];
  for(let j=0;j<shape.length;j++){const a=shape[j],c=shape[(j+1)%shape.length],t=.08+random()*.12;outline.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t]);const mx=(a[0]+c[0])/2,my=(a[1]+c[1])/2;outline.push([mx+(cx-mx)*.03,my+(cy-my)*.03]);}
  const g=meshes[Math.floor(random()*4)],crown=[cx-W/2,cy,side*(.221+random()*.015)],rim=outline.map(p=>[p[0]-W/2,p[1],side*.212]);
  for(let j=0;j<rim.length;j++){const k=(j+1)%rim.length;g.tri(crown,...(side>0?[rim[j],rim[k]]:[rim[k],rim[j]]));}
 }
 return meshes;
}
function rubble(b,len,s){
 b.box(0,1.01,0,len,2.02,.42,'#9d9e94',10);
 b.box(0,2.09,0,len,.14,.55,'#a2a69b',10);
 const variant=Math.abs(Math.floor((s.a[0]+s.a[1])/2.4))%4,key='perimeter335-rubble-'+variant;
 if(!b.cache[key+'-0']){const gs=rubbleMeshes(variant);for(let i=0;i<4;i++)b.geo(key+'-'+i,()=>gs[i]);}
 for(let i=0;i<4;i++)b.mesh(key+'-'+i,b.cache[key+'-'+i],0,0,0,len/2.4,1,1,['#ada995','#b8b09a','#9d9e91','#bbb8a8'][i],21);
}
// Quantised fence cells end short of fitted gate wings. Join their actual
// endpoints, rather than estimating another clearance and leaving side bypasses.
function planConnections(D,runs){
 const ends=runs.filter(s=>s.campus).flatMap(s=>[s.a,s.c]),links=[];
 function nearest(target,accept){return ends.filter(accept).sort((a,c)=>Math.hypot(a[0]-target[0],a[1]-target[1])-Math.hypot(c[0]-target[0],c[1]-target[1]))[0];}
 function join(name,c,accept,style){const a=nearest(c,accept);if(a&&Math.hypot(a[0]-c[0],a[1]-c[1])<15)links.push({name,a,c,style});}
 join('south-west',[110.541,741.262],p=>p[1]>740&&p[0]<110.541,'masonry');
 // The station extension supplies the next boundary, not a remote ring cell.
 links.push({name:'south-east',a:[140.641,741.262],c:[148.078,741.225],style:'masonry'});
 const at=x=>[point[0]+x*Math.cos(rotation),point[1]-x*Math.sin(rotation)];
 join('resource-east',at(2.95),p=>p[1]>735&&p[0]>392.6,'screen');
 links.push({name:'resource-building-return',a:[386.563,733.072],c:at(-2.95),style:'screen'});
 join('west-side-left',[westPoint[0],westPoint[1]-4.9],p=>p[0]<-440&&p[1]<westPoint[1]-4.9,'rubble');
 join('west-side-right',[westPoint[0],westPoint[1]+4.9],p=>p[0]<-440&&p[1]>westPoint[1]+4.9,'rubble');
 return links;
}
function masonry(b,len){
 b.box(0,.14,0,len,.28,.52,'#969a91',10);
 b.box(0,1.04,0,len,1.8,.40,'#b7b7ad',24);
 b.box(0,1.99,0,len,.20,.43,'#7a8179',18);
 b.box(0,2.13,0,len,.08,.52,'#8f958b',10);
}
function renderConnections(b,D,runs){
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=0;b.anim=0;
 try{for(const s of planConnections(D,runs)){
  const len=Math.hypot(s.c[0]-s.a[0],s.c[1]-s.a[1]),r=Math.atan2(-(s.c[1]-s.a[1]),s.c[0]-s.a[0]);
  b.local((s.a[0]+s.c[0])/2,.16,(s.a[1]+s.c[1])/2,r,()=>{
   if(s.style==='rubble')return rubble(b,len,s);
   if(s.style==='masonry')return masonry(b,len);
   const n=Math.ceil(len/1.2),w=len/n;
   for(let i=0;i<=n;i++)b.box(-len/2+i*w,1.2,0,.07,2.4,.09,'#40584d',29);
   for(const y of[.18,2.36])b.box(0,y,0,len,.07,.09,'#40584d',29);
   for(let i=0;i<n;i++)b.box(-len/2+(i+.5)*w,1.27,0,w-.06,1.95,.035,'#b4b9b1',29);
  });
 }}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
}
Y.Gates33.render=render;Y.Perimeter335={style,clearance,gateId,point,render,rubble,rubbleMeshes,planConnections,renderConnections,masonry};
})(YY);
