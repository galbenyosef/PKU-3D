"""Behavior tests using synthetic chunks; never decodes or reads real scene payloads."""
import contextlib
import hashlib
import importlib.util
import io
import json
import math
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts'

def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, SOURCE / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

imp = load('codec_import_test', 'import-scene-codec.py')
assets = load('codec_assets_test', 'scene_codec_assets.py')
sha = lambda b: hashlib.sha256(b).hexdigest()

class Integration(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'repo'
        self.scene = self.root / 'app/assets/runtime-v46/scene'
        self.scene.mkdir(parents=True)
        self.package = self.root / 'app/src/scene-package46.js'
        self.package.parent.mkdir(parents=True)
        self.pack = Path(self.temp.name) / 'verified-sidecar'
        (self.pack / 'receipts').mkdir(parents=True)
        self.manifest = {'version': 3, 'sourceHash': 'source-fixture', 'atlas': 'atlas.png',
                         'campus': {'negativeZero': -0.0}, 'buckets': [{'key': 'fixture', 'dataHash': 'audit', 'spatialHash': 'audit'}], 'chunks': []}
        rows = []
        for i, kind in enumerate(['mesh', 'instances']):
            original = bytes([i + 1]) * 20
            raw_sha = sha(b'synthetic raw' + bytes([i]))
            chunk = {'key': 'legacy%d' % i, 'file': 'legacy%d.bin.gz' % i,
                     'fallback': 'legacy%d.js' % i, 'kind': kind, 'rawBytes': 32,
                     'bytes': len(original), 'shuffle': 0, 'sha256': raw_sha}
            self.manifest['chunks'].append(chunk)
            (self.scene / chunk['file']).write_bytes(original)
            (self.scene / chunk['fallback']).write_text('unchanged fallback')
            # Default vertex modern wins, instance modern loses.
            modern = bytes([i + 8]) * (8 if i == 0 else 24)
            alt = {'codec': imp.CODEC, 'file': 'modern%d.bin.gz' % i,
                   'bytes': len(modern), 'decodedBytes': 12, 'stride': 4,
                   'count': 8, 'sha256': sha(modern)}
            (self.pack / alt['file']).write_bytes(modern)
            rows.append({'index': i, 'key': chunk['key'], 'rawBytes': 32,
                         'sha256': raw_sha, 'alternative': alt})
            receipt = {'index': i, 'key': chunk['key'], 'rawBytes': 32,
                       'rawSHA': raw_sha, 'candidateRawSHA': raw_sha,
                       'fullBytesEqual': True, 'originalGzipSHA': sha(original),
                       'originalAfterSHA': sha(original), 'alternative': alt}
            (self.pack / 'receipts' / ('chunk-%02d.json' % i)).write_text(json.dumps(receipt))
        resources = {}
        for key, name in [('decoder', 'meshopt_decoder.mjs'), ('license', 'meshoptimizer-LICENSE.md')]:
            # Synthetic local trust anchors exercise pinned resource admission without
            # downloading vendor files or requiring a restored real scene.
            content = (b'D' * 29019) if key == 'decoder' else (b'L' * 1079)
            (self.pack / name).write_bytes(content)
            resources[key] = {'file': name, 'bytes': len(content), 'sha256': sha(content)}
        decoder_pin = patch.object(imp, 'DECODER_SHA', resources['decoder']['sha256'])
        license_pin = patch.object(imp, 'LICENSE_SHA', resources['license']['sha256'])
        decoder_pin.start(); license_pin.start()
        self.addCleanup(decoder_pin.stop); self.addCleanup(license_pin.stop)
        self.write_original()
        self.side = {'sourceHash': self.manifest['sourceHash'],
                     'parentManifestSHA': sha((self.scene / 'manifest.json').read_bytes()),
                     'codecResources': resources, 'chunks': rows}
        self.sidepath = self.pack / 'sidecar.json'
        self.write_side()
        self.original_metadata = self.metadata()

    def write_original(self):
        # Include integer spelling -0 to exercise the actual JSON parser boundary.
        body = json.dumps(self.manifest, separators=(',', ':')).replace('-0.0', '-0')
        (self.scene / 'manifest.json').write_text(body)
        self.package.write_text('YY.SCENE_PACKAGE46=' +
                               json.dumps({'base': 'assets/runtime-v46/scene/', **self.manifest}, separators=(',', ':')).replace('-0.0', '-0') + ';')

    def write_side(self):
        self.sidepath.write_text(json.dumps(self.side, separators=(',', ':')))

    def edit_alt(self, index, **updates):
        self.side['chunks'][index]['alternative'].update(updates)
        path = self.pack / 'receipts' / ('chunk-%02d.json' % index)
        receipt = json.loads(path.read_text())
        receipt['alternative'] = self.side['chunks'][index]['alternative']
        path.write_text(json.dumps(receipt))
        self.write_side()

    def metadata(self):
        return (self.scene / 'manifest.json').read_bytes(), self.package.read_bytes()

    def run_import(self):
        argv = ['import-scene-codec.py', '--sidecar', str(self.sidepath), '--sha256', sha(self.sidepath.read_bytes())]
        with patch.object(imp, 'ROOT', self.root), patch.object(sys, 'argv', argv), contextlib.redirect_stdout(io.StringIO()):
            imp.main()

    def assert_reject_unchanged(self, regex):
        before = self.metadata()
        with self.assertRaisesRegex(ValueError, regex):
            self.run_import()
        self.assertEqual(self.metadata(), before)
        self.assertFalse((self.scene / 'meshopt_decoder.js').exists())

    def test_wrong_parent_rejects_without_metadata_change(self):
        self.side['parentManifestSHA'] = '0' * 64
        self.write_side()
        self.assert_reject_unchanged('exact baked manifest')

    def test_source_package_mismatch_rejects_without_metadata_change(self):
        self.package.write_text(self.package.read_text().replace('source-fixture', 'other-fixture'))
        self.assert_reject_unchanged('package and manifest differ')

    def test_legacy_does_not_discover_residual_codec_files(self):
        (self.scene / 'meshopt_decoder.js').write_bytes(b'corrupt residual decoder')
        (self.scene / 'modern-leftover.bin.gz').write_bytes(b'corrupt residual payload')
        self.assertEqual(assets.codec_assets(self.manifest, self.scene), [])
        self.assertEqual(self.metadata(), self.original_metadata)

    def test_missing_and_corrupt_modern_asset_reject_without_metadata_change(self):
        path = self.pack / 'modern0.bin.gz'
        original = path.read_bytes()
        path.unlink()
        before = self.metadata()
        with self.assertRaises(FileNotFoundError):
            self.run_import()
        self.assertEqual(self.metadata(), before)
        path.write_bytes(original[:-1] + b'X')
        self.assert_reject_unchanged('asset hash mismatch')

    def test_path_escape_rejected_for_alternative_and_resource(self):
        self.edit_alt(0, file='../outside.bin.gz')
        self.assert_reject_unchanged('Unsafe codec asset name')
        self.edit_alt(0, file='modern0.bin.gz')
        self.side['codecResources']['decoder']['file'] = '../outside.js'
        self.write_side()
        self.assert_reject_unchanged('Unsafe codec asset name')

    def test_tie_remains_legacy_and_smaller_instance_rejected(self):
        equal = b'Q' * 20
        (self.pack / 'modern0.bin.gz').write_bytes(equal)
        self.edit_alt(0, bytes=20, sha256=sha(equal))
        self.run_import()
        result = json.loads((self.scene / 'manifest.json').read_text())
        self.assertTrue(all('alternative' not in c for c in result['chunks']))
        # Return metadata to the independently saved original for a distinct attempt.
        (self.scene / 'manifest.json').write_bytes(self.original_metadata[0])
        self.package.write_bytes(self.original_metadata[1])
        smaller = b'R' * 4
        (self.pack / 'modern1.bin.gz').write_bytes(smaller)
        self.edit_alt(1, bytes=4, sha256=sha(smaller))
        before = self.metadata()
        with self.assertRaisesRegex(ValueError, 'does not convert instance'):
            self.run_import()
        self.assertEqual(self.metadata(), before)

    def test_success_preserves_negativezero_legacy_files_and_metadata_agreement(self):
        original_gz = (self.scene / 'legacy0.bin.gz').read_bytes()
        self.run_import()
        manifest = json.loads((self.scene / 'manifest.json').read_text())
        package = json.loads(self.package.read_text()[len('YY.SCENE_PACKAGE46='):-1])
        self.assertEqual(package, {'base': 'assets/runtime-v46/scene/', **manifest})
        self.assertEqual(math.copysign(1, manifest['campus']['negativeZero']), -1)
        self.assertEqual(math.copysign(1, package['campus']['negativeZero']), -1)
        self.assertIn('alternative', manifest['chunks'][0])
        self.assertNotIn('alternative', manifest['chunks'][1])
        self.assertEqual((self.scene / 'legacy0.bin.gz').read_bytes(), original_gz)
        self.assertEqual((self.scene / 'legacy0.js').read_text(), 'unchanged fallback')
        self.assertFalse((self.scene / 'meshopt_decoder.js').is_symlink())
        self.assertEqual((self.scene / 'meshopt_decoder.js').read_bytes(), (self.pack / 'meshopt_decoder.mjs').read_bytes())
        self.assertEqual(len(assets.codec_assets(manifest, self.scene)), 3)

    def test_real_build_projection_retains_codec_and_negativezero(self):
        import ast
        self.run_import()
        tree = ast.parse((ROOT / 'app/build.py').read_text())
        helpers = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'runtime_scene_package']
        self.assertEqual(len(helpers), 1)
        namespace = {'json': json}
        exec(compile(ast.Module(body=helpers, type_ignores=[]), 'actual build projection', 'exec'), namespace)
        source = self.package.read_text()
        projected = namespace['runtime_scene_package'](source)
        original = json.loads(source[len('YY.SCENE_PACKAGE46='):-1])
        release = json.loads(projected[len('YY.SCENE_PACKAGE46='):-1])
        self.assertEqual(release['chunks'], original['chunks'])
        self.assertEqual(release['codecResources'], original['codecResources'])
        self.assertEqual(release['codecProvenance'], original['codecProvenance'])
        self.assertEqual(math.copysign(1, release['campus']['negativeZero']), -1)
        self.assertEqual(release['buckets'], [{'key': 'fixture'}])

    def test_real_pack_restore_is_deterministic_and_contains_both_codecs(self):
        self.run_import()
        for name, content in {
            'VERSION': b'fixture-v1\n', 'LICENSE': b'project license',
            'DATA_LICENSE.md': b'data license',
            'app/assets/materials-display.jpg': b'original materials',
            'app/assets/scene-atlas-baseline46.png': b'baseline atlas',
            'app/assets/runtime-v46/scene/atlas.png': b'output atlas',
            'app/assets/runtime-v46/scene/bucket-hashes.json': b'{}',
            'app/src/materials.js': b'',
        }.items():
            file = self.root / name
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(content)
        # Load the actual packer through the same API as the maintained roundtrip test.
        packer = load('real_packer_under_test', 'assets.py')
        destination = Path(self.temp.name) / 'restored'
        with patch.object(packer, 'ROOT', self.root), patch.object(packer, 'MANIFEST', self.root / 'app/assets-manifest.json'), contextlib.redirect_stdout(io.StringIO()):
            packer.pack()
            archive = self.root / '.release/pku-3d-assets-fixture-v1.zip'
            first = archive.read_bytes()
            # Stable ZIP metadata must not inherit changed source mtimes.
            import os
            for file in self.scene.iterdir():
                if file.is_file(): os.utime(file, (1234567890, 1234567890))
            packer.pack()
            self.assertEqual(archive.read_bytes(), first)
            packer.restore(archive, destination)
            packer.verify(destination)
        for name in ['legacy0.bin.gz', 'legacy0.js', 'legacy1.bin.gz', 'legacy1.js',
                     'modern0.bin.gz', 'meshopt_decoder.js', 'meshoptimizer-LICENSE.md']:
            relative = Path('app/assets/runtime-v46/scene') / name
            self.assertEqual((destination / relative).read_bytes(), (self.root / relative).read_bytes())
        self.assertFalse((destination / 'app/assets/runtime-v46/scene/modern1.bin.gz').exists())

    def test_build_pack_validator_missing_corrupt_escape_and_policy(self):
        self.run_import()
        manifest = json.loads((self.scene / 'manifest.json').read_text())
        file = self.scene / manifest['chunks'][0]['alternative']['file']
        original = file.read_bytes()
        file.unlink()
        with self.assertRaisesRegex(ValueError, 'real local file'):
            assets.codec_assets(manifest, self.scene)
        file.write_bytes(b'broken')
        with self.assertRaisesRegex(ValueError, 'checksum mismatch'):
            assets.codec_assets(manifest, self.scene)
        file.write_bytes(original)
        alt = manifest['chunks'][0]['alternative']
        alt['file'] = '../outside.bin.gz'
        with self.assertRaisesRegex(ValueError, 'Unsafe codec resource path'):
            assets.codec_assets(manifest, self.scene)
        alt['file'] = file.name
        alt['bytes'] = manifest['chunks'][0]['bytes']
        with self.assertRaisesRegex(ValueError, 'Unsupported codec selection'):
            assets.codec_assets(manifest, self.scene)
        alt['bytes'] = len(original)
        manifest['chunks'][0]['kind'] = 'instances'
        with self.assertRaisesRegex(ValueError, 'Unsupported codec selection'):
            assets.codec_assets(manifest, self.scene)

if __name__ == '__main__':
    unittest.main(verbosity=2)
