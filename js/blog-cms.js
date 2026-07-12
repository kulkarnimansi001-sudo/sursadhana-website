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

async function initBlog() {
  try {
    const snap = await getDocs(query(collection(db,'website_blog'), orderBy('date','desc')));
    if (snap.empty) return; // keep static placeholder cards

    const posts = [];
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.published === false) return;
      posts.push({
        title:    d.title    || '',
        excerpt:  d.excerpt  || '',
        body:     d.body     || '',
        category: d.category || 'General',
        date:     d.date     || '',
        imageUrl: safeUrl(d.imageUrl||''),
      });
    });

    window.allPosts = posts;
    window.renderPosts();
  } catch(e) { console.error('Blog load error', e); }
}

initBlog();
