/* No.57 only: the numbered 2024 photograph places the screen coping above
 * the address plaque and just below the door-leaf top, with eight staggered
 * cross-hole courses. Height/brick pitch remain fits, not surveyed dimensions.
 * Keep the inherited screen footprint, gate, No.58 and Adapter registration. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='relation/11823278';
const spec={height:2.45,rows:48,columnPitch:.048,base:.40,seam:.006};
function screen57(length){
 const h=spec.height,cols=Math.floor(length/spec.columnPitch),dx=length/cols,dy=(h-.47)/spec.rows;
 this.box(0,.20,0,length,.40,.29,'#858b82',18,.2);
 for(let row=0;row<spec.rows;row++)for(let col=0;col<cols;col++){
  const shift=Math.floor(row/6)%2*3,cx=(col+shift)%6,cy=row%6;
  // Only complete crosses: the two screen ends retain masonry against piers.
  const start=col-cx,complete=start+1>=1&&start+4<=cols-2;
  const hole=complete&&(((cx===2||cx===3)&&cy>=1&&cy<=4)||((cy===2||cy===3)&&cx>=1&&cx<=4));
  if(hole)continue;
  this.heritageBox('heritage-screen-brick',-length/2+(col+.5)*dx,.40+(row+.5)*dy,0,dx-spec.seam,dy-spec.seam,.27,(col+row)%5===0?'#9a9d91':'#a4a49b',22,.25);
 }
 // Close the inherited gap between the upper brick course and coping bottom.
 const bottom=h-.07-spec.seam/2,top=h-.045;
 this.box(0,(bottom+top)/2,0,length,top-bottom,.27,'#a4a49b',22,.25);
 this.box(0,h+.03,0,length+.07,.15,.37,'#81897c',18,.35);
}
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==5)return prior.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'heritageCourt'),old=b.heritageCourt;
 b.heritageCourt=function(p,...args){
  if(p.houseNumber!==57)return old.call(this,p,...args);
  const had=Object.prototype.hasOwnProperty.call(this,'heritageScreen'),original=this.heritageScreen;
  this.heritageScreen=screen57;
  try{return old.call(this,p,...args);}finally{if(had)this.heritageScreen=original;else delete this.heritageScreen;}
 };
 try{return prior.call(this,b,f,add);}finally{if(own)b.heritageCourt=old;else delete b.heritageCourt;}
};
Y.Yannan57Screen214={...spec,id:ID};
})(YY);
