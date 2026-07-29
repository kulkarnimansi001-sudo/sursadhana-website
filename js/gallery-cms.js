import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"AIzaSyBpCH8ajVXiLcoEGc7vkIm8EmTkuYCY61o",authDomain:"music-class-83080.firebaseapp.com",
  projectId:"music-class-83080",storageBucket:"music-class-83080.firebasestorage.app",
  messagingSenderId:"663663281900",appId:"1:663663281900:web:c320801ef06e18212607c9"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function h(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

let allAlbums      = [];
let filteredAlbums = [];
let activeCat      = 'all';
let activeYear     = 'all';

// ── Lightbox (exposed for inline HTML + lbNav) ────────────────────────────────
window.filtered = [];
window.lbIndex  = 0;
window.openLightbox = function(i) {
  window.lbIndex = i;
  const p = window.filtered[i];
  document.getElementById('lightboxImg').src     = p.imageUrl;
  document.getElementById('lightboxCaption').textContent = p.caption || '';
  document.getElementById('lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// ── Filters ───────────────────────────────────────────────────────────────────
window.filterGallery = function(btn) {
  document.querySelectorAll('#catFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCat = btn.dataset.cat;
  applyFilters();
};
window.filterYear = function(btn) {
  document.querySelectorAll('#yearFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeYear = btn.dataset.year;
  applyFilters();
};
function applyFilters() {
  filteredAlbums = allAlbums.filter(a => {
    const catOk  = activeCat  === 'all' || a.category === activeCat;
    const yearOk = activeYear === 'all' || String(a.year) === String(activeYear);
    return catOk && yearOk;
  });
  renderAlbumGrid();
}

// ── Album grid ────────────────────────────────────────────────────────────────
function renderAlbumGrid() {
  const grid  = document.getElementById('galleryFullGrid');
  const empty = document.getElementById('galleryEmpty');
  const count = document.getElementById('photoCount');
  grid.innerHTML = '';
  count.textContent = '';

  if (!filteredAlbums.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  count.textContent = `${filteredAlbums.length} album${filteredAlbums.length !== 1 ? 's' : ''}`;

  filteredAlbums.forEach(album => {
    const card = document.createElement('div');
    card.className = 'album-card animate-on-scroll';
    card.onclick = () => openAlbum(album);
    const cover = album.coverUrl || '';
    card.innerHTML = `
      <div class="album-cover">
        ${cover
          ? `<img src="${h(cover)}" alt="${h(album.name)}" loading="lazy"/>`
          : '<div class="album-cover-empty">🎵</div>'}
        ${album.photoCount ? `<div class="album-count-badge">${album.photoCount} photo${album.photoCount !== 1 ? 's' : ''}</div>` : ''}
      </div>
      <div class="album-info">
        <div class="album-name">${h(album.name)}</div>
        <div class="album-meta">${[album.category, album.year].filter(Boolean).join(' · ')}</div>
        ${album.description ? `<div class="album-desc">${h(album.description)}</div>` : ''}
      </div>`;
    grid.appendChild(card);
    observer.observe(card);
  });
}

// ── Open album → photo grid ───────────────────────────────────────────────────
async function openAlbum(album) {
  document.getElementById('albumNav').style.display    = 'flex';
  document.getElementById('albumNavTitle').textContent = album.name;
  document.getElementById('catFilterBar').style.display  = 'none';
  document.getElementById('yearFilterBar').style.display = 'none';

  const grid  = document.getElementById('galleryFullGrid');
  const count = document.getElementById('photoCount');
  grid.innerHTML = '<div style="text-align:center;padding:48px;color:#888">Loading…</div>';
  count.textContent = '';

  try {
    const snap = await getDocs(
      query(collection(db, 'website_albums', album.id, 'photos'), orderBy('order', 'asc'))
    );
    const photos = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.published === false || !data.imageUrl) return;
      photos.push({ imageUrl: data.imageUrl, caption: data.caption || '' });
    });

    window.filtered = photos;
    grid.innerHTML  = '';

    if (!photos.length) {
      grid.innerHTML = '<div style="text-align:center;padding:60px;color:#888"><div style="font-size:2.5rem;margin-bottom:12px">📷</div>No photos in this album yet.</div>';
      return;
    }

    count.textContent = `${photos.length} photo${photos.length !== 1 ? 's' : ''}`;
    photos.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item animate-on-scroll';
      item.onclick = () => window.openLightbox(i);
      item.innerHTML = `
        <img src="${h(p.imageUrl)}" alt="${h(p.caption) || 'SurSadhana'}" loading="lazy"/>
        ${p.caption ? `<div class="gallery-item-caption">${h(p.caption)}</div>` : ''}`;
      grid.appendChild(item);
      observer.observe(item);
    });
  } catch(e) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:#c00">Failed to load photos.</div>';
  }
}

// ── Back to albums ────────────────────────────────────────────────────────────
window.backToAlbums = function() {
  window.filtered = [];
  document.getElementById('albumNav').style.display    = 'none';
  document.getElementById('catFilterBar').style.display  = '';
  document.getElementById('yearFilterBar').style.display = '';
  window.scrollTo({ top: document.getElementById('galleryFullGrid').offsetTop - 120, behavior: 'smooth' });
  renderAlbumGrid();
};

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: .1 }
);

async function init() {
  try {
    const snap = await getDocs(query(collection(db, 'website_albums'), orderBy('date', 'desc')));
    document.getElementById('galleryLoading').style.display = 'none';

    const albums = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.published === false) return;
      albums.push({ id: d.id, ...data });
    });

    allAlbums      = albums;
    filteredAlbums = [...albums];

    if (!albums.length) { document.getElementById('galleryEmpty').style.display = 'block'; return; }

    // Dynamic category filter
    const cats = [...new Set(albums.map(a => a.category).filter(Boolean))].sort();
    const catBar = document.getElementById('catFilterBar');
    catBar.innerHTML = '';
    [{ label: 'All Albums', val: 'all' }, ...cats.map(c => ({ label: c, val: c }))]
      .forEach((item, i) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
        btn.textContent = item.label;
        btn.dataset.cat = item.val;
        btn.onclick = () => window.filterGallery(btn);
        catBar.appendChild(btn);
      });

    // Dynamic year filter
    const years = [...new Set(albums.map(a => String(a.year)).filter(Boolean))].sort((a,b) => b-a);
    const yearBar = document.getElementById('yearFilterBar');
    yearBar.innerHTML = '';
    [{ label: 'All Years', val: 'all' }, ...years.map(y => ({ label: y, val: y }))]
      .forEach((item, i) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
        btn.textContent = item.label;
        btn.dataset.year = item.val;
        btn.onclick = () => window.filterYear(btn);
        yearBar.appendChild(btn);
      });

    renderAlbumGrid();

    // Deep-link: gallery.html#album-{albumId} navigates directly into that album
    const hash = location.hash;
    if (hash.startsWith('#album-')) {
      const targetId = hash.slice(7);
      const target = allAlbums.find(a => a.id === targetId);
      if (target) openAlbum(target);
    }
  } catch(e) {
    console.error('Gallery load error', e);
    document.getElementById('galleryLoading').textContent = 'Failed to load. Please try again.';
  }
}

init();
