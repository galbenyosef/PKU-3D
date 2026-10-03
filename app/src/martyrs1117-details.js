/* Three dark inscription plaques and pale-gold transcription; not original calligraphy.
 * Preserve stone silhouettes and masonry courses; five-tablet plan remains unverified. */
(function(Y){'use strict';const P=Y.Builder.prototype,original=P.martyrs33;
const faces=[{key:'front',z:.787,outline:[[-4.35,.16],[1.20,.16],[-3.75,3.15],[-4.50,2.45]],left:-4.5,right:1.2,top:3.15,color:'#a99b78'},
 {key:'rear',z:-.208,outline:[[.05,.16],[4.50,.16],[1.85,2.13],[.90,1.65]],left:.05,right:4.5,top:2.13,color:'#9d9375'}];
// Clip each narrow surface joint to its own existing convex stone silhouette.
function clip(poly,outline){for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],cross=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),next=[];for(let j=0;j<poly.length;j++){const p=poly[j],q=poly[(j+1)%poly.length],u=cross(p),v=cross(q);if(u>=0)next.push(p);if((u>=0)!==(v>=0)){const t=u/(u-v);next.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}poly=next;if(!poly.length)break;}return poly;}
const lines=[['北京大学',-3.42,2.20,1.35,.27],['革命烈士纪念碑',-2.75,1.56,2.13,.28],['陈云敬书',-1.30,1.00,.87,.17]];
const plaques=[[1.54,.44],[2.35,.46],[1.02,.30]];
function label(b,[text,x,y,w,h]){const ctx=b.ctx,key='martyrs1117-inscription-'+text,color='#d7c48a';b.martyrs1117Labels??=new Map();let entry=b.martyrs1117Labels.get(key);
 if(!entry){const k=b.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;ctx.save();ctx.clearRect(px,py,512,128);ctx.beginPath();ctx.rect(px+8,py+8,496,112);ctx.clip();ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const family='"Songti SC","Noto Serif CJK SC","Times New Roman",serif';ctx.font='400 80px '+family;let m=ctx.measureText(text),size=Math.min(80,80*448/Math.max(m.width,1));ctx.font='400 '+size+'px '+family;m=ctx.measureText(text);
  const left=m.actualBoundingBoxLeft??0,right=m.actualBoundingBoxRight??m.width,asc=m.actualBoundingBoxAscent??size*.8,desc=m.actualBoundingBoxDescent??size*.2,iw=left+right,ih=asc+desc;
  const dx=px+(512-iw)/2+left,dy=py+(128-ih)/2+asc;ctx.fillStyle=color;ctx.fillText(text,dx,dy);ctx.restore();
  // Only sample the ink rectangle plus a transparent margin. Never reach the
  // atlas-cell boundary, where filtering can pick up an unrelated neighbour.
  const pad=8,l=(512-iw)/2-pad,t=(128-ih)/2-pad,cw=iw+2*pad,ch=ih+2*pad;
  entry={uv:[(px+l)/4096,1-(py+t+ch)/4096,cw/4096,ch/4096],w:w*cw/iw,h:h*ch/ih,ink:[iw,ih],cell:[px,py],crop:[l,t,cw,ch]};b.martyrs1117Labels.set(key,entry);b.signs.set(key,entry.uv);
 }
 b.mesh('plane',b.geo('plane',Y.Geo.plane),x,y,.799,entry.w,entry.h,1,'#ffffff',8,.85,0,entry.uv);
}
P.martyrs33=function(){if(this.id!==1117)return original.apply(this,arguments);
 const lettering=this.lettering;this.lettering=function(text,...args){if(text==='北京大学'||text==='革命烈士纪念碑')return;return lettering.call(this,text,...args);};let result;try{result=original.apply(this,arguments);}finally{this.lettering=lettering;}

 for(const f of faces){const key='martyrs1117-masonry-'+f.key,g=this.geo(key,()=>{const g=new Y.Geo.Geometry(),add=(x0,y0,x1,y1)=>{const p=clip([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],f.outline);for(let i=1;i<p.length-1;i++)g.tri([p[0][0],p[0][1],0],[p[i][0],p[i][1],0],[p[i+1][0],p[i+1][1],0]);};
  // Courses and staggered vertical joints are fitted to the two published fronts.
  // Rear and hidden returns are deliberately left without invented block layouts.
  for(let row=0,y=.16;y<f.top;row++,y+=.44){if(row)add(f.left,y-.004,f.right,y+.004);for(let x=f.left+.36+(row%2)*.43;x<f.right;x+=.86)add(x-.004,y+.004,x+.004,Math.min(y+.436,f.top));}return g;});
  this.mesh(key,g,0,0,f.z,1,1,1,f.color,10);
 }
 for(let i=0;i<lines.length;i++){const [,x,y]=lines[i],[w,h]=plaques[i];this.mesh('martyrs1117-plaque',this.geo('martyrs1117-plaque',Y.Geo.box),x,y,.789,w,h,.008,'#554638',10);label(this,lines[i]);}
 return result;
};
Y.Martyrs1117={lines,plaques};})(YY);
