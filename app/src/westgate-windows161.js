/* West-facing end bays only. Official whole-gate and lion close photographs
 * show three framed diamond-lattice fields over solid red lower panels.
 * Widths/depths remain fitted; this does not establish interior openings. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.historicWestGate;
const S={centres:[-10.4,10.4],width:3.4,height:3.38,apron:.38,stile:.12,panels:3,fit:true};
P.historicWestGate=function(...args){const old=this.v9Lattice,hadOwn=Object.prototype.hasOwnProperty.call(this,'v9Lattice');
this.v9Lattice=function(x,y,z,w,h,r=0,diagonal=false){
 if(!(S.centres.includes(x)&&y===3.05&&w===3.4&&h===3.38&&r===0&&diagonal))return old.call(this,x,y,z,w,h,r,diagonal);
 this.local(x,y,z,r,()=>{
 // Original perimeter, backing and stone sill retained with identical calls.
 this.box(0,0,0,w+.18,h+.18,.16,'#493c32',20,.78);
 for(const s of[-1,1]){this.box(s*(w/2-.07),0,.18,.14,h,.17,'#7e3329',20,.83);this.box(0,s*(h/2-.065),.18,w,.13,.17,'#7e3329',20,.83);}
 this.box(0,-h/2-.13,.12,w+.24,.15,.37,'#adada2',10,.83);
 const lattice=new Y.Geo.Geometry(),unit=Y.Geo.cylinder(8,1);
 const bar=(a,b)=>{const M=Y.M,up=M.norm(M.sub(b,a)),side=M.norm(M.cross(up,[0,0,1])),front=M.cross(side,up),len=Math.hypot(...M.sub(b,a));for(let j=0;j<unit.v.length;j+=8){const q=unit.v.slice(j,j+8);lattice.vertex(a.map((v,k)=>v+side[k]*q[0]*.022+up[k]*q[1]*len+front[k]*q[2]*.022),M.norm(side.map((v,k)=>v*q[3]/.022+up[k]*q[4]/len+front[k]*q[5]/.022)),q.slice(6,8));}};
 const put=(k,x,y,z,w,h,d,c,mat=20)=>this.v9box('westgate-windows161-'+k,x,y,z,w,h,d,c,mat,.86);
 const left=-w/2+.14,right=w/2-.14,bottom=-h/2+.13,top=h/2-.13,transom=bottom+S.apron,step=(right-left)/3;
 for(let i=1;i<3;i++)put('stile',left+i*step,(bottom+top)/2,.18,S.stile,top-bottom,.17,'#7e3329');
 for(let i=0;i<3;i++){
  const a=left+i*step+(i?S.stile/2:0),b=left+(i+1)*step-(i<2?S.stile/2:0),lo=transom+.06;
  put('lower-panel',(a+b)/2,(bottom+transom-.06)/2,.125,b-a,transom-.06-bottom,.07,'#7e3329');
  put('transom',(a+b)/2,transom,.18,b-a,.12,.17,'#7e3329');
  put('dark-field',(a+b)/2,(lo+top)/2,.10,b-a,top-lo,.035,'#37494b',5);
  // Each diagonal is clipped to its own field, never spanning a stile/apron.
  const W=b-a,H=top-lo;
  for(const sign of[-1,1])for(let q=-W-H;q<W+H;q+=.43){const pts=[];for(const xx of[-W/2,W/2]){const yy=sign*xx+q;if(yy>=-H/2&&yy<=H/2)pts.push([xx+(a+b)/2,yy+(lo+top)/2,.195]);}for(const yy of[-H/2,H/2]){const xx=(yy-q)/sign;if(xx>-W/2&&xx<W/2)pts.push([xx+(a+b)/2,yy+(lo+top)/2,.195]);}if(pts.length>=2)bar(pts[0],pts[1]);}
 }
 this.mesh('westgate-windows161-lattice',this.geo('westgate-windows161-lattice',()=>lattice),0,0,0,1,1,1,'#894537',20,.86);
 });
};try{return previous.apply(this,args);}finally{if(hadOwn)this.v9Lattice=old;else delete this.v9Lattice;}};Y.WestgateWindows161=S;
})(YY);
