/* Fangchi, west of Xiaojing Pavilion: photographed sunken dressed-stone basin.
 * Vertical levels and coping width are display fits, not surveyed dimensions. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,M=Y.M,ID='way/679485580',PICK=244;
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID&&f.properties.pickId===PICK),ring=feature.geometry.coordinates[0],sign=Math.sign(F.area(ring));
const H={bottom:-1.35,water:-.85,shoulder:.08,top:.16},width=.38;
const edges=ring.slice(1).map((b,i)=>{const a=ring[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);return{a,b,n:[-dz/len*sign,dx/len*sign]};});
function outerRing(){return edges.map((e,i)=>{const p=edges[(i+edges.length-1)%edges.length],nx=e.n[0]+p.n[0],nz=e.n[1]+p.n[1],s=width/(1+e.n[0]*p.n[0]+e.n[1]*p.n[1]);return[e.a[0]-nx*s,e.a[1]-nz*s];}).concat([null]).map((p,i,a)=>p||a[0]);}
const outer=outerRing();
function clipConvex(g,edges){const out=new G.Geometry();let changed=false;const bb=[Math.min(...edges.map(e=>e.a[0])),Math.min(...edges.map(e=>e.a[1])),Math.max(...edges.map(e=>e.a[0])),Math.max(...edges.map(e=>e.a[1]))];
 const area=p=>{let sum=0;for(let i=1;i+1<p.length;i++){const a=p[i].slice(0,3).map((v,j)=>v-p[0][j]),b=p[i+1].slice(0,3).map((v,j)=>v-p[0][j]);sum+=Math.hypot(...M.cross(a,b))/2;}return sum;};
 function half(poly,e,inside){const out=[],dist=p=>((p[0]-e.a[0])*e.n[0]+(p[2]-e.a[1])*e.n[1])*(inside?1:-1);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b),ia=da>=0,ib=db>=0;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}return out;}
 function emit(p){for(let j=1;j+1<p.length;j++)if(area([p[0],p[j],p[j+1]])>1e-10)out.v.push(...p[0],...p[j],...p[j+1]);}
 for(let i=0;i<g.v.length;i+=24){const tri=[g.v.slice(i,i+8),g.v.slice(i+8,i+16),g.v.slice(i+16,i+24)];const xs=tri.map(p=>p[0]),zs=tri.map(p=>p[2]);if(Math.min(...xs)>bb[2]||Math.max(...xs)<bb[0]||Math.min(...zs)>bb[3]||Math.max(...zs)<bb[1]){out.v.push(...g.v.slice(i,i+24));continue;}let inner=tri;for(const e of edges)inner=half(inner,e,true);if(inner.length<3||area(inner)<1e-10){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;let remain=tri;for(const e of edges){emit(half(remain,e,false));remain=half(remain,e,true);if(remain.length<3)break;}}
 if(!changed)return g;if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;
}
function createClip(sourceRing){
 const s=Math.sign(F.area(sourceRing)),points=sourceRing.slice(0,-1),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
 const convex=points.every((p,i)=>cross(p,points[(i+1)%points.length],points[(i+2)%points.length])*s>=-1e-9);
 const pieces=convex?[sourceRing]:F.capTriangles([sourceRing]).map(t=>[...t,t[0]]);
 const sets=pieces.map(r=>{const sign=Math.sign(F.area(r));return r.slice(1).map((b,i)=>{const a=r[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);return{a,b,n:[-dz/len*sign,dx/len*sign]};});});
 const bb=[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
 return function(g){let overlap=false;for(let i=0;i<g.v.length;i+=24){const xs=[g.v[i],g.v[i+8],g.v[i+16]],zs=[g.v[i+2],g.v[i+10],g.v[i+18]];if(Math.min(...xs)<=bb[2]&&Math.max(...xs)>=bb[0]&&Math.min(...zs)<=bb[3]&&Math.max(...zs)>=bb[1]){overlap=true;break;}}if(!overlap)return g;return sets.reduce((mesh,e)=>clipConvex(mesh,e),g);};
}
const clip=createClip(ring),profile=Y.PondTerrainProfile.create(outer);let active=false,lastProfile=[];
const descriptor={id:ID,ring,clip,observe:profile.observe,begin(){profile.begin();active=false;lastProfile=[];}};
function groundKey(k,p){return(k==='box'&&p[1]===999999)||/^(ground-plate-.*-(top|sides)|geographic-basemap|campus-land|mapped-green|lawn-\d+|footpaths|roads|road-plazas|route-\d+|xiaojing42-hill)$/.test(k);}
function worldMesh(g,m){const out=new G.Geometry(),inv=M.inverse(m);for(let i=0;i<g.v.length;i+=8){const p=M.apply(m,[...g.v.slice(i,i+3),1]),n=g.v.slice(i+3,i+6),normal=M.norm([0,1,2].map(j=>inv[j*4]*n[0]+inv[j*4+1]*n[1]+inv[j*4+2]*n[2]));out.v.push(...p.slice(0,3),...normal,...g.v.slice(i+6,i+8));}if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;}
function withCuts(engine,descriptors,fn){const prev=engine.add;let serial=0;for(const d of descriptors)d.begin?.();engine.add=function(k,g,m,c,p,uv){if(groundKey(k,p)){const identity=m.every((v,i)=>v===(i%5===0?1:0)),world=identity?g:worldMesh(g,m);if(p[0]!==17&&!k.startsWith('route-'))for(const d of descriptors)d.observe?.(world);const cut=descriptors.reduce((mesh,d)=>d.clip(mesh),world);if(cut!==world)return prev.call(this,k+'-pond-ground-cut-'+serial++,cut,M.identity(),c,p,uv);}return prev.call(this,k,g,m,c,p,uv);};try{return fn();}finally{engine.add=prev;}}
function withGroundCuts(engine,fn){return withCuts(engine,[descriptor],fn);}

function render(f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return false;active=true;
 add('water-'+PICK,F.surface(f.geometry,H.water),'#689a91',4,PICK);
 add('water244-floor',F.surface(f.geometry,H.bottom),'#757b67',10,PICK);return true;
}
// The reference has long dressed stones in staggered courses. Fitted block
// dimensions; thin face veneers expose the continuous wall as recessed joints.
function masonry(profileRows){const meshes=[new G.Geometry(),new G.Geometry(),new G.Geometry()],course=.34,gap=.022,relief=.009;
 for(let edge=0;edge<edges.length;edge++){const e=edges[edge],len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),nodes=profileRows[edge].nodes;
 const spans=[];for(let i=1;i<nodes.length;i++){const a=nodes[i-1],b=nodes[i];if(b.t-a.t>1e-9)spans.push({lo:a.t*len,hi:b.t*len,ya:Math.max(H.top,a.y+.04)-.08,yb:Math.max(H.top,b.y+.04)-.08});}
 const top=Math.max(...spans.flatMap(s=>[s.ya,s.yb])),point=(u,y)=>[e.a[0]+(e.b[0]-e.a[0])*u/len+e.n[0]*relief,y,e.a[1]+(e.b[1]-e.a[1])*u/len+e.n[1]*relief];
 for(let row=0;H.bottom+row*course<top;row++){const low=H.bottom+row*course+gap/2,high=low+course-gap;let u=row%2?-.69:0,col=0;
 while(u<len){const width=[1.42,1.18,1.56,1.30][(col+edge)%4],left=Math.max(gap/2,u+gap/2),right=Math.min(len-gap/2,u+width-gap/2),mesh=meshes[(col+row+edge)%3];
 if(right>left){const parts=spans.filter(s=>s.hi>left&&s.lo<right),minimum=Math.min(...parts.flatMap(s=>[s.ya,s.yb]));
 if(high<minimum-gap/2)mesh.quad(point(left,low),point(right,low),point(right,high),point(left,high),[e.n[0],0,e.n[1]]);
 else for(const s of parts){const a=Math.max(left,s.lo),b=Math.min(right,s.hi),height=u=>s.ya+(s.yb-s.ya)*(u-s.lo)/(s.hi-s.lo)-gap/2;let poly=[[a,low],[b,low],[b,high],[a,high]],out=[];for(let k=0;k<poly.length;k++){const p=poly[k],q=poly[(k+1)%poly.length],dp=height(p[0])-p[1],dq=height(q[0])-q[1];if(dp>=0)out.push(p);if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}}for(let k=1;k+1<out.length;k++)mesh.tri(point(...out[0]),point(...out[k]),point(...out[k+1]),undefined,[[e.n[0],0,e.n[1]],[e.n[0],0,e.n[1]],[e.n[0],0,e.n[1]]]);}
 }u+=width;col++;}
 }}return meshes;}
function finish(add){if(!active)return;const walls=new G.Geometry(),tops=new G.Geometry(),inner=new G.Geometry(),outside=new G.Geometry();lastProfile=[];
 for(let i=0;i<edges.length;i++){const e=edges[i],a=outer[i],b=outer[i+1],nodes=profile.segments(a,b);lastProfile.push({edge:i,nodes});
 const at=(n,out,y)=>{const p=out?a:e.a,q=out?b:e.b;return[p[0]+(q[0]-p[0])*n.t,y,p[1]+(q[1]-p[1])*n.t];};
 for(let j=1;j<nodes.length;j++){const s=nodes[j-1],t=nodes[j],sy=Math.max(H.top,s.y+.04),ty=Math.max(H.top,t.y+.04),sa=at(s,false,sy-.08),ta=at(t,false,ty-.08),st=at(s,false,sy),tt=at(t,false,ty),so=at(s,true,sy),to=at(t,true,ty);
 if(t.t-s.t>1e-9){walls.quad(at(s,false,H.bottom),at(t,false,H.bottom),ta,sa,[e.n[0],0,e.n[1]]);
 inner.quad(sa,ta,tt,st,[e.n[0],0,e.n[1]]);outside.quad(at(s,true,s.y-.02),so,to,at(t,true,t.y-.02));}
 if(t.t-s.t>1e-9||Math.abs(sy-ty)>1e-9)tops.quad(st,tt,to,so);
 }}
 add('water244-inner-stone',walls,'#959c8c',10,PICK);add('water244-coping-top',tops,'#afb5a3',10,PICK);add('water244-coping-inner',inner,'#9ba38f',10,PICK);add('water244-outer-support',outside,'#959c8c',10,PICK);
 masonry(lastProfile).forEach((g,i)=>add('water244-dressed-stone-'+i,g,['#a7ac99','#9ea592','#b0b39f'][i],10,PICK));active=false;
}
Y.Water244={id:ID,pickId:PICK,ring,outer,heights:H,clip,createClip,descriptor,render,finish,get profile(){return lastProfile;},withCuts,withGroundCuts,groundKey};
})(YY);
