/* Law School Kaiyuan, way/240825569 (pick 102); not the government school's
 * Leo Koguan building. Extend only the existing three lower glazing sills down
 * to their slabs. The 30 mm correction is model continuity, not a survey. */
(function(Y){'use strict';
 const P=Y.Builder.prototype,original=P.lawKaiyuan;
 P.lawKaiyuan=function(...args){
  const glazing=this.lawGlazing;
  this.lawGlazing=function(x,y,z,w,h,r,part,spacing){
   const lower=w===59.4&&h===4.07&&x===4.7&&z===23.8;
   if(!lower)return glazing.call(this,x,y,z,w,h,r,part,spacing);
   const box=this.box;
   this.box=function(bx,by,bz,bw,bh,bd,...rest){
    // Keep sill top, width, depth, material and original box mesh; no overlay.
    if(bx===0&&by===-(h/2-.045)&&bz===.07&&bw===w&&bh===.09&&bd===.17){by-=.015;bh+=.03;}
    return box.call(this,bx,by,bz,bw,bh,bd,...rest);
   };
   try{return glazing.call(this,x,y,z,w,h,r,part,spacing);}finally{this.box=box;}
  };
  try{return original.apply(this,args);}finally{this.lawGlazing=glazing;}
 };
})(YY);
