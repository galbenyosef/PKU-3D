/* Official Kaiyuan opening photograph: east/north envelope, not a survey.
 * Two large screen bands each have three rows; these do not assert floor counts.
 * North lower gallery is at grade: only the upper two have a glass guard. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/240825569',PREFIX='law102-envelope171-';
const H={base:.4397546947,middle:4.991,third:9.70,screen:(14.55-.215)*.9559884667396545,top:(25.48-.215)*.9559884667396545,splitLow:18.428,splitHigh:19.428,wallFraction:.26};
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a),db=fn(b),ia=da<=0,ib=db<=0;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}return out;}
function subtract(g,m,F,bounds){const out=new G.Geometry();let changed=false;
 for(let i=0;i<g.v.length;i+=24){const raw=[0,8,16].map(j=>Array.from(g.v.slice(i+j,i+j+8))),qs=raw.map(v=>F.local(M.apply(m,[...v.slice(0,3),1])));
  if([0,1,2].some(a=>qs.every(q=>q[a]<bounds[a])||qs.every(q=>q[a]>bounds[a+3]))){out.v.push(...g.v.slice(i,i+24));continue;}
  let inside=raw.map((v,j)=>v.concat(qs[j])),parts=[];
  for(const[a,k,sign]of[[0,bounds[0],1],[0,bounds[3],-1],[1,bounds[1],1],[1,bounds[4],-1],[2,bounds[2],1],[2,bounds[5],-1]]){if(!inside.length)break;const fn=v=>(v[a+8]-k)*sign,ex=clip(inside,fn);if(ex.length>=3&&inside.some(v=>fn(v)<0))parts.push(ex);inside=clip(inside,v=>-fn(v));}
  if(inside.length>=3)changed=true;
  for(const p of parts)for(let j=1;j<p.length-1;j++){const t=[p[0],p[j],p[j+1]].map(v=>v.slice(0,8).map((n,k)=>k<3?Math.fround(n):n)),n=M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0]));if(M.dot(n,n)>1e-18&&M.dot(n,t[0].slice(3,6))>0)for(const v of t)out.v.push(...v);}
 }return changed?out:g;
}
function factory(f,F,other,side){const ring=Y.Footprints.polygons(f.geometry)[0][0].slice(0,-1),area=Y.Footprints.area([...ring,ring[0]]),groups=new Map(),panes=[],supports=[];
 const world=p=>M.apply(F.matrix,[p[0],0,p[1],1]),toOther=p=>other.local(world(p));
 function footprint(rect){let p=[[rect[0],rect[2]],[rect[1],rect[2]],[rect[1],rect[3]],[rect[0],rect[3]]];
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];p=clip(p,q=>{const w=world(q);return -Math.sign(area)*((b[0]-a[0])*(w[2]-a[1])-(b[1]-a[1])*(w[0]-a[0]));});}
  // A distance bisector partitions both complete strips. Corresponding front,
  // back, floor and screen pieces meet at a shared miter rather than overlap.
  p=clip(p,q=>toOther(q)[2]-q[1]);
  p=p.filter((v,i)=>Math.hypot(v[0]-p[(i+1)%p.length][0],v[1]-p[(i+1)%p.length][1])>1e-7);return p;
 }
 function tri(g,a,b,c){const ps=[a,b,c].map(p=>p.map(Math.fround)),n=M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]));if(M.dot(n,n)>1e-16)g.tri(...ps);}
 function solid(name,mat,color,x0,x1,y0,y1,z0,z1){if(x1-x0<1e-7||y1-y0<1e-7||z1-z0<1e-7)return;let p=footprint([x0,x1,z0,z1]);if(p.length<3)return;
  // x/z CCW yields upward normals when triangle order is reversed.
  if(Y.Footprints.area([...p,p[0]])<0)p.reverse();const key=side+'-'+name,g=groups.get(key)?.g||new G.Geometry();groups.set(key,{g,mat,color});
  for(let i=1;i<p.length-1;i++){tri(g,[p[0][0],y1,p[0][1]],[p[i+1][0],y1,p[i+1][1]],[p[i][0],y1,p[i][1]]);tri(g,[p[0][0],y0,p[0][1]],[p[i][0],y0,p[i][1]],[p[i+1][0],y0,p[i+1][1]]);}
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],aa=[a[0],y0,a[1]],bb=[b[0],y0,b[1]],cc=[b[0],y1,b[1]],dd=[a[0],y1,a[1]];tri(g,aa,dd,cc);tri(g,aa,cc,bb);}
 }
 const stone=(name,x0,x1,y0,y1,z0=-.48,z1=0)=>solid(name,24,'#b6b7b1',x0,x1,y0,y1,z0,z1),metal=(name,...q)=>solid(name,9,'#475653',...q);
 function window(name,x0,x1,y0,y1,z=-2.60,columns=1,rows=1){const bar=.065;
  for(let i=0;i<=columns;i++){const x=x0+(x1-x0)*i/columns;metal(name+'-frame',x-bar/2,x+bar/2,y0,y1,z-.07,z+.07);}
  for(let j=0;j<=rows;j++){const y=y0+(y1-y0)*j/rows;metal(name+'-frame',x0,x1,y-bar/2,y+bar/2,z-.07,z+.07);}
  for(let i=0;i<columns;i++)for(let j=0;j<rows;j++){const a=x0+(x1-x0)*i/columns+bar/2-.001,b=x0+(x1-x0)*(i+1)/columns-bar/2+.001,c=y0+(y1-y0)*j/rows+bar/2-.001,d=y0+(y1-y0)*(j+1)/rows-bar/2+.001;solid(name+'-glass',5,'#657c83',a,b,c,d,z-.0175,z+.0175);panes.push({name,x:[a,b],y:[c,d],z,frame:name+'-frame'});}
 }
 function guard(x0,x1,y){const n=Math.ceil((x1-x0)/1.55),bar=.055;
  for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;metal('guard-post',x-bar/2,x+bar/2,y,y+1.14,-.14,-.06);}
  metal('guard-cap',x0,x1,y+1.10,y+1.16,-.145,-.055);metal('guard-foot',x0,x1,y+.04,y+.10,-.145,-.055);
  for(let i=0;i<n;i++){const a=x0+(x1-x0)*i/n+bar/2-.001,b=x0+(x1-x0)*(i+1)/n-bar/2+.001;solid('guard-glass',5,'#839c9c',a,b,y+.095,y+1.105,-.12,-.08);}supports.push({x:[x0,x1],floor:y});
 }
 function gallery(x0,x1,floor,ceiling,rail,reuseBeam=false){if(reuseBeam){stone('gallery-floor-front',x0,x1,floor-.28,floor,-.20,0);stone('gallery-floor-back',x0,x1,floor-.28,floor,-4.2,-4.0);}else stone('gallery-floor',x0,x1,Math.max(0,floor-.48),floor,-4.2,0);
  stone('gallery-back',x0+.28,x1-.28,floor,ceiling,-4.2,-4.0);stone('gallery-end',x0,x0+.28,floor,ceiling,-4,0);stone('gallery-end',x1-.28,x1,floor,ceiling,-4,0);
  const bay=(x1-x0)/3,pier=.60;for(let j=1;j<3;j++){const x=x0+j*bay;stone('gallery-pier',x-pier/2,x+pier/2,floor,ceiling,-2.96,-2.26);}for(let j=0;j<3;j++){const left=x0+j*bay+(j?pier/2:.28),right=x0+(j+1)*bay-(j<2?pier/2:.28);window('gallery',left,right,floor+.032,ceiling-.032,-2.6,Math.max(1,Math.round((right-left)/1.65)),2);}if(rail)guard(x0+.28,x1-.28,floor);
 }
 function upper(){const bottom=H.screen,top=H.top;
  stone('screen-bottom',0,F.length,bottom,bottom+1.20,-4.2,0);stone('screen-middle',0,F.length,H.splitLow,H.splitHigh,-4.2,0);stone('screen-top',0,F.length,top-1.20,top,-4.2,0);
  const ends=.65,n=Math.max(1,Math.round((F.length-ends*2)/1.50)),cw=(F.length-ends*2)/n;
  stone('screen-end',0,ends,bottom+1.20,H.splitLow,-4.2,0);stone('screen-end',F.length-ends,F.length,bottom+1.20,H.splitLow,-4.2,0);stone('screen-end',0,ends,H.splitHigh,top-1.20,-4.2,0);stone('screen-end',F.length-ends,F.length,H.splitHigh,top-1.20,-4.2,0);
  for(const[lo,hi,band]of[[bottom+1.20,H.splitLow,0],[H.splitHigh,top-1.20,1]]){const rh=(hi-lo)/3;stone('screen-back',ends,F.length-ends,lo,hi,-4.2,-4.0);
   for(let j=0;j<3;j++){const y0=lo+j*rh,y1=lo+(j+1)*rh;stone('screen-course',ends,F.length-ends,y0,y0+.045);stone('screen-course',ends,F.length-ends,y1-.045,y1);
    for(let i=0;i<n;i++){const left=ends+i*cw,right=left+cw,flip=(i+j+band)%3===1,edge=.055,gw=cw*.34,wx=flip?left+.19*cw:right-gw-.09*cw;
     stone('screen-panel',left,wx,y0+.045,y1-.045);stone('screen-panel',wx+gw,right,y0+.045,y1-.045);
     window('screen',wx+edge/2,wx+gw-edge/2,y0+.075,y1-.075,-.32);
     // Jambs reach the metal frame; the opening is real through the stone.
     stone('screen-reveal',wx,wx+.035,y0+.045,y1-.045);stone('screen-reveal',wx+gw-.035,wx+gw,y0+.045,y1-.045);
    }
   }
  }
 }
 function slitWall(x0,x1){const levels=[H.base,H.middle,H.third,H.screen],n=3,centers=Array.from({length:n},(_,i)=>x0+(i+.5)*(x1-x0)/n),w=.56;stone('lower-base',x0,x1,0,H.base,-4.2,0);
  for(let j=0;j<3;j++){const y0=levels[j],y1=levels[j+1],low=y0+.70,high=y1-.68;stone('lower-course',x0,x1,y0,low,-4.2,0);stone('lower-course',x0,x1,high,y1,-4.2,0);let cursor=x0;
   for(const x of centers){stone('lower-wall',cursor,x-w/2,low,high,-4.2,0);window('slit',x-w/2+.032,x+w/2-.032,low+.032,high-.032,-.30);stone('slit-back',x-w/2,x+w/2,low,high,-4.2,-4);cursor=x+w/2;}stone('lower-wall',cursor,x1,low,high,-4.2,0);
  }
 }
 return{groups,panes,supports,solid,stone,gallery,upper,slitWall,F};
}
// Hidden finite corner returns. The distance-bisector partitions the exterior
// pieces, but must also have an actual return between the two recessed cavities.
// Its depth is a conservative enclosure fit, not a claim about an interior room.
function cornerReturn(F,N){const g=new G.Geometry(),q=(x,z)=>N.local(M.apply(F.matrix,[x,0,z,1]))[2],c=q(0,0),ax=q(1,0)-c,az=q(0,1)-c,point=t=>[-(c+(az-1)*t)/ax,t],a=point(-.40),b=point(-4.2),len=Math.hypot(b[0]-a[0],b[1]-a[1]),off=[-(b[1]-a[1])*.06/len,(b[0]-a[0])*.06/len];let p=[[a[0]+off[0],a[1]+off[1]],[b[0]+off[0],b[1]+off[1]],[b[0]-off[0],b[1]-off[1]],[a[0]-off[0],a[1]-off[1]]];if(Y.Footprints.area([...p,p[0]])<0)p.reverse();const tri=(a,b,c)=>g.tri(...[a,b,c].map(p=>p.map(Math.fround)));for(const[lo,hi]of[[H.screen+1.2,H.splitLow],[H.splitHigh,H.top-1.2]]){for(let i=1;i<p.length-1;i++){tri([p[0][0],hi,p[0][1]],[p[i+1][0],hi,p[i+1][1]],[p[i][0],hi,p[i][1]]);tri([p[0][0],lo,p[0][1]],[p[i][0],lo,p[i][1]],[p[i+1][0],lo,p[i+1][1]]);}for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];tri([a[0],lo,a[1]],[a[0],hi,a[1]],[b[0],hi,b[1]]);tri([a[0],lo,a[1]],[b[0],hi,b[1]],[b[0],lo,b[1]]);}}return g;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const F=Y.Law102Entry170.frame(f),N=Y.Law102Entry170.northFrame(f),a=F.length*.420-.65,end=F.length*.773+.65,nw=N.length*H.wallFraction,emit=b.e.add,own=Object.hasOwn(b.e,'add');let removed=0,changed=0,ordinal=0;
 b.e.add=function(k,g,m,c,p,uv){const sequence=ordinal++;if(p[1]!==102)return emit.call(this,k,g,m,c,p,uv);
  if(k==='law102-entry170-north-end'){removed++;return;}
  if(p[0]===8){const q=N.local(M.apply(m,[g.v[0],g.v[1],g.v[2],1]));if(Math.abs(q[2]-.016)<.03){removed++;return;}return emit.call(this,k,g,m,c,p,uv);}
  // Preserve every verified hall piece, including its floor, columns, beam,
  // lettering and finite back. Only the isolated north name-wall is replaced.
  if(k.startsWith('law102-entry170-')&&!k.startsWith('law102-entry170-cut-'))return emit.call(this,k,g,m,c,p,uv);
  let gg=subtract(g,m,F,[0,H.screen,-4.2,F.length,H.top,1]);gg=subtract(gg,m,F,[a,0,-4.2,F.length,H.screen,1]);gg=subtract(gg,m,N,[0,0,-4.2,N.length,H.top,1]);
  if(gg!==g){changed++;if(!gg.v.length)return;return emit.call(this,PREFIX+'cut-'+sequence+'-'+k,gg,m,c,p,uv);}return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 if(removed!==3||!changed)throw Error('Kaiyuan171 upstream changed '+removed+'/'+changed);
 const east=factory(f,F,N,'east'),north=factory(f,N,F,'north');east.upper();north.upper();east.gallery(a,end,H.third,H.screen,true,true);east.slitWall(end,F.length);
 // The name wall is the near solid corner, not 44% of a rectangle inferred
 // from the old text width. The original photo's perspective fit is 22–29%.
 north.stone('corner',0,nw,0,H.screen,-4.2,0);
 for(const[y,top,rail]of[[H.base,H.middle-.48,false],[H.middle,H.third-.48,true],[H.third,H.screen,true]])north.gallery(nw,N.length,y,top,rail);
 emit.call(b.e,PREFIX+'corner-return',cornerReturn(F,N),F.matrix,'#b6b7b1',[24,102,0,.86]);
 for(const obj of[east,north])for(const[key,v]of obj.groups)if(v.g.v.length)emit.call(b.e,PREFIX+key,v.g,obj.F.matrix,v.color,[v.mat,102,0,.86]);
 const origin=b.origin,rotation=b.rotation,id=b.id;try{b.id=102;b.origin=[N.n[0],0,N.n[1]];b.rotation=N.rotation;b.lettering('凯原楼',nw/2,10.74,.016,5.8,1.2,0,'#626c65');b.lettering('LEO KOGUAN BUILDING',nw/2,9.60,.016,nw-.70,.45,0,'#626c65');}finally{b.origin=origin;b.rotation=rotation;b.id=id;}
 Y.Law102Envelope171.last={east:{panes:east.panes,supports:east.supports},north:{panes:north.panes,supports:north.supports}};return result;
};
Y.Law102Envelope171={heights:H,fit:true,northWallRange:[.22,.29],doorLeavesVerified:false};

// The first envelope was still constrained by unverified old storey heights.
// This common final-stream profile follows the native-photo projection fit.
// West/south reference lines stay fixed; their unobserved details are not verified.
const renderUnmapped=A.render,LEVEL_EPS=3e-6; // Two Float32 ULPs near the measured interface heights.
function profile(f){const ring=Y.Footprints.polygons(f.geometry)[0][0].slice(0,-1),E=Y.Law102Entry170.frame(f),N=Y.Law102Entry170.northFrame(f),SW=ring.slice().sort((a,b)=>(a[0]-a[1])-(b[0]-b[1]))[0];
 const nw=N.s,ne=N.n,se=E.n,sw=ring.find(p=>p!==nw&&p!==ne&&p!==se)||SW;
 // Compare by coordinates, since frame endpoints are references to separately
 // obtained rings on some providers.
 const find=(x,z)=>ring.reduce((a,p)=>Math.hypot(p[0]-x,p[1]-z)<Math.hypot(a[0]-x,a[1]-z)?p:a);
 const WN=find(N.s[0],N.s[1]),EN=find(N.n[0],N.n[1]),ES=find(E.n[0],E.n[1]),WS=ring.find(p=>p!==WN&&p!==EN&&p!==ES);
 const line=(a,b)=>{const u=[b[0]-a[0],b[1]-a[1]];return{n:[-u[1],u[0]],c:-u[1]*a[0]+u[0]*a[1]};},W=line(WS,WN),S=line(WS,ES),east={n:E.out,c:E.out[0]*E.n[0]+E.out[1]*E.n[1]-4},north={n:N.out,c:N.out[0]*N.n[0]+N.out[1]*N.n[1]-2.56};
 const intersect=(a,b)=>{const d=a.n[0]*b.n[1]-a.n[1]*b.n[0];return[(a.c*b.n[1]-a.n[1]*b.c)/d,(a.n[0]*b.c-a.c*b.n[0])/d];};
 const es=intersect(S,east),en=intersect(east,north),wn=intersect(north,W),old=[WS,ES,EN,WN],next=[WS,es,en,wn];
 function affine(ids){const[a,b,c]=ids.map(i=>old[i]),[aa,bb,cc]=ids.map(i=>next[i]),u=[b[0]-a[0],b[1]-a[1]],v=[c[0]-a[0],c[1]-a[1]],U=[bb[0]-aa[0],bb[1]-aa[1]],V=[cc[0]-aa[0],cc[1]-aa[1]],d=u[0]*v[1]-v[0]*u[1],j=[(U[0]*v[1]-V[0]*u[1])/d,(-U[0]*v[0]+V[0]*u[0])/d,(U[1]*v[1]-V[1]*u[1])/d,(-U[1]*v[0]+V[1]*u[0])/d];return{j,t:[aa[0]-j[0]*a[0]-j[1]*a[1],aa[1]-j[2]*a[0]-j[3]*a[1]]};}
 const maps=[affine([0,1,2]),affine([0,2,3])],side=p=>(EN[0]-WS[0])*(p[2]-WS[1])-(EN[1]-WS[1])*(p[0]-WS[0]),sign=Math.sign(side([ES[0],0,ES[1]])),lowerScale=(9-H.base)/(H.screen-H.base),upperScale=8.54/(H.top-H.screen),vertical=[{lo:-Infinity,hi:H.base,k:1,t:0,lower:true},{lo:H.base,hi:H.screen,k:lowerScale,t:H.base*(1-lowerScale),lower:true},{lo:H.screen,hi:H.top,k:upperScale,t:9-H.screen*upperScale,lower:false},{lo:H.top,hi:Infinity,k:1,t:17.54-H.top,lower:false}];
 function mapPoint(p,band){const V=band??(p[1]<=H.base?0:p[1]<H.screen?1:p[1]<H.top?2:3),v=vertical[V],a=maps[side(p)*sign>=0?0:1];return[v.lower?a.j[0]*p[0]+a.j[1]*p[2]+a.t[0]:p[0],v.k*p[1]+v.t,v.lower?a.j[2]*p[0]+a.j[3]*p[2]+a.t[1]:p[2]];}
 return{oldRing:old,lowerRing:next,E,N,maps,side,sign,vertical,mapPoint,anchor:[EN[0],0,EN[1]]};
}
function remapGeometry(g,m,P){const cols=[0,4,8].map(i=>[m[i],m[i+1],m[i+2]]),detM=M.dot(cols[0],M.cross(cols[1],cols[2])),inverseRows=[M.cross(cols[1],cols[2]),M.cross(cols[2],cols[0]),M.cross(cols[0],cols[1])].map(r=>r.map(v=>v/detM)),local=p=>inverseRows.map(r=>M.dot(r,[p[0]-m[12],p[1]-m[13],p[2]-m[14]])),vertices=[];for(let i=0;i<g.v.length;i+=8){const p=M.apply(m,[g.v[i],g.v[i+1],g.v[i+2],1]),n=g.v.slice(i+3,i+6),wn=M.norm([0,1,2].map(i=>inverseRows[0][i]*n[0]+inverseRows[1][i]*n[1]+inverseRows[2][i]*n[2]));for(const level of[H.base,H.screen,H.top])if(Math.abs(p[1]-level)<=LEVEL_EPS)p[1]=level;vertices.push([...p.slice(0,3),...wn,g.v[i+6],g.v[i+7]]);}
 const out=new G.Geometry();if(g.detailWidth)out.detailWidth=g.detailWidth;
 for(let i=0;i<vertices.length;i+=3){const source=vertices.slice(i,i+3),flat=source.every(v=>Math.hypot(...v.slice(3,6).map((n,k)=>n-source[0][3+k]))<1e-7);
  for(let bi=0;bi<4;bi++){const V=P.vertical[bi];let p=source;
   // Exactly horizontal boundary faces belong to one side only. At the body
   // top, an upward lower cap shrinks; a downward upper soffit stays cantilevered.
   let at=-1;for(let j=0;j<3;j++)if(source.every(v=>Math.abs(v[1]-P.vertical[j].hi)<1e-7)){at=j;break;}
   if(at>=0){const take=at===1?(source[0][4]>0?1:2):at+1;if(bi!==take)continue;}
   else{if(Number.isFinite(V.lo))p=clip(p,v=>V.lo-v[1]);if(Number.isFinite(V.hi))p=clip(p,v=>v[1]-V.hi);}
   if(p.length<3)continue;
   for(let region=0;region<(V.lower?2:1);region++){let poly=p;if(V.lower){const ds=poly.map(v=>P.side(v)*P.sign);if(ds.every(d=>Math.abs(d)<1e-9)&&region===1)continue;poly=clip(poly,v=>(region===0?-1:1)*P.side(v)*P.sign);}if(poly.length<3)continue;
    const A=P.maps[region],J=A.j,det=J[0]*J[3]-J[1]*J[2];
    for(let j=1;j<poly.length-1;j++){const original=[poly[0],poly[j],poly[j+1]],q=original.map(v=>{const x=V.lower?J[0]*v[0]+J[1]*v[2]+A.t[0]:v[0],z=V.lower?J[2]*v[0]+J[3]*v[2]+A.t[1]:v[2];return local([x,V.k*v[1]+V.t,z]).map(Math.fround);}),cross=M.cross(M.sub(q[1],q[0]),M.sub(q[2],q[0]));if(M.dot(cross,cross)<1e-16)continue;const face=M.norm(cross);
     for(let k=0;k<3;k++){const v=original[k],wn=V.lower?[(J[3]*v[3]-J[2]*v[5])/det,v[4]/V.k,(-J[1]*v[3]+J[0]*v[5])/det]:[v[3],v[4]/V.k,v[5]],n=flat?face:M.norm(cols.map(c=>M.dot(c,wn)));out.vertex(q[k],n,v.slice(6,8));}
    }
   }
  }
 }return out;
}
A.render=function(b,f,add){if(f.properties.id!==ID)return renderUnmapped.call(this,b,f,add);const P=profile(f),emit=b.e.add,own=Object.hasOwn(b.e,'add');let ordinal=0;
 b.e.add=function(k,g,m,c,p,uv){if(p[1]!==102)return emit.call(this,k,g,m,c,p,uv);const sequence=ordinal++;let lo=Infinity,hi=-Infinity;for(let i=0;i<g.v.length;i+=8){const y=m[1]*g.v[i]+m[5]*g.v[i+1]+m[9]*g.v[i+2]+m[13];lo=Math.min(lo,y);hi=Math.max(hi,y);}
  // Most upper/roof meshes retain their original losslessly reused geometry.
  const band=lo>H.top+LEVEL_EPS?3:lo>H.screen+LEVEL_EPS&&hi<H.top-LEVEL_EPS?2:-1;if(band>=0){const V=P.vertical[band],mm=new Float32Array(m);for(const i of[1,5,9])mm[i]*=V.k;mm[13]=mm[13]*V.k+V.t;return emit.call(this,k,g,mm,c,p,uv);}
  const gg=remapGeometry(g,m,P);if(gg.v.length)return emit.call(this,PREFIX+'profile-'+sequence+'-'+k,gg,m,c,p,uv);
 };let result;const sourceFeature={...f,properties:{...f.properties,height:26.5}};try{result=renderUnmapped.call(this,b,sourceFeature,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 Y.Law102Envelope171.profile=P;return result;
};
Object.assign(Y.Law102Envelope171,{renderUnmapped,makeProfile:profile,remapGeometry,profileFit:{lowerTop:9,upperHeight:8.54,upperTop:17.54,eastInset:4,northInset:2.56,reference:'single official photo plus source footprint; not measured'}});
})(YY);
