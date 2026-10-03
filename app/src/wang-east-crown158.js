/* East upper pavilion: photographed mixed dark window groups, narrow glazed
 * strips, pale opaque infill and forward metal frame. Dimensions/material of
 * the pale infill are fitted; this does not establish the unseen north face. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const S={low:64.41,top:72.25,front:13.01,back:12.55,glassX:12.82,zMin:-14.5,zMax:14.05,opaqueMiddle:[-6.26,1.06],fit:true};
const holes=[];for(const [a,b]of[[4.25,7.15],[7.65,10.55],[-13.20,-9.75]])for(const[lo,hi]of[[64.75,67.30],[68.05,70.95]])holes.push({a,b,lo,hi,kind:'dark'});
for(const[a,b]of[[-8.7,-6.26],[1.06,3.5]])holes.push({a,b,lo:64.65,hi:71.05,kind:'strip'});
P.wangTower30=function(){const box=this.v16box,face=this.v16TowerFace;
this.v16box=function(k,x,y,z,w,h,d,c,mat,part){
 if(k==='wang-roof144-core-rear'){
  const lo=y-h/2,hi=y+h/2;
  const bottom=Math.fround(y)-Math.fround(h)/2,lowerH=Math.fround(S.low-bottom);
  box.call(this,k,x,bottom+lowerH/2,z,w,lowerH,d,c,mat,part);
  return box.call(this,'wang-east-crown158-core-upper',(x-w/2+S.back)/2,(S.low+hi)/2,z,S.back-(x-w/2),hi-S.low,d,c,mat,part);
 }
 return box.call(this,k,x,y,z,w,h,d,c,mat,part);
};
this.v16TowerFace=function(k,x,y,z,w,h,bays,rows,r){
 if(!(k==='v16-wang-tower'&&x===13&&z===0&&rows===15&&r===Math.PI/2))return face.call(this,k,x,y,z,w,h,bays,rows,r);
 const current=this.v16box;
 this.v16box=function(key,xx,yy,zz,ww,hh,dd,c,mat,part){const lo=y+yy-hh/2,hi=y+yy+hh/2;if(lo>=S.low-1e-7)return;if(hi>S.low){hh=S.low-lo;yy=(lo+S.low)/2-y;key='wang-east-crown158-truncated-'+key;}return current.call(this,key,xx,yy,zz,ww,hh,dd,c,mat,part);};
 try{return face.call(this,k,x,y,z,w,h,bays,rows,r);}finally{this.v16box=current;}
};
try{previous.call(this);}finally{this.v16box=box;this.v16TowerFace=face;}
const put=(k,x,y,z,w,h,d,c='#c7c7bc',mat=24)=>box.call(this,'wang-east-crown158-'+k,x,y,z,w,h,d,c,mat,.78);
const levels=[S.low,S.top,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,b)=>a.a-b.a);let cursor=S.zMin;
 const solid=(a,b)=>{if(b>a)put('wall',(S.front+S.back)/2,(lo+hi)/2,(a+b)/2,S.front-S.back,hi-lo,b-a);};
 for(const q of cuts){solid(cursor,q.a);cursor=q.b;}solid(cursor,S.zMax);
}
const pane=this.geo('wang-east-crown158-pane',G.plane);
for(const q of holes){this.mesh('wang-east-crown158-glass',pane,S.glassX,(q.lo+q.hi)/2,(q.a+q.b)/2,q.b-q.a,q.hi-q.lo,1,q.kind==='dark'?'#465254':'#60797e',28,1.05,Math.PI/2);
 for(const z of[q.a,q.b])put('frame',S.front+.035,(q.lo+q.hi)/2,z,.14,q.hi-q.lo,.07,'#a9b1a8',29);
 for(const y of[q.lo,q.hi])put('frame',S.front+.045,y,(q.a+q.b)/2,.16,.07,q.b-q.a,'#a9b1a8',29);
 if(q.kind==='dark')put('window-mullion',S.front+.045,(q.lo+q.hi)/2,(q.a+q.b)/2,.14,q.hi-q.lo,.055,'#a9b1a8',29);
 else for(const y of[66.25,67.85,69.45])put('strip-transom',S.front+.045,y,(q.a+q.b)/2,.16,.07,q.b-q.a,'#a9b1a8',29);
}
// Frame stands forward of both narrow strips and neutral opaque middle panel.
for(const z of[-8.7,-6.26,1.06,3.5])put('outer-post',13.40,67.85,z,.10,6.35,.085,'#a9b1a8',29);
for(const y of[65.10,66.65,68.20,69.75,70.95]){put('outer-rail',13.40,y,-2.60,.10,.075,12.2,'#a9b1a8',29);for(const z of[-8.7,3.5])put('rail-bracket',13.22,y,z,.46,.07,.085,'#a9b1a8',29);}
};Y.WangEastCrown158={...S,holes,scope:'east-upper-two-levels-only',opaqueMaterial:'neutral-fit-not-verified-stone'};
})(YY);
