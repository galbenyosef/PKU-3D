/* Wave93: four plan-confirmed north room-to-platform doors.
 * Load after entry90. Preserve prior eight entrances; only four explicit internal
 * circulation portals modify old finite room walls. Finish/heights remain fits. */
(function(Y){'use strict';const previous=Y.Architecture30.render,M=Y.M,G=Y.Geo,ID='way/849765894';
const sources=[{"part": "60jia", "name": "north-network", "classification": "room-to-exterior-platform door", "pixelEnds": [[283, 412], [327, 412]], "worldEndsXZ": [[-638.4626657970322, -67.01370029354247], [-637.548903816533, -67.1193289590632]], "worldCentreXZ": [-638.0057848067826, -67.06651462630283], "fittedOpeningWidthMetres": 0.9198469285623098, "note": "Not automatically public entrance.", "room": [213, 412, 358, 716], "interiorPortalPixels": [[258, 716], [311, 716]], "platform": [213, 342, 358, 412]}, {"part": "60jia", "name": "north-shower-west", "classification": "room-to-exterior-platform door", "pixelEnds": [[428, 412], [471, 412]], "worldEndsXZ": [[-635.4514047249326, -67.36179475946307], [-634.5584100621719, -67.46502277349468]], "worldCentreXZ": [-635.0049073935522, -67.41340876647888], "fittedOpeningWidthMetres": 0.8989413165496012, "note": "Not automatically public entrance.", "room": [358, 412, 501, 716], "interiorPortalPixels": [[402, 716], [459, 716]], "platform": [358, 342, 501, 412]}, {"part": "60jia", "name": "north-shower-east", "classification": "room-to-exterior-platform door", "pixelEnds": [[572, 412], [616, 412]], "worldEndsXZ": [[-632.4609109705715, -67.70748857389455], [-631.5471489900723, -67.81311723941528]], "worldCentreXZ": [-632.0040299803219, -67.76030290665491], "fittedOpeningWidthMetres": 0.9198469285623098, "note": "Not automatically public entrance.", "room": [501, 412, 648, 716], "interiorPortalPixels": [[549, 716], [603, 716]], "platform": [501, 342, 648, 412]}, {"part": "60jia", "name": "north-manager", "classification": "room-to-exterior-platform door", "pixelEnds": [[1152, 412], [1194, 412]], "worldEndsXZ": [[-620.4158666821727, -69.09986643757692], [-619.5436393371507, -69.20069380011944]], "worldCentreXZ": [-619.9797530096616, -69.15028011884817], "fittedOpeningWidthMetres": 0.8780357045367816, "note": "Not automatically public entrance.", "room": [1082, 412, 1224, 716], "interiorPortalPixels": [[1082, 605], [1082, 658]], "platform": [1093, 342, 1224, 412]}];
const map=Y.Changchun872Entry83.mapped;
function entry(source,ends,interior=false){const a=ends[0],z=ends[1],width=Math.hypot(z[0]-a[0],z[1]-a[1]),u=[(z[0]-a[0])/width,(z[1]-a[1])/width];return{...source,key:source.name,center:[(a[0]+z[0])/2,(a[1]+z[1])/2],width,u,n:[u[1],-u[0]],bottom:.55,top:interior?2.72:2.8,leaves:interior?0:1,interior};}
const entries=sources.map(s=>entry(s,s.worldEndsXZ)),portals=sources.map(s=>entry({...s,name:s.name+'-inside'},s.interiorPortalPixels.map(p=>map('60jia',...p)),true));
function local(p,e){return[(p[0]-e.center[0])*e.u[0]+(p[2]-e.center[1])*e.u[1],p[1],(p[0]-e.center[0])*e.n[0]+(p[2]-e.center[1])*e.n[1]];}
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],s=fn(p),t=fn(q);if(s>=0)out.push(p);if((s>=0)!==(t>=0)){const k=s/(s-t);out.push(p.map((v,j)=>v+(q[j]-v)*k));}}return out;}
function hull(ps){const u=[...new Map(ps.map(p=>[p.join(','),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),half=xs=>{const h=[];for(const p of xs){while(h.length>1&&cross(h.at(-2),h.at(-1),p)<=0)h.pop();h.push(p);}return h;};return half(u).slice(0,-1).concat(half([...u].reverse()).slice(0,-1));}
Y.Architecture30.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const emit=b.e.add,window=b.window;let serial=0,cutRecords=0,removedWindows=0;const adjoiningLandings=[];
b.window=function(x,y,z,w,h,r,...args){if(entries.some(e=>{const p=local([x,y,z],e);return Math.abs(p[2])<.35&&Math.abs(p[0])<e.width/2+w/2&&y-h/2<e.top&&y+h/2>e.bottom;})){removedWindows++;return;}return window.call(this,x,y,z,w,h,r,...args);};
b.e.add=function(key,g,m,c,p,uv){if(p[1]!==872)return emit.call(this,key,g,m,c,p,uv);if(key==='entry83-872-north-lobby-landing'||key==='entry83-872-north-hotwater-west-landing'){const pts=[];for(let i=0;i<g.v.length;i+=8){const v=M.apply(m,[...g.v.slice(i,i+3),1]);pts.push([v[0],v[2]]);}adjoiningLandings.push({boundaryX:key==='entry83-872-north-lobby-landing'?1093:1224,polygon:hull(pts)});}let current=g,changedAny=false;
for(const e of [...entries,...portals]){if(e.interior&&!key.startsWith('entry83-872-60jia-interior-'))continue;const world=v=>local(M.apply(m,[...v.slice(0,3),1]),e),out=new G.Geometry();let changed=false;
for(let i=0;i<current.v.length;i+=24){const tri=[0,8,16].map(k=>current.v.slice(i+k,i+k+8)),ps=tri.map(world),bounds=[[-e.width/2,e.width/2],[e.bottom,e.top],[e.interior?-.15:-.65,e.interior?.15:.65]];
if(bounds.some(([lo,hi],axis)=>Math.min(...ps.map(p=>p[axis]))>=hi||Math.max(...ps.map(p=>p[axis]))<=lo)){out.v.push(...tri.flat());continue;}
let remain=tri;const parts=[];for(let axis=0;axis<3;axis++)for(const side of[0,1]){const fn=v=>side?world(v)[axis]-bounds[axis][1]:bounds[axis][0]-world(v)[axis];parts.push(clip(remain,fn));remain=clip(remain,v=>-fn(v));}
if(remain.length>=3)changed=true;
for(const poly of parts)for(let j=1;j<poly.length-1;j++){const vs=[poly[0],poly[j],poly[j+1]],pa=vs.map(v=>v.slice(0,3));if(Math.hypot(...M.cross(M.sub(pa[1],pa[0]),M.sub(pa[2],pa[0])))>1e-9)out.v.push(...vs.flat());}
}if(changed){current=out;changedAny=true;}}
if(!changedAny)return emit.call(this,key,g,m,c,p,uv);cutRecords++;if(current.v.length)return emit.call(this,'entry93-872-cut-'+serial+++'-'+key,current,m,c,p,uv);
};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=emit;b.window=window;}
const oldId=b.id;b.id=872;try{
const box=(k,x,y,z,w,h,d,col='#b8b9b3',mat=24)=>b.mesh('entry93-872-'+k,b.geo('entry93-872-box',G.box),x,y,z,w,h,d,col,mat);
for(const e of entries)b.local(e.center[0],0,e.center[1],Math.atan2(e.n[0],e.n[1]),()=>{const W=e.width,H=e.top-e.bottom,cy=(e.top+e.bottom)/2;box(e.key+'-jamb-left',-W/2-.045,cy,-.16,.09,H,.32);box(e.key+'-jamb-right',W/2+.045,cy,-.16,.09,H,.32);box(e.key+'-lintel',0,e.top+.045,-.16,W+.18,.09,.32);
// Plan proves one swing leaf, not glass proportions, panel joints or hardware.
box(e.key+'-single-leaf',0,cy,-.18,W-.07,H-.07,.035,'#a4aaa7',24);
for(const sign of[-1,1])box(e.key+'-frame-'+sign,sign*(W/2-.025),cy,-.15,.045,H,.07,'#929993',9);
for(const y of[e.bottom+.035,e.top-.035])box(e.key+'-rail-'+y,0,y,-.15,W,.07,.07,'#929993',9);
});
// Four finite rooms, with interior routes into existing corridor/lobby.
// Plan-side thin fixture/cabinet lines are not promoted into unknown full walls.
function slab(key,rect,y,h){const[x0,z0,x1,z1]=rect,xc=(x0+x1)/2,zc=(z0+z1)/2,a=map('60jia',x0,zc),q=map('60jia',x1,zc),v=map('60jia',xc,z0),w=map('60jia',xc,z1);b.local((a[0]+q[0])/2,0,(a[1]+q[1])/2,Math.atan2(-(q[1]-a[1]),q[0]-a[0]),()=>box(key,0,y,0,Math.hypot(q[0]-a[0],q[1]-a[1]),h,Math.hypot(w[0]-v[0],w[1]-v[1]),'#adafa8',10));}
// Bilinear registration is not an orthogonal rectangle. Exact polygon slabs
// share their mapped edges; manager clips against actual old landing transforms,
// preserving the old landing instead of assuming plan x1093 is its built edge.
function platform(s){let[x0,z0,x1,z1]=s.platform;if(s.name==='north-manager')x0=1082;let ps=hull([[x0,z0],[x1,z0],[x1,z1],[x0,z1]].map(p=>map('60jia',...p)));
if(s.name==='north-manager')for(const {boundaryX,polygon:landing} of adjoiningLandings){const target=map('60jia',boundaryX,377);let best,dist=Infinity;for(let i=0;i<landing.length;i++){const a=landing[i],q=landing[(i+1)%landing.length],mid=[(a[0]+q[0])/2,(a[1]+q[1])/2],d=Math.hypot(mid[0]-target[0],mid[1]-target[1]);if(d<dist){best=[a,q];dist=d;}}const[a,q]=best;ps=clip(ps,p=>-((q[0]-a[0])*(p[1]-a[1])-(q[1]-a[1])*(p[0]-a[0])));}
const g=new G.Geometry(),point=(p,y)=>[p[0]+640,y,p[1]+70];for(let i=1;i<ps.length-1;i++){g.tri(point(ps[0],.55),point(ps[i+1],.55),point(ps[i],.55));g.tri(point(ps[0],0),point(ps[i],0),point(ps[i+1],0));}for(let i=0;i<ps.length;i++){const a=ps[i],q=ps[(i+1)%ps.length];g.quad(point(a,0),point(q,0),point(q,.55),point(a,.55));}b.mesh('entry93-872-'+s.name+'-platform',g,-640,0,-70,1,1,1,'#adafa8',10);}
for(const s of sources){slab(s.name+'-floor',s.room,.51,.08);slab(s.name+'-ceiling',s.room,2.85,.08);platform(s);}
// Manager east/south and west walls already belong to the 83 circulation union.
// Keep those records except for the plan-confirmed west doorway. Shared shower
// partitions occur once; network west is an interior partition of the joined 60/60A.
for(const x of[213,358,501,648]){const a=map('60jia',x,412),q=map('60jia',x,716);b.local((a[0]+q[0])/2,0,(a[1]+q[1])/2,Math.atan2(-(q[1]-a[1]),q[0]-a[0]),()=>box('room-side-'+x,0,1.675,0,Math.hypot(q[0]-a[0],q[1]-a[1]),2.25,.12));}
// Close exposed .12-m wall ends at cut interior portals, no invented internal leaves.
for(const e of portals)b.local(e.center[0],0,e.center[1],Math.atan2(e.n[0],e.n[1]),()=>{for(const sign of[-1,1])box(e.key+'-reveal-'+sign,sign*(e.width/2+.015),(e.bottom+e.top)/2,0,.03,e.top-e.bottom,.12);box(e.key+'-head',0,e.top+.015,0,e.width,.03,.12);});
}finally{b.id=oldId;}
return{...result,detail:'changchun872-entry93-four-north-room-doors',previousImplementedOpeningCount:result.implementedOpeningCount,implementedOpeningCount:12,remainingExteriorOpeningCount:8,entry93CutRecords:cutRecords,entry93RemovedWindows:removedWindows,entry93LeafCount:4,entry93InteriorPortalCount:portals.length,entry93FiniteRoomCount:sources.length,entry93PublicEntrance:false,entry93MaterialVerified:false};
};Y.Changchun872Entry93={entries,portals,sources};})(YY);
