/* Stone lintel infill and inward hanging shoulders observed in the PKU archive photo.
 * Dimensions/depth are fitted; this does not reproduce unresolvable carving or rear poems. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.snowArch33;
function shoulder(side){
 const ring=[[.91,2.963],[1.155,2.963],[1.155,2.61],[1.12,2.61]];
 // Shallow rounded lower inner shoulder, rising into the underside of the lintel.
 for(let i=1;i<24;i++){const t=i/24;ring.push([1.12-.21*t,2.61+.353*(t*t)]);}
 if(side<0){for(const p of ring)p[0]*=-1;ring.reverse();}
 const geo=new Y.Geo.Geometry(),flat=Y.Geo.polygon(ring),depth=.34;
 for(let i=0;i<flat.v.length;i+=24){const ps=[0,8,16].map(k=>[flat.v[i+k],flat.v[i+k+2]]);for(const z of[-depth/2,depth/2]){const vs=ps.map(p=>[p[0],p[1],z]);if(z>0)vs.reverse();geo.tri(...vs,vs.map(p=>[p[0],p[1]]));}}
 const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
 let length=0;for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],d=Math.hypot(b[0]-a[0],b[1]-a[1]),ps=[[a[0],a[1],depth/2],[a[0],a[1],-depth/2],[b[0],b[1],-depth/2],[b[0],b[1],depth/2]],uv=[[length,depth],[length,0],[length+d,0],[length+d,depth]];if(area<0){ps.reverse();uv.reverse();}geo.tri(ps[0],ps[1],ps[2],[uv[0],uv[1],uv[2]]);geo.tri(ps[0],ps[2],ps[3],[uv[0],uv[2],uv[3]]);length+=d;}return geo;
}
P.snowArch33=function(...args){const value=prior.apply(this,args);if(this.id!==1120)return value;
 this.mesh('snow1120-lintel-infill',this.geo('snow1120-lintel-infill',Y.Geo.box),0,3.3375,0,2.3,.085,.34,'#b9b6a7',10);
 for(const s of[-1,1]){const k='snow1120-shoulder-'+s;this.mesh(k,this.geo(k,()=>shoulder(s)),0,0,0,1,1,1,'#b9b6a7',10);}return value;
};})(YY);
