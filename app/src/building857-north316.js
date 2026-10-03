/* Changchunyuan57: registered official scan north facade, five visible window
 * rows, seven balcony stacks, eight narrow-window columns and four stair axes.
 * Each offset facade is fitted between its own observed outside/return edges.
 * Preserve the source ring, display height and unobserved south/end treatment.
 * Ground door leaves, exact floor heights and cap depth remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo;
const faces=[
 {a:[-585.469,42.593],z:[-544.039,38.529],bounds:[115,961],banks:[[115,211],[442,628],[856,958]],narrow:[[236,268],[379,413],[657,691],[792,827]],stairs:[326,742]},
 {a:[-544.39,34.92],z:[-517.325,32.278],bounds:[961,1628],banks:[[1022,1095],[1158,1231],[1348,1420],[1482,1560]],narrow:[[979,1002],[1244,1269],[1305,1331],[1574,1601]],stairs:[1126,1452]}
];
// Pixel y is the registered altitude projection (23..45m). Map the visible
// wall field to the unchanged18.6m display body; this is not surveyed height.
const body=18.6,alt=y=>45-y/599*22,Yfit=y=>(alt(y)-26.8)/(41.6-26.8)*body;
A.render=function(b,f,add){if(f.properties.pickId!==857||f.properties.id!=='way/849765890')return prior.call(this,b,f,add);
 const mesh=b.mesh,own=Object.hasOwn(b,'mesh'),saved=[b.origin,b.rotation,b.id,b.anim];let result;
 b.mesh=function(k,...args){if(k.startsWith('134-north-')||k==='134-round-stair-light'||k.startsWith('134-local-balcony-cap-'))return;return mesh.call(this,k,...args);};
 try{result=prior.call(this,b,f,add);}finally{if(own)b.mesh=mesh;else delete b.mesh;[b.origin,b.rotation,b.id,b.anim]=saved;}
 b.id=857;b.anim=0;
 const box=(key,x,y,z,w,h,d,c,mat=24)=>b.mesh(key,b.geo(key,G.box),x,y,z,w,h,d,c,mat);
 try{for(let fi=0;fi<faces.length;fi++){
  const face=faces[fi],dx=face.z[0]-face.a[0],dz=face.z[1]-face.a[1],L=Math.hypot(dx,dz),r=Math.atan2(dz/L,-dx/L),span=face.bounds[1]-face.bounds[0],fraction=x=>(x-face.bounds[0])/span;
  const at=(px,fn)=>{const t=fraction(px);b.local(face.a[0]+dx*t,0,face.a[1]+dz*t,r,fn);};
  for(let bi=0;bi<face.banks.length;bi++){
   const pair=face.banks[bi],w=L*(pair[1]-pair[0])/span;
   at((pair[0]+pair[1])/2,()=>{
    for(const py of [139,216,291,365,444]){const y=Yfit(py),h=2.04;
     box('857-north316-balcony-glass',0,y,.052,w,h,.06,'#536c6a',28);
     for(const yy of [y-h/2-.07,y+h/2+.07])box('857-north316-balcony-rail',0,yy,.095,w+.1,.14,.15,'#dce0d8');
     const panes=Math.max(3,Math.round(w/.9));for(let j=0;j<=panes;j++)box('857-north316-balcony-mullion',-w/2+w*j/panes,y,.112,.055,h+.08,.07,'#e5e8de',29);
     box('857-north316-balcony-transom',0,y+.25,.117,w,.055,.07,'#e1e6df',29);
    }
    const q=new G.Geometry();q.quad([-w/2,body+.13,.12],[w/2,body+.13,.12],[w/2,body+.68,-1.28],[-w/2,body+.68,-1.28]);
    b.mesh('857-north316-cap-'+fi+'-'+bi,q,0,0,0,1,1,1,'#616a64',22);
   });
  }
  for(const pair of face.narrow){const w=L*(pair[1]-pair[0])/span;at((pair[0]+pair[1])/2,()=>{for(const py of [139,216,291,365,444]){
   const y=Yfit(py),h=1.80;box('857-north316-narrow-glass',0,y,.052,w,h,.06,'#536c6a',28);
   for(const x of [-w/2,0,w/2])box('857-north316-narrow-jamb',x,y,.112,.06,h+.10,.07,'#e5e8de',29);
   for(const yy of [y-h/2,y+h/2])box('857-north316-narrow-rail',0,yy,.112,w+.06,.06,.07,'#e5e8de',29);
  } });}
  for(const px of face.stairs)at(px,()=>{for(let j=0;j<4;j++){
   const q=new G.Geometry(),R=.42;
   if(j===0){const p=[[-R,-.30,.079],[R,-.30,.079]];for(let k=0;k<=16;k++){const a=k*Math.PI/16;p.push([R*Math.cos(a),R*Math.sin(a),.079]);}for(let k=1;k+1<p.length;k++)q.tri(p[0],p[k],p[k+1]);}
   else for(let k=0;k<20;k++){const a=k*Math.PI/10,c=(k+1)*Math.PI/10;q.tri([0,0,.079],[R*Math.cos(a),R*Math.sin(a),.079],[R*Math.cos(c),R*Math.sin(c),.079]);}
   b.mesh('857-north316-stair-'+(j===0?'arch':'round'),q,0,Yfit([169,249,326,401][j]),0,1,1,1,'#50615e',28);
  }});
 }}finally{[b.origin,b.rotation,b.id,b.anim]=saved;}
 return{...result,northVisibleWindowRows:5,northNarrowColumns:8,northBalconyStacks:7,northStairAxes:4,northScanFit:true,storeysVerified:false,heightMeasured:false,entranceVerified:false};
};
Y.Building857North316={faces,Yfit};
})(YY);
