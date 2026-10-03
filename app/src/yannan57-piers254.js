/* No.57: visible stone-pier silhouette from the archived 2024 official front
 * photograph. Seat the base on the retained step; concealed rear remains undecorated.
 * Front-only relief uses the official 2018 completed-gate photograph, cross-checked
 * against the archived 2024 gate photograph. Rear and animal detail stay plain. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,eq=(a,b)=>Math.abs(a-b)<1e-8;
// [height, half-width, half-depth, depth-centre offset]. The photograph's
// approximately 93px pier / 270px door cue sets exposed height near one third
// of the retained 2.63m leaf. Width/position stay unchanged; depth is fitted.
const profile=[[.165,.115,.19,0],[.365,.115,.19,0],[.385,.13,.16,.01],[.42,.14,.14,.02],[.49,.14,.135,.03],[.52,.115,.12,.03],[.76,.10,.09,.03],[.87,.075,.065,.03],[.92,.09,.075,.03],[.99,.085,.07,.03],[1.03,.09,.07,.03],[1.055,.07,.06,.03]];

// Visible front motif only: 2018 official completed-gate image
// https://jjgcb.pku.edu.cn/images/content/2018-05/20180530151518145853.jpg
// The 2024 view retains the same paired piers, circular flowers and lower curls.
// Fitted normalized height (base=0, crest=1): flower .567; curls .47.
// Relief depth, radial subdivisions and curve sampling are display fits, not
// a measured carving reconstruction. Existing contour and support remain intact.
function frontRelief(g){
 const face=y=>{for(let i=1;i<profile.length;i++)if(y<=profile[i][0]){const a=profile[i-1],b=profile[i],t=(y-a[0])/(b[0]-a[0]);return a[2]+a[3]+t*(b[2]+b[3]-a[2]-a[3]);}return .09;};
 // Closed narrow ribbon embedded 2mm into the established front surface.
 function ribbon(outer,inner,depth=.011){
  const point=(p,raised)=>[p[0],p[1],face(p[1])+(raised?depth:-.002)];
  for(let i=0;i<outer.length;i++){const j=(i+1)%outer.length,a=point(outer[i],1),b=point(outer[j],1),c=point(inner[j],1),d=point(inner[i],1),aa=point(outer[i],0),bb=point(outer[j],0),cc=point(inner[j],0),dd=point(inner[i],0);
   g.quad(a,b,c,d);g.quad(dd,cc,bb,aa);g.quad(aa,bb,b,a);g.quad(d,c,cc,dd);
  }
 }
 const ring=(r,w,lobes=0)=>{const out=[],inside=[];for(let i=0;i<96;i++){const a=i*Math.PI*2/96,rr=r+(lobes?.0055*Math.cos(lobes*a):0);out.push([rr*Math.cos(a),.665+rr*Math.sin(a)]);inside.push([(r-w)*Math.cos(a),.665+(r-w)*Math.sin(a)]);}ribbon(out,inside);};
 ring(.054,.014,16);ring(.023,.010);
 // Two simple visible lower curls; no invented animal face or hidden flanks.
 for(const side of[-1,1]){const line=[];for(let i=0;i<=40;i++){const t=i/40,a=-Math.PI*.65+t*Math.PI*2.05,r=.035*(1-.72*t);line.push([side*(.029+r*Math.cos(a)),.579+r*Math.sin(a)]);}
  const left=[],right=[];for(let i=0;i<line.length;i++){const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),w=.004;left.push([line[i][0]-dy/l*w,line[i][1]+dx/l*w]);right.push([line[i][0]+dy/l*w,line[i][1]-dx/l*w]);}
  // A polygon perimeter paired with its inset centre avoids an open tube end.
  const outline=left.concat(right.reverse()),quad=(...v)=>g.quad(...v.reverse());
  // Close each sampled strip with front, embedded back and side faces.
  const front=outline.map(q=>[q[0],q[1],face(q[1])+.009]),back=outline.map(q=>[q[0],q[1],face(q[1])-.002]);
  // Ribbon side strips plus finite end caps, without a self-crossing end seam.
  const n=line.length;for(let i=0;i<n-1;i++){const j=i+1,ri=2*n-1-i,rj=2*n-1-j;quad(front[i],front[j],front[rj],front[ri]);quad(back[ri],back[rj],back[j],back[i]);quad(back[i],back[j],front[j],front[i]);quad(front[ri],front[rj],back[rj],back[ri]);}
  quad(back[0],front[0],front[2*n-1],back[2*n-1]);quad(front[n-1],back[n-1],back[n],front[n]);
 }
}

function geometry(){
 const g=new Y.Geo.Geometry(),split=(.055+.19)/.38;
 // Six vertices carry the support-step seam through all bands: no T junctions.
 const ring=([y,w,d,c])=>{const back=c-d,front=c+d,z=back+(front-back)*split;return[[-w,y,back],[w,y,back],[w,y,z],[w,y,front],[-w,y,front],[-w,y,z]];};
 for(let i=0;i<profile.length-1;i++){const a=ring(profile[i]),b=ring(profile[i+1]);for(let j=0;j<6;j++){const k=(j+1)%6;g.quad(a[j],b[j],b[k],a[k]);}}
 const lo=ring(profile[0]),hi=ring(profile.at(-1));
 // The inherited threshold ends at gateZ+.355: rear bottom rests at .165,
 // front bottom at the adjacent .155 step, instead of burying a .01 base.
 g.quad(lo[0],lo[1],lo[2],lo[5]);
 const front=[lo[5],lo[2],lo[3],lo[4]],lower=front.map(p=>[p[0],.155,p[2]]);
 for(let j=0;j<4;j++){const k=(j+1)%4;g.quad(lower[j],front[j],front[k],lower[k]);}
 g.quad(...lower);
 g.quad(hi[5],hi[2],hi[1],hi[0]);g.quad(hi[4],hi[3],hi[2],hi[5]);frontRelief(g);return g;
}
A.render=function(b,f,add){
 if(f.properties.pickId!==5||f.properties.id!=='relation/11823278')return previous.call(this,b,f,add);
 const gate=b.heritageGate,own=Object.hasOwn(b,'heritageGate');
 b.heritageGate=function(p,z){
  if(p.houseNumber!==57)return gate.call(this,p,z);
  const mesh=this.mesh,had=Object.hasOwn(this,'mesh');
  this.mesh=function(k,g,x,y,zz,sx,sy,sz,color,mat,part,...rest){
   const position=eq(Math.abs(x),.83);
   if(position&&k==='box'&&color==='#a4ac9e'&&mat===10&&eq(y,.22)&&eq(zz,z+.30)&&eq(sx,.28)&&eq(sy,.42)&&eq(sz,.38)){
    const key='yannan57-pier254';return mesh.call(this,key,this.geo(key,geometry),x,0,z+.30,1,1,1,color,mat,part,...rest);
   }
   if(position&&k==='sphereSmooth'&&color==='#a7ada0'&&mat===10&&eq(y,.55)&&eq(zz,z+.33)&&eq(sx,.125)&&eq(sy,.14)&&eq(sz,.12))return;
   return mesh.call(this,k,g,x,y,zz,sx,sy,sz,color,mat,part,...rest);
  };
  try{return gate.call(this,p,z);}finally{if(had)this.mesh=mesh;else delete this.mesh;}
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.heritageGate=gate;else delete b.heritageGate;}
};
})(YY);
