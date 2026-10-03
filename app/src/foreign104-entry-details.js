/* Foreign Languages Building south-centre recessed glazed entrance.
 * SFL official 2023/2025 photographs; fitted dimensions, unknown lower leaf panels retained plain. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.pickId!==104||f.properties.id!=='way/240832215')return prior.call(this,b,f,add);
 const steps=[];
 const fields=['westFlank','v16box','v9Lattice','heritageDoor'],saved=fields.map(k=>[k,Object.hasOwn(b,k),b[k]]),box=b.v16box,lattice=b.v9Lattice,source=b.westFlank;
 b.westFlank=function(...args){
  b.v16box=function(key,x,y,z,w,h,d,...rest){if(key==='v16-west-flank-step'){const old=this.e.add;this.e.add=(...args)=>steps.push(args);try{return box.call(this,key,x,y,z,w,h,d,...rest);}finally{this.e.add=old;}}if(key!=='v16-west-flank-body')return box.call(this,key,x,y,z,w,h,d,...rest);
   // Carve only a shallow southern recess; all original exterior limits remain fixed.
   const lo=y-h/2,hi=y+h/2,front=d/2,depth=1.15,half=1.86,bottom=1.0,top=5.02;
   box.call(this,key+'-rear',x,y,z-depth/2,w,h,d-depth,...rest);
   for(const s of[-1,1])box.call(this,key+'-side-'+s,s*(w/2+half)/2,y,front-depth/2,w/2-half,h,depth,...rest);
   box.call(this,key+'-below',0,(lo+bottom)/2,front-depth/2,half*2,bottom-lo,depth,...rest);
   box.call(this,key+'-above',0,(top+hi)/2,front-depth/2,half*2,hi-top,depth,...rest);
  };
  b.v9Lattice=function(x,y,z,...rest){if(Math.abs(x)<1e-6&&Math.abs(y-3.17)<1e-6&&this.origin[2]>0&&Math.abs(this.rotation)<1e-6)return;return lattice.call(this,x,y,z,...rest);};
  b.heritageDoor=function(x,y,z,w,h,r){const front=z-.44,door=front-.34,red='#78382d',white='#dddcd2';
   this.local(x,0,0,r,()=>{
    const named=(name,fn)=>{const old=this.e.add;this.e.add=function(k,...a){return old.call(this,'foreign104-entry-'+name+'-'+k,...a)};try{fn()}finally{this.e.add=old}};
    named('surround',()=>{for(const s of[-1,1])this.box(s*2.04,3.03,front+.09,.38,4.06,.34,white,24);this.box(0,5.14,front+.10,4.46,.44,.40,white,24);});
    named('landing',()=>this.box(0,1.0,front+.18,4.46,.10,1.44,'#b9b8ab',24));
    named('frame',()=>{for(const xx of[-1.79,-1.18,0,1.18,1.79])this.box(xx,3.005,door,.105,3.91,.12,red,6);for(const yy of[1.05,1.57,4.0,4.95])this.box(0,yy,door,3.68,.10,.12,red,6);});
    const panes=[[-1.49,.51],[-.59,1.08],[.59,1.08],[1.49,.51]];
    for(let i=0;i<panes.length;i++){const [xx,ww]=panes[i];for(const [j,yy,hh]of[[0,2.785,2.33],[1,4.475,.85]]){
     named('glass-'+i+'-'+j,()=>this.box(xx,yy,door-.022,ww,hh,.035,'#66817b',5));
     // Diagonal lattice is clipped to each pane instead of extended across its red frame.
     named('diamond-'+i+'-'+j,()=>{const x0=xx-ww/2,x1=xx+ww/2,y0=yy-hh/2,y1=yy+hh/2;for(const slope of[-1,1])for(let q=-12;q<=12;q++){const intercept=yy+q*.43,pts=[];for(const x of[x0,x1]){const y=slope*(x-xx)+intercept;if(y>=y0&&y<=y1)pts.push([x,y,door+.065]);}for(const y of[y0,y1]){const x=xx+(y-intercept)/slope;if(x>x0&&x<x1)pts.push([x,y,door+.065]);}if(pts.length===2)this.beam(pts[0],pts[1],.028,red,6);}});
    }}
    named('lower-panel',()=>{for(const[xx,ww]of panes)this.box(xx,1.31,door,ww,.42,.10,red,6);});
   });
  };return source.apply(this,args);
 };
 try{const result=prior.call(this,b,f,add),M=Y.M;const root=M.transform([result.frame.centre[0],0,result.frame.centre[1]],result.scale,result.frame.r);for(const[k,g,m,c,p,uv]of steps)b.e.add('v30-foreign104-entry-restored-'+k,g,M.multiply(root,m),c,p,uv);const start=M.apply(root,[0,0,12.7,1]);b.e.add('v30-foreign104-entry-approach',Y.Geo.ribbon([[start[0],start[2]],[-355.6,-179.2]],4.2,.12,false),M.identity(),'#cbc7b7',[7,104,0,0]);return result;}finally{for(const[k,own,fn]of saved){if(own)b[k]=fn;else delete b[k];}}
};})(YY);
