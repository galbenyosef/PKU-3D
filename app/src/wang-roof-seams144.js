/* Parallel standing seams observed on the south roof photograph: outer runs
 * terminate at the hips, central runs at the short top. Same 23 base divisions
 * per slope; spacing and trim clearance remain photo fits, not measurements. */
(function(Y){'use strict';const R=Y.Architecture30,previous=R.render,M=Y.M,G=Y.Geo,s=.76;
function geometry(face,options){
 const {base,plateau,rise,baseY}=Y.WangRoof120,B=base.map(v=>v*s/2),T=plateau.map(v=>v*s/2),bottom=[[-B[0],0,-B[1]],[-B[0],0,B[1]],[B[0],0,B[1]],[B[0],0,-B[1]]],top=[[-T[0],rise,-T[1]],[-T[0],rise,T[1]],[T[0],rise,T[1]],[T[0],rise,-T[1]]],i=face,j=(i+1)%4,poly=[bottom[i],bottom[j],top[j],top[i]],normal=M.norm(M.cross(M.sub(poly[1],poly[0]),M.sub(poly[2],poly[0]))),mid=(a,b)=>a.map((v,k)=>(v+b[k])/2),delta=M.sub(mid(top[i],top[j]),mid(bottom[i],bottom[j])),up=M.norm(delta),side=M.norm(M.cross(up,normal)),g=new G.Geometry(),unit=G.box(),paths=[];
 for(let k=1;k<24;k++){
  const a=bottom[i].map((v,d)=>v+(bottom[j][d]-v)*k/24);let lo=0,hi=1;
  // Inset clipping protects the finite-width seam from hip/top flashing.
  for(let e=0;e<4;e++){const inward=M.norm(M.cross(normal,M.sub(poly[(e+1)%4],poly[e]))),margin=options&&[1,3].includes(e)?(options.hipHalfWidth+.065/2)*Math.abs(M.dot(M.norm(M.sub(poly[1],poly[0])),inward))+.035:[.06,.22,.28,.22][e],start=M.dot(M.sub(a,poly[e]),inward),rate=M.dot(delta,inward);if(Math.abs(rate)<1e-10){if(start<margin)hi=-1;}else{const t=(margin-start)/rate;if(rate>0)lo=Math.max(lo,t);else hi=Math.min(hi,t);}}
  if(hi<=lo)throw new Error('Wang parallel seam outside slope');
  const start=a.map((v,d)=>v+delta[d]*lo),end=a.map((v,d)=>v+delta[d]*hi),center=mid(start,end).map((v,d)=>v+normal[d]*.015+(d===1?baseY:0)),length=Math.hypot(...M.sub(end,start));
  paths.push({start,end,normal,termination:hi<.95?'hip':'top'});
  for(let v=0;v<unit.v.length;v+=8){const p=center.map((x,d)=>x+side[d]*unit.v[v]*.065+up[d]*unit.v[v+1]*length+normal[d]*unit.v[v+2]*.045),n=[0,1,2].map(d=>side[d]*unit.v[v+3]+up[d]*unit.v[v+4]+normal[d]*unit.v[v+5]);g.vertex([p[0]/s,p[1],p[2]/s],M.norm([n[0]*s,n[1],n[2]*s]),unit.v.slice(v+6,v+8));}
 }
 g.wangPaths=paths;return g;
}
R.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add;b.e.add=function(k,g,m,c,p,uv){if(k.startsWith('wang-seams132-face-')){const face=Number(k.slice(-1)),shape=b.geo('wang-roof-seams144-shape-'+face%2,()=>geometry(face%2));return emit.call(this,'wang-roof-seams144-face-'+face,shape,m,c,p,uv);}return emit.call(this,k,g,m,c,p,uv);};try{return previous.call(this,b,f,add);}finally{b.e.add=emit;}};
Y.WangRoofSeams144={geometry,seamsPerSlope:23,totalSeams:92,hipClearance:.22,topClearance:.28,source:'https://www.huitu.com/photo/show/20191217/200525503032.html',scope:'parallel-slope-lines-clipped-before-hip-and-top-flashing'};
})(YY);
