/* Western Jingchun watercourse: native footprint with a fitted recessed level.
   Bank shape is a conservative terrain join, not a surveyed masonry reconstruction. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,ID='way/873446765',PICK=275,H={water:-.45,bottom:-.95},width=.50;
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID),ring=feature.geometry.coordinates[0],sign=Math.sign(F.area(ring)),edges=ring.slice(1).map((b,i)=>{const a=ring[i],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);return{a,b,n:[-dz/l*sign,dx/l*sign]};});
const outer=edges.map((e,i)=>{const p=edges[(i+edges.length-1)%edges.length],s=width/(1+e.n[0]*p.n[0]+e.n[1]*p.n[1]);return[e.a[0]-(e.n[0]+p.n[0])*s,e.a[1]-(e.n[1]+p.n[1])*s];});outer.push(outer[0]);
const profile=Y.PondTerrainProfile.create(outer),clip=Y.Water244.createClip(outer);let active=false,lastProfile=[];
function begin(){profile.begin();active=false;lastProfile=[];}

function render(f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return false;active=true;add('water-'+PICK,F.surface(f.geometry,H.water),'#689a91',4,PICK);add('water275-bed',F.surface(f.geometry,H.bottom),'#777a68',10,PICK);const side=new G.Geometry();for(const e of edges)side.quad([e.a[0],H.bottom,e.a[1]],[e.a[0],H.water,e.a[1]],[e.b[0],H.water,e.b[1]],[e.b[0],H.bottom,e.b[1]],[e.n[0],0,e.n[1]]);add('water275-submerged-side',side,'#8b8d79',10,PICK);return true;}
function finish(add){if(!active)return;const soil=new G.Geometry();lastProfile=edges.map((e,i)=>({edge:i,nodes:profile.segments(outer[i],outer[i+1])}));
 // Repeated t values encode a real vertical support step. Emit its one valid
 // triangle explicitly; never submit the coincident half of a collapsed quad.
 const tri=(g,a,b,c)=>{const n=Y.M.cross(Y.M.sub(b,a),Y.M.sub(c,a));if(Math.hypot(...n)>1e-10){if(sign<0)g.tri(a,c,b);else g.tri(a,b,c);}};
 for(let i=0;i<edges.length;i++){const e=edges[i],a=outer[i],b=outer[i+1],nodes=lastProfile[i].nodes,g=soil;const p=(n,out)=>out?[a[0]+(b[0]-a[0])*n.t,n.y,a[1]+(b[1]-a[1])*n.t]:[e.a[0]+(e.b[0]-e.a[0])*n.t,H.water,e.a[1]+(e.b[1]-e.a[1])*n.t];for(let j=1;j<nodes.length;j++){const s=nodes[j-1],t=nodes[j],A=p(s,false),B=p(t,false),C=p(t,true),D=p(s,true);tri(g,A,B,C);tri(g,A,C,D);}
 // Each edge samples its own one-sided support envelope. At a polygon corner
 // their endpoint heights may differ; close that vertical soil section too.
 const before=lastProfile[(i+edges.length-1)%edges.length].nodes.at(-1).y,after=nodes[0].y;tri(g,[e.a[0],H.water,e.a[1]],[a[0],after,a[1]],[a[0],before,a[1]]);
 }
 add('water275-natural-bank',soil,'#8b957c',0,PICK);active=false;}

Y.Water275={id:ID,pickId:PICK,ring,outer,heights:H,descriptor:{id:ID,ring:outer,clip,observe:profile.observe,begin},begin,render,finish,get profile(){return lastProfile;}};begin();
})(YY);
