/* Shaohai: a sunken water/ground section, constrained by the mapped ring.
 * April 2018 official photographs show retained stone banks above the water.
 * Heights are fitted; corridor placement and individual stones remain unknown. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,ID='way/679485582',PICK=246;
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID&&f.properties.pickId===PICK),ring=feature.geometry.coordinates[0],H={bottom:-.85,water:-.45,top:.25},width=1.1;
function offsets(){const ps=ring.slice(0,-1),sign=Math.sign(F.area(ring)),inner=[],outer=[];for(let i=0;i<ps.length;i++){const prev=ps[(i+ps.length-1)%ps.length],next=ps[(i+1)%ps.length],dx=next[0]-prev[0],dz=next[1]-prev[1],len=Math.hypot(dx,dz),nx=-dz/len*sign,nz=dx/len*sign;inner.push([ps[i][0]+nx*width/2,ps[i][1]+nz*width/2]);outer.push([ps[i][0]-nx*width/2,ps[i][1]-nz*width/2]);}inner.push(inner[0]);outer.push(outer[0]);return{inner,outer};}
const {inner,outer}=offsets(),basin={type:'Polygon',coordinates:[ring]},bank={type:'Polygon',coordinates:[outer,inner]};
function render(f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return false;
 // Preserve the source water triangulation and x/z coordinates; only its level changes.
 add('water-'+PICK,F.surface(basin,H.water),'#689a91',4,PICK);
 add('shaohai246-bed',F.surface(basin,H.bottom),'#757b67',10,PICK);
 add('shaohai246-rim',F.surface(bank,H.top),'#aeb4a4',10,PICK);
 add('shaohai246-bank',F.walls(bank,H.bottom,H.top),'#858c80',10,PICK);
 const underside=F.surface(bank,H.bottom);for(let i=0;i<underside.v.length;i+=24){const a=underside.v.slice(i,i+8),c=underside.v.slice(i+16,i+24);for(let j=0;j<8;j++){underside.v[i+j]=c[j];underside.v[i+16+j]=a[j];}for(let k=0;k<24;k+=8)for(let j=3;j<6;j++)underside.v[i+k+j]*=-1;}
 add('shaohai246-bank-bottom',underside,'#858c80',10,PICK);
 return true;
}
const descriptor={id:ID,ring,clip:Y.Water244.createClip(ring)};
Y.Shaohai246={id:ID,pickId:PICK,ring,H,width,inner,outer,descriptor,render};
})(YY);
