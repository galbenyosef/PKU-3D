/* Photo-fitted stone spandrel on the straight front only. Its concealed depth
 * and the fitted plaque outline are not surveyed. No invented relief. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,M=Y.M,G=Y.Geo,ID='way/188711087';
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==45)return prior.call(this,b,f,add);
 const emit=b.e.add;let root,inv,plaque,count=0;const columns=[];
 const near=(a,b)=>Math.abs(a-b)<1e-4;
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='v30-hallOctagon'){root=new Float32Array(m);inv=M.inverse(root);}
  if(inv&&k==='hall45-entry-box'&&c==='#e1ded2'&&p[0]===10&&p[1]===45){const q=M.multiply(inv,m);if(Math.abs(q[12])>1)columns.push(q);}
  if(k.startsWith('hall45-band151-'))throw Error('hall45 band151 duplicate installation');
  if(inv&&k==='hall45-entry-box'&&c==='#c5c6ba'&&p[0]===14&&p[1]===45){
   const q=M.multiply(inv,m);
   if(near(q[12],0)&&near(q[13],9.1)&&near(q[14],31)&&near(q[0],10)&&near(q[5],4.8)&&near(q[10],.45)){plaque={g,c,p,uv};count++;return;}
  }
  return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=emit;}
 if(!root||count!==1)throw Error('hall45 band151 plaque registration changed');
 // The upstream door wrappers see their unchanged registration witness before
 // this outer wrapper replaces the final plaque submission.
 emit.call(b.e,'hall45-band151-plaque',plaque.g,M.multiply(root,M.transform([0,10.225,30.60],[10,3.35,.40],0)),plaque.c,plaque.p,plaque.uv);
 if(columns.length!==16)throw Error('hall45 band151 column count changed');
 const spans=columns.map(q=>{if(!near(q[14],30.1)||!near(q[10],.70)||!near(q[0],.44)||q[13]-q[5]/2>6.7||q[13]+q[5]/2<8.55)throw Error('hall45 band151 column section changed');return[q[12]-q[0]/2,q[12]+q[0]/2];}).sort((a,b)=>a[0]-b[0]);
 const stone=new G.Geometry();let left=-35;
 // Column solids occupy the full band depth. Omit those volumes entirely;
 // their real front surfaces complete the band without coplanar duplicates.
 function segment(a,z){if(z<=a)throw Error('hall45 band151 overlapping columns');const g=G.box();for(let i=0;i<g.v.length;i+=8){g.v[i]=(a+z)/2+g.v[i]*(z-a);g.v[i+1]=7.625+g.v[i+1]*1.85;g.v[i+2]=30.10+g.v[i+2]*.70;}stone.v.push(...g.v);}
 for(const[a,z]of spans){segment(left,a);left=z;}segment(left,35);
 emit.call(b.e,'hall45-band151-stone',stone,root,'#e1ded2',[14,45,0,1.1]);
 return result;
};
Y.Hall45Band151={x:[-35,35],y:[6.7,8.55],z:[29.75,30.45],plaqueY:[8.55,11.9],plaqueZ:[30.4,30.8],depthSurveyed:false,angledWingsIncluded:false};
})(YY);
