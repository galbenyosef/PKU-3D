/* Sackler south entrance: dated EdUHK 2025 photograph and complete published
 * front view. Panel patterns and open angle are fitted, not surveyed. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,M=Y.M,G=Y.Geo;
const S={id:'way/240832217',half:2.9,floor:-1.79,top:2.45,transom:1.40,innerZ:-1.05,back:-1.40,front:0,stepCount:5,stairHalf:4,stairFront:4.05,landingFront:2.15,angle:Math.PI/3,fit:true};
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),restore=(o,k,value,had)=>{if(had)o[k]=value;else delete o[k];};
function split(poly,n,c){const yes=[],no=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=M.dot(a.q,n)-c,db=M.dot(b.q,n)-c;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function cut(poly,box){let rest=poly,parts=[];for(const[n,c]of[[[1,0,0],box[0]],[[-1,0,0],-box[1]],[[0,1,0],box[2]],[[0,-1,0],-box[3]],[[0,0,1],box[4]],[[0,0,-1],-box[5]]]){if(rest.length<3)break;const s=split(rest,n,c);if(s.no.length>=3)parts.push(s.no);rest=s.yes;}if(rest.length<3||Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))<1e-10)return{parts:[poly],hit:false};return{parts,hit:true};}
function box(g,x,y,z,w,h,d,map=p=>p){const q=G.box();for(let i=0;i<q.v.length;i+=24){const ps=[0,8,16].map(j=>map([x+q.v[i+j]*w,y+q.v[i+j+1]*h,z+q.v[i+j+2]*d]));if(map.flip)ps.reverse();g.tri(...ps,[0,8,16].map(j=>q.v.slice(i+j+6,i+j+8)));}}
function line(g,pts,z,t,map){for(let i=1;i<pts.length;i++){const[a,b]=[pts[i-1],pts[i]];box(g,(a[0]+b[0])/2,(a[1]+b[1])/2,z,Math.abs(a[0]-b[0])+t,Math.abs(a[1]-b[1])+t,.045,map);}}
function rect(g,x,y,w,h,z,t,map){line(g,[[x-w/2,y-h/2],[x+w/2,y-h/2],[x+w/2,y+h/2],[x-w/2,y+h/2],[x-w/2,y-h/2]],z,t,map);}
function lattice(g,x,y,w,h,z,map){rect(g,x,y,w*.76,h*.74,z,.045,map);for(const s of[-1,1]){const xx=x+s*w*.39;line(g,[[xx,y-h*.46],[xx,y-h*.22],[x+s*w*.23,y-h*.22],[x+s*w*.23,y-h*.37]],z,.042,map);line(g,[[xx,y+h*.46],[xx,y+h*.22],[x+s*w*.23,y+h*.22],[x+s*w*.23,y+h*.37]],z,.042,map);line(g,[[x-s*w*.48,y],[x-s*w*.31,y],[x-s*w*.31,y+h*.13],[x-s*w*.40,y+h*.13]],z,.039,map);}}
A.render=function(b,f,add){if(f.properties.pickId!==106||f.properties.id!==S.id)return prior.call(this,b,f,add);
 const emit=b.e.add,hadAdd=own(b.e,'add'),sourceBox=b.n17Box,hadBox=own(b,'n17Box'),rows=[];
 b.n17Box=function(k,...a){if(k==='v17-museum-step')return;return sourceBox.call(this,k,...a);};b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p,uv});};let result;
 try{result=prior.call(this,b,f,add);}finally{restore(b,'n17Box',sourceBox,hadBox);restore(b.e,'add',emit,hadAdd);}
 const entry=rows.filter(r=>r.k==='v30-v17-museum-entry');if(entry.length!==1)throw Error('sackler162 entry registration');const F=new Float32Array(entry[0].m);for(let j=0;j<3;j++){F[j]/=5.8;F[j+4]/=4.4;F[j+8]/=.14;}const inv=M.inverse(F),ratio=Math.hypot(...F.slice(0,3))/Math.hypot(...F.slice(8,11));
 // Two finite volumes: door/near jamb cavity, and the supported approach.
 const cuts=[[-4.12,4.12,S.floor-.0001,S.top+.06,S.back,2.32],[-4.001,4.001,-2.8001,S.floor+.0001,S.back,4.1]];let changed=0,columns=0;
 for(const r of rows){if(r.k==='v30-v17-museum-entry')continue;const T=M.multiply(inv,r.m),center=M.apply(T,[0,0,0,1]);
  if((r.k==='v30-v17-red-column'||r.k==='v30-cyl12_1')&&Math.abs(center[0])<.1&&center[2]>.5&&center[2]<1.4){columns++;continue;}
  const g=new G.Geometry();let touched=false;
  for(let i=0;i<r.g.v.length;i+=24){let parts=[[0,8,16].map(j=>({v:Array.from(r.g.v.slice(i+j,i+j+8)),q:M.apply(T,[...r.g.v.slice(i+j,i+j+3),1]).slice(0,3)}))];let hit=false;
   for(const c of cuts){const next=[];for(const p of parts){const v=cut(p,c);next.push(...v.parts);hit=hit||v.hit;}parts=next;}
   if(!hit){g.v.push(...r.g.v.slice(i,i+24));continue;}touched=true;for(const p of parts)for(let j=1;j+1<p.length;j++){const a=[p[0].v,p[j].v,p[j+1].v];if(Math.hypot(...M.cross(M.sub(a[1].slice(0,3),a[0].slice(0,3)),M.sub(a[2].slice(0,3),a[0].slice(0,3))))>1e-10)g.v.push(...a[0],...a[1],...a[2]);}
  }
  if(touched){if(g.v.length){if(r.g.detailWidth!==undefined)g.detailWidth=r.g.detailWidth;emit.call(b.e,'sackler-entry162-cut-'+changed++,g,r.m,r.c,r.p,r.uv);}}else emit.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);
 }
 if(columns!==2||changed<1)throw Error('sackler162 expected central column and foot');
 const groups={};function group(k,c,mat){return groups[k]||(groups[k]={g:new G.Geometry(),c,mat});}const wood=group('wood','#884632',20).g,detail=group('wood-relief','#9b513a',20).g,glass=group('outer-glass','#60716b',28).g,stone=group('stone','#b6b6aa',10).g,wall=group('jamb-wall','#d9d7c9',24).g,inner=group('inner-frame','#353f38',29).g,innerGlass=group('inner-glass','#3e5551',28).g;
 // White side returns stay outside the opening; no plate behind the door glass.
 for(const s of[-1,1])box(wall,s*3.505,(S.floor+S.top)/2,(S.back+.16)/2,1.21,S.top-S.floor,.16-S.back);
 box(wall,0,S.top+.13,(S.back+.16)/2,8.24,.26,.16-S.back);
 const leafH=S.transom-S.floor,leafW=2.86;
 for(const s of[-1,1]){const map=p=>{const t=p[0]+leafW/2;return[s*(S.half-t*Math.cos(S.angle))+s*Math.sin(S.angle)*p[2]/ratio,p[1],S.front+t*Math.sin(S.angle)*ratio+Math.cos(S.angle)*p[2]];};map.flip=s>0;
  const y=S.floor+leafH/2;rect(wood,0,y,leafW-.10,leafH-.10,.025,.12,map);
  const panelH=leafH*.38;box(wood,0,S.floor+panelH/2+.035,0,leafW-.20,panelH,.10,map);
  for(const [cy,h]of[[S.floor+panelH*.27,panelH*.41],[S.floor+panelH*.76,panelH*.41]]){rect(detail,0,cy,leafW*.78,h,.075,.045,map);line(detail,[[-leafW*.29,cy-h*.30],[leafW*.29,cy-h*.30],[leafW*.29,cy+h*.25],[-leafW*.19,cy+h*.25],[-leafW*.19,cy-h*.05],[leafW*.14,cy-h*.05],[leafW*.14,cy+h*.06]],.092,.037,map);}
  const gy=S.floor+panelH+(leafH-panelH)/2,gh=leafH-panelH-.14;box(glass,0,gy,-.015,leafW-.29,gh,.025,map);rect(wood,0,gy,leafW-.26,gh,.055,.08,map);lattice(detail,0,gy,leafW-.30,gh,.11,map);
 }
 // Three outer transom groups: narrow / double centre / narrow.
 const ty=(S.transom+S.top)/2,th=S.top-S.transom;
 for(const [x,w]of[[-2.15,1.40],[0,2.75],[2.15,1.40]]){box(glass,x,ty,0,w-.12,th-.12,.04);rect(wood,x,ty,w,th,.055,.12);if(x===0){box(wood,0,ty,.07,.09,th,.12);for(const c of[-.68,.68])lattice(detail,c,ty,1.27,th-.12,.13);}else lattice(detail,x,ty,w-.14,th-.12,.13);}
 for(const x of[-S.half,S.half])box(wood,x,(S.floor+S.top)/2,.04,.14,S.top-S.floor,.17);box(wood,0,S.transom,.04,5.8,.16,.17);
 // The independently visible inner double glazed doors have their own headlight.
 const innerHalf=1.53,innerTop=1.20,innerHead=.76,iy=(S.floor+innerHead)/2;
 for(const s of[-1,1]){box(innerGlass,s*.765,iy,S.innerZ,1.43,innerHead-S.floor-.10,.045);rect(inner,s*.765,iy,1.50,innerHead-S.floor,S.innerZ+.045,.075);box(inner,s*.075,iy-.02,S.innerZ+.10,.042,.48,.05);for(const dy of[-.21,.21])box(inner,s*.075,iy-.02+dy,S.innerZ+.066,.044,.044,.08);}
 box(innerGlass,0,(innerHead+innerTop)/2,S.innerZ,3.0,innerTop-innerHead,.045);rect(inner,0,(innerHead+innerTop)/2,3.06,innerTop-innerHead,S.innerZ+.045,.075);
 for(const s of[-1,1])box(wall,s*(S.half+innerHalf)/2,(S.floor+S.top)/2,S.innerZ-.16,S.half-innerHalf,S.top-S.floor,.25);box(wall,0,(innerTop+S.top)/2,S.innerZ-.16,3.06,S.top-innerTop,.25);
 // Solid stair union reaches the existing side-gallery datum and inner door.
 const ground=-2.8,run=(S.stairFront-S.landingFront)/S.stepCount,profile=[[S.back,ground],[S.stairFront,ground]];for(let i=0;i<S.stepCount;i++){const z=S.stairFront-i*run,y=ground+(i+1)*(S.floor-ground)/S.stepCount;profile.push([z,y],[i===S.stepCount-1?S.back:z-run,y]);}
 function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();g.quad(...p);}
 const stairs=group('stair','#b4b4a8',10).g;for(let i=0;i<profile.length;i++){const p=profile[i],q=profile[(i+1)%profile.length];face(stairs,[[-4,p[1],p[0]],[4,p[1],p[0]],[4,q[1],q[0]],[-4,q[1],q[0]]],[0,p[0]-q[0],q[1]-p[1]]);}for(const s of[-1,1])for(let i=1;i+1<profile.length;i++){const p=[profile[0],profile[i],profile[i+1]].map(q=>[s*4,q[1],q[0]]);if(s>0)p.reverse();if(Math.hypot(...M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])))>1e-10)stairs.tri(...p);}
 // Two low solid sloping cheek walls, not floating guard rails.
 for(const s of[-1,1]){const cross=[[S.stairFront,ground],[S.stairFront,ground+.16],[S.landingFront,S.floor+.20],[.15,S.floor+.20],[.15,ground]],x=s*4.18,t=.36;for(let i=0;i<cross.length;i++){const p=cross[i],q=cross[(i+1)%cross.length];face(stone,[[x-t/2,p[1],p[0]],[x+t/2,p[1],p[0]],[x+t/2,q[1],q[0]],[x-t/2,q[1],q[0]]],[0,p[0]-q[0],q[1]-p[1]]);}for(const sign of[-1,1])for(let i=1;i+1<cross.length;i++){const p=[cross[0],cross[i],cross[i+1]].map(q=>[x+sign*t/2,q[1],q[0]]);if(sign>0)p.reverse();stone.tri(...p);}}
 for(const[k,q]of Object.entries(groups))emit.call(b.e,'sackler-entry162-'+k,q.g,F,q.c,[q.mat,106,0,.9]);
 // A short apron ends at the actual mapped footway end-cap, with no overlap.
 const road=Y.CAMPUS.features.find(q=>q.properties.pickId===330&&q.properties.id==='way/1009051991');if(!road||road.geometry.coordinates.length!==2||road.properties.width!==2)throw Error('sackler162 footway registration');
 const rv=new Float32Array(Y.Landscape42.warp(G.ribbon(road.geometry.coordinates,road.properties.width,.12,false)).v),ends=[Array.from(rv.slice(8,11)),Array.from(rv.slice(16,19))].sort((a,b)=>a[0]-b[0]);
 const near=[-4,4].map(x=>{const p=M.apply(F,[x,-2.8,S.stairFront,1]).slice(0,3);p[1]=ends[0][1];return p;}).sort((a,b)=>a[0]-b[0]),apron=new G.Geometry(),ring=[near[0],near[1],ends[1],ends[0]];
 face(apron,ring.slice(),[0,1,0]);for(let i=0;i<4;i++){const a=ring[i],b=ring[(i+1)%4],p=[a,[a[0],0,a[2]],[b[0],0,b[2]],b];face(apron,p,[b[2]-a[2],0,a[0]-b[0]]);}face(apron,ring.map(p=>[p[0],0,p[2]]),[0,-1,0]);
 emit.call(b.e,'sackler-entry162-road-apron',apron,M.identity(),'#b4b4a8',[10,106,0,.9]);

 return result;
};Y.SacklerEntry162=S;
})(YY);
