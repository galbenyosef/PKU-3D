/* Official museum named points + bounded public textured mesh reference.
 * Roof-envelope registration only; source photos are not measured floorplans.
 * Preserve identity pickIds and existing source detail. */
(function(Y){'use strict';
 const fs=Y.CAMPUS.features,one=id=>fs.find(f=>f.properties.pickId===id),clone=x=>JSON.parse(JSON.stringify(x));
 const old61=clone(one(267)),old62=clone(one(266)),old63=clone(one(804));
 // 62 outer roof envelope traced from8adjacent texturedL20tiles.
 // Eastmost tree-obscured strip remains fitted; this is not a measured wall boundary.
 const roof62=[[-130.1,466.0],[-101.0,465.3],[-100.6,477.6],[-106.9,477.8],[-107.0,474.9],[-122.3,475.3],[-122.2,478.4],[-129.8,478.6],[-130.1,466.0]];
 function set(id,geometry,sourceId,basis){const f=one(id),p=f.properties;f.geometry=clone(geometry);const pts=geometry.coordinates[0],xs=pts.map(v=>v[0]),zs=pts.map(v=>v[1]);p.bounds=[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)];p.centre=[(p.bounds[0]+p.bounds[2])/2,(p.bounds[1]+p.bounds[3])/2];p.envelopeMetres=[p.bounds[2]-p.bounds[0],p.bounds[3]-p.bounds[1]];p.previousSourceId=p.id;p.id=sourceId;p.url=sourceId.startsWith('way/')?'https://www.openstreetmap.org/'+sourceId:'http://pku-viewer.yuancj.com/ds/clo5g34uw0048wlew3px8g0q7';p.source='PKU public digital museum named points and textured scene';p.confidence='image-registered-candidate';p.scopeNote=basis;p.registration316={previousGeometry:clone(id===267?old61.geometry:id===266?old62.geometry:old63.geometry),reference:'http://pku-viewer.yuancj.com/ds/clo5g34uw0048wlew3px8g0q7',boundaryIsSurvey:false};if(p.recovery32){p.recovery32.ids=[sourceId];p.recovery32.note=basis;} }
 if(!one(267).properties.registration316){
 set(267,old62.geometry,'way/866277604','官方61点及红瓦窄长屋匹配此原OSM轮廓；旧61门棚细节保留，门向为原模型继承待独审。');
 set(804,old61.geometry,'way/866277605','官方63点及中式工字屋匹配此原OSM轮廓；撤原manual63重复位置，屋体细节待完整新足迹审核。');
 set(266,{type:'Polygon',coordinates:[roof62]},'manual/yannan-62-registered316','官方62点和定向纹理模型识别的南侧凹形屋面；东檐树遮小段为拟合，轮廓是屋顶包络非地面墙脚测绘。');

 }
 const prior=Y.Architecture30.render;
 Y.Architecture30.render=function(b,f,add){
  if(f.properties.pickId===266){
   const id=b.id;b.id=266;
   try{b.local(0,0,0,0,()=>{
    // Three observed roof volumes replace the incorrectly fitted legacy U shell.
    // Reuse the same heritage house/window/door generators;
    // facade spacing remains a display fit, not a newly observed opening count.
    b.heritageSmallHouse(-115.45,470.30,27.95,8.95,2.30,1,{bays:4,rise:1.14,detailed:true});
    b.heritageSmallHouse(-126.0,472.10,7.15,11.95,2.30,1,{door:false,bays:2,rise:1.14,detailed:true,roofTurn:true});
    b.heritageSmallHouse(-103.8,471.45,5.55,11.25,2.30,1,{door:false,bays:2,rise:1.14,detailed:true,roofTurn:true});
    // Retain the source veranda's five posts and shallow stone platform, now at
    // the actual south face of the north hall; dimensions remain fitted.
    b.box(-114.7,.35,474.92,14.1,.21,1.43,'#b3b4a9',10,.25);
    b.box(-114.7,.1225,474.92,14.1,.245,1.43,'#b3b4a9',10,.25);
    for(let i=0;i<5;i++)b.box(-121.4+i*3.35,1.72,475.35,.11,2.72,.11,'#596253',20,1.05);
    b.box(-114.7,3.08,475.35,14.1,.12,.16,'#596253',20,1.05);
    b.heritagePlaque('62',-100.57,2.5,470.6,.44,.44,Math.PI/2,true);
   });}finally{b.id=id;}
   return {id:f.properties.id,source:862,strategy:'registered-three-wing62',registration316:true};
  }
  if(f.properties.pickId!==804)return prior.call(this,b,f,add);
  // Preserve the delivered main hall, entry, veranda, plinth and detailed tiles
  // as the south cross-wing; do not stretch it across the complete C footprint.
  const main=clone(f),south=[[-161.2,440.7],[-144.4,440.7],[-144.4,448.75],[-161.2,448.75],[-161.2,440.7]];
  main.geometry={type:'Polygon',coordinates:[south]};main.properties.bounds=[-161.2,440.7,-144.4,448.75];main.properties.centre=[-152.8,444.725];
  const result=prior.call(this,b,main,add),id=b.id;b.id=804;
  try{b.local(0,0,0,0,()=>{
   // The north cross-wing and west connector are visible in the public mesh.
   // Connector extends to441.45, overlapping actual emitted south wall minZ441.358.
   // Wall openings remain unasserted; keep masonry and pitched roof detail.
   b.box(-153.54,1.33,427.45,15.49,2.60,9.90,'#a4a49b',18,.6);
   b.box(-157.16,1.33,436.875,8.24,2.60,9.15,'#a4a49b',18,.6);
   b.heritageRoof(-153.54,2.63,427.45,16.19,10.60,1.27,'hip','#666c64',true);
   b.local(-157.16,0,436.875,Math.PI/2,()=>b.heritageRoof(0,2.63,0,9.85,8.94,1.27,'hip','#666c64',true));
  });}finally{b.id=id;}
  return {...result,registration316:true,additionalVisibleWings:2};
 };
 Y.YannanIdentity316={targetIds:[266,267,804],status:'private-candidate-unreviewed',roof62};
})(YY);
