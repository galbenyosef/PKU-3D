/* Match only the mapped west gable to the existing rendered roof edge.
 * Roof, other three edges and unresolved east return remain unchanged. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/1031892010';
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const q=Y.Building191.roofProfile(f),[a,c]=q.edges[q.west],dx=c[0]-a[0],dz=c[1]-a[1],ll=dx*dx+dz*dz;let edge;
 const near=p=>Y.Footprints.distSegment([p[0],p[2]],a,c)<.0001;
 const emit=(key,g,color,mat,id)=>{
  if(key.startsWith('v30-roof-980')){
   const points=[];for(let i=0;i<g.v.length;i+=8){const p=Array.from(new Float32Array(g.v.slice(i,i+3)));if(near(p))points.push({p,t:((p[0]-a[0])*dx+(p[2]-a[1])*dz)/ll});}
   points.sort((p,r)=>p.t-r.t);edge=[];for(const p of points){const last=edge[edge.length-1];if(!last||Math.abs(last.t-p.t)>1e-5)edge.push(p);}
  }else if(key.startsWith('v30-roof-ends-980')&&edge&&edge.length>1){
   const next=new Y.Geo.Geometry();for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(k=>g.v.slice(i+k,i+k+3));if(!ps.every(near))next.v.push(...g.v.slice(i,i+24));}
   for(let i=1;i<edge.length;i++){const p=edge[i-1].p,r=edge[i].p;next.quad([p[0],q.body,p[2]],[r[0],q.body,r[2]],r,p);}g=next;
  }
  add(key,g,color,mat,id);
 };
 return previous.call(this,b,f,emit);
};
})(YY);
