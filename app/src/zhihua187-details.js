/* West entrance, registered to the existing Zhihua38 photo model. Columns sit
   on bay boundaries, not across door centres. Dimensions remain photo fits. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/445012606',R=.0467,ER=R-Math.PI/2;
function frame(f){const c=f.properties.centre;return {centre:[c[0]-29.60*Math.cos(R)-1.275*Math.sin(R),c[1]+29.60*Math.sin(R)-1.275*Math.cos(R)],r:ER};}
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const saved=b.e.add,fr=frame(f);let index=0,last;
 b.e.add=function(k,g,m,c,p,uv){if(k==='zh38-west-entry-column'){
  const mm=new Float32Array(m),x=-14.175+index*4.05;index++;
  mm[12]=fr.centre[0]+x*Math.cos(ER)+2.81*Math.sin(ER);mm[14]=fr.centre[1]-x*Math.sin(ER)+2.81*Math.cos(ER);
  for(let j=4;j<7;j++)mm[j]*=3.25/3;mm[13]=2.515;
  last={k,g,m:mm,c,p,uv};return saved.call(this,k,g,mm,c,p,uv);
 }return saved.call(this,k,g,m,c,p,uv);};
 let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=saved;}
 if(last&&index===7){const m=new Float32Array(last.m),x=14.175;m[12]=fr.centre[0]+x*Math.cos(ER)+2.81*Math.sin(ER);m[14]=fr.centre[1]-x*Math.sin(ER)+2.81*Math.cos(ER);saved.call(b.e,last.k,last.g,m,last.c,last.p,last.uv);}
 const old=b.id;b.id=f.properties.pickId;try{b.local(fr.centre[0],0,fr.centre[1],ER,()=>{
  const key='zhihua187-door-metal',box=(x,y,z,w,h,d)=>b.mesh(key,b.geo(key,Y.Geo.box),x,y,z,w,h,d,'#706052',29);
  for(let i=0;i<7;i++){const x=-12.15+i*4.05;
   box(x,2.10,.30,.06,2.40,.12);
   for(const s of[-1,1]){box(x+s*.14,1.96,.46,.035,.55,.045);for(const y of[1.72,2.20])box(x+s*.14,y,.39,.045,.04,.14);}
  }
 });}finally{b.id=old;}
 return result;
};Y.Zhihua187Details={id:ID,frame};
})(YY);
