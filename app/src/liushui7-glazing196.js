/* Complete south-porch lower glazing: close the open strip below its retained
 * head rail. Only the pane top extends 10 mm; 5 mm embeds in the existing rail.
 * Keep the photographed entry, leaves, frame, opening and platform unchanged. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render;
A.render=function(b,f,add){
 if(f.properties.pickId!==7||f.properties.id!=='relation/11975584')return previous.call(this,b,f,add);
 const desc=Object.getOwnPropertyDescriptor(b,'box'),box=b.box;let count=0;
 b.box=function(...args){
  if(args[1]===1.62&&args[2]===-3.65&&args[4]===2.735&&args[5]===.045&&args[6]==='#506563'&&args[7]===28){args[1]=1.625;args[4]=2.745;count++;}
  return box.apply(this,args);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(desc)Object.defineProperty(b,'box',desc);else delete b.box;}
 if(count!==10)throw Error('Liu Shui south-porch glazing family changed');
 return result;
};
})(YY);
