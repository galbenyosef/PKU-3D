/* Yi Yuan first-floor east entrance. The side is independently documented;
 * the centre follows the mapped footway endpoint, not a surveyed door centre.
 * Canopy/door proportions are fitted to the 2018/2019 photographs. */
(function(Y){'use strict';const M=Y.M,G=Y.Geo,previous=Y.Architecture30.render,ID='way/188712163',PICK=46;
const O=[-256.946,548.255],R=Math.atan2(15.045,-.162),cs=Math.cos(R),sn=Math.sin(R),H={sill:.30,leaf:2.90,transom:3.62,canopy:3.83},C={metal:'#b7bfbd',glass:'#617b77',panel:'#bdc4c0',stone:'#b7bbb3',green:'#35534e'};
const local=p=>[(p[0]-O[0])*cs-(p[2]-O[1])*sn,p[1],(p[0]-O[0])*sn+(p[2]-O[1])*cs];
const world=(u,y,v)=>[O[0]+u*cs+v*sn,y,O[1]-u*sn+v*cs];
const bounds=[[-3.50,3.50],[.03,4.15],[-.40,.55]],planes=bounds.flatMap(([lo,hi],axis)=>[{axis,value:lo,sign:1},{axis,value:hi,sign:-1}]);
function subtract(g,m){let touched=false;const out=new G.Geometry(),inv=M.inverse(m);const transformed=[];
 for(let i=0;i<g.v.length;i+=8){const p=M.apply(m,[...g.v.slice(i,i+3),1]).slice(0,3),n=g.v.slice(i+3,i+6),normal=M.norm([0,1,2].map(j=>inv[j*4]*n[0]+inv[j*4+1]*n[1]+inv[j*4+2]*n[2]));transformed.push([...p,...normal,...g.v.slice(i+6,i+8)]);}
 if([0,1,2].some(a=>Math.max(...transformed.map(p=>local(p)[a]))<bounds[a][0]||Math.min(...transformed.map(p=>local(p)[a]))>bounds[a][1]))return null;
 const distance=(p,e)=>(local(p)[e.axis]-e.value)*e.sign;
 function half(poly,e,inside){const result=[];for(let j=0;j<poly.length;j++){const a=poly[j],b=poly[(j+1)%poly.length],da=distance(a,e)*(inside?1:-1),db=distance(b,e)*(inside?1:-1),ia=da>=0,ib=db>=0;if(ia)result.push(a);if(ia!==ib){const t=da/(da-db);result.push(a.map((x,k)=>x+(b[k]-x)*t));}}return result;}
 function emit(poly){for(let j=1;j+1<poly.length;j++){const a=poly[0],b=poly[j],c=poly[j+1],area=Math.hypot(...M.cross(M.sub(b.slice(0,3),a.slice(0,3)),M.sub(c.slice(0,3),a.slice(0,3))));if(area>1e-10)out.v.push(...a,...b,...c);}}
 for(let i=0;i<transformed.length;i+=3){const tri=transformed.slice(i,i+3);let inside=tri;for(const e of planes)inside=half(inside,e,true);if(inside.length<3){emit(tri);continue;}touched=true;let remainder=tri;for(const e of planes){emit(half(remainder,e,false));remainder=half(remainder,e,true);if(remainder.length<3)break;}}
 if(!touched)return null;if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;
}
// Fixed cells (logical 4096 atlas): rows 28/29, columns 6/7.
// Other bottom rows are reserved by 061/062/065/079/085/087/091.
// Keep the ordinary counter and every pre-existing label UV unchanged.
function lettering(b,text,u,y,v,w,h,color){const key='yiyuan46-'+text;b.yiyuan46Labels??=new Map();let label=b.yiyuan46Labels.get(key);if(!label){const ctx=b.ctx,slot=['艺园','食堂','藝','園'].indexOf(text);if(slot<0)throw Error('Unknown Yiyuan atlas label');const px=3072+(slot%2)*512,py=3584+Math.floor(slot/2)*128;ctx.save();ctx.clearRect(px,py,512,128);ctx.beginPath();ctx.rect(px+8,py+8,496,112);ctx.clip();ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.font='500 80px "Songti SC","Noto Serif CJK SC",serif';let m=ctx.measureText(text),size=Math.min(80,80*448/Math.max(1,m.width));ctx.font='500 '+size+'px "Songti SC","Noto Serif CJK SC",serif';m=ctx.measureText(text);const left=m.actualBoundingBoxLeft??0,right=m.actualBoundingBoxRight??m.width,asc=m.actualBoundingBoxAscent??size*.8,desc=m.actualBoundingBoxDescent??size*.2,iw=left+right,ih=asc+desc,pad=8,l=(512-iw)/2-pad,t=(128-ih)/2-pad,cw=iw+2*pad,ch=ih+2*pad;ctx.fillStyle=color;ctx.fillText(text,px+(512-iw)/2+left,py+(128-ih)/2+asc);ctx.restore();label={uv:[(px+l)/4096,1-(py+t+ch)/4096,cw/4096,ch/4096],w:w*cw/iw,h:h*ch/ih};b.yiyuan46Labels.set(key,label);b.signs.set(key,label.uv);}b.mesh('plane',b.geo('plane',G.plane),u,y,v,label.w,label.h,1,'#ffffff',8,0,0,label.uv);}
function entrance(b){b.local(O[0],0,O[1],R,()=>{
 const box=(name,...args)=>{const prior=b.e.add;b.e.add=function(k,...p){return prior.call(this,'yiyuan46-'+name+'-'+k,...p);};try{b.box(...args);}finally{b.e.add=prior;}};
 const handle=(a,c)=>{const prior=b.e.add;b.e.add=function(k,...p){return prior.call(this,'yiyuan46-handle-'+k,...p);};try{b.beam(a,c,.036,C.metal,9);}finally{b.e.add=prior;}};
 // Full platform meets original .12-high mapped footway; one fitted .18 rise.
 box('platform',0,.15,.75,7,.30,2.30,C.stone,10);
 box('threshold',0,.15,-.22,6.20,.30,.52,C.stone,10);
 box('header-return',0,3.90,-.12,7,.50,.56,C.stone,24);
 for(const u of [-3.288,3.288]){box('stone-pier',u,1.97,-.06,.424,3.36,.64,C.stone,24);for(const y of [.80,1.06,1.32])box('pier-inlay',u,y,.268,.424,.045,.014,'#4a5550',24);}
 // Central inscribed dark-green stone panel, not another generic door leaf.
 box('central-stone',0,1.60,-.13,1.50,2.60,.38,C.green,24);
 for(const u of [-.79,.79])box('centre-mullion',u,1.96,.08,.07,3.32,.14,C.metal,6);
 const groups=[{s:-3.05,e:-.83,fixed:[-3.05,-2.63],leaves:[[-2.63,-1.73],[-1.73,-.83]]},{s:.83,e:3.05,fixed:[2.63,3.05],leaves:[[.83,1.73],[1.73,2.63]]}];
 const stilePositions=new Set();for(const group of groups){for(const [a,c]of[group.fixed,...group.leaves]){const width=c-a,u=(a+c)/2,isLeaf=group.leaves.some(q=>q[0]===a);box(isLeaf?'door-glass':'fixed-glass',u,2.0975,-.035,width-.05,1.50,.040,C.glass,5);box(isLeaf?'door-lower-panel':'fixed-lower-panel',u,.815,-.03,width-.05,.97,.055,C.panel,24);for(const x of [a,c])if(!stilePositions.has(x)){stilePositions.add(x);box('door-stile',x,1.60,.02,.055,2.60,.09,C.metal,6);}for(const y of [.325,1.325,2.87])box('door-rail',u,y,.02,width,.055,.09,C.metal,6);
 if(isLeaf){const leftLeaf=u<(group.s+group.e)/2,x=u+(leftLeaf?.26:-.26);for(const u of [x-.14,x+.14])handle([u,1.50,.07],[u,1.50,.19]);handle([x-.14,1.50,.19],[x+.14,1.50,.19]);for(const y of [.62,2.42])box('hinge',leftLeaf?a:c,y,.08,.055,.12,.055,C.metal,9);}}
 box('transom-glass',(group.s+group.e)/2,3.26,-.035,group.e-group.s,.67,.045,C.glass,5);
 }
 box('centre-transom',0,3.26,-.035,1.5,.67,.045,C.glass,5);
 for(const y of [2.925,3.625])box('full-transom-rail',0,y,.045,6.18,.055,.10,C.metal,6);
 // Closed pale metal canopy with the observed orthogonal soffit panel joints.
 box('canopy',0,H.canopy,.72,7.12,.36,1.98,'#b7bcb6',29);
 for(let u=-3;u<=3;u+=.75)box('soffit-joint-u',u,3.646,.72,.012,.012,1.96,'#777f79',29);
 for(const v of [-.1,.55,1.20])box('soffit-joint-v',0,3.646,v,7.10,.012,.012,'#777f79',29);
 const old=b.e.add;b.e.add=function(k,...p){return old.call(this,'yiyuan46-inscription-'+k,...p);};try{lettering(b,'艺园',-1.94,3.26,.052,1.47,.47,'#a73b36');lettering(b,'食堂',1.94,3.26,.052,1.47,.47,'#a73b36');lettering(b,'藝',0,2.16,.066,.61,.60,'#bbc6bf');lettering(b,'園',0,1.21,.066,.61,.60,'#bbc6bf');}finally{b.e.add=old;}
 });}
Y.Architecture30.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return previous(b,f,add);const original=b.e.add,originalWindow=b.window;let serial=0,result,removedWindows=0;
 // Remove a conflicting generic window as one glass/frame assembly. The
 // existing wall outside the entrance cut already closes its exposed remainder.
 b.window=function(x,y,z,w,h,r=0,...rest){const p=local(this.world([x,y,z]));if(Math.abs(p[2])<.15&&Math.cos(this.rotation+r-R)>.999&&p[0]+w/2>bounds[0][0]&&p[0]-w/2<bounds[0][1]&&p[1]-h/2>1&&p[1]+h/2<bounds[1][1]){removedWindows++;return;}return originalWindow.call(this,x,y,z,w,h,r,...rest);};
 b.e.add=function(k,g,m,c,p,uv){if(p[1]===PICK){const cut=subtract(g,m);if(cut)return cut.v.length?original.call(this,'yiyuan46-source-cut-'+serial+++'-'+k,cut,M.identity(),c,p,uv):undefined;}return original.call(this,k,g,m,c,p,uv);};
 try{result=previous(b,f,add);}finally{b.e.add=original;b.window=originalWindow;}b.id=PICK;entrance(b);return{...result,eastFirstFloorEntrance:true,removedConflictingWindowAssemblies:removedWindows,entrancePosition:'footway-endpoint-fit-not-survey',unverifiedSecondFloorEntrance:true};
};Y.Yiyuan46={id:ID,pick:PICK,origin:O,rotation:R,local,world,bounds,heights:H,subtract};
})(YY);
