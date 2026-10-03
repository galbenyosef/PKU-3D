/* Local rendering-only junction: terminal footway748 meets continuous service162.
 * Paving priority follows mapped connectivity, not a surveyed material boundary. */
(function(Y){'use strict';
const G=Y.Geo;
function clip(f,g){
 if(f.properties.pickId!==748||f.properties.id!=='way/1192032415')return g;
 const road=Y.CAMPUS.features.find(q=>q.properties.pickId===162&&q.properties.id==='way/272360502');
 const points=road?.geometry.coordinates,node=points?.findIndex(p=>p[0]===-130.958&&p[1]===178.899);
 if(!road||node!==3||road.properties.width!==4||f.properties.width!==2||f.geometry.coordinates.length!==2||f.geometry.coordinates[0][0]!==-130.958||f.geometry.coordinates[0][1]!==178.899)throw Error('Road748 junction source changed; recheck boundary');
 const rv=new Float32Array(Y.Landscape42.warp(G.ribbon(points,road.properties.width,.12,false)).v);
 // East ribbon boundary is vertices c,d. Keep the real bend at their shared node.
 const edge=i=>[Array.from(rv.slice(i*48+40,i*48+43)),Array.from(rv.slice(i*48+16,i*48+19))],edges=[edge(node-1),edge(node)],split=edges[0][1][2];
 const out=new G.Geometry(),raw=new Float32Array(g.v),side=(p,a,b)=>(b[2]-a[2])*(p[0]-a[0])-(b[0]-a[0])*(p[2]-a[2]);
 function half(poly,dist,round){const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b);if(da>=0)result.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db),p=a.map((v,k)=>v+(b[k]-v)*t);if(round){p[0]=Math.fround(p[0]);p[2]=Math.fround(p[2]);if(dist(p)<0){const bits=new Uint32Array(new Float32Array([p[0]]).buffer);bits[0]--;p[0]=new Float32Array(bits.buffer)[0];}}result.push(p);}}return result;}
 for(let i=0;i<raw.length;i+=24){const tri=[0,8,16].map(k=>Array.from(raw.slice(i+k,i+k+8)));for(let j=0;j<2;j++){let poly=half(tri,p=>j?p[2]-split:split-p[2],false);poly=half(poly,p=>side(p,...edges[j]),true);for(let k=1;k+1<poly.length;k++)for(const p of[poly[0],poly[k],poly[k+1]])out.vertex(p.slice(0,3),p.slice(3,6),p.slice(6,8));}}
 if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;
}
Y.Road748Join={clip};
})(YY);
