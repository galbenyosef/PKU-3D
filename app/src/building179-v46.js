/* Chengzeyuan 103: south grey lean-to sheet visible in the official 2022 road
 * photograph and registered to the long south edge by the labelled site plan.
 * The 2026 winter image shows the narrow strip between the two end walls.
 * Projection, end setbacks and slope are display fits, not surveyed dimensions.
 * Balcony divisions and the unseen entrance remain unresolved; retain the source
 * walls, windows, north facade and roof. Photo-left doors belong to building 102. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/916931892';
function canopy(f,height){
 const ring=f.geometry.coordinates[0],source=[ring[1],ring[2],ring[3]],setback=1.6,back=-.08,front=1.5,drop=.36,thickness=.075;
 const segments=source.slice(1).map((c,i)=>{const a=source[i],length=Math.hypot(c[0]-a[0],c[1]-a[1]);return{a,c,length,ux:(c[0]-a[0])/length,uz:(c[1]-a[1])/length};});
 // Follow both original south segments; a shared miter keeps their slight kink closed.
 const stations=source.map((p,i)=>{const e=segments[Math.min(i,1)],other=segments[Math.max(0,i-1)],nx=-(e.uz+other.uz)/2,nz=(e.ux+other.ux)/2,norm=nx*(-e.uz)+nz*e.ux,shift=i===0?setback:i===2?-setback:0;return{x:p[0]+e.ux*shift,z:p[1]+e.uz*shift,nx:nx/norm,nz:nz/norm};});
 const point=(s,v,dy=0)=>[s.x+s.nx*v,height-drop*(v-back)/(front-back)+dy,s.z+s.nz*v],g=new Y.Geo.Geometry();
 for(let i=1;i<stations.length;i++){const a=stations[i-1],c=stations[i];g.quad(point(a,back),point(a,front),point(c,front),point(c,back));g.quad(point(c,back,-thickness),point(c,front,-thickness),point(a,front,-thickness),point(a,back,-thickness));
  g.quad(point(a,front),point(a,front,-thickness),point(c,front,-thickness),point(c,front));g.quad(point(c,back),point(c,back,-thickness),point(a,back,-thickness),point(a,back));}
 const a=stations[0],c=stations[2];g.quad(point(a,back),point(a,back,-thickness),point(a,front,-thickness),point(a,front));g.quad(point(c,front),point(c,front,-thickness),point(c,back,-thickness),point(c,back));return g;
}
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const result=previous.call(this,b,f,add),height=.55+(result.bodyHeight-.55)/3+.12;
 add('179-observed-south-grey-canopy',canopy(f,height),'#797e7b',29,f.properties.pickId);
 return{...result,strategy:'building179-v46',observedSouthCanopy:true,balconyDivisionsVerified:false,entranceVerified:false};
};
Y.Building179={id:ID};
})(YY);
