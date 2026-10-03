/* Individual 348 source-scale correction; no claim of photo-proven openings.
 * Keep n17Hall's existing one-storey fitting rules and V44 roof tessellation. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,Adapter=Y.ArchitectureAdapter,F=Y.Footprints,G=Y.Geo,M=Y.M,ID='way/1009052010';
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
 // Seal only the uplifted eave boundary, below the original tiled surface.
 function eaveSeal(roof,w,d,h){
  const out=new G.Geometry(),seen=new Set(),v=roof.v,bottom=-.035;
  for(let i=0;i<v.length;i+=24)for(let j=0;j<3;j++){
   const a=v.slice(i+j*8,i+j*8+3),c=v.slice(i+((j+1)%3)*8,i+((j+1)%3)*8+3);
   if(![0,2].some(k=>Math.abs(Math.abs(a[k])-.5)<1e-7&&Math.abs(a[k]-c[k])<1e-7))continue;
   const key=[a,c].map(p=>p.map(x=>x.toFixed(6)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);
   const top=p=>[p[0]*w,p[1]*h,p[2]*d],aa=top(a),cc=top(c),ps=[aa,cc,[cc[0],bottom,cc[2]],[aa[0],bottom,aa[2]]];
   const normal=M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]));if(normal[0]*(aa[0]+cc[0])+normal[2]*(aa[2]+cc[2])<0)ps.reverse();out.quad(...ps);
  }return out;
 }
 // Adapter clips box faces but does not generate their new vertical end caps.
 // Keep those fascia faces and close only the cuts in the two retained strips.
 function fasciaCutCaps(geometry,fr,w,d,sy){
  const out=new G.Geometry(),root=M.transform([fr.centre[0],0,fr.centre[1]],[1,1,1],fr.r),inv=M.inverse(root);
  for(const ring of F.polygons(geometry).flat())for(let k=1;k<ring.length;k++){
   const aa=ring[k-1],cc=ring[k],a=M.apply(inv,[aa[0],0,aa[1],1]),c=M.apply(inv,[cc[0],0,cc[1],1]);
   for(const sg of[-1,1]){
    const range=[[-w/2,w/2],[sg*d/2-.125,sg*d/2+.125]];let lo=0,hi=1;
    for(const [j,axis]of[0,2].entries()){const delta=c[axis]-a[axis],[mn,mx]=range[j];if(Math.abs(delta)<1e-9){if(a[axis]<mn||a[axis]>mx){lo=1;hi=0;break;}}else{const ts=[(mn-a[axis])/delta,(mx-a[axis])/delta].sort((x,y)=>x-y);lo=Math.max(lo,ts[0]);hi=Math.min(hi,ts[1]);}}
    if(hi-lo<1e-6)continue;const at=t=>[aa[0]+(cc[0]-aa[0])*t,aa[1]+(cc[1]-aa[1])*t],p=at(lo),q=at(hi),ps=[[p[0],6.695*sy,p[1]],[q[0],6.695*sy,q[1]],[q[0],6.925*sy,q[1]],[p[0],6.925*sy,p[1]]];
    const n=M.norm(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))),mid=[(p[0]+q[0])/2,(p[1]+q[1])/2];if(F.inside([mid[0]+n[0]*.003,mid[1]+n[2]*.003],geometry))ps.reverse();out.quad(...ps);
   }
  }return out;
 }
 A.render=function(b,f,add){
  if(f.properties.id!==ID||f.properties.pickId!==348)return previous.call(this,b,f,add);
  const fr=Adapter.frame(f.geometry,0),w=fr.w-.15-2.4,d=fr.d-.15-2.5;
  if(w<=0||d<=0)return previous.call(this,b,f,add);
  const source={...Y.ARCHIVE.legacy[String(f.properties.legacyId)],modelSize:[w,d]},oldRoof=b.n17Roof;
  let result;
  add('v30-footprint-base-'+f.properties.pickId,F.surface(f.geometry,.045),'#b5bbae',10,f.properties.pickId);
  b.n17Roof=function(x,y,z,W,D,H,rotation=0){
   Y.Refinements44.coiledRoof.call(this,x,y,z,W,D,H,rotation);
   const seal=eaveSeal(this.cache['langrun44-coiled-hip'],W,D,H);
   this.local(x,y,z,rotation,()=>this.mesh('langrun348-eave-perimeter-seal',seal,0,0,0,1,1,1,'#4c706b',6,1.9));
  };
  try{
   result=Adapter.render(b,f,(builder,p,W,D)=>{
    builder.n17Hall(W,D,6.6,{one:true});
    // Close the inherited solid's plinth/wall and wall/eave gaps without
    // changing any existing window, frame, frieze or roof component.
    builder.n17Box('langrun348-base-joint',0,.765,0,W,.07,D,'#d9d7c9',24,.55);
    builder.n17Box('langrun348-eave-joint',0,6.8625,0,W,.175,D,'#d9d7c9',24,.55);
    builder.n17Box('langrun348-ground-joint',0,.005,0,W+.6,.01,D+.6,'#a3a599',10,.1);
   },source,{name:'langrun348-source-scale',frame:fr,sourceFrame:{w:fr.w-.15,d:fr.d-.15,centre:[0,0]},retainLowKeys:['langrun348-ground-joint']});
  }finally{b.n17Roof=oldRoof;}
  const sy=result.scale[1],roof=b.cache['langrun44-coiled-hip'];
  const roofMatrix=M.multiply(M.transform([fr.centre[0],0,fr.centre[1]],[1,sy,1],fr.r),M.transform([0,6.95,0],[w+2.4,2.7,d+2.5],0));
  // Retained green fascia reaches source y=6.925. Enter its top by
  // .010 source metres; eave y=6.95 would leave a visible slit at cuts.
  const closure=cutClosure(roof,roofMatrix,f.geometry,6.915*sy);
  if(closure.v.length)b.e.add('langrun348-roof-cut-closure',closure,M.identity(),'#6b756d',[2,f.properties.pickId,0,2.1]);
  const fasciaCaps=fasciaCutCaps(f.geometry,fr,w+2.4,d+2.5,sy);
  if(fasciaCaps.v.length)b.e.add('langrun348-fascia-cut-caps',fasciaCaps,M.identity(),'#4c706b',[6,f.properties.pickId,0,1.9]);
  return {...result,sourceModelSize:[w,d],sourceScope:'single mapped wing; legacy opening rhythm remains an unverified type fit',roofCutTriangles:closure.v.length/24};
 };
 Y.Langrun348={cutClosure,eaveSeal,fasciaCutCaps};
})(YY);
