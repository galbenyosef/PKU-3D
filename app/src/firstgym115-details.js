/* First Gymnasium: photographed geometric upper lights on the east hall only.
 * Preserve the existing fitted window rhythm and all original geometry. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240832226';
function transom(w,h){
 const g=new Y.Geo.Geometry(),box=Y.Geo.box();
 const bar=(x,y,sx,sy)=>{for(let i=0;i<box.v.length;i+=8)g.v.push(box.v[i]*sx+x,box.v[i+1]*sy+y,box.v[i+2]*.045+.205,...box.v.slice(i+3,i+8));};
 const pane=w/4,height=h/6,cy=h/2-height/2;
 bar(0,h/2-height,w,.10);
 for(let i=0;i<4;i++){
  const cx=-w/2+(i+.5)*pane;
  // Short ties connect both nested rectangles to the retained pane dividers.
  for(const side of [-1,1])bar(cx+side*pane*.30,cy,pane*.40,.026);
 }
 for(let i=0;i<4;i++)for(const scale of [1,.55]){
  const cx=-w/2+(i+.5)*pane,ww=pane*.72*scale,hh=height*.72*scale,t=.026;
  for(const s of [-1,1]){bar(cx+s*ww/2,cy,t,hh+t);bar(cx,cy+s*hh/2,ww+t,t);}
 }
 return g;
}
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'firstGymHistoric'),old=b.firstGymHistoric;
 b.firstGymHistoric=function(p,w,d){
  const ownWindow=Object.prototype.hasOwnProperty.call(this,'s18Window'),window=this.s18Window;
  this.s18Window=function(x,y,z,ww,hh,r=0,tall=false,tag=null){
   const result=window.call(this,x,y,z,ww,hh,r,tall,tag);
   if(tall&&Math.abs(r)<1e-8&&Math.abs(z-(d/2+.07))<1e-8&&Math.abs(y-8.555)<1e-8&&Math.abs(hh-5.265)<1e-8){
    const key='firstgym115-upper-light-'+ww.toFixed(6)+'-'+hh.toFixed(6);
    this.local(x,y,z,r,()=>this.mesh(key,this.geo(key,()=>transom(ww,hh)),0,0,0,1,1,1,'#923e30',20,.84));
   }
   return result;
  };
  try{return old.call(this,p,w,d);}finally{if(ownWindow)this.s18Window=window;else delete this.s18Window;}
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.firstGymHistoric=old;else delete b.firstGymHistoric;}
};
Y.FirstGym115Details={id:ID};
})(YY);
