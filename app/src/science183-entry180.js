/* Huang Ting Fang west entry: visible perimeter glazing only.
 * PKUEF 2250x1164 original and independent 2023 CTDSB photograph show a
 * narrow upper light and two glazed bays on either side of a central curtain.
 * Ten aligned bays and ~60% central clear width are photographic fits, not
 * measured dimensions. Curtain-hidden leaves/hardware are not reconstructed.
 * Retain the registered opening, platform, canopy and finite vestibule. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/444991872';
const layout={half:3.95,pitch:.79,bottom:1.38,head:4.72,transom:3.98,bar:.06,depth:.10,plane:-.015,glassPlane:-.025,glassDepth:.03,sideRails:[2.02,2.37],centralHalf:2.37};
function append(b){const fr=Y.ScienceTeaching183Details.frame(),old=b.id,L=layout,frame='#506166',glass='#648b9b';b.id=183;
 const box=(k,x,y,w,h,c,mat,z=L.plane,d=L.depth)=>b.mesh('s183-entry180-'+k,b.geo('s183-entry180-box',G.box),x,y,z,w,h,d,c,mat);
 const pane=(k,x0,x1,y0,y1)=>box('glass-'+k,(x0+x1)/2,(y0+y1)/2,x1-x0,y1-y0,glass,28,L.glassPlane,L.glassDepth);
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  // Existing head and jambs remain the exterior perimeter. New bars embed
  // slightly into their actual envelopes, never float ahead of the panes.
  box('transom',0,L.transom,7.94,L.bar,frame,29);
  for(let i=1;i<10;i++)box('upper-mullion',-L.half+i*L.pitch,(L.transom+L.head)/2,L.bar,L.head-L.transom+.02,frame,29);
  for(let i=0;i<10;i++)pane('upper-'+i,-L.half+i*L.pitch+(i===0?.01:.02),-L.half+(i+1)*L.pitch-(i===9?.01:.02),L.transom+.02,L.head+.01);
  for(const sign of[-1,1]){
   for(const u of[3.16,2.37])box('side-mullion',sign*u,(L.bottom+L.transom)/2,L.bar,L.transom-L.bottom+.03,frame,29);
   box('side-sill',sign*3.16,L.bottom+.025,1.64,.05,frame,29);
   // Two low crossbars are readable only in the bay adjoining the curtain;
   // the outer bay is occluded, so do not copy this subdivision across it.
   for(const y of L.sideRails)box('side-rail',sign*2.765,y,.83,L.bar,frame,29);
   const ys=[L.bottom+.04,...L.sideRails,L.transom];
   for(let j=0;j<2;j++)for(let k=0;k<(j===0?3:1);k++){
    const x0=2.37+j*L.pitch+.02,x1=2.37+(j+1)*L.pitch-(j===1?.01:.02);
    pane('side-'+sign+'-'+j+'-'+k,sign>0?x0:-x1,sign>0?x1:-x0,j===0?ys[k]+(k?.02:0):L.bottom+.04,j===0?ys[k+1]-.02:L.transom-.02);
   }
  }
 });}finally{b.id=old;}
}
A.render=function(b,f,add){const result=previous.call(this,b,f,add);if(f.properties.id===ID)append(b);return result;};
Y.Science183Entry180={id:ID,layout,centralLeavesVerified:false};
})(YY);
