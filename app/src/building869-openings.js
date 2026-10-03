/* Existing61A north door four leaves follow the first-floor plan; south outer
 * frames follow its own courtyard photo. Internal subdivisions stay unresolved. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/849765891';
function surround(){const g=new Y.Geo.Geometry(),bar=(x,y,w,h)=>{const box=Y.Geo.box(),m=Y.M.transform([x,y,1],[w,h,1],0);for(let i=0;i<box.v.length;i+=8)g.vertex(Y.M.apply(m,[...box.v.slice(i,i+3),1]).slice(0,3),box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));};bar(-.488,0,.024,1.02);bar(.488,0,.024,1.02);bar(0,.498,1,.024);return g;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);const mesh=b.mesh;
 b.mesh=function(key,g,...args){const result=mesh.call(this,key,g,...args);
  if(key==='144-south-window-fit'){const u=(this.origin[0]+681.318)*.9937702097-(this.origin[2]+26.015)*.1114485099;
   if(u>48.8&&u<71.45&&args[1]<15.35){const next=args.slice();next[6]='#e1e0d7';next[7]=24;const k='building869-east-south-window-surround';mesh.call(this,k,this.geo(k,surround),...next);}
  }
  if(key==='144-61a-entry-divider')for(const side of[-1,1]){const next=args.slice();next[0]+=side*.805;mesh.call(this,'building869-north-door-quarter-stile',g,...next);}
  return result;
 };try{return previous(b,f,add);}finally{b.mesh=mesh;}
};
})(YY);
