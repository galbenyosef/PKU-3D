/* The user identified the two descents flanking the east entrance bridge.
 * The PKU east-entrance photograph also resolves their descending handrails.
 * Stair width, tread count and landings are fitted to the existing court,
 * not measured. Preserve the main entrance stair and all upper architecture. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/445016209';
const N=7.894,T=49.532,MID=(N+T)/2,top=.22,floor=-2.65;
const spec={id:ID,top,floor,width:2.30,u:59.72,steps:18,tread:.31,landing:1.60};
const plans=[-1,1].map(side=>{const edge=MID+side*6.40,start=edge+side*spec.landing,end=start+side*spec.steps*spec.tread;return{side,edge,start,end,opening:[Math.min(edge,start),Math.max(edge,start)]};});
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==195)return previous.call(this,b,f,add);
 const original=b.e.add;let walls=0,caps=0,guards=0;
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='studentcenter46-court-stone-walls-box'){
   const q=Y.StudentCenterSouth46.local([m[12],m[14]]);
   if(Math.abs(q[0]-61.07)<.001&&Math.abs(q[1]-MID)<.001){walls++;return;}
   if(Math.abs(q[0]-61.16)<.001&&Math.abs(q[1]-MID)<.001){caps++;return;}
  }
  if(k==='studentcenter46-court-railings-box'){guards++;return;}
  return original.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 if(walls!==1||caps!==1||!guards)throw Error('Student center side stairs: court boundary registration changed');
 const o=Y.StudentCenterSouth46.world([0,0]),a=Y.StudentCenterSouth46.world([1,0]),rotation=Math.atan2(o[1]-a[1],a[0]-o[0]);
 const stone='#c8cdc6',steel='#7f8c87',cap='#d9dbd2';
 function group(name,fn){const own=b.e.add;b.e.add=function(k,...args){return own.call(this,'studentcenter195-side-stairs-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=own;}}
 b.local(o[0],0,o[1],rotation,()=>{
  // Keep the retaining wall and coping, opening only the two top landings.
  const spans=[],holes=plans.map(p=>p.opening).sort((a,b)=>a[0]-b[0]);let cursor=N+.13;
  for(const [a,z]of holes){spans.push([cursor,a]);cursor=z;}spans.push([cursor,T-.13]);
  group('boundary',()=>{for(const [a,z]of spans){b.box(61.07,(floor+top)/2,(a+z)/2,.24,top-floor,z-a,stone,24);b.box(61.16,.30,(a+z)/2,.40,.15,z-a,cap,24);}});
  // Street guards end at the openings instead of crossing the access path.
  group('street-guard',()=>{for(const p of plans){const a=p.side<0?N+.5:p.start,z=p.side<0?p.start:T-.5,len=z-a;if(len<=0)continue;
   const count=Math.ceil(len/1.6);for(let j=0;j<=count;j++)b.box(61.15,.83,a+len*j/count,.065,1,.065,steel,9);
   for(const y of[1.29,.85])b.box(61.15,y,(a+z)/2,.065,.065,len,steel,9);
  }});
  for(const p of plans)group(p.side<0?'north':'south',()=>{
   const rise=(top-floor)/spec.steps;
   const inside=spec.u-spec.width/2,outside=61.38;
   b.box((inside+outside)/2,top-.10,(p.edge+p.start)/2,outside-inside,.20,spec.landing,stone,24);
   for(let i=0;i<spec.steps;i++){const y=top-rise*(i+1),v=p.start+p.side*(i+.5)*spec.tread;
    if(y>floor+1e-8)b.box(spec.u,(floor+y)/2,v,spec.width,y-floor,spec.tread,stone,24);
    else b.box(spec.u,floor-.04,v,spec.width,.08,spec.tread,stone,24);
   }
   b.box(spec.u,floor-.05,p.end+p.side*.45,spec.width,.10,.90,stone,24);
   const first=p.start+p.side*.5*spec.tread,last=p.end-p.side*.5*spec.tread,y0=top-rise+.93,y1=floor+.93;
   for(const u of[spec.u-spec.width/2+.07,spec.u+spec.width/2-.07]){
    // Each post meets its tread; the sloped handrails join level landing returns.
    for(let i=0;i<spec.steps;i+=3){const y=top-rise*(i+1),v=p.start+p.side*(i+.5)*spec.tread;b.box(u,y+.465,v,.065,.93,.065,steel,9);}
    b.box(u,floor+.465,last,.065,.93,.065,steel,9);
    for(const offset of[0,-.43]){
     b.beam([u,y0+offset,first],[u,y1+offset,last],.055,steel,9);
     if(u<spec.u)b.beam([u,top+.93+offset,p.edge],[u,top+.93+offset,p.start],.055,steel,9);
     b.beam([u,top+.93+offset,p.start],[u,y0+offset,first],.055,steel,9);
     b.beam([u,y1+offset,last],[u,y1+offset,p.end+p.side*.80],.055,steel,9);
    }
    b.box(u,top+.465,p.edge,.065,.93,.065,steel,9);
   }
  });
 });
 return result;
};
Y.StudentCenter195SideStairs={...spec,plans};
})(YY);
