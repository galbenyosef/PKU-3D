/* Close visible grey backing strips between the photo-established red fixed
 * panels and the existing green jamb / lower beam. Inner opening, door leaves,
 * opening angles and applied decoration stay fixed. Hidden seating depths fit. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render;
const S={id:'relation/14320161',panelInner:.74,panelOuter:1.45,panelBottom:.15,panelTop:3.25,jambEmbed:.02,beamEmbed:.02,backplateEmbed:.0015,source:'https://www.pkuef.org/gywm1/zjjjh/jcy75hy.htm'};
A.render=function(b,f,add){if(f.properties.pickId!==24||f.properties.id!==S.id)return previous.call(this,b,f,add);const box=b.box,own=Object.prototype.hasOwnProperty.call(b,'box');b.box=function(...q){const[x,y,z,w,h,d,c]=q;
 if(Math.abs(x)===1.07&&y===1.67&&z===.015&&w===.66&&h===3.04&&d===.16&&c==='#983f31'){q[0]=Math.sign(x)*(S.panelInner+S.panelOuter)/2;q[1]=(S.panelBottom+S.panelTop)/2;q[3]=S.panelOuter-S.panelInner;q[4]=S.panelTop-S.panelBottom;}
 else if(x===0&&y===3.015&&z===.015&&w===1.48&&h===.33&&d===.16&&c==='#983f31'){q[1]=(2.85+S.panelTop)/2;q[4]=S.panelTop-2.85;}
 // The existing backplate misses its leaf surface by 1.5 mm. Seat only the
 // plate 3 mm inward; the original ball stud and ring remain intersecting it.
 else if(Math.abs(x)===.57&&y===1.69&&z===.063&&w===.14&&h===.18&&d===.028&&c==='#3c4b3e')q[2]=.060;
 return box.apply(this,q);
};try{return previous.call(this,b,f,add);}finally{if(own)b.box=box;else delete b.box;}};
Y.Foundation24Joints168=S;
})(YY);
