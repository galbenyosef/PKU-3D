/* Huaixinyuan only: close the photographed stone gallery edge below its
 * existing walking surface. No new railing, doorway or courtyard boundary. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='relation/14320160',KEY='huaixin23-west-gallery-stone-edge';
function layout(){
 const p=Y.CourtyardVisualFix46.parts,west=p.extraGalleries.find(q=>q.name==='west-covered-gallery'),ring=west.geometry.coordinates[0],a=ring[0],c=ring[1],length=Math.hypot(c[0]-a[0],c[1]-a[1]),u=[(c[0]-a[0])/length,(c[1]-a[1])/length],n=[u[1],-u[0]],probe=.005;
 const at=(t,d=0)=>[a[0]+u[0]*t+n[0]*d,a[1]+u[1]*t+n[1]*d],local=q=>[(q[0]-a[0])*u[0]+(q[1]-a[1])*u[1],(q[0]-a[0])*n[0]+(q[1]-a[1])*n[1]];
 // Do not duplicate faces inside adjacent halls or across an equal-level link.
 const neighbours=[...p.parts.map(q=>q.wallGeometry||q.geometry),...p.extraGalleries.filter(q=>q!==west).map(q=>q.geometry)],cuts=[0,length];
 for(const g of neighbours)for(const pg of F.polygons(g))for(const r of pg)for(let i=1;i<r.length;i++){
  const x=local(r[i-1]),y=local(r[i]);if((x[1]>probe)===(y[1]>probe))continue;
  const t=x[0]+(y[0]-x[0])*(probe-x[1])/(y[1]-x[1]);if(t>0&&t<length)cuts.push(t);
 }
 cuts.sort((a,b)=>a-b);const spans=[];
 for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i];if(hi-lo<1e-5||neighbours.some(g=>F.inside(at((lo+hi)/2,probe),g)))continue;spans.push([lo,hi]);}
 return{at,n,length,spans};
}
A.render=function(b,f,add){const result=previous(b,f,add);if(f.properties.id!==ID)return result;
 const q=layout(),g=new G.Geometry();for(const[lo,hi]of q.spans){const a=q.at(lo),c=q.at(hi);
  // .40 is the unchanged gallery floor; .10 enters the existing .12 paving.
  // Up then along the edge gives outward normals toward the inner courtyard.
  g.quad([a[0],.10,a[1]],[a[0],.40,a[1]],[c[0],.40,c[1]],[c[0],.10,c[1]]);
 }
 add(KEY,g,'#b7b7a6',10,f.properties.pickId);return result;
};
Y.Huaixin23Details={id:ID,key:KEY,layout};
})(YY);
