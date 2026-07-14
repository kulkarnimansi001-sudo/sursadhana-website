/* Dynamic content from Firestore */
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

function md(s) {
  return h(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function safeUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  return (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')) ? u : '';
}

function countUp(el, target) {
  const dur = 1600, step = 16;
  const inc = target / (dur / step);
  let cur = 0;
  const timer = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = Math.floor(cur);
  }, step);
}

/* ── Settings (stats + contact) ──────────────────────────────────── */
async function loadSettings() {
  try {
    const snap = await getDoc(doc(db, 'website_settings', 'main'));
    if (!snap.exists()) return;
    const d = snap.data();

    // Stats bar
    if (d.stats && d.stats.length) {
      const bar = document.getElementById('statsInner');
      if (bar) {
        bar.innerHTML = '';
        d.stats.forEach((s, i) => {
          if (i > 0) bar.insertAdjacentHTML('beforeend', '<div class="stat-divider"></div>');
          const numStr = String(s.num);
          const isNumeric = /^\d+$/.test(numStr);
          bar.insertAdjacentHTML('beforeend', `
            <div class="stat-item">
              <span class="stat-num" ${isNumeric ? `data-target="${numStr}"` : ''}>${isNumeric ? '0' : h(numStr)}</span><span class="stat-suffix">${h(s.suffix||'')}</span>
              <div class="stat-label">${h(s.label)}</div>
            </div>`);
        });
        // Re-observe new stat-num elements for count-up
        const statObs = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.dataset.target, 10);
            if (!isNaN(target)) countUp(el, target);
            statObs.unobserve(el);
          });
        }, { threshold: 0.5 });
        bar.querySelectorAll('.stat-num[data-target]').forEach(el => statObs.observe(el));
      }
    }

    // Contact info
    const setEl = (id, val) => { const el = document.getElementById(id); if (el && val) el.innerHTML = md(val); };
    const setHref = (id, href) => { const el = document.getElementById(id); if (el && href) el.href = href; };
    const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el && val) el.setAttribute(attr, val); };

    if (d.phone) {
      setEl('contactPhone', d.phone);
      setHref('contactPhoneLink', `tel:${d.phone_raw ? '+' + d.phone_raw : d.phone.replace(/\s/g,'')}`);
    }
    if (d.email) {
      setEl('contactEmail', d.email);
      setHref('contactEmailLink', `mailto:${d.email}`);
    }
    if (d.address_line1 || d.address_line2) {
      setEl('contactAddress', [d.address_line1, d.address_line2].filter(Boolean).join('<br>'));
    }
    if (d.schedule) {
      setEl('contactSchedule', d.schedule);
      if (d.schedule_note) setEl('contactScheduleNote', d.schedule_note);
    }
    if (d.whatsapp_msg) {
      const wa = document.getElementById('whatsappBtn');
      if (wa) wa.href = `https://wa.me/${d.phone_raw || '918308047545'}?text=${d.whatsapp_msg}`;
    }

    // Section headings
    const h$ = (id, val) => { if (!val) return; const el = document.getElementById(id); if (el) el.textContent = val; };
    const hi = (d.headings || {}).index || {};
    h$('idx-about-label',        hi.about_label);
    h$('idx-about-title',        hi.about_title);
    h$('idx-courses-label',      hi.courses_label);
    h$('idx-courses-title',      hi.courses_title);
    h$('idx-courses-intro',      hi.courses_intro);
    h$('idx-courses-note',       hi.courses_note);
    h$('idx-gallery-label',      hi.gallery_label);
    h$('idx-gallery-title',      hi.gallery_title);
    h$('idx-perf-label',         hi.perf_label);
    h$('idx-perf-title',         hi.perf_title);
    h$('idx-perf-intro',         hi.perf_intro);
    h$('idx-teacher-label',      hi.teacher_label);
    h$('idx-news-label',         hi.news_label);
    h$('idx-news-title',         hi.news_title);
    h$('idx-achieve-label',      hi.achieve_label);
    h$('idx-achieve-title',      hi.achieve_title);
    h$('idx-testimonials-label', hi.testimonials_label);
    h$('idx-testimonials-title', hi.testimonials_title);
    h$('idx-testimonials-intro', hi.testimonials_intro);
    h$('idx-faq-label',          hi.faq_label);
    h$('idx-faq-title',          hi.faq_title);
    h$('idx-contact-label',      hi.contact_label);
    h$('idx-contact-title',      hi.contact_title);
    h$('idx-contact-intro',      hi.contact_intro);
  } catch(e) { console.error('Settings load error', e); }
}

