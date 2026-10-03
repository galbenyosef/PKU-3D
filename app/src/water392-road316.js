/* Public campus scan fit: two ground paths remain two logical routes.
   Scan ellipsoid heights are not project ground elevations. No bridge/water edit. */
(function(Y){'use strict';const G=Y.Geo,M=Y.M,features=Y.CAMPUS.features;
const paths={"west243":[[-256.715,-408.94],[-254.6,-407],[-252.8,-403],[-251.3,-398],[-250.2,-394],[-249.3,-390],[-249.6,-386],[-250.1,-382],[-249.6,-378],[-248.7,-374],[-248.3,-370],[-248.4,-366],[-249.4,-362],[-250.3,-358],[-250.9,-354],[-251.5,-350],[-252.2,-346],[-252.5,-342],[-251.8,-338],[-250.908,-335.979]],"branch481":[[-250.2,-394],[-247.1,-393.4],[-244.2,-393],[-242.5,-391.3],[-242.1,-388.5],[-242.8,-385],[-244,-382],[-243.8,-380],[-241.6,-378],[-240.4,-376],[-241.1,-373],[-242.4,-370],[-242.8,-367],[-241.8,-364],[-241.2,-361.5],[-241.6,-359],[-243.2,-356],[-246,-353.8],[-248.7,-352],[-251.5,-350]],"status":"visual scan fit, not surveyed; south joint adjusted below by -.7m"};
const source=new Map([[243,'way/679485578'],[481,'way/1101010420']]);
const feature=id=>features.find(f=>f.properties.pickId===id),old=new Map([...source].map(([id,s])=>[s,feature(id).geometry.coordinates]));
const lengths=p=>{const a=[0];for(let i=1;i<p.length;i++)a.push(a.at(-1)+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));return a;};
function part(p,lo,hi){const d=lengths(p),L=d.at(-1),at=t=>{t=Math.max(0,Math.min(L,t));let i=1;while(i+1<d.length&&d[i]<t)i++;const s=(t-d[i-1])/(d[i]-d[i-1]||1);return p[i-1].map((v,k)=>v+(p[i][k]-v)*s);};const out=[at(lo)];for(let i=1;i+1<p.length;i++)if(d[i]>lo+1e-8&&d[i]<hi-1e-8)out.push(p[i]);out.push(at(hi));return out;}
paths.west243.at(-1)[0]-=.7;paths.branch481[paths.branch481.length-1]=paths.west243[15];
const west=paths.west243,branch=paths.branch481,westParts=[west.slice(0,5),west.slice(4,8),west.slice(7,14),west.slice(13,16),west.slice(15)];
const bd=lengths(branch),branchCuts=[0,.16,.28,.47,.64,.80,1].map(t=>t*bd.at(-1));
const eastParts=[westParts[0],...branchCuts.slice(1).map((t,i)=>part(branch,branchCuts[i],t)),westParts[4]];
const parts=new Map([[source.get(243),westParts],[source.get(481),eastParts]]),nav=new Map(),routeJoins=new Map(),aliases=new Map(),neighborRoads=new Map(),joinPlans=new Map();
const joinOld=[-250.908,-335.979],joinNew=west.at(-1);
for(const id of[215,216]){const f=feature(id),p=f.geometry.coordinates,atStart=Math.hypot(p[0][0]-joinOld[0],p[0][1]-joinOld[1])<1e-6,k=atStart?0:p.length-1,j=atStart?1:k-1,dist=Math.hypot(p[j][0]-p[k][0],p[j][1]-p[k][1]),t=Math.min(3/dist,1),cut=p[k].map((v,a)=>v+(p[j][a]-v)*t),newParts=p.slice(1).map((v,i)=>[p[i].slice(),v.slice()]);newParts[atStart?0:newParts.length-1]=atStart?[joinNew,cut,p[j]]:[p[j],cut,joinNew];parts.set(f.properties.id,newParts);source.set(id,f.properties.id);old.set(f.properties.id,p);joinPlans.set(id,{atStart,a:p[k],b:p[j],dist});neighborRoads.set(id,newParts.flatMap((a,i)=>i?a.slice(1):a));}

const tris=g=>Array.from({length:g.v.length/24},(_,i)=>[0,8,16].map(k=>g.v.slice(i*24+k,i*24+k+8)));
function cut(p,dist){const o=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=dist(a),db=dist(b),ia=da>=-1e-10,ib=db>=-1e-10;if(ia)o.push(a);if(ia!==ib){const t=da/(da-db);o.push(a.map((v,k)=>v+(b[k]-v)*t));}}return o;}
function emit(g,p){for(let i=1;i+1<p.length;i++){const q=[p[0],p[i],p[i+1]],n=M.cross(M.sub(q[1].slice(0,3),q[0].slice(0,3)),M.sub(q[2].slice(0,3),q[0].slice(0,3)));if(Math.hypot(...n)>1e-8)g.tri(...q.map(v=>v.slice(0,3)),q.map(v=>v.slice(6,8)));}}
function subtract(g,mask){const out=new G.Geometry();for(const t of tris(g)){let polys=[t];for(const b of tris(mask)){const sign=Math.sign((b[1][0]-b[0][0])*(b[2][2]-b[0][2])-(b[1][2]-b[0][2])*(b[2][0]-b[0][0]));if(!sign)continue;const next=[];for(const poly of polys){let inside=poly;for(let i=0;i<3&&inside.length;i++){const p=b[i],q=b[(i+1)%3],d=v=>sign*((q[0]-p[0])*(v[2]-p[2])-(q[2]-p[2])*(v[0]-p[0]));const outside=cut(inside,v=>-d(v));if(outside.length>=3)next.push(outside);inside=cut(inside,d);}}polys=next;if(!polys.length)break;}for(const p of polys)emit(out,p);}return out;}
// The cached scene already contains these meshes. Preserve the original input
// snapshot and construct the pair only when the source builder needs it.
const roadInputs={west:west.map(p=>p.slice()),branch:branch.map(p=>p.slice()),westWidth:feature(243).properties.width,branchWidth:feature(481).properties.width},roadRibbon=G.ribbon;
let roadMeshes;
function ensureRoadMeshes(){
 if(roadMeshes)return roadMeshes;
 const westRoad=roadRibbon.call(G,roadInputs.west,roadInputs.westWidth,.12,false),eastRoad=subtract(roadRibbon.call(G,roadInputs.branch,roadInputs.branchWidth,.12,false),westRoad);
 // Publish together only after both computations succeed; retry has no partial pair.
 return roadMeshes={westRoad,eastRoad};
}
function warpJoin(g,id){const plan=joinPlans.get(id),u=plan.b.map((v,k)=>(v-plan.a[k])/plan.dist),t=v=>(v[0]-plan.a[0])*u[0]+(v[2]-plan.a[1])*u[1],out=new G.Geometry();for(const q of tris(g)){if(q.every(v=>t(v)>=3-1e-9)){out.v.push(...q.flat());continue;}const rest=cut(q,v=>t(v)-3);emit(out,rest);const affected=cut(q,v=>3-t(v)).map(v=>{const p=v.slice();p[0]-=.7*(1-M.clamp(t(v)/3,0,1));return p;});emit(out,affected);}return out;}
function warpJoinRoad(g,id){const at=joinPlans.get(id).atStart?0:g.v.length-48,out=new G.Geometry();out.v.push(...g.v.slice(0,at),...warpJoin({v:g.v.slice(at,at+48)},id).v,...g.v.slice(at+48));return out;}
function roadGeometry(f){const id=f.properties.pickId;if(id===243||id===481){const meshes=ensureRoadMeshes();return id===243?meshes.westRoad:meshes.eastRoad;}const p=neighborRoads.get(id);return Y.Road717Join.clip(f,Y.Road511Join.clip(f,Y.Road745159.clip(f,Y.Road748Join.clip(f,Y.StudentCenterSouth46.clipGroundRibbon(Y.Landscape42.warp(warpJoinRoad(G.ribbon(f.geometry.coordinates,f.properties.width,.12,false),id)))))));}
function renderRoad(f,add,merged){const id=f.properties.pickId;if(source.get(id)!==f.properties.id)return false;merged('footpaths',roadGeometry(f),'#cbc7b7',7);return true;}
const build=Y.Network.build,route=Y.Network.route,routeEdges=Y.Network.routeEdges;
Y.Network.build=function(roads){const g=build.call(this,roads);nav.clear();aliases.clear();const edgeBySource=new Map([...source.values()].map(s=>[s,g.edges.filter(e=>e.source===s)]));if([...edgeBySource].some(([s,e])=>e.length!==parts.get(s).length))throw Error('392 path graph changed: inspect before applying fit');
 for(const [s,edges]of edgeBySource)for(let i=0;i<edges.length;i++){const e=edges[i],p=parts.get(s)[i].map(v=>v.slice());if(JSON.stringify(p)===JSON.stringify(e.points))continue;const originalPoints=e.points.map(v=>v.slice());e.points=p;e.length=lengths(p).at(-1);g.nodes[e.a].p=p[0].slice();g.nodes[e.b].p=p.at(-1).slice();for(const n of[g.nodes[e.a],g.nodes[e.b]])for(const l of n.links)if(l.edge===e.id)l.cost=e.length;nav.set(e.id,{source:s,index:i,p,originalPoints});}
 const we=edgeBySource.get(source.get(243)),ee=edgeBySource.get(source.get(481));aliases.set(ee[0].id,we[0].id);aliases.set(ee.at(-1).id,we.at(-1).id);rebuildRouteJoins(edgeBySource);return g;};
