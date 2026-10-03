/* Seal only the existing clipped stair volume on its source-outline cut.
 * No recovered steps, new landing, changed door or extended footprint.
 * The current stair configuration itself remains an unverified fitted model. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,TARGET='v30-clipped-119-shaoyuan-#bcbeba|10|0',G=Y.Geo,M=Y.M;
function caps(geometry,ring){const v=new Float32Array(geometry.v),out=new G.Geometry(),loops=[],sign=Math.sign(Y.Footprints.area(ring)),eps=5e-5;
 for(let edge=0;edge<ring.length-1;edge++){const a=ring[edge],b=ring[edge+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),distance=p=>Math.abs(dx*(p[2]-a[1])-dz*(p[0]-a[0]))/len,u=p=>((p[0]-a[0])*dx+(p[2]-a[1])*dz)/len,normal=[sign*dz/len,0,-sign*dx/len],segments=[];
  for(let i=0;i<v.length;i+=24){const tri=[0,8,16].map(j=>Array.from(v.slice(i+j,i+j+3))),on=tri.filter(p=>distance(p)<=eps);if(on.length===2&&Math.hypot(...M.sub(on[0],on[1]))>eps)segments.push(on);}
  if(!segments.length)continue;
  const levels=[...new Set(segments.filter(([a,b])=>a[1]===b[1]).map(([a])=>a[1]))].sort((a,b)=>a-b);
  for(let band=0;band<levels.length-1;band++){const lo=levels[band],hi=levels[band+1];if(hi-lo<eps)continue;const points=[...new Map(segments.flat().filter(p=>p[1]>=lo&&p[1]<=hi).map(p=>[p.join(','),p])).values()];if(points.length<4)continue;
   const min=Math.min(...points.map(u)),max=Math.max(...points.map(u));
   // Preserve all Float32 cut vertices, including triangle-diagonal splits.
   // Union subdivision of horizontal shared seams prevents cap T-junctions.
   const bottom=points.filter(p=>p[1]===lo).sort((a,b)=>u(a)-u(b)),right=points.filter(p=>p[1]>lo&&p[1]<hi&&Math.abs(u(p)-max)<eps).sort((a,b)=>a[1]-b[1]),top=points.filter(p=>p[1]===hi).sort((a,b)=>u(b)-u(a)),left=points.filter(p=>p[1]>lo&&p[1]<hi&&Math.abs(u(p)-min)<eps).sort((a,b)=>b[1]-a[1]);
   const loop=[...bottom,...right,...top,...left];if(bottom.length<2||top.length<2)throw Error('Incomplete stair cut boundary');
   const center=[0,1,2].map(k=>loop.reduce((s,p)=>s+p[k],0)/loop.length);
   for(let j=0;j<loop.length;j++){let p=loop[j],q=loop[(j+1)%loop.length];const n=M.cross(M.sub(p,center),M.sub(q,center));if(M.dot(n,normal)<0)[p,q]=[q,p];if(Math.hypot(...n)>1e-10)out.tri(center,p,q);}
   loops.push({edge,band,lo,hi,points:loop,segments:segments.filter(s=>s.every(p=>p[1]>=lo&&p[1]<=hi))});
  }
 }
 if(loops.length!==3)throw Error('Existing stair cut topology changed; review rather than infer stairs');return{geometry:out,loops};
}
A.render=function(b,f,...args){if(f.properties.pickId!==119||f.properties.id!=='way/240832231')return previous.call(this,b,f,...args);const emit=b.e.add,own=Object.hasOwn(b.e,'add');let found=0;
 b.e.add=function(k,g,m,c,p,uv){if(k===TARGET){if(p[1]!==119||p[0]!==10||uv)throw Error('Unexpected stair cut material');const sealed=caps(g,f.geometry.coordinates[0]);found++;const merged=Object.assign(new G.Geometry(),g);merged.v=Array.from(g.v).concat(sealed.geometry.v);g=merged;Y.Shaoyuan119Cut297.last=sealed.loops;}return emit.call(this,k,g,m,c,p,uv);};
 let result;try{result=previous.call(this,b,f,...args);}finally{if(own)b.e.add=emit;else delete b.e.add;}if(found!==1)throw Error('Expected one existing clipped stair mesh');return result;
};Y.Shaoyuan119Cut297={caps,target:TARGET};
})(YY);
