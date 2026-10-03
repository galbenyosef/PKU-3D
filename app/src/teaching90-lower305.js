/* East lower-floor windows and finite photographed entrance recess.
 * East photographed door has a finite opening; west side stays inherited. */
(function(Y){'use strict';const P=Y.Builder.prototype,prev=P.lowTeaching;
const restore=(o,k,d)=>{if(d)Object.defineProperty(o,k,d);else delete o[k];};
P.lowTeaching=function(p,w,d){if(p.id!==75)return prev.call(this,p,w,d);const window=this.window,box=this.box,windowOwn=Object.getOwnPropertyDescriptor(this,'window'),boxOwn=Object.getOwnPropertyDescriptor(this,'box'),H=p.h-.7,fh=H/p.floors;let count=0;const doorX=-d/2+2.1+3.5*4.15,doorW=3.1,doorLo=.45,doorHi=3.8;
 this.box=function(x,y,z,ww,hh,dd,...rest){
  if(x===0&&z===0&&Math.abs(ww-d)<1e-6&&Math.abs(hh-H)<1e-6&&Math.abs(dd-w)<1e-6){
   const g=new Y.Geo.Geometry(),X=ww/2,Z=dd/2;
   // Original five exterior faces and one front face with a finite rectangular opening.
   g.quad([-X,0,-Z],[-X,H,-Z],[X,H,-Z],[X,0,-Z]);g.quad([-X,0,Z],[-X,H,Z],[-X,H,-Z],[-X,0,-Z]);g.quad([X,0,-Z],[X,H,-Z],[X,H,Z],[X,0,Z]);g.quad([-X,H,-Z],[-X,H,Z],[X,H,Z],[X,H,-Z]);g.quad([-X,0,Z],[-X,0,-Z],[X,0,-Z],[X,0,Z]);
   const face=(a,b,lo,hi)=>g.quad([a,lo,Z],[b,lo,Z],[b,hi,Z],[a,hi,Z]);
   face(-X,doorX-doorW/2,0,H);face(doorX+doorW/2,X,0,H);face(doorX-doorW/2,doorX+doorW/2,0,doorLo);face(doorX-doorW/2,doorX+doorW/2,doorHi,H);
   this.mesh('teaching90-lower305-open-body',g,0,0,0,1,1,1,...rest);return;
  }
  // Remove the old sill in the east opening (source column4, ground floor).
  if(Math.abs(this.rotation-Math.PI/2)<1e-7&&z>0&&[3,4].some(i=>Math.abs(x-(-d/2+2.1+i*4.15))<.01)&&y<2*fh&&Math.abs(hh-.12)<.001&&Math.abs(ww-3)<.001)return;
  return box.call(this,x,y,z,ww,hh,dd,...rest);
 };
 this.window=function(x,y,z,ww,hh,r,tone,...rest){
  if(Math.abs(this.rotation-Math.PI/2)>1e-7)return window.call(this,x,y,z,ww,hh,r,tone,...rest);
  const index=Math.round((x-(-d/2+2.1))/4.15);
  if(z>0&&Math.abs(r)<1e-7&&y<2*fh&&[3,4].includes(index)){
   if(index===3&&y>fh){
    const broad=6.75;window.call(this,doorX,y,z,broad,hh,r,'#56645e',false);
    this.local(doorX,y,z,0,()=>{
     for(let i=1;i<6;i++)box.call(this,-broad/2+broad*i/6,0,.04,.055,hh,.16,'#56645e',9,.7);
     box.call(this,0,hh*.35,.04,broad,.055,.16,'#56645e',9,.7);
     for(let i=0;i<19;i++)box.call(this,-broad/2+.10+(broad-.20)*i/18,0,.16,.022,hh,.028,'#9da79e',9,.7);
     box.call(this,0,-hh*.15,.16,broad,.022,.028,'#9da79e',9,.7);
    });
    box.call(this,doorX,y-fh*.33,z+.13,broad+.20,.12,.45,'#c3c6bb',10,.9);
   }
   return;
  }
  if(z<0||Math.abs(r)>1e-7||y>2*fh||![0,1,2,5,6,7].includes(index))return window.call(this,x,y,z,ww,hh,r,tone,...rest);
  count++;const pane=(ww-.12)/2;
  for(const sign of[-1,1])window.call(this,x+sign*(pane+.12)/2,y,z,pane,hh,r,'#56645e',false);
  this.local(x,y,z,r,()=>{
   for(const sign of[-1,1])box.call(this,sign*(pane+.12)/2,hh*.34,.035,pane,.055,.15,'#56645e',9,.7);
   if(y>fh)return;
   // Bowed iron guards stand clear of the glass; all dimensions are photo fits.
   const old=this.e.add,addOwn=Object.getOwnPropertyDescriptor(this.e,'add'),groups=new Map();this.e.add=function(k,g,m,c,p,uv){const key=c+'|'+p.join(',');let out=groups.get(key);if(!out){out={g:new Y.Geo.Geometry(),c,p,uv};groups.set(key,out);}const inv=Y.M.inverse(m);for(let i=0;i<g.v.length;i+=8){const v=g.v.slice(i,i+8),q=Y.M.apply(m,[...v.slice(0,3),1]),n=v.slice(3,6),nn=Y.M.norm([inv[0]*n[0]+inv[1]*n[1]+inv[2]*n[2],inv[4]*n[0]+inv[5]*n[1]+inv[6]*n[2],inv[8]*n[0]+inv[9]*n[1]+inv[10]*n[2]]);out.g.vertex(q.slice(0,3),nn,v.slice(6,8));}};
   try{
    const profile=[[-hh/2-.10,.18],[-hh*.37,.39],[0,.35],[hh*.35,.17],[hh/2+.10,.17]];
    for(let i=0;i<=12;i++){const xx=-ww/2-.08+(ww+.16)*i/12;
     for(let j=1;j<profile.length;j++){const a=profile[j-1],b=profile[j];this.beam([xx,a[0],a[1]],[xx,b[0],b[1]],.022,'#333e39',9);}
    }
    for(const [yy,zz]of profile)box.call(this,0,yy,zz,ww+.20,.026,.026,'#333e39',9,.6);
   }finally{restore(this.e,'add',addOwn);}
   let gi=0;for(const q of groups.values())old.call(this.e,'teaching90-lower305-guard-merged-'+index+'-'+gi++,q.g,Y.M.identity(),q.c,q.p,q.uv);
  });
 };
 try{const result=prev.call(this,p,w,d);
  this.local(0,0,0,Math.PI/2,()=>this.local(doorX,0,w/2,0,()=>{
   const old=this.e.add,addOwn=Object.getOwnPropertyDescriptor(this.e,'add');this.e.add=function(k,...args){return old.call(this,'teaching90-lower305-entry-'+k,...args);};
   try{
    for(const side of[-1,1])box.call(this,side*(doorW/2+.15),doorHi/2,.25,.30,doorHi,.62,'#aaa69a',1,.55);
    box.call(this,0,doorHi+.12,.25,doorW+.60,.24,.62,'#aaa69a',1,.55);
    // Finite pictured recess, depth fitted to the visible near brick return; no room layout inferred.
    for(const side of[-1,1])box.call(this,side*(doorW/2+.06),(doorHi+doorLo)/2,-.25,.12,doorHi-doorLo,.50,'#aaa69a',1,.55);
    const recessDepth=1.25,mid=(doorHi+doorLo)/2;
    this.mesh('recess-back',Y.Geo.box(),0,mid,-recessDepth,doorW+.12,doorHi-doorLo,.16,'#aaa69a',1,.55);
    for(const side of[-1,1])box.call(this,side*(doorW/2+.06),mid,-recessDepth/2,.12,doorHi-doorLo,recessDepth,'#aaa69a',1,.55);
    box.call(this,0,doorHi+.06,-recessDepth/2,doorW+.12,.12,recessDepth,'#aaa69a',1,.55);
    box.call(this,0,doorLo-.06,-recessDepth/2,doorW+.12,.12,recessDepth,'#c3c6bb',10,.9);
    box.call(this,0,doorLo/2,.28,doorW+.55,doorLo,.95,'#c3c6bb',10,.9);
    box.call(this,0,.075,.89,doorW+.80,.15,.48,'#c3c6bb',10,.9);
    box.call(this,0,.15,.67,doorW+.70,.30,.34,'#c3c6bb',10,.9);
    for(const side of[-1,1])box.call(this,side*(doorW/2-.035),(doorHi+doorLo)/2,.30,.07,doorHi-doorLo,.09,'#b7bdb4',9);
    box.call(this,0,doorHi-.045,.30,doorW,.09,.09,'#b7bdb4',9);
    const left=-doorW/2+.08,right=doorW*.18,bottom=doorLo+.04,top=doorHi-.08,N=12;
    for(let i=0;i<=N;i++){const x=left+(right-left)*i/N;box.call(this,x,(top+bottom)/2,.31,.024,top-bottom,.035,'#b7bdb4',9);}
    for(let i=0;i<N;i++){const a=left+(right-left)*i/N,b=left+(right-left)*(i+1)/N;for(const yy of[bottom+.47,top-.47]){this.beam([a,yy-.30,.325],[b,yy+.30,.325],.022,'#b7bdb4',9);this.beam([a,yy+.30,.325],[b,yy-.30,.325],.022,'#b7bdb4',9);}}
   }finally{restore(this.e,'add',addOwn);}
  }));return result;
 }finally{restore(this,'window',windowOwn);restore(this,'box',boxOwn);Y.Teaching90Lower305={changed:count,entranceVerified:'east pictured exterior only',doorSource:{x:doorX,z:w/2,width:doorW,bottom:doorLo,top:doorHi,recessDepth:1.25},scope:'east six inherited window positions on lower two floors plus centered photographed ground entrance and broad second-floor stair window'};}
};// Adapter clips low tread boxes at the source footprint. Close only their
// newly cut vertical rim, retaining every original triangle and tread height.
const render=Y.Architecture30.render;
Y.Architecture30.render=function(b,f,add){
 if(f.properties.pickId!==90||f.properties.id!=='way/240825555')return render.call(this,b,f,add);
 const old=b.e.add,addOwn=Object.getOwnPropertyDescriptor(b.e,'add'),records=[];
 b.e.add=function(k,g,m,c,p,uv){if(k.startsWith('v30-clipped-90-')&&p[0]===10&&c==='#c3c6bb')records.push({g,m,p,c});return old.call(this,k,g,m,c,p,uv);};
 let result;try{result=render.call(this,b,f,add);}finally{restore(b.e,'add',addOwn);}
 const ring=f.geometry.coordinates[0],G=new Y.Geo.Geometry();
 for(let ei=1;ei<ring.length;ei++){
  const a=ring[ei-1],z=ring[ei],dx=z[0]-a[0],dz=z[1]-a[1],ll=dx*dx+dz*dz,L=Math.sqrt(ll),segments=[];
  const parameter=p=>((p[0]-a[0])*dx+(p[2]-a[1])*dz)/ll;
  for(const r of records)for(let i=0;i<r.g.v.length;i+=24){
   const vs=[0,8,16].map(k=>Y.M.apply(r.m,[...r.g.v.slice(i+k,i+k+3),1]));
   if(!vs.every(v=>v[1]>.01&&v[1]<.25)||Math.max(...vs.map(v=>v[1]))-Math.min(...vs.map(v=>v[1]))>1e-5)continue;
   for(let j=0;j<3;j++){const p=vs[j],q=vs[(j+1)%3];if(Math.abs(dx*(p[2]-a[1])-dz*(p[0]-a[0]))/L>1e-4||Math.abs(dx*(q[2]-a[1])-dz*(q[0]-a[0]))/L>1e-4)continue;const ts=[parameter(p),parameter(q)].sort((x,y)=>x-y);if(ts[1]-ts[0]>1e-6)segments.push({lo:ts[0],hi:ts[1],h:p[1]});}
  }
  const cuts=[...new Set(segments.flatMap(s=>[s.lo,s.hi]))].sort((a,b)=>a-b);
  for(let j=1;j<cuts.length;j++){const lo=cuts[j-1],hi=cuts[j],mid=(lo+hi)/2;if(hi-lo<1e-6)continue;const covers=segments.filter(s=>s.lo<=mid&&s.hi>=mid);if(!covers.length)continue;const h=Math.max(...covers.map(s=>s.h)),p=[a[0]+dx*lo,0,a[1]+dz*lo],q=[a[0]+dx*hi,0,a[1]+dz*hi],points=[p,q,[q[0],h,q[2]],[p[0],h,p[2]]];const mx=(p[0]+q[0])/2,mz=(p[2]+q[2])/2;if(Y.Footprints.inside([mx-dz/L*.003,mz+dx/L*.003],f.geometry))points.reverse();G.quad(...points);}
 }
 if(G.v.length)old.call(b.e,'teaching90-lower305-tread-cut-closure',G,Y.M.identity(),'#c3c6bb',[10,90,0,.9]);
 return result;
};
})(YY);
