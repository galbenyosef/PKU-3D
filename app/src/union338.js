/* PKU union Xiaobailou: official 2024 aerial locator + 2026 source imagery.
 * The 62 courtyard to its east remains an independent historic feature.
 * Height and wall offsets are display fits; no entrance or window axes inferred. */
(function(Y){'use strict';
if(Y.Union338)return;
const ID='manual/union-white-building338',PICK=1339,features=Y.CAMPUS.features;
const feature=features.find(f=>f.properties.id===ID);
if(!feature||feature.properties.pickId!==PICK||features.filter(f=>f.properties.pickId===PICK).length!==1)throw Error('Union338 source feature missing or identity collision');
const bounds=[-169.05,474.44,-139.27,488.36],centre=[-154.16,481.40];
const references=[
 {title:'校工会：小白楼新址鸟瞰定位图（2024-03-06）',url:'https://gh.pku.edu.cn/info/1018/14612.htm',note:'正文明确校工会新址；已查看带箭头鸟瞰图，与家园东北、31楼西北的白色矩形屋面对应。'},
 {title:'校工会：迎新春校园定向健步走（2024-01-12）',url:'https://gh.pku.edu.cn/info/1078/14539.htm',note:'正文明确小白楼新址与北侧广场；院落照片仅显示局部白墙、灰砖附房。'},
 {title:'校工会：工会后小院画展（2024-06-04）',url:'https://gh.pku.edu.cn/info/1030/15719.htm',note:'地点为家园食堂北、燕南园南侧入口；已查看官方院落照片。'},
 {title:'北大新闻网：工会小白楼会议（2026-04-01）',url:'https://news.pku.edu.cn/xwzh/cf6ca481c3794df998e0566d83befa0d.htm',note:'2026年3月30日会议地点为工会小白楼一层，支持持续用途。'},
 {title:'北大基建工程部：小白楼工会用房装修（2023-06-19）',url:'https://jjgcb.pku.edu.cn/zbtb/zbgg/1059jjgcb151034.htm',note:'装修面积766.67平方米不作为建筑占地面积。'},
 {title:'Esri World Imagery：屋顶包络',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',note:'该处元数据为2026-01-11、Vantor WV02、0.5米分辨率、8.47米绝对精度；人工屋顶描边另含视差，不是测绘。'}
];
const note='官方鸟瞰图与家园食堂、31楼及燕南园相对位置核对；屋顶包络按公开卫星图配准。影像元数据日期2026-01-11，源绝对精度8.47米，另有视差；墙脚偏移、7米总高与立面均为显示拟合，门窗数量和入口轴位未核准。燕南园62号为东侧独立院屋；老生物楼仅是工会旧办公地点。';

const prior=Y.Architecture30.render;
Y.Architecture30.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==PICK)return prior.call(this,b,f,add);
 const oldId=b.id;b.id=PICK;
 try{b.local(centre[0],0,centre[1],0,()=>{
  // All pieces overlap vertically and share one roof envelope. No stairs,
  // detached template doorway, sign lettering, or invented windows are added.
  b.box(0,.14,0,29.38,.32,13.52,'#b4b7ae',10);
  b.box(0,3.48,0,29.18,6.72,13.32,'#dddcd0',24);
  b.box(0,6.84,0,29.78,.32,13.92,'#c9ccc2',19);
 });}finally{b.id=oldId;}
 return{strategy:'union338-white-building',identityVerified:true,roofEnvelopeMeasured:false,entranceVerified:false,facadeVerified:false,heightMeasured:false};
};
Y.Union338={id:ID,pickId:PICK,feature,bounds,centre,references};
})(YY);
