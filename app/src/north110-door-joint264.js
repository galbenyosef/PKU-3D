/* North transverse building, pick110: close only the existing closed-door
 * backing's four 15 mm gaps to its frame. The building's own repair photo:
 * https://jjgcb.pku.edu.cn/images/content/2017-04/20240427163043650420.jpg
 * Original four glass fields, frame, leaf, direction and stairs are unchanged.
 * Tiny backing dimensions are derived from existing geometry, not a survey. */
(function(Y){'use strict';
 const previous=Y.Architecture30.render,ID='way/240832221';
 Y.Architecture30.render=function(b,f,add){
  if(f.properties.id!==ID)return previous.call(this,b,f,add);
  const original=b.e.add,found=[];let result;
  b.e.add=function(k,g,m,c,p,uv){
   const w=Math.hypot(m[0],m[1],m[2]),h=Math.hypot(m[4],m[5],m[6]),d=Math.hypot(m[8],m[9],m[10]);
   if(k==='029-south-photo-facade-box'&&p[0]===20&&p[1]===110&&w>3&&w<4&&Math.abs(h-2.49)<1e-5&&Math.abs(d-.05)<1e-6)found.push({m:Array.from(m),c,p,uv,w,h});
   return original.call(this,k,g,m,c,p,uv);
  };
  try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
  if(found.length!==1)throw new Error('north110 joint requires one known south closed-door backing');
  const a=found[0],gap=.015,pad=.00002,g=Y.Geo.box();
  function strip(u,v,w,h){const m=a.m.slice();for(let j=0;j<3;j++){m[j]=a.m[j]*w/a.w;m[4+j]=a.m[4+j]*h/a.h;m[12+j]=a.m[12+j]+a.m[j]*u/a.w+a.m[4+j]*v/a.h;}
   // Original 50 mm backing depth overlaps the frame rear by 5 mm.
   // 20 micrometre inset at each touching edge survives Float32 placement.
   b.e.add('north110-door-joint264',g,m,a.c,a.p,a.uv);
  }
  for(const s of[-1,1])strip(s*(a.w/2+gap/2),0,gap+2*pad,a.h+2*pad);
  for(const s of[-1,1])strip(0,s*(a.h/2+gap/2),a.w+2*gap+2*pad,gap+2*pad);
  return result;
 };
})(YY);
