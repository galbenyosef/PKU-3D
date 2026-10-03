/* Teaching Building 1: three storeys, genuine xieshan ends and a southern terrace porch. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/226702307';
const O=[-1.981,42.582],R=Math.atan2(3.831,60.474),CO=Math.cos(R),SI=Math.sin(R);
const C={brick:'#92958d',joint:'#acafa4',stone:'#b9bcb2',red:'#873e34',glass:'#658081',roof:'#777f79',tile:'#939a91',green:'#35665b',blue:'#496c75',gold:'#bdac76'};
const H={wall:10.65,eave:11.30,ridge:15.50,top:16.4},W=60.60,D=19.21,mid=W/2;
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
// Photo-fitted hanging relief: a filled pendant with curled recesses, not wire loops.
function gableRelief(){
 function path(start){const points=[start];return{points,line(p){points.push(p);return this;},curve(a,b,c){const p=points.at(-1);for(let i=1;i<=16;i++){const t=i/16,u=1-t;points.push([0,1].map(k=>u*u*u*p[k]+3*u*u*t*a[k]+3*u*t*t*b[k]+t*t*t*c[k]));}return this;}};}
 const half=path([0,15.24]).line([.92,14.80]).curve([.78,14.73],[.74,14.50],[.59,14.41]).curve([.88,14.44],[1.02,14.10],[.94,13.80]).curve([.88,13.49],[.54,13.35],[.24,13.28]).curve([.08,13.26],[.06,13.18],[0,13.13]).points;
 const outer=[...half,...half.slice(1,-1).reverse().map(([x,y])=>[-x,y]),half[0]];
 const curl=path([.54,14.30]).curve([.24,14.33],[.17,14.00],[.38,13.93]).curve([.56,13.85],[.67,14.10],[.51,14.18]).curve([.57,14.01],[.39,13.99],[.40,14.13]).curve([.40,14.22],[.47,14.27],[.54,14.30]).points;
 const holes=[curl,curl.map(([x,y])=>[-x,y])];
 function extrude(rings,back,front){const g=new G.Geometry();
  for(const t of F.capTriangles(rings)){g.tri(...[...t].reverse().map(([x,y])=>[x,y,front]));g.tri(...t.map(([x,y])=>[x,y,back]));}
  rings.forEach((ring,j)=>{let p=ring;if((F.area(p)>0)!==(j===0))p=[...p].reverse();for(let i=1;i<p.length;i++){const a=p[i-1],c=p[i];g.quad([a[0],a[1],back],[c[0],c[1],back],[c[0],c[1],front],[a[0],a[1],front]);}});
  return g;
 }
 const red=extrude([outer,...holes],.03,.16),gold=extrude([outer],-.02,.03);
 const wing=path([.53,14.60]).curve([.76,14.58],[.85,14.73],[.98,14.76]).line([1.02,14.60]).curve([.90,14.57],[.90,14.40],[.91,14.28]).line([.65,14.35]).line([.53,14.60]).points;
 for(const side of [-1,1]){const g=extrude([wing.map(([x,y])=>[x*side,y])],-.02,.07);gold.v.push(...g.v);}
 return{red,gold};
}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'015-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 function block(name,box,base,top,color=C.brick){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('015-'+name,g,color,color===C.brick?30:24,id);}
 block('body-west',[-1,-1,mid-1.5,21],0,H.wall);block('body-east',[mid+1.5,-1,62,21],0,H.wall);block('door-back-body',[mid-1.5,-1,mid+1.5,17.8],0,H.wall);block('door-lintel',[mid-1.5,17.8,mid+1.5,21],3.35,H.wall);
 // A real upper gable sits above the lower hipped end. Curves match at every shared edge.
 const x0=-1.2,x1=61.8,g0=4,g1=56.6,z0=-1.2,z1=20.41,zm=9.605,zg=3.0,zgs=16.21;
 const roofY=v=>{const t=1-Math.abs(v-zm)/(zm-z0);return 11.05+4.45*Math.pow(Math.max(0,t),1.4)+.25*Math.pow(1-t,10);};
 const polygons=[{name:'north-main',p:[[x0,z0],[x1,z0],[g1,zg],[g1,zm],[g0,zm],[g0,zg]],axis:1,y:p=>roofY(p[1])},{name:'south-main',p:[[g0,zm],[g1,zm],[g1,zgs],[x1,z1],[x0,z1],[g0,zgs]],axis:1,y:p=>roofY(p[1])},{name:'west-hip',p:[[x0,z0],[g0,zg],[g0,zgs],[x0,z1]],axis:0,y:p=>roofY(z0+(p[0]-x0)/(g0-x0)*(zg-z0))},{name:'east-hip',p:[[g1,zg],[x1,z0],[x1,z1],[g1,zgs]],axis:0,y:p=>roofY(z0+(x1-p[0])/(x1-g1)*(zg-z0))}];
 function roofPart(q){const mesh=new G.Geometry(),axis=q.axis,lo=Math.min(...q.p.map(p=>p[axis])),hi=Math.max(...q.p.map(p=>p[axis]));
  for(let j=0;j<30;j++){let p=clip(clip(q.p,axis,lo+(hi-lo)*j/30,true),axis,lo+(hi-lo)*(j+1)/30,false);for(let i=1;i<p.length-1;i++)mesh.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],q.y(p),p[1])));}
  add('015-roof-'+q.name,mesh,C.roof,25,id);
  Y.RoofTiles.render(b,q,{origin:O,rotation:R,key:'015',color:C.tile,eaveHigh:q.name==='south-main'||q.name==='east-hip'});
 }
 polygons.forEach(roofPart);
 const base=roofY(zg);
 for(const x of [g0,g1]){const g=new G.Geometry();for(let j=0;j<32;j++){const v=zg+(zgs-zg)*j/32,vv=zg+(zgs-zg)*(j+1)/32;g.quad(vertex(x,base,v),vertex(x,base,vv),vertex(x,roofY(vv),vv),vertex(x,roofY(v),v));}add('015-solid-gable-'+x,g,C.stone,24,id);}
 b.local(O[0],0,O[1],R,()=>{
  group('gable-red-bargeboards',()=>{
   const board=new G.Geometry(),half=(zgs-zg)/2,back=-.015,front=.18;
   for(let j=0;j<32;j++){
    const a=-half+2*half*j/32,c=-half+2*half*(j+1)/32,ya=roofY(zm+a),yc=roofY(zm+c);
    const A=[a,ya+.025],B=[a,ya-.62],C=[c,yc-.62],D=[c,yc+.025],at=(p,z)=>[...p,z];
    board.quad(at(A,front),at(B,front),at(C,front),at(D,front));
    board.quad(at(D,back),at(C,back),at(B,back),at(A,back));
    board.quad(at(A,back),at(A,front),at(D,front),at(D,back));
    board.quad(at(C,back),at(C,front),at(B,front),at(B,back));
    if(j===0)board.quad(at(A,back),at(B,back),at(B,front),at(A,front));
    if(j===31)board.quad(at(D,front),at(C,front),at(C,back),at(D,back));
   }
   const stud=new G.Geometry(),point=(a,p)=>[Math.cos(p)*Math.cos(a),Math.cos(p)*Math.sin(a),Math.sin(p)];
   for(let j=0;j<6;j++)for(let k=0;k<24;k++){
    const a=k*Math.PI/12,c=(k+1)*Math.PI/12,p=j*Math.PI/12,q=(j+1)*Math.PI/12,A=point(a,p),B=point(c,p),C=point(c,q),D=point(a,q);
    stud.tri(A,B,C,undefined,[A,B,C]);if(j<5)stud.tri(A,C,D,undefined,[A,C,D]);
   }
   for(const [x,face]of [[g0,-1],[g1,1]])b.local(x,0,zm,face*Math.PI/2,()=>{
    b.mesh('flat-board',board,0,0,0,1,1,1,C.red,20);
    // The visible source cluster has two, three, then two heads; positions are fitted.
    for(const centre of [-5,-1.1,1.1,5]){
     const slope=(roofY(zm+centre+.001)-roofY(zm+centre-.001))/.002,len=Math.hypot(1,slope);
     for(const row of [-1,0,1])for(const col of row===0?[-1,0,1]:[-.5,.5]){
      const along=col*.17,inward=row*.147;
      b.mesh('gold-stud',stud,centre+(along+inward*slope)/len,roofY(zm+centre)-.30+(along*slope-inward)/len,.18,.045,.045,.05,C.gold,29);
     }
    }
   });
   group('gable-scroll',()=>{
   const relief=gableRelief();
   for(const [x,face]of [[g0-.02,-1],[g1+.02,1]])b.local(x,0,zm,face*Math.PI/2,()=>{
    b.mesh('red-relief',relief.red,0,0,0,1,1,1,C.red,20);
    b.mesh('gold-backing',relief.gold,0,0,0,1,1,1,C.gold,20);
    // The source shows a small central round boss; its worn markings are unresolved.
    b.beam([0,13.68,.16],[0,13.68,.29],.095,'#7d8279',24);
    b.sphere(0,13.68,.29,.095,.095,.032,'#8b9086',24,0,true);
   });
  });});
  group('ridge',()=>{b.box(mid,15.55,zm,g1-g0+.25,.20,.34,C.tile,25);for(const x of [g0,g1]){b.box(x,15.86,zm,.25,.52,.30,C.tile,25);b.sphere(x,16.18,zm,.23,.20,.20,C.tile,25,0,true);}});
  // Seven symbolic figures on each of the four exposed lower corner ridges.
  group('seven-ridge-beasts',()=>{for(const east of [false,true])for(const south of [false,true])for(let j=0;j<7;j++){const t=.13+j*.10,x=east?x1-(x1-g1)*t:x0+(g0-x0)*t,v=south?z1-(z1-zgs)*t:z0+(zg-z0)*t,y=roofY(south?z1-(z1-zgs)*t:z0+(zg-z0)*t);b.sphere(x,y+.17,v,.13,.16,.12,C.roof,25,0,true);b.sphere(x,y+.35,v,.075,.08,.075,C.roof,25,0,true);}});
  function diamond(x,y,z,w,h){const g=new G.Geometry();g.quad([-w/2,0,0],[0,-h/2,0],[w/2,0,0],[0,h/2,0]);b.mesh('diamond-'+w+'x'+h,g,x,y,z,1,1,1,'#8d9d9e',24);}
  function window(x,y,z,w,h){b.box(x,y,z,w,h,.08,C.glass,5);for(const xx of [x-w/2,x,x+w/2])b.box(xx,y,z+.075,.07,h+.1,.12,C.red,20);for(const yy of [y-h/2,y+h/2,y+h*.21])b.box(x,yy,z+.075,w+.12,.065,.12,C.red,20);}
  // Long elevations use broad classroom windows and separate small central lights.
  for(const south of [true,false]){const z=south?D:0,rot=south?0:Math.PI;
   b.local(south?0:W,0,z,rot,()=>{
    group('long-windows',()=>{for(const x of [3.6,8.5,13.4,18.3,23.2,37.4,42.3,47.2,52.1,57])for(const y of [2.05,5.65,9.0])window(x,y,.025,3.10,2.60);for(const x of [27.05,33.55])for(const y of [2.05,5.65,9.0])window(x,y,.025,1.05,1.35);if(!south)for(const y of [2.05,5.65,9])window(mid,y,.025,2.2,2.6);else window(mid,9,.025,2.5,2.6);});
    group('waist-and-panels',()=>{if(south){for(const [a,c] of [[0,mid-1.5],[mid+1.5,W]])b.box((a+c)/2,.48,.025,c-a,.90,.10,C.stone,24);}else b.box(mid,.48,.025,W,.90,.10,C.stone,24);b.box(mid,3.68,.055,W,.24,.18,C.stone,24);for(const x of [3.6,8.5,13.4,18.3,23.2,37.4,42.3,47.2,52.1,57]){b.box(x,7.32,.065,3.40,.65,.16,C.stone,24);diamond(x,7.32,.17,.48,.38);for(const dx of [-1.08,1.08])diamond(x+dx,7.32,.17,.42,.32);}});
    group('long-eave-paint',()=>{b.box(mid,10.65,.12,W+.8,.34,.55,C.red,20);b.box(mid,10.91,.30,W+1,.17,.70,C.green,20);for(let x=.4;x<W;x+=.45){b.box(x,11.08,.55,.14,.14,1.25,C.red,20);b.box(x,11.08,1.19,.15,.14,.10,C.gold,9);}for(let x=1.0;x<W;x+=1.60){b.box(x,10.38,.31,.32,.18,.55,C.green,20);b.box(x,10.55,.43,.70,.12,.60,C.blue,20);b.box(x,10.43,.75,.34,.045,.045,C.gold,9);}});
   });
  }
  // Southern porch: three bays and a short broad frontal stair documented in the CETL photograph.
  group('south-three-bay-porch',()=>{b.box(mid,3.86,D+1.7,13.2,.28,3.85,C.stone,24);for(const x of [mid-6,mid-2,mid+2,mid+6])b.box(x,2.16,D+3.1,.38,3.12,.38,C.red,20);b.box(mid,.30,D+1.6175,13.2,.60,3.735,C.stone,24);});
  group('south-front-stairs',()=>{for(let i=0;i<4;i++){const top=.15*(i+1),z=D+4.75-i*.36;b.box(mid,top/2,z,13.2,top,.37,C.stone,24);}});
  group('terrace-balustrade',()=>{for(const x of [mid-6.3,mid-3.15,mid,mid+3.15,mid+6.3]){b.box(x,4.58,D+3.48,.22,1.16,.22,C.stone,24);b.box(x,5.19,D+3.48,.32,.12,.32,C.stone,24);}for(let j=0;j<4;j++){const x=mid-4.725+j*3.15;b.box(x,4.38,D+3.48,2.92,.63,.14,C.stone,24);b.box(x,4.98,D+3.48,3.15,.13,.18,C.stone,24);}for(const x of [mid-6.3,mid+6.3]){b.box(x,4.38,D+1.7,.14,.63,3.45,C.stone,24);b.box(x,4.98,D+1.7,.18,.13,3.55,C.stone,24);}});
  group('south-door',()=>{b.box(mid,1.965,17.86,2.9,2.73,.09,C.glass,5);for(const x of [mid-1.48,mid,mid+1.48])b.box(x,1.965,17.95,.09,2.73,.12,C.red,20);b.box(mid,3.31,17.95,3.06,.10,.12,C.red,20);b.box(mid,.30,18.39,2.96,.60,1.14,C.stone,24);window(mid,5.58,D+.025,1.8,2.95);});
 });
 // End windows remain conservative; no photographed but unoriented auxiliary door is relocated here.
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const aa=local(a),cc=local(c);if(Math.abs(aa[1]-cc[1])<1)continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('end-facades',()=>{const n=Math.max(1,Math.round(len/4.7));for(let k=0;k<n;k++)for(const y of [2.05,5.65,9]){const x=(k+.5)*len/n;b.box(x,y,.04,2.35,2.6,.09,C.glass,5);for(const xx of [x-1.18,x,x+1.18])b.box(xx,y,.11,.07,2.7,.10,C.red,20);for(const yy of [y-1.3,y+1.3,y+.55])b.box(x,yy,.11,2.45,.07,.10,C.red,20);}b.box(len/2,3.68,.08,len,.24,.18,C.stone,24);b.box(len/2,10.65,.12,len,.34,.55,C.red,20);
 group('short-end-dougong',()=>{b.box(len/2,10.92,.30,len+.15,.15,.70,C.green,20);for(let x=.8;x<len-.4;x+=1.6){
  b.box(x,10.55,.32,.32,.22,.55,C.green,20);
  b.box(x,10.73,.45,.59,.14,.72,C.green,20);
  b.box(x,10.85,.55,.78,.10,.82,C.blue,20);
  for(const side of [-1,1])b.beam([x+side*.13,10.47,.63],[x+side*.36,10.79,.84],.065,C.green,20);
  b.box(x,10.57,.62,.19,.035,.04,C.gold,9);
  b.box(x,10.76,.83,.48,.025,.035,C.gold,9);
 }});for(let x=.3;x<len;x+=.45)b.box(x,11.08,.5,.14,.14,1.2,C.red,20);}));}
 return{strategy:'building015-v46',floors:3,sourceOutline:true,xieshan:true,southThreeBays:true,auxiliaryDoorsUnplaced:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building015={id:ID,render,world,local,pieces,heights:H,gableRelief};
})(YY);
