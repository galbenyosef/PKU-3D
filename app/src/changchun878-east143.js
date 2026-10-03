/* Photograph fit of the eastern north-facade units of 56楼.
 * Six-floor height is retained; only upper five room rows and staggered stair
 * windows are registered. Ground entrances and other units remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M;
function layout(f){
 const west=Y.Changchun878North141.layout(f),middle=Y.Changchun878Middle142.layout(f),ret=Y.Changchun878Return139.layout(f),fr=west.fr,L=fr.L,vx=west.registration.vx,project=x=>L*(x-245)/(vx-x)*(vx-873)/628,left=fr.local([ret.wing[0][0],0,ret.wing[0][1]])[0],right=middle.left,bandLeft=project(325),bandRight=project(363),stairs=[(bandLeft+bandRight)/2],widths=[bandRight-bandLeft],fh=14.45/6;
 // Three matched pale-band boundaries solve u=(a*x+b)/(c*x+1).
 // Fourth boundary is deliberately held out to test registration.
 const controls=[[195,bandLeft],[290,bandRight],[587,right]],rows=controls.map(([x,u])=>[x,1,-u*x,u]);
 for(let i=0;i<3;i++){const d=rows[i][i];for(let j=i;j<4;j++)rows[i][j]/=d;for(let k=0;k<3;k++)if(k!==i){const m=rows[k][i];for(let j=i;j<4;j++)rows[k][j]-=m*rows[i][j];}}
 const coefficients=rows.map(r=>r[3]),map=x=>(coefficients[0]*x+coefficients[1])/(coefficients[2]*x+1),fourth={x:687,expected:project(519),actual:map(687)},windowEdges=[[74,112],[132,170],[308,346],[383,423],[461,499],[541,573]],axes=windowEdges.map(e=>(map(e[0])+map(e[1]))/2),windowWidths=windowEdges.map(e=>map(e[1])-map(e[0])),panels=[[112,145],[387,427],[461,499]].map(e=>e.map(map)),windows=[];
 for(let level=1;level<6;level++){const y=.55+fh*(level+.52);axes.forEach((u,column)=>windows.push({u,y,w:windowWidths[column],h:1.5,kind:'room',column,level}));windows.push({u:stairs[0],y:y-fh*.45,w:1.0,h:.95,kind:'stair',level});}
 return{fr,stairs,widths,sw:widths[0],left,right,roomLeft:bandRight,roomRight:right,roomSegments:[[left,bandLeft],[bandRight,right]],windows,panels,low:2.6,high:14.7,fh,registration:{controls,coefficients,fourth,vx,windowEdges,axes,windowWidths,panels}};
}

function split(poly,axis,value,sign){const inside=[],outside=[],d=v=>sign*(v.q[axis]-value);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);(da>=0?inside:outside).push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db),mix=k=>a[k].map((v,j)=>v+(b[k][j]-v)*t),v={q:mix('q'),p:mix('p'),lp:mix('lp'),n:mix('n'),uv:mix('uv')};inside.push(v);outside.push(v);}}return{inside,outside};}
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

A.render=function(b,f,add){if(f.properties.pickId!==878||f.properties.id!=='way/849765901')return prior.call(this,b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=old;}const q=layout(f),fr=q.fr,cut={min:[q.left,q.low,-.4],max:[q.right,q.high,.6]};let changed=0,boundaryWindowRecordsRemoved=0;
 for(const r of rows){
  if(r.k.startsWith('changchun878-return139-')&&!r.k.endsWith('-walls')&&!r.k.includes('-trim-')){old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);continue;}
  if((r.k.startsWith('changchun878-north141-')||r.k.startsWith('changchun878-middle142-'))&&!r.k.includes('-retained-')){old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);continue;}
  // A photographed band boundary can cross an old placeholder light. Remove
  // that entire light/frame, including the residual outside the fitted unit;
  // the unchanged original solid wall remains behind that narrow margin.
  if(r.p[0]===5||r.p[0]===9){const ps=Array.from({length:r.g.v.length/8},(_,i)=>fr.local(M.apply(r.m,[r.g.v[i*8],r.g.v[i*8+1],r.g.v[i*8+2],1]).slice(0,3))),lo=[0,1,2].map(i=>Math.min(...ps.map(p=>p[i]))),hi=[0,1,2].map(i=>Math.max(...ps.map(p=>p[i])));if(hi[0]-lo[0]<4&&lo[1]>=q.low&&hi[1]<=q.high&&lo[2]>-.4&&hi[2]<.6&&[q.left,q.right].some(u=>lo[0]<u&&hi[0]>u)){boundaryWindowRecordsRemoved++;continue;}}
  const minY=Math.min(...Array.from({length:r.g.v.length/8},(_,i)=>M.apply(r.m,[r.g.v[i*8],r.g.v[i*8+1],r.g.v[i*8+2],1])[1]));const g=minY>=14.6999?null:cutRecord(r,fr,[cut]);if(g){changed++;if(g.v.length)old.call(b.e,'changchun878-east143-retained-'+changed,g,r.m,r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 const groups=new Map(),get=(key,c,mat)=>{if(!groups.has(key))groups.set(key,{g:new G.Geometry(),c,mat});return groups.get(key).g;},red='#a86857',pale='#d0cec2',holes=q.windows.map(w=>({min:[w.u-w.w/2,w.y-w.h/2,-1],max:[w.u+w.w/2,w.y+w.h/2,1]}));
 function rect(key,c,u0,u1,y0,y1){if(y1<=y0||u1<=u0)return;const g=new G.Geometry().quad(fr.world(u0,y0,0),fr.world(u1,y0,0),fr.world(u1,y1,0),fr.world(u0,y1,0)),out=cutRecord({g,m:M.identity()},fr,holes)||g;get(key,c,c===red?27:24).v.push(...out.v);}
 // Partition surfaces, rather than overlaying colored panels on existing walls.
 q.stairs.forEach((u,i)=>rect('stair-wall',pale,u-q.widths[i]/2,u+q.widths[i]/2,q.low,q.high));
 for(const[roomLeft,roomRight]of q.roomSegments){let last=q.low;for(let level=1;level<6;level++){const y=.55+q.fh*(level+.52),lo=y-.75,hi=y+.75;rect('red-wall',red,roomLeft,roomRight,last,lo);rect('window-band',pale,roomLeft,roomRight,lo,hi);last=hi;}rect('red-wall',red,roomLeft,roomRight,last,q.high);}
 // Pale blocks read from the eastern image, including the terminal pair.
 // These local pixel intervals are not inherited from either prior unit.
 const panelCuts=[];for(let level=1;level<6;level++){const y=.55+q.fh*(level+.52);for(const[a,b]of q.panels)panelCuts.push({min:[a,Math.max(q.low,y-1.25),-1],max:[b,y-.75,1]});}
 const rg=get('red-wall',red,27),trim=cutRecord({g:rg,m:M.identity()},fr,panelCuts);if(trim)rg.v=trim.v;for(const p of panelCuts)rect('under-window',pale,p.min[0],p.max[0],p.min[1],p.max[1]);
 const box=(g,u,y,d,w,h,t)=>{const bg=G.box();for(let i=0;i<bg.v.length;i+=8){const v=bg.v,base=fr.world(0,0,0),n=fr.world(v[i+3],v[i+4],v[i+5]).map((v,j)=>v-base[j]);g.vertex(fr.world(u+v[i]*w,y+v[i+1]*h,d+v[i+2]*t),n,v.slice(i+6,i+8));}};
 for(const w of q.windows){const a=w.u-w.w/2,c=w.u+w.w/2,lo=w.y-w.h/2,hi=w.y+w.h/2,g=get('reveals',pale,24),quad=(...p)=>g.quad(...p.reverse().map(p=>fr.world(...p)));quad([a,lo,0],[a,hi,0],[a,hi,-.18],[a,lo,-.18]);quad([c,hi,0],[c,lo,0],[c,lo,-.18],[c,hi,-.18]);quad([a,hi,0],[c,hi,0],[c,hi,-.18],[a,hi,-.18]);quad([c,lo,0],[a,lo,0],[a,lo,-.18],[c,lo,-.18]);box(get('glass','#546f71',5),w.u,w.y,-.20,w.w,w.h,.04);const fg=get('frames','#d0d2cb',9);for(const s of[-1,1]){box(fg,w.u+s*(w.w/2-.025),w.y,-.13,.05,w.h,.15);box(fg,w.u,w.y+s*(w.h/2-.025),-.13,w.w,.05,.15);}box(fg,w.u,w.y,-.13,.045,w.h,.15);box(fg,w.u,w.y+w.h*.15,-.13,w.w,.035,.15);}
 for(const[k,r]of groups)if(r.g.v.length)old.call(b.e,'changchun878-east143-'+k,r.g,M.identity(),r.c,[r.mat,878,0,0]);return{...result,northEastUnitPhotoFit:true,northEastUnitStairWindowsStaggered:true,entranceVerified:false,northEastUnitTrimmed:changed,northEastBoundaryWindowRecordsRemoved:boundaryWindowRecordsRemoved};};Y.Changchun878East143={layout};
})(YY);
