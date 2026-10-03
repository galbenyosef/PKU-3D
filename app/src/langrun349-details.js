/* Target-only source-scale experiment, not a photo reconstruction of this wing.
 * Keep n17Hall's existing one-storey fitting rules and V44 roof tessellation. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,Adapter=Y.ArchitectureAdapter,F=Y.Footprints,G=Y.Geo,M=Y.M,ID='way/1009052011';
 function cutClosure(roof,m,geometry,base){
  const out=new G.Geometry(),eps=1e-6;
  for(const ring of F.polygons(geometry).flat())for(let e=1;e<ring.length;e++){
   const a=ring[e-1],b=ring[e],dx=b[0]-a[0],dz=b[1]-a[1],ll=dx*dx+dz*dz;
   if(ll<eps)continue;
   for(let i=0;i<roof.v.length;i+=24){
    const v=[0,8,16].map(k=>M.apply(m,[roof.v[i+k],roof.v[i+k+1],roof.v[i+k+2],1]).slice(0,3));
    const side=p=>dx*(p[2]-a[1])-dz*(p[0]-a[0]),hits=[];
    for(let k=0;k<3;k++){const p=v[k],q=v[(k+1)%3],dp=side(p),dq=side(q);if(Math.abs(dp)<eps)hits.push(p);if(dp*dq<-eps*eps){const t=dp/(dp-dq);hits.push(p.map((n,j)=>n+(q[j]-n)*t));}}
    const ts=hits.map(p=>({p,t:((p[0]-a[0])*dx+(p[2]-a[1])*dz)/ll})).sort((u,v)=>u.t-v.t);
    if(ts.length<2)continue;const lo=ts[0],hi=ts[ts.length-1],s=Math.max(0,lo.t),t=Math.min(1,hi.t);if(t-s<eps)continue;
    const at=u=>[a[0]+dx*u,lo.p[1]+(hi.p[1]-lo.p[1])*(u-lo.t)/(hi.t-lo.t),a[1]+dz*u],p=at(s),q=at(t);
    if(Math.min(p[1],q[1])<base-eps||Math.max(p[1],q[1])<base+eps)continue;
    const pts=[[p[0],base,p[2]],[q[0],base,q[2]],q,p],len=Math.sqrt(ll),mx=(p[0]+q[0])/2,mz=(p[2]+q[2])/2;
    if(F.inside([mx-dz/len*.003,mz+dx/len*.003],geometry))pts.reverse();
    for(const ix of[[0,1,2],[0,2,3]]){const tri=ix.map(k=>pts[k].map(Math.fround)),normal=M.cross(M.sub(tri[1],tri[0]),M.sub(tri[2],tri[0]));if(Math.hypot(...normal)>1e-7)out.tri(...tri);}
   }
  }return out;
 }
 A.render=function(b,f,add){
  if(f.properties.id!==ID||f.properties.pickId!==349)return previous.call(this,b,f,add);
  const fr=Adapter.frame(f.geometry,0),w=fr.w-.15-2.4,d=fr.d-.15-2.5;
  if(w<=0||d<=0)return previous.call(this,b,f,add);
  const source={...Y.ARCHIVE.legacy[String(f.properties.legacyId)],modelSize:[w,d]},oldRoof=b.n17Roof;
  let result;
  add('v30-footprint-base-'+f.properties.pickId,F.surface(f.geometry,.045),'#b5bbae',10,f.properties.pickId);
  b.n17Roof=Y.Refinements44.coiledRoof;
  try{
   result=Adapter.render(b,f,(builder,p,W,D)=>{
    builder.n17Hall(W,D,6.6,{one:true});
    // Close the inherited solid's plinth/wall and wall/eave gaps without
    // changing any existing window, frame, frieze or roof component.
    builder.n17Box('langrun349-base-joint',0,.765,0,W,.07,D,'#d9d7c9',24,.55);
    builder.n17Box('langrun349-eave-joint',0,6.8625,0,W,.175,D,'#d9d7c9',24,.55);
    builder.n17Box('langrun349-ground-joint',0,.005,0,W+.6,.01,D+.6,'#a3a599',10,.1);
   },source,{name:'langrun349-source-scale',frame:fr,sourceFrame:{w:fr.w-.15,d:fr.d-.15,centre:[0,0]},retainLowKeys:['langrun349-ground-joint']});
  }finally{b.n17Roof=oldRoof;}
  const sy=result.scale[1],roof=b.cache['langrun44-coiled-hip'];
  const roofMatrix=M.multiply(M.transform([fr.centre[0],0,fr.centre[1]],[1,sy,1],fr.r),M.transform([0,6.95,0],[w+2.4,2.7,d+2.5],0));
  // Follow the actual retained tile mesh's outer edge, never overlay its top.
  // The existing green fascia top is source y=-.025 relative to the eave;
  // a .005 overlap closes numerical cracks, including both short-end returns.
  const seal=new G.Geometry(),seen=new Set(),rv=Array.from(new Float32Array(roof.v)),bottom=-.030/2.7;
  for(let i=0;i<rv.length;i+=24)for(let j=0;j<3;j++){
   const a=rv.slice(i+j*8,i+j*8+3),c=rv.slice(i+(j+1)%3*8,i+(j+1)%3*8+3);
   if(![0,2].some(axis=>Math.abs(Math.abs(a[axis])-.5)<1e-7&&Math.abs(a[axis]-c[axis])<1e-7))continue;
   const key=[a.join(','),c.join(',')].sort().join('|');if(seen.has(key))continue;seen.add(key);
   const ps=[a,c,[c[0],bottom,c[2]],[a[0],bottom,a[2]]],n=M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]));
   if(n[0]*(a[0]+c[0])+n[2]*(a[2]+c[2])<0)ps.reverse();
   seal.quad(...ps);
  }
  b.e.add('langrun349-eave-perimeter-seal',seal,roofMatrix,'#4c706b',[6,f.properties.pickId,0,1.9]);
  const closure=cutClosure(roof,roofMatrix,f.geometry,6.95*sy);
  if(closure.v.length)b.e.add('langrun349-roof-cut-closure',closure,M.identity(),'#6b756d',[2,f.properties.pickId,0,2.1]);
  return {...result,sourceModelSize:[w,d],sourceScope:'single mapped wing; legacy opening rhythm remains an unverified type fit',roofCutTriangles:closure.v.length/24};
 };
 Y.Langrun349={cutClosure};
})(YY);
