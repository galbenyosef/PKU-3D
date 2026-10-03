/* Chen Ming99: continuous main roof/shell from its own orthophoto; six levels
 * on the photographed west elevation. Height/orientation/detail sizes are fits.
 * Unseen east/north openings retain the previous model's qualified approximation. */
(function(Y){'use strict';const previous=Y.Architecture30.render,P=Y.Builder.prototype,legacy=P.lawChenming,G=Y.Geo,ID='way/240825566';
const C={stone:'#a9b1aa',base:'#989d97',frame:'#c4c9be',metal:'#475653',roof:'#939e92'};
function source(b,p,w,d){
 // Read only the old exterior east/north window definitions, without replaying
 // the false courtyard, interior facades, furniture or south monumental portal.
 const keep=[],saved={};for(const name of ['mesh','lawGlazing','lettering','solid','noPlant','bench'])saved[name]={own:Object.hasOwn(b,name),fn:b[name]};
 b.mesh=b.lettering=b.solid=b.noPlant=b.bench=()=>{};
 b.lawGlazing=function(...q){const[x,y,z,ww,hh,r]=q;if(hh===2.8&&(x>30&&Math.abs(r-Math.PI/2)<1e-6||z<-29.9&&Math.abs(r-Math.PI)<1e-6))keep.push(q);};
 try{legacy.call(b,p,w,d);}finally{for(const[n,s]of Object.entries(saved)){if(s.own)b[n]=s.fn;else delete b[n];}}
 const glazed=b.lawGlazing.bind(b),pitch=2.85,west=[];
 // Eight office bays end before the separate entrance-screen zone. Six full
 // levels sit below one shared roof; no fifth/sixth row is laid over old panes.
 for(let floor=0;floor<6;floor++)for(let j=0;j<8;j++)west.push({u:3.25+j*4.65,y:1.82+floor*pitch,w:2.65,h:1.9,glazed:true});
 // Photograph shows glazing above the entrance but crops/obscures its leaves.
 // Keep the ground opening genuinely open; only the visible transom is glazed.
 west.push({u:48,y:1.85,w:12,h:3.7,entrance:true});
 const east=keep.filter(q=>q[0]>30).map(q=>({u:31-q[2],y:q[1],w:q[3],h:q[4],glazed:true,part:q[6],spacing:q[7]}));
 const north=keep.filter(q=>q[2]<-29.9).map(q=>({u:30-q[0],y:q[1],w:q[3],h:q[4],glazed:true,part:q[6],spacing:q[7]}));
 const unique=qs=>qs.filter((q,i)=>!qs.slice(0,i).some(o=>Math.abs(o.u-q.u)<1e-6&&o.y===q.y&&o.w===q.w));
 // Actual rectangular apertures through the shell, including returns. Divide
 // around the union of inherited openings so overlapping legacy bays cannot
 // put opaque wall patches behind another opening.
 function facade(x,z,r,len,qs,name){b.local(x,0,z,r,()=>{
  const start=name==='south'?.36:0;const us=[start,len,...qs.flatMap(q=>[Math.max(start,q.u-q.w/2),Math.min(len,q.u+q.w/2)])].sort((a,b)=>a-b),ys=[0,18.36,...qs.flatMap(q=>[Math.max(0,q.y-q.h/2),Math.min(18.36,q.y+q.h/2)])].sort((a,b)=>a-b);
  for(let i=1;i<us.length;i++)for(let j=1;j<ys.length;j++){const u=(us[i-1]+us[i])/2,y=(ys[j-1]+ys[j])/2,ww=us[i]-us[i-1],hh=ys[j]-ys[j-1];if(ww<1e-6||hh<1e-6||qs.some(q=>Math.abs(u-q.u)<q.w/2-1e-7&&Math.abs(y-q.y)<q.h/2-1e-7))continue;if(name==='west'&&us[i-1]>=54){if(ys[j-1]===0)b.box(u,9.18,-.18,ww,18.36,.36,C.stone,24,.65);}else b.box(u,y,-.18,ww,hh,.36,C.stone,24,.65);}
  // The structural courses share the same six levels around every elevation.
  // Keep the cap continuous while lower courses stop at large glazing/openings.
  for(let floor=0;floor<6;floor++){const y=3.3+floor*pitch;for(let i=1;i<us.length;i++){const u=(us[i-1]+us[i])/2,ww=us[i]-us[i-1];if(ww<1e-6||qs.some(q=>Math.abs(u-q.u)<q.w/2&&Math.abs(y-q.y)<q.h/2+.12))continue;b.box(u,y,.015,ww,.23,.09,C.frame,24,1);}}
  for(const q of qs){
   if(q.glazed){
    if(name==='south'){
     // Replace the inherited single arbitrary crossbar with the six structural
     // levels; keep the rest of the original tall glazing assembly intact.
     const box=b.box,own=Object.hasOwn(b,'box');b.box=function(...a){if(a[0]===0&&Math.abs(a[1]-q.h*.16)<1e-8&&a[3]===q.w&&a[4]===.065&&a[5]===.17)return;if(a[3]===q.w)a[3]-=.08;if(a[3]===.10&&a[0]<0)a[0]+=.04;return box.apply(this,a);};
     try{glazed(q.u,q.y,.035,q.w,q.h,0,q.part||.8,q.spacing||1.5);}finally{if(own)b.box=box;else delete b.box;}
     for(let floor=0;floor<6;floor++)b.box(q.u,3.3+floor*pitch,.16,q.w-.08,.105,.17,'#849a94',9,1.18);
    }else glazed(q.u,q.y,.035,q.w,q.h,0,q.part||.8,q.spacing||1.5);
    // Close the existing window frame's depth to the through-wall reveal.
    for(const s of[-1,1]){if(name==='south'&&s===-1&&q.u-q.w/2===0)continue;b.box(q.u+s*(q.w/2+.018),q.y,-.12,.036,q.h,.30,C.stone,24,.82);}
    for(const s of[-1,1])b.box(q.u,q.y+s*(q.h/2+.018),-.12,name==='south'?q.w-.08:q.w,.036,.30,C.stone,24,.82);
   }
  }
 });}
 facade(-30,-31,-Math.PI/2,62,west,'west');facade(30,31,Math.PI/2,62,unique(east),'east');facade(30,-31,Math.PI,60,unique(north),'north');
 // The known narrow blue return is on the south-west corner. Its extent is a
 // photograph fit; no new door is asserted on the obscured south stone face.
 const south=[{u:7,y:8.80,w:14,h:17.10,glazed:true,part:.95,spacing:1.54}];facade(-30,30.6,0,60,south,'south');
 // Continuous floor/roof plates replace the invented open courtyard entirely.
 // Ground plate meets the aperture; upper plates stay inside the outer shell.
 for(let floor=0;floor<6;floor++)b.box(0,floor===0?.055:.25+floor*pitch,0,59.3,floor===0?.11:.16,61.3,C.base,24,.12+floor*.06);
 b.box(0,17.48,-.2,59.28,.26,60.88,C.stone,24,1.32);
 const key='v12-chen-eave',geo=b.geo(key,()=>{const q=new G.Geometry();q.quad([-.5,0,.5],[.5,0,.5],[.5,.32,-.5],[-.5,.32,-.5]);q.quad([-.5,-.13,.5],[.5,-.13,.5],[.5,0,.5],[-.5,0,.5]);q.quad([-.5,.32,-.5],[.5,.32,-.5],[.5,.17,-.5],[-.5,.17,-.5]);return q;});
 b.mesh(key,geo,0,18,0,63,1,64.5,'#5d6d64',9,1.95);b.box(0,18.48,0,60,.24,62,C.roof,21,2.1);
 // West entrance: open lower aperture, photo-visible transom, projecting metal
 // screen in two unequal bays. Blade count and depth are fitted, not surveyed.
 b.local(-30,-0,-31,-Math.PI/2,()=>{
  glazed(48,3.12,.035,12,1.02,0,.95,1.5);
  // Close the actual .07 source-unit gap above the existing transom, without
  // adding a lower door leaf or blocking the view to the interior.
  b.mesh('chen99-entry-head-return',b.geo('box',G.box),48,3.665,-.0125,12,.07,.405,C.metal,9,1.49);
  for(const u of[41.8,50.3,54.2])b.box(u,10.55,.58,.18,13.55,1.12,C.metal,9,1.6);
  for(const y of[3.78,10.1,17.32])b.box(48,y,.58,12.6,.15,1.12,C.metal,9,1.6);
  for(let j=0;j<42;j++){const y=3.95+j*.315;b.box(46.1,y,.62,8.2,.11,1.05,'#88968f',9,1.62);if(y<12.75)b.box(52.2,y,.62,3.5,.11,1.05,'#88968f',9,1.62);}
  glazed(52.2,15.08,.63,3.48,4.24,0,1.64,1.6);
  // Crop only transparent atlas borders. Matching geometry/UV crops preserve
  // every glyph's world size and texel density, and reuse its existing tile.
  const mesh=b.mesh,ownMesh=Object.hasOwn(b,'mesh');
  b.mesh=function(...a){if(a[0]==='plane'&&a[9]===8&&a[12]){const uv=a[12];a[6]*=.92;a[12]=[uv[0],uv[1]+uv[3]*.04,uv[2],uv[3]*.92];}return mesh.apply(this,a);};
  try{b.lettering('陈明楼',58,15.96,.20,6.0,1.02,0,'#dce0d5');b.lettering('Chen Ming Building',58,14.90,.20,6.2,.48,0,'#dce0d5');}
  finally{if(ownMesh)b.mesh=mesh;else delete b.mesh;}
 });
}
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==99||f.properties.id!==ID)return previous.call(this,b,f,add);const old=b.e.add;b.e.add=function(k,...args){return old.call(this,k+'-chenming99-solid-main',...args);};try{return Y.ArchitectureAdapter.render(b,f,source,Y.ARCHIVE.legacy['313'],{name:'chenming99-solid-main',sourceFrame:{centre:[0,.425],w:63,d:65.34999990463257}});}finally{b.e.add=old;}};
Y.Chenming99={id:ID,floors:6,source,sourceWindowCentres:[1.82,4.67,7.52,10.37,13.22,16.07],heightMeasured:false,orientation:'west entrance inferred from south lawn and official corner photographs',entranceLeavesVerified:false};
})(YY);
