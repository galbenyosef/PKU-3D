/* Numbered 61 photograph: pale narrow door and bracketed single-slope canopy.
 * Keep the inherited door axis/facing/threshold as an explicit registration
 * assumption. No new stair, landing, rear structure or whole-house claim. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,M=Y.M;
const S={doorWidth:.86,bottom:.035,top:2.45,canopyWidth:2.85,back:-.12,front:1.04,backTop:3.05,frontTop:2.65,thickness:.065};
function box(g,x,y,z,w,h,d){const q=G.box();for(let i=0;i<q.v.length;i+=8)g.vertex([x+q.v[i]*w,y+q.v[i+1]*h,z+q.v[i+2]*d],q.v.slice(i+3,i+6),q.v.slice(i+6,i+8));}
function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();g.quad(...p);}
function beam(g,a,b,w,d=w){const y=M.norm(M.sub(b,a)),seed=Math.abs(y[2])<.9?[0,0,1]:[1,0,0],x=M.norm(M.cross(y,seed)),z=M.cross(x,y),len=Math.hypot(...M.sub(b,a)),q=G.box();for(let i=0;i<q.v.length;i+=8){const v=q.v.slice(i,i+3),n=q.v.slice(i+3,i+6),p=[0,1,2].map(k=>(a[k]+b[k])/2+x[k]*v[0]*w+y[k]*v[1]*len+z[k]*v[2]*d),nn=[0,1,2].map(k=>x[k]*n[0]+y[k]*n[1]+z[k]*n[2]);g.vertex(p,nn,q.v.slice(i+6,i+8));}}
const roofY=z=>S.backTop+(S.frontTop-S.backTop)*(z-S.back)/(S.front-S.back);
function geometry(){const door=new G.Geometry(),trim=new G.Geometry(),canopy=new G.Geometry(),support=new G.Geometry(),w=S.doorWidth,t=.065,h=S.top-S.bottom;
 box(door,0,(S.top+S.bottom)/2,.085,w-2*t,h-2*t,.07);
 for(const x of[-w/2+t/2,w/2-t/2])box(trim,x,(S.top+S.bottom)/2,.095,t,h,.15);
 for(const y of[S.bottom+t/2,S.top-t/2])box(trim,0,y,.095,w-2*t,t,.15);
 // Closed roof prism, pitched down from attached back edge to front drip edge.
 const l=-S.canopyWidth/2,r=-l,a=S.back,b=S.front,ya=roofY(a),yb=roofY(b),d=S.thickness;
 face(canopy,[[l,ya,a],[r,ya,a],[r,yb,b],[l,yb,b]],[0,1,0]);face(canopy,[[l,ya-d,a],[r,ya-d,a],[r,yb-d,b],[l,yb-d,b]],[0,-1,0]);
 for(const[x,n]of[[l,-1],[r,1]])face(canopy,[[x,ya,a],[x,yb,b],[x,yb-d,b],[x,ya-d,a]],[n,0,0]);
 for(const[z,y,n]of[[a,ya,-1],[b,yb,1]])face(canopy,[[l,y,z],[r,y,z],[r,y-d,z],[l,y-d,z]],[0,0,n]);
 // Visible transverse roof joints, not extra tiled roof layers.
 for(const z of[.22,.56,.90])beam(support,[l,roofY(z)+.008,z],[r,roofY(z)+.008,z],.014,.014);
 beam(support,[l,yb-d,b-.02],[r,yb-d,b-.02],.075,.095);
 for(const x of[-.91,-.70,.70,.91]){
  box(support,x,2.35,-.045,.07,1.36,.15);
  // Paired curved/diagonal timber arms shown in the photo; cross-sections and
  // curvature are fitted. Back cleats enter the unchanged wall surface.
  const pts=[[x,1.84,0],[x,2.02,.16],[x,2.28,.36],[x,2.48,.64],[x,roofY(.96)-d,.96]];
  for(let i=1;i<pts.length;i++)beam(support,pts[i-1],pts[i],.075,.085);
  beam(support,[x,ya-d,a],[x,roofY(.98)-d,.98],.075,.075);
 }
 return{door,trim,canopy,support};}
A.render=function(b,f,add){if(f.properties.pickId!==267||f.properties.id!=='way/866277604')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.hasOwn(b.e,'add'),rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 const candidates=rows.map((r,i)=>({r,i})).filter(({r})=>r.k==='v30-box'&&r.c==='#4a4e46'&&r.p[0]===18&&r.p[3]===.7);if(candidates.length!==1)throw Error('entry302 expected one inherited door backing');const{r:back,i:start}=candidates[0],old=rows.slice(start,start+23),colors=new Set(['#4a4e46','#683b32','#56352f','#9b5848','#a39c73']);if(old.length!==23||old.filter(r=>r.k==='v30-torus').length!==2||old.some(r=>!colors.has(r.c)))throw Error('entry302 inherited door sequence changed');
 const frame=new Float32Array(back.m);for(let j=0;j<3;j++){frame[j]/=1.4;frame[j+4]/=2.63;frame[j+8]/=.22;frame[j+12]-=frame[j+4]*1.225;}
 const inv=M.inverse(frame),windowGlass=[];for(let i=0;i<rows.length;i++){const r=rows[i];if(r.p[0]!==5)continue;const t=M.multiply(inv,r.m);if(Math.abs(t[14])<.1&&t[12]-Math.abs(t[0])/2<S.doorWidth/2&&t[12]+Math.abs(t[0])/2>-S.doorWidth/2&&t[13]>0&&t[13]<S.top)windowGlass.push(i);}
 if(windowGlass.length!==1)throw Error('entry302 overlapping placeholder window changed');const windowStart=windowGlass[0]-1,windowRows=rows.slice(windowStart,windowStart+12);if(windowRows.length!==12||windowRows[0].c!=='#454840'||windowRows[1].p[0]!==5||windowRows[11].c!=='#b0afa3'||windowRows.some(r=>r.k!=='v30-box'))throw Error('entry302 window sequence changed');
 const removedIndices=new Set([...Array.from({length:23},(_,i)=>start+i),...Array.from({length:12},(_,i)=>windowStart+i)]);
 let emitted=0;for(let i=0;i<rows.length;i++){if(removedIndices.has(i))continue;const r=rows[i];emit.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);emitted++;}
 const g=geometry();for(const[k,c,mat]of[['door','#d0c4a5',20],['trim','#ded3b7',20],['canopy','#777063',19],['support','#56443b',20]])emit.call(b.e,'yannan267-entry302-'+k,g[k],frame,c,[mat,267,0,.9]);Y.Yannan267Entry302.last={start,windowStart,removed:35,removedIndices:[...removedIndices],frame:Array.from(frame),originalRecords:rows.length,retainedRecords:emitted};return result;
};Y.Yannan267Entry302={spec:S,geometry,roofY,limitations:{orientationInherited:true,wholeHouseRegistrationUnresolved:true,doorHardwareUnknown:true,stepsUnchangedUnverified:true}};
})(YY);
