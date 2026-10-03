/* Supermarket north entrance: open the existing shopfront around its original door.
 * The 2017 photograph supports a doorway interrupting this continuous glass strip.
 * Existing door dimensions remain a proportional fit, not measured construction. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){
 if(f.properties.id!=='way/849765899'||f.properties.pickId!==876)return prior.call(this,b,f,add);
 const original=b.e.add,R=Math.atan2(.977,43.181),root=Y.M.transform([-815.419,0,-132.475],[1,1,1],R),inverse=Y.M.inverse(root);
 b.e.add=function(k,g,m,c,p,uv){
  if(k!=='151-low-glass-2-box')return original.call(this,k,g,m,c,p,uv);
  const t=Y.M.multiply(inverse,m),sx=t[0],sy=t[5];
  if(Math.abs(t[2])>1e-4||Math.abs(t[8])>1e-4||Math.abs(sx)<1e-7||Math.abs(sy)<1e-7)return original.call(this,k,g,m,c,p,uv);
  const z0=t[14]-Math.abs(t[10])/2,z1=t[14]+Math.abs(t[10])/2;
  if(z0>=.27||z1<=-.27)return original.call(this,k,g,m,c,p,uv);
  const xx=[(21.025-t[12])/sx,(24.175-t[12])/sx].sort((a,b)=>a-b),yy=[(.19-t[13])/sy,(3.37-t[13])/sy].sort((a,b)=>a-b);
  const l=Math.max(-.5,xx[0]),r=Math.min(.5,xx[1]),lo=Math.max(-.5,yy[0]),hi=Math.min(.5,yy[1]);
  if(r<=l||hi<=lo)return original.call(this,k,g,m,c,p,uv);
  // Each retained box is closed; original geometry, UVs and material are reused.
  const piece=(x0,x1,y0,y1)=>{if(x1-x0>1e-7&&y1-y0>1e-7)original.call(this,k,g,Y.M.multiply(m,Y.M.transform([(x0+x1)/2,(y0+y1)/2,0],[x1-x0,y1-y0,1],0)),c,p,uv);};
  piece(-.5,l,-.5,.5);piece(r,.5,-.5,.5);piece(l,r,-.5,lo);piece(l,r,hi,.5);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=original;}
 // The door stands forward of the shopfront. Continue its existing .08m jambs
 // through the .405m reveal to the back of the original .26m shopfront wall.
 // Two millimetres overlap the existing frame to survive Float32 placement.
 for(const x of[21.025,24.175])original.call(b.e,'876-entry-jamb-return',Y.Geo.box(),Y.M.multiply(root,Y.M.transform([x,1.78,.0665],[.08,3.18,.407],0)),'#a9b0aa',[29,876,0,0]);
 return result;
};
})(YY);
