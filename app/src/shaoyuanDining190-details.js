/* Shaoyuan 5B / canteen: 2018 and 2022 photographs show a cream third
 * storey above two red-brick dining levels. The official 2019 account confirms
 * third-floor offices. Metre heights and unseen windows remain fitted.
 * External stairs, vestibules and bridges await directional registration.
 */
(function(Y){'use strict';const A=Y.Architecture30,F=Y.Footprints,previous=A.render;
const INFO={strategy:'shaoyuan190-segmented-photo-candidate',floors:3,diningFloors:2,height:13.6,entryRegistered:false,bridgesRegistered:false,heightsAreFitted:true};
// Split on the two source-outline setbacks, perpendicular to the long axis.
// No footprint enlargement, no copied 5A entrance. End roof offsets are fitted,
// not a claim that aerial shadows measure their exact relative heights.
const along=p=>p[1]+.045*p[0];
function clip(r,cut,side){const out=[];for(let i=0;i<r.length-1;i++){const a=r[i],c=r[i+1],da=(along(a)-cut)*side,dc=(along(c)-cut)*side;if(da>=-1e-9)out.push(a);if((da>0&&dc<0)||(da<0&&dc>0)){const t=da/(da-dc);out.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t]);}}if(out.length)out.push(out[0]);return out;}
function components(g){const r=g.coordinates[0],cuts=[along(r[1]),along(r[6])];return [{name:'north',ring:clip(r,cuts[0],-1),height:12.95},{name:'central',ring:clip(clip(r,cuts[0],1),cuts[1],-1),height:13.35},{name:'south',ring:clip(r,cuts[1],1),height:12.95}].map(o=>({...o,g:{type:'Polygon',coordinates:[o.ring]},cuts}));}
// 2018 guide: the central body's SOUTH return is one 5.25 m face, despite
// its intermediate outline vertex. One observed column; dimensions are fitted.
function southReturn(g){const r=g.coordinates[0],a=r[4],c=r[6];return {a,c,length:Math.hypot(c[0]-a[0],c[1]-a[1]),rows:[{y:2.26,h:2,w:1.42},{y:6.65,h:1.9,w:1.4},{y:11.36,h:1.45,w:1.12}]};}
function addSouthReturn(b,g){const f=southReturn(g),sign=F.area(g.coordinates[0])>0?1:-1,ux=(f.c[0]-f.a[0])/f.length,uz=(f.c[1]-f.a[1])/f.length,rot=Math.atan2(uz*sign,-ux*sign);
 // Photo column centre is about 62% from the west end; the ring runs east→west.
 b.local(f.a[0]+(f.c[0]-f.a[0])*.38,0,f.a[1]+(f.c[1]-f.a[1])*.38,rot,()=>{
  b.box(0,4.82,.045,1.67,7.85,.1,'#bcb8a5',24);
  for(const {y,h,w} of f.rows){
   b.box(0,y,.115,w+.18,h+.18,.12,'#d2d4c8',29);
   b.box(0,y,.19,w,h,.035,'#557275',28);
   b.box(-w*.13,y,.23,.065,h,.065,'#cbd2cb',29);
   b.box(0,y+h*.24,.235,w,.065,.065,'#cbd2cb',29);
   b.box(0,y-h/2-.13,.2,w+.3,.16,.4,'#c4c2b4',24);
   b.box(0,y+h/2+.16,.18,w+.42,.16,.42,'#b6b5a9',24);
  }
 });
}
A.render=function(b,f,add){
 if(f.properties.id!=='way/445016203'||f.properties.pickId!==190)return previous.call(this,b,f,add);
 const id=b.id,g=f.geometry; b.id=190;
 try {
  for(const block of components(g)){const g=block.g,roofHeight=block.height,prefix='shaoyuan190-'+block.name;
  add(prefix+'-plinth',F.walls(g,.02,.65),'#aaa79b',24,190);
  add(prefix+'-brick',F.walls(g,.65,9.25),'#a76550',27,190);
  add(prefix+'-upper',F.walls(g,9.25,roofHeight),'#d9d3bd',24,190);
  add(prefix+'-roof',F.surface(g,roofHeight),'#989d92',22,190);
  for(const pg of F.polygons(g))for(const ring of pg){const sign=F.area(ring)>0?1:-1;
   for(let k=1;k<ring.length;k++){
    const a=ring[k-1],c=ring[k];if(block.cuts.some(cut=>Math.abs(along(a)-cut)<1e-6&&Math.abs(along(c)-cut)<1e-6))continue;const l=Math.hypot(c[0]-a[0],c[1]-a[1]);if(l<.01)continue;
    const ux=(c[0]-a[0])/l,uz=(c[1]-a[1])/l,nx=uz*sign,nz=-ux*sign,rot=Math.atan2(nx,nz);
    b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,rot,()=>{
     for(const[y,h,depth]of[[.68,.2,.24],[9.24,.3,.42],[roofHeight+.05,.2,.45]])b.box(0,y,0,l+.02,h,depth,'#bebcae',24);
     // No door or ornamental portico is inferred from the old south template.
     if(l<6)return;const count=Math.max(1,Math.floor(l/4.8)),step=l/count;
     for(let i=0;i<count;i++){
      const x=(i+.5)*step-l/2,w=Math.min(2.25,step*.5);
      b.box(x,4.82,.045,w+.25,7.85,.1,'#bcb8a5',24);
      for(const[y,h]of[[2.26,2.0],[6.65,2.9],[roofHeight-1.99,1.9]]){
       b.box(x,y,.115,w+.18,h+.18,.12,'#d2d4c8',29);
       b.box(x,y,.19,w,h,.035,'#557275',28);
       b.box(x-w*.13,y,.23,.065,h,.065,'#cbd2cb',29);
       b.box(x,y+h*.24,.235,w,.065,.065,'#cbd2cb',29);
       b.box(x,y-h/2-.13,.2,w+.3,.16,.4,'#c4c2b4',24);
       b.box(x,y+h/2+.16,.18,w+.42,.16,.42,'#b6b5a9',24);
      }
     }
    });
   }
  }
  }
  addSouthReturn(b,g);
 }finally{b.id=id;}
 return {...INFO};
};Y.ShaoyuanDining190=Object.freeze({...INFO,components,southReturn});
})(YY);
