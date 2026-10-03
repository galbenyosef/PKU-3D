/* Jingyuan No.1: the east courtyard gateway is outside the mapped U-shaped
   building polygon. The source Adapter clips it away. Restore this photographed
   open gateway only; sizes are fitted, and the unmeasured stair grade is omitted. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/272364819',prefix='jingyuan165-gate-';
function frame(){return {centre:[(-202.065-201.664)/2,(119.073+137.905)/2],r:1.5836520673048133};}
function gate(b){const f=frame(),add=b.e.add;
 b.e.add=function(k,g,m,c,p,uv){return add.call(this,prefix+k,g,m,c,p,uv);};
 try{b.local(f.centre[0],0,f.centre[1],f.r,()=>{
  const stone='#aaa89b',brick='#9e9e91',red='#7e3329';
  for(const s of[-1,1]){
   b.box(s*1.51,2.04,0,.72,4.08,1.00,brick,18,.7);
   b.box(s*1.51,.16,0,.83,.32,1.10,stone,10,.72);
   b.box(s*1.19,1.63,.18,.18,3.26,.25,red,20,.86);
   b.box(s*1.19,.36,.21,.29,.72,.38,stone,10,.88);
   b.beam([s*1.10,3.10,.18],[s*.90,3.32,.18],.09,red,20,.9);
  }
  // Solid red upper panel meets the masonry beam with 20 mm overlap.
  b.box(0,3.52,.18,2.56,.52,.28,red,20,.9);
  b.box(0,3.91,0,3.75,.30,1.06,brick,18,.72);
  b.v9PaintedBeam(0,4.02,.55,2.43,.36);
  b.v9Roof(0,4.28,0,4.62,2.28,.90,'gable',1.8);
 });}finally{b.e.add=add;}
}
A.render=function(b,f,add){const result=prior.call(this,b,f,add);if(f.properties.id===ID){const old=b.id;b.id=f.properties.pickId;try{gate(b);}finally{b.id=old;}}return result;};
Y.Jingyuan165Details={id:ID,prefix,frame};
})(YY);
