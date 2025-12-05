#!/usr/bin/env python3
# Dumper que divide SIEMPRE en N partes, aunque no haga falta por tamaño.

import os
import sys
import argparse
from pathlib import Path

IGNORE_DIRS = {
    "node_modules", ".git", ".nuxt", ".output", "dist", "build", "coverage",
    "__pycache__", ".DS_Store", ".vercel", ".next", ".idea", ".vscode"
}
IGNORE_EXTS = {
    ".png",".jpg",".jpeg",".gif",".webp",".svg",
    ".woff",".woff2",".ttf",".eot",
    ".ico",".lock",".pdf",".zip",".rar",".7z",".xz",".gz",
    ".mp4",".mp3",".mov",".avi",".webm",".mkv"
}

def is_likely_binary(filepath: Path, chunk_size: int = 2048) -> bool:
    try:
        with filepath.open("rb") as f:
            chunk = f.read(chunk_size)
        return b"\0" in chunk
    except Exception:
        return True

def iter_source_files(root: Path, exclude_dts: bool):
    for dirpath, dirnames, filenames in os.walk(root, topdown=True):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for name in filenames:
            p = Path(dirpath) / name
            rel = p.relative_to(root)

            if p.suffix.lower() in IGNORE_EXTS:
                continue
            if is_likely_binary(p):
                continue
            if exclude_dts and p.suffix == ".d.ts" and "types" not in rel.parts[:1]:
                continue

            try:
                text = p.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            header = f"--- @file: {str(rel).replace(os.sep, '/')} ---\n\n"
            yield str(rel), header + text + "\n\n"

def split_forced(entries, parts):
    chunks = [[] for _ in range(parts)]
    for i, (_, payload) in enumerate(entries):
        chunks[i % parts].append(payload)
    return chunks

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".", help="Raíz del proyecto (default: .)")
    ap.add_argument("--out-dir", default="dumper", help="Carpeta de salida")
    ap.add_argument("--parts", type=int, default=8, help="Número de partes")
    ap.add_argument("--base-name", default="dump_part", help="Prefijo de archivo")
    ap.add_argument("--exclude-dts", action="store_true", help="Excluir .d.ts fuera de ./types")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    entries = list(iter_source_files(root, args.exclude_dts))
    entries.sort(key=lambda x: x[0])

    chunks = split_forced(entries, args.parts)

    total_parts = len(chunks)
    for i, chunk in enumerate(chunks, start=1):
        fname = f"{args.base_name}_{i}_of_{total_parts}.txt"
        fpath = out_dir / fname
        with fpath.open("w", encoding="utf-8", errors="ignore") as f:
            f.write("".join(chunk))
        print(f"✅ Escrito {fpath} con {len(chunk)} archivos.")

if __name__ == "__main__":
    main()
