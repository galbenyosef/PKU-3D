/* East side gate node/3087450720, west-looking January 2023 panorama.
 * Unequal blue barrel canopies, slender silver frames and a vehicle checkpoint.
 * All dimensions are photo fits; obscured access hardware is intentionally unresolved. */
(function(Y){'use strict';
 const previous=Y.Gates33.render,silver='#aab9b8',blue='#43869d';
 // Unit barrel shell includes its shallow blue front and rear arched fascias.
 function canopy(){const g=new Y.Geo.Geometry(),N=32,h=x=>Math.sqrt(Math.max(0,1-4*x*x));
  for(let i=0;i<N;i++){const a=-.5+i/N,b=a+1/N,ya=h(a),yb=h(b);
   g.quad([a,ya,-.5],[a,ya,.5],[b,yb,.5],[b,yb,-.5]);
   g.quad([b,yb-.045,-.5],[b,yb-.045,.5],[a,ya-.045,.5],[a,ya-.045,-.5]);
   for(const z of[-.5,.5]){const p=[[a,0,z],[b,0,z],[b,yb,z],[a,ya,z]];if(z<0)p.reverse();g.quad(...p);}
  }return g;
 }
 // Join the existing scene's ground: campus .02m, outside basemap .01m,
 // road .12m. The gate anchor stays at .12m; only buried lower ends change.
 // These are model-ground contacts, not measured site elevations.
 function post(b,x,z,h,w,drop){b.box(x,(h-drop)/2,z,w,h+drop,w,silver,29);}
 function shelter(b,x,z,w,d,h,rise){
  b.mesh('gate765-blue-barrel-shell',b.geo('gate765-blue-barrel-shell',canopy),x,h,z,w,rise,d,blue,29);
  for(const dz of[-d/2,d/2]){
   for(const dx of[-w/2,0,w/2])post(b,x+dx,z+dz,h,.075,dz<0?.10:.11);
   b.box(x,h,z+dz,w,.075,.075,silver,29);
   for(let i=0;i<24;i++){const a=-w/2+i*w/24,c=a+w/24,top=q=>h+rise*Math.sqrt(Math.max(0,1-(2*q/w)**2));b.beam([x+a,top(a),z+dz],[x+c,top(c),z+dz],.025,silver,29);}
   // Fascia dividers, not a count of passage gates beneath the shelter.
   for(const dx of[-w/3,-w/6,w/6,w/3]){const a=rise*Math.sqrt(1-(2*dx/w)**2);b.box(x+dx,h+a/2,z+dz,.028,a,.035,silver,29);}
  }
  for(const dx of[-w/2,w/2])b.box(x+dx,h,z,.07,.075,d,silver,29);
 }
 function booth(b,x,z,w,d,h,color){
  const north=x>5,drop=north?.11:.10;
  b.box(x,(.86-drop)/2,z,w,.86+drop,d,color,29);
  for(const dx of[-w/2,w/2])for(const dz of[-d/2,d/2])post(b,x+dx,z+dz,h,.065,north?(dz<0?.10:.11):(dx<0?0:.10));
  for(const dz of[-d/2,d/2]){b.box(x,1.59,z+dz,w-.08,1.42,.026,'#536e70',28);b.box(x,1.59,z+dz,.045,1.42,.045,silver,29);}
  for(const dx of[-w/2,w/2])b.box(x+dx,1.59,z,.026,1.42,d-.08,'#536e70',28);
  for(const y of[.9,2.32])b.box(x,y,z,w+.09,.065,d+.09,silver,29);
  b.box(x,h,z,w+.22,.10,d+.22,'#b0b8ad',29);
 }
 function gate(b){
  // Local x increases north; positive local z faces the public road (east).
  shelter(b,-6.15,-.4,6.0,4.3,3.0,.64);
  shelter(b,6.15,-.3,4.65,4.1,2.78,.64);
  // Blue-grey enclosed volume visible beside/behind the northern canopy.
  booth(b,9.35,-1.15,1.75,2.45,2.49,'#557e86');
  shelter(b,9.35,-1.15,2.02,2.7,2.54,.42);
  booth(b,2.58,-1.2,1.38,1.48,2.50,'#b0ada0');
  // Visible raised vehicle arm; historical reference pose, not current access.
  b.box(1.55,.47,.1,.28,1.14,.32,'#b2b5a9',29);
  b.beam([1.55,.94,.1],[1.43,3.52,.1],.04,'#d6d5bf',29);
 }
 Y.Gates33.render=function(b,f){
  if(f.properties.pickId!==765||f.properties.id!=='node/3087450720')return previous.call(this,b,f);
  const old=[b.origin,b.rotation,b.id,b.anim],q=f.geometry.coordinates;
  b.origin=[q[0],.12,q[1]];b.rotation=Math.PI/2;b.id=765;b.anim=0;
  try{gate(b);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
  return {profile:'east-side-unequal-blue-canopies-photo2023',evidenceEpoch:2023,rotation:Math.PI/2};
 };
 Y.Gate765Details={canopy};
 const f=Y.CAMPUS.features.find(f=>f.properties.pickId===765&&f.properties.id==='node/3087450720');
 if(f){const p=f.properties;p.height=3.76;p.heightSource='2023 年向西定向历史街景拟合，非实测';p.displayRadius=15;
  p.architecture={...p.architecture,summary:'车行口两侧不等宽蓝色浅弧棚、银色细框及北侧蓝灰岗亭。'};
  p.scopeNote='公开地图点位保留；按 2023 年历史街景拟合外侧可辨轮廓，宽高进深和遮挡面未测绘，棚下隐藏闸机与二道伸缩门未复原，最新通行状态未核。';
  const [x,z]=f.geometry.coordinates;p.frontObservation46={target:[x-.4,1.8,z-.8],bounds:[x-3.7,.12,z-10.5,x+1.9,3.76,z+9.3],yaw:Math.PI/2,elevation:.16};
 }
})(YY);
