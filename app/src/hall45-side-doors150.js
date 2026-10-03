/* Both adjacent side door groups are visible in the registered frontal photo.
 * Bay axes establish their centers; the older central door width is not a ruler.
 * Each has two vertical units and one undivided upper light. Openability unknown. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/188711087';
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==45)return previous.call(this,b,f,add);
 const original=b.e.add,columns=[];let central;
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='hall45-doors149-frames')central={g,m:new Float32Array(m)};
  if(k==='hall45-entry-box'&&c==='#e1ded2'&&p[0]===10&&p[1]===45)columns.push(Array.from(m));
  if(k.startsWith('hall45-side-doors150-'))throw Error('hall45 side doors: duplicate installation');
  return original.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 if(!central)throw Error('hall45 side doors: registered central doors missing');
 const inv=M.inverse(central.m),axes=[];
 // The side-bay contract excludes the central pair used by historical blocking
 // negative controls; those columns are not involved in either side door.
 if(columns.filter(m=>Math.abs(M.multiply(inv,m)[12])>1).length!==16)throw Error('hall45 side doors: side columns changed');
 for(const axis of[-16,-8,8,16]){const pair=columns.map(m=>M.multiply(inv,m)[12]).filter(x=>Math.abs(x-axis)<.7);if(pair.length!==2)throw Error('hall45 side doors: colonnade bay changed');axes.push((pair[0]+pair[1])/2);}
 const centers=[(axes[0]+axes[1])/2,(axes[2]+axes[3])/2];
 if(centers.some((x,i)=>Math.abs(x-[-12,12][i])>.001))throw Error('hall45 side doors: photo bay registration changed');
 const vs=central.g.v,ys=vs.filter((_,i)=>i%8===1),zs=vs.filter((_,i)=>i%8===2),bottom=Math.min(...ys),openingTop=Math.max(...ys),doorTop=bottom+(openingTop-bottom)*.60,z=(Math.min(...zs)+Math.max(...zs))/2,bar=.065,gap=.018;
 const frames=new G.Geometry(),glass=new G.Geometry();
 function box(g,x,y,zz,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8){raw.v[i]=x+raw.v[i]*w;raw.v[i+1]=y+raw.v[i+1]*h;raw.v[i+2]=zz+raw.v[i+2]*d;}g.v.push(...raw.v);}
 for(const center of centers){
  const left=center-1.6,right=center+1.6;
  for(let i=0;i<2;i++){const a=left+i*1.6+gap/2,c=a+1.6-gap;
   for(const x of[a+bar/2,c-bar/2])box(frames,x,(bottom+doorTop)/2,z,bar,doorTop-bottom,.14);
   for(const y of[bottom+bar/2,doorTop-bar/2])box(frames,(a+c)/2,y,z,c-a-2*bar,bar,.14);
   for(const t of[.25,.5,.75])box(frames,(a+c)/2,bottom+(doorTop-bottom)*t,z,c-a-2*bar,.05,.14);
   box(glass,(a+c)/2,(bottom+doorTop)/2,z-.055,c-a-2*bar,doorTop-bottom-2*bar,.04);
  }
  for(const x of[left+bar/2,right-bar/2])box(frames,x,(doorTop+openingTop)/2,z,bar,openingTop-doorTop,.14);
  for(const y of[doorTop+bar/2,openingTop-bar/2])box(frames,center,y,z,3.2-2*bar,bar,.14);
  box(glass,center,(doorTop+openingTop)/2,z-.055,3.2-2*bar,openingTop-doorTop-2*bar,.04);
 }
 original.call(b.e,'hall45-side-doors150-frames',frames,central.m,'#d1d7d4',[29,45,0,.7]);
 original.call(b.e,'hall45-side-doors150-glass',glass,central.m,'#546c76',[5,45,0,.7]);
 return result;
};
Y.Hall45SideDoors150={id:ID,centers:[-12,12],width:3.2,unitsPerGroup:2,crossbarsPerUnit:3,transomBaysPerGroup:1,allUnitsOpenableVerified:false};
})(YY);
