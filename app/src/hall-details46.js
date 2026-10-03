/* Pick 45 only. Its own front photograph shows a clear central square in the
 * octagonal window, with short glazing bars confined to the perimeter bands. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/188711087';
const half=1.2,outer=2.4*Math.cos(Math.PI/8),corner=outer+2.4*Math.sin(Math.PI/8),mainEnd=corner-half-.04;
function oldBar(x,y,z,w,h,d,c){return c==='#c3d2d1'&&(([-1.25,0,1.25].includes(x)&&y===22.2&&z===14.70&&w===.08&&h===3.9&&d===.09)||(x===0&&[20.8,22.2,23.6].includes(y)&&z===14.71&&w===4&&h===.08&&d===.10));}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);const hall=b.hall;
 b.hall=function(...args){const box=this.box;this.box=function(...p){if(!oldBar(...p))return box.apply(this,p);};try{hall.apply(this,args);}finally{this.box=box;}
  const e=this.e,emit=e.add;e.add=function(k,...p){return emit.call(this,'hall-octagon-inner-'+k,...p);};try{
   for(const x of[-half,half])this.box(x,22.2,14.70,.08,mainEnd*2,.09,'#c3d2d1',9,1);
   for(const y of[-half,half])this.box(0,22.2+y,14.71,mainEnd*2,.08,.10,'#c3d2d1',9,1);
   const end=outer-.015,start=half+.025,span=end-start,mid=(end+start)/2;
   for(const t of[-.6,0,.6])for(const sign of[-1,1]){
    this.box(t,22.2+sign*mid,14.70,.045,span,.09,'#c3d2d1',9,1);
    this.box(sign*mid,22.2+t,14.71,span,.045,.10,'#c3d2d1',9,1);
   }
  }finally{e.add=emit;}
 };
 try{return previous(b,f,add);}finally{b.hall=hall;}
};
Y.HallDetails46={id:ID,oldBar,half,outer,mainEnd};
})(YY);
