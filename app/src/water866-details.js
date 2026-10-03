/* Weixiu C-shaped pond. The mapped shoreline and every water triangle remain
 * unchanged in plan. Levels are relative display fits, not surveyed elevations. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,M=Y.M,ID='way/1030346272',PICK=866;
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID&&f.properties.pickId===PICK),ring=feature.geometry.coordinates[0],sign=Math.sign(F.area(ring));
const H={shore:.08,water:-.12,bottom:-.18};
function worldMesh(g,m){const out=new G.Geometry(),inv=M.inverse(m);for(let i=0;i<g.v.length;i+=8){const p=M.apply(m,[...g.v.slice(i,i+3),1]),n=g.v.slice(i+3,i+6),normal=M.norm([0,1,2].map(j=>inv[j*4]*n[0]+inv[j*4+1]*n[1]+inv[j*4+2]*n[2]));out.v.push(...p.slice(0,3),...normal,...g.v.slice(i+6,i+8));}return out;}
const clip=Y.Water244.createClip(ring),profile=Y.PondTerrainProfile.create(ring);let active=false,lastProfile=[];
function withCuts(engine,fn){const previous=engine.add;profile.begin();active=false;lastProfile=[];
 engine.add=function(k,g,m,c,p,uv){if(p[0]===0&&(p[1]===850||p[1]===858)&&k.startsWith('lawn-')){const world=m.every((v,i)=>v===(i%5===0?1:0))?g:worldMesh(g,m);profile.observe(world);const cut=clip(world);if(cut!==world)return previous.call(this,k+'-water866-cut',cut,M.identity(),c,p,uv);}return previous.call(this,k,g,m,c,p,uv);};
 try{return fn();}finally{engine.add=previous;}
}
function render(f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return false;active=true;
 add('water-866',F.surface(f.geometry,H.water),'#689a91',4,PICK);
 add('water866-bed',F.surface(f.geometry,H.bottom),'#757b67',10,PICK);return true;
}
function finish(add){if(!active)return;const g=new G.Geometry();lastProfile=[];
 for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=[-dz/len*sign,0,dx/len*sign],nodes=profile.segments(a,b);lastProfile.push({a,b,nodes});const at=(t,y)=>[a[0]+dx*t,y,a[1]+dz*t];
 for(let j=1;j<nodes.length;j++){const lo=nodes[j-1],hi=nodes[j];if(hi.t-lo.t<1e-9)continue;const points=sign>0?[at(lo.t,H.bottom),at(hi.t,H.bottom),at(hi.t,hi.y),at(lo.t,lo.y)]:[at(hi.t,H.bottom),at(lo.t,H.bottom),at(lo.t,lo.y),at(hi.t,hi.y)];g.quad(...points,n);}}
 // Exposed sections of existing ground; no invented raised coping or water wall.
 add('water866-ground-section',g,'#aeb4a4',10,PICK);active=false;
}
Y.Water866={feature,ring,H,withCuts,render,finish,get profile(){return lastProfile;}};
})(YY);
