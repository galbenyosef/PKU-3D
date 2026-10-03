/* Tizhai east entry, photo-fitted from the captioned east/south Sina photographs.
 * ESE octagon face is the nearest existing east-facing plane. Door widths,
 * glazing and thresholds are photographic fits, not measured elevations. */
(function(Y){'use strict';
const P=Y.Builder.prototype,old=P.northOctagon,G=Y.Geo,A=Math.PI/8,N=[Math.cos(A),Math.sin(A)],R=6*Math.cos(A);
const holes=[[-1.48,-.22],[.22,1.48]],bottom=.7,top=4.26;
function clipped(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=fn(p),b=fn(q);if(a>=-1e-9)out.push(p);if((a>=0)!==(b>=0)){const t=a/(a-b);out.push(p.map((v,j)=>v+(q[j]-v)*t));}}return out;}
function openedWall(src){const g=new G.Geometry(),u=v=>6*(-N[1]*v[0]+N[0]*v[2]),y=v=>.7+9.7*v[1];
for(let i=0;i<src.v.length;i+=24){let polys=[[0,8,16].map(j=>Array.from(src.v.slice(i+j,i+j+8)))];const normal=polys[0][0];if(normal[3]>.9&&normal[5]>.3&&Math.abs(normal[4])<.1)for(const [lo,hi]of holes){const kept=[];for(const poly of polys){let inside=poly;for(const fn of[v=>u(v)-lo,v=>hi-u(v),v=>y(v)-bottom,v=>top-y(v)]){const outside=clipped(inside,v=>-fn(v));if(outside.length>=3)kept.push(outside);inside=clipped(inside,fn);if(inside.length<3)break;}}polys=kept;}
for(const poly of polys)for(let j=1;j<poly.length-1;j++){const tri=[poly[0],poly[j],poly[j+1]],a=tri[1].slice(0,3).map((v,k)=>v-tri[0][k]),b=tri[2].slice(0,3).map((v,k)=>v-tri[0][k]);if(Math.hypot(...Y.M.cross(a,b))<1e-9)continue;for(const v of tri)g.vertex(v.slice(0,3),v.slice(3,6),v.slice(6,8));}}return g;}
P.northOctagon=function(p,w,d){if(this.id!==189)return old.call(this,p,w,d);const mesh=this.mesh,lattice=this.n17Lattice;
this.mesh=function(key,geo,...args){if(key==='v17-octagon-wall')return mesh.call(this,'tizhai189-open-wall',openedWall(geo),...args);return mesh.call(this,key,geo,...args);};
this.n17Lattice=function(x,y,z,...args){if(y===3&&Math.abs(x-(R+.06)*N[0])<.01&&Math.abs(z-(R+.06)*N[1])<.01)return;return lattice.call(this,x,y,z,...args);};
try{old.call(this,p,w,d);}finally{this.mesh=mesh;this.n17Lattice=lattice;}
this.local(N[0]*R,0,N[1]*R,Math.PI/2-A,()=>{const box=(k,x,y,z,w,h,d,c,mat=6)=>this.n17Box('tizhai189-'+k,x,y,z,w,h,d,c,mat,.85);
for(const centre of[-.85,.85]){const lo=centre-.63,hi=centre+.63;
// White plaster reveal returns meet the retained wall and expose real wall depth.
for(const x of[lo-.07,hi+.07])box('reveal',x,2.48,-.12,.14,3.56,.38,'#d9d7c9',24);
box('lintel',centre,4.33,-.12,1.54,.14,.38,'#d9d7c9',24);
box('threshold',centre,.705,-.01,1.38,.05,.64,'#a3a599',10);
// Two leaves below a glazed transom; no invented hardware or inscriptions.
for(const dx of[-.29,.29]){box('door-leaf',centre+dx,2.13,-.23,.56,2.78,.09,'#503b2e');box('door-upper-glass',centre+dx,2.85,-.168,.40,.98,.028,'#3e4b46',5);box('door-lower-panel',centre+dx,1.43,-.165,.4,.98,.026,'#5c4131');}
for(const x of[lo+.04,centre,hi-.04])box('door-stile',x,2.47,-.15,.065,3.48,.12,'#70513b');
for(const y of[.77,3.55,4.20])box('door-rail',centre,y,-.15,1.24,.09,.12,'#70513b');
box('transom',centre,3.88,-.205,1.16,.55,.035,centre<0?'#898878':'#354239',5);
// Landing reaches the stone pedestal; its underside overlaps, avoiding a float gap.
box('landing',centre,.60,.43,1.54,.20,.90,'#a3a599',10);
}});
};
Y.Tizhai189Entry={face:0,holes,bottom,top,normal:N,registration:'captioned east/south photo fit; exact bearing and dimensions unmeasured'};
})(YY);
