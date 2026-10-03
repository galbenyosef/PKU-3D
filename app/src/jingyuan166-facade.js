/* Courtyard Two, west main block's east courtyard face only.
 * 2018 PKU Youth and 2022 PKU photographs register both wing returns and path.
 * Five lower timber bays / inter-storey tiled lean-to are fitted, not surveyed.
 * The independently obscured east boundary gateway is deliberately untouched. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/272364820',prefix='jingyuan166-facade-',G=Y.Geo,M=Y.M;
function face(b,z){
 const red='#82382e',wood='#8c4435',tile='#737975';
 // Five connected lower timber bays. Centre and south-end bays have door leaves;
 // the remaining glazed upper panels sit on red timber aprons.
 for(let j=-2;j<=2;j++){
  const x=j*3.12,door=j===0||j===-2,bottom=door?.82:1.55,top=4.35;
  b.box(x,(bottom+top)/2,z+.08,2.88,top-bottom,.12,'#475451',5,.85);
  if(!door)b.box(x,1.175,z+.14,2.88,.71,.15,red,20,.85);
  for(const s of[-1,1])b.box(x+s*1.49,2.58,z+.19,.20,3.52,.25,red,20,.90);
  b.box(x,.90,z+.19,2.98,.16,.23,red,20,.91);b.box(x,4.28,z+.19,2.98,.18,.23,red,20,.91);
  b.box(x,2.58,z+.22,.10,3.35,.14,wood,20,.94);
  const low=door?1.05:1.70;
  for(let y=low+.45;y<4.15;y+=.56)b.box(x,y,z+.24,2.82,.055,.09,wood,20,.95);
  for(const dx of[-1.02,-.52,.52,1.02])b.box(x+dx,(low+4.18)/2,z+.24,.055,4.18-low,.09,wood,20,.95);
 }
 b.box(0,4.43,z+.30,15.88,.24,.47,red,20,1.01);
 b.box(0,5.15,z-.18,16.04,1.30,.28,red,20,1.02);
 // A supported curved lean-to, capped underneath and at both ends. Physical
 // cover tiles retain the source roof's visual resolution and cylinder rhythm.
 const width=18.45,depth=2.0,high=5.78,low=4.63,N=22,U=46;
 const height=t=>low+(high-low)*Math.pow(t,1.6),point=(x,t,dy=0)=>[x,height(t)+dy,z+depth*(1-t)-.12];
 const roof=new G.Geometry();
 for(let j=0;j<N;j++)for(let i=0;i<U;i++){
  const a=-width/2+width*i/U,c=-width/2+width*(i+1)/U,t=j/N,v=(j+1)/N;
  roof.quad(point(a,t),point(c,t),point(c,v),point(a,v));
  roof.quad(point(a,v,-.13),point(c,v,-.13),point(c,t,-.13),point(a,t,-.13));
 }
 for(const x of[-width/2,width/2])for(let j=0;j<N;j++)roof.quad(point(x,j/N),point(x,(j+1)/N),point(x,(j+1)/N,-.13),point(x,j/N,-.13));
 for(const t of[0,1])roof.quad(point(-width/2,t),point(width/2,t),point(width/2,t,-.13),point(-width/2,t,-.13));
 b.mesh('lean-roof',roof,0,0,0,1,1,1,'#697070',25,1.5);
 const tiles=new G.Geometry();
 for(let x=-width/2+.2;x<width/2-.1;x+=.41){let last;
  for(let j=0;j<=22;j++){const t=j/22,ring=Array.from({length:7},(_,k)=>{const a=k/6*Math.PI,p=point(x,t,.026);return[p[0]+.058*Math.cos(a),p[1]+.058*Math.sin(a),p[2]];});if(last)for(let k=0;k<6;k++)tiles.quad(last[k],last[k+1],ring[k+1],ring[k]);last=ring;}
 }
 b.mesh('lean-cover-tiles',tiles,0,0,0,1,1,1,tile,25,1.535);
 // Continuous fascia and short rafters bear on the red head beam, not float.
 b.box(0,4.50,z+1.76,width,.20,.27,'#645b4c',20,1.45);
 for(let x=-7.8;x<=7.8;x+=.78)b.box(x,4.49,z+.93,.085,.14,2.05,'#866e50',20,1.44);
}
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const original=b.historicJingyuan,own=Object.hasOwn(b,'historicJingyuan');let held=[],bb;
 b.historicJingyuan=function(p,w,d){const emit=this.e.add,back=-d/2+5.2,bw=w-1.8,front=back+4.8,box=this.box,lattice=this.v9Lattice,door=this.heritageDoor;bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
 // Derive the original fitting bounds BEFORE selective edits, preserving the
 // source-to-map transform and every neighbouring wing and primary roof.
 this.e.add=(k,g,m,c,par,uv)=>{if(![0,3,16].includes(par[0]))for(let i=0;i<g.v.length;i+=8){const q=M.apply(m,[g.v[i],g.v[i+1],g.v[i+2],1]);if(q[1]>=1.3)for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j]);}}};
 const solids=this.solidAreas.length,buildings=this.mapBuildings.length;
 try{original.call(this,p,w,d);}finally{this.e.add=emit;this.solidAreas.length=solids;this.mapBuildings.length=buildings;}
 const atBack=()=>Math.abs(this.origin[2]-back)<1e-5&&Math.abs(this.rotation)<1e-5;
 this.box=function(x,y,z,ww,h,dd,c,mat,part,r){
  if(atBack()&&Math.abs(y-4.75)<1e-6&&Math.abs(h-8.3)<1e-6&&ww===bw){
   // Only remove the shallow east-facing strip; leave a recessed closed back
   // behind glazing rather than an opaque wall in front of it.
   box.call(this,0,y,-.25,ww,h,9.1,c,mat,part,r);
   for(const s of[-1,1])box.call(this,s*(8.02+(bw/2-8.02)/2),y,4.55,bw/2-8.02,h,.50,c,mat,part,r);
   box.call(this,0,7.35,4.55,16.04,3.1,.50,c,mat,part,r);return;
  }
  if(atBack()&&Math.abs(y-4.79)<1e-5&&Math.abs(z-5.04)<1e-5&&Math.abs(x)<8.02){return box.call(this,x,7.295,z,ww,2.99,dd,c,mat,part,r);}
  if(atBack()&&Math.abs(y-4.56)<1e-5&&z>0){for(const s of[-1,1])box.call(this,s*(8.02+(ww/2-8.02)/2),y,z,ww/2-8.02,h,dd,c,mat,part,r);return;}
  return box.call(this,x,y,z,ww,h,dd,c,mat,part,r);
 };
 this.v9Lattice=function(...a){
  if(Math.abs(this.origin[2]-(back+4.85))>1e-5||Math.abs(this.rotation)>1e-5||a[1]>=4)return lattice.apply(this,a);
  // Measure the complete old window, including backing, lattice and wider
  // stone sill. Delete the whole intersecting window: the reference has
  // masonry beside the five timber bays, not amputated half-windows.
  const output=this.e.add,window=[];let lo=Infinity,hi=-Infinity;
  this.e.add=(k,g,m,c,p,uv)=>{window.push({k,g,m:new Float32Array(m),c,p:[...p],uv});for(let i=0;i<g.v.length;i+=8){const x=M.apply(m,[g.v[i],g.v[i+1],g.v[i+2],1])[0];lo=Math.min(lo,x);hi=Math.max(hi,x);}};
  try{lattice.apply(this,a);}finally{this.e.add=output;}
  if(hi<=-8.02||lo>=8.02)for(const q of window)output.call(this.e,q.k,q.g,q.m,q.c,q.p,q.uv);
 };
 this.heritageDoor=function(...a){if(atBack()&&Math.abs(a[2]-5.09)<1e-5)return;return door.apply(this,a);};
 try{original.call(this,p,w,d);}finally{this.box=box;this.v9Lattice=lattice;this.heritageDoor=door;}
 // Keep this specifically photographed projection separate from the C-ring
 // clipping; all original parts still pass through the normal Adapter.
 this.e.add=(k,g,m,c,par,uv)=>held.push({k,g,m:new Float32Array(m),c,par:[...par],uv});
 try{face(this,front);}finally{this.e.add=emit;}
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(own)b.historicJingyuan=original;else delete b.historicJingyuan;}
 if(result?.frame&&bb){const fr=result.frame,root=M.multiply(M.transform([fr.centre[0],0,fr.centre[1]],result.scale,fr.r),M.transform([-(bb[0]+bb[3])/2,0,-(bb[2]+bb[5])/2],[1,1,1],0));for(const q of held)b.e.add(prefix+q.k,q.g,M.multiply(root,q.m),q.c,[q.par[0],f.properties.pickId,0,q.par[3]],q.uv);}
 return result;
};
Y.Jingyuan166Facade={id:ID,prefix};
})(YY);
