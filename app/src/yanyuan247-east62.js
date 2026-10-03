/* East end only, photograph-fitted from Baidu 2023-01-10 panoramas.
 * Entry below 9m remains unresolved. No surveyed dimensions or door claims. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/680594294';
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p:[...p],uv});};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;}
const tower=rows.find(r=>r.k==='v30-yanyuan26-tower');if(!tower){for(const r of rows)old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);return result;}
const src=Y.ARCHIVE.legacy['26001'],w=src.modelSize?.[0]||src.w*2.5,d=src.modelSize?.[1]||src.d*2.5,h=src.h,cw=w*.92,cd=d*.68;
const root=M.multiply(tower.m,M.inverse(M.transform([0,9+(h-9)/2,-d*.06],[cw,h-9,cd],0))),inv=M.inverse(root);let removed=0;
for(const r of rows){const q=M.apply(inv,[r.m[12],r.m[13],r.m[14],1]);if(r.k==='v30-yanyuan26-side-window'&&q[0]>0){removed++;continue;}old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
const geo=G.box(),x=cw/2+.16,zc=-d*.06,glass='#506f7c',stone='#c5c5b8',metal='#aeb9b9';
function box(key,X,y,z,dx,dy,dz,c=stone,mat=24){old.call(b.e,'yy247-east-'+key,geo,M.multiply(root,M.transform([X,y,z],[dx,dy,dz],0)),c,[mat,247,0,.8]);}
// East end upper facade only. Existing masonry body is the backing, never a
// second opaque plate hiding old windows. All 65 old east windows are removed.
const bottom=10,top=h-1.4,centreWidth=cd*.55;
box('central-glass',x,(bottom+top)/2,zc,.13,top-bottom,centreWidth,glass,28);
for(const q of[-1,1])box('central-stone-edge-'+q,x+.10,(bottom+top)/2,zc+q*(centreWidth/2+.20),.16,top-bottom,.40);
for(const q of[-1,1])box('central-vertical-'+q,x+.15,(bottom+top)/2,zc+q*centreWidth/6,.16,top-bottom,.25,metal,29);
for(let j=0;j<11;j++){const y=bottom+1.0+j*(top-bottom-2)/11;
 box('central-floor-'+j,x+.13,y,zc,.16,.50,centreWidth,metal,29);
 for(const side of[-1,1])for(let col=0;col<2;col++){
 const z=zc+side*(cd*.34+col*cd*.09),yy=y+.55;
 box('narrow-frame-'+side+'-'+col+'-'+j,x,yy,z,.15,2.00,cd*.066,'#a9afaa');
 box('narrow-glass-'+side+'-'+col+'-'+j,x+.10,yy,z,.09,1.50,cd*.048,glass,28);
 }
}
// Fit only the photographed east strip of the broad upper shade plate; the
// original roof, west end, and north/south roof perimeter remain untouched.
box('top-shade',cw/2+.50,h+.75,zc,2.2,.35,cd+1.0,'#bfc5bd');
for(const z of[-cd*.4,0,cd*.4])box('top-support-'+z,cw/2+.10,h+.20,zc+z,.30,.80,.30,'#a3aaa4',29);
return{...result,eastFacadePhotoFitted:true,eastOldWindowsRemoved:removed,entranceUnresolved:true};
};Y.Yanyuan247East={id:ID,entryUnresolved:true};})(YY);
