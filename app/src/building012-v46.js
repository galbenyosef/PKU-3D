/* Remote Sensing Building: south concrete frames, west flat block, east glazed upper floor. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/104345641';
const O=[186.676,7.006],R=Math.atan2(3.597,66.615),CO=Math.cos(R),SI=Math.sin(R);
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const H={wall:14.2,lowRoof:14.45,upperBase:14.2,eave:17.35,ridge:18.15},split=30.2;
const C={wall:'#b6b8ac',column:'#bfc1b5',panel:'#a5b4a4',glass:'#718c98',frame:'#d0d8d1',dark:'#39464a',roof:'#b9c1bb',stone:'#b7b9b1',ac:'#c6c6b8'};
// Keep the source road fixed and meet its actual ribbon edge, including bends.
function entranceApproach(road){
 if(!road||road.geometry.type!=='LineString'||!(road.properties.width>0))return null;
 const ribbon=G.ribbon(road.geometry.coordinates,road.properties.width,.12).v;
 const u0=38.5-(16-.15)/2,u1=38.5+(16-.15)/2,start=15.051+1.95+.20;
 let best=null;
 for(let i=0;i<ribbon.length;i+=48)for(const [j,k]of [[0,8],[40,16]]){
  const a=local([ribbon[i+j],ribbon[i+j+2]]),c=local([ribbon[i+k],ribbon[i+k+2]]),du=c[0]-a[0];
  if(Math.abs(du)<1e-8)continue;
  const t0=(u0-a[0])/du,t1=(u1-a[0])/du;
  if(Math.min(t0,t1)<0||Math.max(t0,t1)>1)continue;
  const v0=a[1]+t0*(c[1]-a[1]),v1=a[1]+t1*(c[1]-a[1]);
  if(Math.min(v0,v1)<=start||Math.max(v0,v1)>start+15)continue;
  if(!best||v0+v1<best.v0+best.v1)best={v0,v1};
 }
 if(!best)return null;
 return {front:[world(u0,start),world(u1,start)],roadEdge:[world(u0,best.v0),world(u1,best.v1)]};
}
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g]of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const pt=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function solid(name,box,base,top,color=C.wall){const g=new G.Geometry(),cap=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(pt(a[0],base,a[1]),pt(c[0],base,c[1]),pt(c[0],top,c[1]),pt(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){cap.tri(...[p[0],p[i],p[i+1]].map(p=>pt(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>pt(p[0],base,p[1])));}}add('012-'+name,g,color,24,id);add('012-'+name+'-cap',cap,C.roof,22,id);}
 // Four masonry levels preserve the north projection. Only the two south vestibules are recessed.
 solid('upper-four-storey',[-1,-9,68,16],3.5,H.wall);
 // Open only the main doorway pocket behind the photographed open leaves.
 solid('ground-back',[-1,-9,68,10.5],0,3.5);
 solid('entry-back-west',[-1,10.5,37.32,12],0,3.5);
 solid('entry-back-east',[39.98,10.5,68,12],0,3.5);
 solid('entry-back-head',[37.32,10.5,39.98,12],2.65,3.5);
 for(const [name,a,c] of [['west-end',-1,5.2],['between-entrances',12.8,30.5],['east-end',46.5,68]])solid(name,[a,12,c,16],0,3.5);
 solid('west-flat-roof',[-1,-9,split,16],H.wall,H.lowRoof);
 function window(x,y,w=2.7,h=1.9,z=.11){b.box(x,y,z,w+.13,h+.13,.13,C.frame,29);b.box(x,y,z+.10,w,h,.045,C.glass,28);b.box(x,y,z+.14,.065,h,.05,C.frame,29);b.box(x,y+h*.23,z+.14,w,.065,.05,C.frame,29);}
 // The photographed southern face has substantial continuous columns and pale green spandrels.
 frame(0,15.051,0,()=>{const n=16,step=66.62/n;for(let i=0;i<=n;i++){const x=i*step;if(!((x>5.2&&x<12.8)||(x>30.5&&x<46.5)))b.box(x,7.1,.10,.44,14.2,.65,C.column,24);else b.box(x,8.85,.10,.44,10.7,.65,C.column,24);}
  b.box(33.31,13.75,.05,66.62,.90,.58,C.column,24);
  for(let i=0;i<n;i++){const x=(i+.5)*step;for(let j=0;j<4;j++){if(j===0&&((x>5.2&&x<12.8)||(x>30.5&&x<46.5)))continue;const y=1.7+j*3.45;b.box(x,y-1.05,-.02,step-.48,.80,.12,C.panel,24);window(x,y,step-1.0,1.92,.0);}}
  // Individually spaced AC units remain small, with a front grille.
  for(const [x,y] of [[18.7,5.0],[27.1,8.3],[35.4,11.7],[43.7,8.4],[52.0,5.0],[60.3,11.7],[56.2,8.5]]){b.box(x,y,.70,.72,.56,.50,C.ac,24);for(let q=0;q<4;q++)b.box(x,y-.18+q*.12,.97,.55,.025,.03,'#838c87',29);}
 });
 // North and projecting stair/service block are not documented as full measured elevations.
 const pg=F.polygons(f.geometry)[0][0];for(let i=1;i<pg.length;i++){let a=pg[i-1],c=pg[i];const aa=local(a),cc=local(c);if(aa[1]>14&&cc[1]>14)continue;if((aa[0]<1&&cc[0]<1)||(aa[0]>66&&cc[0]>66))continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>{const n=Math.max(1,Math.round(len/4.2));for(let k=0;k<n;k++)for(let j=0;j<4;j++)window((k+.5)*len/n,1.7+j*3.45,Math.min(2.8,len/n-.7),1.92);});}
 // End walls remain predominantly solid: only the narrow central east slit is photo-supported.
 frame(66.77,15.02,Math.PI/2,()=>{for(let j=0;j<4;j++)window(7.1,1.7+j*3.45,.78,1.9,.20);for(let j=1;j<9;j++)b.box(7.1,j*1.55,.02,14.2,.026,.04,'#9da79e',24);b.box(7.7,7.1,.03,.4,14.2,.50,C.column,24);});
 frame(.03,.1,-Math.PI/2,()=>{for(let j=1;j<9;j++)b.box(7.2,j*1.55,.04,14.3,.026,.045,'#9da79e',24);});
 // Continuous fifth-floor glass band, with a shallow east-west roof ridge.
 for(const [u,v,r,len]of [[split,15.10,0,66.85-split],[66.85,.10,Math.PI,66.85-split]])frame(u,v,r,()=>{b.box(len/2,15.73,.04,len,3.02,.07,C.glass,28);for(let x=0;x<=len;x+=1.45)b.box(x,15.73,.10,.055,3.05,.08,C.frame,29);b.box(len/2,16.62,.10,len,.055,.08,C.frame,29);});
 function endGlass(u,reverse){const g=new G.Geometry(),p=[[.08,H.upperBase],[15.1,H.upperBase],[15.1,H.eave],[7.6,H.ridge],[.08,H.eave]];for(let i=1;i<p.length-1;i++){const tri=[p[0],p[i],p[i+1]].map(p=>pt(u,p[1],p[0]));g.tri(...(reverse?tri.reverse():tri));}add('012-upper-glazed-end-'+u,g,C.glass,28,id);frame(u,15.1,Math.PI/2,()=>{for(let x=.2;x<15;x+=1.4){const top=H.eave+.8*(1-Math.abs((15.1-x)-7.6)/7.52);b.box(x,(14.2+top)/2,.06,.055,top-14.2,.07,C.frame,29);}b.box(7.5,16.55,.06,15,.055,.07,C.frame,29);});}
 endGlass(66.88,false);endGlass(split,true);
 {const roof=new G.Geometry();for(const [v0,v1,y0,y1]of [[-.10,7.6,H.eave,H.ridge],[7.6,15.35,H.ridge,H.eave]])roof.quad(pt(split-.1,y0,v0),pt(split-.1,y1,v1),pt(67.0,y1,v1),pt(67.0,y0,v0));add('012-east-shallow-roof',roof,C.roof,22,id);}
 // West roof remains flat, with a few restrained service boxes rather than invented pitched roofs.
 for(const [u,v,w,d]of [[8,6,1.8,1.4],[18,-3.2,1.3,1.0],[24,8,1.4,1.4]])frame(u,v,0,()=>b.box(0,14.73,0,w,.56,d,'#adb2a9',24));
 function legacyEntry(name,u,width,label){frame(u,15.051,0,()=>{b.box(0,3.42,1.10,width+1.1,.44,3.0,C.column,24);for(const x of [-width/2,width/2])b.box(x,1.6,-.25,.34,3.2,.42,C.column,24);
  // Deep continuous glass front, with a separate right-side bay; doors sit right of the main pane.
  if(label){const left=-width/2+.125,divider=3.4,right=width/2-.125;
   b.box((left+divider)/2,1.85,-2.82,divider-left,2.95,.08,C.glass,28);
   b.box((divider+right)/2,2.1625,-2.82,right-divider,2.325,.08,C.glass,28);
   b.box((divider+right)/2,.62,-2.83,right-divider,.76,.18,C.wall,24);
   b.box((divider+right)/2,1.0,-2.75,right-divider,.08,.20,C.stone,24);
  }else b.box(0,1.85,-2.82,width-.25,2.95,.08,C.glass,28);
  for(let x=-width/2+.2;x<width/2;x+=1.75){const side=label&&x>3.4;b.box(x,side?2.1625:1.85,-2.74,.065,side?2.325:2.95,.075,C.dark,29);}b.box(0,2.24,-2.74,width-.25,.065,.075,C.dark,29);
  const door=label?1.25:0.6;for(const x of [door-.85,door,door+.85])b.box(x,1.26,-2.66,.075,2.1,.08,C.dark,29);b.box(door,2.30,-2.66,1.8,.075,.08,C.dark,29);
  for(let k=0;k<3;k++)b.box(0,.08+.08*k,1.95-.40*k,width-.15,.16+.16*k,.40,C.stone,24);
  b.box(0,.24,-.975,width-.15,.48,3.85,C.stone,24);
  if(label&&b.lettering)b.lettering('遥 感 楼',0,3.43,2.64,4.8,.44,0,'#b4a56c');
  if(label){b.box(3.2,1.60,-2.80,.42,3.20,.35,C.column,24);b.box(3.2,1.85,-2.58,.48,2.05,.08,'#b7a577',24);for(let i=0;i<9;i++)b.cyl(-width/2+.8+i*(width-1.6)/8,3.15,1.65,.10,.08,'#c7c8b8',24,1,8);}
 });}
 function entry(name,u,width,label){
  if(!label){legacyEntry(name,u,width,label);return;}
  frame(u,15.051,0,()=>{
   const base=.48,head=2.47,top=3.18,z=-2.82,left=-1.03,right=1.33;
   b.box(0,3.42,1.10,width+1.1,.44,3.0,C.column,24);
   for(const x of [-width/2,width/2])b.box(x,1.6,-.25,.34,3.2,.42,C.column,24);
   // Main curtain proportions registered to the visible 2024 photo mullions.
   const edges=[-7.52,-5.80,-4.01,-2.23,left,right,2.51];
   for(let i=0;i<edges.length-1;i++){
    const a=edges[i],c=edges[i+1],cx=(a+c)/2,w=c-a-.065;
    b.box(cx,(head+top)/2,z,w,top-head-.065,.035,C.glass,28);
    if(i!==4)b.box(cx,(base+head)/2,z,w,head-base-.065,.035,C.glass,28);
   }
   for(const x of edges)b.box(x,(base+top)/2,z+.055,.065,top-base+.065,.08,C.dark,29);
   for(const y of [base,head,top])b.box((edges[0]+edges.at(-1))/2,y,z+.055,edges.at(-1)-edges[0],.065,.08,C.dark,29);
   // Independent framed leaves swing inward; concealed pulls are not invented.
   for(const side of [-1,1]){
    const hinge=side<0?left:right,direction=-side,angle=-side*1.30,w=(right-left-.065)/2,h=head-base-.09;
    b.local(hinge,base+.025,z+.07,angle,()=>{
     const cx=direction*w/2;
     b.box(cx,h/2,0,w-.055,h-.085,.030,C.glass,28);
     for(const x of [0,direction*w])b.box(x,h/2,0,.050,h,.067,C.dark,29);
     for(const y of [.028,h-.028])b.box(cx,y,0,w,.056,.067,C.dark,29);
    });
    // Surface-mounted closer and two articulated arms visible above each leaf.
    const metal='#b9c2bf',body=hinge+direction*.25;
    b.box(body,head+.035,z+.15,.28,.058,.085,metal,29);
    const tip=[hinge+direction*.36*Math.cos(angle),head-.075,z+.07-direction*.36*Math.sin(angle)],elbow=[hinge+direction*.43,head-.06,z-.13];
    b.beam([body,head-.02,z+.15],elbow,.013,metal,29);b.beam(elbow,tip,.013,metal,29);
   }
   // Separate right bay with a solid sill and upper ventilation row.
   const a=3.31,c=7.78,cx=(a+c)/2;
   b.box(cx,.73,z,c-a,.54,.16,C.wall,24);
   b.box(cx,1.0,z+.06,c-a,.07,.20,C.stone,24);
   b.box(cx,1.895,z,c-a,1.73,.035,C.glass,28);
   for(const x of [a,a+(c-a)/3,a+2*(c-a)/3,c])b.box(x,1.895,z+.055,.062,1.80,.08,C.dark,29);
   const vents=[a,a+.64,a+1.44,a+2.24,a+3.04,c-.64,c];
   for(let i=0;i<vents.length-1;i++){
    const x=(vents[i]+vents[i+1])/2,w=vents[i+1]-vents[i];
    b.box(x,2.97,z+.005,w-.028,.40,.06,i===0||i===vents.length-2?C.frame:C.dark,29);
    b.box(x,2.97,z+.044,w*.56,.24,.025,'#243236',29);
   }
   for(const y of [2.76,3.18])b.box(cx,y,z+.055,c-a,.062,.08,C.dark,29);
   b.box(2.91,1.6,-2.80,.80,3.2,.35,C.column,24);
   b.box(2.91,1.85,-2.58,.53,2.05,.08,'#b7a577',24);
   for(let k=0;k<3;k++)b.box(0,.08+.08*k,1.95-.40*k,width-.15,.16+.16*k,.40,C.stone,24);
   // The landing meets the top riser exactly and continues behind both leaves.
   b.box(0,.24,-.975,width-.15,.48,3.85,C.stone,24);
   b.box((left+right)/2,.24,-3.75,2.60,.48,1.70,C.stone,24);
   b.noPlant(0,-.65,width+1,5.65);
   if(b.lettering)b.lettering('遥 感 楼',0,3.43,2.64,4.8,.44,0,'#b4a56c');
   for(let i=0;i<9;i++)b.cyl(-width/2+.8+i*(width-1.6)/8,3.15,1.65,.10,.08,'#c7c8b8',24,1,24);
  });
 }
 entry('main',38.5,16,true);entry('west',9.0,7.6,false);
 const approach=entranceApproach(Y.CAMPUS?.features.find(q=>q.properties.id==='way/1154086721'));
 if(approach){
  const outline=[approach.front[0],approach.front[1],approach.roadEdge[1],approach.roadEdge[0]],g=new G.Geometry();
  // A slight fitted grade joins the low first riser to the existing raised road.
  const vertices=outline.map((p,i)=>[p[0],i<2?.025:.12,p[1]]);
  g.quad(vertices[0],vertices[3],vertices[2],vertices[1]);add('012-main-entry-approach',g,'#858780',21,id);
  const xs=outline.map(p=>p[0]),zs=outline.map(p=>p[1]);
  const x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs);
  b.noPlant((x0+x1)/2,(z0+z1)/2,x1-x0,z1-z0);
 }

 // Sparse façade climbers, limited to the low western block; not a building-wide green material.
 frame(0,15.40,0,()=>{for(const [x,y,w,h]of [[2.4,5.2,.30,7.0],[14.2,6.1,.25,6.2],[16.7,9.4,.22,4.0]])b.box(x,y,0,w,h,.035,'#5f725a',24);});
 return {strategy:'building012-v46',westFloors:4,eastFloors:5,sourceOutline:true,heightFitted:true,orientationConflictRecorded:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building012={id:ID,render,world,local,pieces,heights:H,split,entranceApproach};
})(YY);
