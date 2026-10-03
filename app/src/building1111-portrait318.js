/* Li Dazhao, photo-led sculptural study. Hidden profile depths remain fitted. */
(function(Y){'use strict';
 const old=Y.Builder.prototype.liDazhao33,G=Y.Geo.Geometry,metal='#68715b';
 function surface(b,key,point,U,V,col=metal,flip=true){
  const geo=b.geo(key,()=>{const g=new G(),eps=.0001;
   const normal=(u,v)=>{const a=point(u+eps,v),c=point(u-eps,v),d=point(u,v+eps),e=point(u,v-eps);const n=Y.M.norm(Y.M.cross(Y.M.sub(a,c),Y.M.sub(d,e)));return flip?n.map(x=>-x):n;};
   for(let j=0;j<V;j++)for(let i=0;i<U;i++){
    const u=i/U,v=j/V,w=(i+1)/U,t=(j+1)/V,A=point(u,v),B=point(w,v),C=point(w,t),D=point(u,t);
    if(flip){g.tri(A,C,B,undefined,[normal(u,v),normal(w,t),normal(w,v)]);g.tri(A,D,C,undefined,[normal(u,v),normal(u,t),normal(w,t)]);}else{g.tri(A,B,C,undefined,[normal(u,v),normal(w,v),normal(w,t)]);g.tri(A,C,D,undefined,[normal(u,v),normal(w,t),normal(u,t)]);}
   }return g;});b.mesh(key,geo,0,1.9,0,1,1,1,col,37);
 }
 const ga=(x,y,cx,cy,sx,sy)=>Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2));
 const rows=[[.49,.125,.108,-.010],[.55,.126,.108,-.008],[.585,.09,.10,-.008],[.63,.112,.102,.006],[.69,.167,.134,.005],[.77,.202,.160,0],[.87,.208,.178,-.005],[.96,.207,.174,-.012],[1.055,.226,.175,-.018],[1.13,.215,.166,-.02],[1.19,.159,.12,-.024],[1.22,.018,.014,-.028]];
 function ring(y){let i=0;while(i<rows.length-2&&rows[i+1][0]<y)i++;const a=rows[i],b=rows[i+1],t=Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0]))),pre=rows[Math.max(0,i-1)],post=rows[Math.min(rows.length-1,i+2)],span=b[0]-a[0];return a.slice(1).map((v,k)=>{const m=(b[k+1]-pre[k+1])/(b[0]-pre[0])*span,n=(post[k+1]-a[k+1])/(post[0]-a[0])*span;return (2*t*t*t-3*t*t+1)*v+(t*t*t-2*t*t+t)*m+(-2*t*t*t+3*t*t)*b[k+1]+(t*t*t-t*t)*n;});}
 function face(x,y,chin=false){const r=ring(y),z=r[2]+r[1]*Math.sqrt(Math.max(0,1-(x/r[0])**2));
  let d=.032*ga(x,y,0,.924,.041,.060)+.053*ga(x,y,0,.865,.049,.033);
  for(const s of[-1,1]){
   d-=.025*ga(x,y,s*.089,.974,.055,.035); // deep-set eye sockets
   d+=.022*ga(x,y,s*.087,1.016,.062,.023); // broad arched brows
   d+=.017*ga(x,y,s*.130,.895,.060,.042); // cheek planes
   d+=.033*ga(x,y,s*.041,.851,.028,.022); // nasal wings
   d-=.010*ga(x,y,s*.066,.814,.018,.045); // nasolabial fold
  }
  d+=.015*ga(x,y,0,.769,.075,.025)-.008*ga(x,y,0,.782,.068,.005);
  // The short chin beard is part of the cast facial surface, fading to the skin at every edge.
  // No disconnected shell and no invented repeating engraved ribs.
  if(chin&&y>.625&&y<.806){const v=(y-.625)/.181,w=.060+.095*Math.sin(v*Math.PI*.75),t=x/w;if(Math.abs(t)<1)d+=.004*Math.sin(Math.PI*v)**2*(1-t*t)**2;}
  return z+d;
 }
 function strip(b,key,points,width,depth,col=metal){
  const sample=t=>{const q=Math.max(0,Math.min(points.length-1-.00001,t*(points.length-1))),i=Math.floor(q),f=q-i;return points[i].map((v,k)=>v+(points[i+1][k]-v)*f);};
  surface(b,key,(u,v)=>{const p=sample(u),a=sample(Math.max(0,u-.001)),c=sample(Math.min(1,u+.001)),dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy)||1,theta=2*Math.PI*v,r=width*Math.pow(Math.sin(Math.PI*Math.max(.015,Math.min(.985,u))),.65);return[p[0]-dy/l*r*Math.cos(theta),p[1]+dx/l*r*Math.cos(theta),p[2]+depth*Math.sin(theta)];},48,10,col);
 }
 Y.Builder.prototype.liDazhao33=function(){
  // Keep the existing pedestal and lettering bit-for-bit; replace only the old bust local call.
  const local=this.local,own=Object.prototype.hasOwnProperty.call(this,'local');this.local=function(x,y,z,r,fn){if(x===0&&y===1.9&&z===0&&r===0)return;return local.apply(this,arguments);};
  try{old.call(this);}finally{if(own)this.local=local;else delete this.local;}
  surface(this,'li318-portrait-continuous',(u,v)=>{const y=.49+v*.73,a=u*Math.PI*2,r=ring(y),x=r[0]*Math.cos(a);return[x,y,Math.sin(a)>0?face(x,y,true):r[2]+r[1]*Math.sin(a)];},128,112);
  // Original cast has flattened rounded shoulders and a high buttonless stand collar.
  const body=[[0,.59,.205],[.08,.61,.215],[.18,.590,.232],[.28,.520,.243],[.36,.415,.225],[.44,.26,.175],[.49,.17,.142]];
  surface(this,'li318-coat',(u,v)=>{const y=v*.49;let i=0;while(i<body.length-2&&body[i+1][0]<y)i++;const p=body[i],q=body[i+1],t=(y-p[0])/(q[0]-p[0]),pre=body[Math.max(0,i-1)],post=body[Math.min(body.length-1,i+2)],interp=k=>{const m=(q[k]-pre[k])/(q[0]-pre[0])*(q[0]-p[0]),n=(post[k]-p[k])/(post[0]-p[0])*(q[0]-p[0]);return(2*t**3-3*t*t+1)*p[k]+(t**3-2*t*t+t)*m+(-2*t**3+3*t*t)*q[k]+(t**3-t*t)*n;},rx=interp(1),rz=interp(2),a=u*Math.PI*2,x=Math.cos(a)*rx;let z=Math.sin(a)*rz;
   if(z>0){const ax=Math.abs(x),folds=[.235,.345,.46,.53];for(let k=0;k<folds.length;k++){const axis=folds[k]+(.30-y)*(.09+k*.10);z+=(.012+k*.002)*Math.exp(-(((ax-axis)/(.014+k*.002))**2))*(.5+.5*Math.sin(Math.min(1,y/.37)*Math.PI));z-=.005*Math.exp(-(((ax-axis-.022)/.012)**2));}z+=.012*ga(x,y,-.09,.30,.07,.16)-.005*ga(x,y,0,.22,.015,.22);}
   return[x,y,z];},100,40);
  // Separate cast-metal eyelid rims follow the recessed sockets rather than painted eye bars.
  for(const s of[-1,1]){
   // Open cast eyeball and broad eyelid tissue, without doubled outline tubes.
   const eyelid=(u,upper)=>{const m=Math.sin(Math.PI*u);return .971+(upper?.029:-.017)*m-.003*u;};
   surface(this,'li318-eye-volume-'+s,(u,v)=>{const x=s*(.039+.103*u),m=Math.sin(Math.PI*u),lo=eyelid(u,false),hi=eyelid(u,true),y=lo+(hi-lo)*v;return[x,y,face(x,y)+.003+.020*m*Math.sin(Math.PI*v)];},32,14,metal,s<0);
   for(const upper of[true,false])surface(this,'li318-lid-'+s+'-'+upper,(u,v)=>{const x=s*(.039+.103*u),m=Math.sin(Math.PI*u),edge=eyelid(u,upper),y=edge+(upper?1:-1)*v*(upper?.018:.011)*m;return[x,y,face(x,y)+(.004+.006*Math.sin(Math.PI*v))*m*(1-v)];},40,8,metal,upper?s<0:s>0);
   const brow=[];for(let i=0;i<=20;i++){const t=i/20,x=s*(.026+.139*t),y=1.006+.012*Math.sin(Math.PI*t)-.010*t;brow.push([x,y,face(x,y)+.001]);}strip(this,'li318-brow-'+s,brow,.007,.002,'#5c6752');
   // Ears are concave auricles with a rolled helix, not whole oval lumps.
   surface(this,'li318-ear-'+s,(u,v)=>{const a=u*Math.PI*2,r=v,cy=.916,x=s*(.208+.032*r*Math.cos(a)),y=cy+.060*r*Math.sin(a),z=-.007+.029*r*r+.007*Math.sin(a);return[x,y,z];},40,16,metal,s>0);
   const ear=[];for(let i=0;i<=35;i++){const a=i/35*Math.PI*2;ear.push([s*(.208+.032*Math.cos(a)),.916+.060*Math.sin(a),.029+.007*Math.sin(a)]);}strip(this,'li318-helix-'+s,ear,.005,.004);
   surface(this,'li318-moustache-'+s,(u,v)=>{const x=s*(.005+.145*u),centre=.832-.068*u+.027*u**6,taper=Math.pow(Math.max(0,Math.sin(Math.PI*u)),.65),y=centre+(v-.5)*.040*taper;return[x,y,face(x,y)+.0015+.006*Math.sin(Math.PI*v)*taper];},56,20,'#46543e',s<0);
  }
  // Photograph shows a split collar with a gently rolled upper seam and a lower welt.
  for(const side of[-1,1]){
   surface(this,'li318-collar-leaf-'+side,(u,v)=>{const a=Math.PI/2+side*(.035+u*(Math.PI-.035)),fr=Math.max(0,Math.sin(a)),bottom=.476+.012*fr,top=.648-.041*fr+.010*Math.cos(a),y=bottom+(top-bottom)*v,rx=.151+.009*(1-v),rz=.129+.011*(1-v);return[rx*Math.cos(a),y,rz*Math.sin(a)+.004*Math.sin(Math.PI*v)];},60,22,metal,side<0);
   for(const upper of[true,false]){const pts=[];for(let i=0;i<=45;i++){const a=Math.PI/2+side*(.035+i/45*(Math.PI-.035)),fr=Math.max(0,Math.sin(a));pts.push([(upper?.151:.160)*Math.cos(a),upper?.648-.041*fr+.010*Math.cos(a):.476+.012*fr,(upper?.129:.140)*Math.sin(a)]);}strip(this,'li318-collar-welt-'+side+'-'+upper,pts,upper?.007:.006,.004);}
  }
  // Short swept hair cap: the receding, asymmetric front edge is cut into the cap mesh.
  surface(this,'li318-swept-hair',(u,v)=>{const a=2*Math.PI*u,front=Math.max(0,Math.sin(a)),edge=.99+.183*Math.min(1,front/.60)-.009*Math.cos(a)*front,y=edge+(1.222-edge)*v,r=ring(Math.min(1.22,y)),wave=.002*Math.sin(32*a-12*v)*Math.sin(Math.PI*v);return[(r[0]+.006+wave)*Math.cos(a),y,(r[1]+.005+wave)*Math.sin(a)+r[2]];},112,36,'#526149');
 };
 // Suppress only the superseded collar when the existing 1111 wrapper adds it.
 const render=Y.Heritage31.render;
 Y.Heritage31.render=function(b,f){if(f.properties.pickId!==1111)return render.call(this,b,f);const mesh=b.mesh,own=Object.prototype.hasOwnProperty.call(b,'mesh');b.mesh=function(key){if(key==='li1111-standing-collar')return;return mesh.apply(this,arguments);};try{return render.call(this,b,f);}finally{if(own)b.mesh=mesh;else delete b.mesh;}};
})(YY);
