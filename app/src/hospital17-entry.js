/* Chengfuyuan: registered to the northwest inner curve of hospital Block B.
 * 4K episode-1 footage reposted by the self-described unofficial PKUer channel
 * (YouTube A-ujaVZw4co, 2026-06-03), at 125s and 121s; 2020/2022
 * official entrance photographs independently identify the same doorway.
 * Door dimensions/heights remain photographic fits. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='relation/13059309';
const arc=[[361.25,-408.129],[355.912,-408.307],[354.716,-407.807],[353.486,-406.764],[352.47,-405.676],[351.966,-404.488],[351.659,-403.477],[351.582,-401.745]],origin=[353.486,-406.764],angle=-2.390,
 cs=Math.cos(angle),sn=Math.sin(angle),local=p=>[(p[0]-origin[0])*cs-(p[1]-origin[1])*sn,(p[0]-origin[0])*sn+(p[1]-origin[1])*cs];
function segment(p,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz);return t>-.0001&&t<1.0001&&Math.abs((p[0]-a[0])*dz-(p[1]-a[1])*dx)<.002;}
const onArc=p=>arc.slice(1).some((q,i)=>segment(p,arc[i],q));
function withoutArc(g){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(j=>[g.v[i+j],g.v[i+j+2]]);if(ps.every(onArc))continue;out.v.push(...g.v.slice(i,i+24));}return out;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);
 const addBase=(k,g,...args)=>add(k,/^v30-(walls|plinth)-17-hospital$/.test(k)?withoutArc(g):g,...args);
 A.footprint(b,f,addBase,{key:'hospital',style:'modern',roof:'flat',renderFacade:(builder,e)=>onArc(e.a)&&onArc(e.c)});b.id=17;
 // Only the photographed entrance approach; stop at the mapped footway edge.
 const path=Y.CAMPUS.features.find(q=>q.properties.pickId===699),[pa,pb]=path.geometry.coordinates,pdx=pb[0]-pa[0],pdz=pb[1]-pa[1],plen=Math.hypot(pdx,pdz),edge=[pa[0]-pdz/plen*path.properties.width/2,pa[1]+pdx/plen*path.properties.width/2],edgeAt=z=>edge[0]+pdx/pdz*(z-edge[1]),world=(u,y,v)=>[origin[0]+u*cs+v*sn,y,origin[1]-u*sn+v*cs];
 const approach=[world(-2.5,.03,1.25),world(2.5,.03,1.25),[edgeAt(-413),.12,-413],[edgeAt(-418),.12,-418]].reverse(),paving=new G.Geometry();
 paving.quad(...approach);const low=approach.map(q=>[q[0],.01,q[2]]);for(let i=0;i<4;i++){const j=(i+1)%4;paving.quad(low[i],low[j],approach[j],approach[i]);}paving.quad(...low.slice().reverse());
 add('hospital17-entrance-approach',paving,'#cbc7b7',7,17);
 const box=(key,...args)=>b.mesh(key,b.geo(key,G.box),...args);
 const glass=new G.Geometry(),lower=.03,top=f.properties.height,doorHalf=2.43,doorTop=3.02;
 // Keep the source polygonal curve: split each segment at the doorway jambs.
 for(let i=1;i<arc.length;i++){const a=arc[i-1],q=arc[i],ua=local(a)[0],uq=local(q)[0],cuts=[0,1];for(const u of[-doorHalf,doorHalf]){const t=(u-ua)/(uq-ua);if(t>0&&t<1)cuts.push(t);}cuts.sort((a,b)=>a-b);
  for(let j=1;j<cuts.length;j++){const p=t=>[a[0]+(q[0]-a[0])*t,a[1]+(q[1]-a[1])*t],l=p(cuts[j-1]),r=p(cuts[j]),inDoor=Math.abs(local(p((cuts[j-1]+cuts[j])/2))[0])<doorHalf;glass.quad([l[0],inDoor?doorTop:lower,l[1]],[r[0],inDoor?doorTop:lower,r[1]],[r[0],top,r[1]],[l[0],top,l[1]]);}
  const dx=q[0]-a[0],dz=q[1]-a[1],len=Math.hypot(dx,dz),r=-Math.atan2(dz,dx),n=Math.ceil(len/.8);
  for(let j=0;j<n;j++){const t=j/n,x=a[0]+dx*t,z=a[1]+dz*t,u=local([x,z])[0],lo=Math.abs(u)<doorHalf?doorTop:lower;b.local(x,0,z,r,()=>box('hospital17-curve-mullion',0,(lo+top)/2,.035,.055,top-lo,.07,'#bbc0b8',29));}
  for(const y of[3.2,6.4,10.1,13.5,17.5])b.local((a[0]+q[0])/2,0,(a[1]+q[1])/2,r,()=>box('hospital17-curve-transom',0,y,.035,len,.065,.07,'#bbc0b8',29));
 }
 add('hospital17-registered-curve-glass',glass,'#637572',28,17);
 // Photo-observed protruding glazed vestibule, four narrow framed leaves.
 b.local(origin[0],0,origin[1],angle,()=>{
  const rearAt=u=>{for(let i=1;i<arc.length;i++){const a=local(arc[i-1]),q=local(arc[i]);if((u-a[0])*(u-q[0])<=0){const t=(u-a[0])/(q[0]-a[0]);return a[1]+(q[1]-a[1])*t;}}throw Error('door jamb outside registered curve');};
  const left=rearAt(-doorHalf),right=rearAt(doorHalf),front=1.25,back=Math.min(left,right)-.08;
  box('hospital17-vestibule-floor',0,.015,(front+back)/2,5.0,.03,front-back,'#afb5a9',10);
  // The photographed fascia has a convex curved outer edge, not a box.
  const canopyFront=u=>1.67+Math.sqrt(81-u*u)-9;
  function curvedPlate(key,half,lo,hi,outset,col,mat){const g=new G.Geometry(),count=24;
   for(let i=0;i<count;i++){const x=-half+2*half*i/count,q=-half+2*half*(i+1)/count,az=canopyFront(x)+outset,bz=canopyFront(q)+outset,ar=rearAt(x)-.12,br=rearAt(q)-.12;
    g.quad([x,hi,az],[q,hi,bz],[q,hi,br],[x,hi,ar]);g.quad([x,lo,ar],[q,lo,br],[q,lo,bz],[x,lo,az]);
    g.quad([x,lo,az],[q,lo,bz],[q,hi,bz],[x,hi,az]);g.quad([q,lo,br],[x,lo,ar],[x,hi,ar],[q,hi,br]);
    if(i===0)g.quad([x,lo,ar],[x,lo,az],[x,hi,az],[x,hi,ar]);if(i===count-1)g.quad([q,lo,bz],[q,lo,br],[q,hi,br],[q,hi,bz]);
   }b.mesh(key,g,0,0,0,1,1,1,col,mat);
  }
  curvedPlate('hospital17-canopy',2.775,3.01,3.43,0,'#d3d3c8',24);
  curvedPlate('hospital17-canopy-glass-cap',2.85,3.43,3.49,.06,'#6f8176',28);
  const savedAdd=b.e.add;b.e.add=function(k,...args){return savedAdd.call(this,'hospital17-canopy-trim-'+k,...args);};
  try{for(let i=0;i<24;i++){const a=-2.775+5.55*i/24,q=-2.775+5.55*(i+1)/24;
   for(const y of[3.035,3.415])b.beam([a,y,canopyFront(a)+.015],[q,y,canopyFront(q)+.015],.045,'#b8c0b8',29);
  }}finally{b.e.add=savedAdd;}
  for(const side of[-1,1]){const rear=side<0?left:right;box('hospital17-vestibule-side',side*doorHalf,1.525,(front+rear)/2,.055,2.99,front-rear,'#748781',28);for(const z of[front,rear])box('hospital17-vestibule-post',side*doorHalf,1.525,z,.075,2.99,.075,'#b8c0b8',29);}
  const span=4.86;for(let i=0;i<4;i++){const x=-span/2+(i+.5)*span/4,w=span/4;box('hospital17-door-leaf',x,1.405,front,w-.045,2.75,.055,'#748781',28);for(const d of[-1,1])box('hospital17-door-stile',x+d*(w-.045)/2,1.405,front+.04,.055,2.75,.065,'#c3c8bf',29);for(const y of[.05,1.02,2.78])box('hospital17-door-rail',x,y,front+.04,w,.06,.065,'#c3c8bf',29);box('hospital17-door-handle',x+(i%2===0?.43:-.43),1.32,front+.105,.035,.42,.045,'#d3d6cd',29);}
  box('hospital17-vestibule-front-transom',0,2.90,front,4.86,.23,.055,'#748781',28);
  b.econCaption('成府园食堂',0,4.0,.82,5.0,.64,'hospital17-canteen-title','#d3c9b9',.6);
 });
 return{id:ID,strategy:'hospital-canteen',entryOnly:true,entryRegistered:true,doorLeaves:4,dimensionsMeasured:false};
};Y.Hospital17Entry={arc,origin,angle,local};
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID);if(feature){feature.properties.frontAngle46=angle;feature.properties.frontElevation46=.20;feature.properties.frontObservation46={target:[353.281159,2.3,-406.983181],bounds:[350.174737,0,-410.025074,356.387581,4.6,-403.941288],yaw:angle,elevation:.20};}

})(YY);
