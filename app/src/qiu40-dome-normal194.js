/* Source-owned qiuGymnasium low-glass-dome ribs. Format194 stores the original
 * Float32 cylinder normal times 1024 (exact binary scaling) in one shared mesh.
 * Position, UV, 28-float instance fields and original source order stay intact. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,TAG='qiu40-dome-normal194-source',KEY='qiu40-dome-normal194-cyl8_1',cache=new WeakMap();
A.render=function(b,f,add){
 if(f.properties.pickId!==40)return prior.call(this,b,f,add);
 if(![1,2].includes(Y.Engine.normalTransformFormat194))throw Error('Qiu dome194 requires normal transform format194 engine');
 const e=b.e,emit=e.add,beam=b.beam,gym=b.qiuGymnasium,ownAdd=Object.hasOwn(e,'add'),ownBeam=Object.hasOwn(b,'beam'),ownGym=Object.hasOwn(b,'qiuGymnasium');let depth=0,calls=0,records=0;
 b.qiuGymnasium=function(...args){depth++;try{return gym.apply(this,args);}finally{depth--;}};
 b.beam=function(...args){
  if(!depth||args[2]!==.065||args[3]!=='#d2d7cc'||args[4]!==37||args[5]!==2.6)return beam.apply(this,args);
  if(++calls>864)throw Error('Qiu dome194 source count changed');
  const owner=this.e,send=owner.add,own=Object.hasOwn(owner,'add');let count=0;
  owner.add=function(k,...rest){if(k!=='cyl8_1'||++count!==1)throw Error('Qiu dome194 beam emission changed');return send.call(this,TAG,...rest);};
  try{return beam.apply(this,args);}finally{if(own)owner.add=send;else delete owner.add;}
 };
 e.add=function(k,g,m,c,p,uv){
  if(k!=='v30-'+TAG)return emit.call(this,k,g,m,c,p,uv);
  if(++records>864||p[0]!==37||p[1]!==40||p[2]!==0||p[3]!==2.6||c!=='#d2d7cc')throw Error('Qiu dome194 final registration changed');
  const a=Array.from(m.slice(0,3)),b=Array.from(m.slice(4,7)),d=Array.from(m.slice(8,11)),det=a[0]*(b[1]*d[2]-b[2]*d[1])+a[1]*(b[2]*d[0]-b[0]*d[2])+a[2]*(b[0]*d[1]-b[1]*d[0]),scale=Math.hypot(...a)*Math.hypot(...b)*Math.hypot(...d);
  if(!Number.isFinite(det)||!Number.isFinite(scale)||scale===0||Math.abs(det)<1e-12||Math.abs(det)/scale<1e-6)throw Error('Qiu dome194 singular matrix');
  let marked=cache.get(g);if(!marked){const v=new Float32Array(g.v);for(let i=0;i<v.length;i+=8){const size=Math.hypot(v[i+3],v[i+4],v[i+5]);if(!Number.isFinite(size)||Math.abs(size-1)>.000001)throw Error('Qiu dome194 source normal changed');for(let j=3;j<6;j++){const n=v[i+j];v[i+j]=n*1024;if(!Object.is(v[i+j]/1024,n))throw Error('Qiu dome194 normal encoding not exact');}}marked={...g,v};cache.set(g,marked);}
  return emit.call(this,KEY,marked,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(ownAdd)e.add=emit;else delete e.add;if(ownBeam)b.beam=beam;else delete b.beam;if(ownGym)b.qiuGymnasium=gym;else delete b.qiuGymnasium;}
 if(calls!==864||records!==864)throw Error('Qiu dome194 incomplete assembly');
 return result;
};
})(YY);
