/* Second Gym east courts: PKU union 2019 close views show cream trussed
 * cantilevers, green padding and transparent boards. Dimensions are display fits. */
(function(Y){'use strict';const original=Y.Sports32.render,G=Y.Geo;
function basket(b,end,s,box,beam,pane){const cream='#eee9ce',white='#efeddc',orange='#b64329',ground=.20,board=end-s*1.3,hoop=end-s*1.7;
 const bar=(a,c,w,col=cream,mat=29)=>beam(a,c,w,col,mat);
 // Rear base and padded upright stay outside the playing end line.
 box(0,ground+.16,end+s*1.10,1.10,.32,1.38,cream,29);
 box(0,ground+1.08,end+s*.65,.28,2.16,.28,cream,29);
 box(0,ground+.79,end+s*.64,.42,1.58,.42,'#328e77',29);
 bar([0,2.30,end+s*.65],[0,2.85,end-s*.38],.18);
 bar([0,2.85,end-s*.38],[0,3.05,board],.18);
 for(const x of[-.32,.32]){bar([x,ground+.12,end+s*1.55],[x,2.20,end+s*.65],.06);bar([x,2.42,end+s*.65],[x,3.88,board+s*.03],.055);bar([x,2.65,end+s*.15],[x,3.35,board+s*.03],.045);}
 for(const t of[0,.5,1]){const z=end+s*.65-s*1.95*t;bar([-.32,2.42+1.46*t,z],[.32,2.42+1.46*t,z],.045);}
 // Transparent panel, outer frame and painted aiming rectangle are distinct.
 b.mesh('basketball51-clear-backboard-'+pane,b.geo('plane',G.plane),0,3.47,board,1.72,.97,1,'#a5c1b8',44);
 for(const x of[-.9,.9])box(x,3.47,board,.055,1.05,.07,'#328e77',29);
 for(const y of[2.945,3.995])box(0,y,board,1.8,.055,.07,'#328e77',29);
 const face=board-s*.05;for(const x of[-.295,.295])box(x,3.25,face,.032,.45,.025,white,29);
 for(const y of[3.025,3.475])box(0,y,face,.59,.032,.025,white,29);
 bar([0,3.05,board],[0,3.05,hoop+s*.23],.07,orange);
 const point=(a,r,y)=>[Math.cos(a)*r,y,hoop+Math.sin(a)*r];
 for(let j=0;j<16;j++){const a=j*Math.PI/8,c=(j+1)*Math.PI/8;bar(point(a,.23,3.05),point(c,.23,3.05),.025,orange);for(const hand of[-1,1]){bar(point(a,.225,3.025),point(a+hand*.16,.16,2.82),.008,white);bar(point(a+hand*.16,.16,2.82),point(a+hand*.30,.115,2.62),.008,white);}}
}
Y.Sports32.render=function(b,f){if(f.properties.pickId!==51||f.properties.id!=='way/226703020')return original.call(this,b,f);
 let pane=0;const box=b.box,beam=b.beam,putBox=(...a)=>box.apply(b,a),putBeam=(...a)=>beam.apply(b,a);
 b.box=function(x,y,z,w,h,depth,...rest){if(y===.215&&h===.024&&rest[0]==='#bc8b78'&&rest[1]===7)rest[1]=22;if(w===.17&&h===2.9&&depth===.17){const s=Math.sign(z);basket(b,z+s*.15,s,putBox,putBeam,pane++);return;}if(w===1.8&&h===1.05&&depth===.07)return;return box.call(this,x,y,z,w,h,depth,...rest);};
 // Native beams in this exact feature are only the replaced supports and rings.
 b.beam=function(){};
 try{return original.call(this,b,f);}finally{b.box=box;b.beam=beam;}
};
})(YY);
