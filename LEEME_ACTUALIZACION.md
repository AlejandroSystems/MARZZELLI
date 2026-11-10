# MARZZELLI — regreso a la portada original + carrusel de productos V4

Esta actualización **solo sustituye** tres archivos: `index.html`, `styles.css` y `script.js`.

## Instalación

1. Descomprime el ZIP.
2. Haz una copia de seguridad de tu carpeta `C:\AZM\PaginaWebsimple`.
3. Copia los tres archivos del ZIP a `C:\AZM\PaginaWebsimple`, aceptando reemplazarlos.
4. **NO elimines** `catalogo-fotos.js` ni tus carpetas `CarterasHombre`, `Carterasmujer`, `Mochilashombre`, `Mochilasmujer`, ni `assets/`.
5. Si subiste nuevas imágenes desde la última vez que generaste el catálogo, ejecuta `py generar_catalogo.py` desde la carpeta del proyecto. Luego verifica que `catalogo-fotos.js` haya sido actualizado.
6. Abre con Live Server. En la portada, usa los botones ‹ y › sobre la imagen para cambiar los productos. Al hacer clic **sobre la fotografía**, se abre la ficha del producto.
7. Sube a GitHub solo los archivos modificados (`index.html`, `styles.css`, `script.js`) y `catalogo-fotos.js` si cambió.

## Diseño

Se restaura el encabezado hero de dos columnas de la maqueta original: texto y botones a la izquierda, producto rotativo a la derecha. Las demás secciones V3 permanecen intactas. Las imágenes usan rutas relativas compatibles con GitHub Pages y no se requiere base de datos ni servicios externos.

## Notas

- El carrusel **solo cambia cuando haces clic** o presionas ← / → estando enfocado en el carrusel.
- Si no registraste fotografías, muestra ilustraciones provisionales.
- Si ves imágenes de otra marca, actualiza `catalogo-fotos.js` o elimina esas fotos del catálogo antes de publicar la versión comercial.
- En las fichas que aún no estén verificadas no debes presentar materiales o medidas inventados como reales.
