/* Keep the original bell relief topology, but place it on the actual bell shell.
 * Motifs remain a simplified fit; no inscription or unseen carving is asserted. */
(function(Y){'use strict';const M=Y.M,G=Y.Geo,previous=Y.Heritage31.render,TAU=Math.PI*2;
function tube(g,pts,r,n=5){const rings=[],normals=[];for(let i=0;i<pts.length;i++){const d=M.norm(M.sub(pts[Math.min(pts.length-1,i+1)],pts[Math.max(0,i-1)])),s=M.norm(M.cross(d,Math.abs(d[1])>.95?[1,0,0]:[0,1,0])),v=M.cross(d,s),nn=Array.from({length:n},(_,j)=>M.add(M.mul(s,Math.cos(j*TAU/n)),M.mul(v,Math.sin(j*TAU/n))));normals.push(nn);rings.push(nn.map(q=>M.add(pts[i],M.mul(q,r))));}for(let i=1;i<rings.length;i++)for(let j=0;j<n;j++){const k=(j+1)%n;g.tri(rings[i-1][j],rings[i-1][k],rings[i][k],undefined,[normals[i-1][j],normals[i-1][k],normals[i][k]]);g.tri(rings[i-1][j],rings[i][k],rings[i][j],undefined,[normals[i-1][j],normals[i][k],normals[i][j]]);}return g;}
function fittedRelief(shell){const g=new G.Geometry(),tris=[];
 for(let i=0;i<shell.v.length;i+=24){const a=shell.v.slice(i,i+3),b=shell.v.slice(i+8,i+11),c=shell.v.slice(i+16,i+19);tris.push({a,e:M.sub(b,a),f:M.sub(c,a)});}
 function point(a,y){const cs=Math.cos(a),sn=Math.sin(a),o=[2*cs,y,2*sn],d=[-cs,0,-sn];let near=Infinity;
  for(const t of tris){const h=M.cross(d,t.f),det=M.dot(t.e,h);if(Math.abs(det)<1e-10)continue;const s=M.sub(o,t.a),u=M.dot(s,h)/det;if(u< -1e-8||u>1+1e-8)continue;const q=M.cross(s,t.e),v=M.dot(d,q)/det;if(v< -1e-8||u+v>1+1e-8)continue;const n=M.dot(t.f,q)/det;if(n>0&&n<near)near=n;}
  if(!Number.isFinite(near))throw Error('Bell1109 relief misses original shell');const r=2-near+.006;return[r*cs,y,r*sn];
 }
 for(const y of[.38,.65,1.53,1.73,1.89])tube(g,Array.from({length:129},(_,j)=>point(j*TAU/128,y)),.012);
 for(let i=0;i<12;i++)for(const s of[-1,1])tube(g,Array.from({length:20},(_,j)=>{const t=j/19;return point(i*TAU/12+s*(.035+.09*Math.sin(t*8)),.78+t*.68);}),.010);
 return g;
}
Y.Heritage31.render=function(b,f){if(f.properties.pickId!==1109||f.properties.id!=='heritage/bell-pavilion')return previous.call(this,b,f);const original=b.e.add;let shell;
 b.e.add=function(k,g,m,c,p,uv){if(k==='v10-hollow-bell')shell=g;if(k==='v10-bell-relief'&&shell)g=b.geo('bell1109-fitted-relief',()=>fittedRelief(shell));return original.call(this,k==='v10-bell-relief'?'bell1109-fitted-relief':k,g,m,c,p,uv);};
 try{return previous.call(this,b,f);}finally{b.e.add=original;}
};Y.Bell1109={fittedRelief};
})(YY);
