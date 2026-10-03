/* Archive / old Yenching Library: three documented floors, two tall visible window tiers. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/226704412';
const O=[-297.137,-83.953],R=Math.atan2(-35.342,.111),CO=Math.cos(R),SI=Math.sin(R),W=35.3422,D=19.088,mid=W/2;
const C={wall:'#d5d9cd',stone:'#acb6ae',red:'#883e31',frame:'#864231',glass:'#70877d',roof:'#798374',tile:'#929d8b',green:'#387b70',blue:'#407b91',gold:'#b8b279'};
const H={wall:8.35,upper:10.35,eave:10.65,ridge:15.25,top:16.1};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function entranceApproach(road){
 if(!road||road.geometry.type!=='LineString'||!(road.properties.width>0))return null;
 const ribbon=G.ribbon(road.geometry.coordinates,road.properties.width,.12).v,u0=mid-1.9,u1=mid+1.9,start=D+2.30;
 let best=null;
 for(let i=0;i<ribbon.length;i+=48)for(const [j,k]of [[0,8],[40,16]]){
  const a=local([ribbon[i+j],ribbon[i+j+2]]),c=local([ribbon[i+k],ribbon[i+k+2]]),du=c[0]-a[0];if(Math.abs(du)<1e-8)continue;
  const t0=(u0-a[0])/du,t1=(u1-a[0])/du;if(Math.min(t0,t1)<0||Math.max(t0,t1)>1)continue;
  const v0=a[1]+t0*(c[1]-a[1]),v1=a[1]+t1*(c[1]-a[1]);if(Math.min(v0,v1)<=start||Math.max(v0,v1)>start+12)continue;
  if(!best||v0+v1<best.v0+best.v1)best={v0,v1};
 }
 if(!best)return null;
 return{front:[world(mid-3.725,start),world(mid+3.725,start)],roadEdge:[world(u0,best.v0),world(u1,best.v1)]};
}
let transomMesh;
function transom(){if(transomMesh)return transomMesh;const g=new G.Geometry();
 function bar(x,y,w,h){const a=x-w/2,c=x+w/2,d=y-h/2,e=y+h/2,z=.5;
  g.quad([a,d,z],[c,d,z],[c,e,z],[a,e,z]);g.quad([c,d,-z],[a,d,-z],[a,e,-z],[c,e,-z]);
  g.quad([a,d,-z],[c,d,-z],[c,d,z],[a,d,z]);g.quad([a,e,z],[c,e,z],[c,e,-z],[a,e,-z]);
  g.quad([a,d,-z],[a,d,z],[a,e,z],[a,e,-z]);g.quad([c,d,z],[c,d,-z],[c,e,-z],[c,e,z]);}
 const t=.055;
 for(const r of [.47,.29]){for(const x of [-r,r])bar(x,0,t,2*r+t);for(const y of [-r,r])bar(0,y,2*r-t,t);}
 for(const x of [-.38,.38])bar(x,0,.18,t);for(const y of [-.38,.38])bar(0,y,t,.18);
 transomMesh=g;return g;
}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'018-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 function upperPanels(left,right,plane,name){group(name,()=>{
  const bottom=8.62,top=10.05,count=Math.max(1,Math.round((right-left)/1.3)),step=(right-left)/count;
  b.box((left+right)/2,(bottom+top)/2,plane-.055,right-left,top-bottom,.11,C.red,20);
  for(const y of [bottom,top])b.box((left+right)/2,y,plane+.025,right-left+.08,.09,.10,C.frame,20);
  for(let j=0;j<count;j++){
   const x=left+(j+.5)*step,w=step-.12;
   b.box(x,9.335,plane+.013,w,1.19,.055,'#633a30',20);
   for(const xx of [x-w/2,x+w/2])b.box(xx,9.335,plane+.058,.045,1.26,.075,C.red,20);
   // Restrain the visible gold field to a fitted border; fine pictorial motifs unresolved.
   const iw=w-.25,ih=.93;
   for(const xx of [x-iw/2,x+iw/2])b.box(xx,9.335,plane+.087,.016,ih,.014,C.gold,20);
   for(const yy of [9.335-ih/2,9.335+ih/2])b.box(x,yy,plane+.087,iw,.016,.014,C.gold,20);
  }
 });}
 function block(name,box,base,top,color=C.wall){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('018-'+name,g,color,24,id);}
 block('body-north',[-1,-1,mid-1.8,D+1],0,H.wall);
 block('body-south',[mid+1.8,-1,W+1,D+1],0,H.wall);
 block('entry-back',[mid-1.8,-1,mid+1.8,D-1.2],0,H.wall);
 block('entry-lintel',[mid-1.8,D-1.2,mid+1.8,D+1],3.94,H.wall);
 // The upper band has actual shallow recesses. Its link to internal floor slabs remains unmeasured.
 block('upper-inset-shell',[2.2,.95,W-2.2,D-.95],8.52,H.upper,'#737b6c');
 for(const [a,c] of [[0,2.2],[W-2.2,W]])block('upper-end-pier-'+a,[a,-1,c,D+1],8.52,H.upper);
 block('upper-sill',[-1,-1,W+1,D+1],8.35,8.52,C.red);
 // Official archives photograph shows a raised gable above the lower hip apron.
 // Shoulder height, gable setback and trim dimensions remain photo fitted.
 const x0=-1.35,x1=W+1.35,z0=-1.35,z1=D+1.35,zm=D/2,g0=5,g1=W-5;
 const roofY=v=>{const t=Math.max(0,1-Math.abs(v-zm)/(zm-z0));return 10.38+4.87*Math.pow(t,1.35)+.27*Math.pow(1-t,10);};
 const cut=z0+.6*(zm-z0),far=D-cut,shoulder=roofY(cut);
 const faces=[
  {name:'east-long',p:[[x0,z0],[x1,z0],[g1,cut],[g1,zm],[g0,zm],[g0,cut]],axis:1,y:p=>roofY(p[1])},
  {name:'west-long',p:[[g0,zm],[g1,zm],[g1,far],[x1,z1],[x0,z1],[g0,far]],axis:1,y:p=>roofY(p[1])},
  {name:'north-lower-hip',p:[[x0,z0],[g0,cut],[g0,far],[x0,z1]],axis:0,y:p=>roofY(z0+(p[0]-x0)/(g0-x0)*(cut-z0))},
  {name:'south-lower-hip',p:[[g1,cut],[x1,z0],[x1,z1],[g1,far]],axis:0,y:p=>roofY(z0+(x1-p[0])/(x1-g1)*(cut-z0))}
 ];
 for(const q of faces){const mesh=new G.Geometry(),axis=q.axis,lo=Math.min(...q.p.map(p=>p[axis])),hi=Math.max(...q.p.map(p=>p[axis]));
  for(let j=0;j<30;j++){const p=clip(clip(q.p,axis,lo+(hi-lo)*j/30,true),axis,lo+(hi-lo)*(j+1)/30,false);if(p.length<3)continue;
   for(const tri of F.capTriangles([[...p,p[0]]])){if(F.area([...tri,tri[0]])>0)tri.reverse();mesh.tri(...tri.map(p=>vertex(p[0],q.y(p),p[1])));}
  }add('018-roof-envelope-'+q.name,mesh,C.roof,25,id);
  Y.RoofTiles.render(b,q,{origin:O,rotation:R,key:'018',color:C.tile,eaveHigh:q.name==='west-long'||q.name==='south-lower-hip',offset:.10});
 }
 b.local(O[0],0,O[1],R,()=>{
  for(const [u,direction]of [[g0,-1],[g1,1]])group('raised-gable-'+(direction<0?'north':'south'),()=>{
   const face=new G.Geometry(),outline=[[cut,shoulder],[far,shoulder]];
   for(let j=1;j<32;j++){const v=far-(far-cut)*j/32;outline.push([v,roofY(v)]);}
   for(const t of F.capTriangles([[...outline,outline[0]]]))for(const side of [-1,1]){
    const q=t.map(([v,y])=>[u+side*.07,y,v]);const cross=Y.M.cross(Y.M.sub(q[1],q[0]),Y.M.sub(q[2],q[0]));if(cross[0]*side<0)q.reverse();face.tri(...q);
   }
   for(let j=0;j<outline.length;j++){const a=outline[j],c=outline[(j+1)%outline.length];face.quad([u-.07,a[1],a[0]],[u+.07,a[1],a[0]],[u+.07,c[1],c[0]],[u-.07,c[1],c[0]]);}
   b.mesh('018-gable-panel',face,0,0,0,1,1,1,C.red,20);
   const x=u+direction*.105,margin=.25;
   // A restrained lattice expresses the visible gold field; exact motif unresolved.
   for(let v=cut+margin;v<far-margin;v+=.23){const top=roofY(v)-.20;if(top>shoulder+.12)b.box(x,(top+shoulder+.12)/2,v,.035,top-shoulder-.12,.027,C.gold,20);}
   for(let y=shoulder+.15;y<H.ridge-.20;y+=.23){let a=cut,b=zm;for(let j=0;j<24;j++){const v=(a+b)/2;if(roofY(v)<y+.20)a=v;else b=v;}const v=Math.max(cut+margin,b);if(v<zm)bBox(y,v);}
   function bBox(y,v){b.box(x,y,zm,.035,.027,D-2*v,C.gold,20);}
   for(let j=0;j<32;j++){const a=cut+(far-cut)*j/32,c=cut+(far-cut)*(j+1)/32;b.beam([u+direction*.14,roofY(a)-.02,a],[u+direction*.14,roofY(c)-.02,c],.14,C.red,20);}
   b.box(u+direction*.14,shoulder+.04,zm,.15,.16,far-cut+.15,C.red,20);
  });
 });
 b.local(O[0],0,O[1],R,()=>{
  group('roof-ridge',()=>{b.box(mid,15.31,zm,g1-g0+.3,.16,.30,C.tile,25);for(const x of [g0,g1]){b.box(x,15.61,zm,.22,.46,.25,C.tile,25);b.sphere(x,15.94,zm,.17,.15,.17,C.tile,25,0,true);}});
  function window(x,y,z,w,h){b.box(x,y,z,w,h,.075,C.glass,5);for(const xx of [x-w/2,x-w/6,x+w/6,x+w/2])b.box(xx,y,z+.07,.055,h+.09,.11,C.frame,20);for(const yy of [y-h/2,y-.12,y+h/2-.52,y+h/2])b.box(x,yy,z+.07,w+.10,.055,.11,C.frame,20);const count=w<2?3:6,cell=(w-.16)/count;for(let j=0;j<count;j++)b.mesh('018-transom-grid',transom(),x-w/2+.08+(j+.5)*cell,y+h/2-.26,z+.10,cell-.06,.40,.035,C.frame,20);}

  for(const east of [true,false])b.local(east?W:0,0,east?0:D,east?Math.PI:0,()=>{
   const positions=[4.35,9.68,15.0,20.32,25.65,30.98];
   group((east?'east':'west')+'-tall-windows',()=>{for(const x of positions)for(const y of [2.28,6.14])if(east||y>3||Math.abs(x-mid)>4)window(x,y,.025,3.58,2.97);});
   group('white-bands-and-piers',()=>{if(east)b.box(mid,.38,.025,W,.76,.10,C.stone,24);else for(const side of [-1,1])b.box(mid+side*(W/4+.9),.38,.025,W/2-1.8,.76,.10,C.stone,24);if(east)b.box(mid,4.15,.055,W,.63,.16,C.wall,24);else for(const side of [-1,1])b.box(mid+side*(W/4+1.7),4.15,.055,W/2-3.4,.63,.16,C.wall,24);for(const x of [1.18,W-1.18])b.box(x,4.3,.09,1.65,8.0,.14,C.wall,24);for(const y of [3.82,4.48])if(east)b.box(mid,y,.13,W,.075,.14,'#bdc8bd',24);else for(const side of [-1,1])b.box(mid+side*(W/4+1.7),y,.13,W/2-3.4,.075,.14,'#bdc8bd',24);});
   group('cross-level-red-posts',()=>{for(const x of [1.45,6.98,12.31,17.65,22.98,28.31,33.89])if(!east&&Math.abs(x-mid)<.1)b.box(x,7.56,.16,.25,5.32,.24,C.red,20);else b.box(x,5.30,.16,.25,9.84,.24,C.red,20);});
   upperPanels(2.2,W-2.2,-.84,(east?'east':'west')+'-upper-wood-panels');
   group('painted-deep-eave',()=>{b.box(mid,8.42,.24,W,.34,.46,C.blue,20);for(let x=1.1;x<W;x+=2.2){b.box(x,8.43,.51,1.67,.17,.06,C.green,20);b.box(x,8.43,.55,1.21,.035,.05,C.gold,9);}b.box(mid,10.22,.24,W+.7,.22,.70,C.red,20);b.box(mid,10.44,.37,W+.9,.15,.88,C.green,20);for(let x=.2;x<W;x+=.38){b.box(x,10.54,.62,.14,.14,1.40,C.red,20);b.box(x,10.54,1.33,.15,.14,.07,C.gold,9);}});
  });
 });
 // West-side placement is inferred from the event location and mapped approach.
 b.local(O[0],0,O[1],R,()=>b.local(0,0,D,0,()=>group('west-entry',()=>{
  const plane=-.22;
  function pane(left,right,bottom,top){
   b.box((left+right)/2,(bottom+top)/2,plane-.065,right-left,top-bottom,.045,'#344540',5);
   // Photo shows vertical members crossed by two diagonal families.
   for(let x=left+.13;x<right-.02;x+=.20)b.box(x,(bottom+top)/2,plane,.017,top-bottom,.035,C.frame,20);
   for(const slope of [-.70,.70]){const h=top-bottom,lo=Math.min(left,left-slope*h),hi=Math.max(right,right-slope*h);
    for(let x=Math.ceil(lo/.20)*.20;x<hi;x+=.20){const a=(left-x)/slope,c=(right-x)/slope,low=Math.max(0,Math.min(a,c)),high=Math.min(h,Math.max(a,c));if(high-low>.02)b.beam([x+slope*low,bottom+low,plane],[x+slope*high,bottom+high,plane],.012,C.frame,20);}
   }
  }
  for(const [left,right]of [[mid-1.68,mid-1.13],[mid-1.11,mid-.01],[mid+.01,mid+1.11],[mid+1.13,mid+1.68]]){
   const x=(left+right)/2,w=right-left;
   for(const edge of [left+.04,right-.04])b.box(edge,2.30,plane,.08,3.16,.13,C.red,20);
   b.box(x,.99,plane-.01,w-.08,.54,.11,C.red,20);
   for(const y of [1.28,3.02,3.87])b.box(x,y,plane,w,.10,.14,C.red,20);
   pane(left+.08,right-.08,1.34,2.96);pane(left+.08,right-.08,3.08,3.81);
  }
  for(const x of [mid-1.77,mid+1.77])b.box(x,2.32,plane,.12,3.24,.23,C.red,20);
  b.box(mid,3.94,plane,3.66,.13,.25,C.red,20);
  // A shallow recess has a visible threshold and head return, not a painted door.
  b.box(mid,.66,-.60,3.6,.12,1.20,C.stone,24);
  for(const side of [-1,1]){
   const x=mid+side*2.60;b.box(x,2.31,.03,1.08,3.12,.08,C.glass,5);
   for(const xx of [x-.58,x+.58])b.box(xx,2.31,.11,.09,3.30,.13,C.frame,20);
   for(const yy of [.72,2.99,3.9])b.box(x,yy,.11,1.25,.09,.14,C.frame,20);
   for(const yy of [1.86,3.45]){const h=yy<3?2.08:.68;b.mesh('018-entry-side-window-fret',transom(),x,yy,.14,.98,h,.034,C.frame,20);}
   // Small dark wall lantern with a capped glass body.
   b.box(mid+side*1.97,3.71,.25,.13,.37,.16,'#414b43',9);
   b.box(mid+side*1.97,3.72,.39,.18,.27,.20,'#bec5b0',5);
   for(const y of [3.54,3.90])b.box(mid+side*1.97,y,.39,.24,.055,.25,'#414b43',9);
  }
  b.box(mid+.09,2.97,plane+.10,.32,.034,.055,'#68736a',9);
  b.box(mid+.25,2.97,plane+.12,.025,.10,.06,'#68736a',9);
  b.box(mid,4.48,.14,3.45,.65,.16,C.red,20);
  // Lettering uses the existing atlas path.
  b.sign('北京大学档案馆',mid,4.48,.24,3.15,.46);
  const uv=b.signs.get('北京大学档案馆_false'),px=uv[0]*4096,py=(1-uv[1])*4096-128;
  b.ctx.fillStyle=C.red;b.ctx.fillRect(px,py,512,128);b.ctx.fillStyle='#657c70';b.ctx.font='600 60px "Noto Serif CJK SC","Songti SC",serif';b.ctx.textAlign='center';b.ctx.textBaseline='middle';b.ctx.fillText('北京大学档案馆',px+256,py+65);
  // Disjoint stone treads meet the landing at 0.72 m, fitted from the photograph.
  for(const [near,far,top]of [[0,1.22,.72],[1.22,1.58,.54],[1.58,1.94,.36],[1.94,2.30,.18]])b.box(mid,top/2,(near+far)/2,7.45,top,far-near,C.stone,24);
 })));
 const approach=entranceApproach(Y.CAMPUS?.features.find(q=>q.properties.id==='way/240825494'));
 if(approach){const outline=[approach.front[0],approach.front[1],approach.roadEdge[1],approach.roadEdge[0]],mesh=new G.Geometry(),v=outline.map((p,i)=>[p[0],i<2?.025:.12,p[1]]);
  mesh.quad(v[0],v[3],v[2],v[1]);add('018-west-entry-approach',mesh,'#aeb0a2',7,id);
 }
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const aa=local(a),cc=local(c);if(Math.abs(aa[0]-cc[0])>1)continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>{upperPanels(2.2,len-2.2,.10,'short-end-upper-wood-panels');group('short-end-fitted',()=>{for(const x of [len*.30,len*.70])for(const y of [2.28,6.14]){b.box(x,y,.035,3.25,2.97,.08,C.glass,5);for(const xx of [x-1.63,x,x+1.63])b.box(xx,y,.10,.055,3.06,.11,C.frame,20);for(const yy of [y-1.485,y+1.485,y+.95])b.box(x,yy,.10,3.35,.055,.11,C.frame,20);}b.box(len/2,4.15,.055,len,.63,.16,C.wall,24);b.box(len/2,8.42,.24,len,.34,.46,C.blue,20);b.box(len/2,10.22,.24,len,.22,.70,C.red,20);});});}
 return{strategy:'building018-v46',floors:3,basementFloors:1,visibleTallWindowTiers:2,sourceOutline:true,atriumCoverUnverified:true,interiorUnmodeled:true,hipAndGableObserved:true,roofDimensionsFitted:true,entranceInferred:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building018={id:ID,entrance:{side:"west",inferred:true,u:mid,v:D,threshold:.72},render,world,local,pieces,transom,entranceApproach,heights:H};
})(YY);
