/* Exact upper envelope of original world-space ground triangles along pond rims. */
(function(Y){'use strict';
function createTerrainProfile(sourceRing){const bb=[Math.min(...sourceRing.map(p=>p[0])),Math.min(...sourceRing.map(p=>p[1])),Math.max(...sourceRing.map(p=>p[0])),Math.max(...sourceRing.map(p=>p[1]))];let terrain=[];
function begin(){terrain=[];}
function observe(g){for(let i=0;i<g.v.length;i+=24){const p=[0,8,16].map(k=>g.v.slice(i+k,i+k+3));if(Math.max(...p.map(v=>v[0]))<bb[0]||Math.min(...p.map(v=>v[0]))>bb[2]||Math.max(...p.map(v=>v[2]))<bb[1]||Math.min(...p.map(v=>v[2]))>bb[3])continue;const a=p[0],b=p[1],c=p[2],den=(b[0]-a[0])*(c[2]-a[2])-(c[0]-a[0])*(b[2]-a[2]);if(Math.abs(den)>1e-10&&g.v[i+4]>0)terrain.push({p,den});}}
function yAt(t,x,z){const[a,b,c]=t.p,u=((x-a[0])*(c[2]-a[2])-(c[0]-a[0])*(z-a[2]))/t.den,v=((b[0]-a[0])*(z-a[2])-(x-a[0])*(b[2]-a[2]))/t.den;return a[1]+u*(b[1]-a[1])+v*(c[1]-a[1]);}
function segments(a,b){const spans=[],dx=b[0]-a[0],dz=b[1]-a[1];for(const t of terrain){let lo=0,hi=1;const s=Math.sign(t.den);for(let j=0;j<3;j++){const p=t.p[j],q=t.p[(j+1)%3],v0=s*((q[0]-p[0])*(a[1]-p[2])-(q[2]-p[2])*(a[0]-p[0])),dv=s*((q[0]-p[0])*dz-(q[2]-p[2])*dx);if(Math.abs(dv)<1e-12){if(v0< -1e-8){hi=-1;break;}}else if(dv>0)lo=Math.max(lo,-v0/dv);else hi=Math.min(hi,-v0/dv);}if(hi-lo>1e-9){const y0=yAt(t,...a),dy=yAt(t,...b)-y0;spans.push({lo,hi,y0,dy});}}
 const ts=[0,1];for(const s of spans)ts.push(Math.max(0,s.lo),Math.min(1,s.hi));for(let i=0;i<spans.length;i++)for(let j=i+1;j<spans.length;j++){const p=spans[i],q=spans[j],d=p.dy-q.dy;if(Math.abs(d)>1e-10){const t=(q.y0-p.y0)/d;if(t>Math.max(p.lo,q.lo)+1e-9&&t<Math.min(p.hi,q.hi)-1e-9)ts.push(t);}}
 const n=Math.ceil(Math.hypot(dx,dz)/.75);for(let j=1;j<n;j++)ts.push(j/n);
 const cuts=[...new Set(ts.map(t=>Math.round(t*1e10)/1e10))].sort((a,b)=>a-b),nodes=[];for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2,cover=spans.filter(s=>mid>=s.lo-1e-9&&mid<=s.hi+1e-9);if(!cover.length)throw Error('Pond outer bank has no captured terrain support');const top=cover.reduce((a,b)=>a.y0+a.dy*mid>b.y0+b.dy*mid?a:b);nodes.push({t:lo,y:top.y0+top.dy*lo},{t:hi,y:top.y0+top.dy*hi});}const simplified=[];for(const p of nodes){const last=simplified.at(-1);if(last&&Math.abs(last.t-p.t)<1e-10&&Math.abs(last.y-p.y)<1e-9)continue;simplified.push(p);while(simplified.length>=3){const [a,b,c]=simplified.slice(-3),dt=c.t-a.t;if(b.t-a.t<=1e-10||c.t-b.t<=1e-10||Math.abs((b.y-a.y)*dt-(c.y-a.y)*(b.t-a.t))>1e-9*dt)break;simplified.splice(simplified.length-2,1);}}return simplified;}

return{begin,observe,segments};}
Y.PondTerrainProfile={create:createTerrainProfile};
})(YY);
