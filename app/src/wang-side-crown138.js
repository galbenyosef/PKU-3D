/* East (+x) front-corner clerestory only. Three directly visible adjacent
 * apertures are fitted; rear divisions and shoulder topology remain unknown.
 * Existing south 12 panes, roof and soffit ribs are preserved. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const S={x:13.15,back:13.03,low:72.42,high:73.985,openLow:72.56,openHigh:73.865,zMin:7,zMax:14.65,apertures:[[11.2,12.9],[9.28,10.98],[7.36,9.06]],scope:'east-front-three-visible-photo-fit'};
function split(poly,axis,value,sign){const yes=[],no=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=sign*(a[axis]-value),db=sign*(b[axis]-value);(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v=a.map((v,j)=>v+(b[j]-v)*t);yes.push(v);no.push(v);}}return{yes,no};}
function trimmed(g){const out=new G.Geometry(),cuts=[[0,13/26.3,1],[2,S.zMin/29.3,1],[2,S.zMax/29.3,-1]];for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>g.v.slice(i+j,i+j+8)),parts=[];for(const[a,v,s]of cuts){if(rest.length<3)break;const q=split(rest,a,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}for(const p of parts)for(let j=1;j+1<p.length;j++)out.v.push(...p[0],...p[j],...p[j+1]);}return out;}
P.wangTower30=function(){const emit=this.e.add;this.e.add=function(k,g,m,c,p,uv){if(k==='wang-crown121-retained-clerestory')return emit.call(this,'wang-side-crown138-retained',trimmed(g),m,c,p,uv);return emit.call(this,k,g,m,c,p,uv);};try{previous.call(this);}finally{this.e.add=emit;}
 const g=new G.Geometry(),reveal=(...p)=>g.quad(...p.reverse()),quad=(z0,z1,y0,y1)=>g.quad([S.x,y0,z1],[S.x,y0,z0],[S.x,y1,z0],[S.x,y1,z1]);let cursor=S.zMin;
 for(const[a,b]of S.apertures.slice().reverse()){quad(cursor,a,S.low,S.high);quad(a,b,S.low,S.openLow);quad(a,b,S.openHigh,S.high);reveal([S.x,S.openLow,a],[S.back,S.openLow,a],[S.back,S.openHigh,a],[S.x,S.openHigh,a]);reveal([S.back,S.openLow,b],[S.x,S.openLow,b],[S.x,S.openHigh,b],[S.back,S.openHigh,b]);reveal([S.x,S.openLow,b],[S.back,S.openLow,b],[S.back,S.openLow,a],[S.x,S.openLow,a]);reveal([S.x,S.openHigh,a],[S.back,S.openHigh,a],[S.back,S.openHigh,b],[S.x,S.openHigh,b]);cursor=b;}quad(cursor,S.zMax,S.low,S.high);
 // Close the partial band's rear end above and below the retained old box.
 for(const[y0,y1]of[[S.low,72.45],[73.55,S.high]])g.quad([S.x,y0,S.zMin],[S.x,y1,S.zMin],[S.back,y1,S.zMin],[S.back,y0,S.zMin]);
 this.mesh('wang-side-crown138-stone',g,0,0,0,1,1,1,'#c7c7bc',24,1.7);
 const glass=this.geo('wang-side-crown138-pane',G.plane);
 for(const[a,b]of S.apertures){this.mesh('wang-side-crown138-glass',glass,S.back,(S.openLow+S.openHigh)/2,(a+b)/2,b-a,S.openHigh-S.openLow,1,'#54656c',28,1.7,Math.PI/2);this.v16box('wang-side-crown138-transom',S.x-.085,S.openLow+(S.openHigh-S.openLow)*.29,(a+b)/2,.055,.055,b-a,'#a9b1a8',29,1.7);}
};Y.WangSideCrown138=S;
})(YY);
