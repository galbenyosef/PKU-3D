/* Match this barrel roof's end walls to its unchanged submitted roof boundary.
 * Identity, entrance, five-floor metadata and facade remain unverified type fits. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,F=Y.Footprints,M=Y.M,G=Y.Geo;
 function roofEnds(roof,geometry,base){
  const out=new G.Geometry(),edges=F.polygons(geometry).flat().flatMap(r=>r.slice(1).map((q,k)=>{const p=r[k],dx=q[0]-p[0],dz=q[1]-p[1],ll=dx*dx+dz*dz;return {p,q,dx,dz,ll,count:Math.max(1,Math.ceil(Math.sqrt(ll)/1.5))};})),seen=new Set();
  for(let i=0;i<roof.v.length;i+=24)for(let j=0;j<3;j++){
   let a=roof.v.slice(i+j*8,i+j*8+3),b=roof.v.slice(i+(j+1)%3*8,i+(j+1)%3*8+3);
   const e=edges.find(e=>F.distSegment([a[0],a[2]],e.p,e.q)<1e-7&&F.distSegment([b[0],b[2]],e.p,e.q)<1e-7);if(!e)continue;
   const key=[a,b].map(p=>p.map(x=>x.toFixed(7)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);
   const at=p=>((p[0]-e.p[0])*e.dx+(p[2]-e.p[1])*e.dz)/e.ll;
   if(at(a)>at(b))[a,b]=[b,a];const lo=at(a),hi=at(b);if(hi-lo<1e-10||Math.max(a[1],b[1])<=base+1e-7)continue;
   // Retain the original per-1.5m-segment UV repeats. Split at both original
   // UV seams and actual roof edges; this never subdivides or moves the roof.
   const cuts=[lo];for(let k=1;k<e.count;k++){const t=k/e.count;if(t>lo+1e-10&&t<hi-1e-10)cuts.push(t);}cuts.push(hi);
   for(let k=1;k<cuts.length;k++){
    const l=cuts[k-1],h=cuts[k],tile=Math.min(e.count-1,Math.floor((l+h)*.5*e.count));
    const top=t=>[e.p[0]+e.dx*t,a[1]+(b[1]-a[1])*(t-lo)/(hi-lo),e.p[1]+e.dz*t],aa=top(l),bb=top(h);
    const ps=[[aa[0],base,aa[2]],[bb[0],base,bb[2]],bb,aa],u=t=>Math.max(0,Math.min(1,t*e.count-tile)),uv=[[u(l),0],[u(h),0],[u(h),1],[u(l),1]];
    const n=M.norm(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))),mid=[(aa[0]+bb[0])/2,(aa[2]+bb[2])/2];
    if(F.inside([mid[0]+n[0]*.003,mid[1]+n[2]*.003],geometry)){ps.reverse();uv.reverse();}
    for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>ps[k]);if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))>1e-9)out.tri(...t,ids.map(k=>uv[k]));}
   }
  }return out;
 }
 A.render=function(b,f,add){
  if(f.properties.pickId!==433||f.properties.id!=='way/1092504034')return previous.call(this,b,f,add);
  let roof,body;
  return previous.call(this,b,f,(key,g,color,mat,id)=>{
   if(key.startsWith('v30-walls-433-')){body=-Infinity;for(let k=1;k<g.v.length;k+=8)body=Math.max(body,g.v[k]);}
   if(key.startsWith('v30-arched-roof-433-'))roof=g;
   if(key.startsWith('v30-roof-ends-433-')&&roof&&Number.isFinite(body))g=roofEnds(roof,f.geometry,body);
   add(key,g,color,mat,id);
  });
 };
 Y.Building433Details={roofEnds};
})(YY);
