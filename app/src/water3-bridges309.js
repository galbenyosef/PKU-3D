/* The three source-tagged bridges retain mapped XZ/width/material. Heights and
   the thin structural deck are bounded display fits, not surveyed bridge types. */
(function(Y){'use strict';const G=Y.Geo,M=Y.M,F=Y.Footprints,features=Y.CAMPUS.features,water=features.find(f=>f.properties.pickId===3),plans=new Map(),H=.62,T=.08;
function cut(poly,axis,limit,keepHigh){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a[axis]-limit,db=b[axis]-limit,ia=keepHigh?da>=-1e-10:da<=1e-10,ib=keepHigh?db>=-1e-10:db<=1e-10;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}}return out;}
function frame(f){const a=f.geometry.coordinates[0],b=f.geometry.coordinates.at(-1),L=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/L,(b[1]-a[1])/L],n=[-u[1],u[0]],w=f.properties.width;return {f,a,b,L,u,n,w,to:p=>[(p[0]-a[0])*u[0]+(p[2]-a[1])*u[1],p[1],(p[0]-a[0])*n[0]+(p[2]-a[1])*n[1]],at:(t,v,y)=>[a[0]+u[0]*t+n[0]*v,y,a[1]+u[1]*t+n[1]*v]};}
const wg=F.surface(water.geometry,.5);
function clippedBounds(p,geo){const ts=[];for(let i=0;i<geo.v.length;i+=24){let q=[0,8,16].map(k=>p.to(geo.v.slice(i+k,i+k+3)));for(const [a,l,h]of[[0,0,true],[0,p.L,false],[2,-p.w/2,true],[2,p.w/2,false]])q=cut(q,a,l,h);ts.push(...q.map(v=>v[0]));}return ts.length?[Math.min(...ts),Math.max(...ts)]:null;}
for(const id of[710,527,472]){const p=frame(features.find(f=>f.properties.pickId===id));p.water=clippedBounds(p,wg);p.knots=id===527?[0,p.L]:[0,Math.max(0,p.water[0]-.25),Math.min(p.L,p.water[1]+.25),p.L];p.heights=id===527?[H,H]:[.12,H,H,.12];plans.set(id,p);}
// The southern bridge reaches the mapped bank at its endpoint. Its two
// source-connected short approaches carry the transition, rather than a step.
for(const id of[528,529]){const p=frame(features.find(f=>f.properties.pickId===id)),join=features.find(f=>f.properties.pickId===527).geometry.coordinates,atStart=join.some(q=>Math.hypot(q[0]-p.a[0],q[1]-p.a[1])<1e-6);p.water=clippedBounds(p,wg);const flat=Math.max(.4,p.water?(atStart?p.water[1]:p.L-p.water[0])+.25:0),ramp=Math.min(Math.max(3.4,flat+2.5),p.L-.1);p.knots=atStart?[0,flat,ramp,p.L]:[0,p.L-ramp,p.L-flat,p.L];p.heights=atStart?[H,H,.12,.12]:[.12,.12,H,H];plans.set(id,p);}
// Keep the original junction ribbons level wherever they overlap the bridge
// footprint. Compute full-width overlap, rather than centrelines alone.
for(const id of[710,472]){const p=plans.get(id);let start=.02,end=.02;for(const f of features){if(f.properties.kind!=='road'||f.geometry.type!=='LineString'||f.properties.pickId===id)continue;const atStart=f.geometry.coordinates.some(q=>Math.hypot(q[0]-p.a[0],q[1]-p.a[1])<1e-6),atEnd=f.geometry.coordinates.some(q=>Math.hypot(q[0]-p.b[0],q[1]-p.b[1])<1e-6);if(!atStart&&!atEnd)continue;const range=clippedBounds(p,G.ribbon(f.geometry.coordinates,f.properties.width,.12));if(range){if(atStart)start=Math.max(start,range[1]+.02);if(atEnd)end=Math.max(end,p.L-range[0]+.02);}}
 const lo=p.water[0]-.25,hi=p.water[1]+.25;if(start>=lo||p.L-end<=hi)throw Error('Bridge approach needs independent reference');p.knots=[0,start,lo,hi,p.L-end,p.L];p.heights=[.12,.12,H,H,.12,.12];p.aprons=[start,end];}
