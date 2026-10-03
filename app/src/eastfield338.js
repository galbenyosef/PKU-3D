/* ArcGIS orthophoto layout fit. Source map geometries are immutable.
 * Two east-west pitches; covered climbing wall is fitted to official 2025 photographs.
 * Surface hook: EastField338.surfaceGeometry(f) || f.geometry in scene-v29 sport branch.
 */
(function(Y){'use strict';const previous=Y.Refinements41.sport,G=Y.Geo;
 const field=Y.CAMPUS.features.find(f=>f.properties.pickId===49),fr=Y.ArchitectureAdapter.frame(field.geometry);
 field.properties.architecture={...field.properties.architecture,summary:'南北并列的两块东西向足球场'};
 field.properties.scopeNote='两块独立球场按公开正射影像拟合朝向和相邻关系；划线、尺寸与灯位为显示拟合，非测绘。';
 const climbing=Y.CAMPUS.features.find(f=>f.properties.pickId===177);climbing.properties.architecture={...climbing.properties.architecture,summary:'连续白色岩壁 · 波纹雨棚与红黑条带'};climbing.properties.scopeNote='2025年校方照片支持有棚连续岩壁；在原地图场址内配准，墙脚、尺寸、岩点与绳线为显示拟合。';
 const zoneFeature=Y.CAMPUS.features.find(f=>f.properties.pickId===768);zoneFeature.properties.scopeNote='按公开正射影像扩展显示地面，与两块球场北侧相邻；细网格及设施尺度仍为拟合。';
 const fit={centre:fr.centre.slice(),rotation:fr.r,pitches:[{z:-35,length:88,width:60},{z:29,length:88,width:60}],zone:[-51,-117,46,-67],shed:[-60,-101,12,29],tower:[114.5,-291],sourceGeometryPreserved:true,dimensionsSurveyed:false,apparatusCurrentDetailVerified:false,wallReferenceYear:2025,wallCanopySameObject:true};
 const world=(x,z)=>[fr.centre[0]+x*Math.cos(fr.r)+z*Math.sin(fr.r),fr.centre[1]-x*Math.sin(fr.r)+z*Math.cos(fr.r)];
 const polygon=bb=>({type:'Polygon',coordinates:[[[bb[0],bb[1]],[bb[2],bb[1]],[bb[2],bb[3]],[bb[0],bb[3]],[bb[0],bb[1]]].map(p=>world(...p))]});
 const zone={type:'Polygon',coordinates:[[[114.537,-308.185],[209.373,-323.472],[220.368,-286.282],[125.303,-263.238],[114.537,-308.185]]]};
 function surfaceGeometry(f){return f.properties.pickId===768?zone:null;}
 function football(b){for(const [i,p]of fit.pitches.entries())b.local(0,0,p.z,0,()=>{
  const l=p.length,w=p.width;
  for(let k=0;k<14;k++)b.box(-l/2+(k+.5)*l/14,.225,0,l/14,.025,w,k%2?'#7d9b76':'#879f7c',0);
  const g=new G.Geometry(),line=points=>g.v.push(...G.ribbon(points,.12,.253,false).v),arc=(x,z,r,a=0,c=2*Math.PI)=>line(Array.from({length:65},(_,j)=>[x+r*Math.cos(a+(c-a)*j/64),z+r*Math.sin(a+(c-a)*j/64)]));
  line([[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2],[-l/2,-w/2]]);line([[0,-w/2],[0,w/2]]);arc(0,0,9.15);arc(0,0,.16);
  for(const s of[-1,1]){const x=s*l/2;for(const [ww,d]of[[36,14],[16,5]])line([[x,-ww/2],[x-s*d,-ww/2],[x-s*d,ww/2],[x,ww/2]]);arc(x-s*10,0,.16);
   const angle=Math.acos(4/9.15);arc(x-s*10,0,9.15,s<0?-angle:Math.PI-angle,s<0?angle:Math.PI+angle);
   for(const z of[-3.66,3.66]){b.beam([x,.25,z],[x,2.69,z],.065,'#e8e8db',29);b.beam([x,2.69,z],[x+s*2,.25,z],.045,'#bcc6bd',29);}
   b.beam([x,2.69,-3.66],[x,2.69,3.66],.065,'#e8e8db',29);
   for(let z=-3.6;z<=3.6;z+=.4)b.beam([x+s*2,.26,z],[x,2.65,z],.012,'#c7d0be',29);
   for(let y=.4;y<2.69;y+=.35)b.beam([x+s*2*(1-(y-.25)/2.44),y,-3.66],[x+s*2*(1-(y-.25)/2.44),y,3.66],.012,'#c7d0be',29);
  }
  for(const sx of[-1,1])for(const sz of[-1,1]){const a=sx<0?(sz<0?0:-Math.PI/2):(sz<0?Math.PI/2:Math.PI);arc(sx*l/2,sz*w/2,1,a,a+Math.PI/2);}
  b.mesh('eastfield338-pitch-'+i,g,0,0,0,1,1,1,'#e9e9d9',10);
 });
 // Existing four lighting masts retained at parcel corners, outside playing lines.
 for(const x of[-42,42])for(const z of[-64,64]){b.cyl(x,.2,z,.15,16,'#8a9790',10,1,29);b.box(x,16,z,3,.35,.3,'#8a9790',29);for(const dx of[-.9,0,.9])b.box(x+dx,16.3,z,.62,.62,.18,'#d9e0d5',29);}
 }
 function outdoor(b){
 // The western canopy is the photo-supported wall roof emitted by pick177.
 // The orthophoto resolves a regular surface grid, not individual apparatus types.
 const grid=new G.Geometry();for(let x=-32;x<=36;x+=4)grid.v.push(...G.ribbon([[x,-86],[x,-67]],.08,.225,false).v);for(let z=-86;z<=-67;z+=4)grid.v.push(...G.ribbon([[-32,z],[36,z]],.08,.225,false).v);b.mesh('eastfield338-visible-grid',grid,0,0,0,1,1,1,'#928b78',7);
 }
 function climbingWall(b){
 // 2025 official full-face and side photographs show a long wall beneath
 // corrugated steel canopies. Orthophoto western roof, not the eastern white object.
 b.local(114.5,0,-291,fr.r,()=>{
  const panels=[];const length=28,segments=[[-9.5,9,12.8],[0,10,15],[9.5,9,12.8]];
  for(const [z,w,h]of segments){
   b.box(-1,h/2+.2,z,1.2,h,w,'#c8cbc7',24);
   b.box(.9,h+.45,z,6.4,.18,w+.8,'#78898b',29);
   // Full-resolution physical corrugations and supported canopy edges.
   for(let q=-w/2-.3;q<w/2+.35;q+=.24)b.beam([-2.3,h+.56,z+q],[4.1,h+.56,z+q],.035,'#8c9999',29);
   for(const zz of[z-w/2+.3,z+w/2-.3]){b.beam([-.3,h-.5,zz],[3.5,h+.35,zz],.08,'#8d9998',29);b.beam([3.4,h-.1,zz],[3.4,h+.35,zz],.055,'#a5afad',29);}
   b.beam([3.45,h+.36,z-w/2],[3.45,h+.36,z+w/2],.07,'#859593',29);
   // White panel joints and modest faceting on the climbing face; dimensions fitted.
   for(let row=0;row<Math.ceil(h/2);row++)for(let col=0;col<3;col++){
    const hh=Math.min(2,h-row*2),zz=z+(col-1)*w/3,xx=.02+(col===1&&row>2?.42:0);
    b.box(xx,.2+row*2+hh/2,zz,.20,hh-.025,w/3-.025,'#d7d9d1',24);
    if(z===0)panels.push({x:xx+.102,y0:.2+row*2+.0125,y1:.2+row*2+hh-.0125,z0:zz-w/6+.0125,z1:zz+w/6-.0125});
    for(let j=0;j<5;j++){const yy=.42+row*2+j*(hh-.35)/5,zc=zz+Math.sin(row*9+col*7+j)*w*.105;
     b.sphere(xx+.18,yy,zc,.10,.10+j*.016,.13,['#8b9b73','#698e95','#aa8571','#8691a0','#b49e6a'][j],29);}
   }
   for(const zz of[z-w*.28,z+w*.28])b.beam([.3,.28,zz],[.3,h-.15,zz],.016,'#d0ccb8',29);
  }
  // The photographed central face carries broad angular dark/red bands.
  const clip=(poly,axis,edge,sign)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],da=(a[axis]-edge)*sign,dc=(c[axis]-edge)*sign;if(da>=-1e-9)out.push(a);if((da>=0)!==(dc>=0)){const t=da/(da-dc);out.push(a.map((v,k)=>k===axis?edge:v+t*(c[k]-v)));}}return out;};
  const band=(key,color,points)=>{const g=new G.Geometry();
   // Tessellate the concave contour by the same even-odd sweep used for map
   // polygons, then clip each convex triangle to the actual panel face.
   for(const tri of Y.Footprints.capTriangles([[...points,points[0]]]))for(const panel of panels){
    let poly=tri;for(const [axis,edge,sign]of[[0,panel.y0,1],[0,panel.y1,-1],[1,panel.z0,1],[1,panel.z1,-1]])poly=clip(poly,axis,edge,sign);
    for(let i=1;i+1<poly.length;i++){let q=[poly[0],poly[i],poly[i+1]],area=(q[1][0]-q[0][0])*(q[2][1]-q[0][1])-(q[1][1]-q[0][1])*(q[2][0]-q[0][0]);if(Math.abs(area)<1e-9)continue;if(area<0)[q[1],q[2]]=[q[2],q[1]];g.tri(...q.map(p=>[panel.x,p[0],p[1]]));}
   }
   b.mesh(key,g,0,0,0,1,1,1,color,24);
  };
  band('eastfield338-rock-dark','#41494c',[[.3,-3.2],[6,-2.4],[10,0],[14.8,-1.7],[14.8,-.5],[10,1.2],[6,-1],[.3,-1.8]]);
  band('eastfield338-rock-red','#bd615d',[[.3,-3.7],[6,-2.9],[10,-.5],[14.8,-2.2],[14.8,-1.7],[10,0],[6,-2.4],[.3,-3.2]]);
  b.box(3.5,.245,0,5,.09,length,'#8ca4a1',7);
 });
 }
 Y.Refinements41.sport=function(b,f){if(![49,177,768].includes(f.properties.pickId))return previous.call(this,b,f);const saved=[b.origin,b.rotation,b.id,b.anim];try{
  b.id=f.properties.pickId;
  if(f.properties.pickId===177){climbingWall(b);}
  else {b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{if(f.properties.pickId===49)football(b);else outdoor(b);});
   if(f.properties.pickId===768)previous.call(this,b,f); // Retain the photo-supported ladder and its detailed end allowance.
  }
  return {strategy:'eastfield338',sourceGeometryPreserved:true,dimensionsSurveyed:false};
 }finally{[b.origin,b.rotation,b.id,b.anim]=saved;}};
 Y.EastField338={fit,world,surfaceGeometry};
})(YY);
