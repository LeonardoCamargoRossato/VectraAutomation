#!/usr/bin/env python3
"""Verify menu asset migration, hashes, catalogs and stale runtime paths."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "code/public/assets"
MAP = ROOT / "documentation/AssetMigrationMap.json"

def check(path, size, sha, git_sha):
    assert path.is_file(), f"Missing: {path}"
    data = path.read_bytes()
    assert len(data) == size, f"Length: {path}"
    assert hashlib.sha256(data).hexdigest() == sha, f"SHA-256: {path}"
    assert hashlib.sha1(f"blob {len(data)}".encode() + bytes([0]) + data).hexdigest() == git_sha, f"Git SHA: {path}"

def validate(require_clean=False):
    entries = json.loads(MAP.read_text())["entries"]
    assert len(entries) == 130
    old = {r["oldPath"] for r in entries}
    new = {r["newPath"] for r in entries}
    assert len(old) == len(new) == len({p.casefold() for p in new}) == len(entries)
    assert not old & new
    for r in entries:
        p, q = ROOT / r["oldPath"], ROOT / r["newPath"]
        if p.exists():
            assert not require_clean, f"Legacy path exists: {p}"
            check(p, r["bytes"], r["sha256"], r["gitBlobSha"])
        else:
            assert require_clean, f"Legacy copy removed before cleanup: {p}"
        check(q, r.get("newBytes", r["bytes"]), r.get("newSha256", r["sha256"]), r.get("newGitBlobSha", r["gitBlobSha"]))
        assert q.relative_to(PUBLIC).parts[0] in ("top-menu", "side-menu")
    inventory = json.loads((ROOT / 'documentation/AssetInventory.json').read_text())
    approved = {a['path'] for a in inventory['assets'] if a['id'].startswith('vectra-hero-triptych-')}
    assert len(approved) == 3
    for a in inventory['assets']:
        if a['path'] in approved:
            check(ROOT / a['path'], a['bytes'], a['sha256'], a['gitBlobSha'])
    additions = {a['path'] for a in inventory['assets'] if a['id'] in ('vectra-explorer-exterior-png', 'vectra-explorer-exterior-webp', 'flag-us')}
    assert len(additions) == 3
    for a in inventory['assets']:
        if a['path'] in additions:
            p = ROOT / a['path']
            data = p.read_bytes()
            assert hashlib.sha1(f'blob {len(data)}'.encode() + bytes([0]) + data).hexdigest() == a['gitBlobSha']
            if 'sha256' in a:
                check(p, a['bytes'], a['sha256'], a['gitBlobSha'])
    new |= approved | additions
    intake = PUBLIC / 'assets-novos' / '.gitkeep'
    assert intake.is_file() and intake.stat().st_size == 0
    actual = {p.relative_to(ROOT).as_posix() for p in PUBLIC.rglob("*") if p.is_file() and p != intake}
    expected = new if require_clean else old | new
    assert actual == expected, f"Unexpected assets: {actual ^ expected}"
    obsolete = ("assets/home/", "assets/about-author/", "assets/branding/", "assets/explorar/", "assets/acervo-fotografico/", r"assets\/acervo-fotografico\/", "/veiculo-real/")
    for p in [ROOT / "code/index.html", *(ROOT / "code/src").rglob("*"), *(ROOT / "code/tests").rglob("*")]:
        if p.is_file() and p.suffix in (".jsx", ".js", ".css", ".json", ".html"):
            for line in p.read_text().splitlines():
                assert not any(x in line for x in obsolete), f"Obsolete executable path: {p}"
    for name in ("ReferenceCatalog.json", "RealPhotoCatalog.json"):
        rows = json.loads((ROOT / "code/src/lib/photo-reference" / name).read_text())
        for row in rows:
            for key in ("png", "webp"):
                a = row["assets"][key]
                assert a["path"] in new
                check(ROOT / a["path"], a["bytes"], a["sha256"], a["gitSha"])
    print(f"Validated {len(entries)} canonical assets; {'clean' if require_clean else 'dual-path migration'}.")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--require-clean", action="store_true")
    validate(p.parse_args().require_clean)
