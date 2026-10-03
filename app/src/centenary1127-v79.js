/* Lake-island centenary sculpture: source-photo silhouette, not a survey.
 * Dimensions, depth and orientation are fits; hidden left wing is minimally
 * completed from the official 100 emblem. Caller retains terrain elevation. */
(function(Y){'use strict';const G=Y.Geo;
// Explicit cubic silhouettes: broad swept wing, hooked head and pointed bill.
// Controls follow the source-visible right bird and the small official emblem;
// depth and the hidden second bird remain constrained fits.
function bird(cx,cy,rx,ry,phase){
 const g=new G.Geometry(),N=16;
 const outer=[
 [[-.18,-.75],[.10,-.77],[.40,-.40],[.46,-.12]],
 [[.46,-.12],[.50,.09],[.49,.27],[.63,.40]],
 [[.63,.40],[.70,.48],[.74,.46],[.77,.46]],
 [[.77,.46],[.71,.58],[.58,.58],[.47,.53]],
 [[.47,.53],[.49,.77],[.20,.86],[.13,1.03]],
 [[.13,1.03],[.05,1.22],[-.04,1.14],[-.04,.95]],
 [[-.04,.95],[-.45,.83],[-.52,.28],[-.43,-.12]],
 [[-.43,-.12],[-.48,-.46],[-.46,-.73],[-.18,-.75]]
 ];
 const inner=[
 [[-.15,-.57],[.03,-.61],[.23,-.36],[.28,-.14]],
 [[.28,-.14],[.33,.03],[.35,.19],[.34,.27]],
 [[.34,.27],[.33,.35],[.32,.39],[.28,.43]],
 [[.28,.43],[.25,.47],[.20,.49],[.16,.49]],
 [[.16,.49],[.08,.48],[.01,.43],[-.04,.36]],
 [[-.04,.36],[-.10,.29],[-.15,.17],[-.18,.06]],
 [[-.18,.06],[-.24,-.10],[-.28,-.30],[-.29,-.39]],
 [[-.29,-.39],[-.31,-.51],[-.27,-.58],[-.15,-.57]]
 ];
 // In the photograph the central swept tip stands above the right wing.
 // Keep the two lower apertures, but author each visible upper contour separately.
 if(phase===0){
  outer[4]=[[.47,.53],[.40,.72],[.04,.90],[.05,1.10]];
  outer[5]=[[.05,1.10],[.07,1.23],[-.19,1.10],[-.22,.92]];
  outer[6]=[[-.22,.92],[-.49,.65],[-.52,.28],[-.43,-.12]];
 }else{
  outer[4]=[[.47,.53],[.45,.68],[.25,.79],[-.10,.79]];
  outer[5]=[[-.10,.79],[.13,.62],[.01,.54],[-.12,.45]];
  outer[6]=[[-.12,.45],[-.43,.36],[-.52,.28],[-.43,-.12]];
  // The crown is swept rightwards from a notch, not a duplicate round head.
 }
 const bez=(ps,t)=>[0,1].map(k=>(1-t)**3*ps[0][k]+3*(1-t)**2*t*ps[1][k]+3*(1-t)*t*t*ps[2][k]+t**3*ps[3][k]);
 const O=outer.flatMap(seg=>Array.from({length:N},(_,j)=>bez(seg,j/N))),I=inner.flatMap(seg=>Array.from({length:N},(_,j)=>bez(seg,j/N)));
 // Triangulate the actual perforated planar region. Interpolating matching
 // Bezier segment numbers folds at concave wing tips, even with closed edges.
 const q=(v,z)=>[cx+v[0],cy+v[1],z+.085*Math.sin(v[1]*1.8+phase)+.11*v[0]*v[1]];
 const inset=(ring,d)=>ring.map((p,i)=>{const prev=ring[(i+ring.length-1)%ring.length],next=ring[(i+1)%ring.length],normal=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);return[-dy/l,dx/l]},a=normal(prev,p),b=normal(p,next),den=Math.max(.35,1+a[0]*b[0]+a[1]*b[1]);return[p[0]+d*(a[0]+b[0])/den,p[1]+d*(a[1]+b[1])/den]});
 const F=inset(O,.002),J=inset(I,-.002);
 const normal=(v,sign)=>Y.M.norm([-.11*v[1]*sign,-(.153*Math.cos(v[1]*1.8+phase)+.11*v[0])*sign,sign]);
 const mid=(a,b)=>a.map((v,i)=>(v+b[i])/2);
 const subdiv=t=>{const[a,b,c]=t,ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);return[[a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]]};
 for(const t of piercedTriangles(F,J,O).flatMap(subdiv)){
  g.tri(...t.map(v=>q(v,.095)),undefined,t.map(v=>normal(v,1)));
  const back=t.slice().reverse();g.tri(...back.map(v=>q(v,-.095)),undefined,back.map(v=>normal(v,-1)));
 }
 for(const [ring,front,flip]of[[O,F,false],[I,J,true]])for(let j=0;j<ring.length;j++){
  const a=ring[j],b=ring[(j+1)%ring.length],c=front[j],d=front[(j+1)%ring.length];
  for(const ps of[[q(a,-.075),q(b,-.075),q(b,.075),q(a,.075)],[q(a,.075),q(b,.075),q(d,.095),q(c,.095)],[q(c,-.095),q(d,-.095),q(b,-.075),q(a,-.075)]]){if(flip)ps.reverse();
   const midpoint=(a,b)=>{const m=mid(a,b),curve=p=>.085*Math.sin((p[1]-cy)*1.8+phase)+.11*(p[0]-cx)*(p[1]-cy);m[2]=curve(m)+((a[2]-curve(a))+(b[2]-curve(b)))/2;return m};
   const [a,b,c,d]=ps,ab=midpoint(a,b),bc=midpoint(b,c),cd=midpoint(c,d),da=midpoint(d,a),center=midpoint(ab,cd);
   for(const cell of[[a,ab,center,da],[ab,b,bc,center],[center,bc,c,cd],[da,center,cd,d]])g.quad(...cell);}
 }
 return g;
}
function piercedTriangles(outer,inner,side){
 const eq=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-9,cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const oi=outer.map(p=>p.slice()),ii=inner.map(p=>p.slice());
 const h=ii.reduce((best,p,i)=>p[0]>ii[best][0]?i:best,0),H=ii[h];let best=Infinity,e=-1,hit;
 for(let i=0;i<oi.length;i++){const a=oi[i],b=oi[(i+1)%oi.length];if((a[1]>H[1])===(b[1]>H[1]))continue;const t=(H[1]-a[1])/(b[1]-a[1]),x=a[0]+t*(b[0]-a[0]);if(x>H[0]&&x<best){best=x;e=i;hit=[x,H[1]];}}
 if(e<0)throw Error('centenary hole outside silhouette');
 // Add bridge endpoint to the original ring as well, keeping side walls closed.
 if(side){const a=outer[e],b=outer[(e+1)%outer.length],t=(hit[1]-a[1])/(b[1]-a[1]),u=side[e],v=side[(e+1)%side.length];side.splice(e+1,0,[u[0]+t*(v[0]-u[0]),u[1]+t*(v[1]-u[1])]);}
 outer.splice(e+1,0,hit);oi.splice(e+1,0,hit);const k=e+1;
 const hole=Array.from({length:ii.length},(_,j)=>ii[(h-j+ii.length)%ii.length]);
 const poly=[...oi.slice(0,k+1),...hole,H,hit,...oi.slice(k+1)],out=[];
 while(poly.length>3){let found=false;for(let i=0;i<poly.length;i++){
  const a=poly[(i+poly.length-1)%poly.length],b=poly[i],c=poly[(i+1)%poly.length];if(cross(a,b,c)<1e-12)continue;
  const blocked=poly.some(p=>!eq(p,a)&&!eq(p,b)&&!eq(p,c)&&cross(a,b,p)>=-1e-12&&cross(b,c,p)>=-1e-12&&cross(c,a,p)>=-1e-12);
  if(blocked)continue;out.push([a,b,c]);poly.splice(i,1);found=true;break;
 }if(!found)throw Error('centenary triangulation stalled');}
 out.push(poly);return out;
}
function stem(){const ring=[];
 // Swept stroke tapers into a rounded fine tip; no rectangular cut above wings.
 for(let i=0;i<=48;i++){const t=i/48;ring.push([-.61+.29*t+.045*Math.sin(t*Math.PI),1.23+1.80*t]);}
 for(let i=47;i>=0;i--){const t=i/48;ring.push([-.45+.13*t+.025*Math.sin(t*Math.PI),1.22+1.81*t]);}
 ring.reverse();const g=new G.Geometry(),flat=G.polygon(ring,0);
 for(let i=0;i<flat.v.length;i+=24){const ps=[0,8,16].map(k=>[flat.v[i+k],flat.v[i+k+2]]);g.tri(...ps.map(p=>[p[0],p[1],-.03]));g.tri(...ps.reverse().map(p=>[p[0],p[1],.11]));}
 for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8)continue;g.quad([a[0],a[1],-.03],[b[0],b[1],-.03],[b[0],b[1],.11],[a[0],a[1],.11]);}return g;}
Y.Builder.prototype.centenary1127=function(){
 // No origin/y override: Heritage31 and withElevation remain authoritative.
 this.mesh('centenary1127-base',this.geo('centenary1127-base',G.box),0,.52,0,1.12,1.26,1.06,'#303735',24);
 this.mesh('centenary1127-bearing',this.geo('centenary1127-bearing',()=>G.cylinder(64)),0,1.15,0,.56,.08,.43,'#454c49',29);
 for(const[key,make]of[['left-stroke',stem],['bird-a',()=>bird(-.27,1.98,.43,.75,0)],['bird-b',()=>bird(.42,1.97,.43,.74,.65)]])this.mesh('centenary1127-'+key,this.geo('centenary1127-'+key,make),0,0,0,1,1,1,'#bac0bb',9);
};
Y.Centenary1127={holes:[[-.27,1.945],[.42,1.935]],fitted:true,baseHeight:1.15,bearingTop:1.23};
})(YY);
