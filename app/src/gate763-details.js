/* Southwest gate: archived 2018 narrow canopy/checkpoint photograph.
 * Dimensions and the side of the booth are fitted, not a current survey. */
(function(Y){'use strict';const previous=Y.Gates33.render,G=Y.Geo,M=Y.M;
 function frame(f){const road=Y.CAMPUS.features.find(q=>q.properties.id==='way/628032111'),p=f.geometry.coordinates,points=road?.geometry.coordinates,i=points?.findIndex(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<.01);
  if(i>0&&i<points.length-1){const a=points[i-1],b=points[i+1];return Math.atan2(b[0]-a[0],b[1]-a[1]);}return 0;
 }
 function canopy(){const g=new G.Geometry(),w=3.1,d=4.4,N=124,H=(x,z)=>3.13+.025*z+.017*Math.cos(2*Math.PI*x/.155),P=(x,z,lower)=>[x,H(x,z)-(lower?.045:0),z];
  for(let i=0;i<N;i++){const a=-w/2+w*i/N,b=-w/2+w*(i+1)/N;
   g.quad(P(a,-d/2,false),P(a,d/2,false),P(b,d/2,false),P(b,-d/2,false));
   g.quad(P(b,-d/2,true),P(b,d/2,true),P(a,d/2,true),P(a,-d/2,true));
   for(const z of[-d/2,d/2]){const ps=[P(a,z,true),P(b,z,true),P(b,z,false),P(a,z,false)];if(z<0)ps.reverse();g.quad(...ps);}
  }
  for(const x of[-w/2,w/2]){const ps=[P(x,-d/2,true),P(x,d/2,true),P(x,d/2,false),P(x,-d/2,false)];if(x>0)ps.reverse();g.quad(...ps);}return g;
 }
 function model(b){const wall='#dadbd0',metal='#9ca8a4',frame='#b9c5bd',glass='#506a68';
  // Side booth and adjoining wall support the photographed canopy; no invented
  // monumental stone piers, lions, roof ornaments or historic entrance plaques.
  b.box(-2.70,.13,0,2.30,.26,4.0,'#91958d',10);
  b.box(-2.70,1.48,-1.92,2.30,2.70,.16,wall,24);
  b.box(-2.70,1.48,1.92,2.30,2.70,.16,wall,24);
  b.box(-3.77,1.48,0,.16,2.70,4,wall,24);
  b.box(-1.63,.73,0,.16,1.2,4,wall,24);
  b.box(-1.63,2.66,0,.16,.34,4,wall,24);
  for(const z of[-1.88,-.62,.62,1.88])b.box(-1.63,1.91,z,.16,1.16,.10,frame,29);
  for(const y of[1.33,2.49])b.box(-1.59,y,0,.18,.07,3.88,frame,29);
  for(const z of[-1.25,0,1.25])b.box(-1.605,1.91,z,.035,1.09,1.16,glass,5);
  b.box(-2.7,2.88,0,2.44,.14,4.12,'#c3c9bf',24);
  b.box(1.64,1.58,0,.18,3.16,4.65,'#ced1c8',24);
  for(let y=.42;y<3.0;y+=.42)b.box(1.542,y,0,.012,.012,4.65,'#a4aca3',24);
  b.mesh('gate763-corrugated-canopy',b.geo('gate763-corrugated-canopy',canopy),0,0,0,1,1,1,'#7f8982',29);
  for(const x of[-1.54,1.54])b.box(x,3.00,0,.085,.26,4.4,metal,29);
  for(const z of[-2.12,0,2.12])b.box(0,3.02+.025*z,z,3.10,.065,.07,metal,29);
  // One witnessed access-control lane, shown open; not a live access policy.
  for(const x of[-.65,.65]){
   b.box(x,.50,0,.25,1.0,.74,metal,29);
   for(const z of[-.37,.37])b.cyl(x,0,z,.125,1.0,metal,20,1,29);
   b.box(x,1.025,0,.28,.05,.78,'#bec8c1',29);
   b.box(x,1.15,-.23,.16,.21,.08,'#273d38',29);
   b.box(x,1.15,-.276,.105,.13,.009,'#60867c',5);
   b.box(x,.025,0,.34,.05,.86,'#858f87',29);
  }
 }
 Y.Gates33.render=function(b,f){if(f.properties.pickId!==763||f.properties.id!=='node/2485149510')return previous.call(this,b,f);
  const p=f.geometry.coordinates,old=[b.origin,b.rotation,b.id,b.anim],r=frame(f);
  b.origin=[p[0],.12,p[1]];b.rotation=r;b.id=763;b.anim=0;
  try{model(b);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
  return {profile:'southwest-canopy-photo2018',rotation:r,evidenceEpoch:2018,entranceState:'open display, not current access status',limits:'footway-aligned map anchor; size, booth side and hidden elevations fitted'};
 };
 const target=Y.CAMPUS.features.find(f=>f.properties.pickId===763&&f.properties.id==='node/2485149510');
 if(target){const p=target.properties;p.rotation=frame(target);p.height=3.35;p.architecture={summary:'依据2018年西南门照片表达窄通道、门岗与灰色雨棚；非现状通行认证。'};p.scopeNote='地图点位与步道不变；尺度、门岗侧别及背面为历史照片拟合，未实测。';}
 Y.Gate763Details={frame,canopy};
})(YY);
