/* East library: fitted four short entrance rises and a small road-height apron.
 * 2020-11 completion photographs show the exposed approach, not a sunken slot.
 * Retain all existing doorway/canopy dimensions; heights are visual fits. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='relation/3249649',GROUND=.12*43.5/32.5,near=(a,b)=>Math.abs(a-b)<1e-7;
function clip(poly,a,b,inside){const out=[],side=p=>(b[0]-a[0])*(p[2]-a[2])-(b[2]-a[2])*(p[0]-a[0]);for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],u=side(p),v=side(q),pin=inside?u>=0:u<=0,qin=inside?v>=0:v<=0;if(pin)out.push(p);if(pin!==qin){const t=u/(u-v);out.push(p.map((x,k)=>x+(q[k]-x)*t));}}return out;}
function apron(r,m){const G=Y.Geo,M=Y.M,g=new G.Geometry(),inv=M.inverse(m),cuts=[];const points=[];for(let i=0;i<r.g.v.length;i+=8){const v=r.g.v.slice(i,i+8),p=M.apply(m,[...v.slice(0,3),1]),n=M.norm([inv[0]*v[3]+inv[1]*v[4]+inv[2]*v[5],inv[4]*v[3]+inv[5]*v[4]+inv[6]*v[5],inv[8]*v[3]+inv[9]*v[4]+inv[10]*v[5]]);points.push([...p.slice(0,3),...n,...v.slice(6,8)]);}const bb=[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[2])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[2]))];for(const f of Y.CAMPUS.features){const p=f.properties,b=p.bounds;if(p.kind!=='road'||f.geometry.type!=='LineString'||!b||b[0]>bb[2]+p.width||b[2]<bb[0]-p.width||b[1]>bb[3]+p.width||b[3]<bb[1]-p.width)continue;const road=Y.Road717Join.clip(f,Y.Road511Join.clip(f,Y.Road748Join.clip(f,Y.StudentCenterSouth46.clipGroundRibbon(Y.Landscape42.warp(G.ribbon(f.geometry.coordinates,p.width,.12,false))))));const v=new Float32Array(road.v);for(let i=0;i<v.length;i+=24){const t=[0,8,16].map(k=>Array.from(v.slice(i+k,i+k+3)));if((t[1][0]-t[0][0])*(t[2][2]-t[0][2])-(t[1][2]-t[0][2])*(t[2][0]-t[0][0])<0)t.reverse();cuts.push(t);}}
for(let i=0;i<points.length;i+=3){let parts=[points.slice(i,i+3)];for(const t of cuts){const next=[];for(let poly of parts){for(let k=0;k<3&&poly.length;k++){const outside=clip(poly,t[k],t[(k+1)%3],false);if(outside.length>=3)next.push(outside);poly=clip(poly,t[k],t[(k+1)%3],true);}}parts=next;}for(const p of parts)for(let j=1;j<p.length-1;j++)for(const v of[p[0],p[j],p[j+1]])g.vertex(v.slice(0,3),v.slice(3,6),v.slice(6,8));}return g;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const adapter=Y.ArchitectureAdapter,adapt=adapter.render;let extras=[],sourceBase;adapter.render=function(builder,feature,method,source,options){if(method!=='libraryEast')return adapt.call(this,builder,feature,method,source,options);const emit=builder.e.add;let root;builder.e.add=function(key,g,m,c,p,uv){if(!root&&sourceBase&&key==='v30-box'&&c==='#b3b2a8')root=Y.M.multiply(m,Y.M.inverse(sourceBase));return emit.call(this,key,g,m,c,p,uv);};try{const result=adapt.call(this,builder,feature,method,source,options);if(root)for(const r of extras)emit.call(builder.e,'library57-entry-apron',apron(r,Y.M.multiply(root,r.m)),Y.M.identity(),r.c,[r.p[0],feature.properties.pickId,0,r.p[3]],r.uv);return result;}finally{builder.e.add=emit;}};const old=b.libraryEast,own=Object.prototype.hasOwnProperty.call(b,'libraryEast');
 b.libraryEast=function(p,w,d){const box=this.box,had=Object.prototype.hasOwnProperty.call(this,'box');let steps=false;
 this.box=function(x,y,z,bw,h,bd,c,...rest){
  if(near(x,0)&&near(y,.30)&&near(z,0)&&near(bw,w+1.5)&&near(h,.60)&&near(bd,d+1.5)){
   const side=(bw-50)/2;sourceBase=Y.M.transform([-(25+side/2),y,0],[side,h,bd],0);for(const s of[-1,1])box.call(this,s*(25+side/2),y,z,side,h,bd,c,...rest);
   const back=-bd/2,front=23.4;return box.call(this,0,y,(back+front)/2,50,h,front-back,c,...rest);
  }
  const external=(...args)=>{const emit=this.e.add;this.e.add=(key,g,m,c,p,uv)=>extras.push({key,g,m:new Float32Array(m),c,p:[...p],uv});try{return box.call(this,...args);}finally{this.e.add=emit;}};
  if(near(x,0)&&near(y,.16)&&near(z,40.7)&&near(bw,119)&&near(h,.28)&&near(bd,31)){
   // Preserve the original frontage through normal footprint clipping. Only
   // remove the 14.7 by .8 entry connection occupied by the lower apron.
   const half=7.35,side=bw/2-half;
   for(const sign of[-1,1])box.call(this,sign*(half+side/2),y,z,side,h,bd,c,...rest);
   box.call(this,0,y,(26+56.2)/2,14.7,h,56.2-26,c,...rest);
   return external(0,GROUND/2,25.6,14.7,GROUND,.8,c,...rest);
  }
  for(let i=0;i<3;i++)if(near(x,0)&&near(y,.14+i*.17)&&near(z,17.7-i*.64)&&near(bw,14.7)&&near(h,.28)&&near(bd,1.33)){
   if(!steps){steps=true;for(let j=0;j<4;j++){const top=GROUND+(j+1)*(.6-GROUND)/4;box.call(this,0,top/2,25.2-(j+.5)*.45,14.7,top,.45,c,...rest);}}return;
  }
  return box.call(this,x,y,z,bw,h,bd,c,...rest);
 };
 try{return old.call(this,p,w,d);}finally{if(had)this.box=box;else delete this.box;}
 };
 try{return previous.call(this,b,f,add);}finally{adapter.render=adapt;if(own)b.libraryEast=old;else delete b.libraryEast;}
};
})(YY);
