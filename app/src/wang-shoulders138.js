/* Review candidate: two photographed stone high bays, projecting return and
 * lower outer glass corner. South position/return depth and the hidden back
 * termination are proportional fits, not surveyed/as-built plan claims.
 * Existing northern shoulder portions and the central crown remain intact. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const baseY=13.45,lowY=61.05,storey=47.6/12,highY=lowY+storey,frontZ=20.5,returnZ=14.5,splitX=20,capH=.18;
function prism(points,lo,hi){const p=points.slice();if(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0)<0)p.reverse();const g=new G.Geometry(),top=G.polygon(p,hi);g.v.push(...top.v);for(let i=0;i<top.v.length;i+=24){const a=top.v.slice(i,i+3),b=top.v.slice(i+8,i+11),c=top.v.slice(i+16,i+19);g.tri([c[0],lo,c[2]],[b[0],lo,b[2]],[a[0],lo,a[2]]);}for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];g.quad([a[0],lo,a[1]],[a[0],hi,a[1]],[b[0],hi,b[1]],[b[0],lo,b[1]]);}return g;}
P.wangTower30=function(){const grid=Y.WangStoreys160,lowY=grid?grid.shoulderLow:Y.WangShoulders138.lowY,storey=grid?grid.step:Y.WangShoulders138.storey,shoulderRows=grid?14:12;const box=this.v16box,face=this.v16TowerFace;
 this.v16box=function(k,x,y,z,w,h,d,c,mat,part){
  if(k==='v16-wang-setback-core'&&(x===-18||x===18)){const back=z-d/2;return box.call(this,'wang-shoulders138-supported-body',x,y,(back+frontZ)/2,w,h,frontZ-back,c,mat,part);}
  if(k==='wang-shoulders134-coping')return;
  return box.call(this,k,x,y,z,w,h,d,c,mat,part);
 };
 this.v16TowerFace=function(k,x,y,z,w,h,bays,rows,r){if(k==='v16-wang-tower'&&(x===-18||x===18)&&r===0&&w===10&&h===47.6)return;return face.call(this,k,x,y,z,w,h,bays,rows,r);};
 try{previous.call(this);}finally{this.v16box=box;this.v16TowerFace=face;}
 for(const s of[-1,1]){
  const back=s<0?-12.5:-14.5,stoneX=s*16.5;
  // Continuous support reaches the unchanged base, not a floating upper screen.
  face.call(this,'wang-shoulders138-front',stoneX,baseY,frontZ,7,lowY-baseY,2,shoulderRows,0);
  box.call(this,'wang-shoulders138-high-stone',stoneX,(lowY+highY)/2,(returnZ+frontZ)/2,7,highY-lowY,frontZ-returnZ,'#aaa99d',24,.78);
  face.call(this,'wang-shoulders138-high-front',stoneX,lowY,frontZ,7,highY-lowY,2,1,0);
  // Side return into the core silhouette is plain masonry; unseen carvings or
  // extra window bays are not inferred. Existing side/back facades are kept.
  box.call(this,'wang-shoulders138-inner-return',s*13,(baseY+lowY)/2,(returnZ+frontZ)/2,.13,lowY-baseY,frontZ-returnZ,'#aaa99d',24,.78);
  const pane=this.geo('wang-shoulders138-pane',G.plane),lo=baseY+.12,hi=lowY-.14;
  this.mesh('wang-shoulders138-glass-front',pane,s*21.5,(lo+hi)/2,frontZ+.045,3,hi-lo,1,'#81908d',28,1.05);
  this.local(s*23,0,(back+27+frontZ)/2,s*Math.PI/2,()=>{
   this.mesh('wang-shoulders138-glass-side',pane,0,(lo+hi)/2,.045,frontZ-(back+27),hi-lo,1,'#81908d',28,1.05);
   for(let j=0;j<=shoulderRows;j++)box.call(this,'wang-shoulders138-side-crossbar',0,baseY+j*storey,.095,frontZ-(back+27),.095,.13,'#a9b9bb',29,1.08);
   for(const a of[-1,0,1])box.call(this,'wang-shoulders138-side-fin',a*(frontZ-(back+27))/2,(lo+hi)/2,.10,.07,hi-lo,.20,'#bbc6c3',29,1.10);
  });
  for(let j=0;j<=shoulderRows;j++)box.call(this,'wang-shoulders138-front-crossbar',s*21.5,baseY+j*storey,frontZ+.095,3,.095,.13,'#a9b9bb',29,1.08);
  for(const x of[20,21.5,23])box.call(this,'wang-shoulders138-front-fin',s*x,(lo+hi)/2,frontZ+.10,.07,hi-lo,.20,'#bbc6c3',29,1.10);
  const poly=[[12.45,back-.55],[23.12,back-.55],[23.12,frontZ+.12],[splitX,frontZ+.12],[splitX,returnZ],[12.45,returnZ]].map(p=>[s*p[0],p[1]]);
  this.mesh('wang-shoulders138-low-coping-'+s,this.geo('wang-shoulders138-low-coping-'+s,()=>prism(poly,lowY,lowY+capH)),0,0,0,1,1,1,'#d1d4ce',29,1.6);
  box.call(this,'wang-shoulders138-high-coping',stoneX,highY+capH/2,(returnZ+frontZ)/2,7.24,capH,frontZ-returnZ+.24,'#d1d4ce',29,1.6);
 }
};Y.WangShoulders138={baseY,lowY,highY,storey,frontZ,returnZ,splitX,capH,frontFit:'photo-vanishing-directions-and-bay-proportions',rearTermination:'occlusion-edge-fit-not-independent-survey',scope:'south-projecting-shoulder-bays-with-continuous-support',source:'https://www.huitu.com/photo/show/20191217/200528325035.html',parameterSensitivity:{frontZ:[19.5,21.5],returnZ:[13.5,15.5]},reviewCandidate:true};
})(YY);
