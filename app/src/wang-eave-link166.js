/* Photo-fitted inner-low / outer-high soffit, gap 1.05 m. South/east evidence;
 * north/rear continuation is a symmetry fit, not an independently read detail.
 * Roof slope, glass, apron and lower brace anchors retain their prior geometry. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
const S={gap:1.05,fitRange:[.8,1.3],inner:[9.994,11.134],outer:[13.604,13.68],innerY:74.68,outerY:75.73,roofBaseY:76.495,roofTopY:85.495,topY:86.185,scope:'sloped-annular-soffit-and-connected-eave-roof',rear:'symmetry-fit'};
const yaw=.0447,C=Math.cos(yaw),D=Math.sin(yaw),root=M.transform([415.15,0,681.7],[1,1,1],yaw),local=p=>[C*(p[0]-415.15)-D*(p[2]-681.7),p[1],D*(p[0]-415.15)+C*(p[2]-681.7)];
const fields=[[0,0,0],[1/(S.outer[0]-S.inner[0]),0,-S.inner[0]/(S.outer[0]-S.inner[0])],[-1/(S.outer[0]-S.inner[0]),0,-S.inner[0]/(S.outer[0]-S.inner[0])],[0,1/(S.outer[1]-S.inner[1]),-S.inner[1]/(S.outer[1]-S.inner[1])],[0,-1/(S.outer[1]-S.inner[1]),-S.inner[1]/(S.outer[1]-S.inner[1])]],value=(f,p)=>f[0]*p[0]+f[1]*p[2]+f[2];
function clip(poly,f){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=value(f,a),db=value(f,b);if(da>=-1e-10)out.push(a);if(da*db<0){const t=da/(da-db);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}return out;}
function tri(g,a,b,c){a=a.map(Math.fround);b=b.map(Math.fround);c=c.map(Math.fround);if(Math.hypot(...M.cross(M.sub(b,a),M.sub(c,a)))>1e-9)g.tri(a,b,c);}
function bend(g,ps){for(let k=0;k<fields.length;k++){let p=ps;for(let j=0;j<fields.length&&p.length;j++)if(j!==k)p=clip(p,fields[k].map((v,i)=>v-fields[j][i]));if(p.length<3)continue;p=p.map(v=>[v[0],v[1]+S.gap*value(fields[k],v),v[2]]);for(let j=1;j<p.length-1;j++)tri(g,p[0],p[j],p[j+1]);}}
function ring(){const g=new G.Geometry(),corners=(r,y)=>[[-r[0],y,-r[1]],[-r[0],y,r[1]],[r[0],y,r[1]],[r[0],y,-r[1]]],inner=corners(S.inner,S.innerY),outer=corners(S.outer,S.outerY),top=corners(S.inner,S.outerY);for(let i=0;i<4;i++){const j=(i+1)%4;
 // Sloping underside, horizontal hidden upper surface, and inner return.
 g.quad(inner[i],inner[j],outer[j],outer[i]);g.quad(top[i],outer[i],outer[j],top[j]);g.quad(inner[j],inner[i],top[i],top[j]);
 }return g;}
function braces(){const g=new G.Geometry(),unit=G.cylinder(8,1);for(const x of[-1,1])for(const z of[-1,1]){const a=[x*10.5,71.595,z*14.60],b=[x*10.5,75.745,z*16],up=M.norm(M.sub(b,a)),side=M.norm(M.cross(up,[0,0,1])),front=M.cross(side,up),len=Math.hypot(...M.sub(b,a)),point=i=>{const p=a.map((v,j)=>v+side[j]*.16*unit.v[i]+up[j]*len*unit.v[i+1]+front[j]*.16*unit.v[i+2]);return[p[0]*.76,p[1],p[2]*.76];};for(let i=0;i<unit.v.length;i+=24)tri(g,point(i),point(i+8),point(i+16));}return g;}
const moved=k=>k==='v16-wang-crown'||/^wang-roof153-(hip|caps|seams-)/.test(k)||k.startsWith('wang-roof-detail165-');
A.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.prototype.hasOwnProperty.call(b.e,'add'),ribs=new G.Geometry();let ribStyle,braceStyle;
b.e.add=function(k,g,m,c,p,uv){if(moved(k)){const n=m.slice();n[13]+=S.gap;return emit.call(this,k,g,n,c,p,uv);}if(k==='wang-roof153-ribs'){ribStyle={c,p,uv};for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(d=>local(M.apply(m,[...g.v.slice(i+d,i+d+3),1])));bend(ribs,ps);}return;}if(k.startsWith('wang-roof153-brace-')){braceStyle={c,p,uv};return;}return emit.call(this,k,g,m,c,p,uv);};
try{const result=previous.call(this,b,f,add);const put=(k,g,style)=>emit.call(b.e,k,b.geo(k,()=>g),root,style.c,style.p,style.uv);if(!ribStyle||!braceStyle)throw Error('166 requires complete 153 support chain');put('wang-eave-link166-ribs',ribs,ribStyle);put('wang-eave-link166-braces',braces(),braceStyle);put('wang-eave-link166-soffit',ring(),{c:'#414b48',p:[29,89,0,1.96]});return result;}finally{if(own)b.e.add=emit;else delete b.e.add;}};
Y.WangEaveLink166={...S,field:p=>Math.max(...fields.map(f=>value(f,p))),ring,braces};Y.WangRoof120.topY=S.topY;
})(YY);
