/* West Gate lower-body photo fit; fixed plan, translated upper joinery.
 * Installed before door186 so its normal encoder sees the final matrices. */
(function(Y){'use strict';const prior=Y.Architecture30.render,Q=.68,A=.31,H=4.31,D=(Q-1)*(H-A),TAG='westgateBody327';
function restore(o,k,d){if(d)Object.defineProperty(o,k,d);else delete o[k];}
Y.Architecture30.render=function(b,f,...args){if(f.properties.pickId!==54||f.properties.id!=='way/226703926')return prior.call(this,b,f,...args);
 const ed=Object.getOwnPropertyDescriptor(b.e,'add'),emit=b.e.add,hd=Object.getOwnPropertyDescriptor(b,'historicWestGate'),historic=b.historicWestGate;
 b.e.add=function(key,g,m,...rest){const t=g[TAG];if(t){const copy={...g};delete copy[TAG];g=copy;const next=new Float32Array(m);next[1]*=t.q;next[5]*=t.q;next[9]*=t.q;const sy=Math.hypot(m[1],m[5],m[9])/t.sourceYNorm;if(!Number.isFinite(sy)||!(sy>0))throw Error('West Gate327 invalid source Y axis');next[13]=m[13]+sy*((t.q-1)*t.sourceCentreY+t.shift);m=next;}return emit.call(this,key,g,m,...rest);};
 b.historicWestGate=function(...params){const descriptors=[],wrap=(name,fn)=>{const d=Object.getOwnPropertyDescriptor(this,name),old=this[name];descriptors.push([name,d]);this[name]=fn(old);};let scope='body';
 for(const name of['westGateLion','westGateDoor','v9Roof','v9Bracket','v9PaintedBeam'])wrap(name,old=>function(...a){const saved=scope;scope=name==='westGateLion'||(name==='v9Roof'&&a[0]!==0)?'fixed':name==='westGateDoor'?'door':'upper';try{return old.apply(this,a);}finally{scope=saved;}});
 const owner=this.e,desc=Object.getOwnPropertyDescriptor(owner,'add'),send=owner.add;
 owner.add=function(key,g,m,c,p,uv){let kind=scope;if(key.startsWith('westgate-plaque164-'))kind='upper';const xs=m[12],cy=m[13];if(kind==='body'&&(Math.abs(xs)>13||(p[0]===10&&cy<1.4&&Math.abs(xs)<8.2)||Math.abs(cy-.16)<1e-5))kind='fixed';if(scope==='body'&&Math.abs(xs)>8.2&&Math.abs(xs)<12.6&&m[14]>3.9&&cy>1.1)kind='window';if(kind==='body'&&key==='box'&&Math.abs(cy-4.74)<1e-5)kind='upper';
 if(kind!=='fixed'){let lo=Infinity,hi=-Infinity;for(let i=0;i<g.v.length;i+=8){const y=m[1]*g.v[i]+m[5]*g.v[i+1]+m[9]*g.v[i+2]+m[13];lo=Math.min(lo,y);hi=Math.max(hi,y);}let q=1,shift=D;if(kind!=='upper'){const fy=y=>y<=H?A+Q*(y-A):y+D;if(kind==='window'){q=Q;shift=A*(1-Q);}else if(kind==='door'){if(p[0]===9){q=1;shift=(Q-1)*(cy-A);}else{q=Q;shift=A*(1-Q);}}else{const low=lo<.4?lo:fy(lo),high=fy(hi);q=hi-lo>1e-9?(high-low)/(hi-lo):Q;shift=low-q*lo;}}g={...g,[TAG]:{q,shift,sourceCentreY:cy,sourceYNorm:Math.hypot(m[1],m[5],m[9])}};}return send.call(this,key,g,m,c,p,uv);};
 try{return historic.apply(this,params);}finally{restore(owner,'add',desc);for(const[k,d]of descriptors.reverse())restore(this,k,d);}};
 try{return prior.call(this,b,f,...args);}finally{restore(b,'historicWestGate',hd);restore(b.e,'add',ed);}
};Y.WestgateBody327={lowerY:Q,anchorY:A,junctionY:H,sourceUpperDelta:D,measured:false};
})(YY);
