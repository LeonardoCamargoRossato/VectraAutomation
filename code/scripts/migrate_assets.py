#!/usr/bin/env python3
"""Dry-run or copy assets using the historical manifest; never deletes anything."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()
def run(apply=False):
    rows = json.loads((ROOT / "documentation/AssetMigrationMap.json").read_text())["entries"]
    seen = set()
    for row in rows:
        old, new = ROOT / row["oldPath"], ROOT / row["newPath"]
        assert old.resolve().is_relative_to(ROOT / "code/public/assets") and new.resolve().is_relative_to(ROOT / "code/public/assets")
        assert new not in seen
        seen.add(new)
        if new.exists():
            assert digest(new) in (row["sha256"], row.get("newSha256")), f"Collision: {new}"
            if old.exists():
                assert digest(old) == row["sha256"], f"Changed source: {old}"
            continue
        assert old.is_file() and digest(old) == row["sha256"], f"Invalid source: {old}"
        print(f"{'COPY' if apply else 'PLAN'} {old.relative_to(ROOT)} -> {new.relative_to(ROOT)}")
        if apply:
            new.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(old, new)
            assert digest(new) == row["sha256"]
    print(f"Checked {len(rows)} entries; no deletion.")
if __name__ == "__main__":
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group()
    g.add_argument("--dry-run", action="store_true")
    g.add_argument("--apply", action="store_true")
    run(p.parse_args().apply)
