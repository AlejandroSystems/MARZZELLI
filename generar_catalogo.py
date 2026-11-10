#!/usr/bin/env python3
"""Crea catalogo-fotos.js con las fotografías locales del proyecto MARZZELLI.

Uso (Windows, terminal en la carpeta del sitio): py generar_catalogo.py
Solo se utiliza la biblioteca estándar de Python; no requiere instalar paquetes.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "catalogo-fotos.js"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}

# Las carpetas se identifican sin distinguir mayúsculas ni minúsculas.
# Su nombre REAL se conserva en la URL publicada (GitHub sí las distingue).
GROUPS = (
    {
        "names": ("Carterasmujer", "CarterasMujer"),
        "category": "carteras",
        "section": "Carteras y bolsos",
        "gender": "Dama",
        "singular": "Cartera o bolso para dama",
    },
    {
        "names": ("CarterasHombre",),
        "category": "accesorios",
        "section": "Billeteras y carteras",
        "gender": "Caballero",
        "singular": "Billetera / cartera para caballero",
    },
    {
        "names": ("Mochilashombre", "MochilasHombre"),
        "category": "mochilas",
        "section": "Mochilas",
        "gender": "Caballero",
        "singular": "Mochila para caballero",
    },
    {
        "names": ("Mochilasmujer", "MochilasMujer"),
        "category": "mochilas",
        "section": "Mochilas",
        "gender": "Dama",
        "singular": "Mochila para dama",
    },
)


def find_folders(names: tuple[str, ...]) -> list[Path]:
    wanted = {name.casefold() for name in names}
    return sorted(
        [path for path in ROOT.iterdir() if path.is_dir() and path.name.casefold() in wanted],
        key=lambda path: path.name.casefold(),
    )


def main() -> int:
    products = []
    counts = []
    for group in GROUPS:
        folders = find_folders(group["names"])
        if not folders:
            print(f"AVISO: falta la carpeta {group['names'][0]} en {ROOT}")
            counts.append((group["names"][0], 0))
            continue
        pictures = []
        for folder in folders:
            pictures.extend(
                file for file in folder.rglob('*')
                if file.is_file() and file.suffix.lower() in EXTENSIONS
                and not any(x in file.stem.casefold() for x in ('catalogo','catálogo','collage','portada','banner'))
            )
        pictures.sort(key=lambda file: file.relative_to(ROOT).as_posix().casefold())
        counts.append((" / ".join(f.name for f in folders), len(pictures)))
        for position, file in enumerate(pictures, start=1):
            relative = file.relative_to(ROOT).as_posix()
            # URL de verdad, sin / inicial; también sirve en usuario.github.io/repositorio/.
            url = quote(relative, safe='/')
            unique_id = hashlib.sha1(relative.encode('utf-8')).hexdigest()[:12]
            products.append({
                "id": f"foto-{unique_id}",
                "name": f"{group['singular']} {position:02d}",
                "category": group["category"],
                "section": group["section"],
                "gender": group["gender"],
                "material": "Material por confirmar",
                "image": url,
                "description": (
                    "Fotografía incorporada a la maqueta. El material, "
                    "las medidas y la disponibilidad deben confirmarse antes de publicar el catálogo definitivo."
                ),
                "isPhoto": True,
            })
    if not products:
        print("\nNo se encontraron fotografías. Revisa que estén dentro de las carpetas mencionadas.")
        print("No se modificó catalogo-fotos.js; se mantienen las ilustraciones provisionales.")
        return 1
    content = (
        "/* GENERADO AUTOMÁTICAMENTE CON generar_catalogo.py. */\n"
        "/* No edites este archivo a mano: agrega fotos y vuelve a ejecutar el generador. */\n"
        "window.MARZZELLI_FOTOS = "
        + json.dumps(products, ensure_ascii=False, indent=2)
        + ";\n"
    )
    OUTPUT.write_text(content, encoding='utf-8')
    print("\nMARZZELLI: catálogo actualizado")
    for folder, count in counts:
        print(f"  - {folder}: {count} imagen(es)")
    print(f"TOTAL: {len(products)} imágenes registradas")
    print(f"LISTO: {OUTPUT.name}")
    print("Ahora comprueba catalogo.html con Live Server y sube la carpeta completa a GitHub.")
    return 0


if __name__ == '__main__':
    sys.exit(main())
