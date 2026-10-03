/* Visible edge fit to the archived PKU photograph ds.jpg (1268x714).
 * Photo-plane alignment is not camera calibration or a measured 3D survey.
 * Back depth and sheet thickness remain fitted; no unseen decoration. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.democracyScience33,G=Y.Geo;
 const SCALE=(2.57-.26)/(560-116),anchor=[650,116],sphereX=(675-anchor[0])*SCALE;
 // Pixel positions follow the visible sheet edges. Long stem, folded crown,
 // inner return, broad lower sweep and sphere support are separately sampled.
 const Dleft=[[500,560],[483,474],[469,390],[463,313],[474,252],[497,218],[531,208],[566,234],[609,271],[648,306],[670,322],[630,326],[625,370],[602,414],[567,447],[525,529],[500,560]];
 const Dright=[[557,557],[550,471],[535,402],[526,347],[527,293],[533,258],[545,239],[574,259],[613,303],[646,331],[655,334],[610,326],[606,365],[587,399],[546,422],[543,529],[557,557]];
 const Sleft=[[663,158],[680,206],[691,259],[696,311],[689,351],[665,385],[627,407],[577,432],[596,476],[644,517],[697,547],[750,558],[798,550],[842,533]];
 const Sright=[[697,157],[722,203],[751,254],[774,307],[790,354],[795,400],[778,445],[752,472],[745,491],[758,513],[784,526],[810,528],[826,523],[837,524]];
 function curve(points,t){const s=t*(points.length-1),i=Math.min(points.length-2,Math.floor(s)),u=s-i,p=[-1,0,1,2].map(k=>points[Math.max(0,Math.min(points.length-1,i+k))]);return[0,1].map(k=>.5*(2*p[1][k]+(-p[0][k]+p[2][k])*u+(2*p[0][k]-5*p[1][k]+4*p[2][k]-p[3][k])*u*u+(-p[0][k]+3*p[1][k]-3*p[2][k]+p[3][k])*u*u*u));}
 function band(a,b,kind){const g=new G.Geometry(),N=160,W=12,depth=.025;
  const at=(i,j,back=false)=>{const t=i/N,u=j/W,p=curve(a,t),q=curve(b,t),x=p[0]+(q[0]-p[0])*u,y=p[1]+(q[1]-p[1])*u;
   // Small depth relief only; photograph supports XY shape, not hidden depth.
   const z=kind==='d'?-.13+.10*Math.sin(Math.PI*t):.04+.16*Math.sin(t*Math.PI*2)+.10*Math.sin(Math.PI*u)*Math.sin(Math.PI*t);
   return[(x-anchor[0])*SCALE,2.57+(anchor[1]-y)*SCALE,z-(back?depth:0)];};
  for(let i=0;i<N;i++)for(let j=0;j<W;j++){g.quad(at(i,j),at(i,j+1),at(i+1,j+1),at(i+1,j));g.quad(at(i,j,true),at(i+1,j,true),at(i+1,j+1,true),at(i,j+1,true));}
  for(let i=0;i<N;i++){g.quad(at(i,0),at(i+1,0),at(i+1,0,true),at(i,0,true));g.quad(at(i,W),at(i,W,true),at(i+1,W,true),at(i+1,W));}
  if(kind!=='d')for(let j=0;j<W;j++){g.quad(at(0,j),at(0,j,true),at(0,j+1,true),at(0,j+1));g.quad(at(N,j),at(N,j+1),at(N,j+1,true),at(N,j,true));}return g;
 }
 P.democracyScience33=function(...args){if(this.id!==1113)return prior.apply(this,args);
  // Same original base, sphere tessellation, material and total height.
  this.cyl(0,0,0,1.18,.26,'#bcb9aa',8,1,10);
  for(const [kind,a,b]of[['d',Dleft,Dright],['s',Sleft,Sright]]){const key='ds1113-photo-'+kind;this.mesh(key,this.geo(key,()=>band(a,b,kind)),0,0,0,1,1,1,'#a5aea9',29);}
  this.sphere(sphereX,2.57,0,.29,.29,.29,'#8c8e79',29,0,true);
 };
 Y.Sculpture1113Fit={scale:SCALE,anchor,Dleft,Dright,Sleft,Sright,curve};
})(YY);
