/* Building859: local textured-scan roof, recessed courtyard and glazed enclosure.
   Dimensions are rounded local scan fits; door leaves and use/name are unresolved. */
(function(Y){'use strict';
 const A=Y.Architecture30,F=Y.Footprints,previous=A.render;
 const main=[[-560.97,-155.25],[-544.2,-155.6],[-544.1,-152.7],[-542.6,-150.8],[-541.3,-150.0],[-541.3,-146.0],[-543.4,-142.55],[-547.8,-142.5],[-550.9,-145.9],[-551.12,-149.5],[-553.42,-149.5],[-553.48,-152.4],[-560.97,-152.4],[-560.97,-155.25]];
 const glassRoof=[[-560.65,-152.4],[-553.48,-152.4],[-553.35,-148.5],[-560.65,-148.5],[-560.65,-152.4]];
 const returnRoof=[[-553.42,-149.5],[-551.12,-149.5],[-551.13,-147.9],[-553.35,-147.9],[-553.42,-149.5]];
 const poly=r=>({type:'Polygon',coordinates:[r]});
 function edge(b,a,c,y,h,d,color,mat){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),r=-Math.atan2(dz,dx);b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,r,()=>b.box(0,y,0,len,h,d,color,mat));}
 A.render=function(b,f,add){
  if(f.properties.pickId!==859||f.properties.id!=='way/876533978')return previous.call(this,b,f,add);
  b.id=859;let k=0;const mesh=(name,g,col,mat)=>add('building859-317-'+name,g,col,mat,859);
  function panel(name,a,c,low,high,col,mat,reverse=false){if(reverse)[a,c]=[c,a];const g=new Y.Geo.Geometry();g.quad([a[0],low,a[1]],[c[0],low,c[1]],[c[0],high,c[1]],[a[0],high,a[1]]);mesh(name,g,col,mat);}
  mesh('green-roof',F.surface(poly(main),4.7),'#47754b',22);
  const observedGlazed=new Set([4,5,6,7,8]);
  for(let i=0;i<main.length-1;i++){
   const a=main[i],c=main[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(observedGlazed.has(i)){
    panel('warm-base-'+i,a,c,.03,.72,'#a48655',24,true);
    panel('front-glass-'+i,a,c,.72,4.05,'#536b70',5,true);
    panel('red-fascia-'+i,a,c,4.05,4.7,'#c97a70',24,true);
    edge(b,a,c,2.23,.16,.12,'#e0dfd3',29);edge(b,a,c,.75,.13,.16,'#e1dfd2',24);edge(b,a,c,4.05,.14,.16,'#e4ded0',24);
    // Fitted divisions on the observed glazed run; no inferred door or threshold.
    const divisions=i===6?3:Math.max(2,Math.round(len/1.35));
    for(let j=0;j<=divisions;j++){const t=j/divisions,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;b.box(x,2.41,z,j===0||j===divisions?.16:.065,3.30,j===0||j===divisions?.16:.065,'#e1dfd3',29);}
   }else panel('unobserved-wall-'+i,a,c,.03,4.7,'#c8c5b9',24,true);
   // Low light parapet and broad pale coping follow the measured concave roof.
   edge(b,a,c,5.08,.76,.22,'#c9c8bc',24);edge(b,a,c,5.49,.12,.38,'#e0ddd1',24);
  }
  const roofY=p=>4.49-(p[1]+152.4)*.25;
  mesh('west-sloped-glass-roof',F.profiledSurface(poly(glassRoof),roofY,1),'#99acac',5);
  function roofRail(a,c,width){const dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),nx=-dz/l*width/2,nz=dx/l*width/2,r=[[a[0]+nx,a[1]+nz],[c[0]+nx,c[1]+nz],[c[0]-nx,c[1]-nz],[a[0]-nx,a[1]-nz],[a[0]+nx,a[1]+nz]];mesh('roof-rail-'+k++,F.profiledSurface(poly(r),p=>roofY(p)+.08,.8),'#dadbd0',29);}
  for(let i=0;i<glassRoof.length-1;i++)roofRail(glassRoof[i],glassRoof[i+1],.15);
  roofRail([-557.02,-152.4],[-557.00,-148.5],.11);
  // Sloped enclosure has a south-facing glass screen; the tree-obscured opening
  // remains a screen, never an invented swinging door.
  const wa=[-560.65,-148.5],wc=[-553.35,-148.5],wh=roofY(wa);
  panel('west-front-glass',wa,wc,.2,wh,'#5a7071',5);
  edge(b,wa,wc,.16,.25,.15,'#b8b8aa',24);edge(b,wa,wc,wh,.13,.16,'#d9dad0',29);
  for(const x of[-560.65,-558.82,-557,-555.18,-553.35])b.box(x,wh/2,-148.5,.08,wh,.13,'#cdd2c9',29);
  // Western return glazing follows the same roof slope, without a solid rear face.
  const wg=new Y.Geo.Geometry();wg.quad([-560.65,.2,-152.4],[-560.65,.2,-148.5],[-560.65,roofY([-560.65,-148.5]),-148.5],[-560.65,roofY([-560.65,-152.4]),-152.4]);mesh('west-return-glass',wg,'#5a7071',5);
  // This side has sparse scan returns: close the known enclosure boundary
  // conservatively, without claiming unobserved glazing or a door subdivision.
  const ea=glassRoof[1],ec=glassRoof[2],side=new Y.Geo.Geometry();
  side.quad([ec[0],.2,ec[1]],[ea[0],.2,ea[1]],[ea[0],roofY(ea),ea[1]],[ec[0],roofY(ec),ec[1]]);
  mesh('west-east-side-closure',side,'#bbb8ad',24);
  mesh('annex-return-roof',F.surface(poly(returnRoof),3.38),'#9b9588',22);
  const ra=[-553.35,-147.9],rc=[-551.13,-147.9];panel('annex-return-glass',ra,rc,.2,3.38,'#536a6a',5);edge(b,ra,rc,3.42,.14,.22,'#dddacf',24);
  for(const x of[-553.35,-552.24,-551.13])b.box(x,1.7,-147.9,.09,3.4,.14,'#d4d4c8',29);
  // Slab hems close undersides; the courtyard between the two south returns stays open.
  mesh('main-plinth',F.walls(poly(main),.03,.18),'#b6b5a6',10);
  return {id:f.properties.id,strategy:'building859-low317',bodyHeight:4.7,sourceOutline:false,scanLocalOutline:true,roof:'green-flat-and-west-sloped-glass',referenceScope:'mass-roof-glazed-south-and-west',entranceVerified:false,storeyCountUnverified:true,eastSideFinishUnknown:true};
 };
 function updateFeature(feature){
  if(!feature||feature.properties.pickId!==859||feature.properties.id!=='way/876533978')return feature;
  const p=feature.properties;
  if(!p.sourceReference317)p.sourceReference317={geometry:JSON.parse(JSON.stringify(feature.geometry)),bounds:p.bounds.slice(),centre:p.centre.slice(),height:p.height,floors:p.floors,heightSource:p.heightSource};
  feature.geometry={type:'MultiPolygon',coordinates:[[main.map(q=>q.slice())],[glassRoof.map(q=>q.slice())],[returnRoof.map(q=>q.slice())]]};
  Object.assign(p,{height:4.7,modelEnvelopeHeight:5.55,floors:null,bounds:[-561.20,-155.80,-541.10,-142.30],centre:[-551.15,-149.05],envelopeMetres:[20.1,13.5],displayBounds46:[-561.20,0,-155.80,-541.10,5.55,-142.30],
   heightSource:'公开纹理扫描局部屋面与邻地高差拟合：主屋面约4.7米、压顶最高约5.6米；未实测，层数未核定',
   scopeNote:'原地图身份保留；凹屋面、西侧斜玻璃房与南侧玻璃带按公开纹理扫描局部拟合。原四层估计撤回，门叶和遮挡侧面细节未确认。'});
  Object.assign(p.architecture,{strategy:'building859-low317',summary:'内凹的绿色平屋面、西侧斜玻璃顶与南侧连续玻璃带；院落保持敞开。',style:'scan-fitted',limits:'细分框格和压顶尺寸为拟合；层数、门叶与遮挡侧面材质仍未确认。'});
  return feature;
 }
 updateFeature(Y.CAMPUS?.features.find(f=>f.properties.pickId===859&&f.properties.id==='way/876533978'));
 Y.Building859Low317={main,glassRoof,returnRoof,updateFeature};
})(YY);
