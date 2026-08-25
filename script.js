// --- Navegación Interna (Scroll Suave con compensación de navbar fija) ---
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.hash && this.hash !== '#') {
      e.preventDefault();
      const targetElement = document.querySelector(this.hash);
      const navbar = document.querySelector('.navbar-fixed');
      if (targetElement) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementTop - navbarHeight,
          behavior: 'smooth'
        });
      }
    }
  });
});

// --- Carrusel de Imágenes con Indicadores ---
const carouselTrack = document.querySelector('.carousel-track');
const carousel = document.querySelector('.carousel');

if (!carouselTrack || carouselTrack.children.length === 0) {
  console.warn('Carrusel no encontrado o sin elementos. No se inicializa.');
} else {
  const slides = Array.from(carouselTrack.children);
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');
  let currentSlideIndex = 0;

  // Crear indicadores (dots) dinámicamente
  const dotsContainer = document.createElement('ul');
  dotsContainer.className = 'carousel-dots';
  carousel.appendChild(dotsContainer);

  const dots = [];
  slides.forEach((_, index) => {
    const dot = document.createElement('li');
    dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      currentSlideIndex = index;
      updateSlidePosition();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function updateSlidePosition() {
    if (slides.length === 0) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    carouselTrack.style.transform = `translateX(-${slideWidth * currentSlideIndex}px)`;
    
    // Actualizar dots activos
    dots.forEach((dot, index) => {
      if (index === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Botones manuales
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlidePosition();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    });
  }

  // Autoplay del carrusel
  let autoplayInterval = setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateSlidePosition();
  }, 5000);

  // Detener autoplay cuando el usuario interactúa
  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlidePosition();
    }, 5000);
  };

  if (nextButton) nextButton.addEventListener('click', resetAutoplay);
  if (prevButton) prevButton.addEventListener('click', resetAutoplay);
  dots.forEach(dot => dot.addEventListener('click', resetAutoplay));

  // Teclas izquierda y derecha
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlidePosition();
      resetAutoplay();
    } else if (e.key === 'ArrowLeft') {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
      resetAutoplay();
    }
  });

  // Ajuste en resize y load
  window.addEventListener('resize', updateSlidePosition);
  window.addEventListener('load', updateSlidePosition);
}

// --- FUNCIONALIDAD DE MODO ADMINISTRADOR (SIN CUENTAS) ---

// Iniciar cargando estado de administrador, tema e idioma
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('adminActive') === 'true') {
    toggleAdminMode(true);
  }
  
  const isDark = localStorage.getItem('darkTheme') === 'true';
  if (isDark) {
    document.body.classList.add('dark-theme');
  }
  updateThemeToggleButton(isDark);
  
  const lang = localStorage.getItem('lang') || 'es';
  if (lang === 'en') {
    document.body.classList.add('lang-en');
  }
  updateLangToggleButton(lang);
});

// Activar o desactivar modo administrador
function toggleAdminMode(active) {
  if (active) {
    document.body.classList.add('admin-active');
    localStorage.setItem('adminActive', 'true');
  } else {
    document.body.classList.remove('admin-active');
    localStorage.removeItem('adminActive');
  }
}

// Variables del Modal
const modal = document.getElementById('project-modal');
const form = document.getElementById('project-form');

function openProjectModal() {
  modal.classList.add('active');
}

function closeProjectModal() {
  modal.classList.remove('active');
  form.reset();
  document.getElementById('img-preview-container').style.display = 'none';
  document.getElementById('img-preview').src = '';
}

