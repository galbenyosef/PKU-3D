/* 38/39 mapped bicycle canopy: close demonstrable column/roof gaps.
 * Retains every original roof triangle, material, column and mapped outline.
 * Existing support layout remains a type fit, not a surveyed steel detail. */
(function(Y){'use strict';const A=Y.Architecture30,M=Y.M,G=Y.Geo,F=Y.Footprints,previous=A.render;
 function clip(poly,axis,value,sign){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[axis]-value)*sign,db=(b[axis]-value)*sign;if(da>=-1e-9)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}return out;}
 function extension(roof,post){const g=new G.Geometry(),x=post.m[12],z=post.m[14],hx=Math.abs(post.m[0])/2,hz=Math.abs(post.m[10])/2,base=post.m[13]+post.m[5]/2-.002,edges=new Map();
  const key=p=>p.map(v=>v.toFixed(6)).join(',');
  for(let i=0;i<roof.geo.v.length;i+=24){let poly=[0,8,16].map(k=>M.apply(roof.m,[...roof.geo.v.slice(i+k,i+k+3),1]).slice(0,3));if(Math.max(...poly.map(p=>p[0]))<x-hx||Math.min(...poly.map(p=>p[0]))>x+hx||Math.max(...poly.map(p=>p[2]))<z-hz||Math.min(...poly.map(p=>p[2]))>z+hz)continue;
   for(const [axis,value,sign]of[[0,x-hx,1],[0,x+hx,-1],[2,z-hz,1],[2,z+hz,-1],[1,base,1]]){poly=clip(poly,axis,value,sign);if(poly.length<3)break;}if(poly.length<3)continue;
   // Original column top and roof already close both ends; add only skirts,
   // with no hidden bottom cap or coplanar duplicate roof triangles.
   for(let j=0;j<poly.length;j++){const a=poly[j],b=poly[(j+1)%poly.length];if(Math.hypot(...M.sub(a,b))<1e-8)continue;const k=[key(a),key(b)].sort().join('|');if(edges.has(k))edges.delete(k);else edges.set(k,[a,b]);}
  }
  for(const [a,b]of edges.values())g.quad([a[0],base,a[2]],[b[0],base,b[2]],b,a);return g;
 }
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
    const top=t=>[e.p[0]+e.dx*t,Math.max(base,a[1]+(b[1]-a[1])*(t-lo)/(hi-lo)),e.p[1]+e.dz*t],aa=top(l),bb=top(h);
    const ps=[[aa[0],base,aa[2]],[bb[0],base,bb[2]],bb,aa],u=t=>Math.max(0,Math.min(1,t*e.count-tile)),uv=[[u(l),0],[u(h),0],[u(h),1],[u(l),1]];
    const n=M.norm(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))),mid=[(aa[0]+bb[0])/2,(aa[2]+bb[2])/2];
    if(F.inside([mid[0]+n[0]*.003,mid[1]+n[2]*.003],geometry)){ps.reverse();uv.reverse();}
    for(const ids of[[0,1,2],[0,2,3]]){
     const t=ids.map(k=>ps[k].map(Math.fround)),tex=ids.map(k=>uv[k]),cross=M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0]));
     // Discard only new end-band facets that collapse in the actual GPU stream.
     if(Math.hypot(...cross)<=1e-9)continue;
     const n=M.norm(cross),mid=t.reduce((v,p)=>v.map((a,j)=>a+p[j]/3),[0,0,0]);
     if(F.inside([mid[0]+n[0]*.003,mid[2]+n[2]*.003],geometry)){t.reverse();tex.reverse();}
     out.tri(...t,tex);
    }
   }
  }return out;
 }
 A.render=function(b,f,add){if(f.properties.pickId!==492||f.properties.id!=='way/1101754970')return previous.call(this,b,f,add);
  const original=b.e.add,posts=[];let roof,result;b.e.add=function(k,geo,m,c,p,uv){if(k==='box'&&c==='#788e86'&&p[0]===29&&Math.abs(m[0]-.18)<1e-5&&Math.abs(m[10]-.18)<1e-5&&[1,2,4,6,8,9].every(j=>Math.abs(m[j])<1e-8))posts.push({m:Array.from(m)});if(k==='128-east-west-roof-bands')roof={geo,m:Array.from(m)};return original.call(this,k,geo,m,c,p,uv);};
  try{result=previous.call(this,b,f,(key,g,color,mat,id)=>{
   if(key==='128-east-west-roof-ends'&&roof&&posts.length){
    const base=posts[0].m[13]+posts[0].m[5]/2;
    g=roofEnds(roof.geo,f.geometry,base);
   }
   add(key,g,color,mat,id);
  });}finally{b.e.add=original;}
  if(roof)for(let i=0;i<posts.length;i++){
   const post=posts[i],joint=extension(roof,post),centre=[post.m[12],post.m[13],post.m[14]];
   // Original metal uses position-derived metric UV about its own column centre.
   // Keep that same origin at the joint rather than resetting noise in world space.
   for(let j=0;j<joint.v.length;j+=8)for(let k=0;k<3;k++)joint.v[j+k]-=centre[k];
   if(joint.v.length)original.call(b.e,'canopy492-column-roof-joint-'+i,joint,M.transform(centre,[1,1,1],0),'#788e86',[29,492,0,0]);
  }
  return result;
 };Y.Canopy492={extension,roofEnds};
})(YY);
