/* Courtyard Three only. Its mapped C-shaped building ring omits the east
 * boundary gate. Keep the inherited building fit; restore this separate gate
 * with the square red reveal and grey brick piers visible in the 2021 photo. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/272364821',M=Y.M,G=Y.Geo;
// Complete gate-local painted composition; source photograph, not a copied
// landscape. The hidden/indistinct scenery is intentionally a plain light field.
const artSpec={beam:[3.38,4.08],front:.554,opening:2.28,capitalProjection:.14,
 scope:'front-lintel-composition-and-two-inward-stepped-pier-heads',surveyed:false};
function paintShape(points,z,depth=.004){const out=new G.Geometry(),flat=G.polygon(points),tri=(a,b,c)=>out.tri([a[0],a[2],z+depth],[b[0],b[2],z+depth],[c[0],c[2],z+depth]);
 for(let i=0;i<flat.v.length;i+=24){const a=flat.v.slice(i,i+3),b=flat.v.slice(i+8,i+11),c=flat.v.slice(i+16,i+19);tri(c,b,a);out.tri([a[0],a[2],z],[b[0],b[2],z],[c[0],c[2],z]);}
 let area=points.reduce((s,a,i)=>s+a[0]*points[(i+1)%points.length][1]-points[(i+1)%points.length][0]*a[1],0);const ps=area>0?points:points.slice().reverse();for(let i=0;i<ps.length;i++){const a=ps[i],b=ps[(i+1)%ps.length];out.quad([a[0],a[1],z],[b[0],b[1],z],[b[0],b[1],z+depth],[a[0],a[1],z+depth]);}return out;}
function gateArt(b,front){const groups=new Map(),box=G.box(),put=(color,g)=>{if(!groups.has(color))groups.set(color,new G.Geometry());groups.get(color).v.push(...g.v);},rect=(x,y,w,h,z,c)=>put(c,paintShape([[x-w/2,y-h/2],[x+w/2,y-h/2],[x+w/2,y+h/2],[x-w/2,y+h/2]],z));
 // The top of the capitals meets the existing upper beam underside. The
 // three short steps are only the two visible inward corbels, not new columns.
 const cap=new G.Geometry();for(const sign of[-1,1])for(let j=0;j<3;j++){const projection=[.045,.095,.14][j],w=projection,cx=sign*(1.39-projection/2),y=3.12+(j+.5)*(.26/3);for(let i=0;i<box.v.length;i+=8)cap.vertex([cx+box.v[i]*w,y+box.v[i+1]*(.26/3),front+.07+box.v[i+2]*.92],box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));}
 b.mesh('jingyuan167-capitals174',b.geo('jingyuan167-capitals174',()=>cap),0,0,0,1,1,1,'#969b93',18,1);
 const outline=[[-1,1],[1,1],[.99,.52],[.92,.05],[.78,-.32],[.60,-.48],[.38,-.59],[.16,-.72],[0,-1],[-.16,-.72],[-.38,-.59],[-.60,-.48],[-.78,-.32],[-.92,.05],[-.99,.52]],shape=(sx,sy,z,c)=>put(c,paintShape(outline.map(p=>[p[0]*sx,3.675+p[1]*sy]),z));
 shape(.96,.275,front+.554,'#cbbd8e');shape(.91,.255,front+.558,'#398c77');shape(.83,.215,front+.562,'#d8d0ae');
 for(const sign of[-1,1]){rect(sign*1.48,3.675,.49,.54,front+.554,'#204d65');rect(sign*1.48,3.675,.22,.54,front+.558,'#397866');for(const side of[-1,1]){rect(sign*1.48+side*.155,3.675,.035,.54,front+.558,'#cbbd8e');for(let j=0;j<5;j++){const x=sign*1.48+side*.205,y=3.435+j*.12;put('#d8d0ae',paintShape(Array.from({length:12},(_,k)=>[x+.017*Math.cos(k*Math.PI/6),y+.017*Math.sin(k*Math.PI/6)]),front+.558));}}
 const flower=(r,z,c)=>put(c,paintShape(Array.from({length:64},(_,i)=>{const a=i*Math.PI/32,rr=r*(1+.045*Math.cos(8*a));return[sign*.55+rr*Math.cos(a),3.25+rr*Math.sin(a)];}),z));flower(.122,front+.489,'#cbb16b');flower(.106,front+.493,'#397092');}
 for(const [color,g]of groups){const k='jingyuan167-paint174-'+color.slice(1);b.mesh(k,b.geo(k,()=>g),0,0,0,1,1,1,color,20,1);}
}

A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const original=b.historicJingyuan,own=Object.prototype.hasOwnProperty.call(b,'historicJingyuan');
 let bounds,gate=[];
 b.historicJingyuan=function(p,w,d){
  const emit=this.e.add,bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
  this.e.add=function(k,g,m,c,par,uv){
   if(![0,3,16].includes(par[0])){const q=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<g.v.length;i+=8){const v=M.apply(m,[g.v[i],g.v[i+1],g.v[i+2],1]);for(let j=0;j<3;j++){q[j]=Math.min(q[j],v[j]);q[j+3]=Math.max(q[j+3],v[j]);}}if(q[4]>=Math.min(4,Math.max(1.3,f.properties.height*.08)))for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j+3]);}}
   return emit.call(this,k,g,m,c,par,uv);
  };
  try{original.call(this,p,w,d);}finally{this.e.add=emit;}
  bounds=bb;const front=d/2-.85;
  this.e.add=(k,g,m,c,par,uv)=>gate.push({k,g,m:new Float32Array(m),c,par:[...par],uv});
  try{
   // Existing source gate span and roof resolution retained. The brick piers
   // and rectangular red reveal replace the source's circular red columns.
   for(const s of[-1,1]){
    this.box(s*1.74,1.825,front,.70,3.65,.78,'#969b93',18,.65);
    this.box(s*1.28,1.7025,front+.37,.28,2.835,.24,'#7e3329',20,.85);
   }
   this.box(0,3.25,front+.37,2.84,.26,.24,'#7e3329',20,1);
   this.box(0,3.73,front,3.8,.70,1.11,'#7e3329',20,1);
   this.v9Roof(0,4.23,front,4.9,2.26,1,'gable',1.8);
   // One retained-source-height landing, grounded below its original top.
   this.box(0,.1425,front+.2,3.6,.285,1.3,'#b4b3a1',21,.08);
   gateArt(this,front);
  }finally{this.e.add=emit;}
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.historicJingyuan=original;else delete b.historicJingyuan;}
 if(bounds&&result?.frame){const fr=result.frame,root=M.multiply(M.transform([fr.centre[0],0,fr.centre[1]],result.scale,fr.r),M.transform([-(bounds[0]+bounds[3])/2,0,-(bounds[2]+bounds[5])/2],[1,1,1],0));for(const q of gate)b.e.add('jingyuan167-gate-'+q.k,q.g,M.multiply(root,q.m),q.c,[q.par[0],f.properties.pickId,0,q.par[3]],q.uv);}
 return result;
};
Y.Jingyuan167Details={id:ID,prefix:'jingyuan167-gate-',art174:artSpec};
})(YY);
