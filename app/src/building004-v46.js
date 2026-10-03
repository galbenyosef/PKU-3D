/* Liu Shui Building: real stone facade, flat roofs and open eastern high court. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/11975584';
const C={stone:'#aaa9a2',pale:'#d7d9cd',glass:'#42616f',joint:'#8c8e88',grid:'#cbd0c7',roof:'#818582',rail:'#95afb0'};
const H={main:20.5,bridgeBase:15.0,bridgeTop:15.75,frameBase:19.4,frameTop:20.5};
const local=p=>p,world=(x,z)=>[x,z];
// South elevation registered against the 2025 drill photographs and the
// engineering building across Zhongguancun North Street. Dimensions are fitted.
const southA=[384.189,-96.234],southB=[414.704,-98.232],southLength=Math.hypot(southB[0]-southA[0],southB[1]-southA[1]);
const southU=southB.map((v,i)=>(v-southA[i])/southLength),southN=[-southU[1],southU[0]];
const southCoord=p=>[(p[0]-southA[0])*southU[0]+(p[1]-southA[1])*southU[1],-(p[0]-southA[0])*southN[0]-(p[1]-southA[1])*southN[1]];
const southPoint=(u,n)=>southA.map((v,i)=>v+southU[i]*u+southN[i]*n);
function southApproach(road){
 if(!road||road.geometry.type!=='LineString')return null;
 const [a,c]=road.geometry.coordinates,dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),v=[dx/len,dz/len],half=road.properties.width/2;
 const edge=[a[0]-v[1]*half,a[1]+v[0]*half],end=edge.map((x,i)=>x+v[i]*6),q=southCoord(edge);
 // The fitted forecourt meets the existing road edge exactly, without moving it
 // or placing two coplanar road surfaces over one another.
 const front=u=>southPoint(u,3.5+(-q[1]-3.5)*u/q[0]);
 const left=front(15.9),right=front(18.3),start=southPoint(0,3.5);
 return {outline:[start,edge,end,southPoint(0,9.5),start],walk:[southPoint(15.9,0),left,right,southPoint(18.3,0)],curbs:[[start,left],[right,edge]],roadEdge:[edge,end]};
}
function section(p,axis,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],sv=southCoord(s)[axis],ev=southCoord(e)[axis],si=greater?sv>=k:sv<=k,ei=greater?ev>=k:ev<=k;if(si)out.push(s);if(si!==ei){const t=(k-sv)/(ev-sv);out.push(s.map((v,j)=>v+t*(e[j]-v)));}}return out;}
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const t of F.capTriangles(pg)){let p=t;for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
// Photo-fitted south-window openings include the existing glass-block register.
// Keep their placement shared by the wall subtraction, joints and window joinery.
const southWindowCount=Math.max(1,Math.round(southLength/4.8)),southWindowStep=(southLength-1.7)/southWindowCount;
const southWindows=Array.from({length:4},(_,j)=>Array.from({length:southWindowCount},(_,k)=>{
 const x=.85+(k+.5)*southWindowStep,y=2.4+(j+1)*4.05,w=Math.min(2.65,southWindowStep-.65),h=2.15;
 return{x,y,w,h,l:x-w/2-.20,r:x+w/2+.20,lo:y-h/2-.93,hi:y+h/2+.20,depth:.52};
})).flat();
function cutSouthWindows(geometry){
 const out=new G.Geometry(),cut=(poly,evalSide,inside)=>{const result=[];for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],av=evalSide(a),bv=evalSide(b),ai=inside?av>=0:av<=0,bi=inside?bv>=0:bv<=0;
  if(ai)result.push(a);if(ai!==bi){const t=av/(av-bv);result.push(a.map((v,j)=>v+t*(b[j]-v)));}
 }return result;};
 for(let i=0;i<geometry.v.length;i+=24){let polys=[Array.from({length:3},(_,j)=>geometry.v.slice(i+j*8,i+j*8+8))];
  for(const q of southWindows){const next=[];for(const p of polys){
   const coords=p.map(v=>{const c=southCoord([v[0],v[2]]);return[c[0],v[1],c[1]];});
   if(coords.every(v=>v[0]<=q.l)||coords.every(v=>v[0]>=q.r)||coords.every(v=>v[1]<=q.lo)||coords.every(v=>v[1]>=q.hi)||coords.every(v=>v[2]<=-.10)||coords.every(v=>v[2]>=.60)){next.push(p);continue;}
   const sides=[v=>southCoord([v[0],v[2]])[0]-q.l,v=>q.r-southCoord([v[0],v[2]])[0],v=>v[1]-q.lo,v=>q.hi-v[1],v=>southCoord([v[0],v[2]])[1]+.10,v=>.60-southCoord([v[0],v[2]])[1]];
   let carry=p;for(const side of sides){if(carry.length<3)break;const outside=cut(carry,side,false);if(outside.length>=3)next.push(outside);carry=cut(carry,side,true);}
  }polys=next;}
  for(const p of polys)for(let j=1;j<p.length-1;j++){
   const tri=[p[0],p[j],p[j+1]],a=tri[0],u=tri[1].slice(0,3).map((x,k)=>x-a[k]),v=tri[2].slice(0,3).map((x,k)=>x-a[k]);
   if(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])<1e-10)continue;
   for(const v of tri)out.v.push(...v);
  }
 }
 return out;
}
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 function block(name,box,base,top,color=C.stone,sections=[]){const mesh=new G.Geometry(),cap=new G.Geometry();for(let p of pieces(f,box)){for(const [axis,k,greater] of sections)if(p.length)p=section(p,axis,k,greater);if(p.length<3)continue;for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];mesh.quad([a[0],base,a[1]],[c[0],base,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]);}for(let i=1;i<p.length-1;i++){const tri=[p[0],p[i],p[i+1]].map(p=>[p[0],top,p[1]]);cap.tri(...tri);if(base>0)mesh.tri(...tri.map(p=>[p[0],base,p[2]]).reverse());}}add('004-'+name,name==='south-wing'?cutSouthWindows(mesh):mesh,color,24,id);add('004-'+name+'-roof',cap,C.roof,22,id);}
 // All partitions are clipped to original OSM triangles, including the courtyard hole.
 block('north-wing',[370,-190,420,-153.416],0,H.main);
 block('south-wing',[370,-133.619,420,-90],4.15,H.main);
 // The recessed porch and its vestibule are real voids below the upper wing.
 // Keep the east solid pier and west return; do not hollow the entire floor.
 block('south-ground-back',[370,-133.619,420,-90],0,4.15,C.stone,[[1,5.8,true]]);
 block('south-ground-west',[370,-133.619,420,-90],0,4.15,C.stone,[[1,5.8,false],[0,4,false]]);
 block('south-ground-east',[370,-133.619,420,-90],0,4.15,C.stone,[[1,5.8,false],[0,21,true]]);
 block('west-court-wing',[370,-153.416,404.9,-133.619],0,H.main,C.pale);
 // The map's eastern strip is an elevated connection, not a five-storey solid wall.
 block('upper-open-bridge',[404.9,-153.416,420,-133.619],H.bridgeBase,H.bridgeTop,C.pale);
 block('high-roof-frame',[404.9,-153.416,420,-133.619],H.frameBase,H.frameTop,C.pale);
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(len));}
 function window(x,y,w,h,detailed,recessed=false,inCavity=false){
  if(recessed){
   const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'004-south-recess-'+k,...a);};
   try{b.local(0,0,-.52,0,()=>window(x,y,w,h,detailed,false,true));}finally{b.e.add=old;}
   const key='004-south-window-reveals-'+w+'-'+h,g=b.geo(key,()=>{
    const l=-w/2-.20,r=w/2+.20,lo=-h/2-.93,hi=h/2+.20,depth=.52,g=new G.Geometry();
    // Actual four-sided reveals from the exterior wall into the cut-out volume.
    g.quad([l,lo,0],[l,lo,-depth],[l,hi,-depth],[l,hi,0]);
    g.quad([r,hi,0],[r,hi,-depth],[r,lo,-depth],[r,lo,0]);
    g.quad([l,hi,0],[l,hi,-depth],[r,hi,-depth],[r,hi,0]);
    g.quad([r,lo,0],[r,lo,-depth],[l,lo,-depth],[l,lo,0]);
    return g;
   });
   // Position belongs in the instance transform, never a shared first-key mesh.
   b.mesh(key,g,x,y,0,1,1,1,'#686d6b',24);
   return;
  }
  if(inCavity){
   // A perimeter frame, not an opaque backing panel across the recessed glass.
   for(const sx of[-1,1])b.box(x+sx*(w/2+.04),y,.075,.08,h+.16,.12,C.pale,29);
   for(const sy of[-1,1])b.box(x,y+sy*(h/2+.04),.075,w,.08,.12,C.pale,29);
  }else b.box(x,y,.075,w+.16,h+.16,.12,C.pale,29);b.box(x,y,.15,w,h,.055,C.glass,28);b.box(x,y,.193,.055,h,.045,C.joint,29);
  // The 2018/2019 exterior photos show individual translucent glass blocks,
  // not an opaque ventilation grille. Keep the fitted seven-by-four register.
  if(detailed){const gy=y-h/2-.46,step=w/7,rise=.77/4;
   b.box(x,gy,.07,w+.04,.81,.10,C.grid,24);
   // Two reusable meshes per window retain every block face and both colors.
   // Glass microtexture is evaluated continuously across the window register.
   for(const [name,z,bw,bh,depth,color] of [['body',.142,step-.034,rise-.027,.09,'#a9beb4'],['face',.193,step-.072,rise-.055,.016,'#c4d0c3']]){
    const key='004-glass-blocks-'+name+'-'+w,geometry=b.geo(key,()=>{
     const mesh=new G.Geometry(),box=G.box();
     for(let row=0;row<4;row++)for(let col=0;col<7;col++){
      const xx=-w/2+(col+.5)*step,yy=-.385+(row+.5)*rise;
      for(let i=0;i<box.v.length;i+=8)mesh.vertex([xx+box.v[i]*bw,yy+box.v[i+1]*bh,box.v[i+2]*depth],box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));
     }
     return mesh;
    });
    b.mesh(key,geometry,x,gy,z,1,1,1,color,28);
   }
  }
 }
 const pg=F.polygons(f.geometry)[0];
 for(let ri=0;ri<pg.length;ri++){const ring=pg[ri],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive===(ri===0))[a,c]=[c,a];const mid=[(a[0]+c[0])/2,(a[1]+c[1])/2],east=ri===0&&mid[0]>411,open=east&&mid[1]>-153.5&&mid[1]<-133.5;if(open||(ri>0&&mid[0]>400))continue;
  boundary(a,c,len=>{if(len<3)return;const south=ri===0&&mid[1]>-100&&len>20,detailed=(east||south)&&len>20,slender=ri>0||(ri===0&&mid[1]<-180&&len>20),n=Math.max(1,Math.round(len/(detailed?4.8:slender?3.1:4.2))),step=(len-1.7)/n,w=Math.min(detailed?2.65:slender?1.02:2.25,step-.65);
   // Rows of large stone slabs are visible independently of the window openings.
   for(let j=1;j<15;j++){if(south&&j*1.35<4.15){for(const [lo,hi]of[[0,4],[21,len]])b.box((lo+hi)/2,j*1.35,.018,hi-lo-.06,.022,.028,C.joint,24);}else if(south){let spans=[[.03,len-.03]];for(const q of southWindows.filter(q=>j*1.35+.011>q.lo&&j*1.35-.011<q.hi))spans=spans.flatMap(([a,c])=>q.r<=a||q.l>=c?[[a,c]]:[[a,Math.max(a,q.l)],[Math.min(c,q.r),c]].filter(([l,r])=>r-l>.001));for(const [a,c]of spans)b.box((a+c)/2,j*1.35,.018,c-a,.022,.028,C.joint,24);}else b.box(len/2,j*1.35,.018,len-.06,.022,.028,C.joint,24);}
   for(let k=1;k<len/1.8;k++){const base=south&&k*1.8>4&&k*1.8<21?4.15:.05;if(south){let spans=[[base,20.35]];for(const q of southWindows.filter(q=>k*1.8+.01>q.l&&k*1.8-.01<q.r))spans=spans.flatMap(([a,c])=>q.hi<=a||q.lo>=c?[[a,c]]:[[a,Math.max(a,q.lo)],[Math.min(c,q.hi),c]].filter(([l,r])=>r-l>.001));for(const [a,c]of spans)b.box(k*1.8,(a+c)/2,.018,.02,c-a,.028,C.joint,24);}else b.box(k*1.8,(base+20.35)/2,.018,.02,20.35-base,.028,C.joint,24);}
   for(let j=0;j<5;j++)for(let k=0;k<n;k++){const x=.85+(k+.5)*step;if(south&&j===0)continue;if(east&&detailed&&((mid[1]>-133.619&&(k===0||x>len-5.6))||(mid[1]<-153.416&&x<4.8)))continue;window(x,2.4+j*4.05,w,detailed?2.15:slender?2.9:2.45,detailed,south&&j>0);}
   if(east&&detailed&&b.lettering){
    if(mid[1]>-133.619){b.lettering('刘水楼',len-2.7,17.65,.24,4.0,.8,0,'#eeeeea');b.lettering('LIU SHUI BUILDING',len-2.7,16.76,.24,4.1,.35,0,'#eeeeea');}
    else {for(const [i,ch]of [...'环境科学与工程学院'].entries())b.lettering(ch,2.2,16.8-i*.63,.24,.45,.49,0,'#eeeeea');}
   }
   if(east&&detailed&&mid[1]>-133.619){const x=.85+step*.5;window(x,10.15,Math.min(3.4,step-.5),17.1,false);for(let j=1;j<5;j++)for(let q=0;q<4;q++)b.box(x,j*4.05+q*.14,.21,Math.min(3.4,step-.5),.06,.05,C.joint,29);}
  });
 }}
 boundary(southA,southB,()=>{
  const frame='#303b3b',pane='#506563';
  b.box(12.5,.10,-2.9,17,.20,5.8,'#b7b3a8',24);
  b.box(12.5,2.05,-.42,.66,3.9,.66,C.pale,24);
  b.box(12.5,3.99,-1.97,.66,.32,3.76,C.pale,24);
  b.box(12.5,3.99,-.28,17,.32,.48,C.stone,24);
  // Built drill photographs show shallow transverse ribs and a rear beam
  // above the glazing. Spacing and depth remain fitted to the porch envelope.
  for(const x of [8.25,16.75])b.box(x,4.015,-1.965,.24,.27,3.45,C.pale,24);
  b.box(12.5,4.015,-3.58,17,.27,.24,C.pale,24);
  const edges=[4,5.7,7.4,9.1,10.8,12.5,14.2,15.9,18.3,21],z=-3.65;
  for(const x of edges)b.box(x,2.04,z,.075,3.78,.11,frame,29);
  for(const y of [.22,3.03,3.92])b.box(12.5,y,z,17,.075,.11,frame,29);
  for(let i=1;i<edges.length;i++){
   const lo=edges[i-1],hi=edges[i],w=hi-lo-.075,x=(lo+hi)/2;
   b.box(x,3.475,z,w,.815,.045,pane,28);
   if(lo===15.9){
    // Two fitted leaves and a separate transom; a vestibule remains behind them.
    for(const cx of [16.5,17.7]){
     b.box(cx,1.62,z,1.115,2.735,.045,pane,28);
     for(const dx of [-.575,.575])b.box(cx+dx,1.62,z,.045,2.78,.095,frame,29);
     b.box(cx,.30,z,1.15,.16,.10,frame,29);
     // The previous pull floated in front of the pane. Two standoffs now
     // connect each fitted exterior pull to the glass; hidden hardware is
     // not inferred from the crowded photographs.
     const hx=cx+(cx<17?.39:-.39),metal='#aeb2ab';
     b.beam([hx,1.19,z+.13],[hx,1.81,z+.13],.018,metal,29);
     for(const y of [1.25,1.75]){
      b.beam([hx,y,z+.019],[hx,y,z+.13],.014,metal,29);
      b.box(hx,y,z+.023,.045,.045,.014,metal,29);
     }
    }
   }else{
    b.box(x,1.62,z,w,2.735,.045,pane,28);
    b.box(x,.62,z,w,.065,.10,frame,29);
   }
  }
 });
 // Built photographs show an asphalt forecourt and a planted strip in front
 // of the porch. Keep the strip and provide a fitted approach at the door bay.
 const approach=southApproach(Y.CAMPUS?.features.find(q=>q.properties.id==='way/1111656405'));
 if(approach){
  add('004-south-forecourt',F.surface({type:'Polygon',coordinates:[approach.outline]},.12),'#9a9f96',15,id);
  const ramp=new G.Geometry();ramp.quad(...approach.walk.map((p,i)=>[p[0],i===0||i===3?.20:.12,p[1]]));
  add('004-south-entry-approach',ramp,'#cbc7b7',7,id);
  for(const [a,c]of approach.curbs)boundary(a,c,len=>b.box(len/2,.14,0,len,.12,.16,C.pale,24));
 }
 // Eastern court-facing returns reveal tall glazed end strips, visible in the real photograph.
 for(const [z,flip] of [[-153.416,false],[-133.619,true]]){
  const a=flip?[414.15,z]:[404.9,z],c=flip?[406.55,z]:[412.5,z];boundary(a,c,len=>{b.box(len/2,10.1,.025,len-.15,20.0,.08,C.pale,24);window(len/2,10.2,Math.min(2.0,len-.8),17.4,false);for(let j=1;j<5;j++)b.box(len/2,j*4.05,.205,Math.min(2,len-.8),.1,.045,C.joint,29);});
 }
 // Recessed west wall and courtyard side faces inherit windows from the original inner ring.
 // Glass guardrail follows the slanted eastern edge; there is no opaque infill below it.
 const outer=pg[0],ea=outer[15],ec=outer[16];
 // The historical east photograph and newsletter cover show panel joints across
 // both suspended soffits and their exposed fascia. Clip the joints to the same
 // source footprint as the slabs: no strip may bridge the courtyard void.
 for(const [name,base,top] of [['bridge',H.bridgeBase,H.bridgeTop],['frame',H.frameBase,H.frameTop]]){
  const seams=new G.Geometry(),thin=.025;
  function seam(box){for(const p of pieces(f,box))for(let i=1;i<p.length-1;i++)seams.tri(...[p[0],p[i+1],p[i]].map(q=>[q[0],base-.012,q[1]]));}
  for(let z=-152.4;z<-133.619;z+=1.35)seam([404.9,z-thin/2,420,z+thin/2]);
  for(let x=406.25;x<420;x+=1.35)seam([x-thin/2,-153.416,x+thin/2,-133.619]);
  add('004-'+name+'-soffit-panel-joints',seams,C.joint,24,id);
  boundary(ea,ec,len=>{for(let z=-152.4;z<-133.619;z+=1.35){const t=(z-ea[1])/(ec[1]-ea[1]);if(t>0&&t<1)b.box(t*len,(base+top)/2,.015,thin,top-base-.025,.025,C.joint,24);}});
 }
 boundary(ea,ec,len=>{b.box(len/2,16.3,.06,len,.99,.075,C.rail,28);b.box(len/2,16.84,.09,len,.065,.065,C.pale,29);for(let i=0;i<=10;i++)b.box(i*len/10,16.3,.09,.055,1.05,.075,C.pale,29);});
 // The campus aerial shows a full glazed bridge enclosure set behind the outer high frame.
 boundary(ea,ec,len=>{b.box(len/2,17.575,-1.35,len-.15,3.65,.09,C.glass,28);for(let i=0;i<=13;i++)b.box(i*len/13,17.575,-1.27,.07,3.65,.06,C.pale,29);b.box(len/2,17.575,-1.26,len,.075,.07,C.pale,29);});
 // Narrow ventilation stacks are visible in the aerial; placements are fitted inside each solid roof.
 for(const [x,z] of [[402,-182],[405,-182],[408,-181],[401,-177],[404,-177],[407,-177],[401,-160],[398,-160],[405,-125],[402,-125],[399,-124],[410,-104],[406,-104],[402,-103]])if([[-.36,-.36],[.36,-.36],[.36,.36],[-.36,.36]].every(([dx,dz])=>F.inside([x+dx,z+dz],f.geometry))){b.cyl(x,20.5,z,.20,1.6,C.pale,24,1,12);b.cyl(x,22.05,z,.35,.15,C.pale,24,1,12);}
 // Small flat-roof stacks are as-built vocabulary; exact rooftop equipment is fitted.
 for(const [x,z,w,d,h] of [[399,-102,1.0,1.5,2.0],[404,-102,1.0,1.5,2.0],[411,-117,1.0,1.5,1.7],[411,-111,1.0,1.5,1.7],[390,-180,3.2,2.2,.8],[389,-140,3,3,1.0]])if([[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2],[0,0]].every(([dx,dz])=>F.inside([x+dx,z+dz],f.geometry)))b.box(x,H.main+h/2,z,w,h,d,C.pale,24);
 return {strategy:'building004-v46',floors:5,sourceOutline:true,openEastCourt:true,heightFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building004={id:ID,render,pieces,local,world,heights:H,southCoord,southApproach,southWindows,cutSouthWindows};
})(YY);
