/* Weixiu 21's registered west-end photo shows uninterrupted grey panels
 * between the two edge strips. The old window-suppression override retained
 * a generic interior full-height pier. Remove only that obsolete pier. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/876533975';
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const [a,c]=f.geometry.coordinates[0],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),nx=-dz/L,nz=dx/L,old=b.box,had=Object.hasOwn(b,'box');let removed=0;
 b.box=function(x,y,z,w,h,d,...args){const p=this.world([x,y,z]),u=((p[0]-a[0])*dx+(p[2]-a[1])*dz)/L,v=(p[0]-a[0])*nx+(p[2]-a[1])*nz;
 if(Math.abs(w-.25)<1e-8&&Math.abs(h-f.properties.height)<1e-8&&Math.abs(d-.34)<1e-8&&u>L*.25&&u<L*.75&&Math.abs(v)<.1&&Math.sin(this.rotation)*nx+Math.cos(this.rotation)*nz>.999){removed++;return;}
 return old.call(this,x,y,z,w,h,d,...args);};
 let r;try{r=prior.call(this,b,f,add);}finally{if(had)b.box=old;else delete b.box;}return{...r,removedGenericInteriorWestPiers:removed};};
})(YY);
