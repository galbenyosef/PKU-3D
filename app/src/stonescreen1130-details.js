/* Readable transcription, not calligraphic facsimile or scanned engraving. */
(function(Y){'use strict';const previous=Y.Builder.prototype.stoneScreen33;
const columns=['垂虹影界水中央','夹镜光瀓风四面','飞楼俯映柳荫多','画舫平临蘋岸阔'];
function label(b,[text,x,y,w,h]){const ctx=b.ctx,key='stonescreen1130-inscription-'+text,color='#858779';b.stonescreen1130Labels??=new Map();let entry=b.stonescreen1130Labels.get(key);
 if(!entry){const index=b.stonescreen1130Labels.size,slot=index%5,cellWidth=512/5;
  // Reserve each full atlas slot once; never clear previously packed characters.
  if(slot===0){const k=b.nSigns++;b.stonescreen1130Cell=[k%8*512,Math.floor(k/8)*128];ctx.clearRect(...b.stonescreen1130Cell,512,128);}
  const [px,py]=b.stonescreen1130Cell,cx=px+slot*cellWidth;ctx.save();ctx.beginPath();ctx.rect(cx,py+8,cellWidth,112);ctx.clip();ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const family='"Songti SC","Noto Serif CJK SC","Times New Roman",serif';ctx.font='400 80px '+family;let m=ctx.measureText(text),size=Math.min(80,80*448/Math.max(m.width,1));ctx.font='400 '+size+'px '+family;m=ctx.measureText(text);
  const left=m.actualBoundingBoxLeft??0,right=m.actualBoundingBoxRight??m.width,asc=m.actualBoundingBoxAscent??size*.8,desc=m.actualBoundingBoxDescent??size*.2,iw=left+right,ih=asc+desc;
  if(iw+16>cellWidth||ih+16>112)throw new Error('1130 glyph exceeds isolated atlas cell');
  const dx=cx+(cellWidth-iw)/2+left,dy=py+(128-ih)/2+asc;ctx.fillStyle=color;ctx.fillText(text,dx,dy);ctx.restore();
  // Only sample the ink rectangle plus a transparent margin. Never reach the
  // atlas-cell boundary, where filtering can pick up an unrelated neighbour.
  const pad=8,l=slot*cellWidth+(cellWidth-iw)/2-pad,t=(128-ih)/2-pad,cw=iw+2*pad,ch=ih+2*pad;
  entry={uv:[(px+l)/4096,1-(py+t+ch)/4096,cw/4096,ch/4096],w:w*cw/iw,h:h*ch/ih,ink:[iw,ih],cell:[px,py],subcell:[slot*cellWidth,cellWidth],crop:[l,t,cw,ch]};b.stonescreen1130Labels.set(key,entry);b.signs.set(key,entry.uv);
 }
 b.mesh('plane',b.geo('plane',Y.Geo.plane),x,y,.166,entry.w,entry.h,1,'#ffffff',8,.85,0,entry.uv);
}
Y.Builder.prototype.stoneScreen33=function(...args){const result=previous.apply(this,args);if(this.id!==1130)return result;
 for(let c=0;c<4;c++)for(const [j,ch]of [...columns[c]].entries())label(this,[ch,(c-1.5)*1.01,2.48-j*.305,.205,.225]);return result;
};Y.StoneScreen1130={columns};
})(YY);
