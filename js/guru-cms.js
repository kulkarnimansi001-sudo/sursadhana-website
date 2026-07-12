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
function safeUrl(u) { const s=String(u||'').trim(); return(s.startsWith('http')||s.startsWith('/')) ? s : ''; }
function fmtDate(d) { if(!d) return ''; return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}); }

async function loadGuruBio() {
  try {
    const snap = await getDoc(doc(db, 'website_teacher', 'main'));
    if (!snap.exists()) return;
    const d = snap.data();
    if (d.name)  { document.getElementById('guruName').textContent = d.name; }
    if (d.badge) { document.getElementById('guruBadge').textContent = d.badge; }
    const b = (id, txt) => { const el = document.getElementById(id); if(el && txt) el.innerHTML = h(txt).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); };
    b('guroBio1', d.bio1); b('guroBio2', d.bio2); b('guroBio3', d.bio3);
    if (d.highlights && d.highlights.length) {
      document.getElementById('guruHighlights').innerHTML = d.highlights.map(item =>
        `<div style="display:flex;gap:12px;align-items:center;background:var(--cream);border-radius:10px;padding:14px 16px;border:1px solid var(--border)">
          <span style="font-size:1.3rem">${h(item.icon||'')}</span>
          <span style="font-size:.88rem;font-weight:600;color:var(--maroon-dark)">${h(item.text||'')}</span>
        </div>`
      ).join('');
    }
  } catch(e) { console.error('Guru bio error', e); }
}

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

async function loadGuruVideos() {
  try {
    const snap = await getDocs(query(collection(db,'website_videos'), orderBy('date','desc'), limit(6)));
    if (snap.empty) return;
    const grid = document.getElementById('guruVideosGrid');
    const ph   = document.getElementById('guruVideosPlaceholder');
    if (ph) ph.remove();
    let count = 0;
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.published === false || !d.youtubeId || count >= 6) return; count++;
      const ytId = (d.youtubeId||'').replace(/[^a-zA-Z0-9_-]/g,'');
      const card = document.createElement('div');
      card.className = 'video-card animate-on-scroll';
      card.innerHTML = `
        <div class="video-wrap">
          <iframe src="https://www.youtube.com/embed/${ytId}" title="${h(d.title)||'Performance'}"
            frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
        <div class="video-info">
          <span class="video-tag">${h(d.tag)||'Performance'}</span>
          <p>${h(d.title)}</p>
        </div>`;
      grid.appendChild(card);
      obs.observe(card);
    });
  } catch(e) { console.error('Guru videos error', e); }
}

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

const obs = new IntersectionObserver(entries =>
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.1});

loadGuruBio();
loadGuruPhotos();
loadGuruVideos();
loadGuruArticles();
