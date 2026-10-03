/* Registered south three-window porch. Dimensions/hidden northern roof fitted. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/1086578219';
const fit={eave:4.65,rise:2.85,span:10.2,recess:.65,sill:1.10,windowTop:3.92,columnRadius:.18};
function render(b,f,add){const id=414,ring=f.geometry.coordinates[0],NW=ring[0],SW=ring[1],SE=ring[2],NE=ring[3],length=Math.hypot(SE[0]-SW[0],SE[1]-SW[1]),u=[(SE[0]-SW[0])/length,(SE[1]-SW[1])/length],n=[-u[1],u[0]],mid=[(SW[0]+SE[0])/2,(SW[1]+SE[1])/2],depth=(mid[0]-(NW[0]+NE[0])/2)*n[0]+(mid[1]-(NW[1]+NE[1])/2)*n[1],oldId=b.id,emit=b.e.add;let tag='detail';b.id=id;
const xyz=(x,y,z)=>[mid[0]+u[0]*x+n[0]*z,y,mid[1]+u[1]*x+n[1]*z],profile=p=>{const z=(p[0]-mid[0])*n[0]+(p[1]-mid[1])*n[1],t=Math.max(0,1-Math.abs(z+depth/2)/(depth/2));return fit.eave+fit.rise*Math.sin(Math.PI/2*Math.pow(t,1.3));};
function clean(g){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const p=[0,8,16].map(k=>g.v.slice(i+k,i+k+3).map(Math.fround));if(Math.hypot(...Y.M.cross(Y.M.sub(p[1],p[0]),Y.M.sub(p[2],p[0])))>1e-10)out.v.push(...g.v.slice(i,i+24));}return out;}
const mesh=(key,g,c,mat)=>add('414-porch110-'+key,clean(g),c,mat,id),quad=(g,ps,want)=>{if(Y.M.dot(Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0])),want)<0)ps.reverse();g.quad(...ps);};
const roof=new G.Geometry(),ends=new G.Geometry(),walls=new G.Geometry(),sx=64,sz=84;
const at=(a,c,t)=>[a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t],point=(s,t)=>at(at(SW,SE,s),at(NW,NE,s),t),roofPoint=(s,t)=>{const p=point(s,t);return[p[0],profile(p),p[1]];};
for(let i=0;i<sx;i++)for(let j=0;j<sz;j++)quad(roof,[roofPoint(i/sx,j/sz),roofPoint((i+1)/sx,j/sz),roofPoint((i+1)/sx,(j+1)/sz),roofPoint(i/sx,(j+1)/sz)],[0,1,0]);
for(const side of[0,1])for(let j=0;j<sz;j++){const a=roofPoint(side,j/sz),c=roofPoint(side,(j+1)/sz),out=[u[0]*(side?1:-1),0,u[1]*(side?1:-1)];quad(ends,[[a[0],fit.eave,a[2]],[c[0],fit.eave,c[2]],c,a],out);}
// Three other perimeter walls remain conservative; the south front is rebuilt.
for(const [a,c,out]of[[NW,SW,[-u[0],0,-u[1]]],[SE,NE,[u[0],0,u[1]]],[NE,NW,[-n[0],0,-n[1]]]])quad(walls,[[a[0],.55,a[1]],[c[0],.55,c[1]],[c[0],fit.eave,c[1]],[a[0],fit.eave,a[1]]],out);
mesh('roof',roof,'#70766d',19);mesh('gable-ends',ends,'#9a9d91',18);mesh('other-walls',walls,'#969b91',18);mesh('plinth',F.walls(f.geometry,0,.55),'#989e92',10);
const south=new G.Geometry(),returns=new G.Geometry(),ceiling=new G.Geometry(),floor=new G.Geometry(),back=-fit.recess,half=fit.span/2,sill=fit.sill,top=fit.windowTop;
const panel=(a,c,lo,hi,z=back)=>quad(south,[xyz(a,lo,z),xyz(c,lo,z),xyz(c,hi,z),xyz(a,hi,z)],[n[0],0,n[1]]);
panel(-length/2,-half,.55,fit.eave,0);panel(half,length/2,.55,fit.eave,0);panel(-half,half,.55,sill);panel(-half,half,top,4.32);
for(const x of[-half,half])quad(returns,[xyz(x,.55,0),xyz(x,.55,back),xyz(x,4.32,back),xyz(x,4.32,0)],[u[0]*(x<0?1:-1),0,u[1]*(x<0?1:-1)]);
quad(ceiling,[xyz(-half,4.32,back),xyz(half,4.32,back),xyz(half,4.32,-.17),xyz(-half,4.32,-.17)],[0,-1,0]);quad(floor,[xyz(-half,.55,back),xyz(half,.55,back),xyz(half,.55,.05),xyz(-half,.55,.05)],[0,1,0]);
mesh('porch-returns',returns,'#969b91',18);mesh('porch-ceiling',ceiling,'#715244',6);mesh('porch-floor',floor,'#989e92',10);
b.e.add=function(k,g,...args){return emit.call(this,'414-porch110-'+tag+'-'+k,clean(g),...args)};
try{
 // Gable trims use the exact same sample points as the roof boundary.
 tag='gable-trim';for(const side of[0,1])for(let j=0;j<sz;j++)b.beam(roofPoint(side,j/sz),roofPoint(side,(j+1)/sz),.06,'#bbc0b3',10);
 tag='rear-eave';b.beam([NW[0],4.53,NW[1]],[NE[0],4.53,NE[1]],.20,'#565e53',10);b.beam([NW[0],4.27,NW[1]],[NE[0],4.27,NE[1]],.16,'#744837',6);
 // Keep unseen side-window rhythm as an explicitly unverified approximation.
 tag='side-window';for(const [a,c,out]of[[NW,SW,[-u[0],-u[1]]],[SE,NE,[u[0],u[1]]]]){const len=Math.hypot(c[0]-a[0],c[1]-a[1]);for(let t=2;t<len-1;t+=3.4)b.v9Lattice(a[0]+(c[0]-a[0])*t/len+out[0]*.09,2.5,a[1]+(c[1]-a[1])*t/len+out[1]*.09,2.1,2.6,Math.atan2(out[0],out[1]),false);}
 b.local(mid[0],0,mid[1],Math.atan2(n[0],n[1]),()=>{
 tag='front-eave';b.box(0,4.47,.02,length+.10,.30,.38,'#723c2f',6);b.box(0,4.64,.04,length+.16,.10,.42,'#626b61',19);b.box(0,4.28,.025,fit.span,.08,.38,'#685044',6);
 for(let x=-length/2+.16;x<length/2-.10;x+=.24){b.box(x,4.58,.14,.065,.07,.38,'#a29263',6);b.sphere(x,4.66,.24,.07,.065,.075,'#7a8178',19,.9,true);}
 tag='column';for(const x of[-half,-half+3.4,-half+6.8,half]){b.cyl(x,.55,0,fit.columnRadius,3.77,'#883c30',24,1,6);b.cyl(x,.55,0,.23,.15,'#a4a89b',24,1,10);}
 const red='#883c30',bar=(x,y,w,h)=>b.box(x,y,back+.055,w,h,.075,red,6);
 for(let bay=0;bay<3;bay++){
 const a=-half+bay*3.4+.12,c=a+3.16;tag='window-'+bay;
 // Narrow wall piers between apertures; glazing is separate from woodwork.
 panel(a-.12,a,sill,top);panel(c,c+.12,sill,top);
 const pane=new G.Geometry();quad(pane,[xyz(a,sill,back-.04),xyz(c,sill,back-.04),xyz(c,top,back-.04),xyz(a,top,back-.04)],[n[0],0,n[1]]);emit.call(b.e,'414-porch110-glass-'+bay,pane,Y.M.identity(), '#425650',[28,id,0,0]);
 for(const x of[a,c])bar(x,(sill+top)/2,.085,top-sill+.08);for(const y of[sill,3.18,top])bar((a+c)/2,y,c-a,.085);
 // Four leaves per bay. Both public photographs show paired folded returns,
 // a continuous center upright, and two stacked modules in each tall leaf.
 const cell=(c-a)/4;for(let k=0;k<4;k++){const x=a+cell*k,xx=x+cell;if(k)bar(x,(sill+top)/2,.075,top-sill);
 const motif=(lo,hi)=>{const L=x+.055,R=xx-.055,W=R-L,H=hi-lo,t=.035;
 const h=(p,q,v)=>bar(L+(p+q)*W/2,lo+v*H,(q-p)*W,t),v=(p,q,r)=>bar(L+p*W,lo+(q+r)*H/2,t,(r-q)*H);
 // Five uprights form narrow central and side lights; short returns are
 // staggered instead of spanning the leaf as an ordinary rectangular grid.
 for(const p of[.16,.50,.84])v(p,0,1);
 for(const p of[.31,.69])v(p,.17,.83);
 for(const y of[.17,.83])h(.16,.84,y);
 for(const y of[.33,.67]){h(0,.16,y);h(.84,1,y);}
 h(.16,.31,.50);h(.69,.84,.50);
 };
 const lowerLo=sill+.055,lowerHi=3.18-.055,center=(lowerLo+lowerHi)/2;
 motif(lowerLo,center-.04);motif(center+.04,lowerHi);
 bar((x+xx)/2,center,cell-.11,.035);
 motif(3.18+.055,top-.055);
 }
 }
 });
}finally{b.e.add=emit;b.id=oldId;}
mesh('south-brick',south,'#969b91',18);
return{strategy:'zhanggui414-south-porch110',sourceOutline:true,southFacadeRegistered:true,entranceVerified:false,northernRoofVerified:false,dimensionsMeasured:false,fit:{...fit,width:length,depth,roofSamples:[sx,sz]},limits:'South three-window porch; hidden roof, side windows and dimensions fitted. No new entrance or steps.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Zhanggui414Porch110={id:ID,fit};
})(YY);
