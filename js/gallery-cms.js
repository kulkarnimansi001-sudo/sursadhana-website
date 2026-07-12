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

function safeUrl(u) { const s=String(u||'').trim(); return(s.startsWith('http')||s.startsWith('/')) ? s : ''; }

async function initGallery() {
  try {
    const snap = await getDocs(query(collection(db,'website_gallery'), orderBy('date','desc')));
    document.getElementById('galleryLoading').style.display = 'none';

    if (snap.empty) {
      document.getElementById('galleryEmpty').style.display = 'block';
      return;
    }

    const photos = [];
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.published === false || !d.imageUrl) return;
      photos.push({
        imageUrl: safeUrl(d.imageUrl),
        caption:  d.caption  || '',
        category: d.category || 'Other',
        year:     d.year     || (d.date ? d.date.slice(0,4) : ''),
      });
    });

    // Expose to page script
    window.allPhotos = photos;
    window.filtered  = [...photos];

    // Build year filter
    const years = [...new Set(photos.map(p => p.year).filter(Boolean))].sort((a,b) => b-a);
    const bar   = document.getElementById('yearFilterBar');
    years.forEach(y => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn'; btn.dataset.year = y;
      btn.textContent = y;
      btn.onclick = () => window.filterYear(btn);
      bar.appendChild(btn);
    });

    window.applyFilters();
  } catch(e) {
    console.error('Gallery load error', e);
    document.getElementById('galleryLoading').textContent = 'Failed to load photos. Please try again.';
  }
}

initGallery();
