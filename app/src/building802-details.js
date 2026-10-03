/* Yannan65: historical photogrammetry establishes hip roof, projecting gable
 * window bay, recessed adjoining entry and dormers. Dimensions are fitted.
 * 2026 completed restoration elevations remain unverified. */
(function(Y){'use strict';const previous=Y.Architecture30.render,M=Y.M,G=Y.Geo;
 const C={brick:'#a4a49b',stone:'#b3b4a9',wood:'#683b32',trim:'#9b5848',roof:'#666c64',glass:'#5f716e'},H={floor:.42,eave:2.95,ridge:5.10},EPS=1e-8;
 function clip(poly,fn,positive=true){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a)*(positive?1:-1),db=fn(b)*(positive?1:-1);if(da>=-EPS)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}}return out;}
 function plane(poly){const a=poly[0],n=M.cross(M.sub(poly[1],a),M.sub(poly[2],a));return (x,z)=>a[1]-(n[0]*(x-a[0])+n[2]*(z-a[2]))/n[1];}
 function upperPieces(poly,other){const area=other.p.reduce((s,p,i)=>{const q=other.p[(i+1)%other.p.length];return s+p[0]*q[2]-q[0]*p[2];},0),sign=area>0?1:-1,tests=other.p.map((a,i)=>{const b=other.p[(i+1)%other.p.length];return p=>sign*((b[0]-a[0])*(p[2]-a[2])-(b[2]-a[2])*(p[0]-a[0]));});tests.push(p=>other.height(p[0],p[2])-p[1]-1e-7);let inside=poly;const outside=[];for(const fn of tests){const part=clip(inside,fn,false);if(part.length>=3)outside.push(part);inside=clip(inside,fn,true);if(inside.length<3)break;}return outside;}
 function hip(x0,x1,z0,z1,y,rise){const mx=(x0+x1)/2,mz=(z0+z1)/2,r=Math.max(0,(x1-x0-(z1-z0))/2),a=[x0,y,z0],b=[x1,y,z0],c=[x1,y,z1],d=[x0,y,z1],l=[mx-r,y+rise,mz],h=[mx+r,y+rise,mz];return [[a,b,h,l],[b,c,h],[c,d,l,h],[d,a,l]];}
 function roofFacets(){const p=hip(-6.95,5.45,-6.2,4.15,H.eave,H.ridge-H.eave);p.push([[-6.15,H.eave,1.3],[-2.85,4.42,1.3],[-2.85,4.42,5.94],[-6.15,H.eave,5.94]],[[-2.85,4.42,1.3],[.45,H.eave,1.3],[.45,H.eave,5.94],[-2.85,4.42,5.94]]);p.push(...hip(.90,3.25,.40,2.95,4.15,.57));p.push(...hip(-.25,1.45,-4.65,-2.80,4.03,.46));return p.map(p=>({p,height:plane(p)}));}
 function baseHeight(x,z){const mx=-.75,mz=-1.025;return H.eave+(H.ridge-H.eave)*Math.max(0,Math.min((x+6.95)/5.175,(5.45-x)/5.175,(z+6.2)/5.175,(4.15-z)/5.175));}
 const FACETS=roofFacets();
 function roofAt(x,z){let y=-Infinity;for(const f of FACETS){const signs=f.p.map((a,i)=>{const b=f.p[(i+1)%f.p.length];return (b[0]-a[0])*(z-a[2])-(b[2]-a[2])*(x-a[0]);});if(signs.every(t=>t>=-1e-7)||signs.every(t=>t<=1e-7))y=Math.max(y,f.height(x,z));}return y;}
 function roofBand(b,a,c,base,key){const len=Math.hypot(c[0]-a[0],c[1]-a[1]),cuts=[0,1],dx=c[0]-a[0],dz=c[1]-a[1];for(const f of FACETS)for(let i=0;i<f.p.length;i++){const p=f.p[i],q=f.p[(i+1)%f.p.length],ex=q[0]-p[0],ez=q[2]-p[2],den=dx*ez-dz*ex;if(Math.abs(den)<EPS)continue;const t=((p[0]-a[0])*ez-(p[2]-a[1])*ex)/den,u=((p[0]-a[0])*dz-(p[2]-a[1])*dx)/den;if(t>EPS&&t<1-EPS&&u>=-EPS&&u<=1+EPS)cuts.push(t);} // Include plane-height crossover positions, not a coarse regular sample.
 for(let i=0;i<FACETS.length;i++)for(let j=0;j<i;j++){const da=FACETS[i].height(...a)-FACETS[j].height(...a),dc=FACETS[i].height(...c)-FACETS[j].height(...c),t=da/(da-dc);if(t>EPS&&t<1-EPS)cuts.push(t);}cuts.sort((a,b)=>a-b);const g=new G.Geometry();for(let i=1;i<cuts.length;i++){const l=cuts[i-1],h=cuts[i];if(h-l<1e-7)continue;const p=[a[0]+dx*l,a[1]+dz*l],q=[a[0]+dx*h,a[1]+dz*h],bp=typeof base==='function'?base(...p):base,bq=typeof base==='function'?base(...q):base,yp=Math.max(bp,roofAt(...p)),yq=Math.max(bq,roofAt(...q));if(!Number.isFinite(yp+yq)||Math.max(yp-bp,yq-bq)<1e-6)continue;const pts=[[p[0],bp,p[1]],[q[0],bq,q[1]],[q[0],yq,q[1]],[p[0],yp,p[1]]];for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>pts[k]);if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))>1e-8)g.tri(...t,t.map(v=>[v[0]+v[2],v[1]]));}}b.mesh(key,g,0,0,0,1,1,1,C.brick,18,1.85);}
 function roofMesh(facets){const geo=new G.Geometry();function emit(points){const t=points.map(p=>p.map(Math.fround));if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))>1e-10)geo.tri(...t,t.map(p=>[p[0],p[2]]));}function tri(a,b,c){if(M.cross(M.sub(b,a),M.sub(c,a))[1]<0)[b,c]=[c,b];const len=Math.max(Math.hypot(...M.sub(b,a)),Math.hypot(...M.sub(c,a)),Math.hypot(...M.sub(c,b))),n=Math.max(1,Math.ceil(len/.42)),point=(i,j)=>a.map((v,k)=>v+(b[k]-v)*i/n+(c[k]-v)*j/n);for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){let t=[point(i,j),point(i+1,j),point(i,j+1)];emit(t);if(j<n-i-1){t=[point(i+1,j),point(i+1,j+1),point(i,j+1)];emit(t);}}}
  for(let i=0;i<facets.length;i++){let pieces=[facets[i].p];for(let j=0;j<facets.length;j++)if(i!==j)pieces=pieces.flatMap(p=>upperPieces(p,facets[j]));for(const p of pieces)for(let k=1;k<p.length-1;k++)if(Math.hypot(...M.cross(M.sub(p[k],p[0]),M.sub(p[k+1],p[0])))>1e-7)tri(p[0],p[k],p[k+1]);}return geo;
 }
 function window(b,x,low,high,w,lights=2){const h=high-low,y=(high+low)/2;b.box(x,y,-.008,w-.10,h-.10,.04,C.glass,5,.75);for(const s of[-1,1]){b.box(x+s*(w/2-.045),y,.04,.09,h,.11,C.wood,20,.9);b.box(x,y+s*(h/2-.045),.04,w,.09,.11,C.wood,20,.9);}for(let i=1;i<lights;i++)b.box(x-w/2+w*i/lights,y,.065,.048,h-.1,.08,C.trim,20,.95);for(const yy of[low+h*.34,low+h*.70])b.box(x,yy,.065,w-.12,.045,.08,C.trim,20,.95);b.box(x,low-.065,.04,w+.20,.13,.25,C.stone,10,.92);}
 function wall(b,a,c,openings=[],bottom=H.floor,top=H.eave,tag='wall'){const len=Math.hypot(c[0]-a[0],c[1]-a[1]);[a,c]=[c,a];openings=openings.map(o=>({...o,x:len-o.x}));const r=-Math.atan2(c[1]-a[1],c[0]-a[0]);roofBand(b,a,c,top,'802-wall-roof-band-'+a.join(',')+'-'+c.join(','));b.local(a[0],0,a[1],r,()=>{const cuts=[0,len,...openings.flatMap(o=>[o.x-o.w/2,o.x+o.w/2])].sort((a,b)=>a-b);for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2;if(hi-lo<EPS)continue;let low=bottom;for(const o of[...openings.filter(o=>mid>o.x-o.w/2&&mid<o.x+o.w/2).sort((a,b)=>a.low-b.low),{low:top,high:top}]){if(o.low>low)b.box(mid,(low+o.low)/2,-.12,hi-lo,o.low-low,.24,C.brick,18,.6);low=Math.max(low,o.high);}}for(const o of openings)if(!o.door)window(b,o.x,o.low,o.high,o.w,o.lights||2);b.box(len/2,top-.06,.015,len,.13,.17,C.wood,20,1.9);});}
 function dormer(b,x0,x1,z0,z1,top,front){const edges=[[[x0,z0],[x1,z0]],[[x1,z0],[x1,z1]],[[x1,z1],[x0,z1]],[[x0,z1],[x0,z0]]],frontIndex=front?2:0;for(let j=0;j<4;j++)if(j!==frontIndex)roofBand(b,edges[j][1],edges[j][0],(x,z)=>baseHeight(x,z)-.015,'802-dormer-cheek-'+front+'-'+j);
 const z=front?z1:z0,r=front?0:Math.PI,x=(x0+x1)/2,w=x1-x0,low=Math.max(baseHeight(x0,z),baseHeight(x1,z))-.015,bottom=Math.max(low,top-.74),g=new G.Geometry(),a=edges[frontIndex][1],c=edges[frontIndex][0];
 const n=Math.ceil(w/.12);for(let i=0;i<n;i++){const p=[a[0]+(c[0]-a[0])*i/n,z],q=[a[0]+(c[0]-a[0])*(i+1)/n,z],yp=Math.min(bottom,baseHeight(...p)-.015),yq=Math.min(bottom,baseHeight(...q)-.015);g.quad([p[0],yp,z],[q[0],yq,z],[q[0],bottom,z],[p[0],bottom,z]);}
 b.mesh('802-dormer-front-base-'+front,g,0,0,0,1,1,1,C.brick,18,2);roofBand(b,a,c,top,'802-dormer-front-roof-band-'+front);
 b.local(x,0,z,r,()=>{b.box(0,top-.075,-.12,w,.15,.24,C.brick,18,2);for(const s of[-1,1])b.box(s*(w/2-.09),(bottom+top)/2,-.12,.18,top-bottom,.24,C.brick,18,2);window(b,0,bottom+.06,top-.12,w-.36,front?3:2);});}
 function house(b){b.id=802;
 // The source plan is a candidate outline, not a surveyed perimeter. All new
 // fitted fabric stays inside it; the projected front bay is not a new parcel.
 const front=3.65,bay=5.65;
 b.box(-.75,.23,-1.025,11.4,.46,9.35,C.stone,10,.12);b.box(-2.85,.23,4.65,5.8,.46,2.0,C.stone,10,.12);
 const win=(x,w=1.38)=>({x,w,low:.90,high:2.48});
 wall(b,[-6.45,-5.70],[4.95,-5.70],[win(2.1),win(5.7),win(9.3)]);
 wall(b,[4.95,-5.70],[4.95,front],[win(2.0),win(5.0),win(7.8)]);
 wall(b,[4.95,front],[.05,front],[win(1.25,1.80),{x:3.65,w:1.24,low:H.floor,high:2.54,door:true}]);
 wall(b,[.05,front],[.05,bay],[]);wall(b,[.05,bay],[-5.75,bay],[{x:2.9,w:4.65,low:1.00,high:2.50,lights:5}]);
 wall(b,[-5.75,bay],[-5.75,front],[]);wall(b,[-5.75,front],[-6.45,front],[]);wall(b,[-6.45,front],[-6.45,-5.70],[win(2.0),win(5.0),win(7.8)]);
 // Triangular gable infill is fitted to the bay roof, rather than covering the
 // recessed entrance with the former generic central door.
 // The front gable and every roof/wall junction are supplied by roofBand,
 // evaluated on the actual composite planes, including the ridge crossover.
 const entryX=1.30; // south-facing opening beside, not centred in, the window bay.
 b.box(entryX,1.46,front-.42,1.10,2.04,.075,'#343b37',20,.8); // Door is shadowed in evidence; no invented panel layout.
 for(const s of[-1,1])b.box(entryX+s*.67,1.49,front-.19,.10,2.14,.48,C.wood,20,.9);b.box(entryX,2.54,front-.19,1.44,.10,.48,C.wood,20,.9);
 b.box(entryX,.39,4.00,1.60,.12,.72,C.stone,10,.2);b.box(entryX,.27,4.53,1.72,.30,.38,C.stone,10,.2);b.box(entryX,.14,4.91,1.88,.28,.38,C.stone,10,.2);
 b.heritagePlaque('65',2.20,2.25,front+.03,.32,.28);
 const facets=roofFacets();b.mesh('802-registered-roof',roofMesh(facets),0,0,0,1,1,1,C.roof,19,2);
 dormer(b,1.08,3.07,.58,2.77,4.15,true);dormer(b,-.09,1.29,-4.49,-2.96,4.03,false);
 // Eave timber and ceramic rolls preserve or exceed the original local detail.
 const tile=b.geo('802-eave-roll',()=>{const t=new G.Geometry();for(let i=0;i<8;i++){const a=i*Math.PI/8,c=(i+1)*Math.PI/8;t.quad([Math.cos(a)*.075,Math.sin(a)*.035,-.14],[Math.cos(c)*.075,Math.sin(c)*.035,-.14],[Math.cos(c)*.075,Math.sin(c)*.035,.14],[Math.cos(a)*.075,Math.sin(a)*.035,.14]);}return t;});
 for(const [x0,x1,z]of[[-6.95,5.45,-6.2],[.45,5.45,4.15]]){b.box((x0+x1)/2,H.eave-.07,z,x1-x0,.14,.14,C.wood,20,1.9);for(let x=x0+.14;x<x1-.10;x+=.24)b.mesh('802-eave-roll',tile,x,H.eave+.014,z,1,1,1,C.roof,19,2.06);}
 for(const x of[-6.95,5.45])b.box(x,H.eave-.07,-1.025,.14,.14,10.35,C.wood,20,1.9);
 b.beam([-6.15,H.eave,5.94],[-2.85,4.42,5.94],.055,C.wood,20,1.98);b.beam([-2.85,4.42,5.94],[.45,H.eave,5.94],.055,C.wood,20,1.98);
 b.beam([-2.85,4.44,1.3],[-2.85,4.44,5.94],.045,C.roof,19,2.1);
 b.beam([-1.775,H.ridge+.018,-1.025],[.275,H.ridge+.018,-1.025],.065,C.roof,19,2.1);
 for(const x of[-6.36,4.86])b.heritageDrain(x,.42,3.58,2.45);
 return facets;
 }
 Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==802||f.properties.id!=='manual/yannan-65')return previous.call(this,b,f,add);const fr=Y.ArchitectureAdapter.frame(f.geometry),prior=b.id;b.id=802;try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>house(b));}finally{b.id=prior;}return{id:f.properties.id,strategy:'yannan65-registered-historical',frame:fr,height:5.183,fitted:true,photoEpoch:'2022-2024',currentRestorationUnverified:true};};
 Y.Building802Details={house,roofFacets,roofMesh,baseHeight,roofAt,H};
})(YY);
