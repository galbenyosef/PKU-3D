/* Photo-supported regular octagon; size remains fitted, not surveyed.
 * Correct only the window assembly after footprint registration. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,M=Y.M,ID='way/188711087';
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==45)return prior.call(this,b,f,add);
 const owner=b.e,emit=owner.add,own=Object.prototype.hasOwnProperty.call(owner,'add');
 let root,inverse,corrected,outer=0,inner=0,glass=0;
 function bake(g,m){
  const q=M.multiply(inverse,m),n=M.inverse(q),v=new Float32Array(g.v),out={v,detailWidth:g.detailWidth||0};
  for(let i=0;i<v.length;i+=8){const p=M.apply(q,[v[i],v[i+1],v[i+2],1]),x=v[i+3],y=v[i+4],z=v[i+5];
   v[i]=p[0];v[i+1]=p[1];v[i+2]=p[2];
   const a=n[0]*x+n[1]*y+n[2]*z,c=n[4]*x+n[5]*y+n[6]*z,d=n[8]*x+n[9]*y+n[10]*z,len=Math.hypot(a,c,d);
   if(!(len>0&&Number.isFinite(len)))throw Error('Hall octagon178 invalid normal');
   v[i+3]=a/len;v[i+4]=c/len;v[i+5]=d/len;
  }return out;
 }
 owner.add=function(k,g,m,c,p,uv){
  let suffix;
  if(k==='v30-hallOctagon'){
   if(glass++||p[0]!==5||p[1]!==45)throw Error('Hall octagon178 glass changed');
   root=new Float32Array(m);inverse=M.inverse(root);corrected=new Float32Array(root);
   const sx=Math.hypot(...root.slice(0,3)),sy=Math.hypot(...root.slice(4,7));
   if(!(sx>0&&sy>0&&Number.isFinite(sx+sy)))throw Error('Hall octagon178 frame changed');
   for(let i=0;i<3;i++)corrected[i]*=sy/sx;
   suffix='glass';
  }else if(root&&outer<8){
   if(k!=='v30-cyl8_1'||c!=='#dfe1d8'||p[0]!==10||p[1]!==45)throw Error('Hall octagon178 perimeter changed');
   suffix='outer-'+outer++;
  }else if(k==='v30-hall-octagon-inner-box'){
   if(!root||inner>=16||c!=='#c3d2d1'||p[0]!==9||p[1]!==45)throw Error('Hall octagon178 glazing bars changed');
   suffix='inner-'+inner++;
  }
  if(suffix!==undefined)return emit.call(this,'hall-octagon-proportion178-'+suffix,bake(g,m),corrected,c,p,uv);
  return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(own)owner.add=emit;else delete owner.add;}
 if(glass!==1||outer!==8||inner!==16)throw Error('Hall octagon178 assembly incomplete');
 return result;
};
Y.HallOctagonProportion178={id:45,records:25,dimensions:'photo-fit-not-surveyed'};
})(YY);
