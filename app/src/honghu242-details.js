/* Red Lake: native water footprint, fitted negative water level, terrain-cut
   sloped banks. Only the photographed northeast segment receives stone finish. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,ID='way/679485576',PICK=242,H={water:-.45,bottom:-.95},width=.90;
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID),ring=feature.geometry.coordinates[0],sign=Math.sign(F.area(ring)),edges=ring.slice(1).map((b,i)=>{const a=ring[i],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);return{a,b,n:[-dz/l*sign,dx/l*sign]};});
const outer=edges.map((e,i)=>{const p=edges[(i+edges.length-1)%edges.length],s=width/(1+e.n[0]*p.n[0]+e.n[1]*p.n[1]);return[e.a[0]-(e.n[0]+p.n[0])*s,e.a[1]-(e.n[1]+p.n[1])*s];});outer.push(outer[0]);
const profile=Y.PondTerrainProfile.create(outer),clip=Y.Water244.createClip(outer);let active=false,lastProfile=[];
function begin(){profile.begin();active=false;lastProfile=[];}

function render(f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return false;active=true;add('water-'+PICK,F.surface(f.geometry,H.water),'#689a91',4,PICK);add('honghu242-bed',F.surface(f.geometry,H.bottom),'#777a68',10,PICK);const side=new G.Geometry();for(const e of edges)side.quad([e.a[0],H.bottom,e.a[1]],[e.a[0],H.water,e.a[1]],[e.b[0],H.water,e.b[1]],[e.b[0],H.bottom,e.b[1]],[e.n[0],0,e.n[1]]);// The native CCW ring needs the opposite triangle winding to face the water.
 // Move complete vertex records so positions, normals and UVs stay paired.
 if(sign>0)for(let i=0;i<side.v.length;i+=24)for(let j=0;j<8;j++){const v=side.v[i+8+j];side.v[i+8+j]=side.v[i+16+j];side.v[i+16+j]=v;}
 add('honghu242-submerged-side',side,'#8b8d79',10,PICK);return true;}
// The official photo establishes broad low rock faces, not measured individual
// blocks. Fitted1–2m faces and <=.14m relief retain the continuous bank beneath.
function rockFaces(){const meshes=[new G.Geometry(),new G.Geometry(),new G.Geometry()],qs=[0,.16,.48,.83,1],qLift=[0,.75,1,.68,0],us=[0,.20,.65,.86,1],uLift=[0,.5,1,.3,0];
 for(let i=1;i<4;i++){const e=edges[i],a=outer[i],b=outer[i+1],nodes=lastProfile[i].nodes,len=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),count=Math.ceil(len/1.55),marks=Array.from({length:count+1},(_,j)=>j===0?0:j===count?1:j/count+.16*Math.sin(j*2.31+i)/len);
 for(let k=0;k<count;k++){const lo=marks[k]+.008/len,hi=marks[k+1]-.008/len,amp=.14*(.84+.16*Math.sin(k*1.73+i)),g=meshes[(k+i)%3],breaks=qs.map(q=>lo+(hi-lo)*q);for(const n of nodes)if(n.t>lo&&n.t<hi)breaks.push(n.t);breaks.sort((a,b)=>a-b);
 const point=(t,u,uy)=>{const q=(t-lo)/(hi-lo);let j=1;while(j<qs.length-1&&q>qs[j])j++;const lift=qLift[j-1]+(qLift[j]-qLift[j-1])*(q-qs[j-1])/(qs[j]-qs[j-1]);let n=1;while(n<nodes.length-1&&t>nodes[n].t+1e-10)n++;const p=nodes[n-1],r=nodes[n],v=(t-p.t)/(r.t-p.t),base=H.water+(u<=v?(r.y-H.water)*u:(r.y-p.y)*v+(p.y-H.water)*u),inner=[e.a[0]+(e.b[0]-e.a[0])*t,e.a[1]+(e.b[1]-e.a[1])*t],out=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];return[inner[0]+(out[0]-inner[0])*u,base+amp*lift*uy,inner[1]+(out[1]-inner[1])*u];};
 for(let j=1;j<breaks.length;j++){if(breaks[j]-breaks[j-1]<1e-10)continue;for(let u=1;u<us.length;u++)g.quad(point(breaks[j-1],us[u-1],uLift[u-1]),point(breaks[j],us[u-1],uLift[u-1]),point(breaks[j],us[u],uLift[u]),point(breaks[j-1],us[u],uLift[u]));}
 }}return meshes;}
function finish(add){if(!active)return;const soil=new G.Geometry(),stone=new G.Geometry();lastProfile=edges.map((e,i)=>({edge:i,nodes:profile.segments(outer[i],outer[i+1])}));
 // Repeated t values encode a real vertical support step. Emit its one valid
 // triangle explicitly; never submit the coincident half of a collapsed quad.
 const tri=(g,a,b,c)=>{const n=Y.M.cross(Y.M.sub(b,a),Y.M.sub(c,a));if(Math.hypot(...n)>1e-10)g.tri(a,b,c);};
 for(let i=0;i<edges.length;i++){const e=edges[i],a=outer[i],b=outer[i+1],nodes=lastProfile[i].nodes,g=i>=1&&i<4?stone:soil;const p=(n,out)=>out?[a[0]+(b[0]-a[0])*n.t,n.y,a[1]+(b[1]-a[1])*n.t]:[e.a[0]+(e.b[0]-e.a[0])*n.t,H.water,e.a[1]+(e.b[1]-e.a[1])*n.t];for(let j=1;j<nodes.length;j++){const s=nodes[j-1],t=nodes[j],A=p(s,false),B=p(t,false),C=p(t,true),D=p(s,true);tri(g,A,B,C);tri(g,A,C,D);}
 // Each edge samples its own one-sided support envelope. At a polygon corner
 // their endpoint heights may differ; close that vertical soil section too.
 const before=lastProfile[(i+edges.length-1)%edges.length].nodes.at(-1).y,after=nodes[0].y;tri(g,[e.a[0],H.water,e.a[1]],[a[0],after,a[1]],[a[0],before,a[1]]);
 }
 add('honghu242-natural-bank',soil,'#8b957c',0,PICK);add('honghu242-northeast-stone-bank',stone,'#aeafa0',10,PICK);rockFaces().forEach((g,i)=>add('honghu242-northeast-rock-face-'+i,g,['#bcbca6','#aeb29b','#c3c0aa'][i],10,PICK));active=false;}

Y.Honghu242={id:ID,pickId:PICK,ring,outer,heights:H,descriptor:{id:ID,ring:outer,clip,observe:profile.observe,begin},begin,render,finish,get profile(){return lastProfile;}};begin();
})(YY);
