/* ============================================================
   HANEET MOTOR WORKS — script.js
   Vanilla JS — Scroll Animations, Nav, Mobile Menu, Counter
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Navbar scroll effect ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const y = window.scrollY;

    // Sticky nav style
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top button
    if (y > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // AOS triggers
    triggerAOS();

    // Counter trigger
    checkCounters();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* ── 2. Back to top ─────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. Mobile Menu ─────────────────────────────────────── */
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 4. AOS — Animate On Scroll ────────────────────────── */
  function triggerAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    const windowH  = window.innerHeight;

    elements.forEach(el => {
      const rect  = el.getBoundingClientRect();
      const delay = parseInt(el.getAttribute('data-aos-delay') || 0);

      if (rect.top < windowH - 60) {
        setTimeout(() => el.classList.add('aos-animate'), delay);
      }
    });
  }

  // Initial trigger (elements already visible on load)
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(triggerAOS, 100);
  });

  /* ── 5. Stats Counter Animation ─────────────────────────── */
  let countersDone = false;

  function checkCounters() {
    if (countersDone) return;

    const counterEls = document.querySelectorAll('[data-count]');
    if (!counterEls.length) return;

    const section = document.getElementById('hero');
    if (!section) return;

    // Fire counters as soon as hero is in view
    counterEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        animateCounter(el);
      }
    });

    // Check if all done
    const allDone = [...counterEls].every(el => el.classList.contains('counted'));
    if (allDone) countersDone = true;
  }

  function animateCounter(el) {
    if (el.classList.contains('counted')) return;
    el.classList.add('counted');

    const target   = parseInt(el.getAttribute('data-count'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── 6. Smooth scroll for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10);
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 7. Active Nav Link highlighting ────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) + 60;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── 8. Hero text typing effect ─────────────────────────── */
  const typingEl = document.getElementById('hero-typing');
  if (typingEl) {
    const words = ['Multi-Brand Repairs', 'Insurance Claims', 'Denting & Painting', 'Mechanical Service'];
    let wi = 0, ci = 0, deleting = false;

    function typeStep() {
      const word    = words[wi];
      const current = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
      typingEl.textContent = current;

      let delay = deleting ? 60 : 110;
      if (!deleting && ci === word.length + 1) { delay = 1800; deleting = true; }
      if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 400; }

      setTimeout(typeStep, delay);
    }
    typeStep();
  }

  /* ── 9. Gallery: lightbox placeholder ───────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      // Placeholder — replace with real lightbox when images are added
      console.log('Gallery item clicked — hook up a lightbox here');
    });
    // Keyboard support
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View workshop photo');
  });

  /* ── 10. Service cards stagger delay ────────────────────── */
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.setAttribute('data-aos-delay', i * 80);
  });

  document.querySelectorAll('.why-card').forEach((card, i) => {
    card.setAttribute('data-aos-delay', i * 70);
  });

})();
