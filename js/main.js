/* ── NAVBAR scroll effect ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 400);
});

/* ── MOBILE MENU ──────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.textContent = open ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

/* ── FLOATING MUSIC NOTES in hero ────────────────────────────────── */
const notes  = ['♩','♪','♫','♬','𝄞','𝄢','🎵','🎶'];
const colors = ['rgba(200,134,10,.7)', 'rgba(255,255,255,.4)', 'rgba(255,200,100,.5)'];
const container = document.getElementById('heroNotes');

for (let i = 0; i < 18; i++) {
  const el = document.createElement('span');
  el.className = 'music-note';
  el.textContent = notes[Math.floor(Math.random() * notes.length)];
  el.style.cssText = `
    left: ${Math.random() * 100}%;
    top:  ${Math.random() * 100}%;
    color: ${colors[Math.floor(Math.random() * colors.length)]};
    font-size: ${.9 + Math.random() * 1.6}rem;
    animation-duration: ${4 + Math.random() * 6}s;
    animation-delay: ${-Math.random() * 6}s;
  `;
  container.appendChild(el);
}

/* ── SCROLL ANIMATIONS ────────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/* ── STATS COUNTER ────────────────────────────────────────────────── */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1600;
    const step   = 16;
    const inc    = target / (dur / step);
    let cur      = 0;
    const timer  = setInterval(() => {
      cur += inc;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = Math.floor(cur);
    }, step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

/* ── GALLERY LIGHTBOX ─────────────────────────────────────────────── */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── TEACHER PHOTO SWITCHER ───────────────────────────────────────── */
function setTeacherPhoto(thumb) {
  document.getElementById('teacherMainImg').src = thumb.src;
  document.querySelectorAll('.teacher-photo-thumbs img').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

/* ── FAQ ACCORDION ────────────────────────────────────────────────── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
  // open clicked (if it wasn't already open)
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}
