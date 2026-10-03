/* Close the old vertical discontinuity between the existing tower solids and
 * podium roof. All footprints come from the actual submitted core/shoulders. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,M=Y.M;
const targets=['wang-roof144-core-rear','wang-roof144-core-lower','wang-shoulders138-supported-body'];
A.render=function(b,f,add){
 if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return prior.call(this,b,f,add);
 const emit=b.e.add,parts=[];let roof;
 b.e.add=function(k,g,m,c,p,uv){
  if(k.startsWith('wang-base154-'))throw Error('wang base154 duplicate');
  if(targets.includes(k))parts.push({k,g,m:new Float32Array(m),c,p,uv});
  if(k==='wang30-podium-roof'){const ys=[];for(let i=0;i<g.v.length;i+=8)ys.push(M.apply(m,[g.v[i],g.v[i+1],g.v[i+2],1])[1]);if(Math.max(...ys)-Math.min(...ys)>1e-5)throw Error('wang base154 podium not flat');roof=ys[0];}
  return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=emit;}
 if(parts.length!==4||parts.filter(p=>p.k===targets[0]).length!==1||parts.filter(p=>p.k===targets[1]).length!==1||parts.filter(p=>p.k===targets[2]).length!==2||!Number.isFinite(roof))throw Error('wang base154 source bodies changed');
 for(const [i,r]of parts.entries()){
  const m=new Float32Array(r.m),ys=[];for(let j=0;j<r.g.v.length;j+=8)ys.push(M.apply(m,[r.g.v[j],r.g.v[j+1],r.g.v[j+2],1])[1]);const top=Math.min(...ys),gap=top-roof;
  if(gap<.90||gap>1||Math.abs(m[1])+Math.abs(m[4])+Math.abs(m[6])+Math.abs(m[9])>1e-5||r.g.v.length!==36*8)throw Error('wang base154 support registration changed');
  m[5]=gap;m[13]=(roof+top)/2;
  emit.call(b.e,'wang-base154-support-'+i,r.g,m,r.c,r.p,r.uv);
 }
 return result;
};
Y.WangBase154={scope:'existing-core-and-both-shoulder-footprints-only',sourceGap:.95,footprintSurveyed:false};
})(YY);
