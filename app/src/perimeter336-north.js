/* Physical north wall/fences: OSM ways 1101490170, 1101490171, 638620294.
 * Registered 2013/2016/2019/2023 views distinguish these from the canal rail.
 * The university area polygon remains untouched. Dimensions are display fits.
 * Small East Gate uses the 2024 official outline; its 2026 east-side changes
 * are documented but their exact placement is not established by the photo. */
(function(Y){'use strict';
if(Y.Perimeter336North)return;
const F=Y.Footprints,M=Y.M,campusId='way/1330709889',iron='#394c43';
const small=[256.98863924520197,-422.8303988802362],northEast=[421.7838531918162,-428.93729521693496],langrun=[182.48234537693372,-553.6401184050657];
const smallRotation=Math.atan2(1.69882752641945,6.4394481403424);
// Only these original area-ring edges are superseded. In particular, the
// north-west corner's incoming west-wall edge must remain intact.
const oldNorth=[[-479.021,-427.982],[-269.116,-465.334],[-242.35,-471.908],[-227.755,-481.468],[-206.028,-506.606],[-179.792,-538.961],[-132.991,-596.688],[-102.066,-618.407],[-63.515,-639.259],[-16.09,-652.194],[117.832,-688.702],[143.128,-692.256],[156.229,-692.555],[170.628,-692.877],[188.76,-559.07],[231.906,-564.366],[250.822,-417.912],[421.562,-433.257]];
const wall=[[-480.319632442,-429.836674496],[-446.679067156,-435.044191553],[-394.531493755,-446.425225635],[-284.625315879,-462.991569877],[-246.185055827,-472.762604016],[-226.567798031,-486.031224238],[-185.650827155,-535.219498365],[-137.70512177,-593.823496298],[-115.918606908,-610.945012936],[-79.109559846,-633.618253515],[-63.514822042,-639.258805041],[-16.090079969,-652.194321826],[88.452737917,-680.696872545],[117.83165251,-688.702458469],[143.128264434,-692.255561792],[156.229210651,-692.555354885],[175.812306919,-567.41949723],[178.750198379,-553.429152895],langrun,[197.692765984,-555.705359711]];
const foreignRail=[[197.692765984,-555.705359711],[237.226194952,-559.935773355],[249.959904736,-452.243432326],[253.879940143,-421.986536841],[260.319388283,-423.685364368]];
const hospitalRail=[[260.319388283,-423.685364368],[417.189127595,-438.219777648]];
const openings=[{id:'node/10768889221',point:langrun,radius:1.1},{id:'node/10080038172',point:small,radius:3},{id:'node/10709402503',point:northEast,radius:4.5}];
const lines=[{source:'way/1101490170',style:'rubble',height:2.1,points:wall},{source:'way/1101490171',style:'north-rail',height:1.8,points:foreignRail},{source:'way/638620294',style:'north-rail',height:1.8,points:hospitalRail}];

function originalNorth(s){return s.campus&&s.source===campusId&&oldNorth.slice(1).some((c,i)=>F.distSegment(s.a,oldNorth[i],c)<.002&&F.distSegment(s.c,oldNorth[i],c)<.002);}
// Analytic cuts keep the fitted gate edges exact; deleting whole 2.4 m cells
// would leave arbitrary side bypasses. Roads never cut these physical lines.
function clipped(a,c){
 const dx=c[0]-a[0],dz=c[1]-a[1],L=dx*dx+dz*dz,cuts=[0,1];if(L<1e-14)return[];
 for(const g of openings){const x=a[0]-g.point[0],z=a[1]-g.point[1],B=2*(x*dx+z*dz),C=x*x+z*z-g.radius*g.radius,d=B*B-4*L*C;
  if(d<=0)continue;for(const t of[(-B-Math.sqrt(d))/(2*L),(-B+Math.sqrt(d))/(2*L)])if(t>0&&t<1)cuts.push(t);
 }
 cuts.sort((x,y)=>x-y);const at=t=>[a[0]+dx*t,a[1]+dz*t],out=[];
 for(let i=1;i<cuts.length;i++){if(cuts[i]-cuts[i-1]<1e-10)continue;const p=at((cuts[i]+cuts[i-1])/2);if(openings.some(g=>Math.hypot(p[0]-g.point[0],p[1]-g.point[1])<g.radius-1e-8))continue;out.push([at(cuts[i-1]),at(cuts[i])]);}
 return out;
}
function append(out,a,c,line){for(const [start,end]of clipped(a,c)){
 const n=Math.max(1,Math.ceil(Math.hypot(end[0]-start[0],end[1]-start[1])/2.4)),at=t=>start.map((v,i)=>v+(end[i]-v)*t);
 for(let j=0;j<n;j++)out.push({a:at(j/n),c:at((j+1)/n),height:line.height,mesh:false,source:line.source,pickId:0,campus:true,style:line.style,north336:true});
}}
function replaceRuns(runs,D){
 if(!D.features.some(f=>f.properties.id===campusId&&f.properties.kind==='boundary'))return runs;
 const keep=runs.filter(s=>!s.north336&&!originalNorth(s)),out=keep.slice();
 for(const line of lines)for(let i=1;i<line.points.length;i++)append(out,line.points[i-1],line.points[i],line);
 append(out,oldNorth[0],wall[0],{source:'north336-west-join',style:'rubble',height:2.1});
 // The mapped hospital fence ends north of the independently mapped vehicle
// gate. A short return meets that gate's northern end, not the area-ring corner.
 append(out,hospitalRail[1],[northEast[0],northEast[1]-4.5],{source:'north336-ne-return',style:'north-rail',height:1.8});
 // The previous gate mask can remove a whole cell beyond a fitted opening.
 // Connect to the actual surviving eastern run, without moving that run.
 const south=[northEast[0],northEast[1]+4.5],near=keep.filter(s=>s.campus).flatMap(s=>[s.a,s.c]).filter(p=>p[0]>419&&p[0]<431&&p[1]>=south[1]&&p[1]<-408).sort((a,c)=>Math.hypot(a[0]-south[0],a[1]-south[1])-Math.hypot(c[0]-south[0],c[1]-south[1]))[0];
 if(near)append(out,south,near,{source:'north336-ne-south-join',style:'north-rail',height:1.8});
 return out;
}

// Capture solid bar/arch primitives once; panels share vertex data and emit
// four instances rather than one per bar. Surface relief remains geometry.
function merged(draw){const g=new Y.Geo.Geometry(),q=new Y.Builder({add(key,mesh,m){
 const axes=[0,4,8].map(k=>m[k]*m[k]+m[k+1]*m[k+1]+m[k+2]*m[k+2]);
 for(let i=0;i<mesh.v.length;i+=8){const v=mesh.v,n=v.slice(i+3,i+6),normal=[0,1,2].map(k=>m[k]*n[0]/axes[0]+m[k+4]*n[1]/axes[1]+m[k+8]*n[2]/axes[2]);g.vertex(M.apply(m,[v[i],v[i+1],v[i+2],1]).slice(0,3),M.norm(normal),v.slice(i+6,i+8));}
 }});draw(q);return g;}
function railPanel(){return merged(q=>{
 q.box(0,.20,0,2.28,.045,.05,iron,29);q.box(0,1.60,0,1.94,.052,.065,iron,29);
 for(const side of[-1,1])q.beam([side*.97,1.60,0],[side*1.14,1.77,0],.025,iron,29);
 for(let j=0;j<13;j++)q.box(-1.08+j*.18,.895,0,.022,1.39,.027,iron,29);
 // Open, tall U-shaped straps seen along the hospital and external lane.
 for(let j=0;j<6;j++){const x=-.9+j*.36,r=.057;for(const side of[-1,1])q.box(x+side*r,1.16,.02,.013,.87,.016,iron,29);
  for(let k=0;k<10;k++){const a=Math.PI+k*Math.PI/10,c=a+Math.PI/10;q.beam([x+r*Math.cos(a),.725+r*Math.sin(a),.02],[x+r*Math.cos(c),.725+r*Math.sin(c),.02],.008,iron,29);}
 }
 });}
function railPost(){return merged(q=>{q.box(0,.94,0,.095,1.88,.095,iron,29);q.box(0,1.88,0,.15,.075,.15,iron,29);q.box(0,.10,0,.16,.20,.16,iron,29);});}
function renderRail(b,len,s){
 const h=(s?.height||1.8)/1.8;
 b.box(0,.10,0,len,.20,.26,'#92998c',10);
 const panel=b.geo('north336-rail-panel',railPanel),post=b.geo('north336-rail-post',railPost);
 b.mesh('north336-rail-panel',panel,0,0,0,len/2.4,h,1,iron,29);
 for(const x of[-len/2,len/2])b.mesh('north336-rail-post',post,x,0,0,1,h,1,iron,29);
}
function archShell(){const g=new Y.Geo.Geometry(),h=x=>2.63+.34*Math.cos(x/1.15*Math.PI/2),N=24;
 for(let i=0;i<N;i++){const a=-1.15+i*2.3/N,c=a+2.3/N,ya=h(a),yc=h(c);
  g.quad([a,ya,-1.20],[a,ya,1.20],[c,yc,1.20],[c,yc,-1.20]);g.quad([c,yc-.035,-1.20],[c,yc-.035,1.20],[a,ya-.035,1.20],[a,ya-.035,-1.20]);
  for(const z of[-1.20,1.20]){const p=[[a,ya,z],[c,yc,z],[c,yc-.035,z],[a,ya-.035,z]];if(z>0)p.reverse();g.quad(...p);}
 }return g;}
function archFrame(){return merged(q=>{
 const h=x=>2.63+.34*Math.cos(x/1.15*Math.PI/2);
 for(const x of[-1.15,1.15])for(const z of[-1.12,1.12])q.box(x,1.305,z,.072,2.71,.072,iron,29);
 for(const z of[-1.20,0,1.20])for(let i=0;i<24;i++){const a=-1.15+i*2.3/24,c=a+2.3/24;q.beam([a,h(a)+.014,z],[c,h(c)+.014,z],.027,iron,29);}
 for(const x of[-1.15,-.58,0,.58,1.15])q.box(x,h(x)+.014,0,.048,.048,2.46,iron,29);
 });}
function screen(b,x,w,h=2.35){
 for(const edge of[-1,1])b.box(x+edge*w/2,h/2,0,.075,h,.075,iron,29);
 for(const y of[.18,h-.10])b.box(x,y,0,w,.055,.06,iron,29);
 for(let i=1,n=Math.ceil(w/.15);i<n;i++)b.box(x-w/2+w*i/n,h/2,0,.025,h-.20,.032,iron,29);
}
function smallGate(b){
 // Western pedestrian canopy: the 2024 overall outline is identifiable.
 // Do not invent the separately changed 2026 eastern turnstile/cabinet layout.
 b.mesh('north336-small-arch-shell',b.geo('north336-small-arch-shell',archShell),-1.8,0,0,1,1,1,'#a4b3b3',28);
 b.mesh('north336-small-arch-frame',b.geo('north336-small-arch-frame',archFrame),-1.8,0,0,1,1,1,iron,29);
 for(const x of[-2.68,-.92]){b.box(x,.51,0,.28,1.02,1.24,'#adb8b4',29);b.box(x,1.04,-.12,.22,.075,.36,'#4b5856',28);}
 screen(b,-2.98,.12);screen(b,2.98,.12);
 // Low white road-side barrier is a dated display pose, not a claim of access.
 for(const x of[-.48,2.90])b.box(x,.57,0,.07,1.14,.075,'#c5cac3',29);
 for(const y of[.21,1.03])b.box(1.21,y,0,3.38,.055,.065,'#c5cac3',29);
 for(let i=1;i<13;i++)b.box(-.48+i*3.38/13,.62,0,.025,.80,.033,'#c5cac3',29);
}
function northEastGate(b){
 // Positive local x is north; positive local z faces the public street.
 const silver='#b3bbb3';
 for(const x of[-4.5,4.5])b.box(x,.61,0,.19,1.22,.24,silver,29);
 for(const side of[-1,1]){
  b.box(side*2.60,1.04,0,3.55,.085,.075,'#deded1',29);
  for(let i=0;i<4;i++)b.box(side*(1.13+i*.75),1.04,.043,.28,.086,.018,'#a16a59',29);
 }
 // Short longitudinal road divider; no unverified lettering or traffic sign.
 for(const z of[-2.6,-1.0,.6])b.box(0,.48,z,.05,.96,.05,silver,29);
 for(const y of[.20,.86])b.box(0,y,-1,.05,.05,3.2,silver,29);
 for(let z=-2.4;z<.6;z+=.23)b.box(0,.53,z,.025,.63,.025,silver,29);
 // The northern booth is visible in the registered 2023 west-facing view.
 b.box(5.45,.41,-.85,1.32,.82,1.65,'#b3b5a5',29);
 for(const x of[4.79,6.11])for(const z of[-1.675,-.025])b.box(x,1.14,z,.055,2.28,.055,silver,29);
 for(const z of[-1.66,-.04])b.box(5.45,1.55,z,1.23,1.34,.025,'#738781',28);
 for(const x of[4.8,6.10])b.box(x,1.55,-.85,.025,1.34,1.55,'#738781',28);
 b.box(5.45,2.28,-.85,1.48,.10,1.81,'#cacbc0',29);
}
const specs=[{id:'node/10080038172',pickId:1336,point:small,rotation:smallRotation,name:'小东门',height:3.1,width:6,
 summary:'医院西端与经济学院之间的入口；2024深色金属框、弧形雨棚和低门控。',
 limits:'点位来自地图，门廊按2024官方图拟合；2026报道确认东侧闸机和道路再次改造，其精确位置、数量和快递柜区尚未据图定位。尺寸非实测，当前通行规则未核。',
 references:[{title:'总务部2024小东门改造记录',url:'https://zwb.pku.edu.cn/zwdt/xwdt/50120zwb383579.htm'},{title:'2026东侧闸机与快递外卖区调整',url:'https://news.pku.edu.cn/info/7921/3209371.htm'}]},
 {id:'node/10709402503',pickId:1337,point:northEast,rotation:Math.PI/2,name:'东北侧通道（地图门点）',height:2.5,width:9,
 summary:'医院与博雅、科技园相关楼群之间接近道路的车行门控；与小东门分别表示。',
 limits:'源地图未命名。低道杆、分隔栏与北侧小岗亭按2023注册街景拟合；不据此认定为校医院便民通道或公开校门，尺寸及当前通行规则未核。',
 references:[{title:'2023西向注册街景',url:'https://mapsv0.bdimg.com/?qt=pr3d&fovy=40&quality=100&width=1024&height=768&panoid=0900220012230110131741490AP&heading=266.3&pitch=0'}]}];
for(const s of specs){if(Y.CAMPUS.features.some(f=>f.properties.id===s.id))continue;
 if(Y.CAMPUS.features.some(f=>f.properties.pickId===s.pickId))throw Error('Reserved north gate pick ID is already used: '+s.pickId);
 const p=s.point;Y.CAMPUS.features.push({type:'Feature',geometry:{type:'Point',coordinates:p.slice()},properties:{id:s.id,pickId:s.pickId,kind:'gate',name:s.name,label:s.name,category:'校门',tags:{barrier:s.id==='node/10080038172'?'border_control':'gate',...(s.id==='node/10080038172'?{name:'小东门'}:{})},source:'OpenStreetMap / registered photographs',url:'https://www.openstreetmap.org/'+s.id,centre:p.slice(),bounds:[...p,...p],height:s.height,width:s.width,displayRadius:12,rotation:s.rotation,gate33:true,reviewed:false,confidence:'coordinate-reference-not-survey',heightSource:'定向影像比例拟合，非实测',architecture:{summary:s.summary,limits:s.limits},scopeNote:s.limits,references:s.references,frontObservation46:{target:[p[0],1.45,p[1]],bounds:s.id==='node/10080038172'?[253.7,.02,-424.9,260.3,3.2,-420.7]:[p[0]-6,.02,p[1]-7,p[0]+6,3.2,p[1]+7],yaw:s.id==='node/10080038172'?Math.PI+.06:s.rotation,elevation:.15}}});
}
const previous=Y.Gates33.render;
function render(b,f){const s=specs.find(s=>s.id===f.properties.id);if(!s)return previous.call(this,b,f);
 const old=[b.origin,b.rotation,b.id,b.anim],p=f.geometry.coordinates;b.origin=[p[0],.12,p[1]];b.rotation=s.rotation;b.id=f.properties.pickId;b.anim=0;
 try{if(s.id==='node/10080038172')smallGate(b);else northEastGate(b);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{profile:s.id==='node/10080038172'?'small-east-official2024-outline':'northeast-vehicle-control-street2023',currentAccessVerified:false,east2026PlacementVerified:false};
}
Y.Gates33.render=render;Y.Perimeter336North={replaceRuns,renderRail,lines,openings,render};
})(YY);
