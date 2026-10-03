/* Current Willow component: photo/orthographic outline fit, not historical identity. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,prior=P.willowArch33;
P.willowArch33=function(){const box=this.box,descriptor=Object.getOwnPropertyDescriptor(this,'box');let captured=0;
 this.box=function(x,y,z,w,h,d,c,mat,...rest){
  if(x===0&&z===0&&((y===3.30&&w===3.15)||(y===3.49&&w===3.23))){captured++;return;}
  return box.call(this,x,y,z,w,h,d,c,mat,...rest);
 };
 try{prior.call(this);}finally{if(descriptor)Object.defineProperty(this,'box',descriptor);else delete this.box;}
 if(captured!==2)throw Error('Willow lintel source changed; review required');
 // The published orthographic face has a continuous broad lintel, with small
 // stepped returns confined to its lower end corners. Keep retained bounds,
 // posts and four supports. Measurements below are a silhouette fit only.
 const key='willow1119-current-lintel311',g=this.geo(key,()=>{
  const a=new G.Geometry(),r=[[-1.615,3.555],[1.615,3.555],[1.615,3.36],[1.59,3.36],[1.59,3.30],[1.55,3.30],[1.55,3.24],[1.49,3.24],[1.49,3.16],[-1.49,3.16],[-1.49,3.24],[-1.55,3.24],[-1.55,3.30],[-1.59,3.30],[-1.59,3.36],[-1.615,3.36]],depth=.27;
  for(let i=0;i<r.length;i++){const j=(i+1)%r.length,p=r[i],q=r[j];
   a.tri([0,3.39,depth],[q[0],q[1],depth],[p[0],p[1],depth]);
   a.tri([0,3.39,-depth],[p[0],p[1],-depth],[q[0],q[1],-depth]);
   a.quad([p[0],p[1],depth],[q[0],q[1],depth],[q[0],q[1],-depth],[p[0],p[1],-depth]);
  }return a;
 });this.mesh(key,g,0,0,0,1,1,1,'#b6b29c',10);
};
})(YY);
