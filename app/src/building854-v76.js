/* Changchunyuan dining hall: east facade located by three roadside panoramas.
 * Exact OSM perimeter; three documented storeys. Dimensions and unseen windows
 * remain fitted. No southern short-face entrance, invented rear doors or plant. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/849765887';
const O=[-526.617,-112.489],L=Math.hypot(7.507,68.641),C=7.507/L,S=-68.641/L,R=Math.atan2(S,C),H=15.285;
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const palette={wall:'#898581',stone:'#b8b9b4',frame:'#b9c2c1',metal:'#626f72',glass:'#7d9397',dark:'#334348'};
const east=[{x:33.3,w:27,lo:4.70,hi:14.95,type:'main'},{x:9.3,w:13.6,lo:.85,hi:14.90,type:'northGlass'},{x:64.1,w:1.9,lo:.85,hi:14.50,type:'strip'},{x:21.6,w:3.8,lo:.45,hi:3.40,type:'door'}];
for(const x of[26,30.4,34.8,39.2,43.6])east.push({x,w:1.08,lo:.80,hi:3.90,type:'slit'});
for(const x of[50.3,55.0,59.7])for(let f=0;f<3;f++)east.push({x,w:2.25,lo:.85+f*4.9,hi:3.80+f*4.9,type:'window'});
function render(b,f,add){
 const id=f.properties.pickId,ring=f.geometry.coordinates[0].slice(0,-1).map(local),area=ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0);if(area>0)ring.reverse();
 const p=(u,y,v)=>{const q=world(u,v);return[q[0],y,q[1]];},surfaces=[];
 for(let i=0;i<ring.length;i++){
  const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),du=(c[0]-a[0])/len,dv=(c[1]-a[1])/len,front=Math.abs(a[1])<.02&&Math.abs(c[1])<.02;
  const holes=[];
  if(front)for(const q of east){const x=(q.x-a[0])/du;const left=Math.max(0,x-q.w/2),right=Math.min(len,x+q.w/2);if(right>left)holes.push({...q,x:(left+right)/2,w:right-left});}
  else if(len>7){const count=Math.max(1,Math.floor(len/5.2));for(let k=0;k<count;k++)for(let floor=0;floor<3;floor++)holes.push({x:len*(k+.5)/count,w:Math.min(2.3,len/count*.52),lo:.85+floor*4.9,hi:3.80+floor*4.9,type:'approximate'});}
  const at=(x,y,depth=0)=>p(a[0]+du*x-dv*depth,y,a[1]+dv*x+du*depth),g=new G.Geometry(),ys=[0,H,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b);
  for(let j=1;j<ys.length;j++){const lo=ys[j-1],hi=ys[j];if(hi-lo<1e-7)continue;const spans=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).map(q=>[q.x-q.w/2,q.x+q.w/2]).sort((a,b)=>a[0]-b[0]);let cursor=0;for(const [l,r]of[...spans,[len,len]]){if(l>cursor)g.quad(at(cursor,lo),at(l,lo),at(l,hi),at(cursor,hi));cursor=Math.max(cursor,r);}}
  add('854-shell-'+i,g,palette.wall,27,id);
  surfaces.push({a,c,len,du,dv,front,holes});
  if(!front){const glass=new G.Geometry(),frame=new G.Geometry();for(const q of holes){const l=q.x-q.w/2,r=q.x+q.w/2;glass.quad(at(l,q.lo,-.075),at(r,q.lo,-.075),at(r,q.hi,-.075),at(l,q.hi,-.075));for(const x of[l,(l+r)/2,r])frame.quad(at(x-.035,q.lo,.035),at(x+.035,q.lo,.035),at(x+.035,q.hi,.035),at(x-.035,q.hi,.035));for(const y of[q.lo,q.hi-.44,q.hi])frame.quad(at(l,y-.035,.035),at(r,y-.035,.035),at(r,y+.035,.035),at(l,y+.035,.035));}if(glass.v.length){add('854-unverified-glass-'+i,glass,palette.glass,5,id);add('854-unverified-frame-'+i,frame,palette.metal,9,id);}}
 }
 add('854-roof',G.polygon(f.geometry.coordinates[0].slice(0,-1),H), '#969995',22,id);
 b.id=id;b.local(O[0],0,O[1],R,()=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'854-detail-'+k,...args);};try{
  // Original stepped perimeter remains exact. No full box seals the east openings.
  for(const edge of surfaces){const{a,c,len}=edge,ang=Math.atan2(-(c[1]-a[1]),c[0]-a[0]);b.box((a[0]+c[0])/2,H+.12,(a[1]+c[1])/2,len,.24,.26,palette.wall,27,0,ang);b.box((a[0]+c[0])/2,H+.28,(a[1]+c[1])/2,len+.02,.07,.34,palette.stone,24,0,ang);}
  for(const q of east){const lo=q.lo,hi=q.hi,l=q.x-q.w/2,r=q.x+q.w/2;
   b.box(q.x,(lo+hi)/2,.105,q.w,hi-lo,.10,palette.glass,5);
   // A 0.22m jamb return gives each opening real wall depth.
   for(const x of[l-.045,r+.045])b.box(x,(lo+hi)/2,.075,.09,hi-lo,.24,palette.wall,27);
   for(const y of[lo-.045,hi+.045])b.box(q.x,y,.075,q.w+.18,.09,.24,palette.wall,27);
   const thick=q.type==='main'?.40:.10,depth=q.type==='main'?.65:.23,face=q.type==='main'?-.25:-.06;
   for(const x of[l,r])b.box(x,(lo+hi)/2,face,thick,hi-lo+thick,depth,palette.frame,9);
   for(const y of[lo,hi])b.box(q.x,y,face,q.w+thick,thick,depth,palette.frame,9);
   const columns=q.type==='main'?10:q.type==='northGlass'?5:q.type==='door'?4:q.type==='strip'?1:2,rows=q.type==='main'?6:q.type==='northGlass'?9:q.type==='strip'?9:2;
   for(let k=1;k<columns;k++)b.box(l+q.w*k/columns,(lo+hi)/2,-.025,.047,hi-lo,.14,palette.metal,9);
   for(let k=1;k<rows;k++)b.box(q.x,lo+(hi-lo)*k/rows,-.025,q.w,.048,.14,palette.metal,9);
   if(q.type==='door'){for(const x of[q.x-.12,q.x+.12])b.box(x,1.48,-.14,.033,.47,.055,palette.frame,9);}
  }
  // Continuous eastern glass canopy, supported back to masonry by steel arms.
  const start=19.5,end=47.3,depth=2.45,y=4.25;
  b.box((start+end)/2,y,-depth/2,end-start,.08,depth,'#9aafb0',5);
  for(const v of[-depth,-.10])b.box((start+end)/2,y-.12,v,end-start+.12,.16,.13,palette.metal,9);
  for(let k=0;k<=10;k++){const u=start+(end-start)*k/10;b.box(u,y-.12,-depth/2,.105,.16,depth,palette.metal,9);b.beam([u,4.55,.12],[u,y-.20,-depth+.10],.075,palette.metal,9);}
  // Existing transparent lettering atlas: the measured facade reads left-to-right
  // from south to north. Only the permanent name is copied, not temporary banners.
  const labels=[{x:40.4,cn:'畅',latin:'CHANG'},{x:33.3,cn:'春',latin:'CHUN'},{x:26.2,cn:'园',latin:'YUAN'}];
  const mesh=b.mesh;
  for(const q of labels){
   b.beam([q.x,4.31,-1.05],[q.x,5.39,-.58],.055,palette.metal,9);
   // Crop unused horizontal atlas margins around each single Chinese glyph.
   b.mesh=function(k,g,x,y,z,sx,sy,sz,c,mat,part,r,uv){if(k==='plane'&&mat===8&&uv){const[u,v,w,h]=uv;return mesh.call(this,k,g,x,y,z,sx*.25,sy*.75,sz,c,mat,part,r,[u+w*.375,v+h*.125,w*.25,h*.75]);}return mesh.apply(this,arguments);};
   try{b.lettering(q.cn,q.x,5.45,-.82,1.55,1.55,Math.PI,'#9c3033');}finally{b.mesh=mesh;}
   b.lettering(q.latin,q.x,4.50,-.85,4.30,.45,Math.PI,'#e3e4db');
  }
  // The broad plinth in the photo connects to the biased northern doorway.
  b.box(33.15,.225,-1.11,28.10,.45,2.20,palette.stone,24);
  b.box(21.6,.15,-2.52,4.35,.30,.62,palette.stone,24);
  b.box(21.6,.075,-3.07,4.35,.15,.62,palette.stone,24);
  // Concrete risers meet ground; no hovering slab or invented access ramp.
 }finally{b.e.add=old;}});
 return{id:ID,strategy:'building854-v76',floors:3,bodyHeight:H,height:15.6,sourceOutline:true,photoFacade:'east',eastDoor:21.6,mainGlazing:true,wallMaterial:27,permanentName:true,dimensionFitted:true,unverifiedSides:'west,north,south',limits:'East long face registered to official photograph and roadside panoramas. Three storeys documented; dimensions, glazing subdivisions and non-east generic windows fitted. Rear entrances and roof plant not invented.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building854={id:ID,render,world,local,length:L,height:H,maximumHeight:15.6,east,door:21.6};
})(YY);
