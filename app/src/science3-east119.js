/* Candidate only. East recessed main wing: June 2026 main-building seven-floor
 * statement + September 2022 eight-axis facade, January 2026 brick/red frames.
 * 26m roof retained as old fit. Seventh floor stays byte-preserved as the old unresolved template.
 * Only floors 2-6 receive new glazing; no scheme loggia is fabricated. */
(function(Y){'use strict';const R=Y.Architecture30,previous=R.render,G=Y.Geo,M=Y.M,ID='relation/11975585';
const center=[408.5635,172.442],u=[-.044309183925647574,-.9990178658161439],n=[.9990178658161439,-.044309183925647574],length=Math.hypot(1.537,34.654),low=5.05,top=26,depth=.26;
const local=p=>[(p[0]-center[0])*u[0]+(p[2]-center[1])*u[1],p[1],(p[0]-center[0])*n[0]+(p[2]-center[1])*n[1]];
// Preserve the full old top-row frame (lowest vertex 22.2318m).
const high=22.22,rowHeight=(high-low)/5,rows=Array.from({length:5},(_,j)=>low+(j+.50)*rowHeight),axes=Array.from({length:8},(_,j)=>(j-3.5)*3.2),ventAxes=[-14.55,14.55];
const apertures=rows.flatMap((y,j)=>[...axes.map((x,k)=>({x,y,w:2.05,h:2.18,row:j,axis:k,type:'window'})),...ventAxes.map((x,k)=>({x,y,w:.56,h:1.72,row:j,axis:k,type:'vent'}))]);
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a),db=fn(b);if(da>=-1e-9)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}}return out;}
R.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const emit=b.e.add,win=b.window;let changed=0,removedWindows=0,removedBands=0,serial=0;
b.window=function(x,y,z,w,h,...rest){const p=local([x,y,z]);if(Math.abs(p[2]-.045)<.02&&Math.abs(p[0])<length/2&&y-h/2>low&&y+h/2<high){removedWindows++;return;}return win.call(this,x,y,z,w,h,...rest);};
b.e.add=function(key,g,m,c,p,uv){if(p[1]!==8||key.startsWith('science3-entry8-')&&!key.includes('-cut-'))return emit.call(this,key,g,m,c,p,uv);
 const world=v=>M.apply(m,[v[0],v[1],v[2],1]).slice(0,3),pts=[];for(let i=0;i<g.v.length;i+=8)pts.push(local(world(g.v.slice(i,i+3))));
 // Entire old floor-band boxes on this one edge, including their side faces.
 if(key==='box'&&pts.length&&pts.every(q=>Math.abs(q[0])<=length/2+.001&&q[1]>low&&q[1]<high&&q[2]>=-.035&&q[2]<=.09)&&Math.max(...pts.map(q=>q[0]))-Math.min(...pts.map(q=>q[0]))>length-.01){removedBands++;return;}
 let replaced=false;const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const tri=[0,8,16].map(k=>g.v.slice(i+k,i+k+8)),q=tri.map(v=>local(world(v)));
 // Only the exact outward main wall plane; never back/return/roof triangles.
 const onFace=q.every(v=>Math.abs(v[2])<.00001&&Math.abs(v[0])<=length/2+.00001),normal=M.norm(M.cross(M.sub(world(tri[1]),world(tri[0])),M.sub(world(tri[2]),world(tri[0]))));
 if(onFace&&M.dot(normal,[n[0],0,n[1]])>.99&&q.some(v=>v[1]>low+.00001)&&q.some(v=>v[1]<high-.00001)){for(const keep of [clip(tri,v=>low-local(world(v))[1]),clip(tri,v=>local(world(v))[1]-high)])for(let j=1;j<keep.length-1;j++)out.v.push(...keep[0],...keep[j],...keep[j+1]);replaced=true;}else out.v.push(...tri.flat());
 }if(replaced){changed++;if(out.v.length)return emit.call(this,'science3-east119-retained-'+serial+++'-'+key,out,m,c,p,uv);return;}return emit.call(this,key,g,m,c,p,uv);};
