import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"AIzaSyBpCH8ajVXiLcoEGc7vkIm8EmTkuYCY61o",authDomain:"music-class-83080.firebaseapp.com",
  projectId:"music-class-83080",storageBucket:"music-class-83080.firebasestorage.app",
  messagingSenderId:"663663281900",appId:"1:663663281900:web:c320801ef06e18212607c9"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function h(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function md(s) { return h(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); }
function safeUrl(u) { const s=String(u||'').trim(); return(s.startsWith('http')||s.startsWith('/')) ? s : ''; }
function fmtDate(d) { if(!d) return ''; return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}); }

const obs = new IntersectionObserver(entries =>
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.1});

/* ── Teacher bio, badge, subtitle, guru stats, highlights ─────────── */
async function loadGuruBio() {
  try {
    const snap = await getDoc(doc(db, 'website_teacher', 'main'));
    if (!snap.exists()) return;
    const d = snap.data();

    if (d.name)     setEl('guruName', d.name, 'text');
    if (d.badge)    setEl('guruBadge', d.badge, 'text');
    if (d.subtitle) setEl('guruSubtitle', d.subtitle, 'text');

    // Guru page uses guru_bio1/2/3 (separate from index page bio1/2/3)
    if (d.guru_bio1) setEl('guroBio1', md(d.guru_bio1));
    if (d.guru_bio2) setEl('guroBio2', md(d.guru_bio2));
    if (d.guru_bio3) setEl('guroBio3', md(d.guru_bio3));

    // Quick stats bar
    if (d.guru_stats && d.guru_stats.length) {
      const bar = document.getElementById('guruStatsBar');
      if (bar) {
        bar.innerHTML = d.guru_stats.map(s => `
          <div class="guru-stat">
            <div class="guru-stat-num">${h(String(s.num))}</div>
            <div class="guru-stat-label">${h(s.label)}</div>
          </div>`).join('');
      }
    }

    // Highlights grid
    if (d.highlights && d.highlights.length) {
      const hlEl = document.getElementById('guruHighlights');
      if (hlEl) {
        hlEl.innerHTML = d.highlights.map(item => `
          <div style="display:flex;gap:12px;align-items:center;background:var(--cream);border-radius:10px;padding:14px 16px;border:1px solid var(--border)">
            <span style="font-size:1.3rem">${h(item.icon||'')}</span>
            <span style="font-size:.88rem;font-weight:600;color:var(--maroon-dark)">${h(item.text||'')}</span>
          </div>`).join('');
      }
    }
  } catch(e) { console.error('Guru bio error', e); }
}

/* ── Photos ──────────────────────────────────────────────────────── */
async function loadGuruPhotos() {
  try {
    const snap = await getDocs(query(collection(db,'website_teacher_photos'), orderBy('order','asc')));
    if (snap.empty) return;
    const photos = snap.docs.map(d => d.data().imageUrl).filter(Boolean);
    if (!photos.length) return;
    const mainImg = document.getElementById('guruMainPhoto');
    if (mainImg) mainImg.src = safeUrl(photos[0]);
    const bioImg  = document.getElementById('guroBioPhoto');
    if (bioImg && photos[1]) bioImg.src = safeUrl(photos[1]);
    const thumbs = document.getElementById('guruBioThumbs');
    if (thumbs) {
      thumbs.innerHTML = '';
      photos.forEach((url, i) => {
        const img = document.createElement('img');
        img.src = safeUrl(url); img.alt = '';
        img.style.cssText = 'width:68px;height:68px;object-fit:cover;border-radius:8px;cursor:pointer;transition:opacity .2s;';
        img.style.border = i === 0 ? '2px solid var(--gold)' : '2px solid transparent';
        img.style.opacity = i === 0 ? '1' : '.6';
        img.onclick = () => window.setBioPhoto(img);
        thumbs.appendChild(img);
      });
    }
  } catch(e) { console.error('Guru photos error', e); }
}

/* ── Timeline, Lineage, Philosophy (from website_guru/main) ─────── */
async function loadGuruContent() {
  try {
    const snap = await getDoc(doc(db, 'website_guru', 'main'));
    if (!snap.exists()) return;
    const d = snap.data();

    // Timeline
    if (d.timeline && d.timeline.length) {
      const tl = document.getElementById('guruTimeline');
      if (tl) {
        tl.innerHTML = '';
        d.timeline.forEach((item, i) => {
          const isLeft = i % 2 === 0;
          tl.insertAdjacentHTML('beforeend', `
            <div class="timeline-item animate-on-scroll">
              ${isLeft ? `<div class="timeline-content">` : `<div class="timeline-spacer"></div><div class="timeline-dot"></div><div class="timeline-content">`}
                <div class="timeline-year">${h(item.year)}</div>
                <div class="timeline-title">${h(item.title)}</div>
                <div class="timeline-text">${md(item.text)}</div>
              </div>
              ${isLeft ? `<div class="timeline-dot"></div><div class="timeline-spacer"></div>` : ''}
            </div>`);
        });
        tl.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
      }
    }

    // Lineage tree
    if (d.lineage && d.lineage.length) {
      const lineageEl = document.getElementById('guruLineage');
      if (lineageEl) {
        lineageEl.innerHTML = d.lineage.map((node, i) => `
          ${i > 0 ? '<div class="lineage-connector"></div>' : ''}
          <div class="lineage-node${node.root ? ' root' : ''}">
            <div class="lineage-name">${h(node.name)}</div>
            <div class="lineage-desc">${h(node.desc)}</div>
          </div>`).join('');
      }
      if (d.lineage_note) {
        const noteEl = document.getElementById('guruLineageNote');
        if (noteEl) noteEl.innerHTML = md(d.lineage_note);
      }
    }

    // Teaching philosophy
    if (d.philosophy && d.philosophy.length) {
      const philEl = document.getElementById('guruPhilosophy');
      if (philEl) {
        philEl.innerHTML = d.philosophy.map((p, i) => `
          <div class="philosophy-card animate-on-scroll${i % 3 > 0 ? ' delay-' + (i % 3) : ''}">
            <div class="philosophy-icon">${h(p.icon||'')}</div>
            <div class="philosophy-title">${h(p.title)}</div>
            <div class="philosophy-text">${md(p.text)}</div>
          </div>`).join('');
        philEl.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
      }
    }
  } catch(e) { console.error('Guru content error', e); }
}