// Eight sections approximate each gentle smoothstep land approach; the actual
// section knots are shared by deck, closed sides and navigation.
for(const p of plans.values()){const k=[p.knots[0]],h=[p.heights[0]];for(let i=1;i<p.knots.length;i++){const count=p.heights[i]===p.heights[i-1]?1:8;for(let j=1;j<=count;j++){const t=j/count;k.push(p.knots[i-1]+(p.knots[i]-p.knots[i-1])*t);h.push(p.heights[i-1]+(p.heights[i]-p.heights[i-1])*t*t*(3-2*t));}}p.knots=k;p.heights=h;}
// Piecewise linear sections preserve exact shared cross sections and let both
// the deck and navigation use one profile. End ramps are a fit, not new stairs.
function height(p,t){for(let i=1;i<p.knots.length;i++)if(t<=p.knots[i]+1e-8){const d=p.knots[i]-p.knots[i-1],s=d?(t-p.knots[i-1])/d:0;return p.heights[i-1]+M.clamp(s,0,1)*(p.heights[i]-p.heights[i-1]);}return p.heights.at(-1);}
function renderRoad(f,add){const p=plans.get(f.properties.pickId);if(!p||p.f.properties.id!==f.properties.id)return false;const top=new G.Geometry(),shell=new G.Geometry(),half=p.w/2;
 for(let i=1;i<p.knots.length;i++){const lo=p.knots[i-1],hi=p.knots[i];if(hi-lo<1e-8)continue;const a=p.at(lo,-half,height(p,lo)),b=p.at(hi,-half,height(p,hi)),c=p.at(hi,half,height(p,hi)),d=p.at(lo,half,height(p,lo));top.quad(d,c,b,a);const low=q=>[q[0],q[1]-T,q[2]],A=low(a),B=low(b),C=low(c),D=low(d);shell.quad(A,B,C,D);shell.quad(a,b,B,A);shell.quad(c,d,D,C);if(i===1)shell.quad(d,a,A,D);if(i===p.knots.length-1)shell.quad(b,c,C,B);}
 const walk=['footway','path','steps'].includes(f.properties.tags.highway),color=walk?'#cbc7b7':'#9a9f96',mat=walk?7:15;add('water3-bridge309-top-'+f.properties.pickId,top,color,mat,f.properties.pickId);add('water3-bridge309-shell-'+f.properties.pickId,shell,color,mat,f.properties.pickId);
 // Source-connected ribbons meet at a slight angle. Fill only their exposed
 // outer corner triangle, not an invented landing or widened roadway.
 if(f.properties.pickId===527)for(const [other,end]of[[528,0],[529,1]]){const q=plans.get(other),t=end?p.L:0,node=p.at(t,0,H),qt=other===528?q.L:0;for(const side of[-1,1]){const a=p.at(t,side*half,H),b=q.at(qt,side*q.w/2,H),center=node.map((v,i)=>(v+a[i]+b[i])/3),contains=r=>{const v=r.to(center);return v[0]>=-1e-8&&v[0]<=r.L+1e-8&&Math.abs(v[2])<=r.w/2+1e-8;};if(contains(p)||contains(q))continue;let triangle=[node,a,b];if(M.cross(M.sub(a,node),M.sub(b,node))[1]<0)triangle.reverse();const g=new G.Geometry(),low=triangle.map(v=>[v[0],v[1]-T,v[2]]);g.tri(...triangle);g.tri(low[2],low[1],low[0]);for(let i=0;i<3;i++){const j=(i+1)%3;g.quad(triangle[i],low[i],low[j],triangle[j]);}add('water3-bridge309-joint-'+other+'-'+side,g,color,mat,527);}}
 return true;}
function route(g,edge){const selected=[...plans.values()].filter(p=>p.f.properties.id===edge?.source);if(!selected.length)return g;let changed=false,polys=[];for(let i=0;i<g.v.length;i+=24)polys.push([0,8,16].map(k=>g.v.slice(i+k,i+k+8)));
 for(const p of selected){const next=[];for(const poly of polys){const loc=poly.map(v=>[...p.to(v),...v.slice(3)]),ts=loc.map(v=>v[0]),vs=loc.map(v=>v[2]);if(Math.max(...ts)<=0||Math.min(...ts)>=p.L||Math.max(...vs)<=-p.w/2||Math.min(...vs)>=p.w/2){next.push(poly);continue;}
  let inside=loc,rem=[];for(const [axis,lim,high]of[[0,0,true],[0,p.L,false],[2,-p.w/2,true],[2,p.w/2,false]]){const outside=cut(inside,axis,lim,!high);if(outside.length>=3)rem.push(outside);inside=cut(inside,axis,lim,high);if(!inside.length)break;}
  const back=q=>q.map(v=>[...p.at(v[0],v[2],v[1]),...v.slice(3)]);next.push(...rem.map(back));if(inside.length<3)continue;changed=true;
  for(let i=1;i<p.knots.length;i++){let seg=cut(cut(inside,0,p.knots[i-1],true),0,p.knots[i],false);if(seg.length<3)continue;for(const v of seg)v[1]=.32+height(p,v[0])-.12;next.push(back(seg));}
 }polys=next;}
 if(!changed)return g;const out=new G.Geometry();for(const q of polys)for(let i=1;i<q.length-1;i++){const v=[q[0],q[i],q[i+1]];if(Math.hypot(...M.cross(M.sub(v[1].slice(0,3),v[0].slice(0,3)),M.sub(v[2].slice(0,3),v[0].slice(0,3))))<1e-9)continue;out.tri(...v.map(p=>p.slice(0,3)),v.map(p=>p.slice(6,8)));}return out;}
Y.Water3Bridges309={renderRoad,route,plans,height,H,T};
})(YY);