// Ajustar campos visibles en el formulario
function adjustFormFields(sectionId) {
  const descGroup = document.getElementById('desc-group');
  const projectDesc = document.getElementById('project-desc');
  const casoFields = document.getElementById('caso-fields');
  
  const casoProposito = document.getElementById('caso-proposito');
  const casoObjetivo = document.getElementById('caso-objetivo');
  const casoEnfoque = document.getElementById('caso-enfoque');
  const casoDuracion = document.getElementById('caso-duracion');
  
  const techsInput = document.getElementById('project-techs');
  const imageGroup = document.getElementById('image-group');
  const resultsGroup = document.getElementById('results-group');

  if (sectionId === 'casos') {
    // Esconder descripción, tecnologías, imagen e impactos generales
    descGroup.style.display = 'none';
    projectDesc.removeAttribute('required');
    imageGroup.style.display = 'none';
    resultsGroup.style.display = 'none';
    
    // Mostrar campos de Estudio de Caso
    casoFields.style.display = 'block';
    casoProposito.setAttribute('required', 'required');
    casoObjetivo.setAttribute('required', 'required');
    casoEnfoque.setAttribute('required', 'required');
    casoDuracion.setAttribute('required', 'required');
    
    // Ocultar campo de tecnologías
    techsInput.parentElement.style.display = 'none';
  } else {
    // Mostrar descripción, tecnologías, imagen e impactos generales
    descGroup.style.display = 'block';
    projectDesc.setAttribute('required', 'required');
    imageGroup.style.display = 'block';
    resultsGroup.style.display = 'block';
    
    // Esconder campos de Estudio de Caso
    casoFields.style.display = 'none';
    casoProposito.removeAttribute('required');
    casoObjetivo.removeAttribute('required');
    casoEnfoque.removeAttribute('required');
    casoDuracion.removeAttribute('required');
    
    // Mostrar campo de tecnologías
    techsInput.parentElement.style.display = 'block';
  }
}

// Abrir modal para añadir
function openAddProjectModal(sectionId) {
  document.getElementById('form-action').value = 'add';
  document.getElementById('form-section-id').value = sectionId;
  document.getElementById('form-project-id').value = '';
  
  const titleEl = document.getElementById('modal-title');
  const isEn = document.body.classList.contains('lang-en');
  if (sectionId === 'desarrollo') {
    titleEl.textContent = isEn ? 'Add Development Project' : 'Añadir Proyecto de Desarrollo';
  } else if (sectionId === 'casos') {
    titleEl.textContent = isEn ? 'Add Case Study' : 'Añadir Estudio de Caso';
  } else if (sectionId === 'proyectos') {
    titleEl.textContent = isEn ? 'Add Professional Project' : 'Añadir Proyecto Profesional';
  }
  
  adjustFormFields(sectionId);
  openProjectModal();
}

// Abrir modal para editar
function openEditProjectModal(button) {
  const card = button.closest('article');
  const id = card.getAttribute('data-id');
  const section = card.closest('section');
  const sectionId = section.getAttribute('id');
  
  document.getElementById('form-action').value = 'edit';
  document.getElementById('form-section-id').value = sectionId;
  document.getElementById('form-project-id').value = id;
  
  const isEn = document.body.classList.contains('lang-en');
  const titleEl = document.getElementById('modal-title');
  titleEl.textContent = isEn ? 'Edit Project / Case' : 'Editar Proyecto / Caso';
  
  adjustFormFields(sectionId);
  
  // Detectar si el proyecto está envuelto por idioma o usar la tarjeta directamente
  const activeWrap = card.querySelector(isEn ? '.lang-en' : '.lang-es') || card;
  
  // Rellenar campos comunes
  document.getElementById('project-title').value = activeWrap.querySelector('h3').textContent.trim();
  
  if (sectionId === 'casos') {
    // Extraer campos de Estudio de Caso
    const propos = activeWrap.querySelector('.caso-metadata li:nth-child(1)').textContent.replace(/Propósito:|Purpose:/i, '').trim();
    const objet = activeWrap.querySelector('.caso-metadata li:nth-child(2)').textContent.replace(/Objetivo:|Objective:/i, '').trim();
    const enf = activeWrap.querySelector('.caso-metadata li:nth-child(3)').textContent.replace(/Enfoque:|Approach:/i, '').trim();
    const dur = activeWrap.querySelector('.caso-metadata li:nth-child(4)').textContent.replace(/Duración:|Duration:/i, '').trim();
    const rol = activeWrap.querySelector('.caso-metadata li:nth-child(5)').textContent.replace(/Rol:|Role:/i, '').trim();
    
    document.getElementById('caso-proposito').value = propos;
    document.getElementById('caso-objetivo').value = objet;
    document.getElementById('caso-enfoque').value = enf;
    document.getElementById('caso-duracion').value = dur;
    document.getElementById('project-role').value = rol;
  } else {
    // Extraer campos de proyectos comunes
    const descEl = activeWrap.querySelector('p');
    document.getElementById('project-desc').value = descEl.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
    
    const roleEl = activeWrap.querySelector('.meta-info li strong');
    if (roleEl) {
      document.getElementById('project-role').value = roleEl.nextSibling ? roleEl.nextSibling.textContent.trim() : '';
    }
    
    const techs = Array.from(activeWrap.querySelectorAll('.tech-pill')).map(p => p.textContent.trim()).join(', ');
    document.getElementById('project-techs').value = techs;
    
    const imgEl = activeWrap.querySelector('img');
    if (imgEl) {
      const src = imgEl.getAttribute('src');
      document.getElementById('project-img-url').value = src;
      document.getElementById('img-preview').src = src;
      document.getElementById('img-preview-container').style.display = 'block';
    }
    
    const resultsEl = activeWrap.querySelector('.results-box');
    if (resultsEl) {
      const resText = resultsEl.textContent.replace(/Resultados:|Results:/i, '').trim();
      document.getElementById('project-results').value = resText;
    }
  }
  
  // Extraer enlaces
  const links = activeWrap.querySelectorAll('.project-links a');
  if (links.length > 0) {
    document.getElementById('project-link-primary-text').value = links[0].textContent.trim();
    document.getElementById('project-link-primary-url').value = links[0].getAttribute('href');
  } else {
    document.getElementById('project-link-primary-text').value = '';
    document.getElementById('project-link-primary-url').value = '';
  }
  
  if (links.length > 1) {
    document.getElementById('project-link-secondary-text').value = links[1].textContent.trim();
    document.getElementById('project-link-secondary-url').value = links[1].getAttribute('href');
  } else {
    document.getElementById('project-link-secondary-text').value = '';
    document.getElementById('project-link-secondary-url').value = '';
  }
  
  openProjectModal();
}

