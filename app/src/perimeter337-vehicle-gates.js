/* Southeast Gate: the visible southern silver retractable control in the
 * registered 2023 street view. Dimensions and partial retraction are display
 * fits; the obscured northern section and 2026 parcel facilities are unresolved.
 * Load after the existing gate wrappers to retain both blue shelters/end faces. */
(function(Y){'use strict';
const previous=Y.Gates33.render,M=Y.M,key='perimeter337-se-silver';
function silver(){
 const g=new Y.Geo.Geometry(),q=new Y.Builder({add(k,mesh,m){
  const axes=[0,4,8].map(k=>m[k]*m[k]+m[k+1]*m[k+1]+m[k+2]*m[k+2]);
  for(let i=0;i<mesh.v.length;i+=8){const v=mesh.v,n=v.slice(i+3,i+6),normal=[0,1,2].map(k=>m[k]*n[0]/axes[0]+m[k+4]*n[1]/axes[1]+m[k+8]*n[2]/axes[2]);g.vertex(M.apply(m,[v[i],v[i+1],v[i+2],1]).slice(0,3),M.norm(normal),v.slice(i+6,i+8));}
 }}),a=-4.95,c=-1.95,n=10,step=(c-a)/n,col='#aeb8b5';
 for(const z of[-.16,.16]){
  for(let i=0;i<=n;i++){const x=a+i*step;q.box(x,.66,z,.034,1.06,.042,col,29);}
  for(let i=0;i<n;i++){const x=a+i*step;for(const reverse of[false,true])q.beam([x,reverse?.98:.24,z],[x+step,reverse?.24:.98,z],.019,col,29);}
 }
 for(let i=0;i<=n;i++){const x=a+i*step;q.box(x,1.20,0,.05,.04,.37,col,29);}
 return g;
}
function southControl(b){
 // Negative local x is south. The shelter's inner edge is -5.3; this fitted
 // three-metre partial stack stays inside the existing central vehicle gap.
 b.mesh(key,b.geo(key,silver),0,0,2.25,1,1,1,'#aeb8b5',29);
 b.box(-1.84,.68,2.25,.22,1.24,.43,'#303936',29);
 // Plain red display strip, with no invented readable message.
 b.box(-1.84,1.16,2.473,.19,.075,.024,'#a33e39',29);
 const wheel=b.geo('perimeter337-se-wheel',()=>{const g=Y.Geo.cylinder(12,1);for(let i=0;i<g.v.length;i+=8){const y=g.v[i+1],ny=g.v[i+4];g.v[i+1]=-g.v[i+2];g.v[i+2]=y;g.v[i+4]=-g.v[i+5];g.v[i+5]=ny;}return g;});
 for(const x of[-4.91,-1.96])for(const z of[2.06,2.44])b.mesh('perimeter337-se-wheel',wheel,x,.12,z-.035,.085,.11,.07,'#303936',29);
}
Y.Gates33.render=function(b,f){
 if(f.properties.pickId!==766||f.properties.id!=='node/6018578781')return previous.call(this,b,f);
 const result=previous.call(this,b,f),old=[b.origin,b.rotation,b.id,b.anim],p=f.geometry.coordinates;
 b.origin=[p[0],.12,p[1]];b.rotation=Math.PI/2;b.id=766;b.anim=0;
 try{southControl(b);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {...result,vehicleControl:'visible-south-retractable-photo2023',currentAccessVerified:false};
};
Y.Perimeter337VehicleGates={silver};
const f=Y.CAMPUS.features.find(f=>f.properties.pickId===766&&f.properties.id==='node/6018578781');
if(f){const p=f.properties;p.architecture={...p.architecture,summary:'南北两组蓝色弧形雨棚及南侧可辨的银灰伸缩车行门控。',limits:'双棚沿用既有细部；南侧伸缩门按2023街景作局部收拢显示，尺寸及间距为拟合；北半遮挡门段与2026新增快递柜未复原。'};p.scopeNote='公开地图点位保留；注册2023街景同时可见南北两组棚，每组三条通道沿用既有反馈。门控显示姿态不表示当前通行状态，2026年南侧应急通道新增快递柜及货架的精确位置待核。';}
})(YY);
