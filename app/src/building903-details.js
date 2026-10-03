/* Chengzeyuan102: 2022 numbered road plan + official2025 three-floor flat
 * roof description + native orthophoto. 9.3m body is a fit, not a measurement.
 * No inferred door or rooftop equipment. Load after architecture-v30. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/916931891',H=9.3;
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==903)return prior.call(this,b,f,add);
 const addSurface=(k,g,c,mat,id)=>{if(k.startsWith('v30-flat-roof-903-'))g=Y.Footprints.profiledSurface(f.geometry,()=>H,2.6);return add(k,g,c,mat,id);};
 const result=A.footprint(b,f,addSurface,{key:'building903-reference-flat',height:H,floors:3,roof:'flat',style:'modern'});
 return {...result,strategy:'building903-three-floor-flat',officialFloors:3,heightMeasured:false,entranceVerified:false,facadesVerified:false,heightFit:'3-storey display fit, body9.3m; parapet+0.825m'};
};
})(YY);
