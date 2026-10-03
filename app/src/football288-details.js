/* Five-Four east small pitches: site-photo goal backs/nets and curved end markings.
   Sizes fit retained mapped courts; they are not regulation or surveyed dimensions. */
(function(Y){'use strict';const prior=Y.Sports32.render,ID='way/880624093',PICK=288,PREFIX='football288-';
Y.Sports32.render=function(b,f){if(f.properties.id!==ID||f.properties.pickId!==PICK)return prior.call(this,b,f);const G=Y.Geo,fr=Y.ArchitectureAdapter.frame(f.geometry),cw=fr.w-2,cd=(fr.d-2)/3,w=Math.min(cw-2,34),d=Math.min(cd-3,20),oldAdd=b.e.add;let result;
 // Keep the boundary, halfway line and centre circle byte-for-byte. The old
 // rectangular end areas disagree with the site aerial's rounded markings.
 b.e.add=function(k,g,m,c,p,uv){if(p[0]===7&&p[1]===PICK&&c==='#799b75')return oldAdd.call(this,k,g,m,c,[22,...p.slice(1)],uv);if(k==='court32-lines-'+PICK){const cut=G.ribbon([[0,-5],[5,-5],[5,5],[0,5]],.095,.245,false).v.length,lines=new G.Geometry();lines.v.push(...g.v.slice(0,-2*cut));for(const side of[-1,1]){const end=side*w/2,points=[];for(let i=0;i<=48;i++){const a=-Math.PI/2+i*Math.PI/48;points.push([end-side*5*Math.cos(a),5*Math.sin(a)]);}lines.v.push(...G.ribbon(points,.095,.245,false).v);}return oldAdd.call(this,PREFIX+'lines',lines,m,c,p,uv);}return oldAdd.call(this,k,g,m,c,p,uv);};
 try{result=prior.call(this,b,f);}finally{b.e.add=oldAdd;}
 const saved=b.id;b.id=PICK;const net=new G.Geometry();
 // Four-sided strands have volume from every viewing direction, with no
 // opaque filled panel behind them. Reuse the same complete mesh six times.
 const strand=(a,z)=>{const up=Y.M.norm(Y.M.sub(z,a)),side=Y.M.norm(Y.M.cross(up,Math.abs(up[2])>.95?[1,0,0]:[0,0,1])),other=Y.M.cross(side,up),r=.006;const p=(o,s,t)=>o.map((v,i)=>v+r*(s*side[i]+t*other[i]));for(const[s,t,u,v]of[[1,1,-1,1],[-1,1,-1,-1],[-1,-1,1,-1],[1,-1,1,1]])net.quad(p(a,s,t),p(z,s,t),p(z,u,v),p(a,u,v));};
 const top=x=>2.15-.30*x;
 for(let i=0;i<=20;i++){const z=-1.5+3*i/20;strand([1,.27,z],[1,1.85,z]);strand([0,2.15,z],[1,1.85,z]);}
 for(let i=0;i<=11;i++){const y=.27+(1.85-.27)*i/11;strand([1,y,-1.5],[1,y,1.5]);}
 for(const z of[-1.5,1.5]){for(let i=0;i<=7;i++){const x=i/7;strand([x,.27,z],[x,top(x),z]);}for(let i=1;i<12;i++){const t=i/12;strand([0,.27+(2.15-.27)*t,z],[1,.27+(1.85-.27)*t,z]);}}
 for(let i=1;i<7;i++){const x=i/7;strand([x,top(x),-1.5],[x,top(x),1.5]);}
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{for(let row=0;row<3;row++)for(const sign of[-1,1])b.local(sign*w/2,0,(row-1)*cd,sign<0?Math.PI:0,()=>{
  for(const z of[-1.5,1.5]){b.beam([0,.27,z],[1,.27,z],.045,'#e2e2d5',29);b.beam([1,.27,z],[1,1.85,z],.035,'#e2e2d5',29);b.beam([0,2.15,z],[1,1.85,z],.035,'#e2e2d5',29);}b.beam([1,.27,-1.5],[1,.27,1.5],.045,'#e2e2d5',29);b.beam([1,1.85,-1.5],[1,1.85,1.5],.035,'#e2e2d5',29);
  b.mesh(PREFIX+'goal-net',net,0,0,0,1,1,1,'#d0d1c3',29);
 });});}finally{b.id=saved;}return result;
};Y.Football288Details={id:ID,pickId:PICK,prefix:PREFIX};})(YY);
