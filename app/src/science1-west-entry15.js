/* Science 1 west-south entrance. Registered from continuous Baidu
 * 2013-09-20 panoramas and PKU 2023 welcome photo. Dimensions are photograph
 * fits, not survey measurements; door leaf count/hardware remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='relation/13059307';
function frame(){const centre=[235.604,310.5],r=-Math.PI/2+Math.atan2(.854,15.411),c=Math.cos(r),s=Math.sin(r);return{centre,r,local:p=>[(p[0]-centre[0])*c-(p[2]-centre[1])*s,p[1],(p[0]-centre[0])*s+(p[2]-centre[1])*c],world:(u,y,v)=>[centre[0]+c*u+s*v,y,centre[1]-s*u+c*v]};}
const cuts=[{min:[-5.35,.53,-3],max:[5.35,4.06,.65]}];
function split(poly,axis,value,sign){const inside=[],outside=[],d=v=>sign*(v.q[axis]-value);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);(da>=0?inside:outside).push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db),mix=k=>a[k].map((v,j)=>v+(b[k][j]-v)*t),v={q:mix('q'),p:mix('p'),n:mix('n'),uv:mix('uv')};inside.push(v);outside.push(v);}}return{inside,outside};}
function difference(poly,box){if([0,1,2].some(i=>Math.max(...poly.map(v=>v.q[i]))<=box.min[i]||Math.min(...poly.map(v=>v.q[i]))>=box.max[i]))return{parts:[poly],changed:false};let rest=poly,parts=[];for(let i=0;i<3;i++)for(const[v,sign]of[[box.min[i],1],[box.max[i],-1]]){const q=split(rest,i,v,sign);if(q.outside.length>=3)parts.push(q.outside);rest=q.inside;if(rest.length<3)return{parts:[poly],changed:false};}return{parts,changed:true};}
function cutRecord(r,fr,cuts){const v=r.g.v,inv=M.inverse(r.m),triangles=[],g=new G.Geometry();let changed=false;
 for(let i=0;i<v.length;i+=24){let polys=[[]];for(let j=0;j<3;j++){const k=i+j*8,p=M.apply(r.m,[v[k],v[k+1],v[k+2],1]).slice(0,3),n=M.norm([inv[0]*v[k+3]+inv[1]*v[k+4]+inv[2]*v[k+5],inv[4]*v[k+3]+inv[5]*v[k+4]+inv[6]*v[k+5],inv[8]*v[k+3]+inv[9]*v[k+4]+inv[10]*v[k+5]]);polys[0].push({p,n,q:fr.local(p),uv:[v[k+6],v[k+7]]});}
  for(const box of cuts){const next=[];for(const p of polys){const q=difference(p,box);changed ||= q.changed;next.push(...q.parts);}polys=next;}
  triangles.push(...polys);
 }
 if(!changed)return null;
 for(const p of triangles)for(let j=1;j+1<p.length;j++){const t=[p[0],p[j],p[j+1]],a=M.sub(t[1].p,t[0].p),b=M.sub(t[2].p,t[0].p);if(Math.hypot(...M.cross(a,b))<1e-9)continue;for(const v of t)g.vertex(v.p,M.norm(v.n),v.uv);}
 if(r.g.detailWidth)g.detailWidth=r.g.detailWidth;return g;
}

function entry(b,fr){const old=b.id;b.id=15;
const box=(key,x,y,z,w,h,d,c='#c8c9c1',mat=24)=>b.mesh('s15-west-'+key,b.geo('s15-west-box',G.box),x,y,z,w,h,d,c,mat);
try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
 box('landing',0,.27,.5,12.0,.54,2.2);
 for(let i=0;i<3;i++){const h=.54-i*.18;box('step-'+i,0,h/2,1.75+i*.38,12.0,h,.4);}
 box('canopy',0,4.25,1.1,12.1,.42,3.3);
 box('canopy-fascia',0,4.25,2.77,12.15,.5,.12,'#b9bcb6');
 // Two rectangular piers carry the flat slab in the original photos.
 for(const sign of[-1,1])box('pier-'+sign,sign*3.75,2.3,1.45,.64,3.54,.72);
 box('recess-floor',0,.27,-1.42,10.7,.54,2.85);
 box('recess-ceiling',0,4.1,-1.45,10.7,.10,3.1);
 for(const sign of[-1,1])box('reveal-'+sign,sign*5.39,2.3,-1.45,.08,3.54,3.1);
 box('recess-back',0,2.3,-2.91,10.7,3.54,.08,'#343e3d',20);
 // The original close view shows narrow metal uprights below the transom;
 // fit visible door-frame rhythm, without claiming measured leaf count/hardware.
 for(const x of[-1.7,0,1.7])box('door-upright-'+x,x,1.89,-.735,.075,2.65,.10,'#a4aaa6',29);
 box('central-glass',0,2.20,-.82,6.8,3.3,.045,'#435b61',5);
 for(const sign of[-1,1]){
  box('stone-jamb-'+sign,sign*3.58,2.30,-.75,.36,3.54,.28);
  box('side-glass-'+sign,sign*4.63,2.20,-.82,1.60,3.3,.045,'#435b61',5);
  for(const x of[sign*3.43,sign*5.30])box('side-frame-'+x,x,2.2,-.77,.07,3.3,.08,'#a4aaa6',29);
 }
 for(const y of[.59,3.22,3.83])box('central-horizontal-'+y,0,y,-.765,6.85,.075,.09,'#a4aaa6',29);
 for(const sign of[-1,1])box('central-jamb-'+sign,sign*3.39,2.2,-.765,.07,3.3,.09,'#a4aaa6',29);
 });}finally{b.id=old;}}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const old=b.e.add,oldEntry=b.entry,oldAdapter=Y.ArchitectureAdapter.render,rows=[];
 // Lock the original roof/body fit while removing its speculative south entry.
 Y.ArchitectureAdapter.render=function(bb,ff,method,source,options){return oldAdapter(bb,ff,method,source,ff.properties.id===ID?{...options,sourceFrame:{w:115.93600010871887,d:115.93600010871887,centre:[0,0]}}:options);};
 b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};b.entry=function(){};
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;b.entry=oldEntry;Y.ArchitectureAdapter.render=oldAdapter;}
 const fr=frame();let changed=0;
 for(let i=0;i<rows.length;i++){const r=rows[i],g=cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'s15-west-cut-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 entry(b,fr);return{...result,westSouthEntryPhotoFitted:true,entryCutRecords:changed,doorLeavesUnverified:true,wholeBuildingComplete:false};
};Y.Science1WestEntry15={id:ID,frame,cuts,registration:'Baidu 20130920 continuous positions and 2023 PKU photo; edge 3 to 4',wholeBuildingComplete:false};
const feature=Y.CAMPUS?.features.find(f=>f.properties.id===ID);if(feature){const fr=frame();feature.properties.frontObservation46={target:[235.604,2.5,310.5],bounds:[234.4,.45,306.8,236.8,4.55,314.2],yaw:fr.r,elevation:.16};}
})(YY);
