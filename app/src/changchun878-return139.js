/* 56 northeast return: satellite-relative plan and 2016 six-level street view.
 * Roof-to-ground registration, height and new window axes are proportional fits.
 * No entrance is inferred; the original source feature is not mutated. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,F=Y.Footprints,G=Y.Geo,M=Y.M;
function layout(f){const r=f.geometry.coordinates[0],a=r[1],L=Math.hypot(r[1][0]-r[0][0],r[1][1]-r[0][1]),east=[(r[1][0]-r[0][0])/L,(r[1][1]-r[0][1])/L],north=[east[1],-east[0]],p=(u,v)=>[a[0]+east[0]*u+north[0]*v,a[1]+east[1]*u+north[1]*v];
 const J=p(-2,0),NW=p(-2,14.5),NE=p(10,14.5),SE=p(10,-3.5),t=3.5/Math.hypot(r[2][0]-a[0],r[2][1]-a[1]),K=[a[0]+(r[2][0]-a[0])*t,a[1]+(r[2][1]-a[1])*t],ring=[r[0],J,NW,NE,SE,K,r[2],r[3],r[0]],g={type:'Polygon',coordinates:[ring]},wing=[J,NW,NE,SE,K];
 return{g,ring,wing,origin:a,east,north,height:15,local:p=>[(p[0]-a[0])*east[0]+(p[2]-a[1])*east[1],p[1],(p[0]-a[0])*north[0]+(p[2]-a[1])*north[1]],world:(u,y,v)=>{const q=p(u,v);return[q[0],y,q[1]];}};}
function split(poly,axis,value,sign){const inside=[],outside=[],d=v=>sign*(v.q[axis]-value);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);if(da>=0)inside.push(a);if(da<=0)outside.push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db),mix=k=>a[k].map((v,j)=>v+(b[k][j]-v)*t),v={q:mix('q'),p:mix('p'),lp:mix('lp'),n:mix('n'),uv:mix('uv')};inside.push(v);outside.push(v);}}return{inside,outside};}
function difference(poly,box){if([0,1,2].some(i=>Math.max(...poly.map(v=>v.q[i]))<=box.min[i]||Math.min(...poly.map(v=>v.q[i]))>=box.max[i]))return{parts:[poly],changed:false};let rest=poly,parts=[];for(let i=0;i<3;i++)for(const[v,sign]of[[box.min[i],1],[box.max[i],-1]]){const q=split(rest,i,v,sign);if(q.outside.length>=3)parts.push(q.outside);rest=q.inside;if(rest.length<3)return{parts:[poly],changed:false};}return{parts,changed:true};}
function cutRecord(r,fr,cuts){const v=r.g.v,triangles=[],g=new G.Geometry();let changed=false;
 for(let i=0;i<v.length;i+=24){let polys=[[]];for(let j=0;j<3;j++){const k=i+j*8,lp=[v[k],v[k+1],v[k+2]],p=M.apply(r.m,[...lp,1]).slice(0,3),n=[v[k+3],v[k+4],v[k+5]];polys[0].push({p,lp,n,q:fr.local(p),uv:[v[k+6],v[k+7]]});}
  for(const box of cuts){const next=[];for(const p of polys){const q=difference(p,box);changed ||= q.changed;next.push(...q.parts);}polys=next;}
  triangles.push(...polys);
 }
 if(!changed)return null;
 for(const p of triangles)for(let j=1;j+1<p.length;j++){const t=[p[0],p[j],p[j+1]],a=M.sub(t[1].p,t[0].p),b=M.sub(t[2].p,t[0].p);if(Math.hypot(...M.cross(a,b))<1e-9)continue;for(const v of t)g.vertex(v.lp,v.n,v.uv);}
 if(r.g.detailWidth)g.detailWidth=r.g.detailWidth;return g;
}

A.render=function(b,f,add){if(f.properties.pickId!==878||f.properties.id!=='way/849765901')return prior.call(this,b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=old;}const q=layout(f),windows=[],faces=[],sign=Math.sign(F.area(q.ring));
 for(let i=0;i<4;i++){const a=q.wing[i],c=q.wing[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,nx=uz*sign,nz=-ux*sign,fr={local:p=>[(p[0]-a[0])*ux+(p[2]-a[1])*uz,p[1],(p[0]-a[0])*nx+(p[2]-a[1])*nz],world:(u,y,d)=>[a[0]+u*ux+d*nx,y,a[1]+u*uz+d*nz]},count=i<2?2:Math.max(2,Math.floor(len/4.4)),ws=[];
  for(let level=0;level<6;level++)for(let k=0;k<count;k++){const u=i===1?len*(.24+k*.18):i===0?len*(.28+k*.47):(k+.5)*len/count,y=.55+(15-.55)/6*(level+.52),w=i===1?len*.14:Math.min(2.3,len/count*.55),h=1.5;const v={fr,u,y,w,h,face:i};ws.push(v);windows.push(v);}faces.push({fr,ws});
 }
 let walls=F.walls(q.g,.3,15);for(const{fr,ws}of faces){const cuts=ws.map(w=>({min:[w.u-w.w/2,w.y-w.h/2,-.10],max:[w.u+w.w/2,w.y+w.h/2,.10]}));walls=cutRecord({g:walls,m:M.identity()},fr,cuts)||walls;}
 const mainWalls=new G.Geometry(),returnWalls=new G.Geometry();for(let i=0;i<walls.v.length;i+=24){const ps=[0,8,16].map(j=>walls.v.slice(i+j,i+j+3)),isReturn=faces.some(({fr})=>ps.every(p=>Math.abs(fr.local(p)[2])<.0002));(isReturn?returnWalls:mainWalls).v.push(...walls.v.slice(i,i+24));}

 const copingPlan=[[-2.05,-.37],[-1.63,-.37],[-1.63,14.13],[10,14.13],[10,14.55],[-2.05,14.55],[-2.05,-.37]].map(([u,v])=>{const p=q.world(u,0,v);return[p[0],p[2]];}),coping={type:'Polygon',coordinates:[copingPlan]};
 let removed=0;for(const r of rows){if(r.k.startsWith('v30-walls-878-')){old.call(b.e,'changchun878-return139-walls',mainWalls,r.m,r.c,r.p,r.uv);old.call(b.e,'changchun878-return139-return-wall',returnWalls,r.m,'#a86857',[27,878,0,0],r.uv);continue;}if(r.k.startsWith('v30-plinth-878-')){old.call(b.e,'changchun878-return139-plinth',F.walls(q.g,.03,.30),r.m,r.c,r.p,r.uv);continue;}if(r.k.startsWith('v30-flat-roof-878-')){old.call(b.e,'changchun878-return139-roof',F.surface(q.g,15),r.m,r.c,r.p,r.uv);continue;}
  // Remove/clip only details occupying the formerly exposed junction surfaces.
  const cut={min:[-2.05,-1,-3.7],max:[11,16,.55]},g=cutRecord(r,q,[cut]);if(g){removed++;if(g.v.length)old.call(b.e,'changchun878-return139-trim-'+removed,g,r.m,r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);
 }
 old.call(b.e,'changchun878-return139-coping-wall',F.walls(coping,15,15.695),M.identity(),'#d0cec2',[24,878,0,0]);
 old.call(b.e,'changchun878-return139-coping-cap',F.walls(coping,15.695,15.825),M.identity(),'#cbd0c2',[24,878,0,0]);
 old.call(b.e,'changchun878-return139-coping-top',F.surface(coping,15.825),M.identity(),'#cbd0c2',[24,878,0,0]);
 const stone=new G.Geometry(),glass=new G.Geometry(),palePanels=new G.Geometry(),frames=new G.Geometry(),unseenFrames=new G.Geometry(),box=(g,fr,u,y,d,w,h,t)=>{const bg=G.box(),base=fr.world(0,0,0),axis=(x,y,z)=>fr.world(x,y,z).map((v,j)=>v-base[j]),mirrored=M.dot(M.cross(axis(1,0,0),axis(0,1,0)),axis(0,0,1))<0;/* A reflected facade basis reverses winding; keep the outward normals and UVs with each vertex. */for(let triangle=0;triangle<bg.v.length;triangle+=24)for(const offset of mirrored?[0,16,8]:[0,8,16]){const i=triangle+offset,v=bg.v,p=fr.world(u+v[i]*w,y+v[i+1]*h,d+v[i+2]*t),nx=fr.world(v[i+3],v[i+4],v[i+5]).map((v,j)=>v-base[j]);g.vertex(p,nx,v.slice(i+6,i+8));}};
 for(const w of windows){const{fr,u,y}=w,fg=w.face<2?frames:unseenFrames,a=u-w.w/2,c=u+w.w/2,lo=y-w.h/2,hi=y+w.h/2,quad=(...ps)=>stone.quad(...ps.map(p=>fr.world(...p)));quad([a,lo,0],[a,lo,-.18],[a,hi,-.18],[a,hi,0]);quad([c,lo,-.18],[c,lo,0],[c,hi,0],[c,hi,-.18]);quad([a,lo,0],[c,lo,0],[c,lo,-.18],[a,lo,-.18]);quad([a,hi,-.18],[c,hi,-.18],[c,hi,0],[a,hi,0]);box(glass,fr,u,y,-.20,w.w,w.h,.04);for(const s of[-1,1]){box(fg,fr,u+s*(w.w/2-.025),y,-.13,.05,w.h,.15);box(fg,fr,u,y+s*(w.h/2-.025),-.13,w.w,.05,.15);}box(fg,fr,u,y,-.13,.045,w.h,.15);}
 // Visible north-end concrete pier and short spandrels; retain broad red blind wall.
 for(const w of windows.filter(w=>w.face===1)){const fh=14.45/6;box(palePanels,w.fr,w.u,w.y+w.h/2+.065,.012,w.w+.12,.13,.024);if(w.u<4)box(palePanels,w.fr,w.u,w.y-w.h/2-(fh-w.h)/2,.012,w.w,fh-w.h,.024);}
 const nf=faces[1].fr;box(palePanels,nf,12*.33,7.65,.012,12*.04,14.7,.024);
 for(const[k,g,c,mat]of[['north-panels',palePanels,'#d0cec2',24],['reveals',stone,'#dddcd1',18],['glass',glass,'#546f71',5],['frames',frames,'#d0d2cb',9],['unseen-frames',unseenFrames,'#596b66',9]])old.call(b.e,'changchun878-return139-'+k,g,M.identity(),c,[mat,878,0,0]);
 return{...result,northeastReturnVerified:true,northeastReturnDimensionsFitted:true,sourceFootprintPreserved:false,sourceOutline:false,sourceFeatureUnchanged:true,entranceVerified:false,returnWindowAxesFitted:true,junctionDetailsTrimmed:removed};};Y.Changchun878Return139={layout};
})(YY);
