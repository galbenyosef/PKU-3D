/* Photo-led Shaoyuan details and a scoped coiled-roof profile for Langrun courtyard models. */
(function(Y){'use strict';const A=Y.Architecture30,F=Y.Footprints,G=Y.Geo,previous=A.render;
function edges(g){const out=[];for(const pg of F.polygons(g))for(const ring of pg){const sign=F.area(ring)>0?1:-1;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],l=Math.hypot(c[0]-a[0],c[1]-a[1]);if(l>.01)out.push({a,c,l,ux:(c[0]-a[0])/l,uz:(c[1]-a[1])/l,nx:(c[1]-a[1])/l*sign,nz:-(c[0]-a[0])/l*sign});}}return out;}
function shell(b,f,add,h,floors,style){const id=f.properties.pickId,g=f.geometry,isTwo=style==='dorm';add('shaoyuan44-body-'+id,F.walls(g,.25,h),isTwo?'#d9ded4':'#d2cbb6',24,id);add('shaoyuan44-plinth-'+id,F.walls(g,.035,.25),'#a7afa1',10,id);add('shaoyuan44-roof-'+id,F.surface(g,h),'#909b91',22,id);b.id=id;
 for(const e of edges(g)){const rot=Math.atan2(e.nx,e.nz),fh=h/floors,count=Math.max(1,Math.floor(e.l/(isTwo?3.7:5.6))),stride=e.l/count;
 // The raised central storey replaces the old low parapet only inside its width.
 const cuts=[0,1];if(isTwo&&Math.abs(e.c[1]-e.a[1])>1e-8)for(const z of[169.75,182.45]){const t=(z-e.a[1])/(e.c[1]-e.a[1]);if(t>0&&t<1)cuts.push(t);}cuts.sort((a,b)=>a-b);
 for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2;if(isTwo&&e.a[1]+(e.c[1]-e.a[1])*mid>169.75&&e.a[1]+(e.c[1]-e.a[1])*mid<182.45)continue;const len=e.l*(hi-lo);b.local(e.a[0]+(e.c[0]-e.a[0])*mid,0,e.a[1]+(e.c[1]-e.a[1])*mid,rot,()=>{b.box(0,h+.28,-.12,len,.56,.25,isTwo?'#e1e4db':'#d2cbb6',24);b.box(0,h+.57,-.12,len+.03,.10,.36,'#b6bfb1',29);});}
 if(e.l<3)continue;for(let j=0;j<floors;j++)for(let i=0;i<count;i++){const t=(i+.5)*stride,x=e.a[0]+e.ux*t+e.nx*.075,z=e.a[1]+e.uz*t+e.nz*.075;if(isTwo&&e.nx>.7&&Math.abs(z-176.1)<6.8)continue;const ww=isTwo?Math.min(2.65,stride*.82):Math.min(4.7,stride*.88),wh=isTwo?1.85:2.25;
 b.local(x,.55+(j+.48)*fh,z,rot,()=>{if(isTwo)b.box(0,-fh*.36,-.015,stride-.14,.62,.04,'#b7846c',24);b.box(0,0,0,ww+.15,wh+.13,.12,'#dfe3d8',29);b.box(0,0,.075,ww,wh,.03,'#738783',28);for(const s of [-1,1])b.box(s*ww*.26,0,.10,.06,wh,.055,'#d9e0d5',29);b.box(0,wh*.18,.11,ww,.055,.04,'#d8dfd3',29);b.box(0,-wh/2-.12,.10,ww+.23,.10,.25,'#dfe1d6',24);});
 }}return{height:h,sourceOutline:true};}
function seven(b,f,add){shell(b,f,add,12.2,3,'stone');b.id=f.properties.pickId;
 // Projecting portico follows the photographed east-facing entrance. Dimensions are fitted.
 b.local(-320.2,0,324,Math.PI/2,()=>{
  b.box(0,2.1,1.8,13.4,4.2,.10,'#4c615d',28);for(let x=-6;x<=6;x+=2.4)b.box(x,2.1,1.87,.12,4.2,.15,'#705647',29);
  for(const x of [-8,-3.6,3.6,8])b.box(x,2.3,3.1,.58,4.6,.65,'#d8d1bc',24);
  for(const x of [-5.8,5.8]){for(let i=-4;i<=4;i++)b.box(x+i*.37,2.18,3.05,.04,3.85,.06,'#646c63',29);for(let y=.5;y<4;y+=.39)b.box(x,y,3.05,3.15,.045,.06,'#656c63',29);}
  b.box(0,4.8,1.8,18.5,.4,4.1,'#715345',29);b.box(0,5.03,1.8,18.8,.10,4.3,'#4e544a',29);
  b.box(0,3.65,3.5,11.5,.75,.18,'#704e3b',6);b.lettering('北京大学正大国际中心',0,3.69,3.62,10.8,.55,0,'#e4e1d1');
  for(let j=0;j<4;j++)b.box(0,.08+j*.105,5.02-j*.37,17,.16,1.0,'#b9bdaf',10);
  b.lettering('勺 园',0,13.95,-2.3,7.6,.7,0,'#adae9b');
 });return{strategy:'shaoyuan7-44',floors:3,entrance:'east photograph; fitted'};}
