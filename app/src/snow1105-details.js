/* Official PKU tomb photograph: gold Chinese/English inscription on white
 * stone, not a framed visitor sign. Readable transcription, not calligraphy.
 * Unreadable signature is deliberately omitted. Existing stone/base retained. */
(function(Y){'use strict';const previous=Y.Builder.prototype.snow31;
const lines=[['中国人民的美国朋友',0,1.17,1.23,.075],['埃德加·斯诺',0,1.04,1.30,.115],['之墓',0,.93,.32,.060],['IN MEMORY OF EDGAR SNOW',0,.76,1.34,.068],['AN AMERICAN FRIEND OF THE CHINESE PEOPLE',0,.64,1.73,.053],['1905–1972',0,.53,.49,.063]];
function label(b,[text,x,y,w,h]){const ctx=b.ctx,key='snow1105-inscription-'+text,color='#a59050';b.snow1105Labels??=new Map();let entry=b.snow1105Labels.get(key);
 if(!entry){const k=b.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;ctx.save();ctx.clearRect(px,py,512,128);ctx.beginPath();ctx.rect(px+8,py+8,496,112);ctx.clip();ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const family='"Songti SC","Noto Serif CJK SC","Times New Roman",serif';ctx.font='400 80px '+family;let m=ctx.measureText(text),size=Math.min(80,80*448/Math.max(m.width,1));ctx.font='400 '+size+'px '+family;m=ctx.measureText(text);
  const left=m.actualBoundingBoxLeft??0,right=m.actualBoundingBoxRight??m.width,asc=m.actualBoundingBoxAscent??size*.8,desc=m.actualBoundingBoxDescent??size*.2,iw=left+right,ih=asc+desc;
  const dx=px+(512-iw)/2+left,dy=py+(128-ih)/2+asc;ctx.fillStyle=color;ctx.fillText(text,dx,dy);ctx.restore();
  // Only sample the ink rectangle plus a transparent margin. Never reach the
  // atlas-cell boundary, where filtering can pick up an unrelated neighbour.
  const pad=8,l=(512-iw)/2-pad,t=(128-ih)/2-pad,cw=iw+2*pad,ch=ih+2*pad;
  entry={uv:[(px+l)/4096,1-(py+t+ch)/4096,cw/4096,ch/4096],w:w*cw/iw,h:h*ch/ih,ink:[iw,ih],cell:[px,py],crop:[l,t,cw,ch]};b.snow1105Labels.set(key,entry);b.signs.set(key,entry.uv);
 }
 b.mesh('plane',b.geo('plane',Y.Geo.plane),x,y,-.603,entry.w,entry.h,1,'#ffffff',8,.85,0,entry.uv);
}
Y.Builder.prototype.snow31=function(...args){if(this.id!==1105)return previous.apply(this,args);const sign=this.sign,had=Object.hasOwn(this,'sign');this.sign=function(text,...p){if(text==='埃德加·斯诺之墓')return;return sign.call(this,text,...p);};
try{previous.apply(this,args);}finally{if(had)this.sign=sign;else delete this.sign;}for(const line of lines)label(this,line);
};Y.Snow1105={lines};
})(YY);
