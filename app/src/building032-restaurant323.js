/* 323 PRIVATE candidate: lossless merge of identical clipped-material streams.
 * Original source-backed restaurant, native sign pixels and all resource paths remain.
 * Runtime/build/render/performance acceptance is owned by Root and remains open. */
/* Private candidate: registered official photogrammetry, northwest north-facing restaurant annex.
 * Each clipped mesh uses its stable source-row identity: vertices are already in world space.
 * R3 native sign and source/photo proportional fit; dormitory main entrance remains unregistered. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,M=Y.M,G=Y.Geo,ID='way/240832236';
function frame(){const B=Y.Building032;return{local:p=>{const q=B.local([p[0],p[2]]);return[q[0],p[1],q[1]];},world:(u,y,v)=>{const p=B.world(u,v);return[p[0],y,p[1]];}};}
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

const layout={minU:0,maxU:9.0,front:-3.8,roof:4.5,opening:[3.20,8.10,.64,3.56],scanOffset:[2.75,1.85],groundEllipsoid:27.1};

// Original official-photo pixels live in independent array layer 6. No atlas mutation.
const signSource321={photoSHA256:'58e01d4e1147f884fb82402f5211bcf23a718fe13114c78472a4aa4cf44c22b7',crop:[138,27,414,58],pixelSHA256:'482f5d6bf9fa37ef844241a9c31e48487a2aa294478b882270bc8e99ce8924c8',size:[414,58],arraySize:[1024,512],layer:6,material:54,pixelScale:4.9/344,centreU:9-(345-49)*(4.9/344),centreY:4.225,front:-3.984};
function sign321(b,fr,emit){
 const S=signSource321,[w,h]=S.size,uv=[0,h/512,w/1024,-h/512],hw=w*S.pixelScale/2,hh=h*S.pixelScale/2,g=new G.Geometry();
 // North photo-left is +u; array source top is v=0 because upload does not flip Y.
 g.quad(fr.world(S.centreU+hw,S.centreY-hh,S.front),fr.world(S.centreU-hw,S.centreY-hh,S.front),fr.world(S.centreU-hw,S.centreY+hh,S.front),fr.world(S.centreU+hw,S.centreY+hh,S.front));emit('native-sign321',g,'#ffffff',54,uv);
}
function annex(fr,emit){const groups=new Map();function box(key,c,mat,u,y,v,w,h,d){if(!groups.has(key))groups.set(key,{g:new G.Geometry(),c,mat});const g=groups.get(key).g,mesh=G.box(),origin=fr.world(0,0,0),du=M.sub(fr.world(1,0,0),origin),dv=M.sub(fr.world(0,0,1),origin);for(let i=0;i<mesh.v.length;i+=8){const a=mesh.v;g.vertex(fr.world(u+a[i]*w,y+a[i+1]*h,v+a[i+2]*d),[du[0]*a[i+3]+dv[0]*a[i+5],a[i+4],du[2]*a[i+3]+dv[2]*a[i+5]],a.slice(i+6,i+8));}}
const q=layout,[left,right,bottom,top]=q.opening,w=right-left,c=(left+right)/2,stone='#c7cbc6',frame='#353c39';
box('side-walls',stone,24,.12,2.15,-1.9,.24,4.3,3.8);box('side-walls',stone,24,q.maxU-.12,2.15,-1.9,.24,4.3,3.8);
box('piers',stone,24,left/2,2.15,q.front,left,4.3,.28);box('piers',stone,24,(right+q.maxU)/2,2.15,q.front,q.maxU-right,4.3,.28);
box('lintel',stone,24,c,(top+4.3)/2,q.front,w,4.3-top,.28);box('roof',stone,24,q.maxU/2,4.34,-1.94,q.maxU+.16,.18,4.04);
box('sign-board','#302d2b',24,q.maxU/2,4.225,-3.93,q.maxU-.05,.85,.1);
// Four shallow treads, with the centre red runner visible in the photograph.
for(let i=0;i<4;i++){const h=(i+1)*.16,v=-5.15+i*.34,d=1.5-i*.34;box('steps','#b8bebd',24,c,h/2,v+d/2,w+.6,h,d);box('runner','#b73536',24,c,h+.008,v+.165,w*(2.95/5.5),.016,.33);}
box('landing','#b8bebd',24,c,.32,-3.5,w+.6,.64,.6);
// Glass is recessed behind the front aperture. No opaque panel spans it.
const glassV=-3.60;box('glass','#627a78',5,c,(bottom+top)/2,glassV,w-.12,top-bottom-.08,.035);
for(const x of[left,right,c-w*(.82/5.5),c+w*(.82/5.5)])box('door-frames',frame,29,x,(bottom+top)/2,-3.69,.085,top-bottom,.10);
for(const y of[bottom,top])box('door-frames',frame,29,c,y,-3.69,w,.085,.10);
box('door-frames',frame,29,c,(bottom+top)/2,-3.69,.055,top-bottom,.10);
for(const x of[c-.14,c+.14])box('door-frames','#b8b6aa',29,x,1.82,-3.79,.04,.46,.055);
// Pitched red fabric canopy, extending above the recessed glass.
if(!groups.has('canopy'))groups.set('canopy',{g:new G.Geometry(),c:'#b5333d',mat:24});const cg=groups.get('canopy').g;
cg.quad(fr.world(left-.16,3.21,-4.72),fr.world(right+.16,3.21,-4.72),fr.world(right+.16,3.72,-3.94),fr.world(left-.16,3.72,-3.94));
box('canopy','#b5333d',24,c,3.15,-4.72,w+.32,.12,.035);
for(const[key,r]of groups)emit(key,r.g,r.c,r.mat);
}
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==124)return prior.call(this,b,f,add);const old=b.e.add,ownAdd=Object.getOwnPropertyDescriptor(b.e,'add'),rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=prior.call(this,b,f,add);}finally{if(ownAdd)Object.defineProperty(b.e,'add',ownAdd);else delete b.e.add;}const fr=frame(),cuts=[{min:[.24,.64,-.5],max:[layout.maxU-.24,4.3,.5]}];let cutRecords=0,clippedSurvivors=0;const retainedGroups=new Map(),ordered=[];
// Only already world-baked, nonempty clipped records are grouped. Every shading
// parameter and detail-width value must match. Unchanged source records stay
// separate and keep their exact relative stream order. No triangle is removed.
for(const [sourceRow,r] of rows.entries()){
 const g=cutRecord(r,fr,cuts);
 if(!g){ordered.push({unchanged:r});continue;}
 cutRecords++;if(!g.v.length)continue;clippedSurvivors++;
 const signature=JSON.stringify([r.c,Array.from(r.p),r.uv?Array.from(r.uv):null,g.detailWidth===undefined?null:g.detailWidth]);
 let group=retainedGroups.get(signature);
 if(!group){const merged=new G.Geometry();if(g.detailWidth!==undefined)merged.detailWidth=g.detailWidth;
  group={key:'032-restaurant-retained-merged323-'+retainedGroups.size,g:merged,c:r.c,p:r.p,uv:r.uv,sourceRows:[]};retainedGroups.set(signature,group);ordered.push({merged:group});}
 group.g.v.push(...g.v);group.sourceRows.push(sourceRow);
}
for(const token of ordered){if(token.unchanged){const r=token.unchanged;old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}else{const r=token.merged;old.call(b.e,r.key,r.g,M.identity(),r.c,r.p,r.uv);}}
Y.Building032RestaurantMerge323={clippedSurvivors,groups:retainedGroups.size,sourceRows:[...retainedGroups.values()].map(g=>g.sourceRows)};
const emit=(key,g,c,mat,uv)=>old.call(b.e,'032-restaurant-candidate-'+key,g,M.identity(),c,[mat,124,0,0],uv);annex(fr,emit);sign321(b,fr,emit);return{...result,restaurantDoorPlaced:true,restaurantDoorFacing:'north',restaurantDoorRegion:'northwest',restaurantDimensionsProportional:true,dormMainDoorVerified:false,restaurantCutRecords:cutRecords};};Y.Building032RestaurantCandidate={frame,layout,annex,cutRecord,sign321,signSource321};
})(YY);
