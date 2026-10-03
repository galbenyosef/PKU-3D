/* Weixiuyuan26: official 2024 map locates this independent bar; the 2023
 * allocation table gives totalFloors=5 for units1 and2. Height remains fitted.
 * No entrance or facade pattern is asserted by this floor-count correction. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.id!=='way/876533988'||f.properties.pickId!==890)return prior.call(this,b,f,add);
 const result=A.footprint(b,f,add,{height:15,floors:5,roof:'flat',style:'dorm'});
 return{...result,strategy:'building890-five-floor-mass',officialFloors:5,heightMeasured:false,entranceVerified:false,allFacadesVerified:false};
};
})(YY);
