/**
 * main.js — Shaurya Singh Portfolio
 * Handles: cursor, particles, scroll reveal, skill bars,
 *          nav active state, mobile menu, card tilt,
 *          smooth nav, contact form (backend API call),
 *          toast notifications, typing animation,
 *          scroll-to-top button, navbar scroll shrink.
 */

'use strict';

/* ============================================================
   CONFIG — change API_ENDPOINT to your deployed backend URL
   ============================================================ */
const CONFIG = {
  EMAILJS_SERVICE_ID:  'service_shaurya6978',
  EMAILJS_TEMPLATE_ID: 'template_shaurya6978',
  EMAILJS_PUBLIC_KEY:  'azO0G-WlJievGxhXM',
  TOAST_DURATION: 4000,
  PARTICLE_COUNT: 60,
  TYPING_SPEED: 90,   // ms per character
  ERASE_SPEED: 50,
  TYPING_PAUSE: 2000, // pause before erasing
};

/* ============================================================
   UTILITY — Toast Notification
   ============================================================ */
const toast = (() => {
  const el = document.getElementById('toast');
  let timer;

  function show(message, type = 'info') {
    if (!el) return;
    clearTimeout(timer);
    el.textContent = message;
    el.className = `show ${type}`;
    timer = setTimeout(() => { el.className = ''; }, CONFIG.TOAST_DURATION);
  }

  return { show };
})();


/* ============================================================
   CUSTOM CURSOR (desktop only)
   ============================================================ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  // Hide custom cursor on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    ring.style.display   = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
  });

  (function animRing() {
    rx += (mx - rx - 18) * 0.12;
    ry += (my - ry - 18) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animRing);
  })();

  const hoverEls = document.querySelectorAll(
    'a, button, .project-card, .edu-card, .detail-item, .contact-item'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width   = '56px';
      ring.style.height  = '56px';
      ring.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width   = '36px';
      ring.style.height  = '36px';
      ring.style.opacity = '0.5';
    });
  });
}


/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
    particles.push({
      x:  Math.random() * 2000,
      y:  Math.random() * 1200,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      a:  Math.random() * 0.6 + 0.2,
      c:  Math.random() > 0.5 ? '110,231,247' : '167,139,250',
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5)     { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5)      p.x = W + 5;
      if (p.x > W + 5)   p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}


/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.page-reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target); // reveal once
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => io.observe(el));
}


/* ============================================================
   SKILL BAR ANIMATION
   ============================================================ */
function initSkillBars() {
  const section = document.querySelector('#about');
  if (!section) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.classList.add('animate');
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  io.observe(section);
}


/* ============================================================
   NAVBAR — active link highlight + scroll shrink
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function onScroll() {
    // Shrink navbar on scroll
    if (navbar) {
      navbar.style.padding = window.scrollY > 60 ? '12px 60px' : '20px 60px';
    }

    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 220) current = s.id;
    });
    navLinks.forEach(a => {
      const active = a.getAttribute('href') === `#${current}`;
      a.style.color = active ? 'var(--accent)' : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;

  function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on any mobile nav link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggleMenu(false);
      const target = document.querySelector(a.getAttribute('href'));
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 200);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });
}


/* ============================================================
   SMOOTH SCROLL (desktop nav links)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


/* ============================================================
   PROJECT CARD 3D TILT (desktop only)
   ============================================================ */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ============================================================
   TYPING ANIMATION in hero role text
   ============================================================ */
function initTypingAnimation() {
  const roles = [
    'IoT Developer 🔌',
    'Web Developer 🌐',
    'Embedded Systems Engineer ⚙️',
    'Frontend Developer 🎨',
    'Full-Stack Explorer 🚀',
  ];
  const target = document.getElementById('typing-role');
  if (!target) return;

  let roleIndex = 0;
  let charIndex  = 0;
  let erasing    = false;

  function tick() {
    const current = roles[roleIndex];
    if (!erasing) {
      target.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        erasing = true;
        setTimeout(tick, CONFIG.TYPING_PAUSE);
        return;
      }
      setTimeout(tick, CONFIG.TYPING_SPEED);
    } else {
      target.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        erasing = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, CONFIG.ERASE_SPEED);
    }
  }
  tick();
}


