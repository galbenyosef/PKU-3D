/* Beigong west door: 2020/2021 official repair photographs. Central pair,
 * narrow side units, separate upper lights and three-direction open lattice.
 * Dimensions and repeated motif counts are photographic fits. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/240832216';
function split(p,axis,value,sign){const yes=[],no=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=(a.q[axis]-value)*sign,db=(b.q[axis]-value)*sign;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function cut(g,tr,lo,hi){const out=new G.Geometry();let changed=false;for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>({v:Array.from(g.v.slice(i+j,i+j+8)),q:M.apply(tr,[...g.v.slice(i+j,i+j+3),1]).slice(0,3)})),parts=[];
 for(let axis=0;axis<3;axis++)for(const[v,s]of[[lo[axis],1],[hi[axis],-1]]){if(rest.length<3)continue;const q=split(rest,axis,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}
 const hit=rest.length>=3&&Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))>1e-9;
 if(!hit){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;
 for(const p of parts)for(let j=1;j+1<p.length;j++){const vs=[p[0],p[j],p[j+1]];if(Math.hypot(...M.cross(M.sub(vs[1].v.slice(0,3),vs[0].v.slice(0,3)),M.sub(vs[2].v.slice(0,3),vs[0].v.slice(0,3))))>1e-10)out.v.push(...vs[0].v,...vs[1].v,...vs[2].v);}
 }if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return{g:changed?out:g,changed};}
function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();g.quad(...p);}
function box(g,x,y,z,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8)g.v.push(x+raw.v[i]*w,y+raw.v[i+1]*h,z+raw.v[i+2]*d,...raw.v.slice(i+3,i+8));}
A.render=function(b,f,add){if(f.properties.pickId!==105||f.properties.id!==ID)return previous.call(this,b,f,add);
 const emit=b.e.add,ownAdd=Object.hasOwn(b.e,'add'),gym=b.historicOffice,ownGym=Object.hasOwn(b,'historicOffice'),rows=[];let tagged=0;
 b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p,uv});};
 b.historicOffice=function(...args){const door=this.heritageDoor,own=Object.hasOwn(this,'heritageDoor'),lat=this.v9Lattice,ownLat=Object.hasOwn(this,'v9Lattice'),bay=this.v9box,ownBay=Object.hasOwn(this,'v9box');
 this.v9Lattice=function(...a){if(Math.abs(a[0])>1e-6||Math.abs(a[1]-4.4)>1e-6)return lat.apply(this,a);const emit=this.e.add,own=Object.hasOwn(this.e,'add');this.e.add=function(k,...rest){return emit.call(this,'office105-entry163-old-lattice',...rest);};try{return lat.apply(this,a);}finally{if(own)this.e.add=emit;else delete this.e.add;}};
 this.v9box=function(...a){if(a[0]==='v9-office-bay-panel'&&Math.abs(a[1])<1e-6)a[0]='office105-entry163-old-bay';return bay.apply(this,a);};this.heritageDoor=function(...a){const out=this.e.add,own=Object.hasOwn(this.e,'add');this.e.add=function(k,g,m,c,p,uv){return out.call(this,'office105-entry163-old-'+tagged++,g,m,c,p,uv);};try{return door.apply(this,a);}finally{if(own)this.e.add=out;else delete this.e.add;}};try{return gym.apply(this,args);}finally{if(own)this.heritageDoor=door;else delete this.heritageDoor;if(ownLat)this.v9Lattice=lat;else delete this.v9Lattice;if(ownBay)this.v9box=bay;else delete this.v9box;}};
 let result;try{result=previous.call(this,b,f,add);}finally{if(ownAdd)b.e.add=emit;else delete b.e.add;if(ownGym)b.historicOffice=gym;else delete b.historicOffice;}
 const plate=rows.find(r=>r.k==='v30-office105-entry163-old-0');if(!plate||tagged!==24)throw Error('office105 entry163 source changed');
 const frame=new Float32Array(plate.m);for(let j=0;j<3;j++){frame[j]/=4.77;frame[4+j]/=4.28;frame[8+j]/=.22;frame[12+j]-=frame[4+j]*2.05;}const inv=M.inverse(frame),W=3.2,H=4.1,B=.035,back=-1.5;
 let cuts=0,oldLattice=0,oldBay=0;for(const r of rows){
 if(r.k==='v30-office105-entry163-old-lattice'){oldLattice++;continue;}
 if(r.k==='v30-office105-entry163-old-bay'){oldBay++;const clipped=cut(r.g,M.multiply(inv,r.m),[-100,-100,-100],[100,4.985,100]);emit.call(b.e,'office105-entry163-upper-bay',clipped.g,r.m,r.c,r.p,r.uv);continue;}
 if(r.k.startsWith('v30-office105-entry163-old-')){if(r.k.endsWith('-23'))emit.call(b.e,'v30-box',r.g,r.m,r.c,r.p,r.uv);continue;}
  const c=cut(r.g,M.multiply(inv,r.m),[-W/2,B,back],[W/2,H,.4]);emit.call(b.e,c.changed?'office105-entry163-cut-'+cuts++:r.k,c.g,r.m,r.c,r.p,r.uv);
 }
 if(cuts!==1||oldLattice<10||oldBay!==1)throw Error('office105 entry163 expected central wall/lattice/bay backing: '+[cuts,oldLattice,oldBay]);
 const frames=new G.Geometry(),lattice=new G.Geometry(),glass=new G.Geometry(),panels=new G.Geometry(),relief=new G.Geometry(),hardware=new G.Geometry(),z=.10,t=.065,mainTop=2.90,upperBase=3.04;
 function line(g,a,b,w=.017,depth=.045){const zz=g===relief?.1325:g===hardware?.230:z,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<1e-7)return;const nx=-dy/len*w/2,ny=dx/len*w/2,p=[[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]];
  face(g,p.map(q=>[...q,zz+depth/2]),[0,0,1]);face(g,p.map(q=>[...q,zz-depth/2]),[0,0,-1]);for(let i=0;i<4;i++){const a=p[i],b=p[(i+1)%4];face(g,[[...a,zz-depth/2],[...b,zz-depth/2],[...b,zz+depth/2],[...a,zz+depth/2]],[b[1]-a[1],a[0]-b[0],0]);}}
 function clippedLine(g,x,y,dx,dy,lo,hi){let a=-100,b=100;for(let j=0;j<2;j++){const q=j?y:x,v=j?dy:dx;if(Math.abs(v)<1e-10){if(q<lo[j]||q>hi[j])return;}else{const p=(lo[j]-q)/v,r=(hi[j]-q)/v;a=Math.max(a,Math.min(p,r));b=Math.min(b,Math.max(p,r));}}if(b>a)line(g,[x+a*dx,y+a*dy],[x+b*dx,y+b*dy]);}
 function sixway(a,b,low,high){const dx=.165,dy=dx/Math.sqrt(3),lo=[a+.012,low+.012],hi=[b-.012,high-.012],centre=(a+b)/2;
  for(let k=-20;k<=20;k++)clippedLine(lattice,centre+k*dx,low,0,1,lo,hi);
  for(const s of[-1,1])for(let k=-35;k<=35;k++)clippedLine(lattice,centre,low+k*2*dy,1,s/Math.sqrt(3),lo,hi);
  box(glass,(a+b)/2,(low+high)/2,-.005,b-a,high-low,.026);
 }
 const edges=[-1.6,-.99,0,.99,1.6];
 for(let i=0;i<4;i++){const left=edges[i]+(i===0?0:.012),right=edges[i+1]-(i===3?0:.012),a=left+t,b=right-t,c=(a+b)/2;
  for(const x of[left+t/2,right-t/2])box(frames,x,(B+H)/2,z,t,H-B,.14);
  for(const [low,high]of[[B,.17],[.78,.89],[1.12,1.24],[mainTop,upperBase],[H-.12,H]])box(frames,(left+right)/2,(low+high)/2,z,right-left-2*t,high-low,.14);
  box(panels,c,(.17+.78)/2,.065,b-a,.78-.17,.11);box(panels,c,(.89+1.12)/2,.065,b-a,1.12-.89,.11);
  sixway(a,b,1.24,mainTop);sixway(a,b,upperBase,H-.12);
  // Visible low-panel double scroll relation only; no invented heraldic motif.
  for(const s of[-1,1]){let old;for(let j=0;j<=32;j++){const u=j/32,angle=s*(Math.PI*.3+u*Math.PI*1.65),radius=(b-a)*(.19-.115*u),p=[c+s*(b-a)*.19+Math.cos(angle)*radius,.44+Math.sin(angle)*radius];if(old)line(relief,old,p,.026,.035);old=p;}}
  for(const yy of[.92,1.09])line(relief,[a+.04,yy],[b-.04,yy],.017,.03);
 }
 // The west oblique photograph distinguishes a left vertical pull from a
 // right narrow lock plate with a short outward loop. Not mirrored hardware.
 box(hardware,-.045,1.395,.238,.014,.35,.018);
 for(const y of[1.235,1.555])box(hardware,-.045,y,.203,.031,.033,.086);
 box(hardware,.045,1.385,.176,.048,.53,.018);
 for(const y of[1.33,1.43])box(hardware,.045,y,.203,.018,.018,.068);
 let last;for(let i=0;i<=16;i++){const a=-Math.PI/2+i*Math.PI/16,p=[.045+.065*Math.cos(a),1.38+.05*Math.sin(a)];if(last)line(hardware,last,p,.012,.014);last=p;}
 emit.call(b.e,'office105-entry163-hardware',hardware,frame,'#b9bcb7',[29,105,0,.94]);
 emit.call(b.e,'office105-entry163-frame',frames,frame,'#97372b',[20,105,0,.9]);emit.call(b.e,'office105-entry163-lattice',lattice,frame,'#97372b',[20,105,0,.92]);emit.call(b.e,'office105-entry163-glass',glass,frame,'#435653',[5,105,0,.76]);emit.call(b.e,'office105-entry163-panels',panels,frame,'#97372b',[20,105,0,.9]);emit.call(b.e,'office105-entry163-relief',relief,frame,'#a94331',[20,105,0,.93]);
 const room=new G.Geometry();face(room,[[-W/2,B,back],[W/2,B,back],[W/2,H,back],[-W/2,H,back]],[0,0,1]);
 for(const s of[-1,1])face(room,[[s*W/2,B,back],[s*W/2,H,back],[s*W/2,H,.10],[s*W/2,B,.10]],[-s,0,0]);face(room,[[-W/2,H,back],[-W/2,H,.10],[W/2,H,.10],[W/2,H,back]],[0,-1,0]);
 emit.call(b.e,'office105-entry163-return',room,frame,'#b0b0a3',[24,105,0,.75]);
 // Old photographed landing and original threshold remain; extend only behind
 // the threshold's exact rear edge (-.135) to the finite recess back.
 const floor=new G.Geometry();box(floor,0,(-.11+B)/2,(back-.135)/2,W,B+.11,-.135-back);emit.call(b.e,'office105-entry163-floor',floor,frame,'#adada2',[10,105,0,.245]);
 return result;
};Y.Office105Entry163={width:3.2,height:4.1,bottom:.035,back:-1.5,centralLeafCount:2,sideUnitsOpenabilityVerified:false};
})(YY);
