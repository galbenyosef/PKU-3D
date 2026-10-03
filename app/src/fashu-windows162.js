/* Fashu983 north floors2/3: photo-specific wide fixed panes and narrow side
 * sashes. Observer faces south: photograph left is world east (+x), whereas
 * source columns run west->east. No opening-angle or hidden facade inference. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/1031892013';
const a=[-942.611,-137.616],c=[-903.863,-140.203],L=Math.hypot(c[0]-a[0],c[1]-a[1]),u=[(c[0]-a[0])/L,(c[1]-a[1])/L],columns=[.070,.170,.270,.370,.470,.570,.680,.790,.900];
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==983)return previous.call(this,b,f,add);
 const old=b.mesh,own=Object.prototype.hasOwnProperty.call(b,'mesh');
 b.mesh=function(key,g,x,y,z,w,h,d,color,mat,part,...tail){
  if(!/^194-north-floor[23]-mullion$/.test(key))return old.call(this,key,g,x,y,z,w,h,d,color,mat,part,...tail);
  const t=((this.origin[0]-a[0])*u[0]+(this.origin[2]-a[1])*u[1])/L,i=columns.reduce((best,v,j)=>Math.abs(v-t)<Math.abs(columns[best]-t)?j:best,0);
  if(Math.abs(columns[i]-t)>.002)return old.call(this,key,g,x,y,z,w,h,d,color,mat,part,...tail);
  const wide=i>=3&&i<=5,ww=L*(wide?.075:.049),ratio=wide?.22:.30,sides=i===4?[-1,1]:[i<=2?-1:i>=6?1:i===3?1:-1];
  const put=(suffix,xx,yy,zz,W,H,D)=>old.call(this,'fashu-windows162-'+suffix,this.geo('fashu-windows162-'+suffix,Y.Geo.box),xx,yy,zz,W,H,D,color,mat,part,...tail);
  for(const side of sides){const divider=side*ww*(.5-ratio),edge=side*(ww/2-.045),inner=divider+side*.045,mid=(edge+inner)/2;
   put('divider',divider,y,z,.045,h,d);
   // Inset closed sash ring expresses the observed narrow framed pane;
   // no duplicated glass sheet and no speculative opened leaf.
   const lo=Math.min(edge,inner),hi=Math.max(edge,inner),bottom=y-h/2+.055,top=y+h/2-.055;
   for(const xx of[lo,hi])put('sash-stile',xx,(bottom+top)/2,z+.014,.022,top-bottom,.045);
   for(const yy of[bottom,top])put('sash-rail',mid,yy,z+.014,hi-lo-.022,.022,.045);
  }
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.mesh=old;else delete b.mesh;}
};Y.FashuWindows162={id:ID,columns,narrowFraction:.30,wideNarrowFraction:.22,photoLeftIsWorldEast:true,fit:true};
})(YY);
