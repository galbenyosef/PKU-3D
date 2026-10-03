/* South centre only: five unchanged lower window storeys, then a narrow
 * glazed strip aligned with eight existing storeys. Whole-building floor
 * count remains unverified; glazing subdivisions are photo-proportion fits. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const S={base:13.45,low:33.05,top:64.41,half:3,replaceHalf:26/6,back:14.05,front:14.51,glassZ:14.39,lowerStoreys:5,upperBands:8,storeyHeight:3.92,fit:true};
const holes=[{a:-3,b:3,lo:S.low,hi:S.top,kind:'strip'}];
P.wangTower30=function(){const grid=Y.WangStoreys160;if(grid){S.low=grid.fiveTop;S.storeyHeight=grid.step;S.upperBands=10;holes[0].lo=S.low;Object.assign(Y.WangSouthGlazing159,S);}const box=this.v16box,face=this.v16TowerFace;
this.v16box=function(k,x,y,z,w,h,d,c,mat,part){if(k==='wang-roof144-core-lower'){
 const bottom=Math.fround(y)-Math.fround(h)/2;let hh=Math.fround(S.low-bottom);
 // Choose a representable half-height that keeps the original lower plane.
 // At this magnitude centre Y has twice the Float32 spacing of half-height.
 if(grid&&Math.fround(bottom+hh/2)-hh/2!==bottom)hh=Math.fround(hh+Math.pow(2,Math.floor(Math.log2(hh))-23));
 box.call(this,k,x,bottom+hh/2,z,w,hh,d,c,mat,part);
 for(const sign of[-1,1])box.call(this,'wang-south-glazing159-core-side',sign*(13+S.replaceHalf)/2,(S.low+S.top)/2,z,13-S.replaceHalf,S.top-S.low,d,c,mat,part);
 return;
}return box.call(this,k,x,y,z,w,h,d,c,mat,part);};
this.v16TowerFace=function(k,x,y,z,w,h,bays,rows,r){if(!(k==='v16-wang-tower'&&x===0&&z===14.5&&w===26&&r===0))return face.call(this,k,x,y,z,w,h,bays,rows,r);
 const saved=this.v16box;this.v16box=function(key,xx,yy,zz,ww,hh,dd,c,mat,part){
 if(y+yy+hh/2<=S.low+.001)return saved.call(this,key,xx,yy,zz,ww,hh,dd,c,mat,part);
 if(key.endsWith('-stone-face')||key.endsWith('-belt')){if(key.endsWith('-stone-face')){const bottom=y+yy-hh/2;saved.call(this,'wang-south-glazing159-retained-lower-face',xx,(bottom+S.low)/2-y,zz,ww,S.low-bottom,dd,c,mat,part);hh=y+yy+hh/2-S.low;yy=S.low+hh/2-y;}for(const sign of[-1,1])saved.call(this,'wang-south-glazing159-retained-'+key,sign*(13+S.replaceHalf)/2,yy,zz,13-S.replaceHalf,hh,dd,c,mat,part);return;}
 if(Math.abs(xx)<S.replaceHalf-.001)return;
 return saved.call(this,key,xx,yy,zz,ww,hh,dd,c,mat,part);
 };try{return face.call(this,k,x,y,z,w,h,bays,rows,r);}finally{this.v16box=saved;}
};try{previous.call(this);}finally{this.v16box=box;this.v16TowerFace=face;}
const put=(k,x,y,z,w,h,d,c='#aaa99d',mat=24)=>box.call(this,'wang-south-glazing159-'+k,x,y,z,w,h,d,c,mat,.78);
const levels=[S.low,S.top,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>v>=S.low&&a.indexOf(v)===i).sort((a,b)=>a-b);
for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,b)=>a.a-b.a);let cursor=-S.replaceHalf;const fill=(a,b)=>{if(b>a)put('wall',(a+b)/2,(lo+hi)/2,(S.back+S.front)/2,b-a,hi-lo,S.front-S.back);};for(const q of cuts){fill(cursor,q.a);cursor=q.b;}fill(cursor,S.replaceHalf);}
const pane=this.geo('wang-south-glazing159-pane',G.plane);
for(const q of holes){this.mesh('wang-south-glazing159-glass-'+q.kind,pane,(q.a+q.b)/2,(q.lo+q.hi)/2,S.glassZ,q.b-q.a,q.hi-q.lo,1,q.kind==='strip'?'#81908d':'#465254',28,1.05);
for(const x of[q.a,q.b])put('frame',x,(q.lo+q.hi)/2,14.555,.075,q.hi-q.lo,.14,'#a9b1a8',29);
for(const y of[q.lo,q.hi])put('frame',(q.a+q.b)/2,y,14.565,q.b-q.a,.075,.14,'#a9b1a8',29);
if(q.kind==='lower')put('lower-mullion',(q.a+q.b)/2,(q.lo+q.hi)/2,14.555,.055,q.hi-q.lo,.14,'#a9b1a8',29);
}
put('centre-mullion',0,(S.low+S.top)/2,14.555,.075,S.top-S.low,.14,'#a9b1a8',29);
for(let j=1;j<S.upperBands;j++){const y=S.low+S.storeyHeight*j;put('storey-band',0,y,14.565,6,.18,.16,'#bcc4bd',24);put('glazing-transom',0,y+.34,14.555,6,.06,.14,'#a9b1a8',29);}
};Y.WangSouthGlazing159={...S,holes};
})(YY);
