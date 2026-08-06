/* =============================================
   SHEKHINAH CONVENTION CENTRE — Main JS
   ============================================= */

/* ── Sticky nav ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile nav toggle ── */
const toggle = document.querySelector('.nav-toggle');
toggle?.addEventListener('click', () => {
  navbar?.classList.toggle('open');
  const spans = toggle.querySelectorAll('span');
  const isOpen = navbar?.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

/* Close mobile nav on link click */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navbar?.classList.remove('open');
    const spans = toggle?.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    }
  });
});

/* Close mobile nav when tapping outside */
document.addEventListener('click', (e) => {
  if (navbar?.classList.contains('open') && !navbar.contains(e.target)) {
    navbar.classList.remove('open');
    const spans = toggle?.querySelectorAll('span');
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
enquiryForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn  = enquiryForm.querySelector('[type="submit"]');
  const msg  = document.getElementById('form-success');
  const name = enquiryForm.querySelector('[name="name"]')?.value || 'there';

  btn.textContent = 'Sending…';
  btn.disabled = true;

  const templateParams = {
    name:          enquiryForm.querySelector('[name="name"]')?.value,
    org:           enquiryForm.querySelector('[name="org"]')?.value,
    phone:         enquiryForm.querySelector('[name="phone"]')?.value,
    email:         enquiryForm.querySelector('[name="email"]')?.value,
    event_type:    enquiryForm.querySelector('[name="event-type"]')?.value,
    attendees:     enquiryForm.querySelector('[name="attendees"]')?.value,
    dates:         enquiryForm.querySelector('[name="dates"]')?.value,
    duration:      enquiryForm.querySelector('[name="duration"]')?.value,
    accommodation: enquiryForm.querySelector('[name="accommodation"]')?.value,
    meals:         enquiryForm.querySelector('[name="meals"]')?.value,
    message:       enquiryForm.querySelector('[name="message"]')?.value,
  };

  emailjs.send('service_2qqps7p', 'template_gqglr1s', templateParams)
    .then(() => {
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
