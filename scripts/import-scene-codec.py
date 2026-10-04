#!/usr/bin/env python3
"""Explicitly import a verified codec sidecar. Never encodes or bakes geometry."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]
CODEC = 'gzip-meshopt-attributes-v1'
DECODER_SHA = '10b313edaa0e322b0c1b46443f6c8b186b42139fe1eca189d50c09511d0ebedc'
LICENSE_SHA = 'f03037ca7bad1e3eb7f4a63fa6084a8baabd5ba30d3c239a9a7f35705d873e26'
UPSTREAM = 'https://github.com/zeux/meshoptimizer'
COMMIT = '9e1f07b159d3cb777f1c67ed31fc11fd117986f4'
sha = lambda value: hashlib.sha256(value).hexdigest()

def require(ok, message):
    if not ok:
        raise ValueError(message)

def leaf(name):
    require(isinstance(name, str) and name not in ('', '.', '..') and Path(name).name == name and '/' not in name and '\\' not in name, 'Unsafe codec asset name')
    return name

def read_json(data):
    return json.loads(data, parse_int=lambda x: -0.0 if x == '-0' else int(x))

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--sidecar', type=Path, required=True)
    ap.add_argument('--sha256', required=True, help='SHA256 of the approved complete sidecar')
    args = ap.parse_args()
    sidebytes = args.sidecar.read_bytes()
    require(sha(sidebytes) == args.sha256, 'Sidecar approval SHA mismatch')
    side = read_json(sidebytes)
    scene = ROOT / 'app/assets/runtime-v46/scene'
    manifest_path = scene / 'manifest.json'
    package_path = ROOT / 'app/src/scene-package46.js'
    before = manifest_path.read_bytes()
    package_before = package_path.read_bytes()
    manifest = read_json(before)
    require('codecResources' not in manifest and all('alternative' not in c for c in manifest['chunks']), 'Already extended: omit import for subsequent builds, or supply a fresh legacy bake')
    require(sha(before) == side['parentManifestSHA'] and manifest['sourceHash'] == side['sourceHash'], 'Sidecar does not match this exact baked manifest')
    wrapper = package_before.decode().strip()
    require(wrapper.startswith('YY.SCENE_PACKAGE46=') and wrapper.endswith(';'), 'Unexpected scene-package wrapper')
    package = read_json(wrapper[len('YY.SCENE_PACKAGE46='):-1])
    require(package == {'base': 'assets/runtime-v46/scene/', **manifest}, 'Source package and manifest differ')
    require(len(side['chunks']) == len(manifest['chunks']), 'Chunk count differs')
    selected = []
    modern_assets = {}
    legacy_stamps = {}
    for i, (row, original) in enumerate(zip(side['chunks'], manifest['chunks'])):
        require(row['index'] == i and all(row[k] == original[k] for k in ('key', 'rawBytes', 'sha256')), 'Chunk identity changed')
        alt = row['alternative']
        require(alt['codec'] == CODEC and alt['stride'] in (4, 32) and type(alt['count']) is int and alt['count'] > 0 and alt['count'] * alt['stride'] == original['rawBytes'], 'Unsupported codec shape')
        require(all(type(alt[k]) is int and 0 < alt[k] <= 64 * 1024 * 1024 for k in ('bytes', 'decodedBytes')), 'Invalid codec length')
        leaf(alt['file'])
        receipt = json.loads((args.sidecar.parent / 'receipts' / ('chunk-%02d.json' % i)).read_text())
        require(receipt['index'] == i and receipt['key'] == original['key'] and receipt['rawBytes'] == original['rawBytes'] and receipt['rawSHA'] == receipt['candidateRawSHA'] == original['sha256'] and receipt['fullBytesEqual'] is True and receipt['originalGzipSHA'] == receipt['originalAfterSHA'] and receipt['alternative'] == alt, 'Missing or inconsistent byte-exact receipt')
        original_file = scene / leaf(original['file'])
        original_stat = original_file.stat()
        legacy_stamps[original_file] = (original_stat.st_size, original_stat.st_mtime_ns, original_stat.st_ctime_ns)
        original_bytes = original_file.read_bytes()
        require(len(original_bytes) == original['bytes'] and sha(original_bytes) == receipt['originalGzipSHA'], 'Original compressed asset differs from verified receipt')
        # Strict policy was fixed before timing: equal-size alternatives remain legacy.
        if alt['bytes'] < original['bytes']:
            require(original['kind'] != 'instances', 'This reviewed policy does not convert instance chunks')
            selected.append(i)
            modern_assets[alt['file']] = (args.sidecar.parent / alt['file'], alt)
            original['alternative'] = alt
    resources = side['codecResources']
    require(set(resources) == {'decoder', 'license'}, 'Unexpected codec resources')
    require(resources['decoder']['sha256'] == DECODER_SHA and resources['decoder']['bytes'] == 29019, 'Unreviewed decoder version')
    require(resources['license']['sha256'] == LICENSE_SHA and resources['license']['bytes'] == 1079, 'Upstream license differs')
    resources = json.loads(json.dumps(resources))
    for name, row in resources.items():
        source = args.sidecar.parent / leaf(row['file'])
        if name == 'decoder':
            row['file'] = 'meshopt_decoder.js'  # Same official ESM bytes; correct MIME with existing server.
        modern_assets[leaf(row['file'])] = (source, row)
    legacy_names = {c[k] for c in manifest['chunks'] for k in ('file', 'fallback')}
    legacy_names.update([manifest['atlas'], 'manifest.json', 'bucket-hashes.json'])
    require(not legacy_names.intersection(modern_assets), 'Codec resource collides with original scene')
    manifest['codecResources'] = resources
    manifest['codecProvenance'] = {'policy': 'strict-wire-min-v1-no-instances', 'parentManifestSHA256': sha(before), 'sidecarSHA256': sha(sidebytes), 'upstream': UPSTREAM, 'commit': COMMIT, 'encoder': 'attributes-level2-version1-gzip6', 'selectedIndices': selected}
    # No absolute paths, timestamps, timing-dependent selection or reordered scene arrays.
    data = json.dumps(manifest, ensure_ascii=False, separators=(',', ':')).encode()
    packaged = ('YY.SCENE_PACKAGE46=' + json.dumps({'base': 'assets/runtime-v46/scene/', **manifest}, ensure_ascii=False, separators=(',', ':')) + ';').encode()
    with tempfile.TemporaryDirectory(prefix='.codec-import-', dir=scene) as tmp:
        stage = Path(tmp)
        for name, (source, meta) in modern_assets.items():
            content = source.read_bytes()
            require(len(content) == meta['bytes'] and sha(content) == meta['sha256'], 'Codec asset hash mismatch: ' + name)
            target = scene / name
            require(not target.is_symlink(), 'Codec target must be a real local file')
            require(not target.exists() or target.read_bytes() == content, 'Refuse to overwrite differing codec asset')
            (stage / name).write_bytes(content)
        for original_file, signature in legacy_stamps.items():
            current = original_file.stat()
            require((current.st_size, current.st_mtime_ns, current.st_ctime_ns) == signature, 'Original chunk changed during import')
        require(manifest_path.read_bytes() == before and package_path.read_bytes() == package_before and args.sidecar.read_bytes() == sidebytes, 'Inputs changed during codec import')
        for name in modern_assets:
            target = scene / name
            if not target.exists():
                # Exclusive create; never clobber an asset introduced concurrently.
                with target.open('xb') as out, (stage / name).open('rb') as src:
                    shutil.copyfileobj(src, out)
        (stage / 'manifest.json').write_bytes(data)
        package_temp = package_path.with_name('.scene-package46.codec-import.tmp')
        with package_temp.open('xb') as out:
            out.write(packaged)
        # Both are individually atomic. Interrupted two-file commit is fail-closed
        # by source/package consistency check on the next build, never publish it.
        os.replace(stage / 'manifest.json', manifest_path)
        os.replace(package_temp, package_path)
    print(json.dumps({'policy': 'strict-wire-min-v1-no-instances', 'selectedChunks': len(selected), 'selectedChunkBytes': sum(c.get('alternative', c)['bytes'] for c in manifest['chunks']), 'additionalAssetBytes': sum(v[1]['bytes'] for v in modern_assets.values()), 'sidecarSHA256': sha(sidebytes)}))

if __name__ == '__main__':
    main()