let result;try{result=previous.call(this,b,f,add);}finally{b.window=win;b.e.add=emit;}
const old=b.id;b.id=8;try{b.local(center[0],0,center[1],Math.atan2(n[0],n[1]),()=>{
 const plane=new G.Geometry(),xs=[-length/2,...apertures.map(a=>a.x-a.w/2),...apertures.map(a=>a.x+a.w/2),length/2].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>1e-7),ys=[low,...apertures.map(a=>a.y-a.h/2),...apertures.map(a=>a.y+a.h/2),high].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>1e-7);
 for(let i=1;i<xs.length;i++)for(let j=1;j<ys.length;j++){const x=(xs[i-1]+xs[i])/2,y=(ys[j-1]+ys[j])/2;if(apertures.some(a=>Math.abs(x-a.x)<a.w/2&&Math.abs(y-a.y)<a.h/2))continue;plane.quad([xs[i-1],ys[j-1],0],[xs[i],ys[j-1],0],[xs[i],ys[j],0],[xs[i-1],ys[j],0]);}
 // Continuous facade UVs; no per-panel texture restart.
 for(let i=0;i<plane.v.length;i+=8){plane.v[i+6]=(plane.v[i]+length/2)/length;plane.v[i+7]=(plane.v[i+1]-low)/(high-low);}
 b.mesh('science3-east119-brick-wall',plane,0,0,0,1,1,1,'#858d8b',18);
 // Reuse the identical centered unit box by component class; positions, scales,
 // materials and UVs remain per-instance, in the original emission order.
 const box=(key,x,y,z,w,h,d,col,mat=29)=>b.mesh('science3-east119-'+key.replace(/-(window|vent)-\d+-\d+(?:-.*)?$/,'-$1-shared'),b.geo('science3-east119-box',G.box),x,y,z,w,h,d,col,mat);
 for(const a of apertures){const tag=a.type+'-'+a.row+'-'+a.axis,w=a.w,h=a.h,x=a.x,y=a.y,red='#653633',stone='#bfc1b8';
 // Frames and sill own their contacting planes; retain only exposed reveal strips.
 const g=new G.Geometry(),segments=a.type==='window'?[[-.188,0]]:[[-depth,-.16],[-.08,0]];
 for(const [back,front]of segments){
 g.quad([x-w/2,y-h/2,front],[x-w/2,y-h/2,back],[x-w/2,y+h/2,back],[x-w/2,y+h/2,front]);
 g.quad([x+w/2,y-h/2,back],[x+w/2,y-h/2,front],[x+w/2,y+h/2,front],[x+w/2,y+h/2,back]);
 g.quad([x-w/2,y+h/2,back],[x+w/2,y+h/2,back],[x+w/2,y+h/2,front],[x-w/2,y+h/2,front]);
 if(a.type==='vent')g.quad([x-w/2,y-h/2,front],[x+w/2,y-h/2,front],[x+w/2,y-h/2,back],[x-w/2,y-h/2,back]);
 }
 b.mesh('science3-east119-reveal-'+tag,g,0,0,0,1,1,1,'#707776',24);
 if(a.type==='window'){
 box('glass-'+tag,x,y,-depth-.018,w-.11,h-.11,.035,'#4c6872',5);
 for(const s of[-1,1])box('jamb-'+tag+'-'+s,x+s*(w/2-.035),y,-depth+.022,.07,h,.10,red);
 for(const s of[-1,1])box('rail-'+tag+'-'+s,x,y+s*(h/2-.035),-depth+.022,w,.07,.10,red);
 box('mullion-'+tag,x,y,-depth+.035,.055,h-.07,.095,red);box('transom-'+tag,x,y+.38,-depth+.035,w-.07,.055,.095,red);
 box('sill-'+tag,x,y-h/2-.065,-.045,w+.21,.13,.40,stone,24);
 }else{
 box('vent-back-'+tag,x,y,-depth,.50,h-.06,.025,'#515d60',9);
 for(const s of[-1,1])box('vent-side-'+tag+'-'+s,x+s*(w/2-.025),y,-.12,.05,h,.08,stone,24);
 for(const s of[-1,1])box('grille-head-'+tag+'-'+s,x,y+s*(h/2-.025),-.12,w,.05,.08,stone,24);
 // Photograph-fit angular return lattice, not a louver band.
 for(const [k,seg]of [[-.17,-.62,-.17,.34],[-.17,.34,.07,.34],[.07,.34,.07,.70],[.07,.70,.20,.70],[.20,.70,.20,-.34],[.20,-.34,-.05,-.34],[-.05,-.34,-.05,-.70],[-.05,-.70,-.20,-.70]].entries()){const [x0,y0,x1,y1]=seg;box('grille-return-'+tag+'-'+k,x+(x0+x1)/2,y+(y0+y1)/2,-.085,Math.abs(x1-x0)+.027,Math.abs(y1-y0)+.027,.055,stone,24);}
 }
 }
});}finally{b.id=old;}
return{...result,east119:{changed,removedWindows,removedBands,rows:5,mainFloorCount:7,retainedTopBand:[high,top],roofHeightFit:26,topFloorDetailUnresolved:true}};
};Y.Science3East119={center,u,n,length,low,high,top,depth,rows,axes,ventAxes,apertures,registration:'A-B whole east recessed main facade; seven floors and top-row arrangement remain a fitted candidate'};
})(YY);
