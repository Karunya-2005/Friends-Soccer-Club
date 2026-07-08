// ---- Mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.getElementById('mobile-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- Show guardian fields automatically for players under 18 ----
const dobInput = document.getElementById('dob');
const guardianFields = document.getElementById('guardianFields');
const guardianName = document.getElementById('guardianName');
const guardianPhone = document.getElementById('guardianPhone');

function calcAge(dobStr) {
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

dobInput.addEventListener('change', () => {
  const age = calcAge(dobInput.value);
  const isMinor = age !== null && age < 18;
  guardianFields.classList.toggle('hidden', !isMinor);
  guardianName.required = isMinor;
  guardianPhone.required = isMinor;
});

// ---- Scroll reveal for coach / training / CTA cards ----
// Progressive enhancement: elements are visible by default via the
// prefers-reduced-motion fallback, and revealed with a staggered fade
// as they scroll into view for everyone else.
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger siblings within the same grid for a cascading effect.
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(idx * 70, 420)}ms`;
        el.classList.add('in');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ---- Form submission ----
// This form posts to Formspree (https://formspree.io) — a free service that
// forwards submissions straight to your inbox with zero backend code.
//
// TO ACTIVATE:
// 1. Create a free account at https://formspree.io
// 2. Create a new form and copy its endpoint, e.g. https://formspree.io/f/abcdEFG
// 3. Paste that URL as FORM_ENDPOINT below.
// Until you do this, the form will show a friendly message instead of submitting,
// so nothing fails silently in front of a visitor.

const FORM_ENDPOINT = ''; // <-- paste your Formspree endpoint URL here

const form = document.getElementById('registration-form');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-label').textContent = 'Submitting…';

  if (!FORM_ENDPOINT) {
    // No backend connected yet — tell the site owner, not just the visitor.
    setTimeout(() => {
      status.textContent = 'Registration received locally. (Site owner: connect FORM_ENDPOINT in script.js to deliver this to your inbox — see README.md.)';
      status.classList.add('success');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-label').textContent = 'Submit registration';
      form.reset();
      guardianFields.classList.add('hidden');
    }, 500);
    return;
  }

  try {
    const data = new FormData(form);
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      status.textContent = "Thanks — you're registered! We'll email confirmation within 3 working days.";
      status.classList.add('success');
      form.reset();
      guardianFields.classList.add('hidden');
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    status.textContent = 'Something went wrong sending your registration. Please try again or email hello@friendssoccerclub.example.';
    status.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-label').textContent = 'Submit registration';
  }
});
