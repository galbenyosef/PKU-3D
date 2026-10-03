/* Guanghua #2 only: close mapped-footprint cuts through existing solid boxes.
 * These are cut faces of the inherited fitted volumes, not a new facade design.
 * Only five main masonry boxes are eligible; roof details and window parts stay.
 * Existing glazing, doors, courtyard and original instance order remain.
 * Cut triangles append to the unique existing clipped brick mesh, with identical
 * material/matrix/UV parameters; no additional instance, bucket or draw is used. */
(function(Y){'use strict';
const A=Y.ArchitectureAdapter,previous=A.render,M=Y.M,G=Y.Geo,F=Y.Footprints,ID='way/240825568',EPS=1e-7;
function bounds(g,m){const q=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<g.v.length;i+=8){const p=M.apply(m,[...g.v.slice(i,i+3),1]);for(let k=0;k<3;k++){q[k]=Math.min(q[k],p[k]);q[k+3]=Math.max(q[k+3],p[k]);}}return q;}
function unitBox(g){return g.v.length===288&&g.v.every((x,i)=>i%8>=3||Math.abs(Math.abs(x)-.5)<EPS);}
function render(b,f,method,source,options={}){
 if(f.properties.id!==ID||f.properties.pickId!==101||method!=='guanghuaTwo')return previous.call(this,b,f,method,source,options);
 const records=[];
 const collect=(builder,p,w,d)=>{const saved=builder.e.add;builder.e.add=function(k,g,m,c,a,uv){if(![0,3,16].includes(a[0]))records.push({k,g,m:new Float32Array(m),c,a:[...a],uv});return saved.call(this,k,g,m,c,a,uv);};try{return builder.guanghuaTwo(p,w,d);}finally{builder.e.add=saved;}};
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
  if(r.k!=='box'||!unitBox(r.g)||r.a[0]!==27||r.a[3]!==.60||r.c!=='#565761')continue;
  // The existing footprint shell already closes the lower half. Never add
  // another wall across any low entrance, colonnade or courtyard opening.
  const m=M.multiply(root,r.m),q=bounds(r.g,m);q[1]=Math.max(q[1],f.properties.height*.50);if(q[4]<=q[1]+EPS)continue;
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
 // produce coincident dark-brick faces or doubled material shading.
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
 const key='v30-clipped-101-guanghua2-#565761|27|0',targets=emitted.filter(r=>r[0]===key);
 if(mesh.v.length){
  // Validate the complete render state before combining: first-key caching
  // requires one unique record, and material/transform/UV must match exactly.
  if(targets.length!==1)throw Error('101 clipped brick merge requires one unique instance');
  const row=targets[0],identity=M.identity(),params=row[4],uv=row[5]||[0,0,1,1];
  if(row[3]!=='#565761'||row[1].detailWidth||!row[2].every((v,i)=>v===identity[i])||params.length!==4||params.some((v,i)=>v!==[27,101,0,.60][i])||uv.length!==4||uv.some((v,i)=>v!==[0,0,1,1][i]))throw Error('101 clipped brick merge attributes changed');
  const joined=new G.Geometry();joined.v=Array.from(row[1].v).concat(mesh.v);row[1]=joined;
 }
 for(const row of emitted)saved.apply(b.e,row);

 return {...result,cutClosure101:{sourceSections,faces,groups:mesh.v.length?1:0,mergedIntoExisting:true,extraInstances:0,scope:'union of the five existing main masonry box sections above the lower shell'}};
}
A.render=render;Y.Guanghua101CutClosure={render};
})(YY);
