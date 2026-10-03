/* Weixiuyuan15: official room lists independently establish five floors in
 * units1/3 (2023) and unit2 (2017). Facade details and entrance remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.id!=='way/876533986'||f.properties.pickId!==888)return prior.call(this,b,f,add);
 const result=A.footprint(b,f,add,{height:15,floors:5,roof:'flat',style:'dorm'});
 return{...result,strategy:'building888-five-floor-mass',officialFloors:5,heightMeasured:false,entranceVerified:false,allFacadesVerified:false};
};
})(YY);
