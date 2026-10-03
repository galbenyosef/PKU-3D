/* Historical aerial + opening-day barrel hall: bounded roof-only candidate.
 * Plan and heights are image fits, not a survey. Door and facade remain unverified.
 * Retains the 311 wall-top band; the replacement roof starts at its same 6.98m. */
(function(Y){'use strict';const prior=Y.Architecture30.render,F=Y.Footprints,G=Y.Geo,M=Y.M;
const fit={base:6.98,clerestoryHeight:2.2,rise:3.0,coreLength:31.5,southLowDepth:10.0,northEaveDepth:22.0,roofCrossSamples:84};
function descriptor(f){const ring=f.geometry.coordinates[0],a=ring[0],b=ring[ring.length-2],len=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/len,(b[1]-a[1])/len],n=[u[1],-u[0]],local=p=>[(p[0]-a[0])*u[0]+(p[1]-a[1])*u[1],(p[0]-a[0])*n[0]+(p[1]-a[1])*n[1]],world=p=>[a[0]+u[0]*p[0]+n[0]*p[1],a[1]+u[1]*p[0]+n[1]*p[1]];
 const original=ring.slice(0,-1).map(local),clip=(poly,axis,value,keepLow)=>{const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],inside=r=>keepLow?r[axis]<=value:r[axis]>=value,ip=inside(p),iq=inside(q);if(ip)out.push(p);if(ip!==iq){const t=(value-p[axis])/(q[axis]-p[axis]);out.push(p.map((v,k)=>k===axis?value:v+(q[k]-v)*t));}}return out;},geom=poly=>({type:'Polygon',coordinates:[[...poly.map(world),world(poly[0])]]});
 const west=clip(original,0,fit.coreLength,true),core=clip(clip(west,1,fit.southLowDepth,false),1,fit.northEaveDepth,true),lowNorth=clip(west,1,fit.northEaveDepth,false),lowSouth=clip(west,1,fit.southLowDepth,true),lowEast=clip(original,0,fit.coreLength,false);
 const profile=p=>{const t=Math.max(0,Math.min(1,(local(p)[1]-fit.southLowDepth)/(fit.northEaveDepth-fit.southLowDepth)));return fit.base+fit.clerestoryHeight+fit.rise*Math.sin(Math.PI*t);};
 return {core:geom(core),coreLocal:core,low:[lowSouth,lowNorth,lowEast].filter(p=>p.length>=3).map(geom),profile,local,world,clip,geom,fit};
}
function roofMesh(d){const out=new G.Geometry();for(let i=0;i<fit.roofCrossSamples;i++){const lo=fit.southLowDepth+(fit.northEaveDepth-fit.southLowDepth)*i/fit.roofCrossSamples,hi=fit.southLowDepth+(fit.northEaveDepth-fit.southLowDepth)*(i+1)/fit.roofCrossSamples,poly=d.clip(d.clip(d.coreLocal,1,lo,false),1,hi,true);if(poly.length<3)continue;const g=F.surface(d.geom(poly),0);for(let j=0;j<g.v.length;j+=24){const ps=[0,8,16].map(k=>[g.v[j+k],d.profile([g.v[j+k],g.v[j+k+2]]),g.v[j+k+2]]),uv=[0,8,16].map(k=>g.v.slice(j+k+6,j+k+8));if(Math.hypot(...M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0])))>1e-9)out.tri(...ps,uv);}}return out;}
function cap(roof,g,d){const edges=F.polygons(g).flat().flatMap(r=>r.slice(1).map((b,i)=>[r[i],b])),out=new G.Geometry(),seen=new Set();
 for(let i=0;i<roof.v.length;i+=24)for(let j=0;j<3;j++){let a=roof.v.slice(i+j*8,i+j*8+3),b=roof.v.slice(i+(j+1)%3*8,i+(j+1)%3*8+3);if(!edges.some(([p,q])=>F.distSegment([a[0],a[2]],p,q)<1e-6&&F.distSegment([b[0],b[2]],p,q)<1e-6))continue;
  const la=d.local([a[0],a[2]]),lb=d.local([b[0],b[2]]);if(Math.abs(la[1]-lb[1])<1e-5)continue;
  const key=[a,b].map(p=>p.map(x=>x.toFixed(6)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);
  const ps=[[a[0],fit.base,a[2]],[b[0],fit.base,b[2]],b,a],normal=M.norm(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))),mid=[(a[0]+b[0])/2,(a[2]+b[2])/2];if(F.inside([mid[0]+normal[0]*.001,mid[1]+normal[2]*.001],g))ps.reverse();
  for(const ii of[[0,1,2],[0,2,3]]){const t=ii.map(k=>ps[k]);if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))>1e-9)out.tri(...t);}
 }return out;
}
// Both high sidewalls are visible in the2024 interior. Seven bays are a
// bounded facade display fit, not a verified count; only the east portion
// is unobscured in the2023 north aerial. Glass replaces wall tiles exactly.
function clerestory(d){const wall=new G.Geometry(),glass=new G.Geometry(),frame=new G.Geometry(),ring=d.core.coordinates[0];
 function rect(out,a,b,lo,hi,outward){const p=[[a[0],lo,a[1]],[b[0],lo,b[1]],[b[0],hi,b[1]],[a[0],hi,a[1]]],normal=M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0]));if(normal[0]*outward[0]+normal[2]*outward[1]<0)p.reverse();out.tri(p[0],p[1],p[2]);out.tri(p[0],p[2],p[3]);}
 for(let k=1;k<ring.length;k++){const a=ring[k-1],b=ring[k],la=d.local(a),lb=d.local(b);if(Math.abs(la[1]-lb[1])>1e-5)continue;const north=Math.abs(la[1]-fit.northEaveDepth)<1e-4,mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],len=Math.hypot(b[0]-a[0],b[1]-a[1]);let outward=[(b[1]-a[1])/len,-(b[0]-a[0])/len];if(F.inside([mid[0]+outward[0]*.001,mid[1]+outward[1]*.001],d.core))outward=outward.map(v=>-v);
 const eave=fit.base+fit.clerestoryHeight,sill=fit.base+.50,head=eave-.28,point=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
 rect(wall,a,b,fit.base,sill,outward);rect(wall,a,b,head,eave,outward);
 const bays=7,bay=1/bays,margin=.26/len,mullion=.055/len;
 for(let j=0;j<bays;j++){const lo=j*bay,hi=(j+1)*bay,gl=lo+margin,gh=hi-margin;
  rect(wall,point(lo),point(gl),sill,head,outward);rect(wall,point(gh),point(hi),sill,head,outward);
  const cuts=[gl,gl+mullion,gl+(gh-gl)/3-mullion/2,gl+(gh-gl)/3+mullion/2,gl+2*(gh-gl)/3-mullion/2,gl+2*(gh-gl)/3+mullion/2,gh-mullion,gh];
  for(let i=1;i<cuts.length;i++){const frameColumn=i%2===1;if(frameColumn)rect(frame,point(cuts[i-1]),point(cuts[i]),sill,head,outward);else{rect(frame,point(cuts[i-1]),point(cuts[i]),sill,sill+.06,outward);rect(glass,point(cuts[i-1]),point(cuts[i]),sill+.06,head-.06,outward);rect(frame,point(cuts[i-1]),point(cuts[i]),head-.06,head,outward);}}
 }
 }return{wall,glass,frame};}
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==405||f.properties.id!=='way/1075644760')return prior.apply(this,arguments);const d=descriptor(f);let changed=false;
 const result=prior.call(this,b,f,(key,g,c,mat,id)=>{if(key==='teacher41-roof-405'){
  changed=true;d.low.forEach((g,i)=>add('teacher405-roof-next-low-'+i,F.surface(g,fit.base),c,mat,id));const roof=roofMesh(d);add('teacher405-roof-next-barrel',roof,c,mat,id);add('teacher405-roof-next-gables',cap(roof,d.core,d),'#d2cec1',24,id);const cs=clerestory(d);add('teacher405-roof-next-clerestory-wall',cs.wall,'#d2cec1',24,id);add('teacher405-roof-next-clerestory-glass',cs.glass,'#719297',28,id);add('teacher405-roof-next-clerestory-frame',cs.frame,'#555b5c',22,id);
 }else add(key,g,c,mat,id);});
 return changed?{...result,roof:'photo-fitted-compound-barrel-low-wings',roofFit:{...fit},roofSurveyed:false,clerestoryBayCountFitted:true,entranceVerified:false}:result;
};Y.Teacher405RoofNext={descriptor,fit};
})(YY);
