/* Photo-fit candidate: 2019 named south view establishes a gray hipped,
 * truncated roof above Wang's existing projecting crown. Rise and plateau
 * dimensions are image-fit estimates, not surveyed dimensions. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo,M=Y.M;
const baseY=74.75,rise=6.4,base=[28,32],plateau=[6.3,7.4];
P.wangTower30=function(){previous.call(this);const g=new G.Geometry(),B=base.map(v=>v/2),T=plateau.map(v=>v/2),y=rise;
 const bottom=[[-B[0],0,-B[1]],[-B[0],0,B[1]],[B[0],0,B[1]],[B[0],0,-B[1]]],top=[[-T[0],y,-T[1]],[-T[0],y,T[1]],[T[0],y,T[1]],[T[0],y,-T[1]]];
 for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(bottom[i],bottom[j],top[j],top[i]);}g.quad(top[0],top[1],top[2],top[3]);
 this.mesh('wang-roof120-hip',g,0,baseY,0,1,1,1,'#697272',29,2.08);
 // Visible narrow standing seams, fitted to the public facade photograph.
 // One centered box mesh; every seam retains its own orientation and length.
 const unit=this.geo('wang-roof120-seam-box',G.box),root=M.transform(this.origin,[1,1,1],this.rotation);
 for(let i=0;i<4;i++){const j=(i+1)%4,normal=M.norm(M.cross(M.sub(bottom[j],bottom[i]),M.sub(top[j],bottom[i])));
 for(let k=1;k<24;k++){const t=k/24,a=bottom[i].map((v,d)=>v+(bottom[j][d]-v)*t),b=top[i].map((v,d)=>v+(top[j][d]-v)*t),delta=M.sub(b,a),lo=a.map((v,d)=>v+delta[d]*.008),hi=a.map((v,d)=>v+delta[d]*.990),up=M.norm(M.sub(hi,lo)),side=M.norm(M.cross(up,normal)),len=Math.hypot(...M.sub(hi,lo)),mid=lo.map((v,d)=>(v+hi[d])/2+normal[d]*.015+(d===1?baseY:0));
 const lm=new Float32Array([...M.mul(side,.065),0,...M.mul(up,len),0,...M.mul(normal,.045),0,...mid,1]);
 this.e.add('wang-roof120-seam',unit,M.multiply(root,lm),'#8d9691',[29,this.id,this.anim,2.08]);
 }}
};Y.WangRoof120={baseY,rise,base,plateau,topY:baseY+rise,roofType:'photo-supported-truncated-hip',dimensions:'photo-fit-not-surveyed',source:'https://www.huitu.com/photo/show/20191217/200525503032.html'};
})(YY);