// Eliminar proyecto
function deleteProject(button) {
  if (confirm('¿Estás seguro de que deseas eliminar este proyecto/caso?')) {
    const card = button.closest('article');
    card.remove();
  }
}

// Previsualización y base64 de imagen
function previewSelectedImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64String = e.target.result;
      document.getElementById('project-img-url').value = base64String;
      document.getElementById('img-preview').src = base64String;
      document.getElementById('img-preview-container').style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Generadores de HTML de tarjeta
function generateProjectHTML(title, desc, role, techs, imgUrl, results, link1Text, link1Url, link2Text, link2Url) {
  let techsHTML = '';
  if (techs.trim()) {
    const pills = techs.split(',').map(t => `<li class="tech-pill">${t.trim()}</li>`).join('\n            ');
    techsHTML = `<ul class="tech-list">\n            ${pills}\n          </ul>`;
  }
  
  let imgHTML = '';
  if (imgUrl.trim()) {
    imgHTML = `<img src="${imgUrl.trim()}" alt="Captura de la aplicación" />`;
  }
  
  let resultsHTML = '';
  if (results.trim()) {
    resultsHTML = `<div class="results-box">\n            <strong>Resultados:</strong> ${results.trim()}\n          </div>`;
  }
  
  let linksHTML = '';
  if (link1Url.trim()) {
    linksHTML += `<a class="btn btn-primary" href="${link1Url.trim()}" target="_blank" rel="noopener">${link1Text.trim() || 'Ver'}</a>`;
  }
  if (link2Url.trim()) {
    linksHTML += `\n            <a class="btn btn-secondary" href="${link2Url.trim()}" target="_blank" rel="noopener">${link2Text.trim() || 'Ver'}</a>`;
  }
  if (linksHTML) {
    linksHTML = `<div class="project-links">\n            ${linksHTML}\n          </div>`;
  }
  
  const descFormatted = desc.replace(/\n/g, '<br>');
  
  return `
          <div class="card-admin-controls admin-only">
            <button class="btn-card-admin btn-card-edit" onclick="openEditProjectModal(this)">✏️</button>
            <button class="btn-card-admin btn-card-delete" onclick="deleteProject(this)">🗑️</button>
          </div>
          <h3>${title}</h3>
          <p>${descFormatted}</p>
          ${techsHTML}
          <ul class="meta-info">
            <li><strong>Rol:</strong> ${role}</li>
          </ul>
          ${imgHTML}
          ${resultsHTML}
          ${linksHTML}
  `;
}

