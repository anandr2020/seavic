/* Smooth scroll, scrollspy, mobile nav, hero fallback, form handling */
(function () {

  const navList = document.getElementById('navList');
  const menuToggle = document.getElementById('menuToggle');
  const links = Array.from(document.querySelectorAll('[data-scroll]'));
  const sections = Array.from(document.querySelectorAll('section.section'));
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const demoBtn = document.getElementById('demoFill');
  const heroImg = document.getElementById('heroImg');
  const header = document.getElementById('siteHeader');

  /* Set footer year */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================
     Header height helper
  ============================= */
  function headerHeight() {
    return header ? Math.ceil(header.getBoundingClientRect().height) : 78;
  }

  /* ============================
     Smooth Scroll
  ============================= */
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      // Close mobile nav if open
      if (navList.getAttribute('data-open') === 'true') {
        navList.setAttribute('data-open', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      }

      const offset = headerHeight() + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });

      setActiveLink(link);
    });
  });

  /* ============================
     Mobile Navigation
  ============================= */
  menuToggle?.addEventListener('click', () => {
    const open = navList.getAttribute('data-open') === 'true';
    navList.setAttribute('data-open', String(!open));
    menuToggle.setAttribute('aria-expanded', String(!open));
  });

  /* ============================
     Scrollspy (Fixed rootMargin)
  ============================= */
  function createObserver() {
    const offset = headerHeight();

    // FIXED TEMPLATE STRING
    const rootMargin = `${-(offset + 12)}px 0px -40% 0px`;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');

        // FIXED SELECTOR (now inside backticks)
        const activeLink = document.querySelector(`[href="#${id}"][data-scroll]`);

        if (activeLink) setActiveLink(activeLink);
      });
    }, {
      threshold: 0.28,
      root: null,
      rootMargin
    });

    sections.forEach(sec => observer.observe(sec));
    return observer;
  }

  let spy = createObserver();

  window.addEventListener('resize', () => {
    spy.disconnect();
    spy = createObserver();
  });

  function setActiveLink(active) {
    links.forEach(l => l.classList.remove('active'));
    if (active) active.classList.add('active');
  }

  /* ============================
     Header subtle animation
  ============================= */
  let scrollTimer;
  window.addEventListener('scroll', () => {
    const anim = document.querySelector('.header-anim');
    if (!anim) return;

    anim.style.opacity = '.16';

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      anim.style.opacity = '.06';
    }, 250);
  }, { passive: true });

  /* ============================
     HERO IMAGE FALLBACK
  ============================= */
  function setHeroFallback(localPath) {
    if (!heroImg) return;

    const testImg = new Image();
    testImg.onload = () => {
      heroImg.style.backgroundImage = `url('${localPath}')`; // FIXED
    };
    testImg.onerror = () => {
      heroImg.style.backgroundImage = 'linear-gradient(135deg,#f5f5f5,#ffffff)';
    };
    testImg.src = localPath;
  }

  setHeroFallback('assets/img/hero.jpg');

  /* ============================
     CONTACT FORM
  ============================= */
  demoBtn?.addEventListener('click', () => {
    form.name.value = 'John Client';
    form.email.value = 'client@company.com';
    form.message.value = 'We need help with platform development.';
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill all fields.';
      return;
    }

    status.textContent = 'Sending…';

    setTimeout(() => {
      status.textContent = 'Message received. We’ll reply via email.';
      form.reset();
    }, 700);
  });

  /* ============================
     ESC closes mobile nav
  ============================= */
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.getAttribute('data-open') === 'true') {
      navList.setAttribute('data-open', 'false');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ============================
     CARD TILT EFFECT (FIXED)
  ============================= */
  const tiltCards = document.querySelectorAll('.card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / 15) * -1;
      const rotateY = (x - centerX) / 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

})();
