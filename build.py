#!/usr/bin/env python3
"""
build.py — generatore del sito ritadigregorio.it

Nessuna dipendenza esterna. Solo stdlib (Python 3.8+).

Input:
  - pages/*.html         sorgenti delle pagine (con placeholder)
  - partials/*.html      frammenti riutilizzabili
  - content.json         dati condivisi

Output:
  - *.html nella root    pagine finali pubblicate
  - sitemap.xml          con lastmod derivato dal mtime del sorgente

Sintassi template supportata:

  {{ chiave.sotto-chiave }}                  -> sostituisce con content.json o page.*
  {{> nome-partial }}                         -> include partials/nome-partial.html (ricorsivo)
  {{#each lista}}...{{this.campo}}...{{/each}}   -> itera su un array

In cima a una pagina sorgente:
  <!--page
  {
    "path": "chi-sono.html",
    "title": "Chi Sono | Rita Di Gregorio",
    "description": "...",
    "ogTitle": "...",
    "ogDescription": "...",
    "ogImage": "images/chisono.jpeg",
    "priority": "0.8"
  }
  page-->

Uso:
  python3 build.py           build completo
  python3 build.py --check   verifica che l'output sia sincronizzato (exit 1 se no)
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGES_DIR = ROOT / "pages"
PARTIALS_DIR = ROOT / "partials"
CONTENT_FILE = ROOT / "content.json"
SITEMAP_FILE = ROOT / "sitemap.xml"

CHECK_MODE = "--check" in sys.argv[1:]

PAGE_META_RE = re.compile(r"<!--page\s+([\s\S]*?)\s+page-->\s*")
EACH_RE = re.compile(r"\{\{#each\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{/each\}\}")
VAR_RE = re.compile(r"\{\{\s*([\w.]+)\s*\}\}")
PARTIAL_RE = re.compile(r"\{\{>\s*([\w-]+)\s*\}\}")

EXIT_CODE = 0


def fail(msg: str) -> None:
    global EXIT_CODE
    print(f"[error] {msg}", file=sys.stderr)
    EXIT_CODE = 1


def warn(msg: str) -> None:
    print(f"[warn] {msg}", file=sys.stderr)


def read_file(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def write_file(p: Path, content: str) -> None:
    global EXIT_CODE
    if CHECK_MODE:
        existing = p.read_text(encoding="utf-8") if p.exists() else ""
        if existing != content:
            print(f"[check] out of sync: {p.relative_to(ROOT)}", file=sys.stderr)
            EXIT_CODE = 1
        return
    p.write_text(content, encoding="utf-8")


def resolve_key(ctx: dict, key: str):
    parts = key.split(".")
    cur = ctx
    for part in parts:
        if cur is None:
            return None
        if isinstance(cur, dict):
            cur = cur.get(part)
        else:
            cur = getattr(cur, part, None)
        if cur is None:
            return None
    return cur


def extract_page_meta(src: str):
    m = PAGE_META_RE.search(src)
    if not m:
        return {}, src
    try:
        meta = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in <!--page ... page-->: {e}") from e
    body = src[: m.start()] + src[m.end():]
    return meta, body


def render_vars(template: str, context: dict) -> str:
    def repl(match: re.Match) -> str:
        key = match.group(1)
        v = resolve_key(context, key)
        if v is None:
            warn(f"unresolved placeholder: {key}")
            return ""
        return html.escape(str(v), quote=True)

    return VAR_RE.sub(repl, template)


def render_each(template: str, context: dict) -> str:
    def repl(match: re.Match) -> str:
        list_key = match.group(1)
        inner = match.group(2)
        items = resolve_key(context, list_key)
        if not isinstance(items, list):
            return ""
        out = []
        for item in items:
            item_ctx = dict(context)
            item_ctx["this"] = item
            out.append(render_vars(inner, item_ctx))
        return "".join(out)

    return EACH_RE.sub(repl, template)


def render_partials(template: str, partials: dict, context: dict, depth: int = 0) -> str:
    if depth > 10:
        raise RuntimeError("Partial recursion too deep")

    def repl(match: re.Match) -> str:
        name = match.group(1)
        p = partials.get(name)
        if p is None:
            warn(f"unknown partial: {name}")
            return ""
        out = render_partials(p, partials, context, depth + 1)
        out = render_each(out, context)
        out = render_vars(out, context)
        return out

    return PARTIAL_RE.sub(repl, template)


def render(template: str, partials: dict, context: dict) -> str:
    out = render_partials(template, partials, context, 0)
    out = render_each(out, context)
    out = render_vars(out, context)
    return out


def load_partials() -> dict:
    if not PARTIALS_DIR.exists():
        return {}
    out = {}
    for f in sorted(PARTIALS_DIR.iterdir()):
        if f.suffix != ".html":
            continue
        out[f.stem] = read_file(f)
    return out


def build_page(page_file: Path, partials: dict, content: dict) -> dict:
    src = read_file(page_file)
    meta, body = extract_page_meta(src)

    if not meta.get("path"):
        raise ValueError(f'Missing "path" in page meta: {page_file}')

    context = dict(content)
    context["page"] = meta

    rendered = render(body, partials, context)

    out_file = ROOT / meta["path"]
    write_file(out_file, rendered)

    return {
        "path": meta["path"],
        "priority": meta.get("priority", "0.5"),
        "mtime": datetime.fromtimestamp(page_file.stat().st_mtime, tz=timezone.utc),
    }


def build_sitemap(page_infos: list, content: dict) -> None:
    # Collect URLs already coming from migrated pages
    migrated_paths = {p["path"] for p in page_infos}
    entries_data = list(page_infos)

    # Legacy (non-migrated) pages: keep them in the sitemap with mtime of the output file
    extra_file = ROOT / "sitemap.extra.json"
    if extra_file.exists():
        try:
            extra = json.loads(read_file(extra_file))
        except json.JSONDecodeError as e:
            warn(f"invalid sitemap.extra.json: {e}")
            extra = []
        for item in extra:
            # Skip if already covered by a migrated source
            rel_path = item.get("path", "")
            file_name = item.get("file")
            if not file_name:
                continue
            # Match keys: "index.html" and "" both refer to home
            output_key = file_name
            if output_key in migrated_paths:
                continue
            fp = ROOT / file_name
            if not fp.exists():
                warn(f"sitemap.extra references missing file: {file_name}")
                continue
            entries_data.append({
                "path": file_name,
                "priority": item.get("priority", "0.5"),
                "mtime": datetime.fromtimestamp(fp.stat().st_mtime, tz=timezone.utc),
                "locOverride": rel_path,  # empty string => homepage "/"
            })

    entries = []
    # Keep a stable order: by path
    for p in sorted(entries_data, key=lambda x: x["path"]):
        lastmod = p["mtime"].strftime("%Y-%m-%d")
        if "locOverride" in p:
            loc = content["site"]["url"] + "/" + p["locOverride"]
        elif p["path"] == "index.html":
            loc = content["site"]["url"] + "/"
        else:
            loc = content["site"]["url"] + "/" + p["path"]
        entries.append(
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <priority>{p['priority']}</priority>\n"
            "  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries) + "\n"
        "</urlset>\n"
    )

    write_file(SITEMAP_FILE, xml)


def main() -> int:
    if not PAGES_DIR.exists():
        print("No pages/ directory. Nothing to build.")
        return 0

    content = json.loads(read_file(CONTENT_FILE))
    partials = load_partials()

    page_files = sorted(PAGES_DIR.glob("*.html"))
    infos = []
    for pf in page_files:
        try:
            info = build_page(pf, partials, content)
            infos.append(info)
            if not CHECK_MODE:
                print(f"built {info['path']}")
        except Exception as e:
            fail(f"{pf.relative_to(ROOT)}: {e}")

    if infos:
        build_sitemap(infos, content)
        if not CHECK_MODE:
            print("sitemap.xml updated")

    if CHECK_MODE and EXIT_CODE == 1:
        print("\n[check] build output is out of sync. Run `python3 build.py`.", file=sys.stderr)

    return EXIT_CODE


if __name__ == "__main__":
    sys.exit(main())
