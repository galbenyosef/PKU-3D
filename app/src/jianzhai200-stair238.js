/* Jian Hall east stair study. Dimensions are fitted, not surveyed.
 * Deliberately not registered until the adjoining facade and landing are ready. */
(function(Y){'use strict';
 const G=Y.Geo,F=Y.Footprints;
 const fit=Object.freeze({width:2.30,run:5.85,rise:3.04,steps:20,landing:1.10,rail:.92,foundation:.12,stone:'#b8b5a2',metal:'#356951'});
 // u increases uphill. The visible arch is a blind recess, not an assumed passage.
 function sideProfile(){
  const n=32,outer=[[0,-fit.foundation],[fit.run,-fit.foundation],[fit.run,fit.rise-.14],[0,0],[0,-fit.foundation]],hole=[];
  const c=4.22,r=.68,spring=.69,bottom=.08;
  hole.push([c-r,bottom],[c+r,bottom],[c+r,spring]);
  for(let i=1;i<=n;i++){const a=Math.PI*i/n;hole.push([c+r*Math.cos(a),spring+r*Math.sin(a)]);}
  hole.push([c-r,bottom]);return {outer,hole};
 }
 function cheek(side){
  const {outer,hole}=sideProfile(),g=new G.Geometry(),x=side*(fit.width/2-.02),back=x-side*.14;
  const point=(p,xx)=>[xx,p[1],fit.run-p[0]];
  for(const t of F.capTriangles([outer,hole])){const ps=t.map(p=>point(p,x));if(side>0)ps.reverse();g.tri(...ps);}
  // The back of the cheek stays solid; the arch has a shallow inset back wall.
  for(const t of F.capTriangles([outer])){const ps=t.map(p=>point(p,back));if(side<0)ps.reverse();g.tri(...ps);}
  for(const [ring,isHole]of[[outer,false],[hole,true]]){
   const area=F.area(ring);
   for(let i=1;i<ring.length;i++){
    let a=ring[i-1],b=ring[i];if((area>0)!==!isHole)[a,b]=[b,a];
    const ps=[point(a,x),point(b,x),point(b,back),point(a,back)];if(side>0)ps.reverse();g.quad(...ps);
   }
  }
  return g;
 }
 function build(b){
  const h=fit.rise/fit.steps,d=fit.run/fit.steps;
  // Each tread is a closed slab; both cheeks support the continuous soffit.
  for(let i=0;i<fit.steps;i++)b.box(0,(i+1)*h-.09,fit.run-(i+.5)*d,fit.width,.18,d+.008,fit.stone,10,.15);
  b.box(0,fit.rise-.12,-fit.landing/2,fit.width,.24,fit.landing,fit.stone,10,.15);
  for(const side of[-1,1]){
   const key='jian238-stair-cheek-'+side;b.mesh(key,b.geo(key,()=>cheek(side)),0,0,0,1,1,1,fit.stone,10,.18);
   const x=side*(fit.width/2-.10),y=u=>h+u/fit.run*(fit.rise-h);
   for(const offset of[.14,fit.rail])b.beam([x,y(0)+offset,fit.run],[x,y(fit.run)+offset,0],.048,fit.metal,29,.8);
   const bays=8;
   for(let i=0;i<=bays;i++){const u=fit.run*i/bays;b.beam([x,y(u),fit.run-u],[x,y(u)+fit.rail,fit.run-u],.045,fit.metal,29,.8);}
   // Rectangular return motifs sit in the sloping plane between the posts.
   for(let i=0;i<bays;i++){
    const a=fit.run*(i+.18)/bays,z=fit.run*(i+.82)/bays;
    const pts=[[a,.29],[z,.29],[z,.70],[a,.70],[a,.29]];
    for(let k=1;k<pts.length;k++){const p=pts[k-1],q=pts[k];b.beam([x,y(p[0])+p[1],fit.run-p[0]],[x,y(q[0])+q[1],fit.run-q[0]],.026,fit.metal,29,.81);}
   }
   b.beam([x,fit.rise+fit.rail,0],[x,fit.rise+fit.rail,-fit.landing],.048,fit.metal,29,.8);
   b.beam([x,fit.rise,-fit.landing],[x,fit.rise+fit.rail,-fit.landing],.045,fit.metal,29,.8);
  }
 }
 Y.JianStair238={fit,cheek,build};
})(YY);