Y.Network.route=function(g,a,b){const r=route.call(this,g,a,b);if(!r)return r;const ids=routeEdges(g,r);if(!ids.some(id=>parts.has(g.edges[id].source)))return r;const points=[];for(let i=0;i<ids.length;i++){const e=g.edges[ids[i]],p=e.a===r.nodeIds[i]?e.points:e.points.slice().reverse();for(let j=points.length?1:0;j<p.length;j++)points.push(p[j].slice());}return{...r,points};};
Y.Network.routeEdges=function(g,r){const ids=routeEdges.call(this,g,r),we=g.edges.filter(e=>e.source===source.get(243)),ee=g.edges.filter(e=>e.source===source.get(481));if(!we.length||!ee.length)return ids;const map=new Map([[ee[0].id,we[0].id],[ee.at(-1).id,we.at(-1).id]]);return [...new Set(ids.concat(ids.filter(id=>map.has(id)).map(id=>map.get(id))))];};
// Close only navigation cap wedges at real shared nodes. Each adjacent edge owns
// its half; a route ending at the node gains no full unselected branch surface.
function rebuildRouteJoins(edgeBySource){
 const {westRoad,eastRoad}=ensureRoadMeshes();
 routeJoins.clear();const we=edgeBySource.get(source.get(243)),ee=edgeBySource.get(source.get(481)),pairs=[...we.slice(1).map((e,i)=>[we[i],e]),[we[0],ee[1]],[ee[ee.length-2],we[we.length-1]]],paving=new G.Geometry();paving.v.push(...westRoad.v,...eastRoad.v);
 const width=e=>e.source===source.get(243)?1.6:1.8,mesh=e=>G.ribbon(e.points,width(e),.32,false),triangle=(p,a,b)=>{const g=new G.Geometry(),area=(a[0]-p[0])*(b[2]-p[2])-(a[2]-p[2])*(b[0]-p[0]);if(Math.abs(area)>1e-12){if(area>0)g.tri(p,b,a);else g.tri(p,a,b);}return g;};
 for(const[a,b]of pairs){let ai=-1,bi=-1;for(const i of[0,a.points.length-1])for(const j of[0,b.points.length-1])if(Math.hypot(a.points[i][0]-b.points[j][0],a.points[i][1]-b.points[j][1])<1e-8){ai=i;bi=j;}if(ai<0)throw Error('392 navigation join lost shared endpoint');const p=a.points[ai],ap=a.points[ai===0?1:ai-1],bp=b.points[bi===0?1:bi-1],ad=M.norm([p[0]-ap[0],p[1]-ap[1]]),bd=M.norm([bp[0]-p[0],bp[1]-p[1]]),node=[p[0],.32,p[1]],mask=new G.Geometry();mask.v.push(...mesh(a).v,...mesh(b).v);
  for(const sign of[-1,1]){const ac=[p[0]-ad[1]*width(a)*.5*sign,.32,p[1]+ad[0]*width(a)*.5*sign],bc=[p[0]-bd[1]*width(b)*.5*sign,.32,p[1]+bd[0]*width(b)*.5*sign],mid=ac.map((v,i)=>(v+bc[i])*.5);for(const[e,q]of[[a,triangle(node,ac,mid)],[b,triangle(node,mid,bc)]]){const gap=subtract(q,mask),inside=subtract(gap,subtract(gap,paving));if(!inside.v.length)continue;let g=routeJoins.get(e.id);if(!g){g=new G.Geometry();routeJoins.set(e.id,g);}g.v.push(...inside.v);}}
 }
}

function routeMesh(g,e){const p=nav.get(e.id);if(!p)return g;if(aliases.has(e.id))return new G.Geometry();const id=[...source].find(([id,s])=>s===p.source)[0];if(joinPlans.has(id))return warpJoin(G.ribbon(p.originalPoints,1.8,.32,false),id);const out=G.ribbon(e.points,id===243?1.6:1.8,.32,false),join=routeJoins.get(e.id);if(join)out.v.push(...join.v);return out;}
Y.Water392Road316={renderRoad,route:routeMesh,paths,parts,subtract,source,roadGeometry,neighborRoads};
})(YY);
