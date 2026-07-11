/* Dynamic content from Firestore — News, Achievements, Gallery, Videos, Teacher Photos */
import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit }
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
loadTeacherPhotos();
loadNews();
loadAchievements();
loadGallery();
loadVideos();