/* ── Awards ──────────────────────────────────────────────────────── */
async function loadGuruAwards() {
  try {
    const snap = await getDocs(query(collection(db,'website_guru_awards'), orderBy('order','asc')));
    if (snap.empty) return;
    const grid = document.getElementById('guruAwardsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const delays = ['','delay-1','delay-2'];
    let i = 0;
    snap.forEach(docSnap => {
      const a = docSnap.data();
      grid.insertAdjacentHTML('beforeend', `
        <div class="award-card animate-on-scroll${delays[i%3] ? ' '+delays[i%3] : ''}">
          <div class="award-icon">${h(a.icon||'🏆')}</div>
          <div class="award-title">${h(a.title)}</div>
          <div class="award-desc">${md(a.desc)}</div>
        </div>`);
      obs.observe(grid.lastElementChild);
      i++;
    });
  } catch(e) { console.error('Guru awards error', e); }
}

/* ── Concerts & Platforms ────────────────────────────────────────── */
async function loadGuruConcerts() {
  try {
    const snap = await getDocs(query(collection(db,'website_guru_concerts'), orderBy('order','asc')));
    if (snap.empty) return;
    const grid = document.getElementById('guruConcertsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    let i = 0;
    const delays = ['','delay-1','delay-2'];
    snap.forEach(docSnap => {
      const c = docSnap.data();
      grid.insertAdjacentHTML('beforeend', `
        <div class="philosophy-card animate-on-scroll${delays[i%3] ? ' '+delays[i%3] : ''}">
          <div class="philosophy-icon">${h(c.icon||'🎵')}</div>
          <div class="philosophy-title">${h(c.title)}</div>
          <div class="philosophy-text">${md(c.desc)}</div>
        </div>`);
      obs.observe(grid.lastElementChild);
      i++;
    });
  } catch(e) { console.error('Guru concerts error', e); }
}

/* ── Performance Videos (from website_guru_videos) ──────────────── */
async function loadGuruVideos() {
  try {
    const snap = await getDocs(query(collection(db,'website_guru_videos'), orderBy('order','asc')));
    if (snap.empty) return;
    const grid = document.getElementById('guruVideosGrid');
    if (!grid) return;
    grid.innerHTML = '';
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const embedUrl = safeUrl(d.embedUrl || '');
      if (!embedUrl) return;
      const card = document.createElement('div');
      card.className = 'video-card animate-on-scroll';
      card.innerHTML = `
        <div class="video-wrap">
          <iframe src="${h(embedUrl)}" title="${h(d.title)||'Performance'}"
            frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
        <div class="video-info">
          <span class="video-tag">${h(d.tag)||'Performance'}</span>
          <strong style="display:block;margin-bottom:4px;color:var(--text)">${h(d.title)}</strong>
          <p>${h(d.desc||'')}</p>
        </div>`;
      grid.appendChild(card);
      obs.observe(card);
    });
  } catch(e) { console.error('Guru videos error', e); }
}

/* ── Programs & Updates ──────────────────────────────────────────── */
async function loadGuruArticles() {
  try {
    const snap = await getDocs(query(collection(db,'website_guru_articles'), orderBy('date','desc'), limit(6)));
    if (snap.empty) return;
    const grid = document.getElementById('guruArticlesGrid');
    const ph   = document.getElementById('guruArticlesPlaceholder');
    if (ph) ph.remove();
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.published === false) return;
      const card = document.createElement('div');
      card.className = 'guru-article-card animate-on-scroll';
      const imgUrl = safeUrl(d.imageUrl);
      card.innerHTML = imgUrl
        ? `<img src="${h(imgUrl)}" alt="${h(d.title)}" class="guru-article-img" loading="lazy"/>`
        : `<div class="guru-article-img" style="background:linear-gradient(135deg,var(--cream),var(--cream-dark));display:flex;align-items:center;justify-content:center;font-size:2.5rem">🎵</div>`;
      card.innerHTML += `
        <div class="guru-article-body">
          <div class="guru-article-date">${fmtDate(d.date)}</div>
          <div class="guru-article-title">${h(d.title)}</div>
          <div class="guru-article-text">${h(d.body||'').slice(0,160)}${(d.body||'').length>160?'…':''}</div>
        </div>`;
      grid.appendChild(card);
      obs.observe(card);
    });
  } catch(e) { console.error('Guru articles error', e); }
}

/* ── helpers ─────────────────────────────────────────────────────── */
function setEl(id, val, mode) {
  const el = document.getElementById(id);
  if (!el || !val) return;
  if (mode === 'text') el.textContent = val;
  else el.innerHTML = val;
}

loadGuruBio();
loadGuruPhotos();
loadGuruContent();
loadGuruAwards();
loadGuruConcerts();
loadGuruVideos();
loadGuruArticles();