function two(b,f,add){shell(b,f,add,15.7,5,'dorm');b.id=f.properties.pickId;b.local(-351.16,0,176.1,Math.PI/2,()=>{
  // 2016 official front photograph: the centre has five balcony tiers and one extra storey.
  // Preserve the two five-storey wings; upper central facade dimensions remain fitted.
  for(const x of [-6.1,6.1])b.box(x,9.52,.15,.5,18.94,.6,'#e1e4db',24);
  // Real front openings: three fitted windows, closed wall strips between them.
  for(const [a,c]of[[-6.35,-5.05],[-2.95,-1.05],[1.05,2.95],[5.05,6.35]])b.box((a+c)/2,17.505,-.35,c-a,3.61,.14,'#d9ded4',24);
  for(const [a,c]of[[15.7,16.475],[18.625,19.31]])b.box(0,(a+c)/2,-.35,12.7,c-a,.14,'#d9ded4',24);
  for(let j=1;j<6;j++){const y=j*3.14+.15;b.box(0,y,.5,11.8,.18,1.1,'#dee1d6',24);b.box(0,y+1.05,1.0,11.8,.07,.09,'#c7d2c5',29);for(let x=-5.7;x<=5.7;x+=.65)b.box(x,y+.58,1.0,.035,.91,.045,'#c5d1c5',29);for(const x of [-4,0,4])b.window(x,y+1.7,-.07,2.1,2.15,0,'#e4e6dd');}
  b.box(0,1.65,-.03,5.5,3.3,.14,'#536964',28);b.box(0,3.6,.15,6.2,.25,1.0,'#dfe3d9',24);b.lettering('勺园2号楼',0,4.30,1.02,4.8,.55,0,'#536154');b.box(0,19.39,.2,12.8,.16,1.15,'#d8ded2',24);
 });
 // Rear depth is interpolated from the inherited map footprint, not a rear photo.
 const backAt=z=>{const xs=[];for(const e of edges(f.geometry)){if((e.a[1]<=z&&e.c[1]>=z)||(e.c[1]<=z&&e.a[1]>=z)){const dz=e.c[1]-e.a[1];if(Math.abs(dz)>1e-8)xs.push(e.a[0]+(e.c[0]-e.a[0])*(z-e.a[1])/dz);}}return Math.min(...xs);};
 const front=-351.44,z0=169.75,z1=182.45,ring=[[front,z0],[front,z1],[backAt(z1),z1],[backAt(z0),z0],[front,z0]],upper={type:'Polygon',coordinates:[ring]},sides=F.walls(upper,15.7,19.31),open=new G.Geometry();
 for(let i=0;i<sides.v.length;i+=24){if([0,8,16].every(j=>Math.abs(sides.v[i+j]-front)<1e-5))continue;for(let j=0;j<24;j+=8)open.vertex(sides.v.slice(i+j,i+j+3),sides.v.slice(i+j+3,i+j+6),sides.v.slice(i+j+6,i+j+8));}
 // Close only the projecting wedge outside the original slanted footprint.
 // The retained 15.7 m roof remains the floor everywhere the footprints overlap.
 const gapTop=new G.Geometry(),gapBottom=new G.Geometry(),gapSides=new G.Geometry();
 for(const e of edges(f.geometry)){if(e.nx<.7)continue;let lo=Math.max(z0,Math.min(e.a[1],e.c[1])),hi=Math.min(z1,Math.max(e.a[1],e.c[1]));if(hi<=lo)continue;const xAt=z=>e.a[0]+(e.c[0]-e.a[0])*(z-e.a[1])/(e.c[1]-e.a[1]);if(xAt(lo)>=front&&xAt(hi)>=front)continue;if((xAt(lo)-front)*(xAt(hi)-front)<0){const cross=e.a[1]+(front-e.a[0])*(e.c[1]-e.a[1])/(e.c[0]-e.a[0]);if(xAt(lo)<front)hi=cross;else lo=cross;}
  const gap={type:'Polygon',coordinates:[[[xAt(lo),lo],[front,lo],[front,hi],[xAt(hi),hi],[xAt(lo),lo]]]},top=F.surface(gap,15.7),bottom=F.surface(gap,15.54),edge=F.walls(gap,15.54,15.7);
  for(const [dst,src]of[[gapTop,top],[gapSides,edge]])for(let i=0;i<src.v.length;i+=8)dst.vertex(src.v.slice(i,i+3),src.v.slice(i+3,i+6),src.v.slice(i+6,i+8));
  for(let i=0;i<bottom.v.length;i+=24)for(const j of[0,16,8])gapBottom.vertex(bottom.v.slice(i+j,i+j+3),bottom.v.slice(i+j+3,i+j+6).map(n=>-n),bottom.v.slice(i+j+6,i+j+8));
 }
 add('shaoyuan194-upper-floor-gap',gapTop,'#909b91',22,f.properties.pickId);add('shaoyuan194-upper-floor-gap-underside',gapBottom,'#d8ded2',24,f.properties.pickId);add('shaoyuan194-upper-floor-gap-edge',gapSides,'#d9ded4',24,f.properties.pickId);
 add('shaoyuan194-upper-three-walls',open,'#d9ded4',24,f.properties.pickId);
 add('shaoyuan194-upper-roof-edge',F.walls(upper,19.31,19.47),'#d8ded2',24,f.properties.pickId);
 add('shaoyuan194-upper-roof',F.surface(upper,19.47),'#909b91',22,f.properties.pickId);
 const ceiling=F.surface(upper,19.31),under=new G.Geometry();for(let i=0;i<ceiling.v.length;i+=24)for(const j of[0,16,8])under.vertex(ceiling.v.slice(i+j,i+j+3),ceiling.v.slice(i+j+3,i+j+6).map(n=>-n),ceiling.v.slice(i+j+6,i+j+8));add('shaoyuan194-upper-ceiling',under,'#d8ded2',24,f.properties.pickId);
 return{strategy:'shaoyuan2-44',floors:5,centralFloors:6,centralBalconies:5,centralHeightFitted:true};}
