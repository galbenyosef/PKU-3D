/* Central eight-unit door assembly, fitted to the university frontal photograph.
 * The eight vertical units occupy about 60% of the lower opening; the upper light
 * is separate. The photograph does not prove every unit can open.
 * Frame sizes/subdivisions are a photograph fit, not surveyed construction. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/188711087';
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==45)return previous.call(this,b,f,add);
 const original=b.e.add,frames=[],glass=[];let root,inverse,openingTop;
 function near(a,b){return Math.abs(a-b)<1e-4;}
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='v30-hallOctagon'){root=new Float32Array(m);inverse=M.inverse(root);}
  if(inverse&&k.startsWith('hall45-entry-')){
   const q=M.multiply(inverse,m),x=q[12],slot=Math.round((x+6)/1.5),valid=slot>=0&&slot<9&&near(x,-6+slot*1.5);
   if(k==='hall45-entry-box'&&c==='#c5c6ba'&&near(q[12],0)&&near(q[13],9.1)&&near(q[5],4.8))openingTop=q[13]-q[5]/2;
   if(valid&&near(q[13],3.13)&&near(q[0],1.3)&&p[1]===45&&near(p[3],.7)){
    if(k==='hall45-entry-recessFrametrue'&&p[0]===9&&c==='#a2aaa8'&&near(q[14],28.65)&&near(q[5],4.94)&&near(q[10],1)){frames.push({q,slot});return;}
    if(k==='hall45-entry-box'&&p[0]===5&&c==='#546c76'&&near(q[14],28.57)&&near(q[5],4.8906)&&near(q[10],.12)){glass.push({q,slot});return;}
   }
  }
  return original.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 if(!root||frames.length!==9||glass.length!==9||new Set(frames.map(q=>q.slot)).size!==9||new Set(glass.map(q=>q.slot)).size!==9||!openingTop)throw Error('hall45 doors149: upstream registration/door streams changed');
 const left=Math.min(...frames.map(r=>r.q[12]-r.q[0]/2)),right=Math.max(...frames.map(r=>r.q[12]+r.q[0]/2)),bottom=frames[0].q[13]-frames[0].q[5]/2,z=frames[0].q[14],leafTop=bottom+(openingTop-bottom)*.60,width=(right-left)/8,bar=.065,gap=.018;
 if(openingTop<=bottom+3)throw Error('hall45 doors149: lower opening unavailable');
 const frameMesh=new G.Geometry(),glassMesh=new G.Geometry();
 function box(out,x,y,zz,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8){raw.v[i]=x+raw.v[i]*w;raw.v[i+1]=y+raw.v[i+1]*h;raw.v[i+2]=zz+raw.v[i+2]*d;}out.v.push(...raw.v);}
 for(let i=0;i<8;i++){
  const a=left+i*width+gap/2,c=left+(i+1)*width-gap/2,lo=bottom,hi=leafTop;
  for(const x of[a+bar/2,c-bar/2])box(frameMesh,x,(lo+hi)/2,z,bar,hi-lo,.14);
  for(const y of[lo+bar/2,hi-bar/2])box(frameMesh,(a+c)/2,y,z,c-a-2*bar,bar,.14);
  for(const t of[.25,.5,.75])box(frameMesh,(a+c)/2,lo+(hi-lo)*t,z,c-a-2*bar,.05,.14);
  box(glassMesh,(a+c)/2,(lo+hi)/2,z-.055,c-a-2*bar,hi-lo-2*bar,.04);
 }
 // A separate transom, with broad divisions fitted from the photograph; it is
 // not eight more full-height door frames or a continuation of the old crosses.
 for(const x of[left+bar/2,right-bar/2])box(frameMesh,x,(leafTop+openingTop)/2,z,bar,openingTop-leafTop,.14);
 for(const y of[leafTop+bar/2,openingTop-bar/2])box(frameMesh,(left+right)/2,y,z,right-left-2*bar,bar,.14);
 const tw=(right-left)/4;
 for(let i=0;i<4;i++){const a=left+i*tw,c=a+tw;if(i)box(frameMesh,a,(leafTop+openingTop)/2,z,.055,openingTop-leafTop-2*bar,.14);box(glassMesh,(a+c)/2,(leafTop+openingTop)/2,z-.055,tw-bar,openingTop-leafTop-2*bar,.04);}
 original.call(b.e,'hall45-doors149-frames',frameMesh,root,'#d1d7d4',[29,45,0,.7]);
 original.call(b.e,'hall45-doors149-glass',glassMesh,root,'#546c76',[5,45,0,.7]);
 return result;
};
Y.Hall45Doors149={id:ID,verticalDoorUnits:8,unitCrossbars:3,allUnitsOpenableVerified:false,doorHeightFraction:.60,transomBays:4,dimensions:'photo-fit-not-surveyed'};
})(YY);
