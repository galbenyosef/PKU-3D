/* Changchunyuan 55: the dated south-center and southwest photographs show
 * metal security grilles across the ground-floor windows. Keep the inherited
 * window locations and all original geometry. Bar spacing/projection are fits;
 * the photographed east entrance is not placed without an established axis. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/849765900';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const ring=Y.Footprints.polygons(f.geometry)[0][0],sign=Y.Footprints.area(ring)>0?1:-1;
 const edges=ring.slice(1).map((p,i)=>{const a=ring[i],l=Math.hypot(p[0]-a[0],p[1]-a[1]);return{a,nx:(p[1]-a[1])*sign/l,nz:-(p[0]-a[0])*sign/l};});
 const south=edges.find(e=>e.nz>.9),old=b.window,had=Object.hasOwn(b,'window');let count=0;
 b.window=function(x,y,z,w,h,r,...args){
  const result=old.call(this,x,y,z,w,h,r,...args);
  if(y>=f.properties.height/5||Math.abs((x-south.a[0])*south.nx+(z-south.a[1])*south.nz-.045)>1e-5)return result;
  const g=new Y.Geo.Geometry(),box=(x,y,z,w,h,d)=>{const q=Y.Geo.box();for(let i=0;i<q.v.length;i+=8)g.vertex([x+q.v[i]*w,y+q.v[i+1]*h,z+q.v[i+2]*d],q.v.slice(i+3,i+6),q.v.slice(i+6,i+8));};
  const W=w*.954,H=h*.952,n=Math.ceil(W/.14);
  for(const s of[-1,1]){box(s*W/2,0,.17,.025,H+.025,.04);box(0,s*H/2,.17,W,.025,.04);}
  for(let i=1;i<n;i++)box(-W/2+i*W/n,0,.17,.018,H,.025);
  for(const y of[-H/4,H/4])box(0,y,.17,W,.018,.025);
  // Short attachments touch the existing outer frame at z=.08.
  for(const sx of[-1,1])for(const sy of[-1,1])box(sx*W/2,sy*H*.40,.125,.025,.055,.09);
  this.local(x,y,z,r,()=>this.mesh('building877-south-ground-grille-'+w.toFixed(6)+'-'+h.toFixed(6),g,0,0,0,1,1,1,'#c0c8c5',9,.7));count++;
  return result;
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(had)b.window=old;else delete b.window;}
 return{...result,southGroundSecurityGrilles:count,grilleDimensionsMeasured:false,entranceVerified:false};
};
})(YY);
