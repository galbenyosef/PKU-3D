/* Official photo: fit the visible ink, not the padded atlas quad. Preserve
 * original stone geometry, inscription, turquoise color and four atlas cells.
 * The font remains a transcription, not a facsimile of the carved calligraphy. */
(function(Y){'use strict';const previous=Y.Builder.prototype.revitalization33;
const lines=[['振',.035,2.16,.34,.40],['興',.035,1.70,.34,.40],['中',.035,1.24,.34,.40],['華',.035,.78,.34,.40]];
function label(b,[text,x,y,w,h]){const ctx=b.ctx,key='revival1123-inscription-'+text,color='#60b4a2';b.revival1123Labels??=new Map();let entry=b.revival1123Labels.get(key);
 if(!entry){const old=b.signs.get('revival-turquoise-'+text),px=old[0]*4096,py=4096-(old[1]+old[3])*4096;ctx.save();ctx.clearRect(px,py,512,128);ctx.beginPath();ctx.rect(px+8,py+8,496,112);ctx.clip();ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const family='"Songti SC","Noto Serif CJK SC","Times New Roman",serif';ctx.font='400 80px '+family;let m=ctx.measureText(text),size=Math.min(80,80*448/Math.max(m.width,1));ctx.font='400 '+size+'px '+family;m=ctx.measureText(text);
  const left=m.actualBoundingBoxLeft??0,right=m.actualBoundingBoxRight??m.width,asc=m.actualBoundingBoxAscent??size*.8,desc=m.actualBoundingBoxDescent??size*.2,iw=left+right,ih=asc+desc;
  const dx=px+(512-iw)/2+left,dy=py+(128-ih)/2+asc;ctx.fillStyle=color;ctx.fillText(text,dx,dy);ctx.restore();
  // Only sample the ink rectangle plus a transparent margin. Never reach the
  // atlas-cell boundary, where filtering can pick up an unrelated neighbour.
  const pad=8,l=(512-iw)/2-pad,t=(128-ih)/2-pad,cw=iw+2*pad,ch=ih+2*pad;
  entry={uv:[(px+l)/4096,1-(py+t+ch)/4096,cw/4096,ch/4096],w:w*cw/iw,h:h*ch/ih,ink:[iw,ih],cell:[px,py],crop:[l,t,cw,ch]};b.revival1123Labels.set(key,entry);b.signs.set(key,entry.uv);
 }
 b.mesh('plane',b.geo('plane',Y.Geo.plane),x,y,.249,entry.w,entry.h,1,'#ffffff',8,.85,0,entry.uv);
}
Y.Builder.prototype.revitalization33=function(...args){if(this.id!==1123)return previous.apply(this,args);const mesh=this.mesh,had=Object.hasOwn(this,'mesh');this.mesh=function(...p){if(p[0]==='plane'&&p[9]===8)return;return mesh.apply(this,p);};
try{previous.apply(this,args);}finally{if(had)this.mesh=mesh;else delete this.mesh;}for(const line of lines)label(this,line);
};Y.Revival1123={lines};
})(YY);
