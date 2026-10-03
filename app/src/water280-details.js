/* Connected west-gate waters and the mapped southern flat crossing.
 * Water depth/slab thickness are display fits. The 2017 small-flat-bridge
 * photograph supports a railing-free slab, not a known pier count. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo;
const ids=new Map([[35,'way/33457282'],[280,'way/876428132']]),features=[...ids].map(([pick,id])=>Y.CAMPUS.features.find(f=>f.properties.pickId===pick&&f.properties.id===id)),bridge=Y.CAMPUS.features.find(f=>f.properties.pickId===298&&f.properties.id==='way/970687416');
const H={water:-.55,bottom:-1.05,deck:.12,slab:.24},same=(a,b)=>a[0]===b[0]&&a[1]===b[1],edges=[];
for(const f of features){const r=f.geometry.coordinates[0],s=Math.sign(F.area(r));for(let i=1;i<r.length;i++){const a=r[i-1],b=r[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);edges.push({a,b,pick:f.properties.pickId,sign:s,n:[-(b[1]-a[1])/l*s,(b[0]-a[0])/l*s]});}}
const boundary=edges.filter(e=>!edges.some(q=>q!==e&&((same(e.a,q.b)&&same(e.b,q.a))||(same(e.a,q.a)&&same(e.b,q.b))))),profile=Y.PondTerrainProfile.create(features.flatMap(f=>f.geometry.coordinates[0]));let active=false,bridgeActive=false,lastProfile=[];
const descriptors=features.map((f,i)=>({id:f.properties.id,ring:f.geometry.coordinates[0],clip:Y.Water244.createClip(f.geometry.coordinates[0]),...(i?{}:{observe:profile.observe,begin(){profile.begin();active=false;bridgeActive=false;lastProfile=[];}})}));
function render(f,add){if(ids.get(f.properties.pickId)!==f.properties.id)return false;active=true;const pick=f.properties.pickId;add('water-'+pick,F.surface(f.geometry,H.water),'#689a91',4,pick);add('water280-bed-'+pick,F.surface(f.geometry,H.bottom),'#757b67',10,pick);return true;}
function renderRoad(f){if(f.properties.pickId!==298||f.properties.id!==bridge.properties.id)return false;bridgeActive=true;return true;}
function finish(add){if(!active)return;lastProfile=[];
 for(const pick of ids.keys()){const g=new G.Geometry();for(const e of boundary.filter(e=>e.pick===pick)){const nodes=profile.segments(e.a,e.b);lastProfile.push({pick,a:e.a,b:e.b,nodes});const at=(t,y)=>[e.a[0]+(e.b[0]-e.a[0])*t,y,e.a[1]+(e.b[1]-e.a[1])*t];for(let j=1;j<nodes.length;j++){const a=nodes[j-1],b=nodes[j];if(b.t-a.t>1e-9)g.quad(...(e.sign>0?[at(a.t,H.bottom),at(b.t,H.bottom),at(b.t,b.y),at(a.t,a.y)]:[at(b.t,H.bottom),at(a.t,H.bottom),at(a.t,a.y),at(b.t,b.y)]),[e.n[0],0,e.n[1]]);}}
 // Continuous cut faces close the terrain section. No invented coping frame,
 // rock arrangement or ornaments are extended around the unphotographed banks.
 add('water280-ground-section-'+pick,g,pick===35?'#959c8c':'#858c80',10,pick);}
 if(bridgeActive){const [a,b]=bridge.geometry.coordinates,dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len*bridge.properties.width/2,nz=dx/len*bridge.properties.width/2,ring=[[a[0]+nx,a[1]+nz],[b[0]+nx,b[1]+nz],[b[0]-nx,b[1]-nz],[a[0]-nx,a[1]-nz]];ring.push(ring[0]);const poly={type:'Polygon',coordinates:[ring]},top=H.deck,bottom=top-H.slab;
 add('water280-flat-bridge-top',F.surface(poly,top),'#b7b9ad',10,298);add('water280-flat-bridge-sides',F.walls(poly,bottom,top),'#a2a79a',10,298);const underside=F.surface(poly,bottom);for(let i=0;i<underside.v.length;i+=24){const p=underside.v.slice(i,i+8),q=underside.v.slice(i+16,i+24);for(let k=0;k<8;k++){underside.v[i+k]=q[k];underside.v[i+16+k]=p[k];}for(let j=0;j<24;j+=8)for(let k=3;k<6;k++)underside.v[i+j+k]*=-1;}add('water280-flat-bridge-under',underside,'#959b8e',10,298);
 }active=false;bridgeActive=false;}
Y.Water280={ids,features,bridge,H,boundary,descriptors,render,renderRoad,finish,get profile(){return lastProfile;}};
})(YY);
