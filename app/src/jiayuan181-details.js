/* Jiayuan south central entrance. The 2024 campus-service photographs show
 * level access and dark framed glazed doors, not the inherited stair/window. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/444894329',G=Y.Geo,M=Y.M;
function union(parts){const g=new G.Geometry(),box=G.box();for(const [x,y,z,w,h,d]of parts){const m=M.transform([x,y,z],[w,h,d],0);for(let i=0;i<box.v.length;i+=8){const p=M.apply(m,[box.v[i],box.v[i+1],box.v[i+2],1]);g.vertex(p.slice(0,3),box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));}}return g;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const original=b.jiayuan,own=Object.prototype.hasOwnProperty.call(b,'jiayuan');
 b.jiayuan=function(w,d){const box=this.box,window=this.window,steps=this.steps,owned=['box','window','steps'].map(k=>Object.prototype.hasOwnProperty.call(this,k)),gap=4.1,head=4.95,depth=1.6;
  const south=()=>Math.abs(this.origin[2]-d/2)<1e-5&&Math.abs(this.rotation)<1e-5;
  this.box=function(x,y,z,ww,h,dd,c,mat,part){
   if(x===0&&y===11.4&&z===0&&ww===w&&h===22.8&&dd===d){
    const key='jiayuan181-portal-wall',side=(w-gap)/2;
    return this.mesh(key,this.geo(key,()=>union([[0,11.4,-depth/2,w,22.8,d-depth],[-(gap+side)/2,11.4,d/2-depth/2,side,22.8,depth],[(gap+side)/2,11.4,d/2-depth/2,side,22.8,depth],[0,(22.8+head)/2,d/2-depth/2,gap,22.8-head,depth]])),0,0,0,1,1,1,c,mat,part);
   }
   if(x===0&&y===.5&&z===0&&ww===w+1&&h===1&&dd===d+1){
    const key='jiayuan181-portal-base',side=(ww-gap)/2,cut=depth+.5;
    return this.mesh(key,this.geo(key,()=>union([[0,.5,-cut/2,ww,1,dd-cut],[-(gap+side)/2,.5,dd/2-cut/2,side,1,cut],[(gap+side)/2,.5,dd/2-cut/2,side,1,cut],[0,.03,dd/2-cut/2,gap,.06,cut]])),0,0,0,1,1,1,c,mat,part);
   }
   if(south()&&x===0&&y===7.6&&z===.25&&ww===4.1&&h===13.2){y=(14.2+head)/2;h=14.2-head;}
   return box.call(this,x,y,z,ww,h,dd,c,mat,part);
  };
  this.window=function(x,y,z,ww,h,...rest){
   if(south()&&x===0&&y===3&&ww===3.55&&h===3.65)return;
   if(south()&&x===0&&y===2.8&&ww===8&&h===4.9){
    // Four glass door leaves under one transom; widths remain a fitted bay.
    const front=-1.4,tone='#303c3c',put=(x,y,z,w,h,d,c,m)=>box.call(this,x,y,z,w,h,d,c,m,.7);
    for(const xx of[-2.005,2.005])put(xx,2.505,front,.09,4.89,.14,tone,9);
    for(const yy of[.105,3.8,4.905])put(0,yy,front,gap,.09,.14,tone,9);
    for(const xx of[-1,0,1])put(xx,1.9525,front,.065,3.605,.13,tone,9);
    for(const xx of[-1.5,-.5,.5,1.5])put(xx,1.9525,front-.035,.92,3.605,.045,'#546c76',5);
    put(0,4.3525,front-.035,3.92,1.015,.045,'#546c76',5);
    return;
   }
   return window.call(this,x,y,z,ww,h,...rest);
  };
  this.steps=function(x,z,ww,n,top){if(x===0&&z===d/2+3.8&&ww===20&&n===5&&top===.85)return;return steps.call(this,x,z,ww,n,top);};
  try{return original.call(this,w,d);}finally{for(const[k,i]of['box','window','steps'].map((k,i)=>[k,i]))if(owned[i])this[k]=[box,window,steps][i];else delete this[k];}
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.jiayuan=original;else delete b.jiayuan;}
};Y.Jiayuan181Details={id:ID};
})(YY);
