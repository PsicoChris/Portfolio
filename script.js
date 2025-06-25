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

// --- Carrusel de Imágenes ---
const carouselTrack = document.querySelector('.carousel-track');
if (!carouselTrack || carouselTrack.children.length === 0) {
  console.warn('Carrusel no encontrado o sin elementos. No se inicializa.');
} else {
  const slides = Array.from(carouselTrack.children);
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');
  let currentSlideIndex = 0;

  function updateSlidePosition() {
    if (slides.length === 0) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    carouselTrack.style.transform = `translateX(-${slideWidth * currentSlideIndex}px)`;
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
  setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateSlidePosition();
  }, 5000);

  // Teclas izquierda y derecha
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlidePosition();
    } else if (e.key === 'ArrowLeft') {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    }
  });

  // Ajuste en resize y load
  window.addEventListener('resize', updateSlidePosition);
  window.addEventListener('load', updateSlidePosition);
}
