/* 100丹墀 public scan surface: two dragons and pearl, clouds and double border.
 * Documented stone size 3.15 × 1.3m. Native scan slope retained; adjacent nine treads are shortened to join
 * the unchanged landing. Display registration is not a site survey. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.historicOffice;
P.historicOffice=function(p,w=59,d=23){
 const box=this.box,boxd=Object.getOwnPropertyDescriptor(this,'box');let stairs=0;
 const beam=this.beam,mesh=this.mesh,bd=Object.getOwnPropertyDescriptor(this,'beam'),md=Object.getOwnPropertyDescriptor(this,'mesh');let bars=0,ramp=0;
 this.box=function(x,y,z,ww,h,dd,...rest){
  if(Math.abs(x)===3.6&&ww===4.4&&h===.24&&dd===1.04&&y>=.12&&y<=1.561){const i=Math.round((y-.12)/.18);stairs++;return box.call(this,Math.sign(x)*(5.8+.65/1.1375538376894576)/2,y,d/2+.06+6.82-i*.42,5.8-.65/1.1375538376894576,.24,.80,...rest);}
  return box.call(this,x,y,z,ww,h,dd,...rest);
 };
 this.beam=function(a,b,r,...args){
  if(r===.028&&a[1]===0&&a[2]===0&&b[1]===0&&b[2]===-.08&&a[0]>=-.99&&a[0]<=-.77&&b[0]>=.75&&b[0]<=1.01){bars++;return;}
  return beam.call(this,a,b,r,...args);
 };
 this.mesh=function(key,...args){if(key==='v9-office-danbi')ramp++;return mesh.call(this,key,...args);};
 try{prior.call(this,p,w,d);}finally{if(boxd)Object.defineProperty(this,'box',boxd);else delete this.box;if(bd)Object.defineProperty(this,'beam',bd);else delete this.beam;if(md)Object.defineProperty(this,'mesh',md);else delete this.mesh;}
 if(bars!==18||ramp!==1||stairs!==18)throw Error('Office dragon source guard: '+bars+'/'+ramp+'/'+stairs);
 const slope=.41089786/.91138055,co=1/Math.sqrt(1+slope*slope),si=slope*co,facade=d/2+.06;
 const key='office105-scan-dragons318',data=Y.Office105Dragons318;
 const geo=this.geo(key,()=>{const g=new Y.Geo.Geometry(),v=data.vertices,n=data.normals;
  const point=p=>[p[0]/1.1375538376894576,(p[1]*co-p[2]*si)/.99588103771918,(p[1]*si+p[2]*co)/.8354080944337477];
  const normal=n=>{const a=[n[0]*1.1375538376894576,(n[1]*co-n[2]*si)*.99588103771918,(n[1]*si+n[2]*co)*.8354080944337477],l=Math.hypot(...a);return a.map(x=>x/l);};
  for(let i=0;i<data.indices.length;i+=3){const a=data.indices.slice(i,i+3);g.tri(...a.map(k=>point(v[k])),undefined,a.map(k=>normal(n[k])));}
  // Only the four real outer crop edges connect to the stone bedding.
  // Interior scan boundaries/creases receive no invented vertical curtains.
  const edges=new Map();for(let i=0;i<data.indices.length;i+=3)for(let j=0;j<3;j++){const a=data.indices[i+j],b=data.indices[i+(j+1)%3],k=a<b?a+','+b:b+','+a;const e=edges.get(k);if(e)e.count++;else edges.set(k,{a,b,count:1});}
  const sameOuter=(a,b)=>[0,2].some(axis=>{const limit=axis===0?.65:1.575;return Math.abs(Math.abs(a[axis])-limit)<.000002&&Math.abs(a[axis]-b[axis])<.000002;});
  for(const e of edges.values()){if(e.count!==1)continue;const a=v[e.a],b=v[e.b];if(!sameOuter(a,b))continue;
   const p=[point(b),point(a),point([a[0],-.06,a[2]]),point([b[0],-.06,b[2]])],axis=Math.abs(Math.abs(a[0])-.65)<.000002&&Math.abs(a[0]-b[0])<.000002?0:2;
   const n=Y.M.cross(Y.M.sub(p[1],p[0]),Y.M.sub(p[2],p[0]));if(n[axis]*Math.sign(a[axis])<0)p.reverse();g.quad(...p);
  }
  // Neutral solid bedding under the measured skin, closed to the ground.
  const top=[[-.65,-.06,-1.575],[.65,-.06,-1.575],[.65,-.06,1.575],[-.65,-.06,1.575]].map(point);
  g.quad(top[0],top[3],top[2],top[1]);
  for(let i=0;i<4;i++){const a=top[i],b=top[(i+1)%4];g.quad(a,b,[b[0],-.915,b[2]],[a[0],-.915,a[2]]);}
  return g;
 });

 // Complete scan slab replaces the old oversized panel; no underlying broad ramp.
 this.mesh(key,geo,0,.915,facade+4.98,1,1,1,'#a5a497',10,.23);
 this.box(0,.12,facade+6.82,1.3/1.1375538376894576,.24,.80,'#adada2',10,.2);
 this.box(0,1.61,facade+3.20,1.3/1.1375538376894576,.14,.32,'#adada2',10,.2);
};
// Preserve the original adapter fitting envelope, then discard only its old ramp.
const A=Y.Architecture30,render=A.render;A.render=function(b,f,...args){
 if(f.properties.pickId!==105)return render.call(this,b,f,...args);
 const add=b.e.add,own=Object.getOwnPropertyDescriptor(b.e,'add');let removed=0;
 b.e.add=function(k,...rest){if(k==='v30-v9-office-danbi'){removed++;return;}return add.call(this,k,...rest);};
 let result;try{result=render.call(this,b,f,...args);}finally{if(own)Object.defineProperty(b.e,'add',own);else delete b.e.add;}
 if(removed!==1)throw Error('Office original ramp removal guard '+removed);return result;
};})(YY);
