"""Verify local VMG archives without running project code; Python stdlib only."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import zipfile

ROOT = Path(__file__).resolve().parent.parent


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify(entry):
    path = (ROOT / entry['package_path']).resolve()
    require(path.is_relative_to(ROOT) and path.suffix == '.vmg', 'Invalid source path')
    require(hashlib.sha256(path.read_bytes()).hexdigest() == entry['package_sha256'], 'Archive checksum mismatch')
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        require(len(names) == len(set(names)), 'Duplicate archive path')
        for name in names:
            parts = PurePosixPath(name)
            require(not parts.is_absolute() and '..' not in parts.parts and '\\' not in name, 'Unsafe archive path')
        manifest = json.loads(archive.read('manifest.json'))
        require(manifest['format'] == 'vmg-project' and manifest['kind'] == 'source', 'Not a source archive')
        require(manifest['formatVersion'] == 1, 'Unsupported archive version')
        files = manifest['files']
        indexed = {file['path'] for file in files}
        require(len(indexed) == len(files), 'Duplicate manifest path')
        require(set(names) == indexed | {'manifest.json'}, 'Manifest file list mismatch')
        for file in files:
            data = archive.read(file['path'])
            require(len(data) == file['size'], f"Size mismatch: {file['path']}")
            require(hashlib.sha256(data).hexdigest() == file['sha256'], f"Hash mismatch: {file['path']}")
        required = {manifest['projectPath'], manifest['source']['entry'], 'package.json', 'pnpm-lock.yaml', 'vmg.config.ts'}
        require(required <= indexed, 'Missing source project files')
        project = json.loads(archive.read(manifest['projectPath']))
        package = json.loads(archive.read('package.json'))
        require(project['template']['version'] == entry['template_version'], 'Template version mismatch')
        require(package['devDependencies']['@base_bit/vmg-sdk'] == entry['sdk_version'], 'SDK version mismatch')
        assets = {asset['id']: asset for asset in project['assets']}
        bindings = {asset['assetId']: asset for asset in manifest['assets']}
        require(set(assets) == set(bindings), 'Resource binding mismatch')
        for asset_id, binding in bindings.items():
            require(binding['kind'] == 'embedded' and binding['path'] in indexed, 'Missing resource')
            data = archive.read(binding['path'])
            require(len(data) == assets[asset_id]['size'], 'Resource size mismatch')
            require(hashlib.sha256(data).hexdigest() == assets[asset_id]['sha256'], 'Resource hash mismatch')
        if entry.get('preview_path'):
            preview = (ROOT / entry['preview_path']).resolve()
            require(preview.is_relative_to(ROOT), 'Preview escapes repository')
            originals = [bindings[asset_id]['path'] for asset_id, asset in assets.items()
                         if asset.get('metadata', {}).get('originalRelativePath') == 'preview.png']
            require(len(originals) == 1 and preview.read_bytes() == archive.read(originals[0]), 'Preview mismatch')
        print(f"{entry['id']}: {len(files)} files, {len(assets)} embedded assets OK")


if __name__ == '__main__':
    catalog = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
    for entry in catalog['projects']:
        if entry.get('package_path'):
            verify(entry)
