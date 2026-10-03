/* Registered west elevation of the southwest paired-roof humanities house.
 * Existing roof and obscured elevations are retained; no entrance is inferred. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/986745067';
function render(b,f,add){
 const old=b.e.add;let result;
 b.e.add=function(k,...args){if(k.startsWith('096-face-3-'))return;return old.call(this,k,...args);};
 try{result=previous.call(A,b,f,add);}finally{b.e.add=old;}
 const B=Y.Building096,W=B.depth,C={brick:'#929993',stone:'#c8c9be',red:'#a04837',glass:'#687d79',dark:'#30433e',green:'#386555'};
 b.id=313;
 b.e.add=function(k,...args){return old.call(this,'313-west-'+k,...args);};
 try{
  const north=B.world(0,0),south=B.world(0,W),r=-Math.atan2(south[1]-north[1],south[0]-north[0]);
  b.local(north[0],0,north[1],r,()=>{
   b.box(W/2,.51,-.16,W,1.02,.32,C.brick,30);
   b.box(W/2,.20,.025,W,.40,.40,C.stone,24);
   b.box(W/2,1.03,.04,W,.09,.42,C.stone,24);
   const bay=W/3,pier=.36;
   for(let j=0;j<3;j++){
    const left=j*bay+pier/2,right=(j+1)*bay-pier/2,cx=(left+right)/2,width=right-left;
    // Broad rectilinear glazing and separate transom row visible in the west view.
    b.box(cx,2.02,-.075,width,1.86,.04,C.glass,5);
    b.box(cx,3.31,-.075,width,.48,.04,C.dark,5);
    for(let k=0;k<=4;k++){
     const x=left+width*k/4;
     b.box(x,2.02,.035,.075,1.94,.18,C.red,6);
     b.box(x,3.31,.035,.075,.56,.18,C.red,6);
    }
    for(const y of[1.07,2.10,2.99,3.06,3.56])b.box(cx,y,.035,width+.075,.075,.18,C.red,6);
   }
   for(let j=0;j<=3;j++){
    const x=j*bay;
    if(j===0||j===3)b.box(x+(j===0?.16:-.16),2.56,-.17,.32,3.10,.34,C.brick,30);
    else b.box(x,2.10,.06,.23,3.75,.26,C.red,6);
   }
   b.box(W/2,3.76,-.08,W,.39,.35,C.red,6);
   b.box(W/2,4.025,.01,W,.12,.23,C.green,6);
  });
 }finally{b.e.add=old;}
 return{...result,strategy:'building313-v69',westElevationReference:true,westBays:3,mainEntranceVerified:false,limits:'West glazing, transoms and red structural rhythm registered to ground panoramas. Dimensions fitted; north entrance, south decoration, hidden elevations and current condition remain unverified.'};
}
A.render=function(b,f,add){return f.properties.pickId===313&&f.properties.id===ID?render(b,f,add):previous.call(this,b,f,add);};
Y.Building313={id:ID,render};
})(YY);