function generateCasoHTML(title, proposito, objetivo, enfoque, duracion, role, linkText, linkUrl) {
  let linksHTML = '';
  if (linkUrl.trim()) {
    linksHTML = `<div class="project-links">\n            <a class="btn btn-primary" href="${linkUrl.trim()}" target="_blank" rel="noopener">${linkText.trim() || 'Ver'}</a>\n          </div>`;
  }
  
  return `
          <div class="card-admin-controls admin-only">
            <button class="btn-card-admin btn-card-edit" onclick="openEditProjectModal(this)">✏️</button>
            <button class="btn-card-admin btn-card-delete" onclick="deleteProject(this)">🗑️</button>
          </div>
          <h3>${title}</h3>
          <ul class="caso-metadata">
            <li><strong>Propósito:</strong> ${proposito}</li>
            <li><strong>Objetivo:</strong> ${objetivo}</li>
            <li><strong>Enfoque:</strong> ${enfoque}</li>
            <li><strong>Duración:</strong> ${duracion}</li>
            <li><strong>Rol:</strong> ${role}</li>
          </ul>
          ${linksHTML}
  `;
}

// Envío del Formulario
function handleProjectFormSubmit(event) {
  event.preventDefault();
  
  const action = document.getElementById('form-action').value;
  const sectionId = document.getElementById('form-section-id').value;
  const projectId = document.getElementById('form-project-id').value;
  
  const title = document.getElementById('project-title').value;
  const role = document.getElementById('project-role').value;
  
  const link1Text = document.getElementById('project-link-primary-text').value;
  const link1Url = document.getElementById('project-link-primary-url').value;
  const link2Text = document.getElementById('project-link-secondary-text').value;
  const link2Url = document.getElementById('project-link-secondary-url').value;

  let cardHTML = '';
  
  if (sectionId === 'casos') {
    const proposito = document.getElementById('caso-proposito').value;
    const objetivo = document.getElementById('caso-objetivo').value;
    const enfoque = document.getElementById('caso-enfoque').value;
    const duracion = document.getElementById('caso-duracion').value;
    cardHTML = generateCasoHTML(title, proposito, objetivo, enfoque, duracion, role, link1Text, link1Url);
  } else {
    const desc = document.getElementById('project-desc').value;
    const techs = document.getElementById('project-techs').value;
    const imgUrl = document.getElementById('project-img-url').value;
    const results = document.getElementById('project-results').value;
    cardHTML = generateProjectHTML(title, desc, role, techs, imgUrl, results, link1Text, link1Url, link2Text, link2Url);
  }
  
  if (action === 'add') {
    const article = document.createElement('article');
    article.className = (sectionId === 'casos') ? 'caso' : 'proyecto';
    article.setAttribute('data-id', 'project-' + Date.now());
    article.innerHTML = cardHTML;
    
    document.getElementById(sectionId + '-grid').appendChild(article);
  } else {
    const card = document.querySelector(`article[data-id="${projectId}"]`);
    if (card) {
      card.innerHTML = cardHTML;
    }
  }
  
  closeProjectModal();
}

// Descargar index.html con los cambios persistidos en el DOM
function downloadUpdatedHTML() {
  const clone = document.documentElement.cloneNode(true);
  
  // Limpiar estados de visualización en el clon
  const body = clone.querySelector('body');
  if (body) {
    body.classList.remove('admin-active');
  }
  
  const modalEl = clone.querySelector('#project-modal');
  if (modalEl) {
    modalEl.classList.remove('active');
    // Limpiar campos por si acaso
    const formEl = modalEl.querySelector('form');
    if (formEl) formEl.reset();
    const previewCont = modalEl.querySelector('#img-preview-container');
    if (previewCont) previewCont.style.display = 'none';
    const previewImg = modalEl.querySelector('#img-preview');
    if (previewImg) previewImg.src = '';
  }
  
  const serializedHTML = '<!DOCTYPE html>\n' + clone.outerHTML;
  
  const blob = new Blob([serializedHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('¡index.html generado con éxito! Guarda este archivo encima del index.html de tu carpeta local y sube los cambios para actualizarlos de manera permanente.');
}

// --- CONFIGURACIÓN DE MODO OSCURO ---
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  localStorage.setItem('darkTheme', isDark ? 'true' : 'false');
  updateThemeToggleButton(isDark);
}

function updateThemeToggleButton(isDark) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = isDark ? '☀️ Claro' : '🌙 Oscuro';
  }
}

// --- CONFIGURACIÓN DE MULTI-IDIOMA ---
function toggleLanguage() {
  const isEn = document.body.classList.toggle('lang-en');
  localStorage.setItem('lang', isEn ? 'en' : 'es');
  updateLangToggleButton(isEn ? 'en' : 'es');
}

function updateLangToggleButton(lang) {
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = lang === 'en' ? '🌐 ES' : '🌐 EN';
  }
}
