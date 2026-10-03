/* International Studies: the north A–B link's west entrance has a five-bay
   exposed steel frame and three central box canopies in official photographs.
   Section sizes are photographic fits; existing glass, doors and steps stay. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/240832232',key='sis120-entrance-steel-box';
function frame(){
 const ring=Y.MASKS43.sisConnectors.coordinates[1][0],a=ring[2],b=ring[3],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
 return {a,b,length,r:Math.atan2(-dz,dx),centre:[(a[0]+b[0])/2,(a[1]+b[1])/2]};
}
function entrance(b){const f=frame(),bay=f.length/5;b.local(f.centre[0],0,f.centre[1],f.r,()=>{
 const box=(x,y,z,w,h,d,c='#3f5960')=>b.mesh(key,b.geo(key,Y.Geo.box),x,y,z,w,h,d,c,29,1.2);
 for(let i=0;i<=5;i++){
  const x=-f.length/2+i*bay;
  box(x,4.36,.43,.36,8.72,.64);
  box(x,8.55,.20,.30,.32,.95);
 }
 box(0,8.55,.43,f.length+.36,.38,.64);
 for(const i of[1,2,3]){
  const x=-f.length/2+(i+.5)*bay;
  box(x,3.56,.88,bay*.86,.44,1.92);
  // A light metal soffit is visible below each deep blue fascia.
  box(x,3.332,.89,bay*.86-.08,.016,1.80,'#8b9693');
 }
});}
A.render=function(b,f,add){const result=prior.call(this,b,f,add);if(f.properties.id===ID){const id=b.id;b.id=f.properties.pickId;try{entrance(b);}finally{b.id=id;}}return result;};
Y.Sis120Details={id:ID,key,frame};
})(YY);
