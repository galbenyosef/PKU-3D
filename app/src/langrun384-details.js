/* independent source frame for way/1009052046 (384).
 * Existing n17Hall type-fit rules calculate openings from this building's own
 * dimensions; no photographed room identity, door or bay count is asserted.
 * Original p.height, V44 unit roof, materials and map ground are retained.
 * CPU-tested with the real Engine stream and all opaque boundary rays.
 * The actual tiled roof lies inside this four-sided footprint;
 * only fascia end cuts need closure. No roof-cut mesh is added.
 * Rendered front/side/context review remains pending. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,Adapter=Y.ArchitectureAdapter,F=Y.Footprints,G=Y.Geo,M=Y.M,ID='way/1009052046';
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
   const aa=ring[k-1],cc=ring[k],dx=cc[0]-aa[0],dz=cc[1]-aa[1],ll=dx*dx+dz*dz;
   const a=M.apply(inv,[aa[0],0,aa[1],1]),c=M.apply(inv,[cc[0],0,cc[1],1]),spans=[];
   for(const sg of[-1,1]){
    const range=[[-w/2,w/2],[sg*d/2-.125,sg*d/2+.125]];let lo=0,hi=1;
    for(const [j,axis]of[0,2].entries()){const delta=c[axis]-a[axis],[mn,mx]=range[j];if(Math.abs(delta)<1e-9){if(a[axis]<mn||a[axis]>mx){lo=1;hi=0;break;}}else{const ts=[(mn-a[axis])/delta,(mx-a[axis])/delta].sort((x,y)=>x-y);lo=Math.max(lo,ts[0]);hi=Math.min(hi,ts[1]);}}
    if(hi-lo>1e-6)spans.push({lo,hi,top:6.925});
   }
   const stops=[...new Set(spans.flatMap(s=>[s.lo,s.hi]))].sort((a,b)=>a-b),pieces=[];
   for(let j=1;j<stops.length;j++){
    const lo=stops[j-1],hi=stops[j];if(hi-lo<1e-7)continue;
    const mid=(lo+hi)/2,top=Math.max(0,...spans.filter(s=>s.lo<=mid&&s.hi>=mid).map(s=>s.top));if(!top)continue;
    const previous=pieces[pieces.length-1];if(previous&&previous.top===top&&Math.abs(previous.hi-lo)<1e-6)previous.hi=hi;else pieces.push({lo,hi,top});
   }
   for(const {lo,hi,top}of pieces){
    const at=t=>[aa[0]+dx*t,aa[1]+dz*t],p=at(lo),q=at(hi),ps=[[p[0],6.695*sy,p[1]],[q[0],6.695*sy,q[1]],[q[0],top*sy,q[1]],[p[0],top*sy,p[1]]];
    const n=M.norm(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))),mid=[(p[0]+q[0])/2,(p[1]+q[1])/2];if(F.inside([mid[0]+n[0]*.003,mid[1]+n[2]*.003],geometry))ps.reverse();out.quad(...ps);
   }
  }return out;
 }

 A.render=function(b,f,add){
  if(f.properties.id!==ID||f.properties.pickId!==384)return previous.call(this,b,f,add);
  const fr=Adapter.frame(f.geometry,0),w=fr.w-.15-2.4,d=fr.d-.15-2.5;
  if(w<=0||d<=0)return previous.call(this,b,f,add);
  const source={...Y.ARCHIVE.legacy[String(f.properties.legacyId)],modelSize:[w,d]},oldRoof=b.n17Roof;
  let result;
  add('v30-footprint-base-'+f.properties.pickId,F.surface(f.geometry,.045),'#b5bbae',10,f.properties.pickId);
  b.n17Roof=function(x,y,z,W,D,H,rotation=0){
   Y.Refinements44.coiledRoof.call(this,x,y,z,W,D,H,rotation);
   const seal=eaveSeal(this.cache['langrun44-coiled-hip'],W,D,H);
   this.local(x,y,z,rotation,()=>this.mesh('langrun384-eave-perimeter-seal',seal,0,0,0,1,1,1,'#4c706b',6,1.9));
  };
  try{
   result=Adapter.render(b,f,(builder,p,W,D)=>{
    builder.n17Hall(W,D,6.6,{one:true});
    // Close the inherited solid's plinth/wall and wall/eave gaps without
    // changing any existing window, frame, frieze or roof component.
    builder.n17Box('langrun384-base-joint',0,.765,0,W,.07,D,'#d9d7c9',24,.55);
    builder.n17Box('langrun384-eave-joint',0,6.8625,0,W,.175,D,'#d9d7c9',24,.55);
    builder.n17Box('langrun384-ground-joint',0,.005,0,W+.6,.01,D+.6,'#a3a599',10,.1);
   },source,{name:'langrun384-source-scale',frame:fr,sourceFrame:{w:fr.w-.15,d:fr.d-.15,centre:[0,0]},retainLowKeys:['langrun384-ground-joint']});
  }finally{b.n17Roof=oldRoof;}
  const sy=result.scale[1];
  // This near-rectangular feature leaves every tiled-roof vertex at least
  // 0.0632 m inside its mapped boundary; only the lower fascia strips cross.
  const fasciaCaps=fasciaCutCaps(f.geometry,fr,w+2.4,d+2.5,sy);
  if(fasciaCaps.v.length)b.e.add('langrun384-fascia-cut-caps',fasciaCaps,M.identity(),'#4c706b',[6,f.properties.pickId,0,1.9]);
  return {...result,sourceModelSize:[w,d],sourceScope:'single mapped wing; legacy opening rhythm remains an unverified type fit',roofCutTriangles:0};
 };
 Y.Langrun384={eaveSeal,fasciaCutCaps};
})(YY);
