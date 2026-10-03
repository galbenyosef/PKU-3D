/* Guanghua west long wing: identity-isolated, historical west vestibule and satellite roof subdivisions. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825567';
const O=[248.252,-311.052],R=Math.atan2(5.274,22.461),CO=Math.cos(R),SI=Math.sin(R),H=16;
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}

const zones=[{name:'north-head',box:[-5,0,29,15],color:'#aaa99b'},{name:'north-middle',box:[-5,15,29,44],color:'#a7b2ac'},{name:'central-service-roof',box:[-5,44,29,59.5],color:'#757f78'},{name:'south-long-west',box:[-5,59.5,14.3,113],color:'#aaa999'},{name:'south-long-east-band',box:[14.3,59.5,29,113],color:'#9caeb0'},{name:'south-end',box:[-5,113,29,131],color:'#a8ada4'}];

// Historically documented west entry. Survey dimensions and 2026 survival are unverified.
const ARC=[[250.814,-296.296],[249.388,-292.443],[249.114,-288.812],[249.712,-285.459],[251.079,-282.383],[252.975,-279.885],[256.331,-277.286]], TOP=6.8, LAND=.84;
const nearArc=p=>ARC.slice(1).some((q,i)=>F.distSegment(p,ARC[i],q)<.38);
const nearChord=p=>F.distSegment(p,ARC[0],ARC[ARC.length-1])<.38;
function upperGeometry(g){return {...g,coordinates:g.coordinates.map(r=>r.filter(p=>!ARC.slice(1,-1).some(a=>Math.hypot(p[0]-a[0],p[1]-a[1])<1e-5)))};}
function entryWalls(g,chordOnly=false){const mesh=new G.Geometry();for(const pg of F.polygons(g))pg.forEach((r,ri)=>{const reverse=(F.area(r)>0)!==(ri>0);for(let i=1;i<r.length;i++){let a=r[i-1],c=r[i];const entry=nearChord([(a[0]+c[0])/2,(a[1]+c[1])/2]);if(entry!==chordOnly)continue;if(reverse)[a,c]=[c,a];mesh.quad([a[0],entry?TOP:.30,a[1]],[c[0],entry?TOP:.30,c[1]],[c[0],H,c[1]],[a[0],H,a[1]]);}});return mesh;}
const railSupports=[];
function lobby(b,add,id){
 railSupports.length=0;
 const glass=new G.Geometry(),metal=new G.Geometry(),stone=new G.Geometry(),floor=new G.Geometry();
 const normals=ARC.slice(1).map((p,i)=>{const a=ARC[i],l=Math.hypot(p[0]-a[0],p[1]-a[1]);return[-(p[1]-a[1])/l,(p[0]-a[0])/l];});
 const offset=(i,d)=>{const a=normals[Math.max(0,i-1)],c=normals[Math.min(normals.length-1,i)],dot=1+a[0]*c[0]+a[1]*c[1];return[ARC[i][0]+d*(a[0]+c[0])/dot,ARC[i][1]+d*(a[1]+c[1])/dot];};
 const q=(g,a,c,lo,hi)=>g.quad([a[0],lo,a[1]],[c[0],lo,c[1]],[c[0],hi,c[1]],[a[0],hi,a[1]]);
 const strip=(g,inner,outer,lo,hi)=>{for(let i=0;i<ARC.length-1;i++){const a=offset(i,inner),c=offset(i+1,inner),d=offset(i+1,outer),e=offset(i,outer);const topStart=g.v.length;g.quad([a[0],hi,a[1]],[c[0],hi,c[1]],[d[0],hi,d[1]],[e[0],hi,e[1]],[0,1,0]);
 // Arc offsets give these upward caps downward winding. Reverse complete
 // vertex tuples so positions, UVs and authored normals stay attached.
 for(let t=topStart;t<g.v.length;t+=24)for(let k=0;k<8;k++){const v=g.v[t+8+k];g.v[t+8+k]=g.v[t+16+k];g.v[t+16+k]=v;}q(g,e,d,lo,hi);if(i===0)q(g,a,e,lo,hi);if(i===ARC.length-2)q(g,d,c,lo,hi);}};
 // Closed risers follow the source arc, with common mitered joints between segments.
 for(let j=0;j<6;j++)strip(stone,0,2.6-j*.34,0,(j+1)*LAND/6);
 strip(stone,-.12,.18,TOP-.34,TOP);strip(metal,-.1,.65,3.52,3.62);
 strip(floor,-1.6,0,0,LAND);
 // The projecting low vestibule has its own roof; the main block begins at
 // the chord joining the source arc ends. Chord depth is photograph-fitted.
 const lens={type:'Polygon',coordinates:[[...ARC,ARC[0]]]};
 stone.v.push(...F.surface(lens,TOP).v);
 for(const i of [1,5]){const posts=[];for(const[d,h]of [[.3,.84],[1.45,.56],[2.5,.14]]){const p=offset(i,d),foot=[p[0],h,p[1]],top=[p[0],h+1.02,p[1]];railSupports.push({foot,top});posts.push(top);b.beam(foot,top,.04,'#aeb6b2',29,65);}for(let k=1;k<posts.length;k++){b.beam(posts[k-1],posts[k],.04,'#aeb6b2',29,65);b.beam(posts[k-1].map((v,j)=>j===1?v-.43:v),posts[k].map((v,j)=>j===1?v-.43:v),.026,'#aeb6b2',29,65);}}

 for(let i=0;i<ARC.length-1;i++){
  const a=ARC[i],c=ARC[i+1],n=normals[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),count=Math.ceil(len/1.25),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len;
  const at=(t,d=0)=>[a[0]+ux*t+n[0]*d,a[1]+uz*t+n[1]*d];
  q(metal,at(0,.045),at(len,.045),LAND,LAND+.06);
  q(metal,at(len-.035,.045),at(len,.045),LAND,TOP-.34);
  for(let k=0;k<count;k++){
   const l=k*len/count,r=(k+1)*len/count,door=(i===1||i===2);
   // Five-millimetre concealed overlaps survive Float32 packing at pane, sill and cap joins; centered frames cover the pane boundaries.
   q(glass,at(l-.005),at(r+.005),LAND-.005,TOP-.335);
   q(metal,at(l-.035,.045),at(l+.035,.045),LAND,TOP-.34);
   for(const h of door?[3.5,5.1]:[1.05,3.5,5.1])q(metal,at(l,.05),at(r,.05),h,h+.065);
   if(door){ // Door leaf pulls, separate from the two-storey curtain wall transom.
    q(metal,at(r-.18,.09),at(r-.13,.09),1.65,2.25);
   }
  }
 }
 for(const [name,g,col,mat]of[['glass',glass,'#71858a',28],['frame',metal,'#b9c1bb',29],['steps-cap',stone,'#b2b3a8',24],['landing',floor,'#a7a99e',24]])add('027-west-lobby-'+name,g,col,mat,id);
 return {arc:ARC,top:TOP,landing:LAND};
}

function render(b,f,add){const id=f.properties.pickId;b.id=id;
 // Height remains an explicitly unverified inherited envelope; no five-storey inference from glass grids.
 const upper=upperGeometry(f.geometry),fallback={...f,geometry:upper,properties:{...f.properties,height:H,floors:5,roofTreatment:'flat',architecture:{...f.properties.architecture,strategy:'footprint',style:'modern'}}};
 const window=b.window,box=b.box;
 b.window=function(x,y,z,...args){if(y<TOP&&nearChord([x,z]))return;return window.call(this,x,y,z,...args);};
 b.box=function(x,y,z,...args){const w=this.world([x,y,z]);if(w[1]<TOP&&nearChord([w[0],w[2]]))return;return box.call(this,x,y,z,...args);};
 try{A.footprint(b,fallback,(key,g,...args)=>{if(key.startsWith('v30-flat-roof-'))return;if(key.startsWith('v30-walls-')){g=entryWalls(upper);add('v30-walls-100-027-west-upper-brick',entryWalls(upper,true),'#565761',27,id);}if(key.startsWith('v30-plinth-'))g=F.walls(f.geometry,.03,.30);add(key,g,...args);},{height:H,floors:5,roof:'flat',style:'modern',key:'027-unverified-facade'});}finally{b.window=window;b.box=box;}
 lobby(b,add,id);
 for(const q of zones){const g=new G.Geometry();for(const p of pieces({...f,geometry:upper},q.box))for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(p=>{const w=world(...p);return[w[0],H+.035,w[1]];}));add('027-roof-'+q.name,g,q.color,24,id);}
 return{strategy:'building027-v46',sourceOutline:true,satelliteRoofZones:6,floors:null,heightVerified:false,facadeVerified:false,genericFacadeRetained:true,westCurvedLobbyHistorical:true,westLobbyCurrentStateVerified:false,placeholderWindowRows:5,secondTower:false,secondMottoStone:false,curvedEastLobbyCopied:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building027={id:ID,render,world,local,pieces,zones,height:H,entryArc:ARC,entryTop:TOP,nearArc,nearChord,upperGeometry,railSupports};
})(YY);