/* ── About section ───────────────────────────────────────────────── */
async function loadAbout() {
  try {
    const snap = await getDoc(doc(db, 'website_about', 'main'));
    if (!snap.exists()) return;
    const d = snap.data();

    const introEl = document.getElementById('aboutIntro');
    if (introEl && d.intro) introEl.innerHTML = md(d.intro);

    if (d.pillars && d.pillars.length) {
      const pillarsEl = document.getElementById('aboutPillars');
      if (pillarsEl) {
        pillarsEl.innerHTML = d.pillars.map((p, i) => `
          <div class="pillar animate-on-scroll${i > 0 ? ' delay-' + i : ''}">
            <div class="pillar-icon">${h(p.icon || '')}</div>
            <h3>${h(p.title)}</h3>
            <p>${md(p.text)}</p>
          </div>`).join('');
        pillarsEl.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
      }
    }
  } catch(e) { console.error('About load error', e); }
}

/* ── Courses ──────────────────────────────────────────────────────── */
async function loadCourses() {
  try {
    const snap = await getDocs(query(collection(db, 'website_courses'), orderBy('order', 'asc')));
    if (snap.empty) return;
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    const delays = ['', ' delay-1', ' delay-2'];
    grid.innerHTML = '';
    let i = 0;
    snap.forEach(docSnap => {
      const c = docSnap.data();
      const topicsHtml = (c.topics || []).map(t => `<li>${md(t)}</li>`).join('');
      grid.insertAdjacentHTML('beforeend', `
        <div class="course-card animate-on-scroll${delays[i % 3] || ''}">
          <div class="course-icon">${h(c.icon || '🎵')}</div>
          <h3>${h(c.title)}</h3>
          <div class="course-badge">${h(c.badge || '')}</div>
          <p>${md(c.desc || '')}</p>
          ${topicsHtml ? `<ul class="course-topics">${topicsHtml}</ul>` : ''}
        </div>`);
      observer.observe(grid.lastElementChild);
      i++;
    });
  } catch(e) { console.error('Courses load error', e); }
}

/* ── FAQ ──────────────────────────────────────────────────────────── */
async function loadFaq() {
  try {
    const snap = await getDocs(query(collection(db, 'website_faq'), orderBy('order', 'asc')));
    if (snap.empty) return;
    const list = document.getElementById('faqList');
    if (!list) return;
    list.innerHTML = '';
    snap.forEach(docSnap => {
      const f = docSnap.data();
      const item = document.createElement('div');
      item.className = 'faq-item';
      item.innerHTML = `
        <button class="faq-q" onclick="toggleFaq(this)">
          ${h(f.question)}<span class="faq-arrow">›</span>
        </button>
        <div class="faq-a">${md(f.answer)}</div>`;
      list.appendChild(item);
    });
  } catch(e) { console.error('FAQ load error', e); }
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

/* ── Gallery ─────────────────────────────────────────────────────── */
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

/* ── Videos ──────────────────────────────────────────────────────── */
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

/* ── Shared observer ─────────────────────────────────────────────── */
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
    if (bio1El && d.bio1) bio1El.innerHTML = md(d.bio1);
    const bio2El = document.getElementById('teacherBio2');
    if (bio2El && d.bio2) bio2El.innerHTML = md(d.bio2);
    const bio3El = document.getElementById('teacherBio3');
    if (bio3El && d.bio3) bio3El.innerHTML = md(d.bio3);

    const hlEl = document.getElementById('teacherHighlights');
    if (hlEl && d.highlights && d.highlights.length) {
      hlEl.innerHTML = d.highlights.map(item =>
        `<div class="highlight-item"><span class="highlight-icon">${h(item.icon||'')}</span><span>${h(item.text||'')}</span></div>`
      ).join('');
    }
  } catch(e) { console.error('Teacher bio error', e); }
}

/* ── Testimonials ────────────────────────────────────────────────── */
async function loadTestimonials() {
  try {
    const snap = await getDocs(query(collection(db, 'website_testimonials'), limit(50)));
    if (snap.empty) return;

    let all = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(t => t.published !== false && t.name && t.quote);
    if (!all.length) return;

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
        dotsEl.querySelectorAll('.testimonial-dot').forEach((d, i) => {
          d.classList.toggle('active', i === idx);
        });
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
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', resetTimer);

    renderPage(0);
    resetTimer();

  } catch(e) { console.error('Testimonials load error', e); }
}

loadSettings();
loadAbout();
loadCourses();
loadFaq();
loadTeacherBio();
loadTeacherPhotos();
loadNews();
loadAchievements();
loadGallery();
loadVideos();
loadTestimonials();
