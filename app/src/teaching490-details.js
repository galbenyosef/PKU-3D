/* Four teaching building only. The official April2018 courtyard photograph
 * registers its west elevation beside Teaching3. Visible upper windows are
 * paired narrow casements, with a high transom only on the white top floor.
 * Total bay positions and hidden entrance remain inherited, not verified. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.lowTeaching;
P.lowTeaching=function(p,w,d){if(p.id!==75)return previous.call(this,p,w,d);const window=this.window,box=this.box,H=p.h-.7,fh=H/p.floors;let changed=0,dividers=false;
 this.window=function(x,y,z,ww,hh,r,tone,...rest){if(z>=0||Math.abs(r-Math.PI)>1e-7||y<H*.4||x< -d/2+2.1+2*4.15-1e-6)return window.call(this,x,y,z,ww,hh,r,tone,...rest);
  changed++;const gap=.20,pane=(ww-gap)/2;
  if(!dividers){dividers=true;for(let j=2;j<7;j++)box.call(this,-d/2+2.1+(j+.5)*4.15,H*.70,z+.065,.32,H*.60,.09,'#dbddd1',10,.7);}
  // Preserve original source size and clipping path. Two complete perimeter
  // frames replace one generic central cross; no opaque cover over old panes.
  for(const sign of[-1,1])window.call(this,x+sign*(pane+gap)/2,y,z,pane,hh,r,'#aab2ae',false);
  if(y>H-fh){this.local(x,y,z,r,()=>{for(const sign of[-1,1])box.call(this,sign*(pane+gap)/2,hh*.32,.015,pane,.06,.14,'#aab2ae',9,.7);});}
 };
 try{return previous.call(this,p,w,d);}finally{this.window=window;Y.Teaching490={changedSourceWindows:changed,hiddenEntranceVerified:false,wholeBuildingComplete:false};}
};})(YY);
