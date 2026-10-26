/* =============================================
   SHEKHINAH CONVENTION CENTRE — Main JS
   ============================================= */

/* ── December announcement bar ── */
(function () {
  if (!sessionStorage.getItem('announce-dismissed')) {
    document.body.classList.add('announce-visible');
  }
  const dismissBtn = document.querySelector('.announce-bar-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      document.body.classList.remove('announce-visible');
      sessionStorage.setItem('announce-dismissed', '1');
    });
  }
})();

/* ── Sticky nav ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile nav toggle ── */
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    if (navbar) navbar.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    const isOpen = navbar && navbar.classList.contains('open');
    spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });
}

/* Close mobile nav on link click */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navbar) navbar.classList.remove('open');
    const spans = toggle && toggle.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    }
  });
});

/* Close mobile nav when tapping outside */
document.addEventListener('click', (e) => {
  if (navbar && navbar.classList.contains('open') && !navbar.contains(e.target)) {
    navbar.classList.remove('open');
    const spans = toggle && toggle.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    }
  }
});

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Enquiry form submission ── */
if (typeof emailjs !== 'undefined') emailjs.init('ZMOqGe0V4vSDL1ux8');

const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
  const getVal = (name) => {
    const el = enquiryForm.querySelector('[name="' + name + '"]');
    return el ? el.value : '';
  };

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn  = enquiryForm.querySelector('[type="submit"]');
    const msg  = document.getElementById('form-success');
    const name = getVal('name') || 'there';

    btn.textContent = 'Sending…';
    btn.disabled = true;

    const templateParams = {
      name:          getVal('name'),
      org:           getVal('org'),
      phone:         getVal('phone'),
      email:         getVal('email'),
      event_type:    getVal('event-type'),
      attendees:     getVal('attendees'),
      dates:         getVal('dates'),
      duration:      getVal('duration'),
      accommodation: getVal('accommodation'),
      meals:         getVal('meals'),
      message:       getVal('message'),
    };

    emailjs.send('service_2qqps7p', 'template_gqglr1s', templateParams)
      .then(() => {
        trackEvent('enquiry_form_submit', { event_category: 'lead' });
        trackEvent('generate_lead', { event_category: 'lead', value: 1 });
        trackAdsConversion('lead');
        btn.textContent = 'Request Sent ✓';
        if (msg) {
          msg.style.display = 'block';
          msg.textContent = `Thank you, ${name}! We'll get back to you within 24 hours with a customised quote.`;
        }
        enquiryForm.reset();
        setTimeout(() => {
          btn.textContent = 'Request a Quote';
          btn.disabled = false;
          if (msg) msg.style.display = 'none';
        }, 5000);
      })
      .catch(() => {
        btn.textContent = 'Request a Quote';
        btn.disabled = false;
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#c0392b';
          msg.textContent = 'Something went wrong. Please call or WhatsApp us directly on +91 70938 57222.';
        }
      });
  });
}

/* ── GA4 + Google Ads Lead Event Tracking ── */
const trackEvent = (name, params = {}) => {
  if (typeof gtag === 'function') gtag('event', name, params);
};

// Fire a Google Ads conversion alongside GA4 events.
// Replace the label strings below with the values from:
// Google Ads → Goals → Conversions → + New conversion action → Website → Phone/WhatsApp/Lead
const AW_ID = 'AW-18405705430';
const AW_LABELS = {
  whatsapp: '-Zp3CNbR25YdENaNw8hE',
  phone:    'nWt6CIq42pYdENaNw8hE',
  lead:     '90_-CJyAvoodENaNw8hE',
};
const trackAdsConversion = (labelKey) => {
  const label = AW_LABELS[labelKey];
  if (typeof gtag === 'function' && label && !label.startsWith('REPLACE')) {
    gtag('event', 'conversion', { send_to: `${AW_ID}/${label}` });
  }
};

document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
  el.addEventListener('click', () => {
    const source = el.dataset.waSource || 'unknown';
    trackEvent('whatsapp_click', { event_category: 'lead', event_label: source });
    trackAdsConversion('whatsapp');
  });
});

document.querySelectorAll('a[href^="tel:"]').forEach(el => {
  el.addEventListener('click', () => {
    trackEvent('phone_click', { event_category: 'lead' });
    trackAdsConversion('phone');
  });
});

document.querySelectorAll('.nav-cta, .nav-cta-mobile a').forEach(el => {
  el.addEventListener('click', () => trackEvent('cta_click', { event_category: 'lead', event_label: 'book_tour_nav' }));
});

/* ── Sticky CTA bar ── */
const stickyCta     = document.getElementById('sticky-cta');
const heroSection   = document.querySelector('.hero');
const enquirySection = document.getElementById('enquiry');
const whatsappFloat  = document.querySelector('.whatsapp-float');

if (stickyCta) {
  const updateSticky = () => {
    const heroPast = heroSection ? heroSection.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
    const enquiryRect = enquirySection ? enquirySection.getBoundingClientRect() : null;
    const enquiryVisible = enquiryRect && enquiryRect.top < window.innerHeight && enquiryRect.bottom > 0;
    const show = heroPast && !enquiryVisible;

    stickyCta.classList.toggle('visible', show);
    if (whatsappFloat) {
      whatsappFloat.style.bottom = show ? `calc(${stickyCta.offsetHeight}px + 0.85rem)` : '';
    }
  };
  window.addEventListener('scroll', updateSticky, { passive: true });
}

/* ── Counter animation ── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ── Hero video — desktop only (skip 20MB download on mobile),
      deferred until page load so it doesn't compete with images ── */
if (window.innerWidth >= 769) {
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const source = heroVideo.querySelector('source[data-src]');
    if (source) {
      const startVideo = () => {
        source.src = source.dataset.src;
        heroVideo.load();
        heroVideo.play().catch(() => {});
      };
      if (document.readyState === 'complete') startVideo();
      else window.addEventListener('load', startVideo, { once: true });
    }
  }
}

/* ── Scroll depth milestones ── */
(function () {
  const milestones = [25, 50, 75, 90];
  const fired = new Set();
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = Math.round(window.scrollY / total * 100);
    milestones.forEach(m => {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        trackEvent('scroll_depth', { event_category: 'engagement', event_label: m + '%' });
      }
    });
  }, { passive: true });
})();

/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));
}
