"""Bounded packaging tests. Extract only the pure helper; never execute build.py."""
import ast
import hashlib
import json
from pathlib import Path
import unittest
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]
BUILD = ROOT / 'app/build.py'
SOURCE = ROOT / 'app/src/scene-package46.js'
AUTHORITIES = [ROOT / 'app/build.py', SOURCE,
               ROOT / 'app/assets/runtime-v46/scene/manifest.json',
               ROOT / 'app/assets/runtime-v46/scene/bucket-hashes.json']
PREFIX = 'YY.SCENE_PACKAGE46='

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def parse(text):
    return json.loads(text.strip()[len(PREFIX):-1])

module = ast.parse(BUILD.read_text())
helper = next(node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == 'runtime_scene_package')
namespace = {'json': json}
exec(compile(ast.Module(body=[helper], type_ignores=[]), str(BUILD), 'exec'), namespace)
project = namespace['runtime_scene_package']
data_helper = next(node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == 'runtime_data_assignment')
exec(compile(ast.Module(body=[data_helper], type_ignores=[]), str(BUILD), 'exec'), namespace)
data_assignment = namespace['runtime_data_assignment']
emit_helper = next(node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == 'emit_runtime_payload')

JS_VERIFY = r'''
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const input=JSON.parse(fs.readFileSync(0,'utf8'));
function parse(source){const text=source.trim(),prefix='YY.SCENE_PACKAGE46=';assert.ok(text.startsWith(prefix)&&text.endsWith(';'));return JSON.parse(text.slice(prefix.length,-1));}
const before=parse(input.before),after=parse(input.after);
const expected={...before,buckets:before.buckets.map(bucket=>Object.fromEntries(Object.entries(bucket).filter(([key])=>key!=='dataHash'&&key!=='spatialHash')))};
// Node strict deep equality distinguishes -0 from +0 and compares every array/order/value.
assert.deepStrictEqual(after,expected);
process.stdout.write(JSON.stringify({ok:true,check:'Node assert.deepStrictEqual including signed zero and IEEE-754 values',bucketCount:before.buckets.length})+'\n');
'''

def javascript_equal(before, after):
    result = subprocess.run(['node', '-e', JS_VERIFY],
                            input=json.dumps({'before': before, 'after': after}),
                            text=True, capture_output=True, check=True)
    return json.loads(result.stdout)

class DeferredRuntimeData(unittest.TestCase):
    def test_deferred_data_scripts_transfer_at_original_adapter_positions(self):
        # Execute the actual campus/architecture data and the projected manifest.
        # Data scripts run before the application, which must still expose values
        # at their original positions and release the temporary staging object.
        with tempfile.TemporaryDirectory() as folder:
            scope = {**namespace, 'hashlib': hashlib, 'destination': Path(folder), 'runtime_data': []}
            exec(compile(ast.Module(body=[emit_helper], type_ignores=[]), str(BUILD), 'exec'), scope)
            emit = scope['emit_runtime_payload']
            sources = [('YY.CAMPUS', (ROOT / 'app/src/data.js').read_text()),
                       ('YY.ARCHIVE', (ROOT / 'app/src/architecture-data.js').read_text()),
                       ('YY.PICK_RANGE_CULL', 'YY.PICK_RANGE_CULL={"buckets":[3,2,1],"zero":-0,"tiny":5e-324,"large":9007199254740993};'),
                       ('YY.SCENE_PACKAGE46', project(SOURCE.read_text()))]
            adapters = [data_assignment(source, name, emit) for name, source in sources]
            scripts = []
            for item in scope['runtime_data']:
                content = (Path(folder) / item['file']).read_bytes()
                self.assertEqual(len(content), item['bytes'])
                self.assertEqual(hashlib.sha256(content).hexdigest(), item['sha256'])
                scripts.append(content.decode())
            script = r'''
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const realm=vm.createContext({assert});
vm.runInContext('var YY={};',realm);
for(const source of input.scripts)vm.runInContext(source,realm);
vm.runInContext('assert.equal(Object.keys(YY).length,0);',realm);
for(let i=0;i<input.sources.length;i++){
 const [name,source]=input.sources[i],key=name.slice(3);
 vm.runInContext(input.adapters[i],realm);
 vm.runInContext(`assert.deepStrictEqual(YY[${JSON.stringify(key)}],(function(){const YY={};${source}return YY[${JSON.stringify(key)}];})());assert.equal(Object.hasOwn(globalThis.__PKU_RUNTIME_DATA,${JSON.stringify(name)}),false);`,realm);
}
vm.runInContext('assert.deepStrictEqual(YY.DATA.places,[]);assert.deepStrictEqual(YY.DATA.toWorld([2,7]),[2,7]);assert.equal(Object.keys(globalThis.__PKU_RUNTIME_DATA).length,0);delete globalThis.__PKU_RUNTIME_DATA;assert.equal(Object.hasOwn(globalThis,"__PKU_RUNTIME_DATA"),false);',realm);
'''
            subprocess.run(['node', '-e', script], input=json.dumps({'sources': sources, 'adapters': adapters, 'scripts': scripts}), text=True, capture_output=True, check=True)

    def test_wrapper_fails_closed_before_emitting(self):
        def forbidden_emit(*args):
            self.fail('Invalid data source reached the emitter')
        for source in ['YY.WRONG={};', 'YY.CAMPUS={}bad;', 'YY.CAMPUS={']:
            with self.assertRaises(ValueError):
                data_assignment(source, 'YY.CAMPUS', forbidden_emit)

