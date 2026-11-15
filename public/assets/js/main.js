/* Happy Minds interactions: nav, scroll reveal, counters, honest form handling. No dependencies. */
(() => {
  const d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Photo slots. To use a real photo: save it as assets/images/<slot>.jpg and add the slot name to PHOTOS.
  // Slots not listed keep their illustrated fallback, so no broken images or 404s.
  const PHOTOS = ['hero']; // other slots: about, literacy, arts, lifeskills, digital, stem, community
  d.querySelectorAll('.ph').forEach(el => { const s = el.dataset.slot, src = el.dataset.img || (PHOTOS.includes(s) ? `assets/images/${s}.jpg` : '');
    if (src) { const i = d.createElement('i'); i.style.backgroundImage = `url("${src}")`; el.append(i); } });
  // Mobile menu
  const tg = d.getElementById('menuToggle'), mn = d.getElementById('mobileNav');
  tg?.addEventListener('click', () => tg.setAttribute('aria-expanded', mn.classList.toggle('show')));
  // Header shadow on scroll
  const hd = d.querySelector('.hm-header'); const onScroll = () => hd?.classList.toggle('stuck', scrollY > 8); addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // Staggered scroll reveal
  d.querySelectorAll('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => { c.dataset.r = ''; c.style.setProperty('--i', i); }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  d.querySelectorAll('[data-r]').forEach(el => io.observe(el));
  // Animated counters: <span data-count="2500" data-suffix="+">
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const end = +e.target.dataset.count, suf = e.target.dataset.suffix || '', t0 = performance.now();
    const step = t => { const p = reduce ? 1 : Math.min((t - t0) / 1400, 1); e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-ZA').replace(/\s/g, ',') + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  d.querySelectorAll('[data-count]').forEach(el => co.observe(el));
  // Contact/volunteer forms open the visitor's email app with the message filled in (no mail backend yet).
  const mail = (to, subject, body) => { location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; };
  const val = (f, n) => (f.elements[n]?.value || '').trim();
  const show = (id, html) => { const n = d.getElementById(id); n.innerHTML = html; n.hidden = false; n.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); };
  d.getElementById('contactForm')?.addEventListener('submit', e => { e.preventDefault(); const f = e.target;
    mail('Inquire@happyminds.org', `${val(f, 'subject')} – ${val(f, 'name')}`, `${val(f, 'message')}\n\nFrom: ${val(f, 'name')} (${val(f, 'email')})`);
    show('formFeedback', 'Your email app should now open with your message ready. <strong>Press send there to complete it.</strong> If nothing opens, email us at Inquire@happyminds.org.'); });
  d.getElementById('volunteerForm')?.addEventListener('submit', e => { e.preventDefault(); const f = e.target;
    mail('volunteer@happyminds.org', `Volunteer application – ${val(f, 'role')}`, `Name: ${val(f, 'name')}\nEmail: ${val(f, 'email')}\nPhone: ${val(f, 'phone')}\nWould like to help as: ${val(f, 'role')}\n\n${val(f, 'about')}`);
    show('volFeedback', 'Your email app should now open with your application ready. <strong>Press send there to complete it.</strong> Or email volunteer@happyminds.org directly.'); });
  // Donation amount buttons (the submit logic lives in assets/js/donate.js).
  const amt = d.getElementById('amount');
  d.querySelectorAll('.amt').forEach(b => b.addEventListener('click', () => { amt.value = b.dataset.amt; d.querySelectorAll('.amt').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  amt?.addEventListener('input', () => d.querySelectorAll('.amt').forEach(x => x.setAttribute('aria-pressed', x.dataset.amt === amt.value)));
})();