/* 45 dormitory south bicycle shelter. Roof outline traced from Esri zoom-19
 * imagery; existence corroborated by PKU 2022 campus works report. Elevation,
 * shallow curvature, steel section and bay spacing are display fits, not survey.
 * The separate 45A/45B double shelter (pick 489) is already modeled. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo;
const feature=Y.CAMPUS.features.find(f=>f.properties.pickId===141);
feature.properties.renderBounds46=[-398,448,-313,493];
const outline=[[-379.569,484.937],[-323.217,482.655],[-322.072,489.272],[-379.569,491.782]],height=2.65,rise=.32;
const point=(u,v)=>{const a=outline[0].map((x,k)=>x+(outline[1][k]-x)*u),b=outline[3].map((x,k)=>x+(outline[2][k]-x)*u);return a.map((x,k)=>x+(b[k]-x)*v);};
function render(b,f,add){const id=f.properties.pickId,roof=new G.Geometry(),underside=new G.Geometry(),edges=new G.Geometry(),h=v=>height+rise*Math.sin(Math.PI*v),vertex=(u,v,offset=0)=>{const p=point(u,v);return[p[0],h(v)+offset,p[1]];};
 // Two-sided 8 cm roof skin; the ground and sides remain open for bicycles.
 for(let i=0;i<24;i++)for(let j=0;j<12;j++){const u=i/24,U=(i+1)/24,v=j/12,V=(j+1)/12;roof.quad(vertex(u,v),vertex(u,V),vertex(U,V),vertex(U,v));underside.quad(vertex(u,v,-.08),vertex(U,v,-.08),vertex(U,V,-.08),vertex(u,V,-.08));}
 for(let j=0;j<12;j++){const v=j/12,V=(j+1)/12;for(const u of[0,1])edges.quad(vertex(u,v),vertex(u,V),vertex(u,V,-.08),vertex(u,v,-.08));}
 for(const v of[0,1])edges.quad(vertex(0,v),vertex(1,v),vertex(1,v,-.08),vertex(0,v,-.08));
 add('d45-338-south-roof',roof,'#899a9a',29,id);add('d45-338-south-soffit',underside,'#879493',29,id);add('d45-338-south-edge',edges,'#798582',29,id);
 const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'d45-338-south-support-'+k,...args);};
 try{b.id=id;for(let n=0;n<=12;n++)for(const v of[.10,.90]){const u=.015+n*.97/12,p=point(u,v),top=h(v)-.075;b.box(p[0],top/2,p[1],.13,top,.13,'#788e86',29);}}
 finally{b.e.add=old;}
 return{roofFootprint: outline,displayFit:true,basementPortalModeled:false};
}
A.render=function(b,f,add){const result=previous.call(this,b,f,add);if(f.properties.id==='way/272303341'&&f.properties.pickId===141)render(b,f,add);return result;};
Y.Dorm45Canopy338={outline,point,render,height,rise};
})(YY);
