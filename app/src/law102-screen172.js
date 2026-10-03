/* Same official 2013 opening photograph, explicitly read visible fine-panel cells.
 * O: dark framed aperture; U: pale framed field of uncertain interior material;
 * S: textured stone. Six rows are subdivisions of two bands, not six storeys.
 * Registered edges/pitch are a photo fit (+/- .05 m), not surveyed dimensions.
 * North .8..29.2 m and east NE .8..18.4 m only; no periodic extrapolation. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/240825569',P='law102-screen172-';
const layout={"north":["SSUSUSUSSUSUSSUSUSOSSSOSOSSSSOSOSSOSOSOSOSOSOSOSOSSSOSOSOSOSSOSSSOSOSOS","SUSSUSUSUSSSUSUSUSSOSOSSOSOSOSSSOSOSOSSOSOSSOSOSSOSOSSOSOSSOSOSOSSSOSOS","SUSUSSUSSOSOSSOSSOSOSOSOSSOSSOSOSSOSSOSOSOSOSSOSOSSOSSOSSOSOSOSSOSOSSOS","SSUSUSSOSOSSOSOSOSSOSSOSOSOSSOSOSOSSOSSOSSOSOSSOSOSSOSOSOSSOSOSSOSOSOSS","SUSSOSOSSOSOSSOSOSOSSOSSOSOSSOSOSSOSSOSOSOSSOSOSSOSOSSOSOSOSSOSOSSOSSOS","SSUSOSUSSOSUSOSSUSSOSOSOSSOSOSSSOSOSOSSOSSOSOSOSOSSOSOSSOSSOSOSSOSSOSOS"],"east":["SSOSOSSOSOSOSSOSSOSOSOSSOSSOSSOSOSOSSOSOSSOS","SSOSSOSOSOSSOSOSOSSOSOSOSSOSSOSSOSOSOSSSOSOS","SOSSOSSOSSOSOSOSOSOSSOSOSSSOSOSOSSOSSOSOSSOS","SOSOSOSSOSSOSSOSOSSOSOSSOSOSSOSSOSOSOSSOSOSS","SOSOSSOSOSOSSOSSOSOSSOSOSSOSSSOSOSOSSOSOSSOS","SOSSOSOSOSSOSOSOSSOSOSSOSSSOSOSSOSSOSOSSOSSS"]};
// Local wall-plane solids. All output uses the existing upper-band matrix.
function clip(p,fn){const out=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=fn(a),db=fn(b);if(da<=0)out.push(a);if((da<=0)!==(db<=0)){const t=da/(da-db);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}return out;}
function keepOutsideX(g,a,b){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const raw=[0,8,16].map(j=>Array.from(g.v.slice(i+j,i+j+8)));for(const fn of[v=>v[0]-a,v=>b-v[0]]){const p=clip(raw,fn);if(!raw.some(v=>fn(v)<-1e-7))continue;for(let j=1;j<p.length-1;j++){const t=[p[0],p[j],p[j+1]],n=M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0]));if(M.dot(n,n)>1e-16)for(const v of t)out.v.push(...v);}}}return out;}
function makeGroups(F,other,ring){const groups=new Map(),sgn=Math.sign(Y.Footprints.area([...ring,ring[0]]));
 function box(name,mat,color,x0,x1,y0,y1,z0,z1){if(x1-x0<1e-7||y1-y0<1e-7)return;let p=[[x0,z0],[x1,z0],[x1,z1],[x0,z1]];const world=q=>M.apply(F.matrix,[q[0],0,q[1],1]);for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];p=clip(p,q=>{const w=world(q);return-sgn*((b[0]-a[0])*(w[2]-a[1])-(b[1]-a[1])*(w[0]-a[0]));});}p=clip(p,q=>other.local(world(q))[2]-q[1]);p=p.filter((q,i)=>Math.hypot(q[0]-p[(i+1)%p.length][0],q[1]-p[(i+1)%p.length][1])>1e-7);if(p.length<3)return;if(Y.Footprints.area([...p,p[0]])<0)p.reverse();let g=groups.get(name)?.g;if(!g){g=new G.Geometry();groups.set(name,{g,mat,color});}const tri=(...ps)=>{ps=ps.map(p=>p.map(Math.fround));const n=M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]));if(M.dot(n,n)>1e-16)g.tri(...ps);};for(let i=1;i<p.length-1;i++){tri([p[0][0],y1,p[0][1]],[p[i+1][0],y1,p[i+1][1]],[p[i][0],y1,p[i][1]]);tri([p[0][0],y0,p[0][1]],[p[i][0],y0,p[i][1]],[p[i+1][0],y0,p[i+1][1]]);}for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];tri([a[0],y0,a[1]],[a[0],y1,a[1]],[b[0],y1,b[1]]);tri([a[0],y0,a[1]],[b[0],y1,b[1]],[b[0],y0,b[1]]);}}
 return{groups,box};}
function addCell(B,x0,x1,y0,y1,state){
 const stone=(a,b,lo,hi,z0=-.48,z1=0)=>B.box('stone',24,'#b6b7b1',a,b,lo,hi,z0,z1),bar=.065;
 if(state==='S'){
  // Narrow recessed joints subdivide observed stone panels; no photograph texture.
  stone(x0,x1,y0,y1,-.48,-.012);stone(x0+.007,x1-.007,y0,y1,-.012,0);return;
 }
 const z=-.08;
 for(const x of[x0+bar/2,x1-bar/2])B.box('frame',9,'#475653',x-bar/2,x+bar/2,y0,y1,z-.07,z+.07);
 for(const y of[y0+bar/2,y1-bar/2])B.box('frame',9,'#475653',x0,x1,y-bar/2,y+bar/2,z-.07,z+.07);
 B.box(state==='U'?'light-glass':'glass',state==='U'?28:5,state==='U'?'#b4ad8d':'#657c83',x0+bar-.001,x1-bar+.001,y0+bar-.001,y1-bar+.001,z-.0175,z+.0175);
 // Stone opening jambs join the recessed frame rather than leaving a black decal.
 stone(x0,x0+.035,y0,y1);stone(x1-.035,x1,y0,y1);
}

function rowBounds(H,row){const upper=row<3,lo=upper?H.splitHigh:H.screen+1.2,hi=upper?H.top-1.2:H.splitLow,j=2-row%3,h=(hi-lo)/3;return[lo+j*h+.045,lo+(j+1)*h-.045];}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const F={east:Y.Law102Entry170.frame(f),north:Y.Law102Entry170.northFrame(f)},ring=Y.Footprints.polygons(f.geometry)[0][0].slice(0,-1),emit=b.e.add,own=Object.hasOwn(b.e,'add'),matrices={},changed=[],cells=[];
 const region={north:[.65,29.2],east:[F.east.length-18.4,F.east.length-.65]};
 b.e.add=function(k,g,m,c,p,uv){const hit=k.match(/law102-envelope171-(east|north)-screen-(panel|reveal|frame|glass)$/);if(p[1]!==102||!hit)return emit.call(this,k,g,m,c,p,uv);const side=hit[1];matrices[side]=m;changed.push(k);const gg=keepOutsideX(g,...region[side]);if(gg.v.length)return emit.call(this,P+'retained-'+side+'-'+hit[2],gg,m,c,p,uv);};
 let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 if(changed.length!==8||!matrices.east||!matrices.north)throw Error('Law screen172 upstream changed: '+changed.length);
 const H=Y.Law102Envelope171.heights;
 for(const side of['east','north']){const wall=F[side],B=makeGroups(wall,F[side==='east'?'north':'east'],ring),rows=layout[side];
  for(let j=0;j<6;j++){const[y0,y1]=rowBounds(H,j);const closure=side==='north'?[.65,.8]:[wall.length-.8,wall.length-.65];B.box('stone',24,'#b6b7b1',...closure,y0,y1,-.48,0);
   for(let i=0;i<rows[j].length;i++){const distance=.8+.4*i,x0=side==='north'?distance:wall.length-distance-.4,x1=x0+.4,state=rows[j][i];addCell(B,x0,x1,y0,y1,state);cells.push({side,row:j,column:i,state,x:[x0,x1],y:[y0,y1],matrix:Array.from(matrices[side])});}
  }
  for(const[name,r]of B.groups)emit.call(b.e,P+side+'-'+name,r.g,matrices[side],r.color,[r.mat,102,0,.86]);
 }
 Y.Law102Screen172.last={changed,cells,region};return result;
};
Y.Law102Screen172={layout,rowBounds,source:'https://www.law.pku.edu.cn/images/content/2013-06/20130604210708821957.jpg',fit:{start:.8,pitch:.4,edgeUncertainty:.05},unresolved:'Pale framed U interior material; east beyond 18.4m from NE; unseen west/south'};
})(YY);
