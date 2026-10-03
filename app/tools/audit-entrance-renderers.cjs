/* Read the actual baked dispatch results, not the architecture strategy hint.
 * This is a source/geometry triage report, never photographic or visual acceptance. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),repo=path.dirname(root),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function sourceHash(){
 const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const scripts=[...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).filter(p=>!/(?:assets|reference-gallery|engine|app-v29|materials|material-detail|water-detail|pedestrians-v46|scene-cache46|scene-package46)\.js$/.test(p));
 const digest=crypto.createHash('sha256');for(const file of [...scripts,'tools/scene-collector46.js','tools/bake-scene46.cjs','tools/atlas-input879.cjs']){digest.update(file);digest.update(fs.readFileSync(path.join(root,file)));}
 const baseline=path.join(root,'data/scene-atlas-baseline46.json');if(fs.existsSync(baseline)){const value=fs.readFileSync(baseline);digest.update(value);digest.update(fs.readFileSync(path.join(root,JSON.parse(value).path)));}
 const derived=path.join(root,'data/scene-atlas-derived879.json');if(fs.existsSync(derived)){const value=fs.readFileSync(derived);digest.update(value);digest.update(fs.readFileSync(path.join(root,JSON.parse(value).path)));}
 return digest.digest('hex');
}
// Source-reviewed adapters retain their parent's "footprint" strategy. Match
// identity AND emitted structural evidence, never arbitrary detail text alone.
const localEntranceRules=[
 {id:'way/849765885',source:'app/src/changchun868-east129.js',match:r=>r.eastExitStructureFitted===true&&r.eastExitDoorStyleUnverified===true&&positiveCount(r.eastExitCutRecords)&&positiveCount(r.eastExitDisplacedWindowRecords),fields:['eastExitStructureFitted','eastExitDoorStyleUnverified','eastTerminalSetbackUnverified','eastExitCorridorShellFitted','eastExitCutRecords','eastExitDisplacedWindowRecords']},
 {id:'way/849765886',source:'app/src/changchun853-west128.js',match:r=>r.westExitStructureFitted===true&&r.westExitDoorStyleUnverified===true&&positiveCount(r.westExitCutRecords)&&positiveCount(r.westExitDisplacedWindowRecords),fields:['westExitStructureFitted','westExitDoorStyleUnverified','westExitCutRecords','westExitDisplacedWindowRecords']},
 {id:'relation/11975585',source:'app/src/science3-entry8-details.js',match:r=>r.detail==='science3-east-entry-local-fit'&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindows),fields:['detail','cutRecords','removedWindows']},
 {id:'way/188712163',source:'app/src/yiyuan46-details.js',match:r=>r.eastFirstFloorEntrance===true&&positiveCount(r.removedConflictingWindowAssemblies)&&r.entrancePosition==='footway-endpoint-fit-not-survey',fields:['eastFirstFloorEntrance','removedConflictingWindowAssemblies','entrancePosition']},
 {id:'way/1009052052',source:'app/src/foreign389-entry63.js',match:r=>r.westEntryPhotoFitted===true&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindowGroups),fields:['westEntryPhotoFitted','cutRecords','removedWindowGroups']},
 {id:'way/849765893',source:'app/src/changchun871-details.js',match:r=>r.detail==='changchun871-plan-three-entrances'&&r.entrancePlanVerified===true&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindows),fields:['detail','entrancePlanVerified','cutRecords','removedWindows']},
 {id:'way/849765894',source:'app/src/changchun872-entry97.js',match:r=>r.detail==="changchun872-entry97-eight-south-balcony-doors"&&r.entrancePlanVerified===true&&r.previousImplementedOpeningCount===12&&r.implementedOpeningCount===20&&r.remainingExteriorOpeningCount===0&&r.entry90LeafCount===1&&r.entry90PublicEntrance===false&&r.entry90MaterialVerified===false&&r.entry93LeafCount===4&&r.entry93InteriorPortalCount===4&&r.entry93FiniteRoomCount===4&&r.entry93PublicEntrance===false&&r.entry93MaterialVerified===false&&r.doorLeafStyleVerified===false&&r.entranceElevationMeasured===false&&r.exteriorOpeningInventoryComplete===false&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindows)&&positiveCount(r.entry90CutRecords)&&positiveCount(r.entry90RemovedWindows)&&positiveCount(r.entry93CutRecords)&&positiveCount(r.entry93RemovedWindows)&&positiveCount(r.entry97CutRecords)&&positiveCount(r.entry97RemovedWindows)&&r.entry97LeafCount===8&&r.entry97InteriorPortalCount===8&&r.entry97FiniteRoomCount===8&&r.entry97PublicEntrance===false&&r.entry97MaterialVerified===false,fields:["entry97CutRecords", "entry97RemovedWindows", "entry97LeafCount", "entry97InteriorPortalCount", "entry97FiniteRoomCount", "entry97PublicEntrance", "entry97MaterialVerified", "detail", "entrancePlanVerified", "previousImplementedOpeningCount", "implementedOpeningCount", "remainingExteriorOpeningCount", "cutRecords", "removedWindows", "entry90CutRecords", "entry90RemovedWindows", "entry90LeafCount", "entry90PublicEntrance", "entry90MaterialVerified", "entry93CutRecords", "entry93RemovedWindows", "entry93LeafCount", "entry93InteriorPortalCount", "entry93FiniteRoomCount", "entry93PublicEntrance", "entry93MaterialVerified", "doorLeafStyleVerified", "entranceElevationMeasured", "exteriorOpeningInventoryComplete"]},
 {id:'way/849765894',source:'app/src/changchun872-entry93.js',match:r=>r.detail==="changchun872-entry93-four-north-room-doors"&&r.entrancePlanVerified===true&&r.previousImplementedOpeningCount===8&&r.implementedOpeningCount===12&&r.remainingExteriorOpeningCount===8&&r.entry90LeafCount===1&&r.entry90PublicEntrance===false&&r.entry90MaterialVerified===false&&r.entry93LeafCount===4&&r.entry93InteriorPortalCount===4&&r.entry93FiniteRoomCount===4&&r.entry93PublicEntrance===false&&r.entry93MaterialVerified===false&&r.doorLeafStyleVerified===false&&r.entranceElevationMeasured===false&&r.exteriorOpeningInventoryComplete===false&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindows)&&positiveCount(r.entry90CutRecords)&&positiveCount(r.entry90RemovedWindows)&&positiveCount(r.entry93CutRecords)&&positiveCount(r.entry93RemovedWindows),fields:["detail", "entrancePlanVerified", "previousImplementedOpeningCount", "implementedOpeningCount", "remainingExteriorOpeningCount", "cutRecords", "removedWindows", "entry90CutRecords", "entry90RemovedWindows", "entry90LeafCount", "entry90PublicEntrance", "entry90MaterialVerified", "entry93CutRecords", "entry93RemovedWindows", "entry93LeafCount", "entry93InteriorPortalCount", "entry93FiniteRoomCount", "entry93PublicEntrance", "entry93MaterialVerified", "doorLeafStyleVerified", "entranceElevationMeasured", "exteriorOpeningInventoryComplete"]},
 {id:'way/849765894',source:'app/src/changchun872-entry90.js',match:r=>r.detail==='changchun872-entry90-north-stair-platform-door'&&r.entrancePlanVerified===true&&r.previousImplementedOpeningCount===7&&r.implementedOpeningCount===8&&r.remainingExteriorOpeningCount===12&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindows)&&positiveCount(r.entry90CutRecords)&&positiveCount(r.entry90RemovedWindows)&&r.entry90LeafCount===1&&r.entry90PublicEntrance===false&&r.entry90MaterialVerified===false&&r.doorLeafStyleVerified===false&&r.entranceElevationMeasured===false&&r.exteriorOpeningInventoryComplete===false,fields:['detail','entrancePlanVerified','previousImplementedOpeningCount','implementedOpeningCount','remainingExteriorOpeningCount','cutRecords','removedWindows','entry90CutRecords','entry90RemovedWindows','entry90LeafCount','entry90PublicEntrance','entry90MaterialVerified','doorLeafStyleVerified','entranceElevationMeasured','exteriorOpeningInventoryComplete']},
 {id:'way/849765894',source:'app/src/changchun872-entry83.js',match:r=>r.detail==='changchun872-entry83-seven-registered-openings'&&r.entrancePlanVerified===true&&r.implementedOpeningCount===7&&positiveCount(r.cutRecords)&&positiveCount(r.removedWindows),fields:['detail','entrancePlanVerified','implementedOpeningCount','cutRecords','removedWindows','entranceElevationMeasured','doorLeafStyleVerified','remainingExteriorOpeningCount','exteriorOpeningInventoryComplete']}
];
function positiveCount(n){return Number.isSafeInteger(n)&&n>0;}
function localEntranceEvidence(row,result){
 if(!result||result.strategy!=='footprint'||(result.id&&result.id!==row.id))return null;
 const rule=localEntranceRules.find(rule=>rule.id===row.id&&rule.match(result));
 return rule?{source:rule.source,bakedFields:Object.fromEntries(rule.fields.map(k=>[k,result[k]])),meaning:'Local entrance adapter ran; opening, photographic correspondence and visual acceptance still require review.'}:null;
}
function classify(row,result,excluded=new Set()){
 if(excluded.has(row.id))return 'excluded_from_display_scope';
 if(row.supersededBy)return 'superseded';
 if(!result)return 'missing_bake_record';
 if(result.strategy!=='footprint')return 'specialized_renderer_review_required';
 if(result.style==='canopy')return 'open_shelter_not_a_door_candidate';
 if(result.style==='greenhouse')return 'greenhouse_entry_review_required';
 if(localEntranceEvidence(row,result))return 'local_entrance_model_review_required';
 return 'generic_closed_shell_entry_missing_in_builder';
}
function audit(){
 const m=JSON.parse(fs.readFileSync(path.join(root,'assets/runtime-v46/scene/manifest.json'))),current=sourceHash();
 if(m.sourceHash!==current)throw Error('Scene cache is stale; run npm run build:scene before auditing entrances.');
 const results=new Map(m.campus.roofChecks.map(r=>[r.id,r.architecture]));
 const context={YY:{CAMPUS:JSON.parse(fs.readFileSync(path.join(root,'data/campus.json')))}};
 const sourceFeatures=context.YY.CAMPUS.features.slice();
 vm.runInNewContext(fs.readFileSync(path.join(root,'src/scope-v45.js'),'utf8'),context,{timeout:1000});
 // Public source data is the authority; the private refinement ledger is not
 // required by a clean checkout and cannot certify photographic acceptance.
 const excluded=new Set(context.YY.CAMPUS.displayScope45.excludedIds),buildings=sourceFeatures.filter(f=>f.properties.kind==='building').map(({properties:p})=>({id:p.id,pickId:p.pickId,label:p.label,strategy:p.architecture?.strategy,supersededBy:p.supersededBy43}));
 if(results.size!==m.campus.roofChecks.length)throw Error('Duplicate building IDs in baked dispatch records.');
 if(new Set(buildings.map(r=>r.id)).size!==buildings.length)throw Error('Duplicate building IDs in coverage ledger.');
 const known=new Set(buildings.map(r=>r.id));
 for(const id of results.keys())if(!known.has(id))throw Error('Baked building missing from coverage ledger: '+id);
 const rows=buildings.map(r=>{
  const actual=results.get(r.id),classification=classify(r,actual,excluded);
  return {id:r.id,pickId:r.pickId,label:r.label,configuredRenderer:r.strategy||null,supersededBy:r.supersededBy||null,classification,actualRenderer:actual?.strategy||actual?.profile||actual?.model||null,style:actual?.style||null,explicitEntranceVerified:actual?.entranceVerified===true,entranceReview:r.checks?.entrance||'pending',visualAcceptance:false,localEntranceEvidence:localEntranceEvidence(r,actual)};
 });
 const counts={};for(const r of rows)counts[r.classification]=(counts[r.classification]||0)+1;
 return {scope:'All building records in the campus refinement ledger, including superseded and display-excluded source records. Specialized renderers remain unverified; this report never certifies visual likeness.',sceneSourceHash:current,builderSourceHash:sha(fs.readFileSync(path.join(root,'src/architecture-v30.js'))),coverage:{ledgerBuildings:buildings.length,bakedBuildings:results.size,displayExcluded:rows.filter(r=>r.classification==='excluded_from_display_scope').length},evidence:['app/src/scene-v29.js records the final Architecture30.render return in roofChecks','app/src/architecture-v30.js footprint builds continuous walls from y=.30 and regular window rows without a door opening','Source-reviewed local entrance adapters can retain footprint strategy; matching baked structural fields identify a model requiring review, not a verified entrance','app/src/scope-v45.js explicitly excludes source records from the display','app/assets/runtime-v46/scene/manifest.json contains the current bake results'],counts,rows};
}
if(require.main===module){try{const report=audit();if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({sceneSourceHash:report.sceneSourceHash,counts:report.counts},null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={classify,localEntranceEvidence,sourceHash,audit};
