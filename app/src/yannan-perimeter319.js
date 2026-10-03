/* Yannan perimeter: R4 stone-only revision; R3 continuous adjusted mapped S/E and N/W display fit.
 * Alignment/dimensions are not a survey. Photo-derived masonry, no gate arch.
 * Frozen research input SHA256 ebbf552195ba675b241b78264621fed7a8ab7d9e26ac8d7efc6c327d173fc1f2.
 * Keep campus and sport fence rendering intact; this addition owns pick 838 only. */
(function(Y){'use strict';
const INPUT={"segments":[{"id":"south-east-mapped-adjusted-display","evidence":"OSM way/1159153749 v1 current API 2026-09-30, mapped 2023-04-02; R2 display-width reconciliation: vertex0 advances1.6m on original line; v2 offset[-1.2,0],v3[-1,-1],v4[-.2,0],v5/v6[-.5,+.6],v7[+.8,+.6],v8 retreats1.5m then offsets[+.8,0]. All offsets metres, zero-based vertices. Necessary for full-width roads202/235/498/446/122 and SW465; preserve continuous chain. These adjustments are not new mapped measurements.","localXZ":[[-132.28049288344556,495.2342126350575],[-26.953446062849984,490.72798269221005],[-29.9213051671109,434.7332950116084],[-8.82299004886908,413.5028129667712],[-11.17439106165674,331.0048848773639],[-12.063677430148267,317.8588163961792],[-35.934045535773606,295.46316201385685],[-41.92753189128588,295.65192062772815],[-42.25665815726961,302.79134377225984]]},{"id":"north-display-fit","evidence":"Official preservation plan north red run affine registered to 13 building centres; RMS3.407m; line semantic uncertain, wall existence from official account + user observation; R2 placed at z312.0, 4.21m north to stay north of internal path234 and path255/256/257 ends including cap and unchanged0.15m margin. RMS3.407m is fit quality, not maximum allowed error; this 4.21m adjustment is explicitly recorded, not hidden inside a3.4m bound.","localXZ":[[-166.045,312.0],[-62.934,312.0]]},{"id":"west-display-fit-with-mapped-seam","evidence":"First four points direct plan fit; joins OSM way1153098574 first two points; last south-return connector display fitted inside south road, avoids closing existing SW gap. Public plan does not prove exact southwest corner. R3 local display offsets only: first two vertices0.8m west to clear50 body; vertex3 one metre north plus added corner one metre north of mapped seam-start to bypass trunk800748 without moving mapped west run; SW corner0.35m south clears trunk800719. No tree changes, no new openings.","localXZ":[[-199.168,334.149],[-195.70100000000002,365.068],[-186.485,365.738],[-183.027,413.043],[-178.0413466597492,413.9136405385558],[-178.0413466597492,414.9136405385558],[-175.37674742968122,477.61481074072316],[-174.7,494.25],[-138.89223488883596,493.6592929331943]]}],"entranceGaps":[{"id":"southwest","endpoints":[[-138.89223488883596,493.6592929331943],[-132.28049288344556,495.2342126350575]],"widthM":6.796727478217778,"confidence":"Mapped open distance; photographed southwest gate area. Gate posts/arch not established. R2 display endpoints adjusted; dimensions not surveyed gate widths."},{"id":"northwest","endpoints":[[-199.168,334.149],[-166.045,312.0]],"widthM":39.8460955427254,"confidence":"Broad open landscaped approach, NOT physical gate width. Preserve opening, do not bridge. R2 display endpoints adjusted; dimensions not surveyed gate widths."},{"id":"northeast","endpoints":[[-62.934,312.0],[-42.25665815726961,302.79134377225984]],"widthM":22.63518975404948,"confidence":"Broad road/landscape approach between map-fitted north and mapped east return, NOT surveyed gate width. Preserve opening, do not bridge. R2 display endpoints adjusted; dimensions not surveyed gate widths."}]};
const HEIGHT=1.8,THICK=.4,CAP=.08,OVER=.03,FOOT=.07,PALETTE=['#bab9b0','#b0aea3','#c3c1b7','#a7a69d','#bbb5a9','#b3b3ac'];
const dist=(p,a,c)=>{const x=c[0]-a[0],z=c[1]-a[1],d=x*x+z*z,t=d?Math.max(0,Math.min(1,((p[0]-a[0])*x+(p[1]-a[1])*z)/d)):0;return Math.hypot(p[0]-a[0]-t*x,p[1]-a[1]-t*z)};
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
function intersects(a,b,c,d){const u=[b[0]-a[0],b[1]-a[1]],v=[d[0]-c[0],d[1]-c[1]],w=[c[0]-a[0],c[1]-a[1]],den=cross(u,v);if(Math.abs(den)<1e-9)return false;const t=cross(w,v)/den,s=cross(w,u)/den;return t>=0&&t<=1&&s>=0&&s<=1;}
function terrain(x,z){if(!Y.Landscape42||typeof Y.Landscape42.walkElevation!=='function')throw new Error('Yannan perimeter requires existing terrain sampler');return Y.Landscape42.walkElevation(x,z);}
function segmentDistance(a,b,c,d){return intersects(a,b,c,d)?0:Math.min(dist(a,c,d),dist(b,c,d),dist(c,a,b),dist(d,a,b));}
function plan(D){
 const roads=D.features.filter(f=>f.properties.kind==='road'&&f.geometry.type==='LineString'),runs=[],roadChecks=[];
 for(const chain of INPUT.segments)for(let edge=1;edge<chain.localXZ.length;edge++){
  const a=chain.localXZ[edge-1],c=chain.localXZ[edge];
  for(const road of roads){const required=Math.max(.7,(road.properties.width||3)/2)+THICK/2+OVER+.15;let distance=Infinity;
   for(let k=1;k<road.geometry.coordinates.length;k++)distance=Math.min(distance,segmentDistance(a,c,road.geometry.coordinates[k-1],road.geometry.coordinates[k]));
   if(distance<required-1e-9)throw new Error('HOLD Yannan wall-road clearance: '+chain.id+'/'+edge+' road '+road.properties.pickId+' distance '+distance+' required '+required);
   if(distance<required+1)roadChecks.push({source:chain.id,edge,road:road.properties.pickId,distance,required,margin:distance-required});
  }
  runs.push({source:chain.id,edge,a,c,pickId:838});
 }
 return {runs,clearances:[],roadChecks,entranceGaps:INPUT.entranceGaps};
}
function meshes(D){
 const planned=plan(D),G=Y.Geo.Geometry,body=new G(),cap=new G(),stones=PALETTE.map(()=>new G());
 let seed=319;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(const run of planned.runs){
  const [a,c]=[run.a,run.c],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len;
  const p=(t,y,side)=>{const x=a[0]+ux*t-uz*side,z=a[1]+uz*t+ux*side;return[x,terrain(x,z)+y,z]};
  // Short terrain-following prisms share vertices mathematically; no hovering base.
  const n=Math.ceil(len/1.25);
  function prism(g,l,r,y0,y1,w){const A=p(l,y0,-w),B=p(r,y0,-w),C=p(r,y0,w),D=p(l,y0,w),E=p(l,y1,-w),F=p(r,y1,-w),H=p(r,y1,w),I=p(l,y1,w);g.quad(B,A,E,F);g.quad(D,C,H,I);g.quad(A,D,I,E);g.quad(C,B,F,H);g.quad(E,I,H,F);g.quad(D,A,B,C);}
  for(let j=0;j<n;j++){const l=len*j/n,r=len*(j+1)/n;prism(body,l,r,-FOOT,HEIGHT-CAP,THICK/2);prism(cap,l,r,HEIGHT-CAP,HEIGHT,THICK/2+OVER);}
  // R4: smaller rough rubble, photo-estimated 7-8 stones over the wall height.
  // Mixed sizes, chipped contours and shallow uneven crowns replace flat panels.
  // The masonry remains inside the independently checked 0.212m half-envelope.
  for(const side of [-1,1]){
   const rows=8,step=.30,cols=Math.ceil(len/step),sites=[];
   for(let row=0;row<rows;row++){sites[row]=[];for(let col=-1;col<=cols;col++)sites[row][col+1]={p:[(col+.5+(random()-.5)*.88+(row%2)*.5)*step,(row+.5+(random()-.5)*.84)*(HEIGHT-CAP)/rows],active:!(row>0&&row<rows-1&&col%4===row%4&&random()<.36)};}
   const clip=(poly,nx,ny,limit)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a[0]*nx+a[1]*ny-limit,db=b[0]*nx+b[1]*ny-limit;if(da<=0)out.push(a);if((da<0)!==(db<0)){const t=da/(da-db);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}}return out;};
   for(let row=0;row<rows;row++)for(let col=-1;col<=cols;col++){
    const site=sites[row][col+1];if(!site.active)continue;const center=site.p;let shape=[[.018,.018],[len-.018,.018],[len-.018,HEIGHT-CAP-.018],[.018,HEIGHT-CAP-.018]];
    for(let r=Math.max(0,row-2);r<=Math.min(rows-1,row+2);r++)for(let c=Math.max(-1,col-3);c<=Math.min(cols,col+3);c++){if(r===row&&c===col||!sites[r][c+1].active)continue;const q=sites[r][c+1].p,nx=q[0]-center[0],ny=q[1]-center[1],limit=(q[0]*q[0]+q[1]*q[1]-center[0]*center[0]-center[1]*center[1])/2-.012*Math.hypot(nx,ny);shape=clip(shape,nx,ny,limit);if(!shape.length)break;}
    if(shape.length<3)continue;const cx=shape.reduce((s,q)=>s+q[0],0)/shape.length,cy=shape.reduce((s,q)=>s+q[1],0)/shape.length;
    // Break long straight edges with uneven chips; variable corner setbacks avoid
    // identical router-cut bevels. All new points stay inside the inset cell.
    const outline=[];
    for(let k=0;k<shape.length;k++){const a=shape[k],b=shape[(k+1)%shape.length],t=.04+random()*.16,cut=[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];outline.push(cut);
     if(Math.hypot(b[0]-a[0],b[1]-a[1])>.17||random()<.20){const t=.35+random()*.32,q=[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])],inset=.02+random()*.075;outline.push([q[0]+(cx-q[0])*inset,q[1]+(cy-q[1])*inset]);}}
    const g=stones[Math.floor(random()*stones.length)],crown=p(cx,cy,side*(THICK/2+.006+random()*.006)),rim=outline.map(q=>p(q[0],q[1],side*(THICK/2+.00015+random()*.0028)));
    // One irregular crowned fan supplies physical rough face normals and a soft,
    // broken shoulder without spending three rings on a uniform bevel per stone.
    for(let k=0;k<rim.length;k++){const j=(k+1)%rim.length;if(side===1)g.tri(crown,rim[k],rim[j]);else g.tri(crown,rim[j],rim[k]);}
   }
  }
 }
 // Fill both sides of every internal corner with bounded bevel joins.
 // Each join remains inside the cap-radius disk: no endpoint extension or new gap.
 for(const chain of INPUT.segments)for(let j=1;j<chain.localXZ.length-1;j++){
  const prev=chain.localXZ[j-1],q=chain.localXZ[j],next=chain.localXZ[j+1],l0=Math.hypot(q[0]-prev[0],q[1]-prev[1]),l1=Math.hypot(next[0]-q[0],next[1]-q[1]),n0=[-(q[1]-prev[1])/l0,(q[0]-prev[0])/l0],n1=[-(next[1]-q[1])/l1,(next[0]-q[0])/l1];
  for(const side of [-1,1])for(const [g,w,lo,hi]of [[body,THICK/2,-FOOT,HEIGHT-CAP],[cap,THICK/2+OVER,HEIGHT-CAP,HEIGHT]]){
   let ring=[q,[q[0]+side*w*n0[0],q[1]+side*w*n0[1]],[q[0]+side*w*n1[0],q[1]+side*w*n1[1]]];
   const area=cross([ring[1][0]-q[0],ring[1][1]-q[1]],[ring[2][0]-q[0],ring[2][1]-q[1]]);if(Math.abs(area)<1e-10)continue;if(area>0)ring.reverse();
   const at=(p,y)=>[p[0],terrain(...p)+y,p[1]],bottom=ring.map(p=>at(p,lo)),top=ring.map(p=>at(p,hi));g.tri(...top);g.tri(bottom[2],bottom[1],bottom[0]);for(let k=0;k<3;k++){const m=(k+1)%3;g.quad(bottom[k],bottom[m],top[m],top[k]);}
  }
 }
 return {planned,entries:[{key:'yannan319-mortar',geo:body,color:'#d4d2c7'},{key:'yannan319-cap',geo:cap,color:'#a6aaa5'},...stones.map((geo,i)=>({key:'yannan319-stone-'+i,geo,color:PALETTE[i],material:21}))]};
}
function render(b,D){const built=meshes(D),old=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=838;b.anim=0;
 try{for(const e of built.entries)if(e.geo.v.length)b.mesh(e.key,b.geo(e.key,()=>e.geo),0,0,0,1,1,1,e.color,e.material===undefined?10:e.material);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return built.planned;
}
const original=Y.Fences35.render;
Y.Fences35.render=function(b,D){const result=original.call(this,b,D);render(b,D);return result;};
Y.YannanPerimeter319={plan,meshes,render,terrain,input:INPUT,dimensions:{height:HEIGHT,thickness:THICK,cap:CAP,overhang:OVER,foot:FOOT}};
})(YY);
