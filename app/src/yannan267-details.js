/* Yannan 61: the university's 2024 numbered before/after photographs show
 * an upper corner loggia under the continuous pitched roof, not an uncovered
 * one-storey terrace. Retain the source windows, terrace and roof detail. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/866277604';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const own=Object.hasOwn(b,'heritage61'),house=b.heritage61;
 const roofFaces=[],engineAdd=b.e.add;
 b.e.add=function(k,g,m,c,p,uv){
  if(p[0]===19)for(let i=0;i<g.v.length;i+=24){const t=[0,8,16].map(j=>Y.M.apply(m,[...g.v.slice(i+j,i+j+3),1]).slice(0,3));if(Math.abs((t[1][0]-t[0][0])*(t[2][2]-t[0][2])-(t[1][2]-t[0][2])*(t[2][0]-t[0][0]))>1e-7)roofFaces.push(t);}
  return engineAdd.call(this,k,g,m,c,p,uv);
 };
 b.heritage61=function(p,w,d){
  const ownRoof=Object.hasOwn(this,'heritageRoof'),roof=this.heritageRoof;
  this.heritageRoof=function(x,y,z,rw,rd,h,kind,col,detailed,part){
   // Called inside the original left block's local frame. Recenter and widen
   // the complete hipped roof, retaining its geometry generator and eave detail.
   return roof.call(this,x+w*.165,y,z,w+1.05,rd,h,kind,col,detailed,part);
  };
  let result;try{result=house.call(this,p,w,d);}finally{if(ownRoof)this.heritageRoof=roof;else delete this.heritageRoof;}
  // The photographed outer front corner support rises from the existing masonry balcony parapet
  // to the eave underside; the balcony front stays open.
  this.heritageBox('yannan267-loggia-pier',w*.50-.16,6.355,d*.50-.16,.32,2.70,.32,'#a4a49b',18,1.3);
  return result;
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(own)b.heritage61=house;else delete b.heritage61;b.e.add=engineAdd;}
 closeCutWalls(f,roofFaces,add);return result;
};
// The three inward footprint edges cut through the original rectangular shell.
// Close those cuts to the existing roof profile without filling the courtyard
// or adding unverified windows. The front/outer-side loggia remains open.
function closeCutWalls(f,roof,add){
 if(f.geometry.coordinates[0].length===5)return; // Correct61parcel has no inward footprint cuts.
 const ring=f.geometry.coordinates[0],mesh=new Y.Geo.Geometry(),cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
 const height=(t,p)=>{const a=t[0],u=[t[1][0]-a[0],t[1][2]-a[2]],v=[t[2][0]-a[0],t[2][2]-a[2]],q=[p[0]-a[0],p[1]-a[2]],det=cross(u,v),s=cross(q,v)/det,r=cross(u,q)/det;return {inside:s>=-1e-5&&r>=-1e-5&&s+r<=1.00001,y:a[1]+s*(t[1][1]-a[1])+r*(t[2][1]-a[1])};};
 for(const edge of[2,3,4]){const a=ring[edge],z=ring[edge+1],d=[z[0]-a[0],z[1]-a[1]],at=t=>[a[0]+d[0]*t,a[1]+d[1]*t],cuts=[0,1];
  for(const tri of roof)for(let k=0;k<3;k++){const p=tri[k],q=tri[(k+1)%3],v=[q[0]-p[0],q[2]-p[2]],det=cross(d,v);if(Math.abs(det)<1e-9)continue;const w=[p[0]-a[0],p[2]-a[1]],t=cross(w,v)/det,u=cross(w,d)/det;if(t>0&&t<1&&u>=-1e-6&&u<=1.000001)cuts.push(t);}
  cuts.sort((a,b)=>a-b);for(let k=1;k<cuts.length;k++){const lo=cuts[k-1],hi=cuts[k];if(hi-lo<1e-7)continue;const mid=at((lo+hi)/2),candidates=roof.filter(t=>height(t,mid).inside);if(!candidates.length){const distance=t=>Math.min(...t.map((p,i)=>{const q=t[(i+1)%3],dx=q[0]-p[0],dz=q[2]-p[2],u=Math.max(0,Math.min(1,((mid[0]-p[0])*dx+(mid[1]-p[2])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(mid[0]-p[0]-dx*u,mid[1]-p[2]-dz*u);}));candidates.push(roof.reduce((a,b)=>distance(a)<distance(b)?a:b));}const tri=candidates.sort((a,b)=>height(b,mid).y-height(a,mid).y)[0],p=at(lo),q=at(hi),hp=height(tri,p).y,hq=height(tri,q).y;
   const points=[[p[0],.03,p[1]],[q[0],.03,q[1]],[q[0],hq,q[1]],[p[0],hp,p[1]]],len=Math.hypot(...d);if(Y.Footprints.inside([mid[0]-d[1]/len*.003,mid[1]+d[0]/len*.003],f.geometry))points.reverse();mesh.quad(...points);
  }
 }
 if(mesh.v.length)add('yannan267-cut-wall-shell',mesh,'#a4a49b',18,267);
}
Y.Yannan267Details={id:ID};
})(YY);
