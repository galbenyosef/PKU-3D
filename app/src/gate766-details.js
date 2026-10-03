/* East-facing blue end panels visible in the 2023 southeast-gate reference.
 * Existing two-group layout and dimensions remain fitted, not surveyed. */
(function(Y){'use strict';const previous=Y.Gates33.render,M=Y.M;
 function panel(roof){const out=new Y.Geo.Geometry(),v=roof.v,base=Math.min(...v.filter((_,i)=>i%8===1)),front=Math.max(...v.filter((_,i)=>i%8===2)),seen=new Set();
  for(let i=0;i<v.length;i+=24)for(let j=0;j<3;j++){
   let a=v.slice(i+j*8,i+j*8+3),b=v.slice(i+(j+1)%3*8,i+(j+1)%3*8+3);
   if(Math.abs(a[2]-front)>1e-7||Math.abs(b[2]-front)>1e-7||Math.abs(a[0]-b[0])<1e-8)continue;
   const key=[a,b].map(p=>p.map(x=>x.toFixed(7)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);if(a[0]>b[0])[a,b]=[b,a];
   const pts=[[a[0],base,front],[b[0],base,front],b,a];
   for(const ids of[[0,1,2],[0,2,3]]){const ps=ids.map(k=>pts[k]);if(Math.hypot(...M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0])))<1e-9)continue;
    const uv=ps.map(p=>[p[0],p[1]-base]);out.tri(...ps,uv);out.tri(...ps.slice().reverse(),uv.slice().reverse());
   }
  }return out;
 }
 Y.Gates33.render=function(b,f){if(f.properties.pickId!==766||f.properties.id!=='node/6018578781')return previous.call(this,b,f);
  const original=b.e.add,roofs=[];b.e.add=function(k,g,m,c,p,uv){if(k==='southeast33-blue-canopy')roofs.push({g,m:Array.from(m),c,p:Array.from(p),uv});return original.call(this,k,g,m,c,p,uv);};let result;
  try{result=previous.call(this,b,f);}finally{b.e.add=original;}
  for(const r of roofs)original.call(b.e,'gate766-east-arched-end',panel(r.g),r.m,r.c,r.p,r.uv);
  return result;
 };Y.Gate766={panel};
})(YY);
