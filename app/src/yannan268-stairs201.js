/* Yannan 55: three photographed stone treads between the veranda posts.
 * Width and run are fitted proportions, not surveyed measurements. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/866277606',width=3.55,back=.335,front=1.365,run=(front-back)/3,near=(a,b)=>Math.abs(a-b)<1e-6;
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==268)return prior.call(this,b,f,add);
 const names=['heritageBox','box'],descriptors=names.map(n=>Object.getOwnPropertyDescriptor(b,n)),saved=names.map(n=>b[n]);
 let anchor,steps=0,slabs=0;
 b.heritageBox=function(key,x,y,z,w,h,d,...args){
  if(key==='yannan268-door-reveal'){
   if(anchor||!near(w,1.49)||!near(h,2.68)||!near(d,.22))throw Error('Yannan268 stair door registration');
   anchor={point:this.world([0,0,0]),rotation:this.rotation};
  }
  if(key==='yannan268-entry-step'){
   const i=steps++;
   if(!anchor||i>2||!near(w,1.87)||!near(d,.30)||!near(h,.15*(i+1)))throw Error('Yannan268 stair registration');
   w=width;d=run;z=back+(2.5-i)*run;
  }
  return saved[0].call(this,key,x,y,z,w,h,d,...args);
 };
 b.box=function(x,y,z,w,h,d,...args){
  if(near(y,.35)&&near(h,.21)&&near(d,1.43)&&args[0]==='#b3b4a9'&&args[1]===10&&near(args[2],.25)){
   if(++slabs!==1||!anchor||!near(this.rotation,anchor.rotation))throw Error('Yannan268 veranda registration');
   const dx=anchor.point[0]-this.origin[0],dz=anchor.point[2]-this.origin[2],c=Math.cos(this.rotation),s=Math.sin(this.rotation),cx=dx*c-dz*s,cz=dx*s+dz*c;
   const left=x-w/2,right=x+w/2,rear=z-d/2,a=cx-width/2,q=cx+width/2,notch=cz+back;
   if(!(left<a&&q<right&&rear<notch)||!near(z+d/2,cz+front))throw Error('Yannan268 veranda bounds');
   // Full side platforms and the original rear landing support the threshold.
   // Keep the existing top and footprint, but carry all three stone blocks
   // down to the same model ground datum as the stairs. The former thin slabs
   // left an open gap below their exposed fronts after the stair notch was cut.
   const platformHeight=y+h/2,platformY=platformHeight/2;
   saved[1].call(this,(left+a)/2,platformY,z,a-left,platformHeight,d,...args);
   saved[1].call(this,(q+right)/2,platformY,z,right-q,platformHeight,d,...args);
   return saved[1].call(this,cx,platformY,(rear+notch)/2,width,platformHeight,notch-rear,...args);
  }
  return saved[1].call(this,x,y,z,w,h,d,...args);
 };
 try{const result=prior.call(this,b,f,add);if(!anchor||steps!==3||slabs!==1)throw Error('Yannan268 incomplete stair registration');return result;}
 finally{names.forEach((n,i)=>{if(descriptors[i])Object.defineProperty(b,n,descriptors[i]);else delete b[n];});}
};
Y.Yannan268Stairs201={id:ID,width,back,front,run};
})(YY);
