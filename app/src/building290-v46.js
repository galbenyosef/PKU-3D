/* 290: north hall of the paired grey-tile buildings, registered from four
 * Baidu actual camera positions. Heights, bay rhythm and hidden lower panels
 * are display fits; the perimeter gate is not a door in this building. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/880624095',H={eave:4.15,ridge:7.25};
function render(b,f,add){
 const r=f.geometry.coordinates[0],id=f.properties.pickId;
 // Bilinear registration retains all four source corners including the shared
 // south edge with 291. Roof and tile caps never project across that edge.
 const point=(u,y,v)=>{const n=[r[0][0]+(r[3][0]-r[0][0])*u,r[0][1]+(r[3][1]-r[0][1])*u],s=[r[1][0]+(r[2][0]-r[1][0])*u,r[1][1]+(r[2][1]-r[1][1])*u];return[n[0]+(s[0]-n[0])*v,y,n[1]+(s[1]-n[1])*v];};
 const height=v=>{const t=Math.abs(v-.5)*2;return H.eave+(H.ridge-H.eave)*Math.pow(1-t,1.55)+.18*Math.pow(t,10);};
 const mesh=()=>new Y.Geo.Geometry(),put=(key,g,c,m)=>add('290-'+key,g,c,m,id),quad=(g,a,c,d,e)=>g.quad(point(...a),point(...c),point(...d),point(...e));
 const walls=mesh(),roof=mesh(),tiles=mesh(),gables=mesh(),wood=mesh(),infill=mesh(),ridge=mesh();
 // North wall is recessed behind the observed red posts, without an invented
 // door aperture. The unseen south wall is deliberately plain.
 for(const [v,u0,u1,c]of[[.07,0,1,0],[1,1,0,0]])quad(walls,[u1,0,v],[u0,0,v],[u0,H.eave,v],[u1,H.eave,v]);
 const n=32;
 for(const u of[0,1])for(let k=0;k<n;k++){const v=k/n,w=(k+1)/n;if(u===0)quad(gables,[u,0,v],[u,0,w],[u,height(w)-.07,w],[u,height(v)-.07,v]);else quad(gables,[u,0,w],[u,0,v],[u,height(v)-.07,v],[u,height(w)-.07,w]);}
 for(let k=0;k<n;k++){const v=k/n,w=(k+1)/n;quad(roof,[1,height(v),v],[0,height(v),v],[0,height(w),w],[1,height(w),w]);}
 // Raised half-round tile rolls, not a flat roof texture. Segments follow the
 // changing slope. Tight ends prevent the shared valley from crossing 291.
 for(let row=0;row<90;row++){const u=(row+.5)/90,du=.0034;for(let k=0;k<n;k++){const v=k/n,w=(k+1)/n;for(let j=0;j<5;j++){const a=j*Math.PI/5,c=(j+1)*Math.PI/5;quad(tiles,[u+du*Math.cos(a),height(v)+.07*Math.sin(a)+.012,v],[u+du*Math.cos(c),height(v)+.07*Math.sin(c)+.012,v],[u+du*Math.cos(c),height(w)+.07*Math.sin(c)+.012,w],[u+du*Math.cos(a),height(w)+.07*Math.sin(a)+.012,w]);}}}
 const outer=(g,a,c,d,e)=>quad(g,e,d,c,a);
 const prism=(g,u0,u1,y0,y1,v0,v1)=>{outer(g,[u0,y0,v0],[u1,y0,v0],[u1,y1,v0],[u0,y1,v0]);outer(g,[u1,y0,v1],[u0,y0,v1],[u0,y1,v1],[u1,y1,v1]);outer(g,[u0,y0,v1],[u0,y0,v0],[u0,y1,v0],[u0,y1,v1]);outer(g,[u1,y0,v0],[u1,y0,v1],[u1,y1,v1],[u1,y1,v0]);outer(g,[u0,y1,v0],[u1,y1,v0],[u1,y1,v1],[u0,y1,v1]);};
 prism(ridge,-.005,1.005,H.ridge-.08,H.ridge+.16,.488,.512);
 // Narrow raised gable coping follows the same curved silhouette.
 for(const u of[.006,.994])for(let k=0;k<n;k++){const v=k/n,w=(k+1)/n;quad(ridge,[u-.006,height(v)+.025,v],[u+.006,height(v)+.025,v],[u+.006,height(w)+.13,w],[u-.006,height(w)+.13,w]);}
 // Material 18 supplies staggered grey-brick mortar in physical surface UV.
 // Do not overlay continuous horizontal stripes: these read as board cladding.
 // Seven fitted posts and the continuous beam are confined to the visible
 // north long elevation. No repeated modern upper-storey window grid remains.
 for(let k=0;k<7;k++){const u=.045+k*.91/6;for(let j=0;j<12;j++){const a=j*Math.PI/6,c=(j+1)*Math.PI/6;quad(wood,[u+.008*Math.cos(a),0,.025+.014*Math.sin(a)],[u+.008*Math.cos(a),4.03,.025+.014*Math.sin(a)],[u+.008*Math.cos(c),4.03,.025+.014*Math.sin(c)],[u+.008*Math.cos(c),0,.025+.014*Math.sin(c)]);}}
 prism(wood,.012,.988,3.82,4.10,.012,.055);prism(wood,.012,.988,3.43,3.57,.021,.065);
 for(let k=0;k<6;k++){const u=.06+k*.91/6,w=u+.12;prism(infill,u,w,1.0,3.36,.068,.074);for(let j=1;j<4;j++)prism(wood,u+(w-u)*j/4-.0015,u+(w-u)*j/4+.0015,1.0,3.36,.063,.076);prism(wood,u,w,2.9,2.96,.063,.076);}
 put('plain-recessed-walls',walls,'#716a59',24);put('brick-gables',gables,'#a4a093',18);put('curved-grey-roof',roof,'#555950',2);put('physical-tile-rolls',tiles,'#737568',2);put('ridge-and-gable-coping',ridge,'#8b8c7d',2);put('north-red-timber',wood,'#71352b',24);put('north-dark-infill',infill,'#434b40',24);
 return{strategy:'building290-v46',roof:'curved-gable',roofAxis:'east-west',bodyHeight:H.eave,roofRise:H.ridge-H.eave,sourceOutline:true,visibleStoreys:1,dimensionFitted:true,postCountVerified:false,entranceVerified:false,sharedSouthEdgePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous.call(this,b,f,add);};Y.Building290={id:ID,render,heights:H};
})(YY);
