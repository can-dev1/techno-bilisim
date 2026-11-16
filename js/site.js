const header = document.querySelector('header');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 0);
}
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('pageshow', updateHeader);
updateHeader();

const filters = document.querySelectorAll('.filter button');
const records = document.querySelectorAll('.record');
for (const button of filters) {
  button.addEventListener('click', () => {
    for (const option of filters) {
      option.setAttribute('aria-pressed', String(option === button));
    }
    const category = button.textContent.trim();
    for (const record of records) {
      record.hidden = category !== 'Tümü' && record.dataset.category !== category;
    }
  });
}

const videos = document.querySelectorAll('video');
const films = document.querySelector('.films');
const rotationButton = document.querySelector('.film-rotation');
let rotating = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setFilmRotation(active) {
  rotating = active;
  rotationButton.textContent = active ? 'Akışı durdur' : 'Akışı başlat';
}
rotationButton.hidden = false;
setFilmRotation(rotating);
rotationButton.addEventListener('click', () => setFilmRotation(!rotating));
films.addEventListener('pointerdown', () => setFilmRotation(false));
films.addEventListener('focusin', () => setFilmRotation(false));
function advanceFilms() {
  const bounds = films.getBoundingClientRect();
  if (!rotating || document.hidden || bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
  const step = films.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(films).columnGap);
  const atEnd = films.scrollLeft >= films.scrollWidth - films.clientWidth - 2;
  films.scrollTo({ left: atEnd ? 0 : films.scrollLeft + step, behavior: 'smooth' });
}
window.setInterval(advanceFilms, 4000);
function loadVideo(video) {
  video.muted = true;
  const sources = video.querySelectorAll('source[data-src]');
  for (const source of sources) {
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
  }
  if (sources.length) video.load();
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        loadVideo(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, { rootMargin: '100px 0px' });
  for (const video of videos) observer.observe(video);
} else {
  for (const video of videos) {
    loadVideo(video);
    video.play().catch(() => {});
  }
}

