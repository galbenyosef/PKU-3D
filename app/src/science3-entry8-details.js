/* East entrance only: June 2026 built doorway, registered by the September
 * 2022 east-facade composition and mapped southeast projection. All dimensions
 * are photograph fits. The inherited five-storey body/unknown roof is NOT a
 * completed reconstruction of the seven-storey renovated main building. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='relation/11975585';
const center=[408.5635,172.442],u=[-.044309183925647574,-.9990178658161439],n=[.9990178658161439,-.044309183925647574],lo=.36,hi=4.16;
const portals=[{key:'south',x:-5.9,width:2.8},{key:'middle',x:0,width:5.6},{key:'north',x:5.9,width:2.8}];
const local=p=>[(p[0]-center[0])*u[0]+(p[2]-center[1])*u[1],p[1],(p[0]-center[0])*n[0]+(p[2]-center[1])*n[1]];
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],s=fn(p),t=fn(q);if(s>=0)out.push(p);if((s>=0)!==(t>=0)){const k=s/(s-t);out.push(p.map((v,j)=>v+(q[j]-v)*k));}}return out;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const emit=b.e.add,window=b.window;let serial=0,cutRecords=0,removedWindows=0;
 b.window=function(x,y,z,w,h,r,...args){const p=local([x,y,z]);if(Math.abs(p[2])<.3&&Math.abs(p[0])<8.7+w/2&&y-h/2<5.05&&y+h/2>lo){removedWindows++;return;}return window.call(this,x,y,z,w,h,r,...args);};
 b.e.add=function(key,g,m,c,p,uv){if(p[1]!==8)return emit.call(this,key,g,m,c,p,uv);let current=g,changedAny=false;for(const e of portals){const world=v=>local(M.apply(m,[v[0],v[1],v[2],1])),out=new G.Geometry();let changed=false;
 for(let i=0;i<current.v.length;i+=24){const tri=[0,8,16].map(k=>current.v.slice(i+k,i+k+8)),ps=tri.map(world);if(ps.some(v=>Math.abs(v[2])>.55)||Math.min(...ps.map(v=>v[0]))>=e.x+e.width/2||Math.max(...ps.map(v=>v[0]))<=e.x-e.width/2||Math.min(...ps.map(v=>v[1]))>=hi||Math.max(...ps.map(v=>v[1]))<=lo){out.v.push(...tri.flat());continue;}
 const x=v=>world(v)[0]-e.x,y=v=>world(v)[1];let remain=tri,parts=[];for(const fn of[v=>-e.width/2-x(v),v=>x(v)-e.width/2,v=>lo-y(v),v=>y(v)-hi]){parts.push(clip(remain,fn));remain=clip(remain,v=>-fn(v));if(!remain.length)break;}if(remain.length>=3)changed=true;
 for(const poly of parts)for(let j=1;j<poly.length-1;j++){const vs=[poly[0],poly[j],poly[j+1]],pa=vs.map(v=>v.slice(0,3));if(Math.hypot(...M.cross(M.sub(pa[1],pa[0]),M.sub(pa[2],pa[0])))>1e-10)out.v.push(...vs.flat());}
 }if(changed){current=out;changedAny=true;}}
 if(!changedAny)return emit.call(this,key,g,m,c,p,uv);cutRecords++;if(current.v.length)return emit.call(this,'science3-entry8-cut-'+serial+++'-'+key,current,m,c,p,uv);
 };let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=emit;b.window=window;}
 const old=b.id;b.id=8;try{b.local(center[0],0,center[1],Math.atan2(n[0],n[1]),()=>{
 const box=(key,x,y,z,w,h,d,color='#c9c7be',mat=24)=>b.mesh('science3-entry8-'+key,b.geo('science3-entry8-box',G.box),x,y,z,w,h,d,color,mat);
 // Original upper wall/roof untouched. Photographed stone entrance replaces
 // only its ground-floor bays, with closed reveals and a roofed shallow recess.
 box('landing',0,.18,1.4,17.3,.36,2.8);box('step',0,.12,3.0,17.3,.24,.4);box('apron',0,.06,3.6,17.3,.12,.8,'#aaa9a1',10);
 box('canopy',0,4.825,1.03,17.3,.45,3.96);box('back-head',0,4.395,-.13,17.3,.47,.42);
 for(const [j,x]of[-8.1,-3.7,3.7,8.1].entries()){
 box('front-pier-'+j,x,2.48,2.05,1.05,4.24,1.05);
 box('pier-foot-'+j,x,.54,2.05,1.14,.36,1.14);
 box('pier-band-'+j,x,1.42,2.05,1.14,.14,1.14);
 }
 // Stone facade strips are separate from open door apertures.
 const spans=[[-8.65,-7.3],[-4.5,-2.8],[2.8,4.5],[7.3,8.65]];
 spans.forEach(([a,z],j)=>box('back-stone-'+j,(a+z)/2,2.26,-.13,z-a,3.8,.42));
 for(const e of portals){const W=e.width,x=e.x;
 box(e.key+'-floor',x,.18,-1.08,W,.36,2.16);box(e.key+'-ceiling',x,4.255,-1.08,W+.24,.19,2.16);
 for(const sign of[-1,1])box(e.key+'-reveal-'+sign,x+sign*(W/2+.09),2.26,-1.08,.18,3.8,2.16);
 // Recess back wall is a bounded neutral interior, not invented onward rooms.
 box(e.key+'-interior-back',x,2.26,-2.2,W+.36,3.8,.16,'#a5a59d');
 const red='#582a29',glass='#506a70',bottom=lo,split=3.12,top=hi;
 box(e.key+'-glass',x,(bottom+top)/2,-.08,W-.12,top-bottom-.12,.035,glass,5);
 for(const sign of[-1,1])box(e.key+'-jamb-'+sign,x+sign*(W/2-.055),(bottom+top)/2,.005,.11,top-bottom,.12,red,29);
 for(const [tag,y]of[['sill',bottom+.045],['transom',split],['head',top-.045]])box(e.key+'-'+tag,x,y,.015,W,.09,.14,red,29);
 if(e.key==='middle'){
 const cuts=[-2,-1,0,1,2];cuts.forEach((dx,j)=>box(e.key+'-door-vertical-'+j,x+dx,(bottom+split)/2,.025,.085,split-bottom,.14,red,29));
 for(const dx of[-2,0,2])box(e.key+'-upper-vertical-'+dx,x+dx,(split+top)/2,.005,.085,top-split,.12,red,29);
 for(const dx of[-1.1,-.9,.9,1.1])box(e.key+'-handle-'+dx,x+dx,1.63,.12,.026,.52,.04,'#c5c3b5',29);
 }else{
 // Lateral bay is partly visible in June. Repeat only the registered portal
 // envelope and mullion division; door operation/handle hardware unverified.
 box(e.key+'-vertical',x,(bottom+top)/2,.005,.085,top-bottom,.12,red,29);
 }
 }
 });}finally{b.id=old;}
 return{...result,detail:'science3-east-entry-local-fit',cutRecords,removedWindows,wholeBuildingComplete:false,upperFloorsUnresolved:true};
};Y.Science3Entry8={center,u,n,lo,hi,portals,registration:'2026 built doorway with 2022 facade/map topology; position and dimensions fitted',wholeBuildingComplete:false};})(YY);
