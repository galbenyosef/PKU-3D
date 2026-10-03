/* Southwest L wing: registered 84.88/91 s source frames show intersecting
 * gables and two rows of blue collectors with pale cylindrical headers.
 * Axes follow this footprint only. Back slopes, rise and equipment sizes are
 * proportional fits; no neighboring wing or facade is replaced. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,M=Y.M,G=Y.Geo,F=Y.Footprints,ID='way/1031892012',BODY=13.6,RISE=2.8;
function layout(f){const ring=f.geometry.coordinates[0],o=ring[0],d=M.norm([ring[1][0]-o[0],0,ring[1][1]-o[1]]),local=p=>[(p[0]-o[0])*d[0]+(p[1]-o[1])*d[2],-(p[0]-o[0])*d[2]+(p[1]-o[1])*d[0]],r=ring.map(local),width=(r[3][0]+r[4][0])/2,branch=(r[1][0]+r[2][0])/2,north=(r[2][1]+r[3][1])/2,south=(r[4][1]+r[5][1])/2,ru=branch/2,rv=(north+south)/2;
 const world=(u,h,v)=>[o[0]+u*d[0]-v*d[2],h,o[1]+u*d[2]+v*d[0]],profile=(u,v)=>{const main=v>=north-1e-7?1-Math.abs(v-rv)/(rv-north):-1,leg=u<=branch+1e-7&&v<=rv+1e-7?1-Math.abs(u-ru)/ru:-1;return BODY+RISE*Math.max(0,Math.min(1,Math.max(main,leg)));};
 return{o,d,r,width,branch,north,south,ru,rv,local,world,profile};}
function split(poly,line){const parts=[[],[]],dist=p=>p[0]*line[0]+p[1]*line[1]+line[2];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b);if(da>=-1e-9)parts[0].push(a);if(da<=1e-9)parts[1].push(a);if(da*db< -1e-16){const t=da/(da-db),p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];parts[0].push(p);parts[1].push(p);}}return parts.filter(p=>p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-9);}
function roof(f,q){const g=new G.Geometry(),h=q.rv-q.north,lines=[[1,0,-q.ru],[1,0,-q.branch],[0,1,-q.north],[0,1,-q.rv],[h,-q.ru,q.ru*q.north],[h,q.ru,-h*q.branch-q.ru*q.north]];
 // Equal subdivision depth keeps shared crease edges watertight after Float32.
 function tri(a,b,c,depth=0){if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))<1e-10)return;if(depth<3){const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);tri(a,ab,ca,depth+1);tri(ab,b,bc,depth+1);tri(ca,bc,c,depth+1);tri(ab,bc,ca,depth+1);return;}g.tri(...[a,b,c].map(p=>q.world(p[0],q.profile(...p),p[1])));}
 for(const pg of F.polygons(f.geometry))for(const t of F.capTriangles(pg)){let polys=[t.map(q.local)];for(const line of lines)polys=polys.flatMap(p=>split(p,line));for(const p of polys)for(let i=1;i+1<p.length;i++)tri(p[0],p[i],p[i+1]);}return g;}
function ends(f,q){const g=new G.Geometry(),ring=f.geometry.coordinates[0],sgn=F.area(ring)>0?1:-1,h=q.rv-q.north,lines=[[1,0,-q.ru],[1,0,-q.branch],[0,1,-q.north],[0,1,-q.rv],[h,-q.ru,q.ru*q.north],[h,q.ru,-h*q.branch-q.ru*q.north]];
 for(let i=1;i<ring.length;i++){let a=q.local(ring[i-1]),b=q.local(ring[i]);if(sgn>0)[a,b]=[b,a];const cuts=[0,1];for(const l of lines){const da=l[0]*a[0]+l[1]*a[1]+l[2],db=l[0]*b[0]+l[1]*b[1]+l[2];if(da*db<0)cuts.push(da/(da-db));}cuts.sort((a,b)=>a-b);
 for(let j=1;j<cuts.length;j++){const point=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],p=point(cuts[j-1]),r=point(cuts[j]);if(Math.max(q.profile(...p),q.profile(...r))<BODY+1e-7)continue;const ps=[q.world(p[0],BODY,p[1]),q.world(r[0],BODY,r[1]),q.world(r[0],q.profile(...r),r[1]),q.world(p[0],q.profile(...p),p[1])];for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(i=>ps[i]);if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))>1e-9)g.tri(...t);}}}
 return g;}
function slab(q,u,v,w,d,offset,thickness){const g=new G.Geometry(),p=(x,z,t)=>q.world(x,q.profile(x,z)+t,z),x0=u-w/2,x1=u+w/2,z0=v-d/2,z1=v+d/2,top=[p(x0,z0,offset),p(x0,z1,offset),p(x1,z1,offset),p(x1,z0,offset)],bottom=[p(x0,z0,offset-thickness),p(x0,z1,offset-thickness),p(x1,z1,offset-thickness),p(x1,z0,offset-thickness)];g.quad(...top);g.quad(...bottom.slice().reverse());for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(top[i],bottom[i],bottom[j],top[j]);}return g;}
function equipment(q,emit){const collectors=new G.Geometry(),frames=new G.Geometry(),supports=new G.Geometry(),headers=new G.Geometry(),panels=[],margin=1.20,stride=(q.width-2*margin)/14,pw=stride-.14,pd=2.0;
 for(let row=0;row<2;row++)for(let col=0;col<14;col++){const u=margin+stride*(col+.5),v=q.rv+1.75+row*2.72;const pane=slab(q,u,v,pw,pd,.16,.035);panels.push({u,v,w:pw,d:pd,row,col});collectors.v.push(...pane.v);
 frames.v.push(...slab(q,u,v,pw+.10,pd+.10,.135,.045).v);
 for(const su of[-1,1])for(const sv of[-1,1])supports.v.push(...slab(q,u+su*pw*.40,v+sv*pd*.36,.09,.12,.10,.10).v);
 const hv=v-pd/2-.075,cy=q.profile(u,hv)+.20,r=.105,n=16,x0=u-pw/2,x1=u+pw/2,point=(x,a)=>q.world(x,cy+Math.cos(a)*r,hv+Math.sin(a)*r);for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;headers.quad(point(x0,a),point(x0,b),point(x1,b),point(x1,a));headers.tri(q.world(x0,cy,hv),point(x0,b),point(x0,a));headers.tri(q.world(x1,cy,hv),point(x1,a),point(x1,b));}
 }
 // Same primitive order and attributes; the merged equipment has broader bounds.
 emit('collectors',collectors,'#6c99ad',5);emit('collector-frames',frames,'#465653',29);emit('collector-supports',supports,'#5b625c',29);emit('collector-headers',headers,'#dbddd4',10);return panels;}
A.render=function(b,f,add){if(f.properties.pickId!==982||f.properties.id!==ID)return prior.call(this,b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=old;}
 const q=layout(f),originalRoof=rows.find(r=>r.k.startsWith('v30-roof-982-')),emit=(key,g,c,mat)=>old.call(b.e,'building982-roof130-'+key,g,M.identity(),c,[mat,982,0,0]);for(const r of rows)if(!r.k.startsWith('v30-roof-'))old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);
 emit('surface',roof(f,q),originalRoof.c,originalRoof.p[0]);emit('ends',ends(f,q),'#c5c5b9',24);equipment(q,emit);
 return{...result,roof:'special',roofDetail:'l-shaped-intersecting-gables',roofTopologyVerified:true,roofBackSlopesFitted:true,solarCollectorRows:2,solarCollectorsPerRow:14,solarDimensionsFitted:true};
};Y.Building982Roof130={layout,roof,ends,equipment};
})(YY);
