/* Shaoyuan 7: the photographed portico has full-height metal fretwork between
 * stone piers, rather than isolated square grids. Preserve its existing frame. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240832237',KEY='shaoyuan7-125-fretwork',W=3.82,H=4.6,T=.035;
function bars(){const out=[],add=(x,y,w,h)=>out.push([x,y,w,h]),pitch=W/8,row=H/7;
 // A perimeter frame meets the unchanged pier faces and canopy underside.
 for(const x of[-W/2+T/2,W/2-T/2])add(x,H/2,T,H);
 for(const y of[T/2,H-T/2])add(0,y,W,T);
 // Paired uprights form tall narrow rectangles, with staggered bridges between
 // neighbouring pairs. Counts are fitted to the photograph, not surveyed.
 for(let c=0;c<8;c++){const x=-W/2+(c+.5)*pitch,half=pitch*.24;
  for(const side of[-1,1])add(x+side*half,H/2,T,H);
  for(let r=0;r<7;r++){
   for(const t of[.12,.88])add(x,(r+t)*row,pitch*.48+T,T);
   if(c<7)add(x+pitch/2,(r+.5)*row,pitch*.52+T,T);
  }
 }return out;
}
function geometry(){const g=new Y.Geo.Geometry(),box=Y.Geo.box();for(const[x,y,w,h]of bars())for(let i=0;i<box.v.length;i+=8)g.vertex([x+box.v[i]*w,y+box.v[i+1]*h,box.v[i+2]*.06],box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));return g;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const box=b.box,own=Object.prototype.hasOwnProperty.call(b,'box');
 b.box=function(...a){
  const vertical=a[1]===2.18&&a[2]===3.05&&a[3]===.04&&a[4]===3.85&&a[5]===.06;
  const horizontal=Math.abs(a[0])===5.8&&a[2]===3.05&&a[3]===3.15&&a[4]===.045&&a[5]===.06;
  if(vertical||horizontal)return;
  return box.apply(this,a);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.box=box;else delete b.box;}
 const id=b.id;b.id=f.properties.pickId;try{b.local(-320.2,0,324,Math.PI/2,()=>{const g=b.geo(KEY,geometry);for(const x of[-5.8,5.8])b.mesh(KEY,g,x,0,3.05,1,1,1,'#646c63',29);});}finally{b.id=id;}return result;
};
Y.Shaoyuan7125Details={id:ID,key:KEY,width:W,height:H,bars};
})(YY);
