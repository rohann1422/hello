(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = '☰';
  }));

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.12});
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }), {rootMargin:'-30% 0px -60% 0px'});
    sections.forEach(section => activeObserver.observe(section));
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('p');
  let lastFocus = null;
  document.querySelectorAll('.photo-card').forEach(card => card.addEventListener('click', () => {
    lastFocus = card; lightboxImg.src = card.dataset.photo; lightboxImg.alt = card.querySelector('img').alt;
    lightboxCaption.textContent = card.dataset.caption; lightbox.hidden = false; document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }));
  function closeLightbox() { lightbox.hidden = true; lightboxImg.src = ''; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  const form = document.getElementById('wishForm');
  const nameInput = document.getElementById('wishName');
  const messageInput = document.getElementById('wishMessage');
  const charCount = document.getElementById('charCount');
  const wishList = document.getElementById('wishList');
  const toast = document.getElementById('toast');
  const STORAGE_KEY = 'birthdayLoveNotes-v1';
  let toastTimer;
  function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500); }
  function getWishes() { try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(data) ? data.slice(-30) : []; } catch { return []; } }
  function renderWishes() {
    const wishes = getWishes(); wishList.replaceChildren();
    if (!wishes.length) { const empty = document.createElement('p'); empty.className = 'empty-wishes'; empty.textContent = 'Your lovely words could be the first little note here. ♡'; wishList.append(empty); return; }
    wishes.slice().reverse().forEach(wish => {
      const card = document.createElement('article'); card.className = 'wish-card';
      const message = document.createElement('p'); message.textContent = wish.message;
      const name = document.createElement('b'); name.textContent = '♡ ' + wish.name;
      card.append(message, name); wishList.append(card);
    });
  }
  messageInput.addEventListener('input', () => { charCount.textContent = `${messageInput.value.length} / 240`; });
  form.addEventListener('submit', event => {
    event.preventDefault(); const name = nameInput.value.trim(); const message = messageInput.value.trim();
    if (!name || !message) return;
    const wishes = getWishes(); wishes.push({name: name.slice(0,40), message: message.slice(0,240)});
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes.slice(-30))); }
    catch { showToast('Your browser could not save this note.'); return; }
    form.reset(); charCount.textContent = '0 / 240'; renderWishes(); showToast('Your birthday wish has been added ♡');
  });
  renderWishes();
})();
