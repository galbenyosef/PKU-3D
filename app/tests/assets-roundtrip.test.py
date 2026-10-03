"""A restored package must include retained atlas inputs, not just outputs."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('asset_packer', ROOT / 'scripts/assets.py')
assets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(assets)


class AssetRoundtrip(unittest.TestCase):
    def test_distinct_retained_atlas_survives_pack_and_restore(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'source'
            destination = Path(folder) / 'restored'
            files = {
                'VERSION': b'1.4.0\n', 'LICENSE': b'code license',
                'DATA_LICENSE.md': b'data license',
                'app/assets/materials-display.jpg': b'original materials',
                'app/assets/scene-atlas-baseline46.png': b'original baseline',
                'app/assets/runtime-v46/scene/current.png': b'current output atlas',
                'app/assets/runtime-v46/scene/retained.png': b'distinct retained input',
                'app/assets/runtime-v46/scene/part.gz': b'compressed chunk',
                'app/assets/runtime-v46/scene/part.js': b'fallback chunk',
                'app/assets/runtime-v46/scene/bucket-hashes.json': b'{}',
                'app/src/materials.js': b'',
            }
            for name, data in files.items():
                target = source / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
            scene = source / 'app/assets/runtime-v46/scene'
            (scene / 'manifest.json').write_text(json.dumps({
                'atlas': 'current.png',
                'chunks': [{'file': 'part.gz', 'fallback': 'part.js'}],
            }))
            derived = source / 'app/data/scene-atlas-derived879.json'
            derived.parent.mkdir(parents=True)
            derived.write_text(json.dumps({
                'path': 'assets/runtime-v46/scene/retained.png',
            }))
            old_root, old_manifest = assets.ROOT, assets.MANIFEST
            try:
                assets.ROOT = source
                assets.MANIFEST = source / 'app/assets-manifest.json'
                with contextlib.redirect_stdout(io.StringIO()):
                    assets.pack()
                    assets.restore(source / '.release/pku-3d-assets-1.4.0.zip', destination)
                for name in ('current.png', 'retained.png'):
                    relative = Path('app/assets/runtime-v46/scene') / name
                    self.assertEqual((destination / relative).read_bytes(),
                                     (source / relative).read_bytes())
            finally:
                assets.ROOT, assets.MANIFEST = old_root, old_manifest


if __name__ == '__main__':
    unittest.main()
