/* Li Dazhao: photographed standing collar. Dimensions fitted, not surveyed. */
(function(Y){'use strict';
 const original=Y.Heritage31.render;
 Y.Heritage31.render=function(b,f){
  if(f.properties.pickId!==1111||f.properties.id!=='node/2773008893')return original.call(this,b,f);
  const prior=b.liDazhao33,own=Object.prototype.hasOwnProperty.call(b,'liDazhao33');
  b.liDazhao33=function(){
   const beam=this.beam,ownBeam=Object.prototype.hasOwnProperty.call(this,'beam');
   this.beam=function(a,b,r){
    if(r===.027&&Math.abs(a[0])===.17&&a[1]===.60&&a[2]===.13&&b[0]===Math.sign(a[0])*.12&&b[1]===.48&&b[2]===.17)return;
    return beam.apply(this,arguments);
   };
   let result;try{result=prior.apply(this,arguments);}finally{if(ownBeam)this.beam=beam;else delete this.beam;}
   const key='li1111-standing-collar';
   const geo=this.geo(key,()=>{
    const g=new Y.Geo.Geometry(),N=64,start=Math.PI/2+.10,end=Math.PI/2+Math.PI*2-.10;
    const point=(a,upper,inner)=>{
     const front=Math.max(0,Math.sin(a));
     return [(inner?.166:.184)*Math.cos(a),upper?.661-.052*front:.485,(inner?.141:.160)*Math.sin(a)];
    };
    // Closed U-shaped band; the small front split remains open, without inventing buttons.
    const quad=(a,b,c,d)=>g.quad(a,b,c,d);
    for(let i=0;i<N;i++){
     const a=start+(end-start)*i/N,c=start+(end-start)*(i+1)/N;
     const A=point(a,false,false),B=point(c,false,false),C=point(c,true,false),D=point(a,true,false);
     const E=point(a,false,true),F=point(c,false,true),H=point(c,true,true),I=point(a,true,true);
     quad(A,D,C,B);quad(E,F,H,I);quad(D,I,H,C);quad(A,B,F,E);
     if(i===0)quad(A,E,I,D);if(i===N-1)quad(B,C,H,F);
    }
    return g;
   });
   this.mesh(key,geo,0,1.9,0,1,1,1,'#68715b',10);
   return result;
  };
  try{return original.call(this,b,f);}finally{if(own)b.liDazhao33=prior;else delete b.liDazhao33;}
 };
})(YY);
