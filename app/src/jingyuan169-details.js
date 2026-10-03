/* Courtyard 5's west gateway, matched between Yenching's Zhang Lihua
 * photograph and the explicitly labelled VCL figure 11.3. Historic appearance;
 * dimensions are fitted. The unresolvable central painting is not reproduced. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/272364823',prefix='jingyuan169-gate-';
// Road748's measured-map centre line crosses the west opening at z178.899.
const frame=()=>({centre:[-125.996+(178.899-170.394)/(188.192-170.394)*.333,178.899],r:4.725890360807});
function profile(Y,points){const g=new Y.Geo.Geometry();for(let i=0;i<points.length;i++){const a=points[i],c=points[(i+1)%points.length];g.tri([0,0,.5],[...a,.5],[...c,.5]);g.tri([0,0,-.5],[...c,-.5],[...a,-.5]);g.quad([...a,-.5],[...c,-.5],[...c,.5],[...a,.5]);}return g;}
function adorn(b){
 const red='#81382f',gold='#c0a469',blue='#315e79',green='#447b75',ink='#334847';
 const flower=profile(Y,Array.from({length:96},(_,i)=>{const a=i/96*Math.PI*2,r=.5*(1+.105*Math.cos(6*a));return[r*Math.cos(a),r*Math.sin(a)];}));
 for(const s of[-1,1]){
  b.mesh('flower',flower,s*.64,3.48,.312,.30,.34,.028,gold,20,.96);
  b.mesh('flower',flower,s*.64,3.48,.330,.261,.301,.018,blue,20,.97);
  b.box(s*1.38,4.035,.508,.24,.60,.048,ink,20,.96);
  b.box(s*1.425,4.035,.536,.10,.57,.012,blue,20,.98);
  b.box(s*1.35,4.035,.537,.044,.57,.014,green,20,.98);
 }
 // Photo-supported scalloped pendant border; its figurative painting is unresolved.
 const pp=[[-.5,.16],[.5,.16]];for(let i=0;i<=48;i++){const a=i/48*Math.PI,r=.5*(1+.026*Math.cos(a*12));pp.push([r*Math.cos(a),-.58*Math.sin(a)]);}pp.reverse();
 const pendant=profile(Y,pp);
 for(const [scale,z,c]of[[1,.5155,red],[.92,.555,gold],[.84,.572,'#babbaa'],[.76,.589,green],[.67,.606,'#7f8a83']])b.mesh('pendant',pendant,0,4.175,z,scale,scale*.75,scale===1?.065:.022,c,20,.99);
 // Gold dots and connected rectilinear edge pattern are one closed mesh.
 const g=new Y.Geo.Geometry(),unit=Y.Geo.box();
 const rect=(x,y,w,h,z=.323)=>{for(let i=0;i<unit.v.length;i+=8){g.v.push(unit.v[i]*w+x,unit.v[i+1]*h+y,unit.v[i+2]*.014+z,...unit.v.slice(i+3,i+8));}};
 for(const side of[-1,1])for(let i=0;i<6;i++){const x=side*1.285,y=3.79+i*.096;const n=16,r=.023;for(let j=0;j<n;j++){const a=j/n*Math.PI*2,d=(j+1)/n*Math.PI*2;g.tri([x,y,.534],[x+r*Math.cos(a),y+r*Math.sin(a),.534],[x+r*Math.cos(d),y+r*Math.sin(d),.534]);}}
 for(let i=0;i<15;i++){const x=-1.54+i*.22,y=4.40,w=.15,h=.13,t=.013;rect(x-w/2,y,t,h,.534);rect(x+w/2,y,t,h,.534);rect(x,y+h/2,w,t,.534);rect(x,y-h/2,w,t,.534);rect(x+.019,y,.067,t,.534);rect(x-.012,y+.018,t,.057,.534);
  b.box(x+.035,4.30,.515,.08,.075,.018,blue,20,.95);
 }
 b.mesh('gold-pattern',g,0,0,0,1,1,1,gold,20,.99);
 b.box(0,4.485,.555,4.32,.09,.055,red,20,.93);
}

// The same nine-leaf card material as Trees46, arranged in a continuous low
// clipped hedge envelope rather than solid ellipsoid crowns. Species is not asserted.
function hedge(b){
 const key='jingyuan169-hedge',bundle=b.cache[key]||(b.cache[key]=(()=>{
  const G=Y.Geo.Geometry,M=Y.M,R=M.rng(1694903),wood=new G(),light=new G(),shade=new G();
  const axis=x=>-1.135*(1-(x+8.45)/6.30)+.48;
  function stem(a,c,r){const d=M.norm(M.sub(c,a)),u=M.norm(M.cross(d,[1,0,0])),v=M.cross(d,u),n=7;
   for(let i=0;i<n;i++){const point=(p,j,k)=>M.add(p,M.add(M.mul(u,Math.cos(j/n*2*Math.PI)*r*k),M.mul(v,Math.sin(j/n*2*Math.PI)*r*k)));wood.quad(point(a,i,1),point(a,i+1,1),point(c,i+1,.38),point(c,i,.38));}
  }
  for(let i=0;i<21;i++){const x=-8.45+i*.315,z=axis(x),top=[x+.035*Math.sin(i),.82+.10*R(),z];stem([x,.015,z],top,.014);for(const side of[-1,1])stem([x,.43,z],[x+side*.11,.90+.08*R(),z+side*.18],.007);}
  const columns=96,perColumn=40;
  for(let col=0;col<columns;col++)for(let j=0;j<perColumn;j++){
   const x=-8.56+(col+R())/columns*6.54,a=R()*Math.PI*2,r=j%4===0?.35+R()*.35:.78+R()*.22;
   const center=[x,.69+Math.sin(a)*.52*r+.035*Math.sin(x*2.7),axis(x)+Math.cos(a)*.30*r];
   const n=M.norm([R()-.5,R()-.32,R()-.5]),side=M.norm(M.cross(n,Math.abs(n[1])>.95?[1,0,0]:[0,1,0])),up=M.cross(n,side),size=.045+R()*.026;
   const point=(u,v)=>M.add(center,M.add(M.mul(side,u*size),M.mul(up,v*size))),g=(col+j)%3===0?shade:light;
   g.quad(point(-1,-1),point(1,-1),point(1,1),point(-1,1),n);
  }
  return {wood,light,shade};
 })());
 b.mesh('hedge-stems',bundle.wood,0,0,0,1,1,1,'#655e47',6,.84);
 b.mesh('hedge-shade',bundle.shade,0,0,0,1,1,1,'#435f3e',46,.84);
 b.mesh('hedge-light',bundle.light,0,0,0,1,1,1,'#60794b',46,.84);
}

function gate(b){const f=frame(),add=b.e.add;
 b.e.add=function(k,g,m,c,p,uv){return add.call(this,prefix+k,g,m,c,p,uv);};
 try{b.local(f.centre[0],0,f.centre[1],f.r,()=>{
  const brick='#898d88',stone='#a2a39b',red='#81382f';
  for(const s of[-1,1]){
   b.box(s*1.63,2.05,0,.80,4.10,.92,brick,18,.7);
   b.box(s*1.63,.13,.01,.85,.26,1.00,stone,10,.7);
   b.box(s*1.21,1.64,.10,.20,3.28,.30,red,20,.9);
   // Stepped masonry shoulder, visible beside the deep red gate head.
   b.box(s*1.63,3.66,.04,.94,.18,1.06,stone,10,.85);
   b.box(s*1.63,3.81,.00,1.00,.12,1.10,brick,18,.85);
  }
  b.box(0,3.48,.08,2.60,.44,.42,red,20,.9);
  b.box(0,4.03,.03,3.23,.66,.92,red,20,.9);
  // Full-width lintel is above the walking aperture; no hidden backing wall.
  // The masonry collar reaches the piers and remains behind the painted board.
  b.box(0,4.28,0,4.14,.40,.44,brick,18,.72);
  b.box(0,4.40,.19,3.50,.16,.65,red,20,.94);
  // The shared deep dark soffit concealed the photographed painted fascia.
  // Scope its depth and rafter seating to this roof only; all tile meshes stay exact.
  const box=b.box,own=Object.hasOwn(b,'box');
  b.box=function(x,y,z,w,h,d,c,mat,part,...rest){
   if(c==='#464b46'&&y===-.15&&h===.22)d=.44;
   if(c==='#866e50'&&h===.1&&d===.74){y+=.27;z=Math.sign(z)*.43;d=.55;}
   return box.call(this,x,y,z,w,h,d,c,mat,part,...rest);
  };
  try{b.v9Roof(0,4.48,0,4.90,2.26,1.00,'gable',1.8);}finally{if(own)b.box=box;else delete b.box;}

  adorn(b);
  // Existing mapped approach is flat at .12. A nearly flush dressed threshold
  // preserves its continuous route instead of inventing the old photograph's
  // unmeasured raised courtyard grade or a stair that immediately descends.
  b.box(0,.065,.08,2.22,.13,1.00,stone,10,.91);
  // The historical graduation photo shows capped low walls at both piers.
  // Match their unseen spans to the surviving mapped front-wall ends.
  for(const [a,c]of[[[-8.60,-1.161],[-2.0,0]],[[2.0,0],[9.40,-1.161]]]){
   const dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
   b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,-Math.atan2(dz,dx),()=>{
    b.box(0,.105,0,length,.21,.53,'#92998c',18,.44);
    b.v9TigerWall(0,0,length,1.46);
   });
  }
  // Only the left hedge is visible in the independently labelled point cloud.
  hedge(b);
 });}finally{b.e.add=add;}
}
A.render=function(b,f,add){const result=prior.call(this,b,f,add);if(f.properties.id===ID&&f.properties.pickId===169){const old=b.id;b.id=169;try{gate(b);}finally{b.id=old;}}return result;};
Y.Jingyuan169Details={id:ID,prefix,frame};
})(YY);
