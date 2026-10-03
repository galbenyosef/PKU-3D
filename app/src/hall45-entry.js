/* Pick45: one photo-aligned front, retaining the mapped outer wings.
 * Frame and low stair dimensions are proportional fits, not a survey. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,Adapter=Y.ArchitectureAdapter,ID='way/188711087';
const frame={r:.879,w:52,d:46,centre:[34.218,373.711]},sourceFrame={w:73,d:66.5,centre:[0,-.75]},a=[35.05,406.075],z=[66.145,368.49],length=Math.hypot(z[0]-a[0],z[1]-a[1]),ux=(z[0]-a[0])/length,uz=(z[1]-a[1])/length;
const nearFront=(x,q)=>{const along=(x-a[0])*ux+(q-a[1])*uz,off=(x-a[0])*(-uz)+(q-a[1])*ux;return along>-.6&&along<length+.6&&Math.abs(off)<.8;};
function trimFace(g){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(k=>g.v.slice(i+k,i+k+3));if(ps.every(p=>nearFront(p[0],p[2])))continue;out.v.push(...g.v.slice(i,i+24));}return out;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);
 const adapter=Adapter.render,emit=b.e.add,hall=b.hall;let native=false,frontRecords=[],root;
 b.e.add=function(k,g,m,c,p,uv){if(!native&&nearFront(m[12],m[14]))return;return emit.call(this,k,g,m,c,p,uv);};
 b.hall=function(...args){const box=this.box,steps=this.steps,window=this.window,record=this.e.add;let front=false;
  this.e.add=function(k,g,m,c,p,uv){if(front){frontRecords.push({k,g,m:new Float32Array(m),c,p:[...p],uv});return;}return record.call(this,k,g,m,c,p,uv);};
  this.box=function(x,y,q,w,h,d,c,...rest){
   if(x===0&&y===.6&&q===1&&w===78&&h===1.2&&d===80)return box.call(this,0,.33,-4.45,78,.66,69.1,c,...rest);
   if(x===0&&y===12.2&&q===28.5&&w===70)front=true;
   if(c==='#e1ded2'&&h===11.3&&q===30.1&&Math.abs(x)===.42)return;
   if(c==='#e1ded2'&&h===11.3&&q===30.1){y+=.03;h-=.06;}
   if(x===0&&y===5.9&&q===25.65&&h===10.6){y+=.03;h-=.06;}
   if(x===0&&y===.16&&q===48&&w===78)return box.call(this,0,.07,48,78,.14,29,c,...rest);
   if(x===0&&y===.68&&q===45&&h===1.06)return box.call(this,0,.675,45,w,1.07,d,c,...rest);
   return box.call(this,x,y,q,w,h,d,c,...rest);
  };
  this.window=function(x,y,q,w,h,...rest){if(q===28.65&&y===3.2&&h===4.8)return window.call(this,x,3.13,q,w,4.94,...rest);return window.call(this,x,y,q,w,h,...rest);};
  this.steps=function(x,q,w,n,top){if(x!==0||q!==36.5||w!==71||n!==6||top!==1.2)return steps.call(this,x,q,w,n,top);
   box.call(this,0,.33,30.55,69,.66,.9,'#c4c5bd',10,0);
   for(let i=0;i<4;i++){const h=.14+.13*(i+1),end=34.1-i*.4;box.call(this,0,h/2,(31+end)/2,69,h,end-31,'#bcbeba',10,.05);}
  };
  try{return hall.apply(this,args);}finally{this.box=box;this.steps=steps;this.window=window;this.e.add=record;}
 };
 Adapter.render=function(bb,ff,method,source,options){if(ff.properties.id!==ID)return adapter.call(this,bb,ff,method,source,options);native=true;try{const result=adapter.call(this,bb,ff,method,source,{...options,frame,sourceFrame});root=M.multiply(M.transform([frame.centre[0],0,frame.centre[1]],result.scale,frame.r),M.transform([0,0,.75],[1,1,1],0));return {...result,entry:'hall45-single-front',entryFit:'photo-and-map-proportional'};}finally{native=false;}};
 const filtered=(k,g,c,mat,id)=>add(k,(k.startsWith('v30-walls-45-hall-wings')||k.startsWith('v30-plinth-45-hall-wings'))?trimFace(g):g,c,mat,id);
 try{const result=previous(b,f,filtered);if(!root||!frontRecords.length)throw Error('Hall45 source dispatch changed');for(const r of frontRecords)emit.call(b.e,'hall45-entry-'+r.k,r.g,M.multiply(root,r.m),r.c,[r.p[0],45,0,r.p[3]],r.uv);return result;}finally{Adapter.render=adapter;b.e.add=emit;b.hall=hall;}
};
Y.Hall45Entry={frame,sourceFrame,edge:[a,z],landingHeight:.66,forecourtHeight:.14,stairs:4};
})(YY);
