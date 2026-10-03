/* Sackler museum: the official facade photograph shows a plain blue-green
   plaque with gold Chinese and two English lines, not a framed brown sign.
   Fit its observed aspect in world space; the source adapter is anisotropic. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/240832217';
const title='北京大学赛克勒考古与艺术博物馆',lines=[title,'ARTHUR M. SACKLER','MUSEUM OF ART AND ARCHAEOLOGY AT PEKING UNIVERSITY'];
const aspect=5.48;
A.render=function(b,f,add){
 if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const oldSign=b.sign,oldAdd=b.e.add;let plateWidth,plaqueUV;
 b.sign=function(text,x,y,z,w,h,r=0,white=false){
  if(text!==title)return oldSign.call(this,text,x,y,z,w,h,r,white);
  const key='sackler106-bilingual-plaque';let uv=this.signs.get(key);
  if(!uv){
   // Four adjacent native atlas cells retain a 2048 x 128 raster; never
   // compress the three-line plaque into the old single 512 x 128 cell.
   if(this.nSigns%8>4)this.nSigns+=8-this.nSigns%8;
   const k=this.nSigns;this.nSigns+=4;const px=k%8*512,py=Math.floor(k/8)*128;
   this.ctx.clearRect(px,py,2048,128);this.ctx.fillStyle='#d6b574';this.ctx.textAlign='center';this.ctx.textBaseline='middle';
   for(const [i,size]of[[0,40],[1,38],[2,26]]){
    this.ctx.font=`500 ${size}px "Noto Serif CJK SC","Songti SC",serif`;
    const width=this.ctx.measureText(lines[i]).width;
    this.ctx.save();this.ctx.translate(px+1024,py+[27,67,105][i]);this.ctx.scale(2048*[.84,.46,.86][i]/Math.max(1,width),1);
    this.ctx.fillText(lines[i],0,0);this.ctx.restore();
   }
   uv=[px/4096,1-(py+128)/4096,.5,.03125];this.signs.set(key,uv);
  }
  plaqueUV=uv;
  this.mesh('plane',this.geo('plane',Y.Geo.plane),x,y,z,w,h,1,'#ffffff',8,1,r,uv);
 };
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='v30-v17-museum-signboard'||(k==='v30-plane'&&p[1]===106&&plaqueUV&&uv&&uv.every((v,i)=>v===plaqueUV[i]))){
   const copy=new Float32Array(m),width=Math.hypot(m[0],m[1],m[2]);
   if(k==='v30-v17-museum-signboard')plateWidth=Math.hypot(m[4],m[5],m[6])*aspect;
   if(plateWidth){const scale=plateWidth*(k==='v30-plane'?.99:1)/width;for(const j of[0,1,2])copy[j]*=scale;
    // Mount the complete plaque ahead of the retained gallery columns.
    const depth=Math.hypot(m[8],m[9],m[10]);for(let j=0;j<3;j++)copy[12+j]+=.28*m[8+j]/depth;
    m=copy;}
  }
  return oldAdd.call(this,k,g,m,c,p,uv);
 };
 try{return prior.call(this,b,f,add);}finally{b.sign=oldSign;b.e.add=oldAdd;}
};
Y.Sackler106Details={id:ID,aspect,lines};
})(YY);
