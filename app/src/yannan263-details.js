/* Yannan 53: the photographed west-facing side-wing entry and gabled house.
 * Footprint comes from way/866277598; vertical dimensions remain display fits. */
(function(Y){'use strict';const original=Y.Architecture30.render,F=Y.Footprints,G=Y.Geo;
 const C={brick:'#a4a49b',stone:'#b3b4a9',wood:'#8b3029',glass:'#5f716e',roof:'#666c64'};
 function window(b,x,y,w=1.04,h=1.70,vertical=false){
  b.box(x,y,-.035,w-.12,h-.12,.035,C.glass,5,.75);
  for(const s of[-1,1]){b.box(x+s*(w/2-.045),y,.025,.09,h,.10,C.wood,20,.9);b.box(x,y+s*(h/2-.045),.025,w,.09,.10,C.wood,20,.9);}
  b.box(x,y,.05,vertical?.065:w,vertical?h:.065,.09,C.wood,20,.95);b.box(x,y-h/2-.09,.04,w+.20,.13,.26,C.stone,10,.92);
 }
 function lintel(b,x,y,w){const key='yannan263-segmental-lintel',g=b.geo(key,()=>{const q=new G.Geometry();for(let i=0;i<20;i++){const a=i/20,c=(i+1)/20,at=(t,r)=>[-.5+t,.15*Math.sin(Math.PI*t)+r,.04];q.quad(at(a,0),at(c,0),at(c,.17),at(a,.17));}return q;});b.mesh(key,g,x,y,0,w,1,1,C.brick,18,.8);}
 function wall(b,a,c,h,openings){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),r=-Math.atan2(dz,dx);
  b.local(a[0],0,a[1],r,()=>{
   const cuts=[0,len,...openings.flatMap(o=>[o.x-o.w/2,o.x+o.w/2])].sort((a,b)=>a-b);
   for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2;if(hi-lo<1e-6)continue;const holes=openings.filter(o=>mid>o.x-o.w/2&&mid<o.x+o.w/2).sort((a,b)=>a.low-b.low);let bottom=.04;for(const o of [...holes,{low:Array.isArray(h)?Infinity:h,high:h}]){if(o.low===Infinity){const top=u=>h[0]+(h[1]-h[0])*u/len,l=top(lo),r=top(hi),q=new G.Geometry(),A=[lo,bottom,-.22],B=[hi,bottom,-.22],D=[lo,l,-.22],E=[hi,r,-.22],a=[lo,bottom,0],c=[hi,bottom,0],d=[lo,l,0],e=[hi,r,0];q.quad(a,c,e,d);q.quad(B,A,D,E);q.quad(A,a,d,D);q.quad(c,B,E,e);q.quad(D,d,e,E);q.quad(A,B,c,a);b.mesh('yannan263-wall-top-'+[...a,...c,l,r].join('-'),q,0,0,0,1,1,1,C.brick,18,.6);}else if(o.low>bottom)b.box(mid,(bottom+o.low)/2,-.11,hi-lo,o.low-bottom,.22,C.brick,18,.6);bottom=Math.max(bottom,o.high);}}
   for(const o of openings)if(o.mainDoor)b.heritageDoor(o.x,.46,0,1.20,2.42,0,C.wood);else if(o.door)door(b,o.x);else{window(b,o.x,(o.low+o.high)/2,o.w,o.high-o.low);lintel(b,o.x,o.high,o.w+.15);}
   // Existing masonry belt vocabulary, fitted continuously to each actual wall.
   b.box(len/2,3.17,-.025,len,.16,.08,C.brick,18,1.0);
  });
 }
 function door(b,x){const bottom=.46,h=2.36,w=1.14,top=bottom+h;
  // One red leaf with two tall upper lights and a single recessed lower panel.
  for(const s of[-1,1])b.box(x+s*(w/2-.065),bottom+h/2,.015,.13,h,.12,C.wood,20,.9);
  b.box(x,top-.065,.015,w,.13,.12,C.wood,20,.9);b.box(x,bottom+.07,.015,w,.14,.12,C.wood,20,.9);
  b.box(x,bottom+.61,.0,w-.20,1.03,.09,C.wood,20,.9);
  for(const s of[-1,1])b.box(x+s*.244,bottom+1.70,.015,.34,1.01,.035,C.glass,5,.75);
  b.box(x,bottom+1.69,.035,.12,1.13,.11,C.wood,20,.95);b.box(x,bottom+1.11,.035,w,.13,.11,C.wood,20,.95);
  b.box(x,bottom+.61,.064,w-.30,.88,.025,'#782820',20,.95);
  b.sphere(x+w*.39,bottom+1.12,.12,.035,.035,.035,'#b3aaa0',9,.98,true);
  // Segmental masonry head closes the wall around an actual opening.
  const key='yannan263-door-head',geo=b.geo(key,()=>{const q=new G.Geometry();for(let i=0;i<24;i++){const u=-.5+i/24,v=-.5+(i+1)/24,y=t=>.13*Math.cos(t*Math.PI);q.quad([u,y(u),-.22],[v,y(v),-.22],[v,.30,-.22],[u,.30,-.22]);q.quad([v,y(v),0],[u,y(u),0],[u,.30,0],[v,.30,0]);q.quad([u,y(u),0],[v,y(v),0],[v,y(v),-.22],[u,y(u),-.22]);}return q;});b.mesh(key,geo,x,top,0,w+.16,1,1,C.brick,18,.8);lintel(b,x,top,w+.16);
  // Three solid risers reach the threshold, with low brick cheeks and stone caps.
  for(let j=0;j<3;j++){const height=(3-j)*.14+.04,z=.18+j*.29;b.box(x,height/2,z,1.52,height,.31,C.stone,10,.2);}
  for(const s of[-1,1]){b.box(x+s*.87,.22,.32,.22,.44,.80,C.brick,18,.2);b.box(x+s*.87,.46,.32,.28,.06,.84,'#818b83',10,.3);}
  b.box(x,.44,-.02,1.48,.08,.35,C.stone,10,.2);
  // The plate's literal address belongs above this door, not an invented balcony.
  b.box(x,3.16,.04,1.02,.26,.045,C.wood,20,.95);b.lettering('燕南园53号',x,3.16,.068,.94,.19,0,'#c6d4bd');
 }
 function house(b,p,ring){const main=[ring[0],ring[1],ring[2],ring[3]],annex=[ring[4],ring[5],ring[6],ring[7]],eave=6.1;
  const openings=ring.slice(1).map(()=>[]),win=(edge,x,low=1.02,high=2.72,w=1.04)=>openings[edge].push({x,w,low,high});
  const length=i=>Math.hypot(ring[i+1][0]-ring[i][0],ring[i+1][1]-ring[i][1]);
  // Visible west gable: five windows per storey, and three on its north return.
  for(const edge of[0,7])for(const low of[1.02,3.83])for(let i=0,n=edge===0?5:3;i<n;i++)win(edge,length(edge)*(i+.5)/n,low,low+1.70);
  // Unseen east/south sides retain the earlier regular-window interpretation.
  for(const edge of[1,2,4,5])for(const low of[1.02,3.83])for(let i=0,n=edge===1?4:2;i<n;i++)if((![4,5].includes(edge)||low<2)&&(edge!==1||low>2||i===0||i===n-1))win(edge,length(edge)*(i+.5)/n,low,low+1.70,.95);
  for(const offset of[-.9,.9])openings[1].push({x:length(1)/2+offset,w:1.40,low:.35,high:3.04,mainDoor:true});
  // Side wing west face, read left-to-right from the north: window then entry.
  win(6,1.30);win(6,4.1,3.83,5.30,1.04);openings[6].push({x:3.75,w:1.30,low:.40,high:3.12,door:true});
  const north=Math.min(...annex.map(p=>p[1]))-.525,south=Math.max(...annex.map(p=>p[1]))+.10,annexTop=z=>3.40+(z-north)*3/(south-north);
  for(let i=0;i<ring.length-1;i++)wall(b,ring[i],ring[i+1],i>=3&&i<=6?[annexTop(ring[i][1]),annexTop(ring[i+1][1])]:eave,openings[i]);
  const roof=(points,height,rise)=>{const xs=points.map(v=>v[0]),zs=points.map(v=>v[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs);const mesh=b.mesh;
   b.mesh=function(key,g,...args){if(key==='box'&&['#596253','#81634f'].includes(args[6]))args[6]=C.wood;if(key==='heritage-gable-wall'&&height===eave&&args[0]<0){const depth=z1-z0+.05,base=height-.09,cy=(6.79-base)/rise,hh=.95/rise/2,hw=.96/depth/2,outer=[[-.5,0],[0,1],[.5,0],[-.5,0]],hole=[[-hw,cy-hh],[hw,cy-hh],[hw,cy+hh],[-hw,cy+hh],[-hw,cy-hh]];g=new G.Geometry();for(const tri of F.capTriangles([outer,hole]))g.tri(...tri.map(q=>[0,q[1],q[0]]));key='yannan263-west-gable';}return mesh.call(this,key,g,...args);};
   try{b.heritageRoof((x0+x1)/2,height,(z0+z1)/2,x1-x0+1.05,z1-z0+1.05,rise,'gable',C.roof,true);}finally{b.mesh=mesh;}
   for(const x of[x0-.525,x1+.525])for(const z of[z0-.525,z1+.525])b.beam([x,height-.08,z],[x,height+rise,(z0+z1)/2],.12,C.wood,20,2);};
  roof(main,eave,1.59);
  // Documented north extension has a long slope descending toward one storey.
  const ax0=Math.min(...annex.map(p=>p[0]))-.525,ax1=Math.max(...annex.map(p=>p[0]))+.525,az0=Math.min(...annex.map(p=>p[1]))-.525,az1=Math.max(...annex.map(p=>p[1]))+.10,ay0=3.40,ay1=6.40;
  const longRoof=new G.Geometry();longRoof.quad([ax0,ay0,az0],[ax0,ay1,az1],[ax1,ay1,az1],[ax1,ay0,az0]);b.mesh('yannan263-long-roof',longRoof,0,0,0,1,1,1,C.roof,19,2);
  for(const x of[ax0,ax1])b.beam([x,ay0-.05,az0],[x,ay1-.05,az1],.12,C.wood,20,2);
  b.beam([ax0,ay0-.10,az0],[ax1,ay0-.10,az0],.12,C.wood,20,2);
  const tile=b.cache['heritage-eave-tile'];for(let x=ax0+.15;x<ax1-.1;x+=.245)for(let row=0;row<2;row++){const z=az0+.15+row*.28,y=ay0+(z-az0)*(ay1-ay0)/(az1-az0);b.mesh('heritage-eave-tile',tile,x,y,z,.18,.055,.35,C.roof,19,2.06);}
  // Upper return between the lower wing and main eaves closes the roof junction.
  b.box((ring[7][0]+ring[3][0])/2,5.89,(ring[7][1]+ring[3][1])/2,ring[3][0]-ring[7][0],.52,.22,C.brick,18,.6);
  const drainMesh=b.mesh;b.mesh=function(key,g,...args){if(args[6]==='#466554')args[6]=C.wood;return drainMesh.call(this,key,g,...args);};
  try{for(const x of[ring[0][0]-.06,ring[2][0]+.06])for(const z of[ring[0][1],ring[1][1]])b.heritageDrain(x,.04,z,eave-.04);}finally{b.mesh=drainMesh;}
  // The west gable light and side entrance coexist with the documented south
  // porch and three flat-capped dormers on each slope; the west photo alone
  // cannot establish their absence.
  const mx=(ring[1][0]+ring[2][0])/2,mz=(ring[0][1]+ring[1][1])/2;
  for(const side of[-1,1])for(const dx of[-3.8,0,3.8])b.local(mx+dx,0,mz+side*3.65,side<0?Math.PI:0,()=>{
   const base=6.27,height=1.08;b.box(-.60,base+height/2,-.45,.20,height,1.42,C.brick,18,2.3);b.box(.60,base+height/2,-.45,.20,height,1.42,C.brick,18,2.3);
   b.box(0,base+.13,.15,1.20,.26,.20,C.brick,18,2.3);b.box(0,base+height-.04,.15,1.20,.08,.20,C.brick,18,2.3);window(b,0,6.94,1.02,.72,true);
   b.box(0,base+height+.04,-.44,1.65,.15,1.72,C.stone,10,2.5);
  });
  const front=(ring[1][1]+ring[2][1])/2;b.local(mx,0,front,0,()=>{
   // Keep the registered rear edge (-.18), width and height. Reach the
   // highest tread rear (2.005) with 2mm overlap; the old front was 1.94.
   const platformBack=-.18,platformFront=2.007;
   b.box(0,.23,(platformBack+platformFront)/2,4.65,.46,platformFront-platformBack,C.stone,10,.2);
   for(const side of[-1,1])b.box(side*2.06,1.84,1.66,.42,2.76,.46,C.brick,18,.65);
   b.box(0,3.29,.94,4.70,.20,2.25,C.stone,10,1.2);b.box(0,3.76,1.94,4.50,.74,.25,C.brick,18,1.25);
   for(const side of[-1,1])b.box(side*2.12,3.76,.94,.25,.74,2.02,C.brick,18,1.25);
   for(let j=0;j<3;j++){const h=.46-j*.14;b.box(0,h/2,2.16+j*.29,3.85,h,.31,C.stone,10,.2);}
  });
  // Additional gable window visible in the west photograph.
  const mid=(ring[0][1]+ring[1][1])/2;b.local(ring[0][0]-.015,0,mid,-Math.PI/2,()=>window(b,0,6.79,.96,.95));
  b.local(ring[0][0]-.03,0,mid,-Math.PI/2,()=>b.heritagePlaque('53',-.86,5.23,.09,.40,.40,0,true));
 }
 Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==263||f.properties.id!=='way/866277598')return original.call(this,b,f,add);
  const fr=Y.ArchitectureAdapter.frame(f.geometry),cs=Math.cos(fr.r),sn=Math.sin(fr.r),ring=f.geometry.coordinates[0].map(([x,z])=>[cs*(x-fr.centre[0])-sn*(z-fr.centre[1]),sn*(x-fr.centre[0])+cs*(z-fr.centre[1])]);
  add('v30-footprint-base-263',F.surface(f.geometry,.045),'#b5bbae',10,263);
  return Y.ArchitectureAdapter.render(b,f,(builder,p)=>house(builder,p,ring),Y.ARCHIVE.legacy['853'],{name:'yannan263-photo-house',frame:fr,sourceFrame:{w:fr.w-.15,d:fr.d-.15,centre:[0,0]},keepHeight:true,preserveOuterParts:true});
 };
})(YY);
