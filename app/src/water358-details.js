/* Jingchun water west of the Humanities Hall. Exact mapped shoreline and road
 * top retained; water depth and the crossing's plain slab thickness are fits.
 * No unlocated bridge railings, piers or decorative bank frame are inferred. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo;
 const ID='way/1009052020',PICK=358,ROAD='way/1101010416',feature=Y.CAMPUS.features.find(f=>f.properties.id===ID&&f.properties.pickId===PICK),ring=feature.geometry.coordinates[0],sign=Math.sign(F.area(ring));
 const H={water:-.45,bottom:-.95,slab:.24},terrain=Y.PondTerrainProfile.create(ring);
 let active=false,deck=null,lastProfile=[];
 const descriptor={id:ID,ring,clip:Y.Water244.createClip(ring),observe:terrain.observe,begin(){terrain.begin();active=false;deck=null;lastProfile=[];}};
 function render(f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return false;active=true;add('water-'+PICK,F.surface(f.geometry,H.water),'#689a91',4,PICK);add('water358-bed',F.surface(f.geometry,H.bottom),'#757b67',10,PICK);return true;}
 function renderRoad(f,add,merged){
  if(f.properties.id!==ROAD||f.properties.pickId!==477)return false;
  const points=f.geometry.coordinates,index=points.findIndex((a,i)=>a[0]===67.554&&a[1]===-369.356&&points[i+1]?.[0]===67.315&&points[i+1]?.[1]===-356.476);
  if(index<0)throw Error('Water358 crossing source segment changed; recheck mapped overlap');
  const raw=Y.StudentCenterSouth46.clipGroundRibbon(Y.Landscape42.warp(G.ribbon(points,f.properties.width,.12,false))),start=index*48;
  // Only this original two-triangle segment intersects the water. All other
  // road triangles keep the normal merged roads / compound ground-cut path.
  deck=new G.Geometry();deck.v.push(...raw.v.slice(start,start+48));
  const rest=new G.Geometry();rest.v.push(...raw.v.slice(0,start),...raw.v.slice(start+48));merged('roads',rest,'#9a9f96',15);
  terrain.observe(deck);add('water358-crossing-top',deck,'#9a9f96',15,477);return true;
 }
 function finish(add){if(!active)return;lastProfile=[];const walls=new G.Geometry();
  for(let i=1;i<ring.length;i++){
   const a=ring[i-1],b=ring[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=[-dz/len*sign,0,dx/len*sign],nodes=terrain.segments(a,b);
   lastProfile.push({edge:i-1,nodes});const at=(p,y)=>[a[0]+dx*p.t,y,a[1]+dz*p.t];
   for(let j=1;j<nodes.length;j++){const p=nodes[j-1],q=nodes[j];if(q.t-p.t<=1e-9)continue;const ps=[at(p,H.bottom),at(q,H.bottom),at(q,q.y),at(p,p.y)];walls.quad(...(sign>0?ps:ps.slice().reverse()),n);}
  }
  add('water358-ground-section',walls,'#858c80',10,PICK);
  if(deck){
   const lower=new G.Geometry();for(let i=0;i<deck.v.length;i+=24)for(const offset of[0,16,8]){const v=deck.v.slice(i+offset,i+offset+8);v[1]-=H.slab;for(let j=3;j<6;j++)v[j]*=-1;lower.v.push(...v);}
   const sides=new G.Geometry(),top=[0,8,16,40].map(i=>deck.v.slice(i,i+3));
   for(let i=0;i<4;i++){const a=top[i],b=top[(i+1)%4],ua=[a[0],a[1]-H.slab,a[2]],ub=[b[0],b[1]-H.slab,b[2]];sides.quad(a,ua,ub,b);}
   add('water358-crossing-under',lower,'#959b90',15,477);add('water358-crossing-sides',sides,'#9a9f96',15,477);
  }
  active=false;deck=null;
 }
 Y.Water358={id:ID,pickId:PICK,feature,ring,H,descriptor,render,renderRoad,finish,get profile(){return lastProfile;}};
})(YY);
