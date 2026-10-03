/* Photo-fitted short paved approach: existing central stair foot to Road157 edge.
 * Width follows the fitted central stair; this is not a reconstruction of the full forecourt. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/272361848';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function half(poly,distance){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=distance(a),db=distance(b);if(da>=0)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}}return out;}
function nextUp(x){const f=new Float32Array([x]),bits=new Uint32Array(f.buffer);if(x===0)return 1.401298464324817e-45;bits[0]+=x>0?1:-1;return new Float32Array(bits.buffer)[0];}
function approach(stairs){
 const road=Y.CAMPUS.features.find(f=>f.properties.id==='way/272355331'&&f.properties.pickId===157),path=Y.CAMPUS.features.find(f=>f.properties.id==='way/1151417013'&&f.properties.pickId===541);
 if(!road||!path||road.properties.width!==4||path.properties.width!==2||!same(road.geometry.coordinates,[[-133.11,89.982],[-134.4,43.526],[-135.203,14.446]])||!same(path.geometry.coordinates,[[-177.017,43.57],[-134.4,43.526]]))throw Error('Russian 163 approach road registration changed');
 if(stairs.length!==4||stairs.some(r=>r.p[1]!==163||r.m.length!==16||Array.from(r.m).some(v=>!Number.isFinite(v))))throw Error('Russian 163 approach requires the four registered central treads');
 const step=stairs.slice().sort((a,b)=>a.m[13]-b.m[13])[0],m=step.m;
 const toe=[-.5,.5].map(x=>M.apply(m,[x,0,.5,1]).slice(0,3));
 const rw=Y.Landscape42.warp(G.ribbon(road.geometry.coordinates,4,.12,false)),raw=new Float32Array(rw.v),expected=new Float32Array(G.ribbon(road.geometry.coordinates,4,.12,false).v);
 if(raw.length!==96||raw.some((v,i)=>i%8<3&&v!==expected[i])||toe.some(p=>Y.Landscape42.walkElevation(p[0],p[2])!==0))throw Error('Russian 163 approach terrain changed');
 const edge=i=>[Array.from(raw.slice(i*48,i*48+3)),Array.from(raw.slice(i*48+8,i*48+11))],edges=[edge(0),edge(1)],joint=edges[0][1][2];
 const axis=M.norm([path.geometry.coordinates[1][0]-path.geometry.coordinates[0][0],0,path.geometry.coordinates[1][1]-path.geometry.coordinates[0][1]]);
 // A bounded strip follows the existing footway axis, then is cut at the actual service-road edge.
 const strip=[toe[0],toe[1],toe[1].map((v,i)=>v-axis[i]*5.5),toe[0].map((v,i)=>v-axis[i]*5.5)].map(p=>[p[0],.12,p[2]]),g=new G.Geometry();
 const side=(p,e)=>(e[1][0]-e[0][0])*(p[2]-e[0][2])-(e[1][2]-e[0][2])*(p[0]-e[0][0]);
 for(let j=0;j<2;j++){
  let poly=half(strip,p=>j?joint-p[2]:p[2]-joint);poly=half(poly,p=>side(p,edges[j]));
  poly=poly.map(p=>{const q=p.map(Math.fround);if(side(q,edges[j])<0)q[0]=nextUp(q[0]);return q;});
  for(let i=1;i+1<poly.length;i++){let tri=[poly[0],poly[i],poly[i+1]];const cross=M.cross(M.sub(tri[1],tri[0]),M.sub(tri[2],tri[0]));if(Math.hypot(...cross)<1e-9)continue;if(cross[1]<0)tri=[tri[0],tri[2],tri[1]];g.tri(...tri,tri.map(p=>[p[0],p[2]]));}
 }
 if(!g.v.length||g.v.some(v=>!Number.isFinite(v)))throw Error('Russian 163 approach has invalid geometry');
 return g;
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const emit=b.e.add,descriptor=Object.getOwnPropertyDescriptor(b.e,'add'),stairs=[];let result;
 b.e.add=function(k,g,m,c,p,uv){if(k==='russian163-stairs197-central')stairs.push({m:new Float32Array(m),p:[...p]});return emit.call(this,k,g,m,c,p,uv);};
 try{result=previous.call(this,b,f,add);}finally{if(descriptor)Object.defineProperty(b.e,'add',descriptor);else delete b.e.add;}
 const g=approach(stairs);emit.call(b.e,'russian163-paving198-approach',g,M.identity(),'#bec1b9',[7,163,0,0]);
 return{...result,paving198:{scope:'central stair foot to road157 only',widthPhotoFitted:true,fullForecourtVerified:false}};
};Y.Russian163Paving198={approach};})(YY);
