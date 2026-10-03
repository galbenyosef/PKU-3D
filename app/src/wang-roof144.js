/* South upper pavilion only: continuous recessed curtain glazing replaces the
 * generic upper two rows. Dimensions are photo-proportion fits, not a survey. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const S={low:64.41,openLow:64.495,glassTop:71.05,top:72.26,half:10.5,wallHalf:13.01,front:14.51,back:14.05,glassZ:14.39,ribbonTop:64.41,openings:[[-10.5,-6.6],[-5,5],[6.6,10.5]],scope:'south-upper-two-storeys-only-photo-fit'};
P.wangTower30=function(){const box=this.v16box,face=this.v16TowerFace;
this.v16TowerFace=function(k,x,y,z,w,h,bays,rows,r=0){if(k==='v16-wang-tower'&&x===0&&z===14.5&&w===26&&rows===15)return face.call(this,k,x,y,z,w,S.low-y,bays,13,r);return face.call(this,k,x,y,z,w,h,bays,rows,r);};
this.v16box=function(k,x,y,z,w,h,d,c,mat,part){
 if(k==='v16-wang-setback-core'&&x===0){
  // Recess through the actual old front shell, retaining the rear body. Glass
  // occupies the resulting recess rather than being pasted over an opaque box.
  const lo=y-h/2,hi=S.top,rear=z-d/2,t=S.front-S.back;
  box.call(this,'wang-roof144-core-rear',0,y,(rear+S.back)/2,w,h,S.back-rear,c,mat,part);
  box.call(this,'wang-roof144-core-lower',0,(lo+S.low)/2,(S.back+14.5)/2,w,S.low-lo,14.5-S.back,c,mat,part);
  for(const s of[-1,1])box.call(this,'wang-roof144-core-jamb',s*(S.half+S.wallHalf)/2,(S.low+hi)/2,(S.back+S.front)/2,S.wallHalf-S.half,hi-S.low,t,'#c7c7bc',mat,part);
  for(const s of[-1,1])box.call(this,'wang-roof144-core-pier',s*5.8,(S.low+S.glassTop)/2,(S.back+S.front)/2,1.6,S.glassTop-S.low,t,'#c7c7bc',mat,part);
  return box.call(this,'wang-roof144-core-head',0,(S.glassTop+hi)/2,(S.back+S.front)/2,2*S.half,hi-S.glassTop,t,'#c7c7bc',mat,part);
 }
 if(z>14.8&&z<15.2&&(k==='v16-wang-glass-ribbon'||k==='v16-wang-ribbon-fin')){const lo=y-h/2,top=S.ribbonTop+(k==='v16-wang-ribbon-fin'?.01:0);return box.call(this,'wang-roof144-truncated-'+k,x,(lo+top)/2,z,w,top-lo,d,c,mat,part);}
 if(k==='v16-wang-ribbon-crossbar'&&z>14.8&&y>S.ribbonTop)return;
 return box.call(this,k,x,y,z,w,h,d,c,mat,part);
};try{previous.call(this);}finally{this.v16box=box;this.v16TowerFace=face;}
const frame='#a9b1a8';
const pane=this.geo('wang-roof144-pane',G.plane);for(const [a,b] of S.openings){this.mesh('wang-roof144-glass',pane,(a+b)/2,(S.openLow+S.glassTop)/2,S.glassZ,b-a,S.glassTop-S.openLow,1,'#60797e',28,1.05);const n=b-a>5?4:2;for(let i=0;i<=n;i++)box.call(this,'wang-roof144-mullion',a+(b-a)*i/n,(S.openLow+S.glassTop-.01)/2,S.front+.025,.09,S.glassTop-.01-S.openLow,.16,frame,29,1.1);}
for(let i=0;i<=4;i++)box.call(this,'wang-roof144-transom',0,S.low+(S.glassTop-S.low)*i/4,S.front+.045,2*S.half+.02,.085,.16,frame,29,1.1);
// Two projecting facade rails have short supports seated in the jambs.
for(const y of[S.low+2.2,S.low+4.4]){box.call(this,'wang-roof144-rail',0,y,S.front+.37,2*S.half+.3,.085,.09,frame,29,1.1);for(const x of[-S.half,0,S.half])box.call(this,'wang-roof144-rail-support',x,y,S.front+.18,.08,.08,.4,frame,29,1.1);}
};Y.WangRoof144=S;
})(YY);
