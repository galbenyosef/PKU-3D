const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {classify,localEntranceEvidence,audit}=require('../tools/audit-entrance-renderers.cjs');
const records=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/runtime-v46/scene/manifest.json'))).campus.roofChecks;
const ids=['relation/11975585','way/188712163','way/1009052052','way/849765893','way/849765894','way/849765886','way/849765885'];
const generic='generic_closed_shell_entry_missing_in_builder',local='local_entrance_model_review_required';
test('public source inventory retains display-excluded buildings without a private ledger',()=>{
 const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/campus.json'))).features.filter(f=>f.properties.kind==='building');
 const report=audit();assert.equal(report.coverage.ledgerBuildings,source.length);
 assert.deepEqual(report.rows.map(r=>r.id).sort(),source.map(f=>f.properties.id).sort());
 assert.equal(report.coverage.displayExcluded,1);assert.equal(report.counts.excluded_from_display_scope,1);
});
test('all baked footprint adapters with reviewed entrance evidence are triaged, never certified',()=>{
 const changed=records.filter(r=>classify(r,r.architecture)===local);assert.deepEqual(changed.map(r=>r.id).sort(),ids.slice().sort());
 for(const r of changed){assert.equal(r.architecture.strategy,'footprint');const proof=localEntranceEvidence(r,r.architecture);assert.ok(fs.existsSync(path.resolve(__dirname,'../..',proof.source)));assert.ok(Object.keys(proof.bakedFields).length>=3);assert.equal(classify(r,{...r.architecture,strategy:'custom'}),'specialized_renderer_review_required');}
});
test('detail labels, positive cuts alone, unknown IDs and invalid counters cannot imply an entrance',()=>{
 for(const id of ids){const r=records.find(r=>r.id===id),a=r.architecture;assert.equal(classify(r,{strategy:'footprint',detail:a.detail}),generic);assert.equal(classify({id:'unreviewed-id'},a),generic);
  const proof=localEntranceEvidence(r,a),count=Object.keys(proof.bakedFields).find(k=>typeof proof.bakedFields[k]==='number');for(const n of[0,-1,NaN,Infinity,'2',.5])assert.equal(classify(r,{...a,[count]:n}),generic);assert.equal(classify(r,{...a,id:'different-id'}),generic);
 }
 assert.equal(classify({id:'new'},{strategy:'footprint',detail:'door entrance',cutRecords:4,entranceVerified:true}),generic);
});
test('unrelated facade/roof edits and existing scope classifications retain their meaning',()=>{
 for(const r of records.filter(r=>r.architecture?.strategy==='footprint'&&!ids.includes(r.id))){assert.equal(localEntranceEvidence(r,r.architecture),null);const style=r.architecture.style;assert.equal(classify(r,r.architecture),style==='canopy'?'open_shelter_not_a_door_candidate':style==='greenhouse'?'greenhouse_entry_review_required':generic);}
 const r=records.find(r=>r.id===ids[0]);assert.equal(classify(r,r.architecture,new Set([r.id])),'excluded_from_display_scope');assert.equal(classify({...r,supersededBy:'new'},r.architecture),'superseded');assert.equal(classify(r,null),'missing_bake_record');
});
test('current audit attaches traceable partial evidence without visual acceptance',()=>{const report=audit();for(const id of ids){const r=report.rows.find(r=>r.id===id);assert.equal(r.classification,local);assert.equal(r.visualAcceptance,false);assert.equal(r.explicitEntranceVerified,false);assert.ok(r.localEntranceEvidence.source);}assert.equal(report.counts[local],ids.length);});
test('872 requires exact identity and all structural fields without certifying the remaining openings or facade',()=>{
 const row={id:'way/849765894'},result={id:row.id,strategy:'footprint',detail:'changchun872-entry83-seven-registered-openings',entrancePlanVerified:true,implementedOpeningCount:7,cutRecords:12,removedWindows:3,entranceElevationMeasured:false,doorLeafStyleVerified:false,remainingExteriorOpeningCount:13,exteriorOpeningInventoryComplete:false};
 assert.equal(classify(row,result),local);
 const proof=localEntranceEvidence(row,result);assert.equal(proof.source,'app/src/changchun872-entry83.js');
 for(const key of ['entranceElevationMeasured','doorLeafStyleVerified','exteriorOpeningInventoryComplete'])assert.equal(proof.bakedFields[key],false);
 assert.equal(proof.bakedFields.remainingExteriorOpeningCount,13);
 for(const key of ['detail','entrancePlanVerified','implementedOpeningCount','cutRecords','removedWindows']){const partial={...result};delete partial[key];assert.equal(classify(row,partial),generic,key);}
 for(const key of ['cutRecords','removedWindows'])for(const value of [0,-1,NaN,Infinity,'2',.5])assert.equal(classify(row,{...result,[key]:value}),generic,key);
 for(const value of [0,6,8,'7',7.5])assert.equal(classify(row,{...result,implementedOpeningCount:value}),generic);
 assert.equal(classify(row,{...result,entrancePlanVerified:'true'}),generic);
 assert.equal(classify({id:'way/849765893'},result),generic);
 assert.equal(classify(row,{...result,id:'way/849765893'}),generic);
 assert.equal(classify(row,{strategy:'footprint',roof:'registered-sixth-floor-terraces',roofSections:2}),generic);
});

