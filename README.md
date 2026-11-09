# MARZZELLI Perú Cueros — maqueta estática con fotos locales

Sitio de 9 páginas HTML y recursos locales. No tiene servidor, base de datos, pagos, WhatsApp conectado ni envío de formularios. Las fichas, la navegación y la lista de selección son demostrativas.

## PASO 1: incorpora TUS carpetas de fotografías

Estas carpetas deben estar **en la misma carpeta que `index.html`**:

```text
PaginaWebsimple/
├── index.html
├── catalogo.html
├── dama.html
├── caballero.html
├── nosotros.html
├── contacto.html
├── producto.html
├── seleccion.html
├── preguntas.html
├── styles.css
├── script.js
├── catalogo-fotos.js      ← lo genera el programa
├── generar_catalogo.py   ← ejecuta al agregar/cambiar imágenes
├── ACTUALIZAR_FOTOS.bat  ← doble clic en Windows (Python instalado)
├── .nojekyll
├── assets/
│   └── img/
│       ├── identidad/
│       └── productos/       ← SVG provisionales
├── CarterasHombre/          ← tus archivos JPG/WEBP/AVIF/PNG
├── Mochilashombre/          ← m1.avif, m2.jpg, m3.jpg, m4.jpg, m5.jpg...
└── Mochilasmujer/           ← tus fotografías de mochilas para dama
```

Respeta los nombres de las carpetas y los nombres **reales** de los archivos; las rutas se generan usando esos nombres exactos. El generador también reconoce las variantes `MochilasHombre` y `MochilasMujer`. Si ya tienes las fotografías en esas carpetas **no las borres** ni las sustituyas por el ZIP.

## PASO 2: actualizar catálogo

**Windows (fácil)**: doble clic en `ACTUALIZAR_FOTOS.bat`.

**VS Code / terminal** (requiere Python 3):

```powershell
py generar_catalogo.py
```

Se genera `catalogo-fotos.js` sin escribir a mano los nombres extensos, espacios, paréntesis o caracteres especiales. El programa encuentra `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` y `.gif`, crea una entrada por foto y produce la ruta URL correcta. **No subas imágenes nuevas sin volver a ejecutar este paso.**

**Las imágenes no se adjuntan a este ZIP**, porque solamente recibimos capturas de pantalla, no los archivos de tus carpetas de Windows. Debes conservar tus fotos originales.

## PASO 3: comprobar en navegador

Abre `index.html` mediante la extensión **Live Server**. Revisa `catalogo.html`, `dama.html`, `caballero.html` y una ficha de artículo; debe aparecer cada foto. En la portada y en «Nosotros» aparecerán fotografías de tus carpetas cuando las hayas incorporado. Las categorías sin fotografía utilizarán las ilustraciones SVG temporales.

## PASO 4: subir el proyecto a GitHub

1. En VS Code abre la carpeta `PaginaWebsimple` que contiene `index.html`.
2. Comprueba que `catalogo-fotos.js` ya muestre tus fotos y que todas las carpetas estén en el repositorio.
3. Haz commit y push del **contenido entero** de la carpeta. Si usas la web de GitHub, carga los archivos y carpetas, no únicamente los HTML.
4. Para una demostración pública en GitHub Pages: `Settings → Pages → Build and deployment → Deploy from a branch → main / (root)`.
5. Para una página comercial real, conserva el código en GitHub pero usa un host compatible, como Cloudflare Pages.

### Importante

- Las rutas son **relativas**: `CarterasHombre/foto.webp` y no `/CarterasHombre/foto.webp`; sirven en `usuario.github.io/nombre-del-repo/`.
- GitHub publica distinguiendo mayúsculas/minúsculas. El generador garantiza que coincidan los nombres reales.
- `catalogo-fotos.js` es un archivo **necesario** y hay que subirlo junto con las fotos.
- `.nojekyll` evita que Jekyll procese los archivos de una maqueta HTML pura.
- Por motivos de derechos de autor, publica solamente fotografías propias o imágenes con licencia que permita su uso comercial. Haberlas descargado no garantiza esa autorización.
- Este sitio no obtiene ni conserva datos personales en un servidor. El formulario crea un mensaje de muestra y no lo envía.
- **GitHub Pages no está permitido como alojamiento de una tienda comercial**. Úsalo únicamente para mostrar/probar la maqueta, conforme a las condiciones oficiales: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Si quieres actualizar textos de un producto

Abre `catalogo-fotos.js` y cambia los nombres, descripciones y materiales como prueba. Pero recuerda que al ejecutar el generador estos cambios se reemplazarán. Para una versión definitiva con datos de catálogo editables, podemos crear un archivo `productos-personalizados.json` separado y unirlo al generador.
