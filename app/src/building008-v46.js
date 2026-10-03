/* Lui Che Woo Building: officially captioned views, two roof bars and a sunken court. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/13259482';
const R=Math.atan2(3.609,66.384),CO=Math.cos(R),SI=Math.sin(R),O=[222.409,55.384];
const C={brick:'#777c7a',stone:'#d7d8ce',glass:'#698a99',frame:'#424f53',roof:'#6b7474',wood:'#94745a'};
const H={floor:-3.8,brick:18,eave:22,ridge:24.4,platform:18.2};
const ring=[[242.581,82.132],[254.947,81.488],[256.177,83.676],[261.131,81.166],[267.323,80.844],[268.091,95.645],[255.306,96.3],[253.94,93.869],[248.85,96.633],[243.35,96.922],[242.581,82.132]];
// Preserve the mapped court; excavation also reaches the photographed west undercroft.
const groundCut={id:ID,pickId:19,ring,floor:H.floor,geometry:{type:'Polygon',coordinates:[ring]}};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO];
const local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const westNorth=local(ring[0]),westSouth=local(ring[9]);
const recessRing=[ring[0],ring[9],world(15,westSouth[1]),world(15,westNorth[1]),ring[0]];
groundCut.excavationRing=[...ring.slice(0,10),world(15,westSouth[1]),world(15,westNorth[1]),ring[0]];
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,bi=greater?b[axis]>=k:b[axis]<=k;if(ai)out.push(a);if(ai!==bi){const t=(k-a[axis])/(b[axis]-a[axis]);out.push(a.map((x,j)=>x+t*(b[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
// Join the actual rendered road endpoint, retaining its tangent and width.
function entranceApproach(road,crossing){
 if(!road||road.geometry.type!=='LineString'||road.geometry.coordinates.length<2||!crossing||crossing.geometry.type!=='LineString')return null;
 const line=road.geometry.coordinates,w=road.properties.width;if(!(w>0))return null;
 const centre=world(67.76,35.1),distance=p=>Math.hypot(p[0]-centre[0],p[1]-centre[1]);
 const i=distance(line[0])<distance(line.at(-1))?0:line.length-1,p=line[i],a=line[Math.max(0,i-1)],c=line[Math.min(line.length-1,i+1)],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(!len)return null;
 const edge=[[p[0]-dz/len*w/2,p[1]+dx/len*w/2],[p[0]+dz/len*w/2,p[1]-dx/len*w/2]],front=[world(67.76,35.1-w/2),world(67.76,35.1+w/2)];
 // The photographed pale walk continues to the north/south path junction.
 // Take that last segment's far corners from the existing ribbon, including
 // its averaged bend tangent; never straighten or widen the mapped road.
 const ribbon=G.ribbon(line,w,.12).v,part=i===0?ribbon.slice(0,48):ribbon.slice(-48);
 const far=i===0?[[part[8],part[10]],[part[16],part[18]]]:[[part[0],part[2]],[part[40],part[42]]];
 if(Math.hypot(front[0][0]-edge[0][0],front[0][1]-edge[0][1])>Math.hypot(front[0][0]-edge[1][0],front[0][1]-edge[1][1])){edge.reverse();far.reverse();}
 // Stop at the crossing walk's near side, not the diagonal internal seam of
 // the road ribbon. A curb on that seam would obstruct north/south travel.
 const crossLine=crossing.geometry.coordinates,j=Math.hypot(crossLine[0][0]-far[0][0],crossLine[0][1]-far[0][1])<Math.hypot(crossLine.at(-1)[0]-far[0][0],crossLine.at(-1)[1]-far[0][1])?0:crossLine.length-1;
 const q=crossLine[j],n=crossLine[j===0?1:j-1],tx=n[0]-q[0],tz=n[1]-q[1],tl=Math.hypot(tx,tz),half=crossing.properties.width/2;
 if(!tl||!(half>0))return null;
 const sides=[[q[0]-tz/tl*half,q[1]+tx/tl*half],[q[0]+tz/tl*half,q[1]-tx/tl*half]],near=sides.sort((a,b)=>distance(a)-distance(b))[0],cross2=(a,b)=>a[0]*b[1]-a[1]*b[0];
 for(let k=0;k<2;k++){const delta=[far[k][0]-edge[k][0],far[k][1]-edge[k][1]],den=cross2(delta,[tx,tz]);if(Math.abs(den)<1e-8)return null;const t=cross2([near[0]-edge[k][0],near[1]-edge[k][1]],[tx,tz])/den;far[k]=[edge[k][0]+delta[0]*t,edge[k][1]+delta[1]*t];}
 return{front,edge,far,outline:[front[0],front[1],edge[1],far[1],far[0],edge[0],front[0]]};
}
// 176: modern shallow-wave interlocking tiles, not traditional half-round cover
// tiles. Native 2018 west and construction views establish courses and hip caps.
// Pitch .30, course <=.36, relief .025 and lip .010 are photo-scale fits.
// Retain all original roof planes. Full columns share exact geometry; only the
// bounded hip perimeter is cut. All courses retain a single plane-wide phase.
function tiledRoof(b,name,w,d){
 const prefix='008-tiles176-'+name+'-',rise=H.ridge-H.eave;
 const specs=[['north',w,d/2,.36*w,0,-d/2,0],['south',w,d/2,.36*w,0,d/2,Math.PI],['west',d,.14*w,0,-w/2,0,Math.PI/2],['east',d,.14*w,0,w/2,0,-Math.PI/2]];
 function cut(poly,axis,k,greater){return clip(poly,axis,k,greater);}
 function area(poly){return Math.abs(F.area([...poly,poly[0]]));}
 for(const [face,L,depth,topHalf,x,z,rot]of specs){
  const N=Math.ceil(L/.30),pitch=L/N,rows=Math.ceil(depth/.36),course=depth/rows,slope=rise/depth;
  const polygon=[[-L/2,0],[L/2,0],[topHalf,depth],[-topHalf,depth]];
  function column(a,partial,start=0,end=rows,hipInterior=false){const g=new G.Geometry();
   for(let row=start;row<end;row++){
    const t0=row*course,t1=(row+1)*course;
    const shape=u=>.012+.025*(1-Math.cos(2*Math.PI*u/pitch))/2;
    const top=(u,t)=>H.eave+slope*t+shape(u)+.010*(1-(t-t0)/course);
    const bottom=t=>H.eave+slope*t-.003;
    // Piecewise shallow curved section: closed top/bottom/front/back/side faces.
    // Each section is a convex prism, clipped before height construction.
    for(let k=0;k<8;k++){
     const u0=k*pitch/8,u1=(k+1)*pitch/8;
     let p=partial?polygon.map(v=>v.slice()):[[a+u0,t0],[a+u1,t0],[a+u1,t1],[a+u0,t1]];
     if(partial)for(const [axis,value,greater]of [[0,a+u0,true],[0,a+u1,false],[1,t0,true],[1,t1,false]])if(p.length)p=cut(p,axis,value,greater);
     // Clipping through an existing corner can repeat that exact corner.
     // Remove duplicate/collinear polygon points before triangulation.
     p=p.filter((v,i)=>Math.hypot(v[0]-p[(i+p.length-1)%p.length][0],v[1]-p[(i+p.length-1)%p.length][1])>1e-8);
     for(let again=true;again&&p.length>2;){again=false;for(let i=0;i<p.length;i++){const a=p[(i+p.length-1)%p.length],v=p[i],c=p[(i+1)%p.length];if(Math.abs((v[0]-a[0])*(c[1]-v[1])-(v[1]-a[1])*(c[0]-v[0]))<1e-10){p.splice(i,1);again=true;break;}}}
     if(p.length<3||area(p)<1e-11)continue;
     // Original clipping starts complete non-eave rectangles at the second
     // corner. Preserve that diagonal and triangle multiset in shared groups.
     if(!partial&&hipInterior)p.push(p.shift());
     // top is affine within each of the eight section strips.
     const high=v=>{const u=v[0]-a,f=(u-u0)/(u1-u0);return [u,H.eave+slope*v[1]+shape(u0)*(1-f)+shape(u1)*f+.010*(1-(v[1]-t0)/course),v[1]];};
     const low=v=>[v[0]-a,bottom(v[1]),v[1]];
     if(F.area([...p,p[0]])<0)p.reverse();
     const up=p.map(high),dn=p.map(low);
     for(let i=1;i<p.length-1;i++){g.tri(up[0],up[i+1],up[i]);g.tri(dn[0],dn[i],dn[i+1]);}
     for(let i=0;i<p.length;i++){const j=(i+1)%p.length;
      // Adjacent section strips share these internal faces; omit only the
      // exact common face, retaining tile edges, course lips and hip closures.
      const x=p[i][0]-a,xx=p[j][0]-a;
      if(Math.abs(x-xx)<1e-9&&((k>0&&Math.abs(x-u0)<1e-9)||(k<7&&Math.abs(x-u1)<1e-9)))continue;
      g.quad(dn[i],up[i],up[j],dn[j]);
     }
    }
   }
   for(let i=0;i<g.v.length;i+=8){g.v[i+6]=g.v[i];g.v[i+7]=g.v[i+2];}return g;
  }
  b.local(x,0,z,rot,()=>{
   const cuts=new G.Geometry();let shared;
   for(let i=0;i<N;i++){
    const a=-L/2+i*pitch,full=a>=-topHalf-1e-9&&a+pitch<=topHalf+1e-9;
    if(full){shared=shared||b.geo(prefix+face+'-column',()=>column(a,false));b.mesh(prefix+face+'-column',shared,a,0,0,1,1,1,'#7c827f',25);}
    else{
     // The interior of a hip-cut column consists of ordinary complete rows.
     // Exact power-of-two course groups share those triangles rather than
     // copying an entire triangular hip fan into every unique boundary mesh.
     const topAtEdge=depth*Math.max(0,(L/2-Math.max(Math.abs(a),Math.abs(a+pitch)))/(L/2-topHalf));
     const whole=Math.min(rows,Math.max(0,Math.floor((topAtEdge+1e-9)/course)));
     let at=0,left=whole;
     if(whole){const key=prefix+face+'-courses-first',g=b.geo(key,()=>column(0,false,0,1));b.mesh(key,g,a,0,0,1,1,1,'#7c827f',25);at=1;left--;}

     for(let size=2**Math.floor(Math.log2(Math.max(1,whole)));size>=1;size/=2)if(left>=size){
      const key=prefix+face+'-courses-'+size,g=b.geo(key,()=>column(0,false,0,size,true));
      b.mesh(key,g,a,slope*at*course,at*course,1,1,1,'#7c827f',25);at+=size;left-=size;
     }
     const g=column(a,true,whole);for(let j=0;j<g.v.length;j+=8){cuts.v.push(g.v[j]+a,...g.v.slice(j+1,j+8));}
    }
   }
   b.mesh(prefix+face+'-hip-cuts',b.geo(prefix+face+'-hip-cuts',()=>cuts),0,0,0,1,1,1,'#7c827f',25);
  });
 }
 // Continuous modest segmented ridge/hip cover. No ceremonial finials. The
 // closed cap foot embeds .01 into the original roof crease; top is +.12.
 const lines=[[[ -.36*w,H.ridge,0],[.36*w,H.ridge,0]]];
 for(const sx of[-1,1])for(const sz of[-1,1])lines.push([[sx*w/2,H.eave,sz*d/2],[sx*.36*w,H.ridge,0]]);
 lines.forEach(([a,c],i)=>{
  const dx=c[0]-a[0],dz=c[2]-a[2],length=Math.hypot(dx,dz),slope=(c[1]-a[1])/length,count=Math.ceil(length/.36),run=length/count;
  const key=prefix+'cap-'+i,g=b.geo(key,()=>{const q=new G.Geometry();
   for(let k=0;k<8;k++){const x0=-.11+.22*k/8,x1=-.11+.22*(k+1)/8,up=x=>.045+.075*Math.sin(Math.PI*(x+.11)/.22),A=[x0,up(x0)+.008,0],B=[x1,up(x1)+.008,0],C=[x1,up(x1)+slope*run,run],D=[x0,up(x0)+slope*run,run],a0=[x0,-.01,0],b0=[x1,-.01,0],c0=[x1,slope*run-.01,run],d0=[x0,slope*run-.01,run];q.quad(A,D,C,B);q.quad(a0,b0,c0,d0);q.quad(a0,A,B,b0);q.quad(d0,c0,C,D);if(k===0)q.quad(a0,d0,D,A);if(k===7)q.quad(b0,B,C,c0);}
   for(let j=0;j<q.v.length;j+=8){q.v[j+6]=q.v[j];q.v[j+7]=q.v[j+2];}return q;});
  b.local(a[0],a[1],a[2],Math.atan2(dx,dz),()=>{for(let j=0;j<count;j++)b.mesh(key,g,0,slope*j*run,j*run,1,1,1,'#858a84',25);});
 });
}

// 304: two clearly visible closed double doors in the north west gallery.
// Heights follow existing slabs; recess/width are conditional photo fits.
const door304={x0:1.85,x1:3.45,height:2.50,bases:[9.4,13.8],depth:.30};
function cut304(geometry){
 let triangles=[];
 for(let j=0;j<geometry.v.length;j+=24)triangles.push([0,8,16].map(i=>Array.from(geometry.v.slice(j+i,j+i+8))));
 const coord=(v,k)=>k===1?v[1]:local([v[0],v[2]])[k===0?0:1];
 const split=(poly,k,h,greater)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],av=coord(a,k),cv=coord(c,k),ai=greater?av>=h:av<=h,ci=greater?cv>=h:cv<=h;if(ai)out.push(a);if(ai!==ci){const t=(h-av)/(cv-av);out.push(a.map((x,j)=>x+(c[j]-x)*t));}}return out;};
 for(const y of door304.bases){const planes=[[0,7.79,true],[0,8.45,false],[1,y,true],[1,y+door304.height,false],[2,23+door304.x0,true],[2,23+door304.x1,false]],out=[];
 for(const triangle of triangles){if(planes.some(([k,h,g])=>triangle.every(v=>g?coord(v,k)<h:coord(v,k)>h))){out.push(triangle);continue;}let inside=triangle;for(const[k,h,g]of planes){if(inside.length<3)break;const outside=split(inside,k,h,!g);for(let n=1;n+1<outside.length;n++)out.push([outside[0],outside[n],outside[n+1]]);inside=split(inside,k,h,g);}}triangles=out;}
 const g=new G.Geometry();for(const t of triangles){const a=t[0],b=t[1],c=t[2],u=Y.M.sub(b,a),v=Y.M.sub(c,a);if(Math.hypot(...Y.M.cross(u,v))<1e-9)continue;for(const p of t)g.vertex(p.slice(0,3),p.slice(3,6),p.slice(6,8));}return g;
}
function render(b,f,add){
 const id=f.properties.pickId;b.id=id;
 function block(name,box,base,top,color=C.brick){
  const ps=pieces(f,box),mesh=new G.Geometry(),cap=new G.Geometry();
  for(const p of ps){for(let i=0;i<p.length;i++){const a=world(...p[i]),c=world(...p[(i+1)%p.length]);mesh.quad([a[0],base,a[1]],[c[0],base,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]);}
   for(let i=1;i<p.length-1;i++){const vs=[p[0],p[i],p[i+1]].map(p=>{const w=world(...p);return [w[0],top,w[1]];});cap.tri(...vs);if(base>H.floor)mesh.tri(...vs.map(v=>[v[0],base,v[2]]).reverse());}
  }
  add('008-'+name,name==='west-core'?cut304(mesh):mesh,color,color===C.glass?28:color===C.brick?30:24,id);add('008-'+name+'-cap',cap,C.roof,22,id);
 }
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function win(x,y,w,h,z=.05){b.box(x,y,z,w+.12,h+.10,.09,C.frame,29);b.box(x,y,z+.065,w,h,.028,C.glass,28);if(w>1.2)b.box(x,y,z+.09,.055,h,.04,C.frame,29);b.box(x,y+h*.25,z+.09,w,.06,.04,C.frame,29);}
 function glass(w,base,top,z=0){b.box(w/2,(top+base)/2,z,w,top-base,.10,C.glass,28);for(let x=0;x<=w;x+=2.1)b.box(x,(top+base)/2,z+.08,.055,top-base,.08,C.frame,29);for(let y=base+.04;y<=top-.03;y+=2.2)b.box(w/2,y,z+.09,w,.06,.09,C.frame,29);}
 for(const [name,lo,hi] of [['north',-1,23],['south',47.2,71]]){block(name+'-brick',[-1,lo,68,hi],H.floor,H.brick);block(name+'-top',[-1,lo,68,hi],H.brick,H.eave,C.stone);}
 // Only the main entry pocket interrupts the glass connection; preserve the
 // mapped sunken court and its complete ground-cut geometry.
 block('east-glass-upper',[19,23,68,47.2],3.55,H.platform,C.glass);
 block('east-glass-plinth',[19,23,68,47.2],H.floor,.585,C.glass);
 block('east-glass-back',[19,23,62.2,47.2],.585,3.55,C.glass);
 block('east-entry-north',[62.2,23,68,33.45],.585,3.55,C.glass);
 block('east-entry-south',[62.2,36.75,68,47.2],.585,3.55,C.glass);
 block('west-core',[7.8,23,15,47.2],H.floor,H.platform,C.glass);
 block('court-west-upper',[15,23,19,47.2],.6,H.platform,C.glass);
 block('court-west-north-support',[15,23,19,27.75],H.floor,.6,C.stone);
 block('court-west-south-support',[15,42.7,19,47.2],H.floor,.6,C.stone);
 block('court-central-support',[16,34,19,36.6],H.floor,.6,C.stone);
 block('west-brick-screen',[-1,28,7.8,42],H.floor,17.8);
 // Gallery slots have slabs and railings, never a full-height front wall.
 for(const [a,c] of [[23,28],[42,47.2]]){
  for(const y of [.6,5.0,9.4,13.8,18.2])block('west-gallery-'+a+'-'+y,[-1,a,7.8,c],y-.20,y,C.stone);
  frame(7.8,a,-Math.PI/2,()=>{
   if(a!==23){glass(c-a,H.floor,18.2);return;}
   // Clip only the existing north gallery panes/mullions crossed by two doors.
   const box=b.box,owned=Object.hasOwn(b,'box');
   b.box=function(x,y,z,w,h,d,...rest){let rects=[[x-w/2,y-h/2,x+w/2,y+h/2]];
    for(const base of door304.bases){const cut=[door304.x0,base-.01,door304.x1,base+door304.height],out=[];for(const r of rects){const l=Math.max(r[0],cut[0]),lo=Math.max(r[1],cut[1]),rr=Math.min(r[2],cut[2]),hi=Math.min(r[3],cut[3]);if(l>=rr||lo>=hi){out.push(r);continue;}if(r[0]<l)out.push([r[0],r[1],l,r[3]]);if(rr<r[2])out.push([rr,r[1],r[2],r[3]]);if(r[1]<lo)out.push([l,r[1],rr,lo]);if(hi<r[3])out.push([l,hi,rr,r[3]]);}rects=out;}
    if(rects.length===1&&rects[0][0]===x-w/2&&rects[0][1]===y-h/2&&rects[0][2]===x+w/2&&rects[0][3]===y+h/2)return box.call(this,x,y,z,w,h,d,...rest);
    for(const r of rects)box.call(this,(r[0]+r[2])/2,(r[1]+r[3])/2,z,r[2]-r[0],r[3]-r[1],d,...rest);
   };
   try{glass(c-a,H.floor,18.2);}finally{if(owned)b.box=box;else delete b.box;}
   const saved=b.e.add,addOwned=Object.hasOwn(b.e,'add');b.e.add=function(k,...args){return saved.call(this,'lui19-door304-'+k,...args);};
   try{for(const base of door304.bases){const l=door304.x0,r=door304.x1,h=door304.height,mid=(l+r)/2,z=-door304.depth;
    // Finite jambs, head and back; no unseen room or open-door state.
    b.box(l-.025,base+h/2,-.32,.05,h,.66,C.frame,29);b.box(r+.025,base+h/2,-.32,.05,h,.66,C.frame,29);
    b.box(mid,base+h+.025,-.32,r-l+.10,.05,.66,C.frame,29);
    b.box(mid,base+h/2,-.65,r-l,h,.03,'#34434a',29);
    b.box(mid,base+.0225,-.32,r-l,.045,.66,C.stone,24);
    const transom=base+2.12;
    for(const x of[l+.035,mid,r-.035]){const top=x===mid?transom:base+h;b.box(x,(base+top)/2,z,.07,top-base,.09,C.frame,29);}
    for(const yy of[base+.045,transom,base+h-.035])b.box(mid,yy,z,r-l,.07,.09,C.frame,29);
    for(const x of[(l+mid)/2,(mid+r)/2])b.box(x,(base+.08+transom-.035)/2,z-.025,(r-l)/2-.07,transom-base-.115,.025,C.glass,28);
    b.box(mid,(transom+.035+base+h-.07)/2,z-.025,r-l-.07,h-(transom-base)-.105,.025,C.glass,28);
   }}finally{if(addOwned)b.e.add=saved;else delete b.e.add;}
  });
  frame(1.8,a,-Math.PI/2,()=>{
   const width=c-a;
   // The official west photograph shows pale slab fascias and open metal
   // railings with intermediate horizontal rails, not upright-only fences.
   for(const y of [5,9.4,13.8,18.2]){
    b.box(width/2,y-.425,.035,width,.85,.20,C.stone,24);
    b.box(width/2,y-.035,.08,width,.07,.32,'#b6beb8',24);
   }
   for(const y of [.6,5,9.4,13.8]){
    const lo=.10,hi=width-.10,count=Math.ceil((hi-lo)/1.35),pitch=(hi-lo)/count;
    for(const h of [.27,.53,.79,1.05])b.beam([lo,y+h,0],[hi,y+h,0],h===1.05?.026:.018,C.frame,29);
    for(let i=0;i<=count;i++){
     const xx=lo+i*pitch;
     b.beam([xx,y,0],[xx,y+1.05,0],.023,C.frame,29);
     b.box(xx,y+.018,0,.13,.036,.13,C.frame,29);
    }
   }
  });
 }
 // Two parallel planar hipped roofs, without curved eaves or ceremonial finials.
 for(const [name,u,v,w,d] of [['north',33.24,11.50,67.5,24.2],['south',33.12,58.52,66.7,23.9]])frame(u,v,0,()=>{
  b.mesh('008-hip-'+name,b.geo('008-hip',()=>{const g=new G.Geometry(),a=[-.5,0,-.5],c=[.5,0,-.5],d=[.5,0,.5],e=[-.5,0,.5],l=[-.36,1,0],r=[.36,1,0];g.quad(l,r,c,a);g.tri(r,d,c);g.quad(r,l,e,d);g.tri(l,a,e);return g;}),0,H.eave,0,w,H.ridge-H.eave,d,C.roof,2);
  b.box(0,H.eave-.16,0,w,.32,d,C.stone,24);
  tiledRoof(b,name,w,d);
 });
 // Three equipment assemblies sit on the lower west platform, not over the courtyard.
 for(const vv of [28.9,35.0,41.1])frame(11.6,vv,0,()=>{
  for(const x of [-1.5,1.5])b.box(x,18.65,0,.16,.9,2.7,C.frame,29);
  b.box(0,20.1,0,4.2,2.1,2.7,'#a7b0b0',29);b.box(0,19.55,-1.38,3.8,.7,.12,C.frame,29);
  for(let j=0;j<5;j++)b.box(0,19.9+j*.22,1.38,3.8,.08,.08,'#6d8289',29);
 });
 frame(15.5,24.8,0,()=>{b.box(0,18.9,0,2.2,1.4,1.9,'#bdc4bf',29);b.box(2.1,18.55,0,2.0,.6,.9,'#b4bdbb',29);});
 // EAST main front is glass, with suspended flat glass canopy and short straight steps.
 frame(64.46,47.1,Math.PI/2,()=>{
  const x=12,base=.6,doorTop=3.55,doorLeft=10.4,doorRight=13.6;
  // Curtain panes and mullions stop at the entrance aperture.
  for(const [lo,hi]of [[0,doorLeft],[doorRight,24]])b.box((lo+hi)/2,(base+18.2)/2,0,hi-lo,18.2-base,.10,C.glass,28);
  b.box(x,(doorTop+18.2)/2,0,doorRight-doorLeft,18.2-doorTop,.10,C.glass,28);
  for(let xx=0;xx<=24;xx+=2.1){const low=xx>doorLeft&&xx<doorRight?doorTop:base;b.box(xx,(low+18.2)/2,.08,.055,18.2-low,.08,C.frame,29);}
  for(let y=base+.04;y<=18.17;y+=2.2){
   if(y<doorTop)for(const [lo,hi]of [[0,doorLeft],[doorRight,24]])b.box((lo+hi)/2,y,.09,hi-lo,.06,.09,C.frame,29);
   else b.box(12,y,.09,24,.06,.09,C.frame,29);
  }
  // Separate the canopy's thin glazing from its visible steel perimeter and
  // underside grid. Pane count, section sizes and joint details are fitted;
  // the source establishes their arrangement, not a fabrication drawing.
  const canopyBack=.04,canopyFront=3.15,canopyDepth=canopyFront-canopyBack,steel='#737d79',seal='#3c4847';
  for(const zz of [canopyBack+.07,canopyFront-.07]){
   b.box(x,5.16,zz,8.8,.26,.14,steel,29);
   b.box(x,5.302,zz,8.8,.035,.22,steel,29);
  }
  for(const xx of [x-4.32,x+4.32]){
   b.box(xx,5.16,(canopyBack+canopyFront)/2,.16,.26,canopyDepth,steel,29);
   b.box(xx,5.302,(canopyBack+canopyFront)/2,.22,.035,canopyDepth,steel,29);
  }
  for(const xx of [x-2.2,x,x+2.2]){b.box(xx,5.18,(canopyBack+canopyFront)/2,.09,.20,canopyDepth-.14,steel,29);b.box(xx,5.30,(canopyBack+canopyFront)/2,.075,.05,canopyDepth-.14,steel,29);}
  b.box(x,5.27,(canopyBack+canopyFront)/2,8.6,.104,.07,steel,29);
  for(let i=0;i<4;i++)for(let j=0;j<2;j++){
   const cx=x-4.4+(i+.5)*2.2,cz=canopyBack+(j+.5)*canopyDepth/2;
   b.box(cx,5.332,cz,2.2-.024,.026,canopyDepth/2-.024,'#9cbbb7',28);
  }
  for(const xx of [x-2.2,x,x+2.2])b.box(xx,5.326,(canopyBack+canopyFront)/2,.018,.012,canopyDepth,seal,29);
  b.box(x,5.326,(canopyBack+canopyFront)/2,8.8,.012,.018,seal,29);
  for(const xx of [x-4.0,x+4.0]){
   b.box(xx,5.20,1.59,.14,.24,3.02,steel,29);
   b.box(xx,5.355,2.9,.32,.055,.34,steel,29);
   // Clevis cheeks seat the lower rod on the canopy rather than ending in air.
   for(const side of [-1,1])b.box(xx+side*.06,5.43,2.9,.035,.14,.18,steel,29);
   b.beam([xx-.12,5.43,2.9],[xx+.12,5.43,2.9],.034,steel,29);
   // Register the upper attachment to the existing vertical mullion.
   const wallX=Math.round(xx/2.1)*2.1;
   b.beam([xx,5.43,2.9],[wallX,8.2,.16],.035,steel,29);
   b.box(wallX,8.2,.09,.23,.32,.10,steel,29);
   for(const side of [-1,1])b.box(wallX+side*.06,8.2,.17,.035,.19,.14,steel,29);
   b.beam([wallX-.12,8.2,.16],[wallX+.12,8.2,.16],.034,steel,29);
  }
  for(let j=0;j<5;j++)b.box(x,.08+j*.11,2.8-j*.4,7.8,.16,1.0,C.stone,10);
  const leafH=2.89,leafW=1.56,z=.14;
  for(const xx of [doorLeft,doorRight])b.box(xx,(base+doorTop)/2,z,.085,doorTop-base,.12,C.frame,29);
  b.box(x,doorTop,z,3.28,.10,.12,C.frame,29);
  // Both leaves are shown inward-open to reveal the real pocket. This is a
  // fitted display pose, not a statement of current access or opening angle.
  for(const side of [1,-1]){
   const hinge=side===1?doorLeft:doorRight;
   b.local(hinge,base+.02,z,side*1.02,()=>{
    const cx=side*leafW/2;
    b.box(cx,leafH/2,0,leafW-.08,leafH-.09,.04,C.glass,28);
    for(const dx of [-leafW/2,leafW/2])b.box(cx+dx,leafH/2,.015,.045,leafH,.085,C.frame,29);
    for(const yy of [.04,leafH-.04])b.box(cx,yy,.015,leafW,.075,.085,C.frame,29);
    const hx=side*(leafW-.13);
    for(const face of [-1,1]){
     b.beam([hx,.18,face*.115],[hx,2.66,face*.115],.018,C.frame,29);
     for(const yy of [.3,2.54])b.beam([hx,yy,0],[hx,yy,face*.115],.014,C.frame,29);
    }
   });
  }
  // Local round supports flanking the doorway are visible in the official
  // interior-out photograph; their exact section and height are fitted.
  for(const xx of [8.4,15.6]){b.cyl(xx,base,-.22,.17,4.7,C.frame,20,1,29);b.cyl(xx,base,-.22,.27,.22,C.frame,20,1,29);}
  b.box(x,.35,-.75,7.8,.5,3.9,C.stone,10);
  b.noPlant(x,.3,7.8,6.0);
 });
 const approach=entranceApproach(Y.CAMPUS?.features.find(q=>q.properties.id==='way/970687429'),Y.CAMPUS?.features.find(q=>q.properties.id==='way/970687428'));
 if(approach){
  add('008-entry-approach-bed',F.surface({type:'Polygon',coordinates:[approach.outline]},.124),'#a9aaa0',10,id);
  const poly=approach.outline.slice(0,-1).map(local),us=poly.map(p=>p[0]),vs=poly.map(p=>p[1]),tiles=new G.Geometry();
  // Rectangular stone slabs and narrow joints from the east entry photograph;
  // slab pitch is fitted, while both joining edges follow existing geometry.
  for(let u=Math.floor(Math.min(...us)/.8)*.8;u<Math.max(...us);u+=.8)for(let v=Math.floor(Math.min(...vs)/.4)*.4;v<Math.max(...vs);v+=.4){
   let part=poly;for(const [axis,k,greater]of [[0,u+.003,true],[0,u+.797,false],[1,v+.003,true],[1,v+.397,false]])if(part.length)part=clip(part,axis,k,greater);
   if(part.length<3)continue;const ring=[...part,part[0]];
   for(const tri of F.capTriangles([ring]))tiles.tri(...tri.map(p=>{const q=world(...p);return[q[0],.127,q[1]];}));
  }
  add('008-entry-approach-slabs',tiles,'#ceccbd',10,id);
  const mid=approach.outline.slice(0,-1).reduce((a,p)=>[a[0]+p[0]/6,a[1]+p[1]/6],[0,0]);
  for(let i=0;i<2;i++)for(const [a,c]of [[approach.front[i],approach.edge[i]],[approach.edge[i],approach.far[i]]]){
   const dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz),centre=[(a[0]+c[0])/2,(a[1]+c[1])/2];let nx=-dz/length,nz=dx/length;
   if(nx*(centre[0]-mid[0])+nz*(centre[1]-mid[1])<0){nx=-nx;nz=-nz;}
   b.local(centre[0]+nx*.07,0,centre[1]+nz*.07,Math.atan2(-dz,dx),()=>{const n=Math.ceil(length/1.0),pitch=length/n;for(let j=0;j<n;j++)b.box(-length/2+(j+.5)*pitch,.174,0,pitch-.005,.10,.14,C.stone,10);});
  }
  const xs=approach.outline.map(p=>p[0]),zs=approach.outline.map(p=>p[1]),lo=[Math.min(...xs),Math.min(...zs)],hi=[Math.max(...xs),Math.max(...zs)];
  b.noPlant((lo[0]+hi[0])/2,(lo[1]+hi[1])/2,hi[0]-lo[0]+.3,hi[1]-lo[1]+.3);
 }
 // WEST central screen: ten narrow vertical slots; no east entrance copied here.
 frame(1.79,28,-Math.PI/2,()=>{for(let i=0;i<10;i++)win(.95+i*1.34,8.9,.42,15.6,.06);});
 // End faces of both long wings: central wide vertical glazing and four narrow side strips.
 for(const [u,v,len,r] of [[.02,0,22.6,-Math.PI/2],[66.47,23,23,Math.PI/2],[.43,47.2,22.6,-Math.PI/2],[65.83,69.8,22.6,Math.PI/2]])frame(u,v,r,()=>{
  win(len/2,8.4,2.15,15.2);for(const d of [-5.1,-3.4,3.4,5.1]){win(len/2+d,6.7,.67,11.2);win(len/2+d,15.3,.67,2.3);}
  for(let i=0;i<3;i++){win((i+.5)*len/3,20,Math.min(5.8,len/3-.85),3.2);if(i)b.box(i*len/3,20,-.04,.55,4,.32,C.stone,24);}
 });
 // SOUTH twelve visible axes: bottom windows, two-storey vertical groups + louvres,
 // independent rectangle row, then broad top-floor windows between pale columns.
 frame(.6,69.84,0,()=>{
  for(let i=0;i<12;i++){const x=2.7+i*5.4;win(x,2.0,3.25,3.1);win(x,8.8,3.25,9.7);win(x,15.55,3.25,2.8);win(x,20,4.4,3.25);
   b.box(x,8.5,.18,3.3,.90,.12,'#929c99',29);for(let k=0;k<7;k++)b.box(x,8.15+k*.115,.26,3.3,.045,.045,'#586663',29);
   if(i<11)b.box(x+2.7,20,-.08,.6,4,.42,C.stone,24);
  }
  if(b.lettering)b.lettering('吕志和楼  LUI CHE WOO BUILDING',32.3,17.6,.12,31.0,.84,0,'#dce0d8');
 });
 // NORTH evidence is an oblique partial photo: same vocabulary, deliberately unverified count.
 frame(66.1,0,Math.PI,()=>{for(let i=0;i<11;i++){const x=3.0+i*5.95;win(x,2.0,3.0,3.1);win(x,8.8,3.0,9.7);win(x,15.55,3.0,2.8);win(x,20,4.6,3.25);b.box(x,8.5,.15,3.05,.85,.12,'#929c99',29);}});
 // Court skins follow EVERY original angled segment. Five visible bands are not floor labels.
 for(let i=1;i<ring.length;i++){
  const a=ring[i-1],c=ring[i],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),west=local(a)[0]<19&&local(c)[0]<19;
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>{
   for(let j=0;j<5;j++){const y=H.floor+j*4.4;if(west&&j===0)continue;
    b.box(len/2,y+.30,.04,len,.60,.16,C.stone,24);const n=Math.max(1,Math.floor(len/1.7));for(let k=0;k<n;k++)win((k+.5)*len/n,y+2.35,len/n-.11,3.25,.05);
   }
   b.box(len/2,18.0,.04,len,.4,.16,C.stone,24);
  });
 }
 // Sunken floor follows the exact hole; no lid is added at the old ground level.
 add('008-court-grass-floor',F.surface(groundCut.geometry,H.floor),'#727e59',3,id);
 add('008-undercroft-floor',F.surface({type:'Polygon',coordinates:[recessRing]},H.floor),'#aaa99c',10,id);
 for(const [u,v,w,d] of [[24.0,35.3,5.8,5.2],[37.8,35.0,5.4,5.8]])frame(u,v,0,()=>{
  b.box(0,H.floor+.09,0,w,.18,d,C.wood,6);for(let x=-w/2+.2;x<w/2;x+=.24)b.box(x,H.floor+.19,0,.035,.025,d,'#78634e',6);
 });
 const path=new G.Geometry();for(let j=0;j<20;j++){
  const p=t=>{const u=20.2+22*t,v=35.1+1.8*Math.sin(t*Math.PI*2);return [u,v];},a=p(j/20),c=p((j+1)/20),dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),n=[-dz/l*.45,dx/l*.45];
  path.quad(...[[a[0]+n[0],a[1]+n[1]],[c[0]+n[0],c[1]+n[1]],[c[0]-n[0],c[1]-n[1]],[a[0]-n[0],a[1]-n[1]]].map(p=>{const w=world(...p);return[w[0],H.floor+.025,w[1]];}));
 }
 add('008-court-curved-path',path,'#c1bfb0',10,id);
 return {strategy:'building008-v46',visibleBands:5,officialStoreysUnresolved:true,courtFloor:H.floor,groundCutRequired:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building008={id:ID,render,world,local,pieces,heights:H,groundCut,entranceApproach,door304};
})(YY);
