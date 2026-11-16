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

const photoDescriptions = [
  ['Robotik Kodlama', 'ÜNİDES kapsamında düzenlenen bu yarışmada öğrenci takımları robotik prototiplerini görev parkurunda test etti; etkinlik, algoritmik düşünme ve donanım programlama becerilerini geliştiren uygulamalı bir deneyim sundu.'],
  ['1. Sınıflara Oryantasyon', 'Yeni öğrencilerin ders işleyişini, sınav sistemini ve kulüp komisyonlarını tanıdığı bu buluşma, üniversite yaşamına ve kulüp faaliyetlerine uyumu destekledi.'],
  ['Çiğ Köfte', 'Dönem başında öğrencilerin bir araya geldiği bu sosyal buluşma, farklı sınıflar arasında tanışmayı, kaynaşmayı ve kulüp etkinliklerine katılımı güçlendirdi.'],
  ['Stant Haftası', 'Kulüp projeleri ve etkinlik takvimi kampüs genelinde tanıtılarak öğrencilerle yüz yüze iletişim kuruldu; yeni üyeler kazanıldı ve kulüp ağı genişletildi.'],
  ['Siber Farkındalık', 'Oltalama saldırıları, parola güvenliği ve veri mahremiyeti üzerine gerçekleştirilen eğitim, öğrencilerin günlük dijital güvenlik farkındalığını artırdı.'],
  ['Vize Sonrası Konser', 'Sınav döneminin ardından düzenlenen canlı müzik etkinliği, öğrencilerin sosyal ve kültürel olarak dinlenmesini sağlarken kampüs içi etkileşimi güçlendirdi.'],
  ['Bilardo Turnuvası', 'Üniversite öğrencilerinin karşılaşmalarla bir araya geldiği turnuva, sportmenliği ve sosyal etkileşimi destekledi; yoğun katılım kulübün spor etkinliklerini geliştirmesine katkı sağladı.'],
  ['AI WINTER', 'Yapay zekâ alanındaki güncel gelişmelerin sunum, panel ve soru-cevap oturumlarıyla ele alındığı zirve, bilimsel paylaşım ve yeni proje fikirleri için ortak bir ortam oluşturdu.'],
  ['KUDAAKAF', 'Kulüp üyeleri ve bölüm öğrencileri kariyer fuarında firma stantlarını ziyaret ederek staj ve iş olanaklarını inceledi; insan kaynakları görüşmeleriyle kariyer bağlantıları kuruldu.'],
  ['Tanışma Etkinliği', 'Yeni ve mevcut kulüp üyelerinin yönetim ekibiyle buluştuğu etkinlikte çalışma komisyonları ve dönem takvimi tanıtıldı; aktif görev dağılımı oluşturuldu.'],
  ['Faaliyet arşivinden ek kareler', 'Kulübün eğitim, yarışma, zirve, tanışma, sosyal sorumluluk ve kampüs etkinliklerinden seçilen bu kareler; öğrencilerin birlikte öğrenme, üretme ve paylaşma sürecini yansıtıyor.'],
  ['Yeni etkinlik fotoğrafları', 'Kulübün teknoloji, eğitim, yarışma, zirve ve sosyal etkinliklerinden seçilen bu fotoğraflar; öğrencilerin birlikte öğrenme, üretme ve kulüp yaşamına katılma sürecini yansıtıyor.']
];
for (const record of document.querySelectorAll('.record')) {
  if (record.querySelector('h3')?.textContent.includes('Faaliyet arşivinden ek kareler')) record.remove();
}
for (const meta of document.querySelectorAll('.record .meta')) meta.remove();
for (const record of document.querySelectorAll('.record:has(.event-gallery)')) {
  const gallery = record.querySelector('.event-gallery');
  const heading = record.querySelector('h3')?.textContent.trim() || '';
  const match = photoDescriptions.find(([keyword]) => heading.includes(keyword));
  for (const paragraph of record.querySelectorAll(':scope > div > p')) paragraph.remove();
  if (gallery && match) {
    const description = document.createElement('p');
    description.className = 'photo-description';
    description.textContent = match[1];
    gallery.before(description);
  }
}

for (const gallery of document.querySelectorAll('.event-gallery')) {
  const photos = gallery.querySelectorAll(':scope > a');
  if (photos.length < 2) continue;
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  const previous = document.createElement('button');
  const next = document.createElement('button');
  previous.textContent = '← Önceki';
  next.textContent = 'Sonraki →';
  previous.setAttribute('aria-label', 'Önceki fotoğraf');
  next.setAttribute('aria-label', 'Sonraki fotoğraf');
  for (const button of [previous, next]) button.type = 'button';
  function movePhoto(direction) {
    const step = photos[0].getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).columnGap);
    gallery.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function updateGalleryControls() {
    previous.disabled = gallery.scrollLeft <= 2;
    next.disabled = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2;
  }
  previous.addEventListener('click', () => movePhoto(-1));
  next.addEventListener('click', () => movePhoto(1));
  gallery.addEventListener('scroll', updateGalleryControls, { passive: true });
  window.addEventListener('resize', updateGalleryControls);
  controls.append(previous, next);
  gallery.after(controls);
  updateGalleryControls();
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

