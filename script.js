/*
 * INDUSTRIAS MARZZELLI PERÚ CUEROS E.I.R.L.
 * Maqueta estática: no base de datos, no APIs, no pagos, no envíos de formularios.
 * Las ilustraciones SVG son referenciales; las fotografías se incorporan
 * automáticamente desde catalogo-fotos.js (generado en tu PC).
 */
'use strict';
const DEMO_PRODUCTS = [
  {id:'cartera',name:'Cartera estructurada',category:'carteras',section:'Carteras y bolsos',gender:'Dama',material:'Cuero',image:'assets/img/productos/cartera.svg',description:'Cartera de silueta estructurada, pensada para combinar estilo y funcionalidad. Modelo de demostración.'},
  {id:'bolso',name:'Bolso de uso diario',category:'carteras',section:'Carteras y bolsos',gender:'Dama',material:'Textil combinado con cuero',image:'assets/img/productos/bolso.svg',description:'Bolso de línea funcional, con propuesta de materiales combinados. Modelo de demostración.'},
  {id:'mochila',name:'Mochila urbana',category:'mochilas',section:'Mochilas y morrales',gender:'Unisex',material:'Cuero y textil',image:'assets/img/productos/mochila.svg',description:'Mochila ilustrativa para actividades de todos los días. Modelo de demostración.'},
  {id:'morral',name:'Morral clásico',category:'mochilas',section:'Mochilas y morrales',gender:'Caballero',material:'Cuero',image:'assets/img/productos/morral.svg',description:'Morral de inspiración clásica y diseño práctico. Modelo de demostración.'},
  {id:'calzado',name:'Calzado de vestir',category:'calzado',section:'Calzado',gender:'Caballero',material:'Cuero',image:'assets/img/productos/calzado.svg',description:'Calzado de estilo formal para un atuendo elegante. Modelo de demostración.'},
  {id:'billetera',name:'Billetera clásica',category:'accesorios',section:'Accesorios',gender:'Caballero',material:'Cuero',image:'assets/img/productos/billetera.svg',description:'Billetera compacta de líneas tradicionales. Modelo de demostración.'},
  {id:'correa',name:'Correa de cuero',category:'accesorios',section:'Accesorios',gender:'Unisex',material:'Cuero',image:'assets/img/productos/correa.svg',description:'Accesorio versátil de estilo sobrio. Modelo de demostración.'},
  {id:'monedero',name:'Monedero compacto',category:'accesorios',section:'Accesorios',gender:'Dama',material:'Cuero',image:'assets/img/productos/monedero.svg',description:'Monedero pequeño pensado para los esenciales. Modelo de demostración.'}
];
// El archivo catalogo-fotos.js siempre se carga ANTES de script.js.
// Cada fotografía listada aquí corresponde a un archivo físico del repositorio.
const PHOTO_PRODUCTS = Array.isArray(window.MARZZELLI_FOTOS) ? window.MARZZELLI_FOTOS : [];
// Las ilustraciones solo rellenan las líneas aún sin fotos reales.
const PRODUCTS = PHOTO_PRODUCTS.length
  ? [...PHOTO_PRODUCTS, ...DEMO_PRODUCTS.filter(d =>
       !PHOTO_PRODUCTS.some(p => p.category === d.category && p.gender === d.gender))]
  : DEMO_PRODUCTS;
const STORAGE_KEY='marzzelli-muestra-seleccion-v3';
const $=(id)=>document.getElementById(id);
const page=document.body.dataset.page;
let toastTimer;