test('872 wave90 requires its own structural evidence and preserves explicit unresolved scope',()=>{
 const row={id:'way/849765894'},result={id:row.id,strategy:'footprint',detail:'changchun872-entry90-north-stair-platform-door',entrancePlanVerified:true,previousImplementedOpeningCount:7,implementedOpeningCount:8,remainingExteriorOpeningCount:12,cutRecords:38,removedWindows:6,entry90CutRecords:2,entry90RemovedWindows:1,entry90LeafCount:1,entry90PublicEntrance:false,entry90MaterialVerified:false,doorLeafStyleVerified:false,entranceElevationMeasured:false,exteriorOpeningInventoryComplete:false};
 assert.equal(classify(row,result),local);const proof=localEntranceEvidence(row,result);assert.equal(proof.source,'app/src/changchun872-entry90.js');assert.equal(proof.bakedFields.remainingExteriorOpeningCount,12);assert.equal(proof.bakedFields.entry90PublicEntrance,false);assert.equal(proof.bakedFields.entry90MaterialVerified,false);
 for(const key of Object.keys(proof.bakedFields)){const partial={...result};delete partial[key];assert.equal(classify(row,partial),generic,'missing '+key);}
 for(const key of ['cutRecords','removedWindows','entry90CutRecords','entry90RemovedWindows'])for(const value of [0,-1,NaN,Infinity,'2',.5])assert.equal(classify(row,{...result,[key]:value}),generic,key+' '+value);
 for(const [key,value]of [['previousImplementedOpeningCount',8],['implementedOpeningCount',7],['remainingExteriorOpeningCount',13],['entry90LeafCount',2],['entry90PublicEntrance',true],['entry90MaterialVerified',true],['doorLeafStyleVerified',true],['entranceElevationMeasured',true],['exteriorOpeningInventoryComplete',true],['entrancePlanVerified','true'],['detail','changchun872-entry83-seven-registered-openings']])assert.equal(classify(row,{...result,[key]:value}),generic,key);
 for(const key of ['previousImplementedOpeningCount','implementedOpeningCount','remainingExteriorOpeningCount','entry90LeafCount'])assert.equal(classify(row,{...result,[key]:String(result[key])}),generic,key+' string');
 assert.equal(classify({id:'wrong'},result),generic);assert.equal(classify(row,{...result,id:'wrong'}),generic);
 // Relabelling a successful83 render as90 must not upgrade the old seven-door result.
 const old={...result,previousImplementedOpeningCount:7,implementedOpeningCount:7,remainingExteriorOpeningCount:13};delete old.entry90CutRecords;delete old.entry90RemovedWindows;assert.equal(classify(row,old),generic);
});

test('872 wave93 demands four finite rooms and internal portals as well as external cuts, retaining 83/90 rules',()=>{
 const row={id:'way/849765894'},result={"detail": "changchun872-entry93-four-north-room-doors", "entrancePlanVerified": true, "previousImplementedOpeningCount": 8, "implementedOpeningCount": 12, "remainingExteriorOpeningCount": 8, "entry90LeafCount": 1, "entry90PublicEntrance": false, "entry90MaterialVerified": false, "entry93LeafCount": 4, "entry93InteriorPortalCount": 4, "entry93FiniteRoomCount": 4, "entry93PublicEntrance": false, "entry93MaterialVerified": false, "doorLeafStyleVerified": false, "entranceElevationMeasured": false, "exteriorOpeningInventoryComplete": false, "id": "way/849765894", "strategy": "footprint", "cutRecords": 38, "removedWindows": 6, "entry90CutRecords": 2, "entry90RemovedWindows": 1, "entry93CutRecords": 13, "entry93RemovedWindows": 4};
 assert.equal(classify(row,result),local);const proof=localEntranceEvidence(row,result);assert.equal(proof.source,'app/src/changchun872-entry93.js');assert.equal(proof.bakedFields.remainingExteriorOpeningCount,8);assert.equal(proof.bakedFields.entry93InteriorPortalCount,4);assert.equal(proof.bakedFields.entry93MaterialVerified,false);
 for(const key of Object.keys(proof.bakedFields)){const missing={...result};delete missing[key];assert.equal(classify(row,missing),generic,'missing '+key);}
 for(const key of ['cutRecords','removedWindows','entry90CutRecords','entry90RemovedWindows','entry93CutRecords','entry93RemovedWindows'])for(const value of [0,-1,NaN,Infinity,'2',.5])assert.equal(classify(row,{...result,[key]:value}),generic,key+' '+value);
 for(const key of ['previousImplementedOpeningCount','implementedOpeningCount','remainingExteriorOpeningCount','entry90LeafCount','entry93LeafCount','entry93InteriorPortalCount','entry93FiniteRoomCount'])for(const value of [String(result[key]),result[key]+1,0])assert.equal(classify(row,{...result,[key]:value}),generic,key+' '+value);
 for(const key of ['entry90PublicEntrance','entry90MaterialVerified','entry93PublicEntrance','entry93MaterialVerified','doorLeafStyleVerified','entranceElevationMeasured','exteriorOpeningInventoryComplete'])assert.equal(classify(row,{...result,[key]:true}),generic,key);
 assert.equal(classify(row,{...result,entrancePlanVerified:'true'}),generic);assert.equal(classify({id:'unreviewed'},result),generic);assert.equal(classify(row,{...result,id:'different'}),generic);
 for(const detail of ['changchun872-entry90-north-stair-platform-door','changchun872-entry83-seven-registered-openings'])assert.equal(classify(row,{...result,detail}),generic,'counts incompatible with old detail');
});

