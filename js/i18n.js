/* ── i18n.js — SurSadhana website language switcher ───────────────────── */
/* Handles static UI strings only. CMS-driven section headings (idx-*)     */
/* and Firestore content remain in English until Phase 2 multilingual DB.  */
(function () {
  const LANGS = ['en', 'mr', 'hi'];

  const T = {

    /* ── ENGLISH ────────────────────────────────────────────────────── */
    en: {
      /* nav */
      'nav.about':       'About',
      'nav.courses':     'Courses',
      'nav.gallery':     'Gallery',
      'nav.guru':        'Guru',
      'nav.learn':       'Learn',
      'nav.news':        'News',
      'nav.faq':         'FAQ',
      'nav.contact':     'Contact',
      'nav.login':       'Student Login',

      /* hero — index */
      'hero.tagline':    'Sadhana &nbsp;·&nbsp; Sur &nbsp;·&nbsp; Samarpan',
      'hero.title':      'Where Music Becomes<br><span class="gold">A Lifelong Journey</span>',
      'hero.sub':        'Indian Classical Music training in Pune — Vocal · Harmonium · Light Music<br>Gandharva Mahavidyalaya syllabus · Prarambhik to Sangeet Alankar',
      'hero.scrollHint': 'Scroll to explore',
      'hero.btnCourses': 'Explore Courses',
      'hero.btnJoin':    'Join Now',
      'hero.btnLogin':   '🎓 Student Login',

      /* feature highlights */
      'feat.cert.title':      'Akhil Bhartiya Gandharva Mandal Certified Curriculum',
      'feat.cert.sub':        'Prarambhik to Sangeet Alankar',
      'feat.classical.title': 'Indian Classical Foundation',
      'feat.classical.sub':   'Vocal &bull; Harmonium &bull; Light Music',
      'feat.guidance.title':  'Personalized Guidance',
      'feat.guidance.sub':    'Small Batches &amp; Individual Attention',
      'feat.perf.title':      'Performance Opportunities',
      'feat.perf.sub':        'Stage Shows &bull; Recordings &bull; Competitions',

      /* index — teacher section (static HTML, not Firestore) */
      'teacher.readBio': 'Read Full Biography →',

      /* index — empty states */
      'news.empty':    'Updates and announcements will appear here.',
      'achieve.empty': 'Student achievements will be showcased here.',

      /* contact labels */
      'contact.phone':        'Phone / WhatsApp',
      'contact.email':        'Email',
      'contact.location':     'Location',
      'contact.classes':      'Classes',
      'contact.schedule':     'Twice a week + Weekend Riyaz',
      'contact.scheduleNote': 'Contact for batch timings',
      'contact.whatsapp':     '💬 Chat on WhatsApp',

      /* gallery / buttons */
      'gallery.loadMore': 'Load More Photos',
      'gallery.viewFull': '📷 View Full Gallery',

      /* footer */
      'footer.copyright': '© 2026 SurSadhana Music Classes, Pune. All rights reserved.',
      'footer.privacy':   'Privacy Policy',
      'footer.terms':     'Terms &amp; Conditions',
      'footer.portal':    '🎓 Student Portal',
      'footer.about':     'About',
      'footer.courses':   'Courses',
      'footer.gallery':   'Gallery',
      'footer.guru':      'Guru',
      'footer.blog':      'Blog',
      'footer.contact':   'Contact',

      /* guru page */
      'guru.founderLabel': 'Founder &amp; Guru',
      'guru.heroBtn1':     'Book a Trial Class',
      'guru.heroBtn2':     'Read Biography',
      'guru.heroBtn3':     'Watch Performances',
      'guru.yearsTeaching':'Years of Teaching',
      'guru.ctaLabel':     'Begin Your Journey',
      'guru.ctaTitle':     'Learn Directly From Mansi ji',
      'guru.ctaSub':       'Limited seats available. Contact us to know about batch timings, course details, or to schedule a trial class.',
      'guru.ctaBtn1':      'Get in Touch',
      'guru.ctaBtn2':      '💬 WhatsApp Us',
      'guru.viewGallery':  'View Full Gallery',

      /* gallery page */
      'page.gallery.heading': 'Photo Gallery',
      'page.gallery.sub':     'Moments from concerts, cultural programs and Riyaz sessions.',

      /* blog page */
      'page.blog.heading':    'Learning Corner',
      'page.blog.sub':        'Music theory, Raga guides, exam preparation tips and student stories.',

      /* faq page */
      'page.faq.heading':     'Frequently Asked Questions',
      'page.faq.sub':         'Everything you need to know about learning music at SurSadhana.',
    },

    /* ── MARATHI ────────────────────────────────────────────────────── */
    mr: {
      /* nav */
      'nav.about':       'परिचय',
      'nav.courses':     'अभ्यासक्रम',
      'nav.gallery':     'गॅलरी',
      'nav.guru':        'गुरू',
      'nav.learn':       'शिका',
      'nav.news':        'बातम्या',
      'nav.faq':         'प्रश्नोत्तरे',
      'nav.contact':     'संपर्क',
      'nav.login':       'विद्यार्थी लॉगिन',

      /* hero */
      'hero.tagline':    'साधना &nbsp;·&nbsp; सुर &nbsp;·&nbsp; समर्पण',
      'hero.title':      'जिथे संगीत बनते<br><span class="gold">एक आयुष्यभराचा प्रवास</span>',
      'hero.sub':        'पुण्यातील भारतीय शास्त्रीय संगीत प्रशिक्षण — स्वर · हार्मोनियम · सुगम संगीत<br>गांधर्व महाविद्यालय अभ्यासक्रम · प्रारंभिक ते संगीत अलंकार',
      'hero.scrollHint': 'अधिक पाहा',
      'hero.btnCourses': 'अभ्यासक्रम पाहा',
      'hero.btnJoin':    'आता सामील व्हा',
      'hero.btnLogin':   '🎓 विद्यार्थी लॉगिन',

      /* feature highlights */
      'feat.cert.title':      'अ.भा. गांधर्व मंडळ प्रमाणित अभ्यासक्रम',
      'feat.cert.sub':        'प्रारंभिक ते संगीत अलंकार',
      'feat.classical.title': 'भारतीय शास्त्रीय संगीताचा पाया',
      'feat.classical.sub':   'स्वर &bull; हार्मोनियम &bull; सुगम संगीत',
      'feat.guidance.title':  'वैयक्तिक मार्गदर्शन',
      'feat.guidance.sub':    'छोट्या तुकड्या &amp; वैयक्तिक लक्ष',
      'feat.perf.title':      'सादरीकरणाच्या संधी',
      'feat.perf.sub':        'मैफली &bull; रेकॉर्डिंग &bull; स्पर्धा',

      /* teacher */
      'teacher.readBio': 'पूर्ण चरित्र वाचा →',

      /* empty states */
      'news.empty':    'अपडेट्स आणि घोषणा येथे दिसतील.',
      'achieve.empty': 'विद्यार्थ्यांच्या उपलब्धी येथे दाखवल्या जातील.',

      /* contact */
      'contact.phone':        'फोन / व्हॉट्सअॅप',
      'contact.email':        'ईमेल',
      'contact.location':     'स्थान',
      'contact.classes':      'वर्ग',
      'contact.schedule':     'आठवड्यातून दोनदा + वीकेंड रियाझ',
      'contact.scheduleNote': 'बैचच्या वेळांसाठी संपर्क करा',
      'contact.whatsapp':     '💬 व्हॉट्सअॅपवर बोला',

      /* gallery / buttons */
      'gallery.loadMore': 'अधिक फोटो लोड करा',
      'gallery.viewFull': '📷 संपूर्ण गॅलरी पाहा',

      /* footer */
      'footer.copyright': '© 2026 SurSadhana Music Classes, पुणे. सर्व हक्क राखीव.',
      'footer.privacy':   'गोपनीयता धोरण',
      'footer.terms':     'नियम &amp; अटी',
      'footer.portal':    '🎓 विद्यार्थी पोर्टल',
      'footer.about':     'परिचय',
      'footer.courses':   'अभ्यासक्रम',
      'footer.gallery':   'गॅलरी',
      'footer.guru':      'गुरू',
      'footer.blog':      'शिका',
      'footer.contact':   'संपर्क',

      /* guru page */
      'guru.founderLabel': 'संस्थापक &amp; गुरू',
      'guru.heroBtn1':     'ट्रायल क्लास बुक करा',
      'guru.heroBtn2':     'चरित्र वाचा',
      'guru.heroBtn3':     'सादरीकरणे पाहा',
      'guru.yearsTeaching':'शिकवण्याचे वर्षे',
      'guru.ctaLabel':     'तुमचा प्रवास सुरू करा',
      'guru.ctaTitle':     'मानसीजींकडून थेट शिका',
      'guru.ctaSub':       'मर्यादित जागा उपलब्ध. बैचच्या वेळा, कोर्सची माहिती किंवा ट्रायल क्लाससाठी आमच्याशी संपर्क साधा.',
      'guru.ctaBtn1':      'संपर्क करा',
      'guru.ctaBtn2':      '💬 व्हॉट्सअॅप करा',
      'guru.viewGallery':  'संपूर्ण गॅलरी पाहा',

      /* gallery page */
      'page.gallery.heading': 'फोटो गॅलरी',
      'page.gallery.sub':     'मैफली, सांस्कृतिक कार्यक्रम आणि रियाझ सत्रांमधील क्षण.',

      /* blog page */
      'page.blog.heading':    'शिक्षण कोपरा',
      'page.blog.sub':        'संगीत सिद्धांत, राग मार्गदर्शन, परीक्षा तयारी आणि विद्यार्थी कथा.',

      /* faq page */
      'page.faq.heading':     'वारंवार विचारले जाणारे प्रश्न',
      'page.faq.sub':         'SurSadhana मध्ये संगीत शिकण्याबद्दल तुम्हाला माहित असणे आवश्यक ते सर्व.',
    },

    /* ── HINDI ──────────────────────────────────────────────────────── */
    hi: {
      /* nav */
      'nav.about':       'परिचय',
      'nav.courses':     'पाठ्यक्रम',
      'nav.gallery':     'गैलरी',
      'nav.guru':        'गुरु',
      'nav.learn':       'सीखें',
      'nav.news':        'समाचार',
      'nav.faq':         'सामान्य प्रश्न',
      'nav.contact':     'संपर्क',
      'nav.login':       'छात्र लॉगिन',

      /* hero */
      'hero.tagline':    'साधना &nbsp;·&nbsp; सुर &nbsp;·&nbsp; समर्पण',
      'hero.title':      'जहाँ संगीत बनता है<br><span class="gold">जीवन भर की यात्रा</span>',
      'hero.sub':        'पुणे में भारतीय शास्त्रीय संगीत प्रशिक्षण — स्वर · हार्मोनियम · सुगम संगीत<br>गांधर्व महाविद्यालय पाठ्यक्रम · प्रारंभिक से संगीत अलंकार',
      'hero.scrollHint': 'और देखें',
      'hero.btnCourses': 'पाठ्यक्रम देखें',
      'hero.btnJoin':    'अभी जुड़ें',
      'hero.btnLogin':   '🎓 छात्र लॉगिन',

      /* feature highlights */
      'feat.cert.title':      'अ.भा. गांधर्व मंडल प्रमाणित पाठ्यक्रम',
      'feat.cert.sub':        'प्रारंभिक से संगीत अलंकार',
      'feat.classical.title': 'भारतीय शास्त्रीय संगीत की नींव',
      'feat.classical.sub':   'स्वर &bull; हार्मोनियम &bull; सुगम संगीत',
      'feat.guidance.title':  'व्यक्तिगत मार्गदर्शन',
      'feat.guidance.sub':    'छोटे बैच &amp; व्यक्तिगत ध्यान',
      'feat.perf.title':      'प्रदर्शन के अवसर',
      'feat.perf.sub':        'मैफिल &bull; रिकॉर्डिंग &bull; प्रतियोगिता',

      /* teacher */
      'teacher.readBio': 'पूरी जीवनी पढ़ें →',

      /* empty states */
      'news.empty':    'अपडेट और घोषणाएं यहाँ दिखाई देंगी.',
      'achieve.empty': 'छात्रों की उपलब्धियाँ यहाँ प्रदर्शित की जाएंगी.',

      /* contact */
      'contact.phone':        'फ़ोन / व्हाट्सएप',
      'contact.email':        'ईमेल',
      'contact.location':     'स्थान',
      'contact.classes':      'कक्षाएं',
      'contact.schedule':     'सप्ताह में दो बार + वीकेंड रियाज़',
      'contact.scheduleNote': 'बैच टाइमिंग के लिए संपर्क करें',
      'contact.whatsapp':     '💬 व्हाट्सएप पर बात करें',

      /* gallery / buttons */
      'gallery.loadMore': 'और फ़ोटो लोड करें',
      'gallery.viewFull': '📷 पूरी गैलरी देखें',

      /* footer */
      'footer.copyright': '© 2026 SurSadhana Music Classes, पुणे. सर्वाधिकार सुरक्षित.',
      'footer.privacy':   'गोपनीयता नीति',
      'footer.terms':     'नियम &amp; शर्तें',
      'footer.portal':    '🎓 छात्र पोर्टल',
      'footer.about':     'परिचय',
      'footer.courses':   'पाठ्यक्रम',
      'footer.gallery':   'गैलरी',
      'footer.guru':      'गुरु',
      'footer.blog':      'सीखें',
      'footer.contact':   'संपर्क',

      /* guru page */
      'guru.founderLabel': 'संस्थापक &amp; गुरु',
      'guru.heroBtn1':     'ट्रायल क्लास बुक करें',
      'guru.heroBtn2':     'जीवनी पढ़ें',
      'guru.heroBtn3':     'प्रदर्शन देखें',
      'guru.yearsTeaching':'शिक्षण के वर्ष',
      'guru.ctaLabel':     'अपनी यात्रा शुरू करें',
      'guru.ctaTitle':     'मानसीजी से सीधे सीखें',
      'guru.ctaSub':       'सीमित सीटें उपलब्ध. बैच टाइमिंग, कोर्स विवरण या ट्रायल क्लास के लिए संपर्क करें.',
      'guru.ctaBtn1':      'संपर्क करें',
      'guru.ctaBtn2':      '💬 व्हाट्सएप करें',
      'guru.viewGallery':  'पूरी गैलरी देखें',

      /* gallery page */
      'page.gallery.heading': 'फोटो गैलरी',
      'page.gallery.sub':     'मैफिल, सांस्कृतिक कार्यक्रमों और रियाज़ सत्रों के पल.',

      /* blog page */
      'page.blog.heading':    'सीखने का कोना',
      'page.blog.sub':        'संगीत सिद्धांत, राग मार्गदर्शिका, परीक्षा तैयारी और छात्र कहानियाँ.',

      /* faq page */
      'page.faq.heading':     'अक्सर पूछे जाने वाले प्रश्न',
      'page.faq.sub':         'SurSadhana में संगीत सीखने के बारे में जो कुछ आपको जानना चाहिए.',
    },
  };

  /* ── Core apply function ─────────────────────────────────────────── */
  function applyLang(lang) {
    if (!LANGS.includes(lang)) lang = 'en';
    const t = T[lang] || T.en;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    localStorage.setItem('lang', lang);
  }

  /* ── Public API ──────────────────────────────────────────────────── */
  window.switchLang = function (lang) { applyLang(lang); };
  window.currentLang = function () { return localStorage.getItem('lang') || 'en'; };
  /* Call this after CMS re-populates content to re-apply i18n over it */
  window.reapplyLang = function () { applyLang(localStorage.getItem('lang') || 'en'); };

  /* ── Auto-init ───────────────────────────────────────────────────── */
  var saved = localStorage.getItem('lang');
  var initLang = LANGS.includes(saved) ? saved : 'en';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyLang(initLang); });
  } else {
    applyLang(initLang);
  }
})();