function getSelection(){
  try{
    const list=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    if(Array.isArray(list))return [...new Set(list)].filter(id=>PRODUCTS.some(p=>p.id===id));
  }catch(e){}
  return [];
}
function setSelection(items){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items));}catch(e){}
  updateCount();
}
function updateCount(){
  const count=$('selectionCount');
  if(count)count.textContent=String(getSelection().length);
}
function notify(message){
  const toast=$('toast');
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('visible'),3000);
}
function addItem(id){
  const p=PRODUCTS.find(product=>product.id===id);
  if(!p)return;
  const saved=getSelection();
  if(saved.includes(id)){notify('Este artículo ya está en tu selección.');return;}
  saved.push(id);setSelection(saved);notify(`${p.name} agregado a tu selección.`);
  refreshAddedButtons();
}
function removeItem(id){
  setSelection(getSelection().filter(x=>x!==id));
  notify('Artículo eliminado.');
}
function refreshAddedButtons(){
  const saved=getSelection();
  document.querySelectorAll('[data-add]').forEach(btn=>{
    const has=saved.includes(btn.dataset.add);
    btn.textContent=has?'✓ Seleccionado':'+ Seleccionar';
    btn.classList.toggle('is-added',has);
    btn.setAttribute('aria-pressed',String(has));
  });
}
function esc(value){
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function imageAlt(p){
  return `${p.isPhoto ? 'Fotografía' : 'Ilustración referencial'} de ${p.name}`;
}
function productCard(p){
  const name=esc(p.name), img=esc(p.image), id=esc(p.id);
  const label=p.isPhoto ? '' : '<span class="product-pill">ILUSTRATIVO</span>';
  return `<article class="product-card">
    <a class="product-image-link" href="producto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver detalle de ${name}">
      <img src="${img}" alt="${esc(imageAlt(p))}" loading="lazy" width="800" height="900">${label}
    </a>
    <div class="product-text"><p class="product-type">${esc(p.gender)} / ${esc(p.section)}</p>
      <h3><a href="producto.html?id=${encodeURIComponent(p.id)}">${name}</a></h3>
      <p class="product-material">${esc(p.material)}</p>
      <button type="button" class="product-action" data-add="${id}">+ Seleccionar</button>
    </div></article>`;
}
function renderGrid(element,products){
  element.innerHTML=products.length?products.map(productCard).join(''):'<div class="empty-state"><h3>No encontramos artículos</h3><p>Prueba otra búsqueda o cambia el filtro.</p><a class="btn btn-outline" href="catalogo.html">Ver todos →</a></div>';
  refreshAddedButtons();
}
function initCatalog(){
  const grid=$('catalogGrid');
  if(!grid)return;
  const params=new URLSearchParams(window.location.search);
  const search=$('searchProducts'), cat=$('categorySelect'), gender=$('genderSelect');
  const initCat=params.get('categoria');
  if(['carteras','mochilas','calzado','accesorios'].includes(initCat))cat.value=initCat;
  const initGender=params.get('genero');
  if(gender && ['Dama','Caballero','Unisex'].includes(initGender))gender.value=initGender;
  function filter(){
    const q=search.value.toLocaleLowerCase('es').trim();
    let items=PRODUCTS.filter(p=>
      (cat.value==='todos'||cat.value===p.category)&&
      (!gender||gender.value==='todos'||p.gender===gender.value)&&
      (page!=='dama'||['Dama','Unisex'].includes(p.gender))&&
      (page!=='caballero'||['Caballero','Unisex'].includes(p.gender))&&
      `${p.name} ${p.material} ${p.section} ${p.gender}`.toLocaleLowerCase('es').includes(q)
    );
    renderGrid(grid,items);
    $('resultCount').textContent=`${items.length} ${items.length===1?'artículo':'artículos'} en pantalla`;
  }
  [search,cat,gender].filter(Boolean).forEach(el=>el.addEventListener(el===search?'input':'change',filter));
  filter();
}
function initProductDetail(){
  const detail=$('productDetail');
  if(!detail)return;
  const id=new URLSearchParams(window.location.search).get('id');
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p){detail.innerHTML='<div class="empty-state"><h2>Artículo no encontrado</h2><p>Este artículo no está incluido en la maqueta.</p><a class="btn btn-dark" href="catalogo.html">Volver al catálogo</a></div>';return;}
  document.title=`${p.name} | MARZZELLI Perú Cueros`;
  $('detailCrumb').textContent=p.name;
  detail.innerHTML=`<div class="detail-media"><img src="${esc(p.image)}" alt="${esc(imageAlt(p))}" width="800" height="900"></div>
    <div class="detail-info"><span class="eyebrow">${esc(p.section)} / ${esc(p.gender)}</span><h1>${esc(p.name)}</h1>
      <p>${esc(p.description)}</p>
      <div class="detail-meta"><strong>Material</strong><span>${esc(p.material)}</span></div>
      <div class="detail-meta"><strong>Colección</strong><span>${esc(p.gender)}</span></div>
      <div class="detail-meta"><strong>Imagen</strong><span>${p.isPhoto?'Fotografía incorporada al catálogo':'Ilustración provisional de maqueta'}</span></div>
      <div class="detail-actions"><button class="btn btn-dark btn-full" type="button" data-add="${esc(p.id)}">+ Agregar a mi selección</button><a class="btn btn-outline btn-full" href="seleccion.html">Ver mi selección →</a></div>
      <p class="detail-notice">Maqueta estática. No se realizan compras ni se verifica stock.</p>
    </div>`;
}
function initSelection(){
  const wrapper=$('selectionItems');
  if(!wrapper)return;
  function render(){
    const saved=getSelection();
    const products=saved.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
    $('selectionSummaryCount').textContent=`${products.length} ${products.length===1?'artículo':'artículos'}`;
    $('copySelection').disabled=products.length===0;
    $('clearSelection').disabled=products.length===0;
    wrapper.innerHTML=products.length?products.map(p=>`<article class="selection-item"><a href="producto.html?id=${encodeURIComponent(p.id)}"><img src="${esc(p.image)}" alt="${esc(imageAlt(p))}" width="100" height="110"></a><div><h3><a href="producto.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3><p>${esc(p.gender)} · ${esc(p.material)}</p><button type="button" class="quiet-button" data-remove="${esc(p.id)}">Eliminar</button></div></article>`).join(''):'<div class="selection-empty"><h3>Tu lista está vacía</h3><p>Elige tus artículos favoritos y agrégalos desde el catálogo.</p><a href="catalogo.html" class="btn btn-dark">Ver catálogo →</a></div>';
  }
  wrapper.addEventListener('click',e=>{const btn=e.target.closest('[data-remove]');if(!btn)return;removeItem(btn.dataset.remove);render();});
  $('clearSelection').addEventListener('click',()=>{setSelection([]);render();notify('Selección vaciada.');});
  $('copySelection').addEventListener('click',async()=>{
    const list=getSelection().map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
    if(!list.length)return;
    const content=`MARZZELLI PERÚ CUEROS - Consulta referencial\n\n${list.map((p,i)=>`${i+1}. ${p.name} (${p.gender}; ${p.material})`).join('\n')}\n\nMaqueta sin precios ni compra online.`;
    const success=await copyText(content);
    notify(success?'Lista copiada. Puedes pegarla donde quieras.':'No fue posible copiar automáticamente.');
  });
  render();
}
async function copyText(text){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}catch(e){}
  const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.left='-10000px';document.body.appendChild(t);t.select();
  let ok=false;try{ok=document.execCommand('copy');}catch(e){}t.remove();return ok;
}
function initContact(){
  const form=$('contactForm');
  if(!form)return;
  const preview=$('contactPreview'), output=$('contactPreviewText');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('contactName').value.trim();
    const email=$('contactEmail').value.trim();
    const interest=$('contactInterest').value;
    const message=$('contactMessage').value.trim();
    if(!name||!interest||!message){notify('Completa nombre, producto y mensaje.');return;}
    if(email&& !$('contactEmail').checkValidity()){notify('Revisa el formato del correo.');return;}
    output.textContent=`Hola, soy ${name}.\n\nProducto de interés: ${interest}\n${email?`Correo: ${email}\n`:''}\n${message}\n\nConsulta preparada desde la maqueta de MARZZELLI.`;
    preview.hidden=false;preview.scrollIntoView({behavior:'smooth',block:'nearest'});notify('Mensaje preparado. No se ha enviado.');
  });
  $('copyContact').addEventListener('click',async()=>{
    notify(await copyText(output.textContent)?'Mensaje copiado.':'No fue posible copiar el mensaje.');
  });
}
function initMenu(){
  const toggle=$('navToggle'),nav=$('siteNav');
  toggle.addEventListener('click',()=>{
    const active=nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded',String(active));
    toggle.setAttribute('aria-label',active?'Cerrar menú':'Abrir menú');
  });
  nav.addEventListener('click',e=>{
    if(e.target.closest('a')){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}});
  const active=document.querySelector(`[data-nav="${page}"]`);
  if(active){active.classList.add('active');active.setAttribute('aria-current','page');}
}
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-add]');
  if(button){e.preventDefault();addItem(button.dataset.add);}
});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
initMenu();updateCount();
function initImageShowcases(){
  // Sustituye las ilustraciones por fotos reales cuando existan.
  const hero=document.querySelector('[data-hero-image]');
  const first=PHOTO_PRODUCTS.find(p=>p.gender==='Dama') || PHOTO_PRODUCTS[0];
  if(hero && first){hero.src=first.image;hero.alt=imageAlt(first);hero.classList.add('real-photo');}
  document.querySelectorAll('[data-category-image]').forEach(img=>{
    const category=img.dataset.categoryImage;
    const gender=img.dataset.categoryGender;
    const matching=PHOTO_PRODUCTS.find(p=>p.category===category && (!gender || p.gender===gender));
    if(matching){img.src=matching.image;img.alt=imageAlt(matching);img.classList.add('real-photo');}
  });
  document.querySelectorAll('[data-about-image]').forEach(img=>{
    const matching=PHOTO_PRODUCTS.find(p=>p.gender==='Caballero')||PHOTO_PRODUCTS[0];
    if(matching){img.src=matching.image;img.alt=imageAlt(matching);img.classList.add('real-photo');}
  });
}
initImageShowcases();
function homeFeatured(){
  // Prioriza variedad visual y fotografías antes de modelos ilustrados.
  const chosen=[];
  for(const [cat,gender] of [['carteras','Dama'],['mochilas','Dama'],['mochilas','Caballero'],['accesorios','Caballero']]){
    const matches=PHOTO_PRODUCTS.filter(p=>p.category===cat && p.gender===gender);
    for(const item of matches.slice(0,2))if(!chosen.includes(item))chosen.push(item);
  }
  for(const p of [...PHOTO_PRODUCTS,...PRODUCTS]){
    if(chosen.length>=8)break;
    if(!chosen.some(x=>x.id===p.id))chosen.push(p);
  }
  return chosen.slice(0,8);
}
if(page==='inicio'){renderGrid($('featuredGrid'),homeFeatured());}
if(['catalogo','dama','caballero'].includes(page))initCatalog();
if(page==='producto'){initProductDetail();refreshAddedButtons();}
if(page==='seleccion')initSelection();
if(page==='contacto')initContact();
