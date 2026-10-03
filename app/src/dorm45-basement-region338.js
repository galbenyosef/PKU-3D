/* UI-only approximate area annotation. Not a physical sign, doorway, footprint,
 * staircase, or navigation destination. Official text establishes southeast. */
(function(Y){'use strict';
const region={id:'45a-basement-southeast-area',parentId:'way/272303337',pickId:139,title:'45甲地下空间',note:'东南侧入口区域待细核',bounds:[-336,426,-316,449],source:'https://zwb.pku.edu.cn/zwdt/xwdt/fa40e140fc1343ae8c3e0ae7d47b50a3.htm',exactDoor:false};
let node=null;
function hide(){if(node)node.hidden=true;}
function draw3D({engine,state,selected,ready,mode,container,viewport}){hide();if(!ready||mode!=='3d'||!state.labels||selected!==139||state.isolate)return;
const b=region.bounds,ps=[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]].map(p=>engine.project([p[0],.35,p[1]]));if(ps.some(p=>!p.visible))return;
const x=Math.min(...ps.map(p=>p.x)),right=Math.max(...ps.map(p=>p.x)),y=Math.min(...ps.map(p=>p.y)),bottom=Math.max(...ps.map(p=>p.y));if(right<0||x>viewport.width||bottom<130||y>viewport.height-100)return;
if(!node){node=document.createElement('div');node.setAttribute('role','note');node.setAttribute('aria-label',region.title+'，'+region.note+'，非精确门位');node.style.cssText='position:absolute;pointer-events:none;border:1px dashed #a66c38;border-radius:12px;background:rgba(225,175,95,.07);box-sizing:border-box;';const label=document.createElement('span');label.textContent=region.title+' · '+region.note;label.style.cssText='position:absolute;left:50%;bottom:100%;transform:translateX(-50%);width:max-content;max-width:220px;white-space:normal;background:rgba(248,247,239,.96);color:#6c4b2c;font:12px/1.45 sans-serif;padding:5px 8px;border:1px dashed #a66c38;border-radius:7px;text-align:center;';node.append(label);container.append(node);}
Object.assign(node.style,{left:x+'px',top:y+'px',width:Math.max(4,right-x)+'px',height:Math.max(4,bottom-y)+'px'});node.hidden=false;
}
function drawPlan({el,selected,state,show,metresPerPixel}){if(!show||!state.labels||selected!==139)return;const b=region.bounds;el('rect',{x:b[0],y:b[1],width:b[2]-b[0],height:b[3]-b[1],fill:'none',stroke:'#a66c38','stroke-width':metresPerPixel,'stroke-dasharray':`${4*metresPerPixel} ${3*metresPerPixel}`,'pointer-events':'none'});const t=el('text',{x:(b[0]+b[2])/2,y:b[1]-3*metresPerPixel,'text-anchor':'middle','font-size':11*metresPerPixel,fill:'#6c4b2c',stroke:'#f6f7ef','stroke-width':3*metresPerPixel,'paint-order':'stroke','pointer-events':'none'});t.textContent=region.title+' · '+region.note;}
Y.Dorm45Basement338={region,hide,draw3D,drawPlan};
})(YY);
