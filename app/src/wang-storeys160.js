/* Fifteen documented independent window rows below the upper pavilion.
 * One shared lower-tower grid; roof/crown/entrance geometry is not rescaled.
 * Low shoulder height is a same-storey fit. Its higher photographed front
 * termination retains its previous height rather than forcing an integer row. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30;
const S={base:13.45,top:64.41,rows:15,step:(64.41-13.45)/15,shoulderRows:14,highShoulder:65.01666666666667,fit:true};S.fiveTop=S.base+5*S.step;S.shoulderLow=S.base+14*S.step;
P.wangTower30=function(){const box=this.v16box,face=this.v16TowerFace;
this.v16TowerFace=function(k,x,y,z,w,h,bays,rows,r=0){
 const main=k==='v16-wang-tower'&&y===S.base&&((x===0&&w===26)||(Math.abs(x)===13&&w===29));
 const shoulder=k==='v16-wang-tower'&&y===S.base&&rows===12&&h===47.6;
 if(shoulder)return face.call(this,k,x,y,z,w,S.shoulderLow-S.base,bays,14,r);
 if(!main)return face.call(this,k,x,y,z,w,h,bays,rows,r);
 // Regenerate lower windows at fifteen equal rows. Keep the old backing face
 // and all original upper-pavilion window submissions through a second pass.
 const emit=this.v16box;
 this.v16box=function(key,...a){if(key.endsWith('-stone-face')||(key.endsWith('-belt')&&Math.abs(y+a[1]-S.top)<.001))return;return emit.call(this,key,...a);};
 try{face.call(this,k,x,y,z,w,S.top-S.base,bays,15,r);}finally{this.v16box=emit;}
 this.v16box=function(key,xx,yy,zz,ww,hh,dd,c,mat,part){if(!key.endsWith('-stone-face')&&!(key.endsWith('-belt')&&Math.abs(y+yy-S.top)<.001)&&y+yy<=S.top+.001)return;return emit.call(this,key,xx,yy,zz,ww,hh,dd,c,mat,part);};
 try{return face.call(this,k,x,y,z,w,h,bays,rows,r);}finally{this.v16box=emit;}
};
this.v16box=function(k,x,y,z,w,h,d,c,mat,part){
 if(k==='wang-shoulders138-supported-body'){
  const bottom=Math.fround(S.base+47.6/2)-Math.fround(47.6)/2;let hh=Math.fround(S.shoulderLow-bottom);if(Math.fround(bottom+hh/2)-hh/2!==bottom)hh=Math.fround(hh+Math.pow(2,Math.floor(Math.log2(hh))-23));return box.call(this,k,x,bottom+hh/2,z,w,hh,d,c,mat,part);
 }
 if(k==='v16-wang-ribbon-crossbar'&&y<=64.41){
  // The source uses 3.72m ribbon subdivisions. Replace them in one ordered
  // stream per ribbon, instead of mixing those lines with the new floor grid.
  if(Math.abs(y-14.4)>.001)return;
  for(let j=0;j<=15;j++)box.call(this,'wang-storeys160-ribbon-crossbar',x,S.base+j*S.step,z,w,h,d,c,mat,part);return;
 }
 return box.call(this,k,x,y,z,w,h,d,c,mat,part);
};try{previous.call(this);}finally{this.v16box=box;this.v16TowerFace=face;}
};Y.WangStoreys160=S;
})(YY);