/* ============================================================
   SCROLL TO TOP BUTTON
   ============================================================ */
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scrollTop';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.style.cssText = `
    position:fixed; bottom:32px; left:32px; z-index:800;
    width:44px; height:44px; border-radius:50%;
    background:transparent; border:1.5px solid var(--accent);
    color:var(--accent); font-size:1.1rem; font-weight:700;
    cursor:pointer; opacity:0; transform:translateY(10px);
    transition:all 0.3s ease; display:flex;
    align-items:center; justify-content:center;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const visible = window.scrollY > 400;
    btn.style.opacity   = visible ? '1' : '0';
    btn.style.transform = visible ? 'translateY(0)' : 'translateY(10px)';
    btn.style.pointerEvents = visible ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ============================================================
   CONTACT FORM — EmailJS Integration
   Sends real email to shaurya6978@gmail.com on every submission
   ============================================================ */
function initContactForm() {
  const submitBtn = document.getElementById('form-submit');
  if (!submitBtn) return;

  // Initialise EmailJS with public key
  emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);

  submitBtn.addEventListener('click', async () => {
    const name    = document.getElementById('form-name')?.value.trim();
    const email   = document.getElementById('form-email')?.value.trim();
    const subject = document.getElementById('form-subject')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();

    // --- Client-side validation ---
    if (!name || !email || !subject || !message) {
      toast.show('Please fill in all fields.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.show('Please enter a valid email address.', 'error');
      return;
    }
    if (message.length < 20) {
      toast.show('Message should be at least 20 characters.', 'error');
      return;
    }

    // --- Loading state ---
    submitBtn.classList.add('loading');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending...';

    const templateParams = {
      from_name:  name,
      from_email: email,
      subject:    subject,
      message:    message,
    };

    try {
      await emailjs.send(
        CONFIG.EMAILJS_SERVICE_ID,
        CONFIG.EMAILJS_TEMPLATE_ID,
        templateParams
      );

      toast.show("Message sent! I'll reply within 24 hours. 🚀", 'success');

      // Clear all form fields after success
      ['form-name', 'form-email', 'form-subject', 'form-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

    } catch (err) {
      console.error('EmailJS error:', err);
      toast.show('Failed to send. Please email me directly at shaurya6978@gmail.com', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message →';
    }
  });
}


/* ============================================================
   ACTIVE NAV SECTION HIGHLIGHT on load
   ============================================================ */
function initActiveNavOnLoad() {
  // Highlight "About" if at top
  const firstLink = document.querySelector('.nav-links a[href="#about"]');
  if (firstLink && window.scrollY < 100) firstLink.style.color = 'var(--accent)';
}


/* ============================================================
   HERO TYPING TARGET INJECTION
   Injects a <span id="typing-role"> into the hero role paragraph
   ============================================================ */
function injectTypingSpan() {
  const heroRole = document.querySelector('.hero-role');
  if (!heroRole) return;
  // Replace the strong tag content with typing span
  const strong = heroRole.querySelector('strong');
  if (strong) {
    const span = document.createElement('span');
    span.id = 'typing-role';
    span.style.cssText = 'color:var(--accent); border-right:2px solid var(--accent); padding-right:3px;';
    strong.replaceWith(span);
  }
}


/* ============================================================
   BOOT — initialise everything on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  initScrollReveal();
  initSkillBars();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initCardTilt();
  injectTypingSpan();
  initTypingAnimation();
  initScrollToTop();
  initContactForm();
  initActiveNavOnLoad();

  console.log('%c Shaurya Singh — Portfolio loaded ✓', 'color:#6ee7f7;font-weight:bold;font-size:14px;');
});