function coiledRoof(x,y,z,w,d,h,rotation=0){this.local(x,y,z,rotation,()=>{
 const H=(t,u)=>Math.sin(Math.PI/2*Math.pow(t,1.48))+.075*Math.pow(Math.abs(u),8)*(1-t)*(1-t),half=t=>.5-.14*Math.min(1,t/.54),roof=this.geo('langrun44-coiled-hip',()=>{const g=new G.Geometry(),N=28,U=20;
 for(const side of [-1,1])for(let j=0;j<N;j++)for(let i=0;i<U;i++){const f=(t,u)=>[u*half(t),H(t,u),side*.5*(1-t)],t=j/N,s=(j+1)/N,u=-1+2*i/U,v=-1+2*(i+1)/U;g.quad(f(t,u),f(t,v),f(s,v),f(s,u));}
 for(const side of [-1,1])for(let j=0;j<14;j++)for(let i=0;i<12;i++){const f=(t,u)=>[side*half(t),H(t,1),u*.5*(1-t)],t=j/14*.54,s=(j+1)/14*.54,u=-1+2*i/12,v=-1+2*(i+1)/12;g.quad(f(t,u),f(t,v),f(s,v),f(s,u));}return g;});
 this.mesh('langrun44-coiled-hip',roof,0,0,0,w,h,d,'#6b756d',2,2.1);
 const panel=this.geo('langrun44-curved-gable',()=>{const g=new G.Geometry();for(let j=0;j<18;j++){const t=.54+.46*j/18,s=.54+.46*(j+1)/18;g.quad([0,H(t,1),-.5*(1-t)],[0,H(t,1),.5*(1-t)],[0,H(s,1),.5*(1-s)],[0,H(s,1),-.5*(1-s)]);}return g;});
 for(const side of [-1,1]){this.mesh('langrun44-curved-gable',panel,side*w*.36,0,0,1,h,d,'#814c38',6,2.06);this.box(0,-.14,side*d*.5,w,.23,.25,'#4c706b',6,1.9);}
 });}
A.render=function(b,f,add){const p=f.properties;if(p.id==='way/240832237')return seven(b,f,add);if(p.id==='way/445016207')return two(b,f,add);if(p.coiledRoof44){const old=b.n17Roof;b.n17Roof=coiledRoof;try{return previous(b,f,add)}finally{b.n17Roof=old;}}return previous(b,f,add);};
Y.Refinements44={seven,two,coiledRoof};
})(YY);
