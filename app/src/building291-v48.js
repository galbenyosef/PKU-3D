/* Southern member of the paired gray-brick halls; dimensions fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/880624096';
const O=[369.534,462.281],R=Math.atan2(.888,18.985),C=Math.cos(R),S=Math.sin(R),W=Math.hypot(18.985,.888),D=.333*S+6.973*C;
const H={wall:4.05,eave:4.2,ridge:6.3},colors={brick:'#a4a093',roof:'#60625c',tile:'#797c73',trim:'#aaa89c'};
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
// North eave remains exactly at the shared source boundary with object 290.
const z0=0,z1=D+.32,zm=D/2;
function roofY(v){const span=v<zm?zm-z0:z1-zm,t=Math.max(0,Math.min(1,1-Math.abs(v-zm)/span));return H.eave-.13+(H.ridge-H.eave+.13)*Math.pow(t,1.33)+.13*Math.pow(1-t,8);}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const ring=F.polygons(f.geometry)[0][0],r=ring.slice(0,4).map(local),p=(u,y,v)=>{const q=world(u,v);return[q[0],y,q[1]];};
 add('291-source-brick-walls',F.walls(f.geometry,0,H.wall),colors.brick,18,id);
 // Close the shallow masonry strip beneath each long eave without adding a storey.
 const eaveWalls=new G.Geometry();for(const [a,c]of [[r[1],r[2]],[r[3],r[0]]])eaveWalls.quad(p(a[0],H.wall,a[1]),p(c[0],H.wall,c[1]),p(c[0],roofY(c[1]),c[1]),p(a[0],roofY(a[1]),a[1]));
 add('291-eave-wall-closure',eaveWalls,colors.brick,18,id);
 // Each gable follows the original short edge, including the slight mapped skew.
 for(const [name,a,c]of [['west',r[0],r[1]],['east',r[3],r[2]]]){
  const g=new G.Geometry();for(let j=0;j<40;j++){const t=j/40,tt=(j+1)/40,u=a[0]+(c[0]-a[0])*t,v=a[1]+(c[1]-a[1])*t,uu=a[0]+(c[0]-a[0])*tt,vv=a[1]+(c[1]-a[1])*tt;
   const pts=[p(u,H.wall,v),p(uu,H.wall,vv),p(uu,roofY(vv),vv),p(u,roofY(v),v)];g.quad(...(name==='east'?pts.reverse():pts));}
  add('291-'+name+'-brick-gable',g,colors.brick,18,id);
 }
 for(const [name,lo,hi]of [['north',z0,zm],['south',zm,z1]]){
  const q={name,axis:1,p:[[-.24,lo],[W+.25,lo],[W+.25,hi],[-.24,hi]],y:p=>roofY(p[1])},g=new G.Geometry();
  for(let j=0;j<40;j++){const v=lo+(hi-lo)*j/40,vv=lo+(hi-lo)*(j+1)/40;g.quad(p(-.24,roofY(v),v),p(-.24,roofY(vv),vv),p(W+.25,roofY(vv),vv),p(W+.25,roofY(v),v));}
  add('291-curved-roof-'+name,g,colors.roof,25,id);
  Y.RoofTiles.render(b,q,{origin:O,rotation:R,key:'291',color:colors.tile,eaveHigh:name==='south'});
 }
 b.local(O[0],0,O[1],R,()=>{
  const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'291-moulding-'+k,...args);};try{
   b.box(W/2,H.ridge+.13,zm,W+.50,.22,.24,colors.tile,25);
   for(const x of [-.19,W+.20])for(let j=0;j<40;j++){
    const v=z0+(z1-z0)*j/40,vv=z0+(z1-z0)*(j+1)/40;
    b.beam([x,roofY(v)+.055,v],[x,roofY(vv)+.055,vv],.14,colors.trim,18);
    // Recessed, parallel brick bands are visible beneath both end roof lines.
    const faceX=x<0?-.025:W+.032;
    b.beam([faceX,roofY(v)-.33,v],[faceX,roofY(vv)-.33,vv],.065,colors.trim,18);
   }
  }finally{b.e.add=old;}
 });
 return{strategy:'building291-v48',sourceOutline:true,floors:1,roof:'curved-gable',ridgeDirection:'east-west',dimensionFitted:true,entranceVerified:false,occludedFacades:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building291={id:ID,render,world,local,heights:H,roofY,width:W,depth:D,sharedNorthEave:0};
})(YY);
