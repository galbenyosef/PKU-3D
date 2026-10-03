/* Local rendering-only junction: terminal footway511 meets continuous service204.
 * Paving priority follows mapped connectivity, not a surveyed material boundary. */
(function(Y){'use strict';
const G=Y.Geo;
function clip(f,g){
 if(f.properties.pickId!==511||f.properties.id!=='way/1149802302')return g;
 const road=Y.CAMPUS.features.find(q=>q.properties.pickId===204&&q.properties.id==='way/595592769');
 const points=road?.geometry.coordinates,node=points?.findIndex(p=>p[0]===361.634&&p[1]===439.264);
 if(!road||node!==2||road.properties.width!==4||f.properties.width!==2||f.geometry.coordinates.length!==4||f.geometry.coordinates[3][0]!==361.634||f.geometry.coordinates[3][1]!==439.264)throw Error('Road511 junction source changed; recheck boundary');
 const rv=new Float32Array(Y.StudentCenterSouth46.clipGroundRibbon(Y.Landscape42.warp(G.ribbon(points,road.properties.width,.12,false))).v);
 const originalRoad=new Float32Array(G.ribbon(points,road.properties.width,.12,false).v);
 if(rv.length!==originalRoad.length||rv.some((v,i)=>i%8<6&&v!==originalRoad[i]))throw Error('Road511 receiving road topology or terrain changed; recheck boundary');
 // Only the final footway segment is clipped; earlier turns stay byte-identical.
 // East ribbon boundary is vertices c,d. Keep the real bend at their shared node.
 const edge=i=>[Array.from(rv.slice(i*48+40,i*48+43)),Array.from(rv.slice(i*48+16,i*48+19))],edges=[edge(node-1),edge(node)],split=edges[0][1][2];
 const out=new G.Geometry(),raw=new Float32Array(g.v),side=(p,a,b)=>(b[2]-a[2])*(p[0]-a[0])-(b[0]-a[0])*(p[2]-a[2]);
 function half(poly,dist,round){const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b);if(da>=0)result.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db),p=a.map((v,k)=>v+(b[k]-v)*t);if(round){p[0]=Math.fround(p[0]);p[2]=Math.fround(p[2]);if(dist(p)<0){const bits=new Uint32Array(new Float32Array([p[0]]).buffer);bits[0]++;p[0]=new Float32Array(bits.buffer)[0];}}result.push(p);}}return result;}
 const start=raw.length-48,expected=new Float32Array(G.ribbon(f.geometry.coordinates,2,.12,false).v);
 if(raw.length!==144||expected.length!==raw.length||raw.some((v,i)=>i%8<6&&v!==expected[i]))throw Error('Road511 terminal topology or terrain changed; recheck boundary');
 out.v.push(...g.v.slice(0,start));
 for(let i=start;i<raw.length;i+=24){const tri=[0,8,16].map(k=>Array.from(raw.slice(i+k,i+k+8)));for(let j=0;j<2;j++){let poly=half(tri,p=>j?p[2]-split:split-p[2],false);poly=half(poly,p=>side(p,...edges[j]),true);for(let k=1;k+1<poly.length;k++)for(const p of[poly[0],poly[k],poly[k+1]])out.vertex(p.slice(0,3),p.slice(3,6),p.slice(6,8));}}
 if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;
}
Y.Road511Join={clip};
})(YY);