class Projection(unittest.TestCase):
    def test_javascript_number_semantics(self):
        text = PREFIX + '{"base":"x/","numbers":[-0,-0.0,0,1e-7,1e20,1.2345678901234567,9007199254740993,5e-324],"buckets":[{"count":1,"dataHash":"drop","spatialHash":"drop","future":[-0,1.7976931348623157e308]}]};'
        self.assertTrue(javascript_equal(text, project(text))['ok'])

    def test_scope_and_unknown_metadata(self):
        fixture = {'base': 'assets/runtime-v46/scene/', 'sourceHash': 's',
                   'dataHash': 'top retained', 'future': {'spatialHash': 'nested retained'},
                   'buckets': [{'key': '桶', 'dataHash': 'drop', 'spatialHash': 'drop',
                                'data': {'chunk': 0, 'offset': 4, 'length': 28},
                                'future': {'dataHash': 'nested retained'}}, {'key': 'already lean'}]}
        text = PREFIX + json.dumps(fixture, ensure_ascii=False) + ';'
        got = parse(project(text))
        expected = json.loads(json.dumps(fixture))
        del expected['buckets'][0]['dataHash']; del expected['buckets'][0]['spatialHash']
        self.assertEqual(got, expected)
        self.assertEqual(parse(project(project(text))), got)
        self.assertEqual(parse(text), fixture)

    def test_wrapper_fails_closed(self):
        for text in ['YY.OTHER={};', 'YY.SCENE_PACKAGE46={}', 'YY.SCENE_PACKAGE46={};alert(1);']:
            with self.assertRaises((ValueError, json.JSONDecodeError)):
                project(text)

    def test_actual_package_and_authorities(self):
        before = {str(path): sha(path) for path in AUTHORITIES}
        original = SOURCE.read_text()
        package = parse(original)
        result = project(original)
        got = parse(result)
        js_check = javascript_equal(original, result)
        self.assertTrue(js_check['ok'])
        self.assertEqual(set(got), set(package))
        for key in package:
            if key != 'buckets': self.assertEqual(got[key], package[key], key)
        self.assertEqual(len(got['buckets']), len(package['buckets']))
        removed = 0
        for old, new in zip(package['buckets'], got['buckets']):
            self.assertEqual(new, {k: v for k, v in old.items() if k not in ('dataHash', 'spatialHash')})
            removed += sum(k in old for k in ('dataHash', 'spatialHash'))
        # Explicit recovery/file/checksum and page208 authority assertions.
        self.assertEqual(got['base'], package['base'])
        self.assertEqual(got['chunks'], package['chunks'])
        self.assertTrue(all(c['sha256'] and c['fallback'] and c['file'] for c in got['chunks']))
        self.assertEqual(got['meshes'], package['meshes'])
        self.assertEqual(got['campus'], package['campus'])
        self.assertEqual(got['normalTransformFormat194'], package['normalTransformFormat194'])
        # Existing release path rewrite remains after projection, preserving file: URLs.
        released = parse(result.replace('assets/runtime-v46/', 'assets/runtime/'))
        self.assertEqual(released['base'], package['base'].replace('assets/runtime-v46/', 'assets/runtime/'))
        self.assertEqual(released['chunks'], package['chunks'])
        self.assertEqual(before, {str(path): sha(path) for path in AUTHORITIES})
        canonical_old = PREFIX + json.dumps(package, ensure_ascii=False, separators=(',', ':')) + ';'
        expected_saved = sum(
            len((json.dumps(key) + ':' + json.dumps(bucket[key]) + ',').encode())
            for bucket in package['buckets']
            for key in ('dataHash', 'spatialHash') if key in bucket)
        self.assertGreater(removed, 0)
        self.assertEqual(len(canonical_old.encode()) - len(result.encode()), expected_saved)


class BuilderDataProjection(unittest.TestCase):
    def test_exact_payload_and_adapter_order(self):
        import re
        helper = next(n for n in module.body if isinstance(n, ast.FunctionDef) and n.name == 'runtime_builder_data')
        ns = {'re': re}
        exec(compile(ast.Module(body=[helper], type_ignores=[]), str(BUILD), 'exec'), ns)
        project_data = ns['runtime_builder_data']
        lion = (ROOT / 'app/src/westgate-lions318.js').read_text()
        lean, (key, payload) = project_data('src/westgate-lions318.js', lion)
        match = re.search(r'const data=(\{.*?\}),G=Y.Geo;\n', lion)
        self.assertEqual(payload, 'YY.WestGateLionSource318=' + match.group(1) + ';')
        restored = lean.replace('const G=Y.Geo;\n', match.group(0), 1).replace('const d=Y.WestGateLionSource318[side]', 'const d=data[side]')
        self.assertEqual(restored, lion)
        office = (ROOT / 'app/src/office105-dragons318-data.js').read_text()
        self.assertEqual(project_data('src/office105-dragons318-data.js', office), ('', ('Office105Dragons318', office)))
        self.assertEqual(project_data('src/unknown.js', 'keep;'), ('keep;', None))
        with self.assertRaises(ValueError): project_data('src/westgate-lions318.js', 'bad')

if __name__ == '__main__':
    unittest.main()
