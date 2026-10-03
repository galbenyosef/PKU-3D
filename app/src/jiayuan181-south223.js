/* Photo-supported south colonnade of Jiayuan south colonnade.
 * Fitted, not surveyed; bay dimensions and side/end returns remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M,ID='way/444894329';
// Retain only this shallow entrance floor through the adapter's low-part filter.
const adapter=Y.ArchitectureAdapter,adapterRender=adapter.render;
adapter.render=function(b,f,method,source,options={}){if(f.properties.id===ID)options={...options,retainLowKeys:[...(options.retainLowKeys||[]),'jiayuan181-south223-floor']};return adapterRender.call(this,b,f,method,source,options);};
function subtract(a,c){const l=a.slice(0,3).map((v,i)=>Math.max(v,c[i])),h=a.slice(3).map((v,i)=>Math.min(v,c[i+3]));if(l.some((v,i)=>v>=h[i]))return[a];const out=[];let b=[...a];for(let k=0;k<3;k++){if(b[k]<l[k]){const q=[...b];q[k+3]=l[k];out.push(q);b[k]=l[k];}if(b[k+3]>h[k]){const q=[...b];q[k]=h[k];out.push(q);b[k+3]=h[k];}}return out;}
function cutBoxes(geo,cut){const mesh=new G.Geometry(),unit=G.box();if(geo.v.length%288)throw new Error('Jiayuan east expects existing box-union body');for(let j=0;j<geo.v.length;j+=288){const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(let i=j;i<j+288;i+=8)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],geo.v[i+k]);hi[k]=Math.max(hi[k],geo.v[i+k]);}for(const b of subtract([...lo,...hi],cut)){const m=M.transform([0,1,2].map(k=>(b[k]+b[k+3])/2),[0,1,2].map(k=>b[k+3]-b[k]),0);for(let i=0;i<unit.v.length;i+=8){const p=M.apply(m,[...unit.v.slice(i,i+3),1]);mesh.vertex(p.slice(0,3),unit.v.slice(i+3,i+6),unit.v.slice(i+6,i+8));}}}return mesh;}

A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const desc=Object.getOwnPropertyDescriptor(b,'jiayuan'),original=b.jiayuan;
 b.jiayuan=function(w=87.5,d=77.5){const names=['mesh','window','box','lettering'],saved=names.map(k=>[k,Object.getOwnPropertyDescriptor(this,k)]),mesh=this.mesh,win=this.window,box=this.box,letter=this.lettering;
 const south=()=>Math.abs(this.origin[2]-d/2)<1e-5&&Math.abs(this.rotation)<1e-5,half=27.0,back=d/2-1.6;
 this.mesh=function(key,g,...args){if(/^jiayuan181-portal-(wall|base)/.test(key)){const cuts=[[-half,0,back,half,14.2,d/2+1],[-half,17.0,back,half,19.5,d/2+1]];for(const cut of cuts)g=cutBoxes(g,cut);return mesh.call(this,key+'-south223',g,...args);}return mesh.call(this,key,g,...args);};
 this.window=function(x,y,z,ww,h,...args){if(south()&&x===0&&y===2.8&&ww===8&&h===4.9){const S=7/4.1,front=-1.4,tone='#303c3c',put=(x,y,z,w,h,d,c,m)=>box.call(this,x*S,y,z,w*S,h,d,c,m,.7);for(const xx of[-2.005,2.005])put(xx,2.505,front,.09,4.89,.14,tone,9);for(const yy of[.105,3.8,4.905])put(0,yy,front,4.1,.09,.14,tone,9);for(const xx of[-1,0,1])put(xx,1.9525,front,.065,3.605,.13,tone,9);for(const xx of[-1.5,-.5,.5,1.5])put(xx,1.9525,front-.035,.92,3.605,.045,'#546c76',5);put(0,4.3525,front-.035,3.92,1.015,.045,'#546c76',5);return;}if(south()&&Math.abs(x)<=23.700001&&[3,7.2,11.4].some(v=>Math.abs(v-y)<1e-6)&&ww===3.55&&h===3.65)return;if(south()&&y===17.1&&ww===3.5&&h===2.95)return;return win.call(this,x,y,z,ww,h,...args);};
 this.box=function(x,y,z,ww,h,dd,c,...args){if(south()&&c==='#424b4a'&&ww===4.1&&Math.abs(x)<=23.700001)return;if(south()&&ww===.35&&h===13.7&&Math.abs(x+2.4)<=23.700001)return;if(south()&&x===0&&y===17.1&&z===.23&&h===3.3)return;if(south()&&args[1]===.7&&(c==='#303c3c'||c==='#546c76')){x*=7/4.1;ww*=7/4.1;}return box.call(this,x,y,z,ww,h,dd,c,...args);};
 this.lettering=function(text,x,y,z,ww,h,...args){if(south()&&text==='家园食堂'){y=15.6;ww=15;h=1.35;}return letter.call(this,text,x,y,z,ww,h,...args);};
 try{original.call(this,w,d);}finally{for(const[k,descriptor]of saved)if(descriptor)Object.defineProperty(this,k,descriptor);else delete this[k];}
 const emitter=Object.getOwnPropertyDescriptor(this.e,'add'),emit=this.e.add;
 this.e.add=function(k,...args){return emit.call(this,'jiayuan181-south223-'+k,...args);};
 try{this.local(0,0,d/2,0,()=>{
 const brick='#898e87',stone='#c6c7bc',dark='#303c3c',glass='#546c76';
 // Repeated high piers. Central centre-to-centre bays are 6.4:12.8:6.4; width,
 // height and set-back are fits constrained by the photo-fitted central portal.
 for(const x of[-25.6,-19.2,-12.8,-6.4,6.4,12.8,19.2,25.6]){this.box(x,7.13,.18,2.0,14.14,1.25,brick,1,.65);this.box(x,1.97,.19,2.08,3.82,1.29,stone,10);}
 this.box(0,15.6,-.5,half*2,2.8,2.2,brick,1,.65);
 this.box(0,14.12,-.48,half*2,.16,2.18,stone,10);
 // Upper pale guard and finite, recessed glazing. No hidden room layout.
 this.box(0,6.44,-.45,half*2,2.92,.34,stone,10);
 this.box(0,7.95,-.45,half*2,.10,.43,'#727e76',9);
 const spans=[[-24.6,-20.2],[-18.2,-13.8],[-11.8,-7.4],[-5.4,5.4],[7.4,11.8],[13.8,18.2],[20.2,24.6]];
 for(const[a,c]of spans){const x=(a+c)/2,ww=c-a;
 this.box(x,10.24,-1.435,ww,4.46,.045,glass,5);
 for(const xx of[a,c])this.box(xx,10.24,-1.38,.065,4.55,.12,dark,9);
 for(const yy of[8.01,10.65,12.47])this.box(x,yy,-1.38,ww,.065,.12,dark,9);
 }
 // Fixed ground-side glazing is kept separate from the central
 // 7-wide door; no extra handles or unverified additional door leaves.
 for(const[a,c]of[[-24.6,-20.2],[-18.2,-13.8],[-11.8,-7.4],[-5.4,-3.5],[3.5,5.4],[7.4,11.8],[13.8,18.2],[20.2,24.6]]){const x=(a+c)/2,ww=c-a;
 this.box(x,2.50,-1.435,ww,4.82,.045,glass,5);
 for(const xx of[a,c])this.box(xx,2.50,-1.38,.065,4.9,.12,dark,9);
 for(const yy of[.09,3.8,4.91])this.box(x,yy,-1.38,ww,.065,.12,dark,9);
 }
 for(let x=-24;x<=24;x+=6){this.box(x,18.25,-1.435,5.94,2.4,.045,glass,5);this.box(x-3,18.25,-1.38,.065,2.5,.12,dark,9);}
 this.box(0,19.46,-.45,half*2,.08,2.2,stone,10);
 // One continuous level floor owns the opened recess, including the central door.
 this.mesh('floor',G.box(),0,.03,-.75,half*2,.06,1.7,stone,10);
 });}finally{if(emitter)Object.defineProperty(this.e,'add',emitter);else delete this.e.add;}
 };
 try{return prior.call(this,b,f,add);}finally{if(desc)Object.defineProperty(b,'jiayuan',desc);else delete b.jiayuan;}
};Y.Jiayuan181South223={id:ID,scope:'south central colonnade and proportion-fitted central portal; end returns unknown',subtract,cutBoxes};})(YY);
