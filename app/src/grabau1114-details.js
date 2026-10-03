/* Photo-proportioned, readable inscription; the portrait remains unmodelled.
 * Use the existing full-resolution sign atlas/material, with isolated UV borders. */
(function(Y){'use strict';const previous=Y.Builder.prototype.grabau33;
const lines=[['葛利普教授之墓',0,1.17,1.30,.19],['1870',-.52,1.57,.31,.18],['1946',.52,1.57,.31,.18],['In Memory of Professor',0,.86,1.42,.14],['AMADEUS WILLIAM GRABAU',0,.68,1.78,.14]];
function label(b,[text,x,y,w,h]){const ctx=b.ctx,key='grabau1114-inscription-'+text,color='#a59050';b.grabau1114Labels??=new Map();let entry=b.grabau1114Labels.get(key);
 if(!entry){const k=b.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;ctx.save();ctx.clearRect(px,py,512,128);ctx.beginPath();ctx.rect(px+8,py+8,496,112);ctx.clip();ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const family='"Songti SC","Noto Serif CJK SC","Times New Roman",serif';ctx.font='400 80px '+family;let m=ctx.measureText(text),size=Math.min(80,80*448/Math.max(m.width,1));ctx.font='400 '+size+'px '+family;m=ctx.measureText(text);
  const left=m.actualBoundingBoxLeft??0,right=m.actualBoundingBoxRight??m.width,asc=m.actualBoundingBoxAscent??size*.8,desc=m.actualBoundingBoxDescent??size*.2,iw=left+right,ih=asc+desc;
  const dx=px+(512-iw)/2+left,dy=py+(128-ih)/2+asc;ctx.fillStyle=color;ctx.fillText(text,dx,dy);ctx.restore();
  // Only sample the ink rectangle plus a transparent margin. Never reach the
  // atlas-cell boundary, where filtering can pick up an unrelated neighbour.
  const pad=8,l=(512-iw)/2-pad,t=(128-ih)/2-pad,cw=iw+2*pad,ch=ih+2*pad;
  entry={uv:[(px+l)/4096,1-(py+t+ch)/4096,cw/4096,ch/4096],w:w*cw/iw,h:h*ch/ih,ink:[iw,ih],cell:[px,py],crop:[l,t,cw,ch]};b.grabau1114Labels.set(key,entry);b.signs.set(key,entry.uv);
 }
 b.mesh('plane',b.geo('plane',Y.Geo.plane),x,y,.042,entry.w,entry.h,1,'#ffffff',8,.85,0,entry.uv);
}
Y.Builder.prototype.grabau33=function(...args){if(this.id!==1114)return previous.apply(this,args);const lettering=this.lettering;this.lettering=function(text,...p){if(text==='葛利普教授之墓'||text==='1870 — 1946')return;return lettering.call(this,text,...p);};
 try{previous.apply(this,args);}finally{this.lettering=lettering;}for(const line of lines)label(this,line);
};Y.Grabau1114={lines};
})(YY);