test('872 wave97 demands eight finite rooms and internal portals as well as external cuts, retaining 83/90/93 rules',()=>{
 const row={id:'way/849765894'},result={"detail": "changchun872-entry97-eight-south-balcony-doors", "entrancePlanVerified": true, "previousImplementedOpeningCount": 12, "implementedOpeningCount": 20, "remainingExteriorOpeningCount": 0, "entry90LeafCount": 1, "entry90PublicEntrance": false, "entry90MaterialVerified": false, "entry93LeafCount": 4, "entry93InteriorPortalCount": 4, "entry93FiniteRoomCount": 4, "entry93PublicEntrance": false, "entry93MaterialVerified": false, "doorLeafStyleVerified": false, "entranceElevationMeasured": false, "exteriorOpeningInventoryComplete": false, "id": "way/849765894", "strategy": "footprint", "cutRecords": 38, "removedWindows": 6, "entry90CutRecords": 2, "entry90RemovedWindows": 1, "entry93CutRecords": 13, "entry93RemovedWindows": 4,"entry97CutRecords":37,"entry97RemovedWindows":6,"entry97LeafCount":8,"entry97InteriorPortalCount":8,"entry97FiniteRoomCount":8,"entry97PublicEntrance":false,"entry97MaterialVerified":false};
 assert.equal(classify(row,result),local);const proof=localEntranceEvidence(row,result);assert.equal(proof.source,'app/src/changchun872-entry97.js');assert.equal(proof.bakedFields.remainingExteriorOpeningCount,0);assert.equal(proof.bakedFields.entry97InteriorPortalCount,8);assert.equal(proof.bakedFields.entry97MaterialVerified,false);
 for(const key of Object.keys(proof.bakedFields)){const missing={...result};delete missing[key];assert.equal(classify(row,missing),generic,'missing '+key);}
 for(const key of ['cutRecords','removedWindows','entry90CutRecords','entry90RemovedWindows','entry93CutRecords','entry93RemovedWindows','entry97CutRecords','entry97RemovedWindows'])for(const value of [0,-1,NaN,Infinity,'2',.5])assert.equal(classify(row,{...result,[key]:value}),generic,key+' '+value);
 for(const key of ['previousImplementedOpeningCount','implementedOpeningCount','remainingExteriorOpeningCount','entry90LeafCount','entry93LeafCount','entry93InteriorPortalCount','entry93FiniteRoomCount','entry97LeafCount','entry97InteriorPortalCount','entry97FiniteRoomCount'])for(const value of [String(result[key]),result[key]+1,-1])assert.equal(classify(row,{...result,[key]:value}),generic,key+' '+value);
 for(const key of ['entry90PublicEntrance','entry90MaterialVerified','entry93PublicEntrance','entry93MaterialVerified','entry97PublicEntrance','entry97MaterialVerified','doorLeafStyleVerified','entranceElevationMeasured','exteriorOpeningInventoryComplete'])assert.equal(classify(row,{...result,[key]:true}),generic,key);
 assert.equal(classify(row,{...result,entrancePlanVerified:'true'}),generic);assert.equal(classify({id:'unreviewed'},result),generic);assert.equal(classify(row,{...result,id:'different'}),generic);
 for(const detail of ['changchun872-entry90-north-stair-platform-door','changchun872-entry83-seven-registered-openings','changchun872-entry93-four-north-room-doors'])assert.equal(classify(row,{...result,detail}),generic,'counts incompatible with old detail');
});
