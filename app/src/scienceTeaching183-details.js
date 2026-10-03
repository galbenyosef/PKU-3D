/* West recessed entry matched to the asymmetric outline and original photographs.
 * Registration is an inference; heights/depths are photo fits, not a survey.
 * The lower doorway is intentionally not divided into unverified door leaves. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/444991872';
function frame(){const centre=[232.781,182.885],r=-Math.atan2(8.128,.368),c=Math.cos(r),s=Math.sin(r);return{centre,r,local:p=>[(p[0]-centre[0])*c-(p[2]-centre[1])*s,p[1],(p[0]-centre[0])*s+(p[2]-centre[1])*c],world:(u,y,v)=>[centre[0]+c*u+s*v,y,centre[1]-s*u+c*v]};}
const cuts=[{min:[-4.06,.08,-5.0],max:[4.06,23.0,5.5]}];
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

function entry(b,fr){const old=b.id;b.id=183;
 const box=(key,x,y,z,w,h,d,c,mat=29)=>b.mesh('s183-'+key,b.geo('s183-box',G.box),x,y,z,w,h,d,c,mat);
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  const C={brick:'#969b98',frame:'#4f6064',glass:'#648b9b',stone:'#b9bdb5'};
  // The central glass link is lower than the two flanking wings. The local
  // removal reaches BOTH the generic footprint and the legacy solid wing.
  for(const s of[-1,1])box('reveal',s*4.115,9.36,-2.0,.11,18.56,6.0,C.brick,18);
  box('link-roof',0,18.72,-2.0,8.12,.22,6.0,'#aeb6b3',29);
  box('curtain-glass',0,11.68,-.04,8.12,13.74,.08,C.glass,28);
  for(let i=0;i<=8;i++)box('curtain-mullion',-4.06+i*1.015,11.67,.035,.045,13.78,.09,C.frame);
  for(const y of[4.80,8.24,11.68,15.12,18.55])box('curtain-transom',0,y,.035,8.14,.055,.09,C.frame);
  // Real recess: no material across the approach before the dark back plane.
  box('vestibule-back',0,3.08,-4.5,8.12,3.44,.08,'#303b3d',20);
  box('vestibule-ceiling',0,4.77,-2.24,8.12,.12,4.50,'#7a8582',29);
  for(const s of[-1,1])box('entry-jamb',s*3.98,3.09,-.02,.10,3.38,.18,C.frame);
  box('entry-head',0,4.77,-.02,8.04,.10,.18,C.frame);
  // Broad stair approach and upper landing seen in both independent photos.
  box('landing',0,.69,.64,12.6,1.38,2.0,C.stone,10);
  for(let i=0;i<11;i++){const h=(11-i)*1.38/11,z=1.8+i*.33;box('stair',0,h/2,z,12.6,h,.34,C.stone,10);}
  for(const s of[-1,1]){
   for(let i=0;i<=5;i++){const z=1.50+i*.70,y=1.38-Math.max(0,z-1.60)*1.38/3.63;box('rail-post',s*6.10,y+.46,z,.055,.92,.055,C.frame);}
   b.beam([s*6.10,2.34,1.42],[s*6.10,1.01,5.17],.06,C.frame,29);
   b.beam([s*6.10,1.84,1.42],[s*6.10,.51,5.17],.04,C.frame,29);
  }
  // Thin glass planes on six projecting metal ribs. Three paired hanging
  // rods attach high on the curtain-wall frame, never freestanding pillars.
  box('canopy-glass',0,5.32,1.61,9.5,.055,3.42,'#86a4a4',5);
  for(const x of[-4.75,-2.85,-.95,.95,2.85,4.75])box('canopy-rib',x,5.20,1.61,.095,.22,3.46,C.frame);
  for(const z of[-.10,1.03,2.16,3.32])box('canopy-crossbeam',0,5.21,z,9.60,.16,.10,C.frame);
  for(const x of[-2.85,0,2.85])for(const dx of[-.90,.90])b.beam([x,8.5,.025],[x+dx,5.40,3.15],.044,'#6a797b',29);
 });}finally{b.id=old;}
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);
 const old=b.e.add,oldEntry=b.entry,oldLettering=b.lettering,oldAdapter=Y.ArchitectureAdapter.render,rows=[];
 // Preserve the unchanged legacy fit, including the bounds formerly occupied
 // by its removed canopy. Otherwise removing an entry rescales the whole wing.
 Y.ArchitectureAdapter.render=function(bb,ff,method,source,options){return oldAdapter(bb,ff,method,source,ff.properties.id===ID?{...options,sourceFrame:{w:110.70000076293946,d:90.17999882996082,centre:[0,.9099998697638512]}}:options);};
 b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};
 // Remove only the unsubstantiated south entrance generated by this target's
 // old method. Its surrounding walls are retained, without a blind south hole.
 b.entry=function(){};b.lettering=function(){};
 let result;try{result=previous(b,f,add);}finally{b.e.add=old;b.entry=oldEntry;b.lettering=oldLettering;Y.ArchitectureAdapter.render=oldAdapter;}
 const fr=frame();let changed=0;
 for(let i=0;i<rows.length;i++){const r=rows[i],g=cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'s183-cut-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 entry(b,fr);return{...result,westEntryPhotoFitted:true,entryCutRecords:changed,doorLeavesUnverified:true,registration:'asymmetric-west-notch-inference'};
};
Y.ScienceTeaching183Details={id:ID,frame,cuts};
})(YY);
