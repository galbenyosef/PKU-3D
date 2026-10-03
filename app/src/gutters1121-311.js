/* Haiyantang gutter pair. Display fit to public scans/panorama; not a survey.
 * One existing pick represents the pair; the old OSM alias cannot identify a side.
 * Fine carved motifs remain unresolved: this candidate establishes the channel,
 * moulded body, end returns and central projecting shield only. */
(function(Y){'use strict';const prior=Y.Heritage31.render,G=Y.Geo;
const pieces=[{key:'east',x:-451.10,z:-79.55644,r:68.161*Math.PI/180+Math.PI,L:2.90,H:.70,D:.86,curve:.07},{key:'west',x:-457.10,z:-78.81972,r:89.324*Math.PI/180,L:3.02,H:.64,D:.78,curve:.045}];
function ears(r){let ids=r.map((_,i)=>i),out=[],cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);while(ids.length>3){let found=false;for(let j=0;j<ids.length;j++){let a=ids[(j+ids.length-1)%ids.length],b=ids[j],c=ids[(j+1)%ids.length];if(cross(r[a],r[b],r[c])<=1e-10)continue;if(ids.some(k=>k!==a&&k!==b&&k!==c&&cross(r[a],r[b],r[k])>=-1e-10&&cross(r[b],r[c],r[k])>=-1e-10&&cross(r[c],r[a],r[k])>=-1e-10))continue;out.push([a,b,c]);ids.splice(j,1);found=true;break;}if(!found)throw Error('Gutter profile triangulation failed');}out.push(ids);return out;}
function extrusion(r,L,curve,steps=24){const g=new G.Geometry(),point=(i,t)=>[-L/2+L*t,r[i][1],r[i][0]+curve*(1-(2*t-1)**2)];
 for(let k=0;k<steps;k++)for(let i=0;i<r.length;i++){const j=(i+1)%r.length;g.quad(point(i,(k+1)/steps),point(j,(k+1)/steps),point(j,k/steps),point(i,k/steps));}
 for(const t of ears(r)){g.tri(...t.map(i=>point(i,0)));g.tri(...t.slice().reverse().map(i=>point(i,1)));}return g;}
Y.Heritage31.render=function(b,f){if(f.properties.pickId!==1121||f.properties.id!=='node/9706378260')return prior.call(this,b,f);const old=[b.origin,b.rotation,b.id,b.anim];try{b.id=1121;b.anim=0;for(const p of pieces){b.origin=[p.x,0,p.z];b.rotation=p.r;const d=p.D/2,h=p.H;
 // Counterclockwise section in (depth,height); shallow open-top channel.
 const ring=[[-d*.66,0],[d*.66,0],[d*.70,h*.12],[d*.91,h*.25],[d*.78,h*.43],[d*.89,h*.55],[d*.89,h*.64],[d,h*.77],[d,h],[d*.75,h],[d*.65,h*.86],[-d*.65,h*.86],[-d*.75,h],[-d,h],[-d,h*.77],[-d*.89,h*.64],[-d*.89,h*.55],[-d*.78,h*.43],[-d*.91,h*.25],[-d*.70,h*.12]];
 const key='haiyantang1121-'+p.key+'-311';b.mesh(key,b.geo(key,()=>extrusion(ring,p.L,p.curve)),0,0,0,1,1,1,'#bbb6a6',10);
 // Transverse upper lips close the channel at both ends, as in the scan covers.
 for(const s of [-1,1])b.box(s*(p.L/2-.05),h*.93,0,.10,h*.14,p.D*.96,'#bbb6a6',10);
 // End returns are broad rounded masses; no invented scroll engraving.
 for(const s of [-1,1])b.sphere(s*(p.L/2-.07),h*.27,p.curve*.06,.115,h*.24,d*.92,'#b5b09f',10,0,true);
 // Central shield relief silhouette from the cover, without invented ornament.
 const shield=[[-.22,.37],[-.15,.28],[0,.23],[.15,.28],[.22,.37],[.18,.49],[.09,.50],[0,.59],[-.09,.50],[-.18,.49]];
 const sk=key+'-shield';const sg=b.geo(sk,()=>{const g=new G.Geometry();for(let i=0;i<shield.length;i++){let j=(i+1)%shield.length;const a=shield[i],c=shield[j],z=d*.9+p.curve;g.tri([0,.41,z+.045],[a[0],a[1],z+.045],[c[0],c[1],z+.045]);g.tri([0,.41,z-.04],[c[0],c[1],z-.04],[a[0],a[1],z-.04]);g.quad([a[0],a[1],z+.045],[a[0],a[1],z-.04],[c[0],c[1],z-.04],[c[0],c[1],z+.045]);}return g;});b.mesh(sk,sg,0,0,0,1,1,1,'#bbb6a6',10);
 }}finally{[b.origin,b.rotation,b.id,b.anim]=old;}};
Y.Heritage1121Fit311={pieces,alias:'大水法石构件',name:'海晏堂引水槽',centre:[-454.10,-79.18808],scope:'one existing pick for both pieces; display fit; fine relief unresolved'};
})(YY);
