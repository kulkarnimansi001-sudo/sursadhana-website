/* Dynamic content from Firestore — News, Achievements, Gallery, Videos, Teacher Photos */
import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBpCH8ajVXiLcoEGc7vkIm8EmTkuYCY61o",
  authDomain:        "music-class-83080.firebaseapp.com",
  projectId:         "music-class-83080",
  storageBucket:     "music-class-83080.firebasestorage.app",
  messagingSenderId: "663663281900",
  appId:             "1:663663281900:web:c320801ef06e18212607c9"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
}

function h(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function safeUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  return (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')) ? u : '';
}

/* ── News & Updates ──────────────────────────────────────────────── */
async function loadNews() {
  try {
    const snap = await getDocs(query(collection(db, 'website_news'), orderBy('date', 'desc'), limit(20)));
    if (snap.empty) return;
    const grid  = document.getElementById('newsGrid');
    const empty = document.getElementById('newsEmpty');
    if (empty) empty.remove();
    let count = 0;
    snap.forEach(doc => {
      const d = doc.data();
      if (d.published === false || count >= 6) return; count++;
      const card = document.createElement('div');
      card.className = 'news-card animate-on-scroll';
      card.innerHTML = `
        <div class="news-date">${fmtDate(d.date)}</div>
        <div class="news-title">${h(d.title)}</div>
        <div class="news-body">${h(d.body)}</div>
      `;
      grid.appendChild(card);
      observer.observe(card);
    });
  } catch(e) { console.error('News load error', e); }
}

/* ── Achievements ────────────────────────────────────────────────── */
async function loadAchievements() {
  try {
    const snap = await getDocs(query(collection(db, 'website_achievements'), orderBy('date', 'desc'), limit(20)));
    if (snap.empty) return;
    const grid  = document.getElementById('achievementsGrid');
    const empty = document.getElementById('achievementsEmpty');
    if (empty) empty.remove();
    let count = 0;
    snap.forEach(doc => {
      const d = doc.data();
      if (d.published === false || count >= 8) return; count++;
      const card = document.createElement('div');
      card.className = 'achievement-card animate-on-scroll';
      card.innerHTML = `
        <div class="achievement-icon">${h(d.icon) || '🏆'}</div>
        <div class="achievement-name">${h(d.name)}</div>
        <div class="achievement-text">${h(d.text)}</div>
        <div class="achievement-date">${fmtDate(d.date)}</div>
      `;
      grid.appendChild(card);
      observer.observe(card);
    });
  } catch(e) { console.error('Achievements load error', e); }
}

/* ── Dynamic Gallery Photos ──────────────────────────────────────── */
async function loadGallery() {
  try {
    const snap = await getDocs(query(collection(db, 'website_gallery'), orderBy('date', 'desc'), limit(30)));
    if (snap.empty) return;
    const grid = document.getElementById('galleryGrid');
    let count = 0;
    snap.forEach(doc => {
      const d = doc.data();
      if (d.published === false || !d.imageUrl || count >= 8) return; count++;
      const item = document.createElement('div');
      item.className = 'gallery-item animate-on-scroll';
      const imgUrl = safeUrl(d.imageUrl);
      item.onclick = () => openLightbox(imgUrl);
      item.innerHTML = `
        <img src="${h(imgUrl)}" alt="${h(d.caption) || 'SurSadhana'}" loading="lazy"/>
        <div class="gallery-overlay"><span>View</span></div>
      `;
      grid.appendChild(item);
      observer.observe(item);
    });
  } catch(e) { console.error('Gallery load error', e); }
}

/* ── Dynamic Videos ──────────────────────────────────────────────── */
async function loadVideos() {
  try {
    const snap = await getDocs(query(collection(db, 'website_videos'), orderBy('date', 'desc'), limit(20)));
    if (snap.empty) return;
    const grid = document.getElementById('videosGrid');
    let count = 0;
    snap.forEach(doc => {
      const d = doc.data();
      if (d.published === false || !d.youtubeId || count >= 6) return; count++;
      const card = document.createElement('div');
      card.className = 'video-card animate-on-scroll';
      const ytId = (d.youtubeId || '').replace(/[^a-zA-Z0-9_-]/g, '');
      card.innerHTML = `
        <div class="video-wrap">
          <iframe src="https://www.youtube.com/embed/${ytId}"
            title="${h(d.title) || 'Performance'}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
        <div class="video-info">
          <span class="video-tag">${h(d.tag) || 'Performance'}</span>
          <p>${h(d.title)}</p>
        </div>
      `;
      grid.appendChild(card);
      observer.observe(card);
    });
  } catch(e) { console.error('Videos load error', e); }
}

/* ── Shared observer for dynamically added cards ─────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

/* ── Teacher Photos ──────────────────────────────────────────────── */
async function loadTeacherPhotos() {
  try {
    const snap = await getDocs(query(
      collection(db, 'website_teacher_photos'),
      orderBy('order', 'asc')
    ));
    if (snap.empty) return;
    const photos = snap.docs.map(d => d.data().imageUrl).filter(Boolean);
    if (!photos.length) return;
    // Replace main photo
    const mainImg = document.getElementById('teacherMainImg');
    if (mainImg) mainImg.src = safeUrl(photos[0]);
    const thumbs = document.getElementById('teacherThumbs');
    if (thumbs) {
      thumbs.innerHTML = '';
      photos.forEach((url, i) => {
        const safeImg = safeUrl(url);
        if (!safeImg) return;
        const img = document.createElement('img');
        img.src = safeImg;
        img.alt = '';
        if (i === 0) img.className = 'active';
        img.onclick = () => setTeacherPhoto(img);
        thumbs.appendChild(img);
      });
    }
  } catch(e) { console.error('Teacher photos error', e); }
}

/* ── Init ────────────────────────────────────────────────────────── */
/* ── Teacher Bio ─────────────────────────────────────────────────── */
async function loadTeacherBio() {
  try {
    const snap = await getDoc(doc(db, 'website_teacher', 'main'));
    if (!snap.exists()) return;
    const d = snap.data();

    const nameEl = document.getElementById('teacherName');
    if (nameEl && d.name) nameEl.textContent = d.name;

    const badgeEl = document.getElementById('teacherBadge');
    if (badgeEl && d.badge) badgeEl.textContent = d.badge;

    const bio1El = document.getElementById('teacherBio1');
    if (bio1El && d.bio1) bio1El.innerHTML = h(d.bio1).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const bio2El = document.getElementById('teacherBio2');
    if (bio2El && d.bio2) bio2El.innerHTML = h(d.bio2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const bio3El = document.getElementById('teacherBio3');
    if (bio3El && d.bio3) bio3El.innerHTML = h(d.bio3).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    const hlEl = document.getElementById('teacherHighlights');
    if (hlEl && d.highlights && d.highlights.length) {
      hlEl.innerHTML = d.highlights.map(item =>
        `<div class="highlight-item"><span class="highlight-icon">${h(item.icon||'')}</span><span>${h(item.text||'')}</span></div>`
      ).join('');
    }
  } catch(e) { console.error('Teacher bio error', e); }
}

/* ── Testimonials carousel ───────────────────────────────────────── */
async function loadTestimonials() {
  try {
    const snap = await getDocs(query(collection(db, 'website_testimonials'), limit(50)));
    if (snap.empty) return; // keep static fallback

    // Collect published testimonials and shuffle
    let all = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(t => t.published !== false && t.name && t.quote);
    if (!all.length) return;

    // Fisher-Yates shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    const PER_PAGE = 3;
    const totalPages = Math.ceil(all.length / PER_PAGE);
    let current = 0;
    let timer   = null;

    // Build carousel wrapper
    const wrapper  = document.createElement('div');
    wrapper.className = 'testimonial-carousel';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'testimonial-arrow testimonial-prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Previous');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'testimonial-arrow testimonial-next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Next');

    const cardsWrap = document.createElement('div');
    cardsWrap.className = 'testimonial-cards-wrap';

    const cardsEl = document.createElement('div');
    cardsEl.className = 'testimonials-grid';
    cardsWrap.appendChild(cardsEl);

    const dotsEl = document.createElement('div');
    dotsEl.className = 'testimonial-dots';

    if (totalPages > 1) {
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Page ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      }
    }

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(cardsWrap);
    wrapper.appendChild(nextBtn);
    wrapper.appendChild(dotsEl);

    // Replace existing grid with carousel
    grid.parentNode.replaceChild(wrapper, grid);

    function buildCard(t) {
      const initials = (t.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const avatar   = t.photoUrl
        ? `<img src="${h(t.photoUrl)}" alt="${h(t.name)}" class="testimonial-avatar" loading="lazy"/>`
        : `<div class="testimonial-initials">${h(initials)}</div>`;
      return `
        <div class="testimonial-card visible">
          ${avatar}
          <div class="testimonial-quote">${h(t.quote)}</div>
          <div class="testimonial-name">${h(t.name)}</div>
          <div class="testimonial-role">${h(t.role || 'Student')}</div>
        </div>`;
    }

    function renderPage(idx) {
      const slice = all.slice(idx * PER_PAGE, idx * PER_PAGE + PER_PAGE);
      cardsEl.style.opacity = '0';
      setTimeout(() => {
        cardsEl.innerHTML = slice.map(buildCard).join('');
        cardsEl.style.opacity = '1';
        // Update dots
        dotsEl.querySelectorAll('.testimonial-dot').forEach((d, i) => {
          d.classList.toggle('active', i === idx);
        });
        // Hide arrows if only 1 page
        prevBtn.style.visibility = totalPages > 1 ? 'visible' : 'hidden';
        nextBtn.style.visibility = totalPages > 1 ? 'visible' : 'hidden';
      }, 220);
    }

    function goTo(idx) {
      current = (idx + totalPages) % totalPages;
      renderPage(current);
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      if (totalPages > 1) timer = setInterval(() => goTo(current + 1), 7000);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Pause on hover
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', resetTimer);

    renderPage(0);
    resetTimer();

  } catch(e) { console.error('Testimonials load error', e); }
}

loadTeacherBio();
loadTeacherPhotos();
loadNews();
loadAchievements();
loadGallery();
loadVideos();
loadTestimonials();
