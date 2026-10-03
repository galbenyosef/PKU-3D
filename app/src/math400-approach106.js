/* Photo-supported short paving from the 82 courtyard gate to the existing road.
 * Distances are model fits. No road, gate, vegetation or neighbour is modified. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1075644754';
const expectedRoad=[[61.585,-305.778],[-77.982,-287.657],[-175.402,-285.67],[-230.923,-290.189],[-242.214,-290.255],[-294.225,-291.621]];
const near=(a,b,e=2e-5)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<e),cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
function source(){const gate=Y.Math400Entry101,road=Y.CAMPUS.features.find(f=>f.properties.id==='way/33278333'&&f.properties.pickId===28);
 if(!gate||!near(gate.center,[-127.95,-295.0104621999283])||!near(gate.scale,[.85,.88,.85])||JSON.stringify(gate.endpoints)!==JSON.stringify([[-135.655,-295.085],[-121.7,-294.95]])||!road||road.properties.width!==4||JSON.stringify(road.geometry.coordinates)!==JSON.stringify(expectedRoad))throw Error('400 approach source changed: re-register gate and road');
 const mesh=Y.Road717Join.clip(road,Y.Road511Join.clip(road,Y.Road748Join.clip(road,Y.StudentCenterSouth46.clipGroundRibbon(Y.Landscape42.warp(G.ribbon(road.geometry.coordinates,4,.12,false))))));
 const v=new Float32Array(mesh.v),edge=[Array.from(v.slice(48,51)),Array.from(v.slice(56,59))];
 if(v.length!==240||!near(edge[0],[-78.1510895,.12,-289.6498394])||!near(edge[1],[-175.3688937,.12,-287.6697260]))throw Error('400 approach receiving ribbon changed '+JSON.stringify({length:v.length,edge}));
 return {gate,edge};
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const {gate,edge}=source(),platform=[];const emit=b.e.add;
 b.e.add=function(k,g,m,...args){if(k==='400-platform-box'){const points=[];for(let i=0;i<g.v.length;i+=8){const x=g.v[i],y=g.v[i+1],z=g.v[i+2];points.push([m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]]);}if(Math.max(...points.map(p=>p[1]))<.2)platform.push(points);}return emit.call(this,k,g,m,...args);};let retained;try{retained=previous.call(this,b,f,add);}finally{b.e.add=emit;}
 if(platform.length!==1)throw Error('400 approach platform missing or duplicated');
 const u=[Math.cos(gate.angle),-Math.sin(gate.angle)],n=[-u[1],u[0]],points=platform[0],top=Math.max(...points.map(p=>p[1])),along=p=>(p[0]-gate.center[0])*n[0]+(p[2]-gate.center[1])*n[1];
 const max=Math.max(...points.map(along)),front=points.filter(p=>Math.abs(p[1]-top)<1e-6&&Math.abs(along(p)-max)<1e-6),uniq=[...new Map(front.map(p=>[p.join(','),p])).values()].sort((a,b)=>a[0]-b[0]);
 if(uniq.length!==2||!near([top,max],[.1408,1.1305])||Math.abs(Math.hypot(uniq[1][0]-uniq[0][0],uniq[1][2]-uniq[0][2])-1.9975)>2e-5)throw Error('400 approach platform dimensions changed');
 const rv=[edge[1][0]-edge[0][0],edge[1][2]-edge[0][2]],ends=uniq.map(p=>{const t=cross([edge[0][0]-p[0],edge[0][2]-p[2]],rv)/cross(n,rv);if(t<5.1||t>5.4)throw Error('400 approach span changed');return [p[0]+n[0]*t,.12,p[2]+n[1]*t];});
 const point=(s,t,drop=0)=>{const a=uniq[0].map((v,i)=>v+(uniq[1][i]-v)*s),c=ends[0].map((v,i)=>v+(ends[1][i]-v)*s);return a.map((v,i)=>v+(c[i]-v)*t-(i===1?drop:0));};
 const stone=new G.Geometry(),joint=new G.Geometry(),rows=7;
 // Tile boundaries share the original linear slope, including staggered T points.
 // Stone centres rise 3 mm; shallow bevel rings provide joints without a backing sheet.
 for(let row=0;row<rows;row++){const ta=row/rows,tb=(row+1)/rows,ss=row%2?[0,.25,.75,1]:[0,.5,1];for(let col=0;col<ss.length-1;col++){
  const sa=ss[col],sb=ss[col+1],ds=.006,dt=.006/5.25;
  const outer=[[sa,ta],[sa,tb],[sb,tb],[sb,ta]],inner=[[sa+ds,ta+dt],[sa+ds,tb-dt],[sb-ds,tb-dt],[sb-ds,ta+dt]];
  const q=outer.map(([s,t])=>point(s,t)),r=inner.map(([s,t])=>point(s,t,-.003));
  stone.quad(...r);for(let k=0;k<4;k++){const j=(k+1)%4;joint.quad(q[k],q[j],r[j],r[k]);}
 }}
 add('400-approach106-stone',stone,'#b8b8a8',24,f.properties.pickId);add('400-approach106-joints',joint,'#929588',24,f.properties.pickId);
 return {...retained,approach106:{scope:'Short fitted paving only; gate, road and trees retained',corners:[uniq[0],uniq[1],ends[1],ends[0]],photoMeasured:false,roadId:28,tileRows:rows}};
};Y.Math400Approach106={source};})(YY);
