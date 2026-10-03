/* Photo-fitted central four-step flight and solid side platforms at the west door.
 * Preserve original rise/run; widths align to the existing doorway piers. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,ID='way/272361848';
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
const box=b.n17Box,boxDescriptor=Object.getOwnPropertyDescriptor(b,'n17Box'),emit=b.e.add,emitDescriptor=Object.getOwnPropertyDescriptor(b.e,'add'),stairs=[];let sourceAnchor,finalAnchor,result,sourceCount=0,finalCount=0;
const restore=(o,k,d)=>{if(d)Object.defineProperty(o,k,d);else delete o[k];};
b.n17Box=function(k,...args){if(k!=='v22-ru-steps'&&k!=='russian163-threshold')return box.call(this,k,...args);
 const output=this.e.add,outputDescriptor=Object.getOwnPropertyDescriptor(this.e,'add');this.e.add=function(key,g,m,c,p,uv){const rec={key,g,m:new Float32Array(m),c,p:[...p],uv};if(k==='v22-ru-steps'){stairs.push(rec);return;}sourceAnchor=rec;sourceCount++;return output.call(this,key,g,m,c,p,uv);};
 try{return box.call(this,k,...args);}finally{restore(this.e,'add',outputDescriptor);}
};
b.e.add=function(k,g,m,c,p,uv){if(k==='v30-russian163-threshold'){finalAnchor=new Float32Array(m);finalCount++;}return emit.call(this,k,g,m,c,p,uv);};
try{result=previous.call(this,b,f,add);}finally{restore(b.e,'add',emitDescriptor);restore(b,'n17Box',boxDescriptor);}
if(f.properties.pickId!==163||stairs.length!==4||sourceCount!==1||finalCount!==1||!sourceAnchor||!finalAnchor)throw Error('Russian 163 stair source/threshold changed; review registration');
const inv=M.inverse(sourceAnchor.m),unit=M.multiply(sourceAnchor.m,inv);
if(![...sourceAnchor.m,...finalAnchor,...inv,...unit].every(Number.isFinite)||Array.from(unit).some((v,i)=>Math.abs(v-(i%5===0?1:0))>1e-5))throw Error('Russian 163 threshold anchor is singular or invalid');
const root=M.multiply(finalAnchor,inv),params=r=>[r.p[0],f.properties.pickId,0,r.p[3]];
for(const r of stairs){const narrow=M.multiply(r.m,M.transform([0,0,0],[1.75/5.6,1,1],0));emit.call(b.e,'russian163-stairs197-central',r.g,M.multiply(root,narrow),r.c,params(r),r.uv);}
// Fitted solid side platforms end beside the central flight, not across its route.
// The front edge shares the inherited stair foot as a conservative depth fit.
for(const sign of[-1,1]){const relative=M.transform([sign*1.325/3.42,(.35-.685)/.07,1.035/.66],[.90/3.42,.70/.07,2.73/.66],0);emit.call(b.e,'russian163-stairs197-side',sourceAnchor.g,M.multiply(root,M.multiply(sourceAnchor.m,relative)),stairs[0].c,params(stairs[0]),stairs[0].uv);}
return{...result,stairs197:{treads:4,centralWidthFitted:1.75,sidePlatformWidthFitted:.90,inheritedRiseAndRun:true,restoredBeyondFootprint:true,dimensionsMeasured:false}};
};})(YY);
