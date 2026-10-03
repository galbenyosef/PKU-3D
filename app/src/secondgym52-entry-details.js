/* Second Gymnasium: north lawn arched entrance, 2017 official repair photographs.
 * Shape/width/depth fitted; leaf hardware and basement entrance remain undocumented. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M;
A.render=function(b,f,add){if(f.properties.pickId!==52||f.properties.id!=='way/226703041')return prior.call(this,b,f,add);
 const keys=['secondGymHistoric','s18box','s18Window','s18Arch'],saved=keys.map(k=>[k,Object.hasOwn(b,k),b[k]]),source=b.secondGymHistoric,box=b.s18box,win=b.s18Window,steps=[];
 const half=1.60,bottom=.38,spring=.38+3.18*.56,rise=3.18*.44,top=.38+3.18,depth=.80,N=64;
 const curve=x=>spring+rise*Math.sqrt(Math.max(0,1-x*x/(half*half)));
 b.secondGymHistoric=function(...args){
 b.s18box=function(k,x,y,z,w,h,d,...rest){
  if(k==='v18-gym-step'){const old=this.e.add;this.e.add=(...a)=>steps.push(a);try{return box.call(this,k,x,y,-z,w,h,d,...rest);}finally{this.e.add=old;}}
  if(k==='v18-stone-base'){const front=-d/2;
   box.call(this,k+'-rear',0,h/2,depth/2,w,h,d-depth,...rest);
   for(const s of[-1,1])box.call(this,k+'-side-'+s,s*(w/2+half)/2,h/2,front+depth/2,w/2-half,h,depth,...rest);
   box.call(this,k+'-sill',0,bottom/2,front+depth/2,half*2,bottom,depth,...rest);
   const geo=new G.Geometry();for(let i=0;i<N;i++){const x0=-half+2*half*i/N,x1=-half+2*half*(i+1)/N,y0=curve(x0),y1=curve(x1),za=front,zb=front+depth;
    geo.quad([x0,y0,za],[x0,h,za],[x1,h,za],[x1,y1,za]);geo.quad([x1,y1,zb],[x1,h,zb],[x0,h,zb],[x0,y0,zb]);
    geo.quad([x0,y0,za],[x1,y1,za],[x1,y1,zb],[x0,y0,zb]);geo.quad([x0,h,zb],[x1,h,zb],[x1,h,za],[x0,h,za]);
   }geo.quad([-half,spring,front+depth],[-half,h,front+depth],[-half,h,front],[-half,spring,front]);geo.quad([half,spring,front],[half,h,front],[half,h,front+depth],[half,spring,front+depth]);
   this.mesh('secondgym52-north-arch-haunch',geo,0,0,0,1,1,1,rest[0],rest[1],rest[2]);return;
  }
  if(z<0&&(k==='v18-stone-course'||k==='v18-stone-joint')&&y-h/2<top&&y+h/2>bottom){if(k==='v18-stone-joint'&&Math.abs(x)<half+.04)return;if(k==='v18-stone-course'){const cut=half+.035;for(const s of[-1,1])box.call(this,k+'-cut-'+s,s*(w/2+cut)/2,y,z,w/2-cut,h,d,...rest);return;}}
  return box.call(this,k,x,y,z,w,h,d,...rest);
 };
 b.s18Window=function(x,y,z,...a){if(z<0&&Math.abs(x)<1e-6&&Math.abs(y-2.4)<1e-6)return;return win.call(this,x,y,z,...a);};
 b.s18Arch=function(x,z,w,h,base){const front=-(z-.11);this.local(0,0,front,Math.PI,()=>{
  // Full arched leaf pair closes behind a true curved recess. No invented carvings.
  const geo=new G.Geometry(),outline=[[-half,bottom],[half,bottom],[half,spring]];
  for(let i=1;i<=N;i++){const a=i*Math.PI/N;outline.push([half*Math.cos(a),spring+rise*Math.sin(a)]);}const zf=-.28,zb=-.39,centre=[0,(bottom+spring)/2];
  for(let i=0;i<outline.length;i++){const p=outline[i],q=outline[(i+1)%outline.length];geo.tri([...centre,zf],[...p,zf],[...q,zf]);geo.tri([...centre,zb],[...q,zb],[...p,zb]);geo.quad([...p,zb],[...q,zb],[...q,zf],[...p,zf]);}
  this.mesh('secondgym52-north-door',geo,0,0,0,1,1,1,'#673e36',20,.51);
  box.call(this,'secondgym52-door-centre-seam',0,(bottom+top)/2,zf+.01,.032,top-bottom,.028,'#3f302c',20,.52);
 });};return source.apply(this,args);
 };
 try{const r=prior.call(this,b,f,add),root=M.transform([r.frame.centre[0],0,r.frame.centre[1]],r.scale,r.frame.r);for(const[k,g,m,c,p,uv]of steps)b.e.add('v30-secondgym52-restored-'+k,g,M.multiply(root,m),c,p,uv);const start=M.apply(root,[0,0,-17.30,1]);const approach=G.ribbon([[start[0],start[2]],[-161.765,262.526]],2.7,.12,false);
 // Trim against the actual Float32 south boundary of Jingyuan Road (pick74).
 // The inherited road is a ribbon with averaged tangents at bends, not a constant-z strip.
 const road=Y.CAMPUS.features.find(q=>q.properties.pickId===74);
 if(!road)throw new Error('Second gym approach requires mapped Jingyuan Road');
 const rv=new Float32Array(G.ribbon(road.geometry.coordinates,road.properties.width,.12,false).v);
 let edge=null;for(let i=0;i<rv.length;i+=48){const a=Array.from(rv.slice(i,i+3)),c=Array.from(rv.slice(i+8,i+11));if(start[0]>=Math.min(a[0],c[0])&&start[0]<=Math.max(a[0],c[0])&&Math.max(a[2],c[2])<start[2]){edge=[a,c];break;}}
 if(!edge)throw new Error('Second gym approach road edge not located');
 const [a,c]=edge,side=v=>(c[0]-a[0])*(v[2]-a[2])-(c[2]-a[2])*(v[0]-a[0]),joined=new G.Geometry(),av=new Float32Array(approach.v);
 for(let i=0;i<av.length;i+=24){const poly=[0,8,16].map(k=>Array.from(av.slice(i+k,i+k+8))),out=[];for(let j=0;j<3;j++){const p=poly[j],q=poly[(j+1)%3],sp=side(p),sq=side(q);if(sp>=0)out.push(p);if((sp>=0)!==(sq>=0)){const t=sp/(sp-sq);const v=p.map((v,k)=>v+(q[k]-v)*t);v[0]=Math.fround(v[0]);v[2]=Math.fround(v[2]);if(side(v)<0){const bits=new Uint32Array(new Float32Array([v[2]]).buffer);bits[0]++;v[2]=new Float32Array(bits.buffer)[0];}out.push(v);}}for(let j=1;j+1<out.length;j++)for(const v of[out[0],out[j],out[j+1]])joined.vertex(v.slice(0,3),v.slice(3,6),v.slice(6,8));}
 b.e.add('v30-secondgym52-approach',joined,M.identity(),'#cbc7b7',[7,52,0,0]);return r;}finally{for(const[k,own,fn]of saved){if(own)b[k]=fn;else delete b[k];}}
};})(YY);
