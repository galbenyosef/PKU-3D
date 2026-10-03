/* Same June 2026 east-door photograph as entry8, re-read at native resolution.
 * Rectified upper-band divisions .186/.500/.815 support wider fixed sidelights.
 * Four red leaf frames/handles and broad leaf heads are visible; bottom frame
 * remains the previous .09m fit because people obscure it. No new doorway.
 * https://sess.pku.edu.cn/info/1033/31531.htm */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo;
const S={width:5.6,leafWidth:.88,leafOuter:1.76,bottom:.36,split:3.12,top:4.16,headWidth:.13,stileWidth:.055,red:'#582a29',glass:'#506a70',registration:'existing east middle portal; photo-plane proportion fit'};
const removed=k=>k==='science3-entry8-middle-glass'||/^science3-entry8-middle-(door-vertical-|upper-vertical-|handle-)/.test(k);
A.render=function(b,f,add){if(f.properties.pickId!==8||f.properties.id!=='relation/11975585')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.hasOwn(b.e,'add');let result;
b.e.add=function(k,...args){if(removed(k))return;return emit.call(this,k,...args);};try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
const old=b.id;b.id=8;try{const E=Y.Science3Entry8;b.local(E.center[0],0,E.center[1],Math.atan2(E.n[0],E.n[1]),()=>{
 const box=(tag,x,y,z,w,h,d,c=S.red,mat=29)=>b.mesh('science3-door166-'+tag,b.geo('science3-door166-unit',G.box),x,y,z,w,h,d,c,mat);
 // Fitted pane rebate intersects every red frame in depth, with 1mm edge insertion.
 const pane=(tag,a,c,lo,hi)=>box(tag,(a+c)/2,(lo+hi)/2,-.02,c-a+.002,hi-lo+.002,.035,S.glass,5);
 // The retained outer jambs/head/sill and full-width transom own the perimeter.
 const low=S.bottom+.045,high=S.split-.045;
 for(const x of[-S.leafOuter,S.leafOuter])box('fixed-divider',x,(S.bottom+S.top)/2,.005,.085,S.top-S.bottom,.12);
 box('upper-center',0,(S.split+S.top)/2,.005,.085,S.top-S.split,.12);
 const upper=[-2.69,-1.76,0,1.76,2.69];for(let i=0;i<4;i++)pane('upper-glass',upper[i]+(i?.0425:0),upper[i+1]-(i<3?.0425:0),S.split+.045,S.top-.045);
 pane('fixed-glass',-2.69,-1.8025,low,high);pane('fixed-glass',1.8025,2.69,low,high);
 for(let i=0;i<4;i++){const a=-S.leafOuter+i*S.leafWidth,c=a+S.leafWidth,lo=low+.045,hi=high-S.headWidth;
  for(const x of[a+S.stileWidth/2,c-S.stileWidth/2])box('leaf-stile',x,(low+high)/2,.025,S.stileWidth,high-low,.14);
  box('leaf-head',(a+c)/2,high-S.headWidth/2,.025,S.leafWidth-2*S.stileWidth,S.headWidth,.14);
  box('leaf-bottom',(a+c)/2,low+.0225,.025,S.leafWidth-2*S.stileWidth,.045,.14);
  pane('leaf-glass',a+S.stileWidth,c-S.stileWidth,lo,hi);
 }
 // Rod bodies are dark red in the native photo; pale fixing points do not
 // justify the old entirely silver handles. Vertical position remains old fit.
 for(const x of[-.968,-.792,.792,.968]){box('handle',x,1.63,.12,.026,.52,.04);for(const y of[1.43,1.83])box('handle-fixing',x,y,.045,.018,.026,.11,'#9d9f93');}
 });}finally{b.id=old;}return result;};Y.Science3Door166={...S,removed};
})(YY);
