/* B-building west entrance: dated 2013 panorama explicitly labels B座.
 * Door, two single-axis upper windows, concrete canopy and south-running ramp are photo-proportioned fits. */
(function(Y){'use strict';const previous=Y.Architecture30.render,ID='way/1009052001',G=Y.Geo;
const restore=(o,k,d)=>{if(d)Object.defineProperty(o,k,d);else delete o[k];};
function frame(f){const a=f.geometry.coordinates[0][4],z=f.geometry.coordinates[0][5],L=Math.hypot(z[0]-a[0],z[1]-a[1]),u=[(z[0]-a[0])/L,(z[1]-a[1])/L],n=[-u[1],u[0]],t=L*.52;return{a,z,L,u,n,t,rotation:Math.atan2(n[0],n[1]),centre:[a[0]+u[0]*t,a[1]+u[1]*t]};}
function render(b,f,add){const F=frame(f),r=f.geometry.coordinates[0],sign=Y.Footprints.area(r)>0?1:-1,oldWindow=b.window,ownWindow=Object.getOwnPropertyDescriptor(b,'window'),door={width:1.70,bottom:.42,top:2.78,grilleTop:3.04},windows=[{bottom:4.65,top:6.4,width:1.50,halfOpen:true},{bottom:8,top:9.65,width:1.50,halfOpen:false}];
 const point=(u,y,v=0)=>[F.a[0]+F.u[0]*u+F.n[0]*v,y,F.a[1]+F.u[1]*u+F.n[1]*v];
 const walls=new G.Geometry(),panel=(lo,hi,y0,y1)=>{const p=[point(lo,y0),point(hi,y0),point(hi,y1),point(lo,y1)];walls.quad(...p);};
 // Keep every non-target original face byte-for-byte in its original order.
 for(let i=0;i<11;i++){if(i===4){let bottom=.3;for(const hole of[{bottom:door.bottom,top:door.grilleTop,width:door.width},...windows]){panel(0,F.L,bottom,hole.bottom);panel(0,F.t-hole.width/2,hole.bottom,hole.top);panel(F.t+hole.width/2,F.L,hole.bottom,hole.top);bottom=hole.top;}panel(0,F.L,bottom,10.5);continue;}const a=r[i],c=r[i+1],h=i>=3&&i<=5?10.5:7,p=sign>0?c:a,q=sign>0?a:c;walls.quad([p[0],.3,p[1]],[q[0],.3,q[1]],[q[0],h,q[1]],[p[0],h,p[1]]);}
 b.window=function(x,y,z,...args){const du=(x-F.a[0])*F.u[0]+(z-F.a[1])*F.u[1],dv=(x-F.a[0])*F.n[0]+(z-F.a[1])*F.n[1];if(du>0&&du<F.L&&Math.abs(dv-.045)<.001)return;return oldWindow.call(this,x,y,z,...args);};
 let result;try{result=previous.call(this,b,f,(k,g,c,m,id)=>add(k,k==='108-original-exterior-walls'?walls:g,c,m,id));}finally{restore(b,'window',ownWindow);}
 b.id=340;const old=b.e.add,ownAdd=Object.getOwnPropertyDescriptor(b.e,'add');b.e.add=function(k,...a){return old.call(this,'340-entry306-'+k,...a);};
 try{b.local(F.centre[0],0,F.centre[1],F.rotation,()=>{
  const wall='#d5d8d0',frame='#c9cfc4',leaf='#d2d6ca',stone='#a9ada3',metal='#4c554f';
  // Real shallow opening with closed double leaves; no room beyond is invented.
  b.box(0,(door.bottom+door.grilleTop)/2,-.20,door.width,door.grilleTop-door.bottom,.10,'#434b43',38);
  for(const side of[-1,1])b.box(side*(door.width/2+.065),(door.bottom+door.grilleTop)/2,-.075,.13,door.grilleTop-door.bottom,.25,wall,24);
  b.box(0,door.grilleTop+.065,-.075,door.width+.26,.13,.25,wall,24);
  for(const side of[-1,1]){
   const cx=side*(door.width-.10)/4,w=(door.width-.10)/2;
   b.box(cx,(door.bottom+door.top)/2,-.09,w-.022,door.top-door.bottom-.06,.12,leaf,38);
   for(const yy of[door.bottom+.43,door.top-.38]){b.box(cx,yy,-.017,w-.17,.035,.022,frame,38);for(const xx of[-1,1])b.box(cx+xx*(w-.17)/2,yy+.10,-.017,.027,.20,.022,frame,38);}
  }
  for(const x of[-door.width/2,0,door.width/2])b.box(x,(door.bottom+door.top)/2,.025,.055,door.top-door.bottom+.06,.12,frame,38);
  for(const y of[door.bottom,door.top,door.grilleTop])b.box(0,y,.025,door.width+.10,.055,.12,frame,38);
  b.box(-.065,1.60,.08,.032,.30,.05,metal,9);b.box(-.105,1.72,.08,.11,.025,.05,metal,9);
  for(let i=-8;i<=8;i++){const x=i*.095;b.beam([x-.045,door.top+.03,.025],[x+.045,door.grilleTop-.03,.025],.012,metal,9);b.beam([x+.045,door.top+.03,.025],[x-.045,door.grilleTop-.03,.025],.012,metal,9);}
  // Photo-visible single vertical axis: lower left opening/right sash,
  // upper two pale panes. Shallow stops bound the unobserved interior.
  for(const w of windows){const cy=(w.bottom+w.top)/2,h=w.top-w.bottom;
   b.box(0,cy,-.355,w.width,h,.05,'#3e4840',38);
   for(const x of[-1,1])b.box(x*(w.width/2+.055),cy,-.16,.11,h+.20,.32,wall,24);
   for(const y of[w.bottom-.05,w.top+.05])b.box(0,y,-.16,w.width,.10,.32,wall,24);
   for(const x of[-1,1])b.box(x*(w.width/2-.032),cy,-.075,.064,h,.075,frame,9);
   for(const y of[w.bottom+.032,w.top-.032])b.box(0,y,-.075,w.width,.064,.075,frame,9);
   b.box(0,cy,-.075,.052,h,.075,frame,9);
   for(const x of(w.halfOpen?[1]:[-1,1]))b.box(x*w.width/4,cy,-.13,w.width/2-.065,h-.13,.05,w.halfOpen?'#78918c':'#a6bcb0',28);
   b.box(0,w.bottom-.045,.075,w.width+.24,.09,.23,'#bdc4b8',24);
  }
  // Thick flat canopy, attached to the wall, with a subdued lower fascia.
  b.box(0,3.40,.91,4.0,.46,1.90,'#b1b4aa',24);b.box(0,3.175,.93,3.86,.045,1.81,'#c6c9be',24);
  b.box(0,.21,.80,3.20,.42,1.64,stone,24);
  // Closed six-sided sloping slab: platform south end -> ground along west wall.
  const a=1.60,c=5.65,v0=.02,v1=1.62,h=.42,geo=new G.Geometry();
  geo.quad([a,h,v0],[a,h,v1],[c,.018,v1],[c,.018,v0]);
  geo.quad([a,0,v1],[a,0,v0],[c,0,v0],[c,0,v1]);
  geo.quad([a,0,v0],[a,h,v0],[c,.018,v0],[c,0,v0]);
  geo.quad([c,0,v1],[c,.018,v1],[a,h,v1],[a,0,v1]);
  geo.quad([a,0,v1],[a,h,v1],[a,h,v0],[a,0,v0]);
  geo.quad([c,0,v0],[c,.018,v0],[c,.018,v1],[c,0,v1]);
  b.mesh('south-ramp',geo,0,0,0,1,1,1,stone,24);
 });}finally{restore(b.e,'add',ownAdd);}
 return{...result,westCanopyVerified:true,westEntrancePhotoDate:'2013-09-16',westEntranceDimensionsMeasured:false,westEntry306:{...door,centre:F.centre,rotation:F.rotation,platformHeight:.42,rampSouthLength:4.05,sourceEdge:4,upperWindows:windows},currentCaptureDateVerified:false};
}
Y.Architecture30.render=function(b,f,add){return f.properties.pickId===340&&f.properties.id===ID?render.call(this,b,f,add):previous.call(this,b,f,add);};Y.Building340Entry306={id:ID,frame,render};
})(YY);
