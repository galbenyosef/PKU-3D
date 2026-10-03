/* Only No.57's photographed entrance: plain dark leaves and attached brass
 * hardware. No.58 and the inherited courtyard registration remain unchanged. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='relation/11823278',LOW_KEYS=['queue005-57-original-threshold','queue005-57-original-step'],eq=(a,b)=>Math.abs(a-b)<1e-8;
function hardware(b,w,h){
 const box=(name,x,y,z,sx,sy,sz,color)=>b.mesh('queue005-57-'+name,b.geo('box',Y.Geo.box),x,y,z,sx,sy,sz,color,9,.98);
 for(const side of[-1,1]){
  const x=side*w*.11,y=h*.51;
  b.mesh('queue005-57-handle-plate',b.geo('queue005-57-handle-plate',()=>Y.Geo.sphere(24,14,0)),x,y+.035,.153,.055,.075,.012,'#8b825a',9,.98);
  // This pin reaches the retained ring's upper arc, not its empty centre.
  box('handle-pin',x,y+.084,.200,.030,.040,.085,'#a39c73');
 }
 box('lock-hasp',0,h*.51+.180,.148,.034,.14,.018,'#8b825a');
 box('lock-body',0,h*.51+.180,.170,.055,.080,.045,'#b1a06a');
 b.mesh('queue005-57-lock-shackle',b.geo('torus',()=>Y.Geo.torus(24,8)),0,h*.51+.235,.180,.020,.026,.009,'#a39c73',9,.98);
}
function entranceDoor(b,oldDoor,args){
 const [x,y,z,w,h,r=0,color]=args;
 if(color!=='#303a40'||!eq(w,1.64)||!eq(h,2.63))return oldDoor.apply(b,args);
 const oldBox=b.box;
 b.box=function(...a){
  const panel=a[6]==='#253039'&&eq(a[3],w*.37)&&eq(a[4],h*.22)&&eq(a[5],.02)&&eq(a[2],.16)&&eq(Math.abs(a[0]),w*.25);
  const stile=a[6]==='#344149'&&eq(a[3],.022)&&eq(a[4],h*.24)&&eq(a[5],.025)&&eq(a[2],.181)&&[w*.06,w*.44].some(v=>eq(Math.abs(a[0]),v));
  const row=[h*.20,h*.56,h*.83].some(v=>eq(a[1],v));
  if(a[7]===20&&row&&(panel||stile))return;
  return oldBox.apply(this,a);
 };
 try{oldDoor.apply(b,args);}finally{b.box=oldBox;}
 b.local(x,y,z,r,()=>hardware(b,w,h));
}
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const adapter=Y.ArchitectureAdapter,oldAdapt=adapter.render;
 adapter.render=function(builder,feature,method,source,options={}){
  const own=builder===b&&feature.properties.id===ID&&source.id===857;
  return oldAdapt.call(this,builder,feature,method,source,own?{...options,keepHeight:true,preserveLowHeightFilter:true,retainLowKeys:[...(options.retainLowKeys||[]),...LOW_KEYS]}:options);
 };
 const hadGate=Object.prototype.hasOwnProperty.call(b,'heritageGate'),oldGate=b.heritageGate;
 b.heritageGate=function(p,z){
  if(p.houseNumber!==57)return oldGate.call(this,p,z);
  const hadMesh=Object.prototype.hasOwnProperty.call(this,'mesh'),oldMesh=this.mesh;
  this.mesh=function(key,g,x,y,zz,sx,sy,sz,color,mat,part,...rest){
   if(key==='box'&&color==='#b3b4a9'&&mat===10&&eq(x,0)){
    if(eq(y,-.045)&&eq(zz,.1)&&eq(sx,2.04)&&eq(sy,.16)&&eq(sz,.47)&&eq(part,.2))key=LOW_KEYS[0];
    else if(eq(y,.08)&&eq(zz,z+.82)&&eq(sx,2.85)&&eq(sy,.15)&&eq(sz,.95)&&eq(part,.1))key=LOW_KEYS[1];
   }
   return oldMesh.call(this,key,g,x,y,zz,sx,sy,sz,color,mat,part,...rest);
  };
  const hadDoor=Object.prototype.hasOwnProperty.call(this,'heritageDoor'),oldDoor=this.heritageDoor;
  this.heritageDoor=function(...args){return entranceDoor(this,oldDoor,args);};
  try{return oldGate.call(this,p,z);}finally{if(hadDoor)this.heritageDoor=oldDoor;else delete this.heritageDoor;if(hadMesh)this.mesh=oldMesh;else delete this.mesh;}
 };
 try{return previous.call(this,b,f,add);}finally{adapter.render=oldAdapt;if(hadGate)b.heritageGate=oldGate;else delete b.heritageGate;}
};
Y.Yannan5758Details={id:ID};
// The legacy source already gives the photographed gate/court vertical ratios.
// Keep the shared height input (also used by No.58) unchanged; framing is separate.
const feature=Y.CAMPUS?.features.find(f=>f.properties.id===ID);
if(feature){const p=feature.properties,b=p.bounds;
 p.modelEnvelopeHeight=5.51;
 p.heightSource='57号院按具名门楼照片保留源模型纵向比例，建筑最高约5.51米；58号沿用既有拟合，均非实测';
 p.displayBounds46=[b[0]-.02,-.10,b[1]-.02,b[2]+.02,9.30,b[3]+.02];
 if(p.frontObservation46)p.frontObservation46={...p.frontObservation46,target:[p.frontObservation46.target[0],2.13,p.frontObservation46.target[2]],bounds:[p.frontObservation46.bounds[0],-.10,p.frontObservation46.bounds[2],p.frontObservation46.bounds[3],4.36,p.frontObservation46.bounds[5]]};
}
})(YY);
