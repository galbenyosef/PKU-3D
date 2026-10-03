/* South Qiu gate, node/10729924621: east-facing January 2023 street panorama.
 * Registered by Yanyuan Building on the south and Qiu Gymnasium on the north.
 * Widths, heights, depth and hidden faces are photo fits, not surveyed dimensions.
 * Closed leaves and cones represent the reference image, not current access. */
(function(Y){'use strict';
 const previous=Y.Gates33.render,iron='#36433d',trim='#65776a';
 function merged(draw){
  const g=new Y.Geo.Geometry(),M=Y.M;
  draw(new Y.Builder({add(k,a,m){
   const scale=[0,4,8].map(k=>m[k]**2+m[k+1]**2+m[k+2]**2);
   for(let i=0;i<a.v.length;i+=8){const n=a.v.slice(i+3,i+6),normal=[0,1,2].map(j=>m[j]*n[0]/scale[0]+m[j+4]*n[1]/scale[1]+m[j+8]*n[2]/scale[2]);g.vertex(M.apply(m,[...a.v.slice(i,i+3),1]).slice(0,3),M.norm(normal),a.v.slice(i+6,i+8));}
  }}));return g;
 }
 function spike(){const g=new Y.Geo.Geometry(),p=[[-1,0,0],[0,0,1],[1,0,0],[0,0,-1]];for(let i=0;i<4;i++)g.tri(p[i],p[(i+1)%4],[0,1,0]);g.quad(...p.slice().reverse());return g;}
 function leaf(){return merged(q=>{
  const w=3.4,top=x=>2.78+.38*Math.cos(x/w*Math.PI/2);
  for(const x of[0,w])q.box(x,(top(x)+.12)/2,0,.075,top(x)-.12,.085,iron,29);
  for(const y of[.16,.41,.67,1.19])q.box(w/2,y,0,w,.045,.07,iron,29);
  for(let i=1;i<18;i++){
   const x=i*w/18,h=top(x);q.box(x,(h+.18)/2,0,.028,h-.18,.035,iron,29);
   q.mesh('gate767-pointed-finial',q.geo('gate767-pointed-finial',spike),x,h,0,.047,.13,.047,iron,29);
   // Short interstitial pickets are visible only in the lower grille band.
   q.box(x-w/36,.63,0,.021,.92,.03,iron,29);
  }
  for(let i=0;i<32;i++){const a=i*w/32,b=(i+1)*w/32;q.beam([a,top(a),0],[b,top(b),0],.026,iron,29);}
 });}
 function hipRoof(){
  const g=new Y.Geo.Geometry(),a=[-1.35,0,-1.22],b=[1.35,0,-1.22],c=[1.35,0,1.22],d=[-1.35,0,1.22],u=[-.4,.38,0],v=[.4,.38,0];
  g.quad(a,u,v,b);g.tri(b,v,c);g.quad(c,v,u,d);g.tri(d,u,a);g.quad(d,a,b,c);return g;
 }
 function southBooth(b){
  const x=-4.68,z=-.15,w=2.28,d=2.12,h=2.76;
  b.box(x,.10,z,w+.14,.20,d+.14,'#69756c',10);
  b.box(x,.44,z,w,.68,d,'#45554c',29);
  for(const dx of[-w/2,w/2])for(const dz of[-d/2,d/2])b.box(x+dx,h/2,z+dz,.105,h,.105,trim,29);
  // Restrained dark glazing; the photograph does not resolve the interior.
  for(const dz of[-d/2,d/2]){
   b.box(x,1.67,z+dz,w-.13,1.65,.026,'#35494b',28);
   for(const dx of[-.42,.42])b.box(x+dx,1.7,z+dz+.018,.045,1.94,.045,trim,29);
   for(const y of[.79,2.56,2.75])b.box(x,y,z+dz,w,.065,.09,trim,29);
  }
  for(const dx of[-w/2,w/2])b.box(x+dx,1.67,z,.026,1.65,d-.13,'#35494b',28);
  b.mesh('gate767-south-hip-roof',b.geo('gate767-south-hip-roof',hipRoof),x,h,z,1,1,1,'#267586',29);
 }
 function rearShelter(b){
  // North half, set inside the gate: distinct from the south enclosed booth.
  const x=1.85,z=-3.05,w=2.8,d=2.65,h=2.85;
  for(const dx of[-w/2,w/2])for(const dz of[-d/2,d/2])b.box(x+dx,h/2,z+dz,.10,h,.10,trim,29);
  b.box(x,h,z,w+.3,.12,d+.3,'#315f80',29);
  for(const dz of[-d/2,d/2])b.box(x,h-.13,z+dz,w+.3,.22,.09,'#244967',29);
 }
 function gate(b){
  const g=b.geo('gate767-arched-iron-leaf',leaf);
  for(const r of[0,Math.PI])b.mesh('gate767-arched-iron-leaf',g,r===0?.045:-.045,0,0,1,1,1,iron,29,0,r);
  for(const x of[-3.58,3.58]){
   b.box(x,.12,0,.50,.24,.58,'#7e8172',10);
   b.box(x,1.70,0,.30,3.16,.36,'#536052',29);
   b.box(x,3.29,0,.40,.10,.46,'#7e8776',29);
   for(const y of[.42,1.55,2.65])b.cyl(x+(x<0?.16:-.16),y,0,.042,.14,iron,12,1,29);
  }
  southBooth(b);rearShelter(b);
  // Discrete foreground cones; no continuous barrier or invented access label.
  for(const x of[-5.8,-4.2,-3.55,-.6,.1,1.9,3.8,5.5]){
   b.box(x,.035,2.25,.34,.07,.34,'#3a3c37',29);
   b.cyl(x,.07,2.25,.14,.49,'#a84c39',12,.19,29);
   b.cyl(x,.25,2.25,.0983,.095,'#d7d5c2',12,.776,29);
  }
 }
 Y.Gates33.render=function(b,f){
  if(f.properties.pickId!==767||f.properties.id!=='node/10729924621')return previous.call(this,b,f);
  const saved=[b.origin,b.rotation,b.id,b.anim],q=f.geometry.coordinates;
  b.origin=[q[0],.12,q[1]];b.rotation=Math.PI/2;b.id=767;b.anim=0;
  try{gate(b);}finally{[b.origin,b.rotation,b.id,b.anim]=saved;}
  return {profile:'qiu-south-arched-iron-photo2023',evidenceEpoch:2023,rotation:Math.PI/2};
 };
 Y.Gate767Details={leaf,hipRoof};
 const f=Y.CAMPUS.features.find(f=>f.properties.pickId===767&&f.properties.id==='node/10729924621');
 if(f){const p=f.properties;p.height=3.47;p.heightSource='2023 年定向街景照片拟合，非实测';p.displayRadius=12;
  p.architecture={...p.architecture,summary:'深色浅弧顶竖杆双门，南侧蓝绿四坡顶值守亭与北侧后置蓝棚。'};
  p.scopeNote='按 2023 年向西定向历史街景拟合；保留公开地图点位，跨度、高度、进深及遮挡面未测绘，锥桶和闭门为参考图状态，最新通行状态未核。';
  const [x,z]=f.geometry.coordinates;p.frontObservation46={target:[x-.7,1.73,z+.1],bounds:[x-4.53,.12,z-5.8,x+2.43,3.47,z+6.03],yaw:Math.PI/2,elevation:.16};
 }
})(YY);
