/* Sage Hall west entrance: three photographed openings separated by white piers.
 * Only the conflicting central lower window and old overlaid door lattices change. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/272361848',near=(a,b)=>Math.abs(a-b)<1e-8;
function entrance(b,bay,front){
 const wood='#854434',wall='#dedfcd',z=front+.49;
 const put=(name,x,y,zz,w,h,d,color,mat=6)=>b.n17Box('russian163-'+name,x,y,zz,w,h,d,color,mat,.91);
 // White surround and two internal piers; the original tall columns remain.
 for(const x of [-1.68,-.78,.78,1.68])put('white-pier',x,2.625,front+.53,.19,3.85,.30,wall,24);
 put('white-lintel',0,4.80,front+.53,3.55,.50,.32,wall,24);
 put('threshold',0,.685,front+.48,3.42,.07,.66,'#a5a89b',10);
 function leaf(cx,w){
  put('lower-panel',cx,1.275,z,w,1.15,.13,wood);
  put('glass',cx,3.12,z-.015,w-.13,2.52,.08,'#496164',5);
  for(const s of [-1,1])put('stile',cx+s*(w/2-.035),2.625,z+.04,.07,3.85,.14,wood);
  for(const [y,h] of [[.745,.09],[1.87,.10],[4.50,.10]])put('rail',cx,y,z+.055,w,h,.14,wood);
  // Rectangular glazing lattice visible in the 2017 front photograph.
  for(const s of [-1,1])put('glass-lattice',cx+s*w*.25,3.15,z+.075,.026,2.33,.06,wood);
  for(const y of [2.10,2.50,3.75,4.20])put('glass-lattice',cx,y,z+.075,w-.10,.026,.06,wood);
  for(const s of [-1,1])put('panel-border',cx+s*w*.34,1.28,z+.09,.035,.75,.045,wood);
  for(const y of [.905,1.655])put('panel-border',cx,y,z+.09,w*.68,.035,.045,wood);
 }
 leaf(-.35,.70);leaf(.35,.70);leaf(-1.23,.72);leaf(1.23,.72);
}
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'yuanpeiRussian'),old=b.yuanpeiRussian;
 b.yuanpeiRussian=function(p,w,d){
  const ownLattice=Object.prototype.hasOwnProperty.call(this,'n17Lattice'),lattice=this.n17Lattice,ownBox=Object.prototype.hasOwnProperty.call(this,'n17Box'),box=this.n17Box,front=d/2+.09,bay=(w-2.2)/9;
  this.n17Lattice=function(x,y,z,ww,h,r=0){
   if(near(r,0)&&((near(x,0)&&near(y,3.03)&&near(z,front)&&near(ww,bay-.65)&&near(h,3.7))||(near(Math.abs(x),.58)&&near(y,2.6)&&near(z,front+.39)&&near(ww,1.02)&&near(h,3.2))))return;
   return lattice.call(this,x,y,z,ww,h,r);
  };
  this.n17Box=function(k,...args){if(k==='v22-ru-entry-shadow')return;return box.call(this,k,...args);};
  let result;try{result=old.call(this,p,w,d);}finally{if(ownLattice)this.n17Lattice=lattice;else delete this.n17Lattice;if(ownBox)this.n17Box=box;else delete this.n17Box;}
  entrance(this,bay,front);return result;
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.yuanpeiRussian=old;else delete b.yuanpeiRussian;}
};
Y.Russian163Details={id:ID};
})(YY);
