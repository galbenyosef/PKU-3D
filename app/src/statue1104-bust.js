/* Cai Yuanpei: photo-modelled likeness of Zeng Zhushao's 1982 bust.
 * References: Commons File:Cai Yuanpei statue (Charlie fong, 2009, PD-user);
 * PKU History Museum /details/1893.html (2024-10-21),
 * PKU News English /news_events/news/campus/1462.html, and VOA 2015 photo.
 * Continuous sculpted face, separate ear cartilage, parted short hair and
 * mandarin-collar robe; not a survey or a photogrammetric reconstruction.
 * The official image shows no spectacles. Unseen rear folds are conservative.
 */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.statue,G=Y.Geo;
P.statue=function(...args){if(this.id!==1104)return previous.apply(this,args);
 this.box(0,1.2,0,2.7,2.4,2.4,'#bcbeba',10);
 const key='cai1104-sculpted-portrait318r11',g=this.geo(key,()=>{
 const q=new G.Geometry(),pi=Math.PI;
 const norm=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n)},sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const gauss=(x,y,cx,cy,sx,sy)=>Math.exp(-(((x-cx)/sx)**2)-(((y-cy)/sy)**2));
 // Monotone Hermite section interpolation: jaw and occiput have independent profiles.
 const profile=rows=>{
  const slopes=[1,2,3].map(k=>rows.map((r,i)=>{if(!i)return(rows[1][k]-r[k])/(rows[1][0]-r[0]);if(i===rows.length-1)return(r[k]-rows[i-1][k])/(r[0]-rows[i-1][0]);let a=(r[k]-rows[i-1][k])/(r[0]-rows[i-1][0]),b=(rows[i+1][k]-r[k])/(rows[i+1][0]-r[0]);return a*b<=0?0:2*a*b/(a+b)}));
  return y=>{let i=0;while(i<rows.length-2&&rows[i+1][0]<y)i++;const a=rows[i],b=rows[i+1],h=b[0]-a[0],t=Math.max(0,Math.min(1,(y-a[0])/h));return[1,2,3].map((k,j)=>(2*t*t*t-3*t*t+1)*a[k]+(t*t*t-2*t*t+t)*h*slopes[j][i]+(-2*t*t*t+3*t*t)*b[k]+(t*t*t-t*t)*h*slopes[j][i+1])};
 };
 const surface=(f,nu,nv,flip=false)=>{const sample=(u,v)=>{const p=f(u,v),du=sub(f(u+1e-5,v),f(u-1e-5,v)),dv=sub(f(u,v+1e-5),f(u,v-1e-5));let nc=cross(du,dv);if(Math.hypot(...nc)<1e-14){const vv=v+.0001,uu=Math.max(.0001,Math.min(.9999,u));nc=cross(sub(f(uu+1e-5,vv),f(uu-1e-5,vv)),sub(f(uu,vv+1e-5),f(uu,vv-1e-5)))}let n=norm(nc);if(flip)n=n.map(x=>-x);return{p,n}},tri=(a,b,c)=>{if(Math.hypot(...cross(sub(b.p,a.p),sub(c.p,a.p)))>1e-12)q.tri(a.p,b.p,c.p,undefined,[a.n,b.n,c.n])};let a=Array.from({length:nu+1},(_,i)=>sample(i/nu,0));for(let j=0;j<nv;j++){let b=Array.from({length:nu+1},(_,i)=>sample(i/nu,(j+1)/nv));for(let i=0;i<nu;i++){if(flip){tri(a[i],b[i],b[i+1]);tri(a[i],b[i+1],a[i+1])}else{tri(a[i],a[i+1],b[i+1]);tri(a[i],b[i+1],b[i])}}a=b}};
 const tube=(points,r,segments=7)=>{for(let j=0;j<points.length-1;j++){const axis=norm(sub(points[j+1],points[j])),a=norm(cross(axis,Math.abs(axis[1])<.95?[0,1,0]:[1,0,0])),b=cross(axis,a);for(let k=0;k<segments;k++){let at=(p,t)=>{let n=a.map((v,i)=>v*Math.cos(t)+b[i]*Math.sin(t));return{p:p.map((v,i)=>v+r*n[i]),n}},A=at(points[j],k*2*pi/segments),B=at(points[j],(k+1)*2*pi/segments),C=at(points[j+1],(k+1)*2*pi/segments),D=at(points[j+1],k*2*pi/segments);q.tri(A.p,B.p,C.p,undefined,[A.n,B.n,C.n]);q.tri(A.p,C.p,D.p,undefined,[A.n,C.n,D.n])}}};
 const head=profile([[3.36,.18,.16,-.17],[3.51,.167,.135,-.19],[3.61,.159,.115,-.22],[3.690,.182,.151,-.242],[3.725,.215,.229,-.253],[3.775,.240,.243,-.278],[3.84,.269,.243,-.30],[3.96,.327,.274,-.32],[4.04,.330,.283,-.333],[4.12,.322,.281,-.343],[4.20,.325,.276,-.342],[4.28,.329,.258,-.335],[4.36,.304,.227,-.311],[4.40,.283,.205,-.291],[4.44,.250,.177,-.270],[4.48,.204,.135,-.242],[4.525,.109,.05,-.15],[4.54,.003,-.035,-.041]]);
 // Eye corners are not an ellipse: heavy inner lid, sloping outer hood and a narrow outer canthus.
 const eyeBounds=(side,u)=>{const t=Math.max(0,Math.min(1,u)),w=4*t*(1-t),x=side*(.077+.135*t),base=4.122-.002*t+(side===1?.003:0);return[x,base-(side===1?.013:.016)*w,base+(side===1?.025:.027)*w*(1-.22*t)];};
 const browLine=profile([[.025,4.163,0,0],[.080,4.178,0,0],[.137,4.181,0,0],[.216,4.174,0,0],[.300,4.153,0,0]]);
 const nose=profile([[3.867,.028,0,0],[3.912,.030,.006,0],[3.942,.031,.028,0],[3.979,.042,.036,0],[4.066,.040,.022,0],[4.17,.028,.012,0],[4.22,.026,0,0],[4.24,.026,0,0]]);
 // Compact polygonal face-plane masks, with a rounded transition at the cast edges.
 const region=(x,y,pts)=>{const distances=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],dx=b[0]-a[0],dy=b[1]-a[1];distances.push((dx*(y-a[1])-dy*(x-a[0]))/Math.hypot(dx,dy));}const m=Math.min(...distances),k=.012,d=m-k*Math.log(distances.reduce((sum,v)=>sum+Math.exp(-(v-m)/k),0));return 1/(1+Math.exp(-(d+.005)/.014));};
 const faceZ=(x,y,z)=>{let d=0,ax=Math.abs(x);
 if(y>3.867&&y<4.24){const[w,h]=nose(y);d+=h*Math.exp(-((Math.abs(x+.003)/w)**1.8));}
 d+=.060*gauss(x,y,-.004,3.952,.041,.046)+.017*gauss(x,y,0,3.918,.015,.024);
 for(let side of[-1,1]){
 const ex=side*.1455,ey=4.128+(side===1?.003:0),u=(side*x-.077)/.135;
 // Individually modelled alar wings meet the blunt central nose; nostrils remain underneath.
 d+=.027*gauss(x,y,side*.071,3.939+(side===1?.003:0),.027,.033)-.007*gauss(x,y,side*.053,3.921,.013,.010);d-=.004*gauss(x,y,side*.091,3.938,.012,.023);
 d-=.012*gauss(x,y,ex,ey,.080,.041);
 if(side*x>0&&ax>.025&&ax<.30){const by=browLine(ax)[0],gate=Math.exp(-(((ax-.145)/.149)**6));d+=.007*gate*(1-.50*Math.max(0,(ax-.12)/.18))*Math.exp(-(((y-by)/.014)**2));}
 if(u>-.08&&u<1.08){const[,lo,hi]=eyeBounds(side,u),gate=Math.max(0,1-((u-.5)/.59)**8);d+=.005*gate*Math.exp(-(((y-hi)/.009)**2));d+=.004*gate*Math.exp(-(((y-lo)/.009)**2));d-=.003*gate*Math.exp(-(((y-hi-.023)/.013)**2));}
 d+=.001*gauss(x,y,ex+side*.031,4.054,.038,.027);
 const bag=4.061-.032*((x-ex)/.11)**2;d-=.003*Math.exp(-(((x-ex)/.091)**4)-(((y-bag)/.019)**2));
 // Fold from each side of the nose around the mouth, with a fleshy inner plane.
 const crease=.104+(3.94-y)*.39,gate=Math.exp(-(((y-3.855)/.102)**2));
 d-=.010*Math.exp(-(((x-side*crease)/.029)**2))*gate;
 d+=.009*Math.exp(-(((x-side*(crease-.031))/.036)**2))*gate;
 }
 // The natural photographs show cast cheek planes, not a smooth egg-shaped cheek.
 // Short lateral cheekbone crest with a broad diagonal submalar hollow.
 for(let side of[-1,1]){
 const xx=side*x,along=(xx-.226)*.83+(y-3.987)*.56,across=-(xx-.226)*.56+(y-3.987)*.83;
 d+=.026*Math.exp(-((along/.076)**2)-((across/.041)**2));
 const q=xx-.212,yy=y-3.892,oblique=.82*q+.57*yy,depth=-.57*q+.82*yy;
 d-=.021*Math.exp(-((oblique/.093)**2)-((depth/.048)**2));
 d+=.009*gauss(x,y,side*.132,3.893,.058,.073);
 }
 // Photograph proportions: narrow closed lips retreat at the corners; sparse short moustache.
 const mt=Math.min(1,ax/.133),mouthGate=Math.exp(-((x/.119)**6)),line=3.835-.005*mt*mt+.0015*Math.sin(15*x);
 d-=.006*mouthGate*Math.exp(-(((y-line)/.008)**2));
 const cupid=.010+.004*Math.exp(-(((ax-.026)/.017)**2));d+=.008*mouthGate*Math.exp(-(((y-line-cupid)/.009)**2));
 d+=.011*Math.exp(-((x/.099)**4)-(((y-line+.014)/.012)**2));
 for(let side of[-1,1]){
 d-=.012*gauss(x,y,side*.117,3.831,.023,.027);
 const sweep=3.900-.27*ax;
 d+=.020*Math.exp(-(((x-side*.065)/.068)**4)-(((y-sweep)/.027)**2));d+=.008*gauss(x,y,side*.064,3.910,.038,.032);
 for(let i=0;i<4;i++){const cx=side*(.028+i*.022),cy=3.900-.27*Math.abs(cx);d-=.0018*Math.exp(-(((x-cx-side*(y-cy)*.45)/.004)**2)-(((y-cy)/.014)**4));}
 }
 d+=.007*gauss(x,y,0,3.746,.125,.028)-.004*gauss(x,y,0,3.792,.091,.013);d-=.010*gauss(x,y,0,3.893,.015,.025);
 // No invented central brow furrow: the historical portraits show a relaxed glabella.
 return z+d;
 };
 // Measured receding hairline: a narrow crown band with hair farther down the sides.
 const hairline=a=>{const c=Math.cos(a);return (c>0?4.06+.357*c:4.06+.23*c)+.009*Math.sin(2*a)+.012*Math.sin(a-.4)*Math.max(0,c);};
 const headAt=(a,y)=>{let[rx,front,back]=head(y),x=rx*Math.sin(a),c=Math.cos(a),z=(front+back)/2+(front-back)/2*c;if(c>0){const e=.08,t=c/e,w=c<e?Math.pow(e,.45)*(2.55*t*t-1.55*t*t*t):Math.pow(c,.45);z+=(faceZ(x,y,z)-z)*w;}
 // Hair is cut into this same scalp surface, eliminating a detached helmet-shaped shell.
 const h=hairline(a);if(y>h){const v=Math.min(1,(y-h)/(4.54-h)),ang=a<pi?a:a-2*pi,part=Math.exp(-(((ang+.43+.18*v)/.055)**2)),t=Math.min(1,v/.36),fade=t*t*(3-2*t)*Math.sin(pi*v)**2;let locks=0;
 const starts=[.02,.20,.39,.60,.82,1.06,1.35,1.67,2.05,2.48,2.91];
 for(let side of[-1,1])for(let i=0;i<starts.length;i++){const length=.48+.035*(i%4)+.025*(side===1?1:0);if(v<length){const bend=side*(.17+.03*(i%3)),centre=side*starts[i]+bend*v+.08*Math.sin(pi*v),da=Math.atan2(Math.sin(a-centre),Math.cos(a-centre)),width=.033+.009*(i%3);locks+=Math.exp(-((da/width)**2))*Math.sin(pi*v/length)**2;}}
 const r=fade*(.0025+.0028*locks-.0015*part*Math.sin(pi*v)**2);x+=r*Math.sin(a);z+=r*c;}

 return[x,y-.025*Math.max(0,Math.min(1,(y-3.48)/.22)),z];};
 const frontPoint=(x,y,d=0)=>{const rx=head(y)[0],a=Math.asin(Math.max(-.99,Math.min(.99,x/rx))),p=headAt(a,y);p[2]+=d;return p;};
 surface((u,v)=>headAt(2*pi*u,3.36+1.18*v),160,140);
 // Most of the metal eyeball is hidden by a continuous overhanging upper lid.
 for(const side of[-1,1]){
 // Embedded eyeball: one spherical cap behind the continuous facial eyelid margins.
 const ec=frontPoint(side*.1455,4.128+(side===1?.003:0));
 surface((u,v)=>{const[x,lo,hi]=eyeBounds(side,u),y=lo+(hi-lo)*v,p=frontPoint(x,y),dx=x-side*.1455,dy=p[1]-ec[1];p[2]=ec[2]+.022-(dx*dx+dy*dy)/.162;const ir=Math.hypot(dx/.017,dy/.018);p[2]-=.004*Math.exp(-(ir**4))+.003*Math.exp(-((dx/.006)**2)-((dy/.008)**2));return p},56,20,side<0);
 // The ear is one attached, uneven cartilage bowl. Its outer rim is not a floating ring.
 const ear=(a,r)=>{const ca=Math.cos(a),sa=Math.sin(a),edge=.040*ca+.006*sa,helix=.017*Math.exp(-(((r-.85)/.115)**2)),arc=(.5+.5*Math.cos(a-.2)),anti=.010*arc*Math.exp(-(((r-.49)/.11)**2));return[side*(.333+r*edge),3.955+.094*r*sa-.010*r*r*Math.max(0,-sa),-.026+r*(-.015*ca+.009*sa)+helix+anti];};
 surface((u,v)=>ear(2*pi*u,v),52,24,side>0);
 }
 // Robe has a cropped angular lower edge, broad chest, sloping shoulders and deep hanging sleeve folds.
 const torso=profile([[2.4,.98,.31,-.29],[2.49,1.16,.38,-.36],[2.59,1.22,.41,-.37],[2.75,1.17,.43,-.38],[3.01,1.05,.42,-.37],[3.19,.88,.35,-.33],[3.30,.61,.28,-.28],[3.37,.285,.22,-.22],[3.47,.233,.20,-.195]]);
 const torsoAt=(a,y)=>{let[rx,front,back]=torso(y),x=rx*Math.sin(a),c=Math.cos(a),z=(front+back)/2+(front-back)/2*c;if(c>0){const folds=[[-1,.39,.21,.037,.025,3.03,.28],[-1,.59,.30,.051,.032,2.98,.30],[-1,.81,.43,.030,.027,2.95,.24],[1,.43,.18,.026,.031,3.06,.24],[1,.67,.38,.040,.028,2.94,.32],[1,.85,.49,.021,.036,2.86,.27]];for(const[s,x0,k,amp,w,cy,sy]of folds){const target=s*(x0+(3.28-y)*k+.018*Math.sin((y-2.4)*5+x0)),gate=Math.exp(-(((y-cy)/sy)**4));z+=c*amp*gate*(Math.exp(-(((x-target)/w)**2))-.72*Math.exp(-(((x-target-s*w*1.3)/(w*.70))**2)));}z+=.008*c*Math.sin(5*x+2*y)*Math.exp(-(((y-2.67)/.24)**2));}return[x,y,z]};
 surface((u,v)=>{const p=torsoAt(2*pi*u,2.4+1.07*v);p[0]*=.90;return p},112,64);
 // Low close-fitting standing collar. Almost closed front seam, no broad petal-shaped V.
 const collar=(a,v)=>{const c=Math.cos(a),top=3.55-.063*Math.max(0,c)**2,y=3.374+v*(top-3.374);return[(.220-.012*v)*Math.sin(a),y,(.220-.003*v)*c];};
 surface((u,v)=>collar(.024+(2*pi-.048)*u,v),112,12);
 surface((u,v)=>{const a=.024+(2*pi-.048)*u,p=collar(a,1);return[p[0]-.013*v*Math.sin(a),p[1]+.002*Math.sin(pi*v),p[2]-.013*v*Math.cos(a)]},112,4);
 return q;
 });this.mesh(key,g,0,0,0,1,1,1,'#424b40',37);
 const text='蔡元培先生',atlasKey='cai1104-gilded-five-character',ctx=this.ctx;let uv=this.signs.get(atlasKey);
 if(!uv){const i=this.nSigns++,px=i%8*512,py=Math.floor(i/8)*128;ctx.save();ctx.clearRect(px,py,512,128);ctx.fillStyle='#b99c57';ctx.font='70px "Songti SC",serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,px+256,py+64);ctx.restore();uv=[px/4096,1-(py+128)/4096,512/4096,128/4096];this.signs.set(atlasKey,uv);}
 this.mesh('plane',this.geo('plane',G.plane),0,1.40,1.205,2.1,.52,1,'#ffffff',8,1,0,uv);
};
})(YY);
