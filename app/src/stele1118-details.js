/* Observed hanging cloud ears below the Half-moon tablet's crown.
 * Shape and depth fitted to the official photo; no invented inscription. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.halfmoonStele33;
 function ear(side){const controls=[[.49,2.205],[.625,2.20],[.677,2.145],[.675,2.04],[.654,1.89],[.63,1.76],[.565,1.73],[.525,1.77],[.505,1.91],[.49,2.02]],ring=[];
  for(let i=0;i<controls.length;i++)for(let j=0;j<8;j++){const t=j/8,p=[-1,0,1,2].map(k=>controls[(i+k+controls.length)%controls.length]);ring.push([0,1].map(k=>.5*(2*p[1][k]+(-p[0][k]+p[2][k])*t+(2*p[0][k]-5*p[1][k]+4*p[2][k]-p[3][k])*t*t+(-p[0][k]+3*p[1][k]-3*p[2][k]+p[3][k])*t*t*t)));}
  if(side<0){for(const p of ring)p[0]*=-1;ring.reverse();}
  const out=new Y.Geo.Geometry(),flat=Y.Geo.polygon(ring),front=.15,back=-.15;
  for(let i=0;i<flat.v.length;i+=24){const ps=[0,8,16].map(k=>[flat.v[i+k],flat.v[i+k+2]]);for(const z of[front,back]){const vs=ps.map(p=>[p[0],p[1],z]);if(z>0)vs.reverse();out.tri(...vs,vs.map(p=>[p[0],p[1]]));}}
  // Controls describe a clockwise outline; its right-hand side is interior.
  const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],ps=[[a[0],a[1],front],[a[0],a[1],back],[b[0],b[1],back],[b[0],b[1],front]];if(area<0)ps.reverse();out.quad(...ps);}return out;
 }

 function crownRing(){
  const ring=[[-.70,2.18]],curves=[
   [[-.77,2.18],[-.79,2.27],[-.77,2.37]],
   [[-.78,2.46],[-.70,2.51],[-.62,2.49]],
   [[-.64,2.58],[-.55,2.65],[-.46,2.62]],
   [[-.43,2.72],[-.34,2.77],[-.24,2.72]],
   [[-.20,2.79],[-.08,2.79],[0,2.79]]];
  for(const [b,c,d]of curves){const a=ring.at(-1);for(let j=1;j<=20;j++){const t=j/20,u=1-t;ring.push([0,1].map(k=>u*u*u*a[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t*t*t*d[k]));}}
  const left=ring.slice(0,-1);for(const p of left.reverse())ring.push([-p[0],p[1]]);return ring;
 }
 function extrude(ring){const g=new Y.Geo.Geometry(),flat=Y.Geo.polygon(ring);
  for(let i=0;i<flat.v.length;i+=24)for(const z of[-.165,.165]){const ps=[0,8,16].map(k=>[flat.v[i+k],flat.v[i+k+2],z]),n=Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0]));if(n[2]*z<0)ps.reverse();g.tri(...ps,ps.map(p=>[p[0],p[1]]));}
  const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],ps=[[a[0],a[1],.165],[a[0],a[1],-.165],[b[0],b[1],-.165],[b[0],b[1],.165]];if(area<0)ps.reverse();g.quad(...ps);}return g;
 }
 function relief(ring){const g=new Y.Geo.Geometry();
  function ribbon(path,width,closed=false){const n=path.length,edges=path.map((p,i)=>{const a=path[closed?(i+n-1)%n:Math.max(0,i-1)],b=path[closed?(i+1)%n:Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);return[-1,1].map(s=>[p[0]-s*dy/len*width/2,p[1]+s*dx/len*width/2]);});
   const at=(p,z)=>[...p,z];for(let i=0;i<(closed?n:n-1);i++){const a=edges[i],b=edges[(i+1)%n];g.quad(at(a[0],.172),at(b[0],.172),at(b[1],.172),at(a[1],.172));g.quad(at(a[1],.164),at(b[1],.164),at(b[0],.164),at(a[0],.164));g.quad(at(a[1],.172),at(b[1],.172),at(b[1],.164),at(a[1],.164));g.quad(at(a[0],.164),at(b[0],.164),at(b[0],.172),at(a[0],.172));}
   if(!closed){const a=edges[0],b=edges.at(-1);g.quad(at(a[1],.172),at(a[1],.164),at(a[0],.164),at(a[0],.172));g.quad(at(b[0],.172),at(b[0],.164),at(b[1],.164),at(b[1],.172));}
  }
  ribbon(ring.map(p=>[p[0]*.94,2.48+(p[1]-2.48)*.90]),.012,true);
  // Only broad visible cloud curls: no reconstructed characters or rear carving.
  for(const side of[-1,1])for(const [x,y,r]of[[.66,2.365,.061],[.29,2.615,.060]]){const pts=[];for(let j=0;j<=44;j++){const t=j/44,a=-.1+t*Math.PI*1.65,rad=r*(1-.77*t);pts.push([side*(x+Math.cos(a)*rad),y+Math.sin(a)*rad]);}if(side<0)pts.reverse();ribbon(pts,.012);}
  return g;
 }
 P.halfmoonStele33=function(...args){if(this.id!==1118)return prior.apply(this,args);
  const mesh=this.mesh,sphere=this.sphere,ownMesh=Object.prototype.hasOwnProperty.call(this,'mesh'),ownSphere=Object.prototype.hasOwnProperty.call(this,'sphere');
  this.mesh=function(key){if(key==='halfmoon33-cap')return;return mesh.apply(this,arguments);};
  this.sphere=function(x,y,z,rx,ry,rz,color){if(color==='#a1aa90'&&z===.174&&rx===.11&&ry===.07&&rz===.025)return;return sphere.apply(this,arguments);};
  let value;try{value=prior.apply(this,args);}finally{if(ownMesh)this.mesh=mesh;else delete this.mesh;if(ownSphere)this.sphere=sphere;else delete this.sphere;}
  const ring=crownRing();for(const [key,make]of[['halfmoon1118-curved-cloud-crown',()=>extrude(ring)],['halfmoon1118-shallow-cloud-relief',()=>relief(ring)]])this.mesh(key,this.geo(key,make),0,0,0,1,1,1,'#b2b5a1',10);
  for(const side of[-1,1]){const key='halfmoon1118-hanging-ear-'+side;this.mesh(key,this.geo(key,()=>ear(side)),0,0,0,1,1,1,'#b2b5a1',10);}return value;
 };
})(YY);
