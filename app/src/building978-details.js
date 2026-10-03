/* Chengze eastern blue-grey L building, official 2023 museum north cube:
 * the unobscured south upper elevation has seven pale-framed openings.
 * Horizontal fit uses the visible wall corners; lower windows and entry stay
 * unresolved behind the foreground historic roof. Preserve the six-face roof. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.pickId!==978)return prior.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'window'),window=b.window;
 let emitted=false;
 b.window=function(x,y,z,w,h,r,col){
  if(y>3&&y<5&&Math.cos(r)>.95&&z>-181){
   if(!emitted){emitted=true;
    const ring=Y.Footprints.polygons(f.geometry)[0][0],a=ring[4],c=ring[5];
    for(let j=0;j<7;j++){const t=.15+j*.125;
     window.call(this,a[0]+(c[0]-a[0])*t+Math.sin(r)*.045,y,a[1]+(c[1]-a[1])*t+Math.cos(r)*.045,2.25,h,r,'#d9ded5');
    }
   }return;
  }
  return window.call(this,x,y,z,w,h,r,col);
 };
 try{return {...prior.call(this,b,f,add),southUpperWindows:7,southUpperFrameTone:'pale-photo-fit',entryStillUnverified:true};}
 finally{if(own)b.window=window;else delete b.window;}
};
})(YY);
