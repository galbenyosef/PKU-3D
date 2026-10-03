/* Representative broadleaf crowns inside two reviewed aerial crown clusters.
   Indicative placement, not a surveyed trunk/species or a complete lawn census. */
(function(Y){'use strict';
const ID=838507,MIDDLE_ID=838513,point=[302.83,-40.32],middlePoint=[322,-26],ground=.08;
function trees(D){
 const lawn=D.features.find(f=>f.properties.id==='way/1009052048');
 if(!lawn||!Y.Footprints.inside(point,lawn.geometry))return [];
 const result=[{id:ID,point:point.slice(),height:10.5,type:'broad',crownRadius:5.5,zone:'way/1009052048',zoneLabel:'385草坪西侧已见冠簇',basis:'官方完工照支持成熟阔叶形态；航片西簇内一株代表冠，落点与高度近似，非单株普查或整片复原。'}];
 if(Y.Footprints.inside(middlePoint,lawn.geometry))result.push({id:MIDDLE_ID,point:middlePoint.slice(),height:9.5,type:'broad',crownRadius:4.5,zone:'way/1009052048',zoneLabel:'385草坪中部已见冠簇',basis:'航片中部紧凑冠枝团内一株代表冠；落点与高度近似，不将东南长枝影重复计为南株，非单株普查。'});
 return result;
}
const previous=Y.Builder.prototype.tree;
Y.Builder.prototype.tree=function(x,z,h,type,id,metadata){
 if(id!==ID&&id!==MIDDLE_ID)return previous.call(this,x,z,h,type,id,metadata);
 // Tree46 deliberately resets its origin. Translate only this tree's final
 // instances, keeping shared geometry and all established tree seeds intact.
 const original=this.e.add,descriptor=Object.getOwnPropertyDescriptor(this.e,'add');
 this.e.add=function(k,g,m,c,p,uv){const mm=new Float32Array(m);mm[13]+=ground;return original.call(this,k,g,mm,c,p,uv);};
 try{const result=previous.call(this,x,z,h,type,id,metadata),record=this.registry.get(id);if(record)record.center[1]=ground;return result;}
 finally{if(descriptor)Object.defineProperty(this.e,'add',descriptor);else delete this.e.add;}
};
Y.Lawn385Tree307={id:ID,middleId:MIDDLE_ID,trees,ground};
})(YY);
