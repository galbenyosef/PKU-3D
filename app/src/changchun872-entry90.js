/* Wave90: one plan-confirmed single-leaf stairwell-to-platform door.
 * Load after changchun872-entry83.js. Leaf finish/height and slab level are fits. */
(function(Y){'use strict';const previous=Y.Architecture30.render,M=Y.M,G=Y.Geo,ID='way/849765894';
const source={"part":"60jia","name":"north-stair-north","classification":"room-to-exterior-platform door","pixelEnds":[[1586,412],[1630,412]],"worldEndsXZ":[[-611.4028507836123,-70.14174918384961],[-610.4890888031131,-70.24737784937034]],"worldCentreXZ":[-610.9459697933627,-70.19456351660997],"fittedOpeningWidthMetres":0.9198469285623098,"note":"Not automatically public entrance."};
const a=source.worldEndsXZ[0],z=source.worldEndsXZ[1],width=source.fittedOpeningWidthMetres,u=[(z[0]-a[0])/width,(z[1]-a[1])/width],n=[u[1],-u[0]],entries=[{...source,key:'north-stair-north',center:source.worldCentreXZ,width,u,n,bottom:.55,top:2.80,leaves:1}];
function local(p,e){return[(p[0]-e.center[0])*e.u[0]+(p[2]-e.center[1])*e.u[1],p[1],(p[0]-e.center[0])*e.n[0]+(p[2]-e.center[1])*e.n[1]];}
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],s=fn(p),t=fn(q);if(s>=0)out.push(p);if((s>=0)!==(t>=0)){const k=s/(s-t);out.push(p.map((v,j)=>v+(q[j]-v)*k));}}return out;}
Y.Architecture30.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const emit=b.e.add,window=b.window;let serial=0,cutRecords=0,removedWindows=0;
b.window=function(x,y,z,w,h,r,...args){if(entries.some(e=>{const p=local([x,y,z],e);return Math.abs(p[2])<.35&&Math.abs(p[0])<e.width/2+w/2&&y-h/2<e.top&&y+h/2>e.bottom;})){removedWindows++;return;}return window.call(this,x,y,z,w,h,r,...args);};
b.e.add=function(key,g,m,c,p,uv){if(p[1]!==872)return emit.call(this,key,g,m,c,p,uv);let current=g,changedAny=false;
for(const e of entries){const world=v=>local(M.apply(m,[...v.slice(0,3),1]),e),out=new G.Geometry();let changed=false;
for(let i=0;i<current.v.length;i+=24){const tri=[0,8,16].map(k=>current.v.slice(i+k,i+k+8)),ps=tri.map(world),bounds=[[-e.width/2,e.width/2],[e.bottom,e.top],[-.65,.65]];
if(bounds.some(([lo,hi],axis)=>Math.min(...ps.map(p=>p[axis]))>=hi||Math.max(...ps.map(p=>p[axis]))<=lo)){out.v.push(...tri.flat());continue;}
let remain=tri;const parts=[];for(let axis=0;axis<3;axis++)for(const side of[0,1]){const fn=v=>side?world(v)[axis]-bounds[axis][1]:bounds[axis][0]-world(v)[axis];parts.push(clip(remain,fn));remain=clip(remain,v=>-fn(v));}
if(remain.length>=3)changed=true;
for(const poly of parts)for(let j=1;j<poly.length-1;j++){const vs=[poly[0],poly[j],poly[j+1]],pa=vs.map(v=>v.slice(0,3));if(Math.hypot(...M.cross(M.sub(pa[1],pa[0]),M.sub(pa[2],pa[0])))>1e-9)out.v.push(...vs.flat());}
}if(changed){current=out;changedAny=true;}}
if(!changedAny)return emit.call(this,key,g,m,c,p,uv);cutRecords++;if(current.v.length)return emit.call(this,'entry90-872-cut-'+serial+++'-'+key,current,m,c,p,uv);
};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=emit;b.window=window;}
const oldId=b.id;b.id=872;try{
const e=entries[0],box=(k,x,y,z,w,h,d,col='#b8b9b3',mat=24)=>b.mesh('entry90-872-'+k,b.geo('entry90-872-box',G.box),x,y,z,w,h,d,col,mat);
b.local(e.center[0],0,e.center[1],Math.atan2(e.n[0],e.n[1]),()=>{const W=e.width,H=e.top-e.bottom,cy=(e.top+e.bottom)/2;box('jamb-left',-W/2-.045,cy,-.16,.09,H,.32);box('jamb-right',W/2+.045,cy,-.16,.09,H,.32);box('lintel',0,e.top+.045,-.16,W+.18,.09,.32);
// Plan proves one swing leaf, not glass proportions, panel joints or hardware.
box('single-leaf',0,cy,-.18,W-.07,H-.07,.035,'#a4aaa7',24);
for(const sign of[-1,1])box('frame-'+sign,sign*(W/2-.025),cy,-.15,.045,H,.07,'#929993',9);
for(const y of[e.bottom+.035,e.top-.035])box('rail-'+y,0,y,-.15,W,.07,.07,'#929993',9);
});
// Shallow external platform from x1517..1664,y342..412 on the registered plan.
// No exterior stairs are drawn here. Keep it a raised platform, not a new route.
const map=Y.Changchun872Entry83.mapped,q=[[1517,412],[1664,412],[1664,342],[1517,342]].map(p=>map('60jia',...p)),c=[(q[0][0]+q[1][0])/2,(q[0][1]+q[1][1])/2],d=[q[3][0]-q[0][0],q[3][1]-q[0][1]],depth=Math.hypot(...d),w=Math.hypot(q[1][0]-q[0][0],q[1][1]-q[0][1]);b.local(c[0],0,c[1],Math.atan2(d[0],d[1]),()=>box('north-platform',0,.275,depth/2,w,.55,depth,'#adafa8',10));
}finally{b.id=oldId;}
return{...result,detail:'changchun872-entry90-north-stair-platform-door',previousImplementedOpeningCount:result.implementedOpeningCount,implementedOpeningCount:8,remainingExteriorOpeningCount:12,entry90CutRecords:cutRecords,entry90RemovedWindows:removedWindows,entry90LeafCount:1,entry90PublicEntrance:false,entry90MaterialVerified:false};
};Y.Changchun872Entry90={entries};})(YY);
