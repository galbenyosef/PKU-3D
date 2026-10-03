/* Join the three existing east-library lower masses to their actual upper
 * belt underside. No new storey, opening or facade ornament is inferred. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='relation/3249649';
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==1)return prior.call(this,b,f,add);
 const old=b.libraryEast;let bodies=0,belts=0;
 b.libraryEast=function(...args){const box=this.box;
 this.box=function(x,y,z,w,h,d,c,...rest){
  const matched=(x===-40&&z===0&&w===30&&d===50)||(x===40&&z===0&&w===30&&d===50)||(x===0&&z===-5&&w===50&&d===40);
  if(matched&&y===13&&h===25){bodies++;return box.call(this,x,13.22,z,w,25.44,d,c,...rest);}
  if(y===26.15&&h===.42&&((Math.abs(x)===40&&z===0&&w===30.66&&d===50.66)||(x===0&&z===-5&&w===50.66&&d===40.66)))belts++;
  return box.call(this,x,y,z,w,h,d,c,...rest);
 };
 try{return old.apply(this,args);}finally{this.box=box;}
 };
 let result;try{result=prior.call(this,b,f,add);}finally{b.libraryEast=old;}
 if(bodies!==3||belts!==3)throw Error('library body155 source/belt registration changed');
 return result;
};Y.LibraryBody155={scope:'three-east-lower-masses-only',oldTop:25.5,newTop:25.94,unchangedBottom:.5};
})(YY);
