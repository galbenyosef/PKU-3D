/* Eastern boundary fits to registered 2021/2023 street panoramas. The ring is
   a map boundary, not proof of a continuous fence. See perimeter.md. */
(function(Y){'use strict';
const gateId='node/10729924621',official='https://bwb.pku.edu.cn/ywbl/xyjt/65951255933548b2b4586a196bc384d1.htm';
const north=[[426.344,-342],[438.967,-101.108],[443.9388,-20]],front=[[477.356,589.16],[477.219,615.231],[476.938,656.58],[457.09,697.73],[457.876,740.511]];
function near(q,line){
 for(let i=1;i<line.length;i++){
  const a=line[i-1],c=line[i],dx=c[0]-a[0],dz=c[1]-a[1],t=Math.max(0,Math.min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dz)/(dx*dx+dz*dz)));
  if(Math.hypot(q[0]-a[0]-t*dx,q[1]-a[1]-t*dz)<1.2)return true;
 }
 return false;
}
function style(q){
 if(q[1]>=-342&&q[1]<=-20&&near(q,north)){
  // A photographed Law School vehicle opening is not a solid wall. Its
  // approximate limits do not establish the gate name or its current use.
  return q[1]>=-232&&q[1]<-212?'building-frontage':'tiled-wall';
 }
 if(q[1]>=589.16&&q[1]<=740.511&&near(q,front))return 'building-frontage';
 return null;
}

// One small shared coping panel retains the two sloped faces and rounded tile
// ribs. Both faces have real relief; no image or flat normal-map substitute.
function coping(){
 const g=new Y.Geo.Geometry(),W=2.4,half=.28,base=1.97,rise=.15;
 for(const side of[-1,1]){
  const z=side*half;
  const slope=[[-W/2,base,z],[W/2,base,z],[W/2,base+rise,0],[-W/2,base+rise,0]];
  g.quad(...(side>0?slope:slope.reverse()));
  // Narrow convex cover tiles alternate with broad exposed pan tiles. The
  // raised centre line and round eave ends remain visible at close range.
  for(let j=0;j<13;j++){
   const cx=-W/2+(j+.5)*W/13,r=.047;
   for(let k=0;k<8;k++){
    const a=k*Math.PI/8,c=(k+1)*Math.PI/8,point=(angle,t)=>[cx+r*Math.cos(angle),base+rise*(1-t)+r*Math.sin(angle),side*(half*t+.012)];
    const p=point(a,0),q=point(c,0),s=point(c,1),t=point(a,1);
    if(side>0)g.quad(q,s,t,p);else g.quad(p,t,s,q);
    const end=[cx,base,side*(half+.012)];
    if(side>0)g.tri(end,t,s);else g.tri(end,s,t);
   }
  }
 }
 return g;
}
function tiledWall(b,len,s){
 b.box(0,.14,0,len,.28,.44,'#92978f',10);
 b.box(0,1.10,0,len,1.80,.36,'#b7b8b0',24);
 b.box(0,1.94,0,len,.11,.46,'#92978f',10);
 const key='perimeter336-east-tile-coping';b.mesh(key,b.geo(key,coping),0,0,0,len/2.4,1,1,'#626c65',18);
}

