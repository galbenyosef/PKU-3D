/* Source-owned econDome radial metal ribs only (16*19). Format2 keeps the
 * original Float32 normal in a shared, losslessly marked cylinder; the decoder
 * preserves the original material projection and computes inverse transpose. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,TAG='economics249-dome-normal196-source',KEY='economics249-dome-normal196-cyl8_1',cache=new WeakMap();
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
A.render=function(b,f,add){
 if(f.properties.pickId!==249||f.properties.id!=='way/783033431')return prior.call(this,b,f,add);
 if(Y.Engine.normalTransformFormat194!==2)throw Error('Economics dome196 requires normal transform format2 engine');
 const e=b.e,emit=e.add,beam=b.beam,lattice=b.econDome,ownAdd=Object.hasOwn(e,'add'),ownBeam=Object.hasOwn(b,'beam'),ownLattice=Object.hasOwn(b,'econDome');let calls=0,records=0,depth=0;
 b.econDome=function(...args){depth++;try{return lattice.apply(this,args);}finally{depth--;}};
 b.beam=function(...args){
  if(!depth)return beam.apply(this,args);
  if(args[2]!==.018||args[3]!=='#748083'||args[4]!==29||args[5]!==2.83)throw Error('Economics dome196 diagonal signature changed');
  if(++calls>304)throw Error('Economics dome196 source count changed');
  const owner=this.e,send=owner.add,own=Object.hasOwn(owner,'add');let count=0;
  owner.add=function(k,g,m,c,p,uv){if(k!=='cyl8_1'||++count!==1)throw Error('Economics dome196 beam emission changed');return send.call(this,TAG,g,m,c,p,uv);};
  try{return beam.apply(this,args);}finally{if(own)owner.add=send;else delete owner.add;}
 };
 e.add=function(k,g,m,c,p,uv){
  if(k!=='v30-'+TAG)return emit.call(this,k,g,m,c,p,uv);
  if(++records>304||p[0]!==29||p[1]!==249||p[2]!==0||p[3]!==2.83||c!=='#748083')throw Error('Economics dome196 final registration changed');
  const a=[Array.from(m.slice(0,3)),Array.from(m.slice(4,7)),Array.from(m.slice(8,11))],det=dot(a[0],cross(a[1],a[2])),scale=a.reduce((s,c)=>s*Math.hypot(...c),1);
  if(!Number.isFinite(det)||!Number.isFinite(scale)||scale===0||Math.abs(det)<1e-12||Math.abs(det)/scale<1e-6)throw Error('Economics dome196 singular matrix');
  let marked=cache.get(g);if(!marked){const v=new Float32Array(g.v);for(let i=0;i<v.length;i+=8){const size=Math.hypot(v[i+3],v[i+4],v[i+5]);if(!Number.isFinite(size)||Math.abs(size-1)>.000001)throw Error('Economics dome196 source normal changed');for(let j=3;j<6;j++){const n=v[i+j];v[i+j]=n*1024;if(!Object.is(v[i+j]/1024,n))throw Error('Economics dome196 normal encoding not exact');}}marked={...g,v};cache.set(g,marked);}
  return emit.call(this,KEY,marked,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(ownAdd)e.add=emit;else delete e.add;if(ownBeam)b.beam=beam;else delete b.beam;if(ownLattice)b.econDome=lattice;else delete b.econDome;}
 if(calls!==304||records!==304)throw Error('Economics dome196 incomplete assembly');
 return result;
};
})(YY);
