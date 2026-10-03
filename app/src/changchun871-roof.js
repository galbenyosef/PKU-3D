/* 63's own orthophoto: two continuous red gable sections, not the terrace
 * roofs of 60/61/62. Five occupied storeys are independently evidenced.
 * Heights and central division width are fits within the former envelope. */
(function(Y){'use strict';const previous=Y.Architecture30.render,G=Y.Geo,M=Y.M;
const EAVE=13.10,RIDGE=15.675,JOINT=.15;
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==871||f.properties.id!=='way/849765893')return previous.call(this,b,f,add);
 const emit=b.e.add;b.e.add=function(k,g,m,c,p,uv){if(p[1]===871&&(k.startsWith('v30-flat-roof-871-')||(k==='box'&&p[0]===24&&m[13]>EAVE)))return;return emit.call(this,k,g,m,c,p,uv);};
 let result;try{result=previous.call(this,b,{...f,properties:{...f.properties,height:EAVE,floors:5,roofTreatment:'flat'}},add);}finally{b.e.add=emit;}
 const[a,d,c,z]=f.geometry.coordinates[0],w=Math.hypot(z[0]-a[0],z[1]-a[1]),depth=Math.hypot(d[0]-a[0],d[1]-a[1]),half=.18/w;
 const xy=(s,t,y)=>[(a[0]*(1-s)+z[0]*s)*(1-t)+(d[0]*(1-s)+c[0]*s)*t,y,(a[1]*(1-s)+z[1]*s)*(1-t)+(d[1]*(1-s)+c[1]*s)*t];
 const h=t=>EAVE+(RIDGE-EAVE)*(1-Math.abs(2*t-1)),roof=new G.Geometry(),ends=new G.Geometry(),joint=new G.Geometry();
 function tri(mesh,ps,down=false){let p=ps.map(q=>xy(...q)),uv=ps.map(q=>[q[0]*w/.42,q[1]*depth/.42]);if(!down){[p[1],p[2]]=[p[2],p[1]];[uv[1],uv[2]]=[uv[2],uv[1]];}mesh.tri(...p,uv);}
 function patch(mesh,s0,s1,t0,t1,offset=0){const n=Math.max(1,Math.ceil((s1-s0)*w/.65)),q=Math.max(1,Math.ceil((t1-t0)*depth/.5));for(let i=0;i<n;i++)for(let j=0;j<q;j++){const x=s0+(s1-s0)*i/n,X=s0+(s1-s0)*(i+1)/n,t=t0+(t1-t0)*j/q,T=t0+(t1-t0)*(j+1)/q,ps=[[x,t,h(t)+offset],[X,t,h(t)+offset],[X,T,h(T)+offset],[x,T,h(T)+offset]];tri(mesh,ps.slice(0,3));tri(mesh,[ps[0],ps[2],ps[3]]);}}
 for(const[s0,s1]of[[0,.5-half],[.5+half,1]])for(const[t0,t1]of[[0,.5],[.5,1]])patch(roof,s0,s1,t0,t1);
 // Vertical ends meet the original wall at the fitted eave and close both
 // roof triangles; no rectangular hip or unregistered dormer is substituted.
 for(const s of[0,1]){const p=[xy(s,0,EAVE),xy(s,.5,RIDGE),xy(s,1,EAVE)];if(s===1)ends.tri(p[0],p[1],p[2],[[0,0],[.5,1],[1,0]]);else ends.tri(p[2],p[1],p[0],[[1,0],[.5,1],[0,0]]);}
 for(const[t0,t1]of[[0,.5],[.5,1]]){patch(joint,.5-half,.5+half,t0,t1,JOINT);const l=.5-half,r=.5+half;
 // The narrow light division follows both slopes, including its underside.
 tri(joint,[[l,t0,h(t0)],[r,t0,h(t0)],[r,t1,h(t1)]],true);tri(joint,[[l,t0,h(t0)],[r,t1,h(t1)],[l,t1,h(t1)]],true);
 for(const s of[l,r]){const p=[xy(s,t0,h(t0)),xy(s,t1,h(t1)),xy(s,t1,h(t1)+JOINT),xy(s,t0,h(t0)+JOINT)];if(s===l)joint.quad(...p);else joint.quad(p[1],p[0],p[3],p[2]);}}
 for(const t of[0,1]){const p=[xy(.5-half,t,h(t)),xy(.5+half,t,h(t)),xy(.5+half,t,h(t)+JOINT),xy(.5-half,t,h(t)+JOINT)];if(t===1)joint.quad(...p);else joint.quad(p[1],p[0],p[3],p[2]);}
 add('roof871-two-red-gables',roof,'#ad6758',19,871);add('roof871-white-gable-ends',ends,'#dddcd1',18,871);add('roof871-central-division',joint,'#9b9f91',24,871);
 return{...result,roof:'63-registered-two-gable-sections',roofVerified:false,mainRoofVerified:true,roofRise:RIDGE-EAVE,roofHeightMeasured:false,floors:5,floorsEvidence:'2022-official-fifth-floor-allocation-and-native-aerial',bodyHeight:EAVE,roofMaximum:RIDGE+JOINT,unregisteredDormers:true};
};})(YY);
