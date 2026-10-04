"""Shared explicit-manifest codec dependency validation for build and packaging."""
import hashlib
from pathlib import Path


def codec_assets(manifest, cache):
    alternatives = [c for c in manifest['chunks'] if 'alternative' in c]
    if 'codecResources' not in manifest:
        if alternatives:
            raise ValueError('Codec alternatives require explicit resources')
        return []  # Never discover old optional assets by scanning the directory.
    resources = manifest['codecResources']
    if set(resources) != {'decoder', 'license'}:
        raise ValueError('Unsupported codec resource schema')
    rows = [resources['decoder'], resources['license']]
    for chunk in alternatives:
        alt = chunk['alternative']
        if alt['codec'] != 'gzip-meshopt-attributes-v1' or alt['stride'] not in (4, 32) or type(alt['count']) is not int or alt['count'] <= 0 or alt['count'] * alt['stride'] != chunk['rawBytes'] or alt['bytes'] >= chunk['bytes'] or chunk['kind'] == 'instances':
            raise ValueError('Unsupported codec selection')
        rows.append(alt)
    seen = {}
    for row in rows:
        name = row['file']
        if not isinstance(name, str) or not name or name in ('.', '..') or Path(name).name != name or '/' in name or '\\' in name:
            raise ValueError('Unsafe codec resource path')
        if name in seen and seen[name] != row:
            raise ValueError('Conflicting codec resource descriptor')
        file = cache / name
        if file.is_symlink() or not file.is_file():
            raise ValueError('Codec resource must be a real local file: ' + name)
        data = file.read_bytes()
        if len(data) != row['bytes'] or hashlib.sha256(data).hexdigest() != row['sha256']:
            raise ValueError('Codec resource checksum mismatch: ' + name)
        seen[name] = row
    return sorted(seen)
