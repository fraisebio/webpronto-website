(() => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll state + directional condensed state (mobile)
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (header) {
    const CONDENSE_TRIGGER = 80;
    let lastY = window.scrollY;
    let ticking = false;
    function updateHeader() {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      if (y <= CONDENSE_TRIGGER) {
        header.classList.remove('is-condensed');
      } else if (y > lastY + 3) {
        header.classList.add('is-condensed');
      } else if (y < lastY - 3) {
        header.classList.remove('is-condensed');
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
    updateHeader();
  }

  if (menuToggle && mobileNav && header) {
    const closeMobileMenu = () => {
      header.classList.remove('is-menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMobileMenu();
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq__item').forEach((item) => {
    const btn = item.querySelector('.faq__btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Checkbox state styling
  document.querySelectorAll('.check').forEach((label) => {
    const input = label.querySelector('input');
    if (!input) return;
    const sync = () => label.classList.toggle('is-active', input.checked);
    input.addEventListener('change', sync);
    sync();
  });

  // Form submission (Formspree, async)
  const form = document.getElementById('form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let ok = true;
      required.forEach((el) => {
        if (!el.value || (el.type === 'email' && !/.+@.+\..+/.test(el.value))) {
          ok = false;
          el.style.borderColor = '#E25C5C';
          el.addEventListener('input', () => el.style.borderColor = '', { once: true });
        }
      });
      if (!ok) return;

      submitBtn.disabled = true;
      const originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Envoi en cours…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error('Formspree error ' + res.status);
        form.classList.add('is-sent');
        const top = form.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
        alert("Désolé, l'envoi a échoué. Vous pouvez écrire directement à contact@webpronto.fr.");
      }
    });
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
