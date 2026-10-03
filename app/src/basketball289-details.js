/* Five-Four north courts: 2024 PKU photographs support cantilever stands and
 * continuous end-court markings. Existing layout/dimensions remain display fits. */
(function(Y){'use strict';const original=Y.Sports32.render,G=Y.Geo;
function basket(b,end,s,box,beam,pane){const green='#499867',white='#e1e7db',orange='#dd793d',ground=.20,board=end-s*1.3,hoop=end-s*1.7;
 const bar=(a,c,w,col=green,mat=29)=>beam(a,c,w,col,mat);
 // Rear base and padded upright stay outside the playing end line.
 box(0,ground+.16,end+s*1.10,1.10,.32,1.38,green,29);
 box(0,ground+1.08,end+s*.65,.28,2.16,.28,green,29);
 box(0,ground+.79,end+s*.64,.42,1.58,.42,'#337b64',29);
 bar([0,2.30,end+s*.65],[0,3.10,end-s*.38],.22);
 bar([0,3.10,end-s*.38],[0,3.10,board],.22);
 for(const x of[-.32,.32]){bar([x,ground+.12,end+s*1.55],[x,2.20,end+s*.65],.06);bar([x,3.11,end-s*.27],[x,3.88,board+s*.03],.045);}
 // Transparent panel, outer frame and painted aiming rectangle are distinct.
 b.mesh('basketball289-clear-backboard-'+pane,b.geo('plane',G.plane),0,3.47,board,1.72,.97,1,'#a5c1b8',44);
 for(const x of[-.9,.9])box(x,3.47,board,.055,1.05,.07,white,29);
 for(const y of[2.945,3.995])box(0,y,board,1.8,.055,.07,white,29);
 const face=board-s*.05;for(const x of[-.295,.295])box(x,3.25,face,.032,.45,.025,white,29);
 for(const y of[3.025,3.475])box(0,y,face,.59,.032,.025,white,29);
 bar([0,3.05,board],[0,3.05,hoop+s*.23],.07,orange);
 const point=(a,r,y)=>[Math.cos(a)*r,y,hoop+Math.sin(a)*r];
 for(let j=0;j<16;j++){const a=j*Math.PI/8,c=(j+1)*Math.PI/8;bar(point(a,.23,3.05),point(c,.23,3.05),.025,orange);for(const hand of[-1,1]){bar(point(a,.225,3.025),point(a+hand*.16,.16,2.82),.008,white);bar(point(a+hand*.16,.16,2.82),point(a+hand*.30,.115,2.62),.008,white);}}
}
Y.Sports32.render=function(b,f){if(f.properties.pickId!==289||f.properties.id!=='way/880624094')return original.call(this,b,f);
 let pane=0;const box=b.box,beam=b.beam,mesh=b.mesh,putBox=(...a)=>box.apply(b,a),putBeam=(...a)=>beam.apply(b,a),fr=Y.ArchitectureAdapter.frame(f.geometry),d=Math.min(fr.d-5,28);
 b.box=function(x,y,z,w,h,depth,...rest){if(y===.215&&h===.024&&rest[0]==='#bc8b78'&&rest[1]===7)rest[1]=22;if(w===.17&&h===2.9&&depth===.17){const s=Math.sign(z);basket(b,z+s*.15,s,putBox,putBeam,pane++);return;}if(w===1.8&&h===1.05&&depth===.07)return;return box.call(this,x,y,z,w,h,depth,...rest);};
 // Native beams in this exact feature are only the replaced supports and rings.
 b.beam=function(){};
 b.mesh=function(key,g,...args){if(key!=='court32-lines-289')return mesh.call(this,key,g,...args);const out=new G.Geometry();out.v.push(...g.v);const line=p=>{for(const v of G.ribbon(p,.095,.245,false).v)out.v.push(v);};
  for(const s of[-1,1]){const end=s*d/2;for(const x of[-6.2,6.2])line([[x,end],[x,end-s*1.6]]);
   const arc=[];for(let j=0;j<=32;j++){const a=j*Math.PI/32;arc.push([Math.cos(a)*1.25,end-s*(1.7+Math.sin(a)*1.25)]);}line(arc);
   for(const x of[-2.45,2.45])for(const v of[1.80,2.65,3.55,4.40])line([[x,end-s*v],[x+Math.sign(x)*.22,end-s*v]]);
  }return mesh.call(this,'basketball289-lines-complete',out,...args);
 };
 try{return original.call(this,b,f);}finally{b.box=box;b.beam=beam;b.mesh=mesh;}
};
})(YY);
