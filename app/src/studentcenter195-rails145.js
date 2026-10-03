/* East stair handrails: official frontal photograph shows four parallel members
 * and a continuous junction with the brick parapet. Dimensions remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/445016209',PREFIX='studentcenter46-stair-bridge-';
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==195)return previous.call(this,b,f,add);
 const original=b.e.add,records=[],removed=[];
 b.e.add=function(k,g,m,c,p,uv){
  if(k.startsWith(PREFIX)||k.includes('studentcenter46-bridge-brick-parapet-'))records.push({k,g,m:Array.from(m),c,p:Array.from(p),uv});
  if(k.startsWith(PREFIX)&&(p[0]===9||k.includes('bridge-brick-parapet-')||(k.endsWith('-cyl8_1')&&p[0]===24))){removed.push({k,g,m:Array.from(m),c,p:Array.from(p),uv});return;}
  return original.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 const M=Y.M,G=Y.Geo,local=p=>{const q=Y.StudentCenterSouth46.local([p[0],p[2]]);return[q[0],p[1],q[1]];},point=(r,p)=>local(M.apply(r.m,[...p,1]));
 function bounds(r){const ps=[];for(let i=0;i<r.g.v.length;i+=8)ps.push(point(r,r.g.v.slice(i,i+3)));return[0,1,2].map(k=>[Math.min(...ps.map(p=>p[k])),Math.max(...ps.map(p=>p[k]))]);}
 const posts=removed.filter(r=>r.k.endsWith('-box')),caps=records.filter(r=>r.k.endsWith('-cyl8_1')&&r.p[0]===24),decks=records.filter(r=>r.k.endsWith('-box')&&r.p[0]===24).map(bounds);
 if(removed.length!==14||posts.length!==6||caps.length!==2||decks.length!==11)throw Error('studentcenter195 rails: upstream stair structure changed');
 const plans=[];
 for(const cap of caps){
  const oldEnd=point(cap,[0,1,0]),start=point(cap,[0,0,0]),v=oldEnd[2];
  const row=posts.filter(r=>Math.abs(point(r,[0,0,0])[2]-v)<.01).sort((a,b)=>point(b,[0,0,0])[0]-point(a,[0,0,0])[0]);
  const wall=records.find(r=>r.k.includes('studentcenter46-bridge-brick-parapet-')&&Math.abs((bounds(r)[2][0]+bounds(r)[2][1])/2-v)<.01);
  if(row.length!==3||!wall)throw Error('studentcenter195 rails: missing side registration');
  const oldWall=bounds(wall),front=point(row[0],[0,0,0])[0],frontTop=bounds(row[0])[1][1];
  if(Math.abs(oldEnd[0]-oldWall[0][1])>.002||oldEnd[0]>=front)throw Error('studentcenter195 rails: cap/parapet mismatch');
  // The landing includes its equal-height last tread, not only the long deck.
  const landingY=oldWall[1][0],landing=decks.filter(q=>Math.abs(q[1][1]-landingY)<.001&&v>=q[2][0]-1e-4&&v<=q[2][1]+1e-4);
  if(landing.length!==2)throw Error('studentcenter195 rails: landing union changed');
  const wallU=Math.max(...landing.map(q=>q[0][1])),end=[wallU,2.45+.14-.0325,v];
  const side=plans.length?'south':'north';
  function emit(name,g,color,mat){
   for(let i=0;i<g.v.length;i+=8){const w=Y.StudentCenterSouth46.world([g.v[i],g.v[i+2]]),n=Y.StudentCenterSouth46.world([g.v[i+3],g.v[i+5]]),o=Y.StudentCenterSouth46.world([0,0]);g.v[i]=w[0];g.v[i+2]=w[1];g.v[i+3]=n[0]-o[0];g.v[i+5]=n[1]-o[1];}
   original.call(b.e,'studentcenter195-rails145-'+name+'-'+side,g,M.identity(),color,[mat,195,0,0]);
  }
  const extended=new G.Geometry(),raw=wall.g.v,rawMin=Math.min(...raw.filter((_,i)=>i%8===0)),rawMax=Math.max(...raw.filter((_,i)=>i%8===0));
  for(let i=0;i<raw.length;i+=24){const ps=[0,8,16].map(k=>{const p=raw.slice(i+k,i+k+3);p[0]=rawMin+(p[0]-rawMin)*(wallU-rawMin)/(rawMax-rawMin);return p;});extended.tri(...ps,[0,8,16].map(k=>raw.slice(i+k+6,i+k+8)));}
  if(wall.g.detailWidth!==undefined)extended.detailWidth=wall.g.detailWidth;
  // Keep local coordinates, per-vertex UV, original matrix and UV transform.
  original.call(b.e,'studentcenter195-rails145-wall-'+side,extended,new Float32Array(wall.m),wall.c,wall.p,wall.uv);
  // Photograph resolves a rectangular stone coping; its overall kink remains
  // unregistered. Retain rear height, fit 14 cm thickness and 38 cm width.
  const capMesh=new G.Geometry(),rearY=oldWall[1][1],frontY=Math.min(...raw.filter((_,i)=>i%8===1&&Math.abs(raw[i-1]-rawMax)<.001&&raw[i]>landingY+.01)),capHeight=.14;
  end[1]=frontY+capHeight-.03-.0325-.015;
  const a=[rawMin,rearY-.03,v-.19],d=[wallU,frontY-.03,v-.19],c=[wallU,frontY-.03,v+.19],e=[rawMin,rearY-.03,v+.19],lift=p=>[p[0],p[1]+capHeight,p[2]],low=[a,d,c,e],high=low.map(lift);
  capMesh.quad(...low);capMesh.quad(...high.slice().reverse());for(let i=0;i<4;i++){const n=(i+1)%4;capMesh.quad(low[i],high[i],high[n],low[n]);}
  emit('cap',capMesh,cap.c,cap.p[0]);
  const slope=(end[1]-frontTop)/(end[0]-front),height=(u,j=0)=>frontTop+slope*(u-front)-j*.23;
  function floor(u){const hits=decks.filter(q=>u>=q[0][0]-1e-4&&u<=q[0][1]+1e-4&&v>=q[2][0]-1e-4&&v<=q[2][1]+1e-4);if(!hits.length)throw Error('studentcenter195 rails: unsupported post');return Math.max(...hits.map(q=>q[1][1]));}
  const g=new G.Geometry();
  // Closed rectangular rails, cut against the actual cap end plane / wall face.
  for(let j=0;j<4;j++){
   const size=j===0?.065:.045,frontU=front+.05,ring=[];
   for(const [dy,dv]of[[-size/2,-size/2],[size/2,-size/2],[size/2,size/2],[-size/2,size/2]]){
    const rearU=wallU-.012;
    ring.push([[frontU,height(frontU,j)+dy,v+dv],[rearU,height(rearU,j)+dy,v+dv]]);
   }
   const a=ring.map(q=>q[0]),z=ring.map(q=>q[1]);
   g.quad(...a);g.quad(...z.slice().reverse());for(let i=0;i<4;i++){const n=(i+1)%4;g.quad(z[i],z[n],a[n],a[i]);}
  }
  const postUs=[front,point(row[1],[0,0,0])[0],wallU+.05];
  for(const u of postUs){const lo=floor(u)-.004,hi=height(u)+.0325;const cube=G.box();for(let i=0;i<cube.v.length;i+=8){cube.v[i]=u+cube.v[i]*.10;cube.v[i+1]=(lo+hi)/2+cube.v[i+1]*(hi-lo);cube.v[i+2]=v+cube.v[i+2]*.11;}g.v.push(...cube.v);}
  emit('steel',g,row[0].c,9);
  plans.push({v,front,wallU,capEnd:end,postUs,postFloors:postUs.map(floor)});
 }
 return result;
};
Y.StudentCenter195Rails145={id:ID};
})(YY);
