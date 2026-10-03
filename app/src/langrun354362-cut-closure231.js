/* Langrun mapped halls 354 and 362 only: close mapped-footprint cuts through existing solid boxes.
 * These are cut faces of the inherited fitted volumes, not a new facade design.
 * Only the original main plaster box supplies closure faces; roof details stay.
 * Existing glazing, doors and courtyard remain. Two fully clipped source windows
 * on 362 lose only their 18 unsupported frame/lattice records; all remaining
 * records keep their order. 354 additionally clips seven out-of-footprint joinery remnants strictly;
 * its partially surviving source window and every glass triangle remain.
 * Cut triangles append to the unique existing clipped wall mesh, with identical
 * material/matrix/UV parameters; no additional instance, bucket or draw is used. */
(function(Y){'use strict';
const A=Y.ArchitectureAdapter,previous=A.render,M=Y.M,G=Y.Geo,F=Y.Footprints,IDS=new Map([[354,'way/1009052016'],[362,'way/1009052024']]),EPS=1e-7;
function bounds(g,m){const q=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<g.v.length;i+=8){const p=M.apply(m,[...g.v.slice(i,i+3),1]);for(let k=0;k<3;k++){q[k]=Math.min(q[k],p[k]);q[k+3]=Math.max(q[k+3],p[k]);}}return q;}
function unitBox(g){return g.v.length===288&&g.v.every((x,i)=>i%8>=3||Math.abs(Math.abs(x)-.5)<EPS);}
function render(b,f,method,source,options={}){
 if(IDS.get(f.properties.pickId)!==f.properties.id||options.name!=='historic-segment')return previous.call(this,b,f,method,source,options);
 const records=[],orphanGroups=[];let activeGroup=null,activePartial=false;
 const collect=(builder,p,w,d)=>{const saved=builder.e.add;builder.e.add=function(k,g,m,c,a,uv){if(![0,3,16].includes(a[0]))records.push({k,g,m:new Float32Array(m),c,a:[...a],uv,orphanGroup:activeGroup,partialGroup:activePartial});return saved.call(this,k,g,m,c,a,uv);};const own=Object.prototype.hasOwnProperty.call(builder,'n17Lattice'),lattice=builder.n17Lattice;
  builder.n17Lattice=function(...args){const prior=activeGroup,priorPartial=activePartial;
   // Two source side windows have no glass left after exact map clipping.
   // The next window (z=-60.763889) still has glass and is deliberately retained.
   const selected=f.properties.pickId===362&&Math.abs(args[0]-136.31)<1e-6&&Math.abs(args[1]-3)<1e-6&&[-70.48611111111111,-65.625].some(z=>Math.abs(args[2]-z)<1e-6)&&args[3]===2.4&&args[4]===2.4&&args[5]===Math.PI/2;
   activePartial=f.properties.pickId===354&&Math.abs(args[0]+4.618644067796623)<1e-6&&args[1]===3&&Math.abs(args[2]+87.585)<1e-6&&Math.abs(args[3]-2.725)<1e-6&&args[4]===2.35&&args[5]===Math.PI;
   activeGroup=selected?orphanGroups.length:null;if(selected)orphanGroups.push(args);
   try{return lattice.apply(this,args);}finally{activeGroup=prior;activePartial=priorPartial;}};
  try{return typeof method==='function'?method(builder,p,w,d):builder[method](p,w,d);}finally{builder.e.add=saved;if(own)builder.n17Lattice=lattice;else delete builder.n17Lattice;}};
 const emitted=[],saved=b.e.add;let result;
 b.e.add=function(...args){emitted.push(args);};
 try{result=previous.call(this,b,f,collect,source,options);}finally{b.e.add=saved;}
 const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
 for(const r of records){const q=bounds(r.g,r.m);if(q[4]<Math.min(4,Math.max(1.3,f.properties.height*.08)))continue;for(let i=0;i<3;i++){bb[i]=Math.min(bb[i],q[i]);bb[i+3]=Math.max(bb[i+3],q[i+3]);}}
 const fr=result.frame,root=M.multiply(M.transform([fr.centre[0],0,fr.centre[1]],result.scale,fr.r),M.transform([-(bb[0]+bb[3])/2,0,-(bb[2]+bb[5])/2],[1,1,1],0));
 const edges=F.polygons(f.geometry).flatMap(pg=>pg.flatMap(ring=>ring.slice(1).map((p,i)=>[ring[i],p]))),sections=edges.map(()=>[]);let sourceSections=0;
 for(const r of records){
  // Only true closed box solids are capped. Glazing and arbitrary surface meshes
  // cannot supply a solid section and must never be inferred to be opaque walls.
  if(r.k!=='v17-plaster-wall'||!unitBox(r.g)||r.a[0]!==24||r.a[3]!==.55||r.c!=='#d9d7c9')continue;
  // This is the original closed main body, with all supported lattice assemblies retained.
  // Preserve its own base/top; no door or window subdivision is invented.
  const m=M.multiply(root,r.m),q=bounds(r.g,m);if(q[4]<=q[1]+EPS)continue;
  const inv=M.inverse(m);
  for(let edgeIndex=0;edgeIndex<edges.length;edgeIndex++){const[a,c]=edges[edgeIndex];
   const aa=M.apply(inv,[a[0],q[1],a[1],1]),cc=M.apply(inv,[c[0],q[1],c[1],1]);let lo=0,hi=1;
   // Clip the mapped boundary segment to the original box's horizontal interior.
   for(const axis of[0,2]){const delta=cc[axis]-aa[axis];if(Math.abs(delta)<EPS){if(Math.abs(aa[axis])>=.5-EPS){lo=1;hi=0;break;}}else{let t0=(-.5-aa[axis])/delta,t1=(.5-aa[axis])/delta;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);}}
   if(hi-lo<EPS)continue;
   sections[edgeIndex].push({lo,hi,bottom:q[1],top:q[4]});sourceSections++;
  }
 }
 // Union in the boundary's (t,y) plane. Overlapping inherited masses must not
 // produce coincident wall faces or doubled material shading.
 const mesh=new G.Geometry();let faces=0;
 for(let edgeIndex=0;edgeIndex<edges.length;edgeIndex++){
  const rectangles=sections[edgeIndex];if(!rectangles.length)continue;
  const[a,c]=edges[edgeIndex],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
  const levels=[...new Set(rectangles.flatMap(r=>[r.bottom,r.top]))].sort((a,b)=>a-b);
  for(let j=1;j<levels.length;j++){
   const bottom=levels[j-1],top=levels[j];if(top-bottom<EPS)continue;const y=(bottom+top)/2;
   const intervals=rectangles.filter(r=>y>r.bottom-EPS&&y<r.top+EPS).map(r=>[r.lo,r.hi]).sort((a,b)=>a[0]-b[0]);
   const merged=[];for(const interval of intervals){const last=merged[merged.length-1];if(last&&interval[0]<=last[1]+EPS)last[1]=Math.max(last[1],interval[1]);else merged.push(interval.slice());}
   for(const[lo,hi]of merged){
    const at=t=>[a[0]+dx*t,a[1]+dz*t],s=at(lo),e=at(hi),mid=at((lo+hi)/2),pts=[[s[0],bottom,s[1]],[e[0],bottom,e[1]],[e[0],top,e[1]],[s[0],top,s[1]]];
    if(F.inside([mid[0]-dz/len*.003,mid[1]+dx/len*.003],f.geometry))pts.reverse();
    mesh.quad(...pts);faces++;
   }
  }
 }
 const key='v30-clipped-'+f.properties.pickId+'-historic-segment-#d9d7c9|24|0',targets=emitted.filter(r=>r[0]===key);
 if(mesh.v.length){
  // Validate the complete render state before combining: first-key caching
  // requires one unique record, and material/transform/UV must match exactly.
  if(targets.length!==1)throw Error('Langrun clipped wall merge requires one unique instance');
  const row=targets[0],identity=M.identity(),params=row[4],uv=row[5]||[0,0,1,1];
  if(row[3]!=='#d9d7c9'||row[1].detailWidth||!row[2].every((v,i)=>v===identity[i])||params.length!==4||params.some((v,i)=>v!==[24,f.properties.pickId,0,.55][i])||uv.length!==4||uv.some((v,i)=>v!==[0,0,1,1][i]))throw Error('Langrun clipped wall merge attributes changed');
  const joined=new G.Geometry();joined.v=Array.from(row[1].v).concat(mesh.v);row[1]=joined;
 }
 let removedOrphanJoinery=0;
 if(f.properties.pickId===362){
  if(orphanGroups.length!==2)throw Error('362 orphan source groups changed');
  const shape=F.polygons(f.geometry).flatMap(pg=>F.capTriangles(pg));
  for(let group=0;group<2;group++){
   const glass=records.filter(r=>r.orphanGroup===group&&r.k==='v17-glass');
   if(glass.length!==1)throw Error('362 orphan glass source changed');
   const r=glass[0],m=M.multiply(root,r.m);
   for(let i=0;i<r.g.v.length;i+=24){const vertices=[0,8,16].map(k=>Array.from(M.apply(m,[...r.g.v.slice(i+k,i+k+3),1])).slice(0,3));
    for(const tri of shape){const clipped=A.clipTriangle(vertices,tri);for(let j=1;j<clipped.length-1;j++)if(Math.hypot(...M.cross(M.sub(clipped[j],clipped[0]),M.sub(clipped[j+1],clipped[0])))>1e-7)throw Error('362 source window retains glass; do not remove joinery');}}
  }
 }
 const orphanRecords=records.filter(r=>r.orphanGroup!==null&&['v17-window-frame','v17-lattice'].includes(r.k)).map(r=>({...r,world:M.multiply(root,r.m)}));
 const retained=emitted.filter(row=>{const remove=orphanRecords.some(r=>row[0]==='v30-'+r.k&&row[3]===r.c&&row[4][0]===r.a[0]&&row[4][3]===r.a[3]&&row[2].every((v,i)=>v===r.world[i]));if(remove)removedOrphanJoinery++;return !remove;});
 if(f.properties.pickId===362&&removedOrphanJoinery!==18)throw Error('362 orphan joinery output scope changed');
 // This 354 source window retains glass. Only its joinery surfaces with
 // zero strict footprint intersection may be removed; never drop the group.
 let removedOutsideJoinery354=0;
 const partialRecords=records.filter(r=>r.partialGroup&&['v17-window-frame','v17-lattice'].includes(r.k)).map(r=>({...r,world:M.multiply(root,r.m)}));
 const shape354=f.properties.pickId===354?F.polygons(f.geometry).flatMap(pg=>F.capTriangles(pg)):[];
 const finalRows=retained.filter(row=>{
  const sourcePiece=partialRecords.find(r=>row[0]==='v30-'+r.k&&row[3]===r.c&&row[4][0]===r.a[0]&&row[4][3]===r.a[3]&&row[2].every((v,i)=>v===r.world[i]));
  if(!sourcePiece)return true;
  for(let i=0;i<row[1].v.length;i+=24){const vertices=[0,8,16].map(k=>Array.from(M.apply(row[2],[...row[1].v.slice(i+k,i+k+3),1])).slice(0,3));
   for(const tri of shape354){const clipped=A.clipTriangle(vertices,tri);for(let j=1;j<clipped.length-1;j++)if(Math.hypot(...M.cross(M.sub(clipped[j],clipped[0]),M.sub(clipped[j+1],clipped[0])))>1e-7)throw Error('354 joinery has an in-footprint surface; preserve it');}}
  removedOutsideJoinery354++;return false;
 });
 if(f.properties.pickId===354&&removedOutsideJoinery354!==7)throw Error('354 strict joinery scope changed');
 for(const row of finalRows)saved.apply(b.e,row);

 return {...result,cutClosure231:{removedOutsideJoinery354,removedOrphanJoinery,sourceSections,faces,groups:mesh.v.length?1:0,mergedIntoExisting:true,extraInstances:0,scope:'union of the original main wall box sections at the mapped boundary'}};
}
A.render=render;Y.Langrun354362CutClosure={render};
})(YY);
