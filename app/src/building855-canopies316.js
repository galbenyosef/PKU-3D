/* 59 north: three barrel canopies occur directly below the three five-circle
 * columns in the registered official scan. Keep the already delivered axes as
 * facade fits: scan/OSM outer edges do not support a geographic axis relocation.
 * Doors and ground levels remain unresolved; no stock door or step is supplied. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/849765888',G=Y.Geo;
const DIM={innerRadius:1.00,outerRadius:1.10,spring:2.22,back:-.045,front:.86,segments:64};
function locations(f){const ring=f.geometry.coordinates[0],sign=Y.Footprints.area(ring)>0?1:-1;return[[5,1],[8,2],[8,7]].map(([i,k])=>{const a=ring[i],c=ring[i+1],L=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/L,uz=(c[1]-a[1])/L,nx=uz*sign,nz=-ux*sign,t=(k+.5)*L/Math.floor(L/3.6);return{x:a[0]+ux*t+nx*.045,z:a[1]+uz*t+nz*.045,r:Math.atan2(nx,nz),nx,nz};});}
function shell(){const g=new G.Geometry(),d=DIM,pt=(a,r,z)=>[Math.cos(a)*r,d.spring+Math.sin(a)*r,z];
 const quad=(ps,wanted)=>{const u=ps[1].map((v,j)=>v-ps[0][j]),v=ps[2].map((v,j)=>v-ps[0][j]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n.reduce((s,x,i)=>s+x*wanted[i],0)<0)ps.reverse();g.quad(...ps);};
 for(let i=0;i<d.segments;i++){const a=i*Math.PI/d.segments,b=(i+1)*Math.PI/d.segments,m=(a+b)/2,n=[Math.cos(m),Math.sin(m),0];
  quad([pt(a,d.outerRadius,d.back),pt(b,d.outerRadius,d.back),pt(b,d.outerRadius,d.front),pt(a,d.outerRadius,d.front)],n);
  quad([pt(a,d.innerRadius,d.back),pt(b,d.innerRadius,d.back),pt(b,d.innerRadius,d.front),pt(a,d.innerRadius,d.front)],n.map(x=>-x));
  for(const[z,s]of[[d.front,1],[d.back,-1]])quad([pt(a,d.innerRadius,z),pt(b,d.innerRadius,z),pt(b,d.outerRadius,z),pt(a,d.outerRadius,z)],[0,0,s]);
 }
 for(const a of[0,Math.PI])quad([pt(a,d.innerRadius,d.back),pt(a,d.outerRadius,d.back),pt(a,d.outerRadius,d.front),pt(a,d.innerRadius,d.front)],[0,-1,0]);
 return g;
}
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);const axes=locations(f),old=b.window,owned=Object.hasOwn(b,'window'),oldMesh=b.mesh,ownedMesh=Object.hasOwn(b,'mesh'),low=.55+(f.properties.height-.55)/6;let removed=0,clipped=0;
 b.window=function(x,y,z,...args){if(y<low&&axes.some(p=>Math.hypot(x-p.x,z-p.z)<.001)){removed++;return;}return old.call(this,x,y,z,...args);};
 // Retain each original decorative strip outside the small canopy clearance.
 // The solid wall and upper circle windows are never intercepted here.
 b.mesh=function(k,g,x,y,z,sx,sy,sz,col,mat=0,part=0,r=0,uv){
  const c=this.world([x,y,z]),angle=this.rotation+r,ux=Math.cos(angle),uz=-Math.sin(angle),nx=-uz,nz=ux,d=DIM;
  let spans=[[-sx/2,sx/2]],cuts=0;
  if(k==='box'&&sy<.5&&c[1]-sy/2>d.spring&&c[1]-sy/2<d.spring+d.outerRadius&&c[1]+sy/2>d.spring){
   for(const p of axes){if(Math.abs(nx*p.nx+nz*p.nz)<.999999)continue;
    const dx=p.x-c[0],dz=p.z-c[2],along=dx*ux+dz*uz,depth=-(dx*nx+dz*nz);
    if(depth+sz/2<d.back||depth-sz/2>d.front)continue;
    const half=Math.sqrt(Math.max(0,d.outerRadius*d.outerRadius-Math.pow(c[1]-sy/2-d.spring,2)))+.025,lo=along-half,hi=along+half;
    const next=[];for(const[a,b]of spans){if(hi<=a||lo>=b){next.push([a,b]);continue;}cuts++;if(lo>a)next.push([a,lo]);if(hi<b)next.push([hi,b]);}spans=next;
   }
  }
  if(!cuts)return oldMesh.call(this,k,g,x,y,z,sx,sy,sz,col,mat,part,r,uv);
  clipped++;
  for(const[a,b]of spans){const offset=(a+b)/2;oldMesh.call(this,'building855-canopy316-cleared-trim',g,x+Math.cos(r)*offset,y,z-Math.sin(r)*offset,b-a,sy,sz,col,mat,part,r,uv);}
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(owned)b.window=old;else delete b.window;if(ownedMesh)b.mesh=oldMesh;else delete b.mesh;}
 const state=[b.origin,b.rotation,b.id,b.anim];b.id=f.properties.pickId;b.anim=0;
 try{for(const p of axes)b.local(p.x,0,p.z,p.r,()=>b.mesh('building855-canopy316-shell',b.geo('building855-canopy316-shell',shell),0,0,0,1,1,1,'#c6c6bc',24));}finally{[b.origin,b.rotation,b.id,b.anim]=state;}
 return{...result,northCanopiesObserved:3,canopyCrossingTrimRecordsClipped:clipped,northCanopyDimensionsMeasured:false,northCanopyAxesRetainFacadeFit:true,groundTemplateWindowsAtCanopiesRemoved:removed,doorLeavesVerified:false,groundContactVerified:false,entranceVerified:false};
};Y.Building855Canopies316={locations,DIM,shell};
})(YY);
