/* Registered north facade of way/1009052005. Low grey north ranges and
 * two-storey white western arm replace the unsupported five-storey template.
 * Heights, window axes and hidden rear partitions are proportional fits. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M,ID='way/1009052005';
const B=[-243.042,-283.105],C=[-200.614,-283.715],F=[-211.998,-273.933],G0=[-226.781,-273.722],H=[-226.713,-268.648];
const dx=C[0]-B[0],dz=C[1]-B[1],L=Math.hypot(dx,dz),U=[dx/L,dz/L],N=[U[1],-U[0]];
const doorCenter=-208.918,doorU=(doorCenter-B[0])/U[0],TH=.24;
const windows=[{x:-238.0,w:1.35,lo:1.05,hi:3.08,type:'transom'},{x:-229.46,w:1.6,lo:1.05,hi:3.08,type:'transom'},{x:-225.49,w:1.25,lo:1.26,hi:2.72,type:'diamond'},{x:-221.63,w:1.25,lo:1.26,hi:2.72,type:'diamond'},{x:-217.45,w:1.33,lo:1.26,hi:2.72,type:'transom'},{x:-214.525,w:1.35,lo:1.02,hi:2.82,type:'transom'},{x:-205.669,w:1.65,lo:.95,hi:2.55,type:'vertical'}];
const line=(a,b)=>[b[1]-a[1],a[0]-b[0],(b[1]-a[1])*a[0]+(a[0]-b[0])*a[1]];
const west=line(G0,H),back=line(G0,F);
function clip(poly,l,sign=1){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=(l[0]*p[0]+l[1]*p[1]-l[2])*sign,b=(l[0]*q[0]+l[1]*q[1]-l[2])*sign;if(a<=1e-8)out.push(p);if((a<0&&b>0)||(a>0&&b<0)){const t=a/(a-b);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out.filter((p,i)=>!i||Math.hypot(p[0]-out[i-1][0],p[1]-out[i-1][1])>1e-7);}
function render(b,f){b.id=344;const ring=f.geometry.coordinates[0].slice(0,-1),parts=[];
 const cut=(name,h,col,rules)=>{let p=ring;for(const [l,s]of rules)p=clip(p,l,s);for(let pass=0;pass<12;pass++){let changed=false;p=p.filter((q,i)=>{const a=p[(i+p.length-1)%p.length],c=p[(i+1)%p.length],cross=(q[0]-a[0])*(c[1]-q[1])-(q[1]-a[1])*(c[0]-q[0]);if(Math.hypot(q[0]-a[0],q[1]-a[1])<1e-7||Math.abs(cross)<1e-7){changed=true;return false;}return true;});if(!changed)break;}if(p.length>2)parts.push({name,h,col,poly:p});};
 cut('north-west',4,'#999b91',[[west,1],[[0,1,-276.6],1]]);
 cut('white-west',6.6,'#dddcd3',[[west,1],[[0,1,-276.6],-1]]);
 cut('north-high',4,'#999b91',[[west,-1],[back,-1],[[1,0,-216.379],1]]);
 cut('north-middle',3.55,'#999b91',[[west,-1],[back,-1],[[1,0,-216.379],-1],[[1,0,-210.429],1]]);
 cut('north-door',3.2,'#999b91',[[west,-1],[back,-1],[[1,0,-210.429],-1]]);
 cut('unknown-south-east',3.2,'#aaa99f',[[west,-1],[back,1]]);
 const mesh=(n,g,col,mat=24)=>b.mesh('building344-157-'+n,g,0,0,0,1,1,1,col,mat);
 const box=(n,x,y,z,w,h,d,c,mat=24)=>b.mesh('building344-157-'+n,G.box(),x,y,z,w,h,d,c,mat);
 function shell(name,p,lo,hi,col){const g=G.polygon(p,hi),bottom=G.polygon(p,lo);for(let i=0;i<bottom.v.length;i+=24)g.tri(bottom.v.slice(i,i+3),bottom.v.slice(i+16,i+19),bottom.v.slice(i+8,i+11));const area=p.reduce((s,a,i)=>s+a[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*a[1],0);for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],v=[[a[0],lo,a[1]],[c[0],lo,c[1]],[c[0],hi,c[1]],[a[0],hi,a[1]]];if(area>0)v.reverse();g.quad(...v);}mesh(name,g,col,24);}
 shell('source-base',ring,0,.08,'#b1b1a7');
 const inside=(p,poly)=>{let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],c=poly[j];if((a[1]>p[1])!==(c[1]>p[1])&&p[0]<(c[0]-a[0])*(p[1]-a[1])/(c[1]-a[1])+a[0])hit=!hit;}return hit;};
 const openings=[...windows.map(q=>({...q,u:(q.x-B[0])/U[0]})),{u:doorU,x:doorCenter,w:2.7,lo:.08,hi:2.38,type:'door'}];
 for(const part of parts){shell(part.name+'-roof',part.poly,part.h-.16,part.h,'#969b95');
  const poly=part.poly,area=poly.reduce((s,a,i)=>s+a[0]*poly[(i+1)%poly.length][1]-poly[(i+1)%poly.length][0]*a[1],0);
  for(let i=0;i<poly.length;i++){
   let a=poly[i],c=poly[(i+1)%poly.length];if(area<0)[a,c]=[c,a];
   const vx=c[0]-a[0],vz=c[1]-a[1],len=Math.hypot(vx,vz);if(len<1e-6)continue;
   const nx=vz/len,nz=-vx/len,mid=[(a[0]+c[0])/2+nx*.002,(a[1]+c[1])/2+nz*.002],neighbor=parts.find(p=>p!==part&&inside(mid,p.poly)),lo=neighbor?neighbor.h:.08,hi=part.h-.16;
   if(hi<=lo+1e-7)continue;
   const north=Math.abs((a[0]-B[0])*N[0]+(a[1]-B[1])*N[1])<1e-5&&Math.abs((c[0]-B[0])*N[0]+(c[1]-B[1])*N[1])<1e-5;
   const whiteface=part.name==='white-west'&&nx<-.99,greywestface=part.name==='north-west'&&nx<-.99;
   // local +z is interior; windows and closed door occupy real cutouts.
   b.local(a[0],0,a[1],-Math.atan2(vz,vx),()=>{
    if(north||nx<-.99){box('documented-eave-upper',len/2,part.h-.08,-.05,len,.16,.40,'#aeafa4',24);box('documented-eave-lower',len/2,part.h-.235,-.02,len,.15,.32,'#989b91',24);}
    const holes=north?openings.map(q=>({...q,t:((B[0]+q.u*U[0]-a[0])*vx+(B[1]+q.u*U[1]-a[1])*vz)/len})).filter(q=>q.t-q.w/2>=-.001&&q.t+q.w/2<=len+.001):whiteface?[{t:((-272.4-a[1])*vz)/len,w:1.10,lo:4.25,hi:5.65,type:'plain',awning:true},{t:((-272.4-a[1])*vz)/len,w:.65,lo:.9,hi:1.95,type:'plain'}]:[];
    const levels=[lo,hi,...holes.flatMap(q=>[Math.max(lo,q.lo),Math.min(hi,q.hi)])].filter((v,i,a)=>a.indexOf(v)===i).sort((x,y)=>x-y);
    for(let j=1;j<levels.length;j++){const y0=levels[j-1],y1=levels[j];if(y1-y0<1e-6)continue;const hs=holes.filter(q=>q.lo<=y0+1e-6&&q.hi>=y1-1e-6).sort((x,y)=>x.t-y.t);let cursor=0;
     const span=(x0,x1)=>{if(x1-x0>1e-6)box(part.name+'-wall', (x0+x1)/2,(y0+y1)/2,TH/2,x1-x0,y1-y0,TH,part.col);};
     for(const q of hs){span(cursor,q.t-q.w/2);cursor=q.t+q.w/2;}span(cursor,len);
    }
    if(north||whiteface||greywestface){
     if(north||greywestface){
     const segment=(x0,x1,y)=>{let intervals=[[x0,x1]];for(const q of holes)if(y>q.lo-.03&&y<q.hi+.03)intervals=intervals.flatMap(([a,c])=>[[a,Math.min(c,q.t-q.w/2-.04)],[Math.max(a,q.t+q.w/2+.04),c]].filter(v=>v[1]>v[0]));for(const [a,c]of intervals)box('grey-panel-joint',(a+c)/2,y,-.008,c-a,.018,.018,'#777e76');};
     for(const y of[.6,1.35,2.7])if(y<hi)segment(0,len,y);
     for(let x=.75;x<len;x+=1.45){const cuts=[lo,hi,...holes.filter(q=>Math.abs(x-q.t)<q.w/2+.04).flatMap(q=>[q.lo-.04,q.hi+.04])].sort((a,c)=>a-c);for(let j=1;j<cuts.length;j++){const low=cuts[j-1],high=cuts[j],mid=(low+high)/2;if(low<lo||high>hi||holes.some(q=>Math.abs(x-q.t)<q.w/2+.04&&mid>q.lo-.04&&mid<q.hi+.04))continue;box('grey-panel-joint',x,mid,-.008,.018,high-low,.018,'#777e76');}}
     }
     for(const q of holes){const yc=(q.lo+q.hi)/2,h=q.hi-q.lo,t=q.t,col=q.type==='door'?'#879394':'#e2e1d5';
      for(const x of[t-q.w/2,t+q.w/2])box('opening-frame',x,yc,.005,.09,h+.12,.33,col,24);
      for(const y of[q.lo,q.hi])box('opening-frame',t,y,.005,q.w+.09,.09,.33,col,24);
      if(q.type==='door'){
       for(const s of[-1,1])box('door-leaf',t+s*(q.w/4+.006),yc,.15,q.w/2-.026,h-.035,.07,'#849394',9);
       for(const y of[q.lo+h/3,q.lo+2*h/3])box('door-horizontal',t,y,.102,q.w-.10,.045,.035,'#707e7e',9);
       box('door-centre',t,yc,.10,.024,h-.045,.04,'#596e70',9);
       for(const x of[t-.10,t-.48])box('door-small-panel',x,q.lo+1.12,.096,.025,.36,.045,'#697c7b',9);
       for(const y of[q.lo+.94,q.lo+1.30])box('door-small-panel',t-.29,y,.096,.40,.025,.045,'#697c7b',9);
      }else{
       box('window-glass',t,yc,.16,q.w-.10,h-.10,.025,'#55716e',5);
       const upper=q.type==='vertical'?q.hi:q.hi-(q.type==='diamond'||q.x===-217.45?.43:.52);
       if(q.type!=='vertical'&&q.type!=='plain')box('window-transom',t,upper,.035,q.w-.08,.055,.08,col,24);
       if(q.type!=='plain'&&q.type!=='vertical')for(const x of[t-.024,t+.024])box('window-sash-overlap',x,(q.lo+upper)/2,.035,.028,upper-q.lo-.06,.08,col,24);
       if(q.type==='diamond'){
        // Clipped diagonal wires, confined to the photographed window frame.
        const xmin=t-q.w/2+.09,xmax=t+q.w/2-.09,ymin=q.lo+.09,ymax=q.hi-.09;
        for(const slope of[-1,1])for(let k=-8;k<=8;k++){const intercept=yc+k*.32;const ps=[];for(const x of[xmin,xmax]){const y=slope*(x-t)+intercept;if(y>=ymin&&y<=ymax)ps.push([x,y,-.075]);}for(const y of[ymin,ymax]){const x=t+(y-intercept)/slope;if(x>xmin&&x<xmax)ps.push([x,y,-.075]);}if(ps.length===2){const emit=b.e.add;b.e.add=function(k,...args){return emit.call(this,'building344-157-grille-'+k,...args);};try{b.beam(ps[0],ps[1],.012,'#9ba9a0',9);}finally{b.e.add=emit;}}}
       }else if(q.type!=='plain')for(let x=t-q.w/2+.17;x<t+q.w/2-.1;x+=.18)box('window-vertical-bar',x,yc,-.065,.016,h-.14,.022,'#a6b2a8',9);
       if(q.awning){
        const aw=new G.Geometry(),xl=t-.74,xr=t+.74,back=.02,front=-.78,yt=q.hi+.18,yf=q.hi-.10,th=.055;
        const p=[[xl,yt,back],[xr,yt,back],[xr,yf,front],[xl,yf,front]],v=p.map(q=>[q[0],q[1]-th,q[2]]);
        aw.quad(...p);aw.quad(...v.slice().reverse());for(let k=0;k<4;k++)aw.quad(p[(k+1)%4],p[k],v[k],v[(k+1)%4]);mesh('white-west-blue-awning',aw,'#235e9a',24);
        box('white-west-awning-valance',t,yf-.08,front,1.48,.16,.035,'#255b90',24);
       }
      }
     }
    }
   });
  }
 }
 for(const [x,h]of[[-216.42,3.80],[-210.35,3.03],[-200.76,3.03]]){
  const u=(x-B[0])/U[0],z=B[1]+u*U[1];
  b.mesh('building344-157-north-downpipe',G.cylinder(12),x+N[0]*.12,.10,z+N[1]*.12,.052,h,.052,'#d9dacf',24);
 }
 return{id:ID,strategy:'building344-157',height:6.6,fit:true,limits:'North openings and mixed low/white volumes documented; exact dimensions, rear partitions, southeast and unseen facades fitted.'};
}
A.render=function(b,f,add){return f.properties.id===ID&&f.properties.pickId===344?render(b,f):prior.call(this,b,f,add);};
Y.Building344157={id:ID,render,door:{u:doorU,width:2.7,lo:.08,hi:2.38,center:[B[0]+doorU*U[0],B[1]+doorU*U[1]]},north:{B,C,U,N},windows,fit:true};
})(YY);