// Merge the static ironwork once, then instance the same detailed leaf twice.
function leaf(){
 // Reuse the fully detailed 2023 closed leaf: its central/free end is higher.
 // In the oblique 2024 image that end is nearer the street, not the hinge.
 // Mirror the source so local x=0 is the hinge; reverse winding and normals
 // together, retaining every pointed finial, lower picket and original UV.
 const g=new Y.Geo.Geometry(),v=Y.Gate767Details.leaf().v;
 for(let i=0;i<v.length;i+=24)for(const j of[16,8,0])g.vertex([3.4-v[i+j],v[i+j+1],v[i+j+2]],[-v[i+j+3],v[i+j+4],v[i+j+5]],v.slice(i+j+6,i+j+8));
 return g;
}
function blueCanopy(b){
 const key='perimeter336-east-pedestrian-canopy',w=2.7,d=3.2,base=2.46,rise=.42;
 const curve=x=>base+rise*Math.sqrt(Math.max(0,1-(x/(w/2))**2));
 const g=b.geo(key,()=>{
  const a=new Y.Geo.Geometry();for(let j=0;j<28;j++){
   const x=-w/2+j*w/28,c=-w/2+(j+1)*w/28;
   a.quad([x,curve(x),-d/2],[x,curve(x),d/2],[c,curve(c),d/2],[c,curve(c),-d/2]);
   a.quad([c,curve(c),-d/2],[c,curve(c),d/2],[x,curve(x),d/2],[x,curve(x),-d/2]);
  }return a;
 });b.mesh(key,g,0,0,0,1,1,1,'#358a9b',28);
 for(const side of[-1,1])for(const z of[-d/2,d/2])b.box(side*w/2,base/2,z,.075,base,.075,'#a9b9b1',29);
 for(const z of[-d/2,d/2])for(let j=0;j<20;j++){
  const x=-w/2+j*w/20,c=-w/2+(j+1)*w/20;b.beam([x,curve(x)+.01,z],[c,curve(c)+.01,z],.028,'#b4c3bb',29);
 }
 // The southern blue roof shelters an enclosed structure, not a proven open
 // turnstile lane. Retain the earlier booth's glazing and frame detail; do not
 // invent text on the notice panel visible in the later official photograph.
 const bw=2.28,bd=2.75,frame='#849c98';
 b.box(0,.38,0,bw,.66,bd,'#45554c',29);
 for(const x of[-bw/2,bw/2])for(const z of[-bd/2,bd/2])b.box(x,1.23,z,.085,2.46,.085,frame,29);
 for(const z of[-bd/2,bd/2]){
  b.box(0,1.53,z,bw-.13,1.55,.026,'#3e6265',28);
  for(const x of[-.42,.42])b.box(x,1.54,z,.045,1.63,.055,frame,29);
  for(const y of[.75,2.32])b.box(0,y,z,bw,.065,.07,frame,29);
 }
 for(const x of[-bw/2,bw/2]){b.box(x,1.53,0,.026,1.55,bd-.13,'#3e6265',28);for(const y of[.75,2.32])b.box(x,y,0,.07,.065,bd,frame,29);}
 b.box(.65,1.62,bd/2+.028,.76,1.23,.035,'#d6d8cc',24);
}
function guardBooth(b){
 // The official view shows a separate glazed booth beyond the vehicle barrier.
 // Its offset and dimensions are photo fits, independent of the southern canopy.
 const x=1.2,z=-6.3,w=2.35,d=2.4,h=2.65,frame='#7d9695';
 b.box(x,.10,z,w+.12,.20,d+.12,'#77857e',10);
 b.box(x,.43,z,w,.66,d,'#536b69',29);
 for(const dx of[-w/2,w/2])for(const dz of[-d/2,d/2])b.box(x+dx,h/2,z+dz,.075,h,.075,frame,29);
 for(const dz of[-d/2,d/2]){
  b.box(x,1.65,z+dz,w-.10,1.72,.025,'#527374',28);
  for(const dx of[-.4,.4])b.box(x+dx,1.65,z+dz,.04,1.76,.06,frame,29);
  for(const y of[.79,2.52])b.box(x,y,z+dz,w,.06,.07,frame,29);
 }
 for(const dx of[-w/2,w/2]){
  b.box(x+dx,1.65,z,.025,1.72,d-.10,'#527374',28);
  b.box(x+dx,1.65,z,.06,1.76,.04,frame,29);
  for(const y of[.79,2.52])b.box(x+dx,y,z,.07,.06,d,frame,29);
 }
 const key='perimeter336-east-guard-roof',g=b.geo(key,()=>{
  const g=new Y.Geo.Geometry(),a=[-1.32,0,-1.35],c=[1.32,0,-1.35],d=[1.32,0,1.35],e=[-1.32,0,1.35],u=[-.28,.34,0],v=[.28,.34,0];
  g.quad(a,u,v,c);g.tri(c,v,d);g.quad(d,v,u,e);g.tri(e,u,a);g.quad(e,d,c,a);return g;
 });
 b.box(x,h-.04,z,w+.26,.08,d+.26,'#23677e',29);
 b.mesh(key,g,x,h,z,1,1,1,'#287f9f',29);
}
function yanyuan(b){
 const key='perimeter336-east-yanyuan-leaf',g=b.geo(key,leaf),angle=.34*Math.PI;
 for(const [x,r]of[[-3.58,-angle],[3.58,Math.PI+angle]]){
  b.box(x,1.57,0,.15,3.14,.18,'#4e6250',29);
  b.mesh(key,g,x,0,0,1,1,1,'#4e6250',29,0,r);
  for(const y of[.46,1.42,2.35])b.cyl(x,y,0,.07,.18,'#4e6250',12,1,29);
 }
 // The photographed enclosed blue-roof booth is on the south side, locally left
 // when looking into campus from the eastern street. Keep it within the
 // existing entrance allowance rather than widening the source road.
 b.local(-5.05,0,-1.35,0,()=>blueCanopy(b));
 guardBooth(b);
 // Paired low vehicle barriers have a partly raised display pose. No current
 // access or operating hours are implied by the gate and boom angles.
 for(const side of[-1,1]){
  const x=side*3.35,z=-1.7,tip=x-side*2.65;
  b.box(x,.57,z,.30,1.14,.34,'#c1c7bf',29);
  b.beam([x,1.04,z],[tip,2.56,z],.065,'#d1d9d2',29);
  for(let j=1;j<8;j++){
   const t=j/8,xx=x+(tip-x)*t,y=1.04+1.52*t;
   b.beam([xx,y,z],[xx,y-.31,z],.018,'#7eb1bf',29);
  }
 }
}
const previous=Y.Gates33.render;
function render(b,f){
 if(f.properties.id!==gateId)return previous(b,f);
 const old=[b.origin,b.rotation,b.id,b.anim],q=f.geometry.coordinates;
 b.origin=[q[0],.12,q[1]];b.rotation=Math.PI/2;b.id=f.properties.pickId;b.anim=0;
 try{yanyuan(b);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {profile:'yanyuan-building-gate-official2024',currentAccessVerified:false};
}
const gate=Y.CAMPUS.features.find(f=>f.properties.id===gateId);
if(gate){
 const p=gate.properties;p.aliases=[...new Set([...(p.aliases||[]),p.name,p.label,'邱门'].filter(Boolean))];
 p.name=p.label='燕园大厦门';p.height=3.4;p.heightSource='保卫部2024年入口照片比例拟合，非实测';
 const [x,z]=gate.geometry.coordinates;p.frontObservation46={target:[x-1,1.8,z],bounds:[x-9,.10,z-7,x+4,3.65,z+6.8],yaw:Math.PI/2,elevation:.19};
 p.references=[{title:'燕园大厦门入校访客停车引导 · 北京大学保卫部 · 2024-12-02',url:official},...(p.references||[])];
 p.architecture={...p.architecture,summary:'燕园大厦与体育馆间的门控入口，保留尖饰与下部细栏的弧顶双门朝街侧展开，南侧带围护蓝弧顶亭、后置蓝顶值守亭和低车行道闸。',limits:'闭门形状保留2023定向街景细节，2024官方图用于开向及两座蓝顶设施的关系；坐标沿用地图，尺寸、开启角和不可见背面为显示拟合。'};
 p.scopeNote='校方示意图及门前照片确认名称；原始地图旧名邱门保留为别名。校园门与王克桢楼前短通道分开。模型开启姿态不表示当前开放状态。';
}
Y.Gates33.render=render;Y.Perimeter336East={style,tiledWall};
})(YY);
