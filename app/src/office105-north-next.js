/* Museum sony006 north entry: fitted one bay, no change to west entry or south face. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
function split(p,axis,value,sign){const yes=[],no=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=(a.q[axis]-value)*sign,db=(b.q[axis]-value)*sign;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function cut(g,tr,lo,hi){const out=new G.Geometry();let changed=false;for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>({v:Array.from(g.v.slice(i+j,i+j+8)),q:M.apply(tr,[...g.v.slice(i+j,i+j+3),1]).slice(0,3)})),parts=[];
 for(let axis=0;axis<3;axis++)for(const[v,s]of[[lo[axis],1],[hi[axis],-1]]){if(rest.length<3)continue;const q=split(rest,axis,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}
 const hit=rest.length>=3&&Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))>1e-9;
 if(!hit){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;
 for(const p of parts)for(let j=1;j+1<p.length;j++){const vs=[p[0],p[j],p[j+1]];if(Math.hypot(...M.cross(M.sub(vs[1].v.slice(0,3),vs[0].v.slice(0,3)),M.sub(vs[2].v.slice(0,3),vs[0].v.slice(0,3))))>1e-10)out.v.push(...vs[0].v,...vs[1].v,...vs[2].v);}
 }if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return{g:changed?out:g,changed};}
function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();g.quad(...p);}
function box(g,x,y,z,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8)g.v.push(x+raw.v[i]*w,y+raw.v[i+1]*h,z+raw.v[i+2]*d,...raw.v.slice(i+3,i+8));}
const C={centre:[-303.98405,-180.6908],angle:.015488602403984619,width:3.0,bottom:2.2332448720932007,top:5.96,platform:1.6332448720932007,platformFront:1.1375990886738236,back:-.82,stairAxis:5.012,roadY:.12,smallSteps:3,largeSteps:8,toeExtension:.06,measured:false};
const u=[-Math.cos(C.angle),Math.sin(C.angle)],n=[-Math.sin(C.angle),-Math.cos(C.angle)];
function matrix(){return new Float32Array([u[0],0,u[1],0,0,1,0,0,n[0],0,n[1],0,C.centre[0],0,C.centre[1],1]);}
function build(){const parts={};const geo=k=>parts[k]||(parts[k]=new G.Geometry());const z=.04;
 function line(g,a,b,w=.025,depth=.055,zz=.105){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<1e-7)return;const nx=-dy/len*w/2,ny=dx/len*w/2,p=[[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]];face(g,p.map(q=>[...q,zz+depth/2]),[0,0,1]);face(g,p.map(q=>[...q,zz-depth/2]),[0,0,-1]);for(let i=0;i<4;i++){const a=p[i],b=p[(i+1)%4];face(g,[[...a,zz-depth/2],[...b,zz-depth/2],[...b,zz+depth/2],[...a,zz+depth/2]],[b[1]-a[1],a[0]-b[0],0]);}}
 function clipped(x,y,dx,dy,lo,hi){let a=-100,b=100;for(let j=0;j<2;j++){const q=j?y:x,v=j?dy:dx;if(Math.abs(v)<1e-10){if(q<lo[j]||q>hi[j])return;}else{const p=(lo[j]-q)/v,r=(hi[j]-q)/v;a=Math.max(a,Math.min(p,r));b=Math.min(b,Math.max(p,r));}}if(b>a)line(geo('lattice'),[x+a*dx,y+a*dy],[x+b*dx,y+b*dy],.022,.052);}
 function lattice(a,b,low,high){const dx=.175,dy=dx/Math.sqrt(3),lo=[a+.016,low+.016],hi=[b-.016,high-.016],centre=(a+b)/2;for(let k=-16;k<=16;k++)clipped(centre+k*dx,low,0,1,lo,hi);for(const s of[-1,1])for(let k=-30;k<=30;k++)clipped(centre,low+k*2*dy,1,s/Math.sqrt(3),lo,hi);box(geo('glass'),centre,(low+high)/2,-.02,b-a,high-low,.018);}
 const edge=[-1.5,-.98,0,.98,1.5],base=C.bottom,H=C.top;
 for(let i=0;i<4;i++){const l=edge[i]+.012,r=edge[i+1]-.012,a=l+.065,b=r-.065,centre=(a+b)/2;
  for(const x of[l+.0325,r-.0325])box(geo('frames'),x,(base+H)/2,z,.065,H-base,.14);
  const central=i===1||i===2,bands=[[base,base+.14],[base+.83,base+.95],[base+1.13,base+1.25],[H-.12,H]];if(central)bands.push([H-.69,H-.56]);
  for(const [low,high]of bands)box(geo('frames'),centre,(low+high)/2,z,b-a,high-low,.14);
  for(const [low,high]of[[base+.14,base+.83],[base+.95,base+1.13]])box(geo('panels'),centre,(low+high)/2,z,b-a,high-low,.10);
  if(central){lattice(a,b,base+1.25,H-.69);lattice(a,b,H-.56,H-.12);}else lattice(a,b,base+1.25,H-.12);
  // Two visible lower scrolls, fitted simple relief; not an invented emblem.
  for(const s of[-1,1]){let prev;for(let j=0;j<=28;j++){const t=j/28,angle=s*(.3*Math.PI+t*1.6*Math.PI),radius=(b-a)*(.19-.11*t),p=[centre+s*(b-a)*.17+Math.cos(angle)*radius,base+.47+Math.sin(angle)*radius];if(prev)line(geo('relief'),prev,p,.026,.027,.105);prev=p;}}
 }
 box(geo('hardware'),.07,base+1.06,.16,.025,.29,.06);
 const room=geo('returns');face(room,[[-1.5,base,C.back],[1.5,base,C.back],[1.5,H,C.back],[-1.5,H,C.back]],[0,0,1]);
 for(const s of[-1,1])face(room,[[s*1.5,base,C.back],[s*1.5,H,C.back],[s*1.5,H,.12],[s*1.5,base,.12]],[-s,0,0]);face(room,[[-1.5,H,C.back],[-1.5,H,.12],[1.5,H,.12],[1.5,H,C.back]],[0,-1,0]);
 box(geo('threshold'),0,base-.06,(C.back+.18)/2,3.0,.12,.18-C.back);
 // Existing terrace stays; these three shallow treads bridge it to the door.
 for(let i=0;i<3;i++){const top=C.platform+(3-i)*.2,front=.18+(i+1)*.31;box(geo('small-steps'),0,(C.platform+top)/2,front-.155,3.15,top-C.platform,.31);}
 // Small tread side returns are finite step sides, without inferred additional high parapets.
 const start=C.platformFront,roadEdgeZ=-183.995,axis=C.stairAxis,nominalToe=(roadEdgeZ-C.centre[1]-u[1]*axis)/n[1],toe=nominalToe+C.toeExtension,run=(nominalToe-start)/8;
 for(let i=0;i<8;i++){const top=C.platform-(C.platform-C.roadY)*i/8;box(geo('large-steps'),axis,(-.02+top)/2,start+(i+.5)*run+(i===7?C.toeExtension/2:0),3.10,top+.02,run+(i===7?C.toeExtension:0));}
 // Existing terrace is the connector. No duplicate coplanar landing is emitted.
 for(const s of[-1,1]){const a=axis+s*(1.55+.14),lo=a-.14,hi=a+.14,p=[[start,-.02],[toe,-.02],[toe,C.roadY+.28],[start,C.platform+.28]],g=geo('large-cheeks');face(g,p.map(([z,y])=>[lo,y,z]),[-1,0,0]);face(g,p.map(([z,y])=>[hi,y,z]),[1,0,0]);for(let i=0;i<4;i++){const a=p[i],b=p[(i+1)%4];const normal=[0,b[0]-a[0],a[1]-b[1]];face(g,[[lo,a[1],a[0]],[hi,a[1],a[0]],[hi,b[1],b[0]],[lo,b[1],b[0]]],normal);}}
 return {parts,toe,frame:matrix()};}
A.render=function(b,f,add){if(f.properties.pickId!==105||f.properties.id!=='way/240832216')return previous.call(this,b,f,add);const old=b.e.add,descriptor=Object.getOwnPropertyDescriptor(b.e,'add'),rows=[];let result;
 Object.defineProperty(b.e,'add',{value:function(...a){rows.push(a);},writable:true,configurable:true,enumerable:descriptor?descriptor.enumerable:true});
 try{result=previous.call(this,b,f,add);}finally{if(descriptor)Object.defineProperty(b.e,'add',descriptor);else delete b.e.add;}
 const built=build(),inv=M.inverse(built.frame);let cuts=0;
 for(const r of rows){if(r[0]==='office105-entry163-cut-0'&&r[4][0]===24){const c=cut(r[1],M.multiply(inv,r[2]),[-1.5,C.bottom,C.back],[1.5,C.top,.35]);if(!c.changed)throw Error('north entry did not intersect inherited body');old.call(b.e,'office105-north-next-cut-body',c.g,r[2],r[3],r[4],r[5]);cuts++;}else old.apply(b.e,r);}
 if(cuts!==1)throw Error('north entry expected one body');
 for(const [k,g]of Object.entries(built.parts)){const stone=['threshold','small-steps','large-steps','landing','large-cheeks'].includes(k),mat=k==='glass'?5:k==='hardware'?29:k==='returns'?24:stone?10:20,color=k==='glass'?'#435653':k==='hardware'?'#b9bcb7':k==='returns'?'#b0b0a3':stone?'#adada2':'#97372b';old.call(b.e,'office105-north-next-'+k,g,built.frame,color,[mat,105,0,.85]);}
 return {...result,northEntryNext:{photo:'museum pano_231010_sony_006',...C,toe:built.toe,onlyNorthBay:true,southUnchanged:true,unknownInterior:true}};
};Y.Office105NorthNext={config:C,build};})(YY);
