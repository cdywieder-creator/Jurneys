import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import './style.css';

const arrow = '<span aria-hidden="true"><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const plane = (className = '', alt = '') => `<img class="plane ${className}" src="/assets/plane.svg" alt="${alt}" width="620" height="450" />`;
const projectWindow = (project, className = '') => {
  const isFillpack = project === 'fillpack';
  const domain = isFillpack ? 'fillpackusa.com' : 'mrbl-management-website.replit.app';
  const screenshot = `<img class="live-screenshot" src="/assets/${project}-live.webp" alt="${isFillpack ? 'Actual FillPack website: private label manufacturing and bulk oils and ingredients' : 'Actual MRBL website: engineered capital solutions with a visual financial framework'}" width="1440" height="1000" ${className ? 'loading="lazy"' : 'fetchpriority="high"'} />`;
  return `<div class="website-window live-window ${isFillpack ? 'fillpack-window' : 'mrbl-window'} ${className}">
    <div class="window-bar"><span class="window-dots"><i></i><i></i><i></i></span><span>${domain}</span>${arrow}</div>
    ${className ? `<button class="project-open" type="button" data-project="${project}" aria-label="Interact with the live ${isFillpack ? 'FillPack' : 'MRBL'} website">${screenshot}<span class="project-open-label">Interact with the live website ${arrow}</span></button>` : screenshot}
  </div>`;
};

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="header">
    <a class="wordmark" href="#home" aria-label="Journeys home">journeys<span class="brand-plane" aria-hidden="true"><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="brand-dot">®</span></a>
    <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#approach">Our approach</a></nav>
    <a class="nav-cta" href="#contact">Let's talk ${arrow}</a>
  </header>
  <main id="main">
    <section class="hero" id="home" aria-labelledby="hero-title">
      <div class="hero-orbit" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot"></span> SMALL STUDIO. BIG POSSIBILITIES.</p>
        <h1 id="hero-title">Make your business<br><em>take off.</em><span class="headline-spark" aria-hidden="true"><svg class="icon icon-star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" stroke="currentColor" stroke-width="2.5"/></svg></span></h1>
        <p class="hero-description">Custom websites that make your brand stand out—<br class="desktop-break">and give visitors a reason to reach out.</p>
        <div class="hero-actions"><a class="button button-dark" href="#contact">Let's talk ${arrow}</a><a class="text-link" href="#work">Explore our work <span aria-hidden="true">↓</span></a></div>
      </div>
      <svg class="hero-trail" viewBox="0 0 1400 650" fill="none" aria-hidden="true"><path d="M-60 630C100 525 335 690 528 569S814 441 785 363C746 257 591 290 686 401S1050 413 1167 147" stroke="#d69c42" stroke-width="1.5" stroke-dasharray="5 6"/></svg>
      ${plane('hero-plane', 'A sculptural amber paper plane, ready for takeoff')}
      <div class="hero-projects" aria-label="Project composition previews">
        <a href="#fillpack" class="hero-preview hero-preview-fillpack" aria-label="See the FillPack project">${projectWindow('fillpack')}<span class="preview-caption">FILLPACK <span>Brand experience · Web design</span> ${arrow}</span></a>
        <a href="#mrbl" class="hero-preview hero-preview-mrbl" aria-label="See the MRBL project">${projectWindow('mrbl')}<span class="preview-caption">MRBL <span>Financial services · Web design</span> ${arrow}</span></a>
        <span class="floating-note">Your next chapter<br>starts here.<svg viewBox="0 0 90 60" aria-hidden="true"><path d="M8 6q60-8 60 38m-10-8 10 12 7-13" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span>
      </div>
      <div class="hero-bottom"><span>STRATEGY MEETS A LITTLE LIFT.</span><a href="#stand-out">Scroll to take the journey <span aria-hidden="true">↓</span></a><span>01 / 06</span></div>
    </section>

    <section class="stand-out section-pad" id="stand-out" aria-labelledby="standout-title">
      <svg class="standout-trail" viewBox="0 0 400 260" fill="none" aria-hidden="true"><path d="M410 10C180 25 290 260 180 220S100 90-20 100" stroke="#b88738" stroke-width="1.5" stroke-dasharray="4 5"/></svg>
      <div class="section-label"><span>01 — THE FIRST IMPRESSION</span><span class="tiny-plane" aria-hidden="true"><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
      <div class="standout-grid"><h2 id="standout-title" class="reveal">Give them a<br>reason to <em>stop.</em></h2><div class="standout-copy reveal"><p>Your website should feel<br><strong>unmistakably yours.</strong></p><p class="body-copy">A little personality. A clear point of view. An experience that turns a passing glance into a closer look.</p><a class="text-link" href="#work">See what that looks like <span aria-hidden="true">↓</span></a></div></div>
      <div class="discipline-row"><span>Thoughtful strategy</span><span aria-hidden="true"><svg class="icon icon-star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" stroke="currentColor" stroke-width="2.5"/></svg></span><span>Distinctive design</span><span aria-hidden="true"><svg class="icon icon-star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" stroke="currentColor" stroke-width="2.5"/></svg></span><span>Purposeful interaction</span><span aria-hidden="true"><svg class="icon icon-star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" stroke="currentColor" stroke-width="2.5"/></svg></span><span>Made for your business</span></div>
    </section>

    <section class="work-section" id="work" aria-labelledby="work-title">
      <div class="section-label section-pad work-heading"><h2 id="work-title">A few journeys we've shaped.</h2><span>02 — SELECTED WORK</span></div>
      <article class="project fillpack-project" id="fillpack" aria-labelledby="fillpack-title">
        <div class="project-top"><span class="project-number">01 / FILLPACK</span><div class="project-tags"><span>Brand experience</span><span>Web design & build</span></div></div>
        <div class="project-stage reveal"><div class="project-stamp">GOOD IDEAS<br>DESERVE A<br><em>great website.</em><span aria-hidden="true"><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>${projectWindow('fillpack', 'large-window')}<span class="concept-label">ACTUAL WEBSITE · CLICK TO EXPLORE</span></div>
        <div class="project-info"><h3 id="fillpack-title">A physical product.<br>A powerful digital impression.</h3><div><p>For FillPack, we brought products, manufacturing, and bulk ingredients into one clear brand experience.</p><div class="project-links"><a class="button button-dark" href="https://fillpackusa.com/" target="_blank" rel="noopener noreferrer">Explore FillPack ${arrow}<span class="sr-only"> (opens in a new tab)</span></a><a class="text-link" href="#contact">Create something for my business ${arrow}</a></div></div></div>
      </article>
      <article class="project mrbl-project" id="mrbl" aria-labelledby="mrbl-title">
        <div class="project-top"><span class="project-number">02 / MRBL</span><div class="project-tags"><span>Content strategy</span><span>Web design & build</span></div></div>
        <div class="project-stage reveal"><div class="mrbl-decoration" aria-hidden="true">M<span>R</span>BL</div>${projectWindow('mrbl', 'large-window')}<span class="concept-label">ACTUAL WEBSITE · CLICK TO EXPLORE</span></div>
        <div class="project-info"><h3 id="mrbl-title">Complex ideas.<br>Clearly presented.</h3><div><p>For MRBL, we organized financial offerings into a focused, visual website.</p><a class="button button-light" href="https://mrbl-management-website.replit.app" target="_blank" rel="noopener noreferrer">Explore MRBL ${arrow}<span class="sr-only"> (opens in a new tab)</span></a></div></div>
      </article>
    </section>

    <section id="purpose" class="purpose section-pad" aria-labelledby="purpose-title">
      <div class="section-label"><span>03 — MORE THAN A PRETTY WEBSITE</span><span>A LITTLE DIRECTION GOES A LONG WAY.</span></div>
      <div class="purpose-heading"><h2 id="purpose-title">Every good journey<br>leads <em>somewhere.</em></h2><p>We design the whole journey—from first<br class="desktop-break"> impression to first conversation.</p></div>
      <div class="purpose-grid">
        <article class="purpose-card reveal"><div class="feature-visual feature-opening"><span class="mini-label">YOUR BRAND</span><strong>Hello,<br><em>possibility.</em></strong><span class="feature-star" aria-hidden="true"><svg class="icon icon-star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" stroke="currentColor" stroke-width="2.5"/></svg></span><span class="mini-pill">A FIRST IMPRESSION THAT STICKS <svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div><span class="card-step">01</span><h3>Get their attention.</h3><p>A strong opening that makes people pause, look, and want to know more.</p></article>
        <article class="purpose-card reveal"><div class="feature-visual feature-story"><span class="mini-label">THE BIG PICTURE</span><div class="story-layout"><span class="story-art"></span><div><strong>A story<br>worth telling.</strong><i></i><i></i><i></i></div></div><span class="mini-pill">CLEAR CONTENT. REAL CONNECTION.</span></div><span class="card-step">02</span><h3>Tell your story.</h3><p>A clear, considered structure that helps visitors understand what makes you different.</p></article>
        <article class="purpose-card reveal"><div class="feature-visual feature-convert"><span class="mini-label">THE NEXT CHAPTER</span><strong>Let's make<br>something good.</strong><span class="mini-contact">Start a conversation <span><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span><svg class="cursor" viewBox="0 0 32 40" aria-hidden="true"><path d="m3 3 24 21-13 2-6 10Z" fill="#eeeade" stroke="#232721" stroke-width="2"/></svg></div><span class="card-step">03</span><h3>Make the next step obvious.</h3><p>An accessible inquiry button. A simple conversation. A clear path forward.</p></article>
      </div>
      <svg class="purpose-flight-line" viewBox="0 0 1200 28" fill="none" aria-hidden="true"><path d="M0 16q180-26 390 0t400 0 410 0" stroke="#b88738" stroke-width="1.5" stroke-dasharray="4 6"/></svg>
    </section>

    <section class="approach section-pad" id="approach" aria-labelledby="approach-title">
      <div class="section-label"><span>04 — HOW WE BUILD YOURS</span><span>GOOD PEOPLE. A CLEAR PROCESS.</span></div>
      <div class="approach-heading"><h2 id="approach-title">From a first idea<br>to <em>ready for takeoff.</em></h2><p>Big on collaboration.<br>Light on complication.</p></div>
      <div class="route"><svg viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true"><path d="M10 50C220-10 390 110 580 50S950 0 1190 50" fill="none" stroke="#c28d37" stroke-width="1.5" stroke-dasharray="5 6"/></svg>
      <article class="route-stop reveal"><span class="stop-number">01</span><h3>Discover</h3><p>We learn about your business,<br>customers, and goals.</p></article><article class="route-stop reveal"><span class="stop-number">02</span><h3>Design & build</h3><p>We create the visual identity, structure,<br>and interactions your website needs.</p></article><article class="route-stop reveal"><span class="stop-number">03</span><h3>Launch</h3><p>We test, refine, and get your<br>website ready for visitors.</p></article></div>
      <div class="pricing"><div><span class="eyebrow">A STRONG START, WITHOUT THE GUESSWORK.</span><h3>Custom websites from <span>$2,500.</span></h3></div><p>Your quote reflects the pages, features,<br>and level of custom motion.</p><a class="round-link" href="#contact" aria-label="Discuss your custom website"><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a></div>
    </section>

    <section class="contact section-pad" id="contact" aria-labelledby="contact-title">
      <div class="section-label"><span>05 — YOUR NEXT DESTINATION</span><span>LET'S MAKE IT A GOOD ONE.</span></div>
      <div class="contact-grid"><div class="contact-copy"><h2 id="contact-title">Where could<br>your website<br><em>take you?</em></h2><p>Tell us about your business.<br>Let's build something people remember.</p>${plane('contact-plane')}</div>
      <form id="inquiry-form"><p class="form-intro">A good journey starts with a hello.</p><div class="form-row"><label>Your name<input name="name" autocomplete="name" required maxlength="120" placeholder="Alex Taylor"></label><label>Email address<input type="email" name="email" autocomplete="email" required maxlength="254" placeholder="alex@yourbusiness.com"></label></div><label>Business / website <span class="optional">(optional)</span><input name="business" autocomplete="organization" maxlength="300" placeholder="A little context goes a long way"></label><label>What do you have in mind?<textarea name="message" required minlength="10" maxlength="5000" rows="3" placeholder="Tell us about your business and where you'd like to go."></textarea></label><label class="honeypot" aria-hidden="true">Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label><button class="button button-dark" type="submit">Let's talk about your website ${arrow}</button><p class="form-note">No big pitch. Just a conversation about what's possible.</p><p id="form-status" class="form-status" role="status" aria-live="polite"></p><button type="button" id="download-inquiry" class="text-link" hidden>Save your inquiry as a text file ↓</button></form></div>
      <svg class="contact-trail" viewBox="0 0 1200 70" aria-hidden="true"><path d="M40 65q220-80 450-35t570-5" fill="none" stroke="#b27f2e" stroke-width="1.5" stroke-dasharray="4 5"/></svg>
    </section>
  </main>
  <footer class="footer"><a class="wordmark" href="#home">journeys<span class="brand-plane" aria-hidden="true"><svg class="icon icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="brand-dot">®</span></a><span>GOOD WEBSITES. GREAT POSSIBILITIES.</span><div><span>© ${new Date().getFullYear()} Journeys</span><a href="#home">Back to the top ↑</a></div></footer>
  <img class="journey-plane" src="/assets/plane.svg" alt="" aria-hidden="true" width="620" height="450" />
  <dialog class="live-dialog" aria-labelledby="live-dialog-title"><div class="dialog-header"><strong id="live-dialog-title">Explore the live website</strong><div><a id="live-external" target="_blank" rel="noopener noreferrer">Open in a new tab ${arrow}</a><button class="dialog-close" type="button" aria-label="Close live website">×</button></div></div><iframe title="Live project website" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe></dialog>
  <div class="flight-progress" aria-hidden="true"><span></span></div>
`;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

let framePending = false;
function updateFlight() {
  const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  document.querySelector('.flight-progress span').style.transform = `scaleX(${progress})`;
  if (!reducedMotion.matches) {
    const movement = Math.min(window.scrollY, 750);
    const airplane = document.querySelector('.hero-plane');
    airplane.style.setProperty('--flight-x', `${movement * 0.12}px`);
    airplane.style.setProperty('--flight-y', `${-movement * 0.13}px`);
    airplane.style.setProperty('--flight-rotation', `${-movement * 0.022}deg`);
  }
  const sprite = document.querySelector('.journey-plane');
  if (!reducedMotion.matches && window.innerWidth > 760) {
    const sections = ['stand-out', 'fillpack', 'mrbl', 'purpose', 'approach', 'contact'].map(id => document.getElementById(id));
    const center = window.scrollY + window.innerHeight * 0.44;
    const end = sections.at(-1).offsetTop;
    const active = center > sections[0].offsetTop - 100 && center < end + 100;
    sprite.style.opacity = active ? '1' : '0';
    const bank = Math.sin((center - sections[0].offsetTop) / 550);
    const x = window.innerWidth - (window.innerWidth > 1100 ? 115 : 86) + bank * 14;
    const y = window.innerHeight * 0.37 + Math.sin(center / 380) * 65;
    sprite.style.transform = `translate(${x}px, ${y}px) rotate(${bank * 16 - 12}deg)`;
  } else sprite.style.opacity = '0';
  framePending = false;
}
window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateFlight); } }, { passive: true });
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) document.querySelector('.hero-plane').removeAttribute('style');
  updateFlight();
});
updateFlight();

const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    document.querySelectorAll('.header nav a').forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }
}), { rootMargin: '-20% 0px -60% 0px' });
['home', 'work', 'approach', 'contact'].forEach(id => navObserver.observe(document.getElementById(id)));

const form = document.getElementById('inquiry-form');
const status = document.getElementById('form-status');
const download = document.getElementById('download-inquiry');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.innerHTML = 'Sending…';
  status.textContent = '';
  download.hidden = true;
  try {
    const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (response.status === 503 || response.status === 404) {
      status.textContent = 'Inquiry delivery is not connected yet. Your message has not been sent. You can save it below.';
      download.hidden = false;
    } else {
      if (!response.ok) throw new Error('Unable to send your inquiry. Please try again.');
      status.textContent = 'Thanks for reaching out. Your inquiry has been sent.';
      form.reset();
    }
  } catch {
    status.textContent = 'Your message could not be sent. Please try again, or save your inquiry below.';
    download.hidden = false;
  } finally {
    button.disabled = false;
    button.innerHTML = `Let's talk about your website ${arrow}`;
  }
});
download.addEventListener('click', () => {
  const data = Object.fromEntries(new FormData(form));
  const blob = new Blob([`JOURNEYS — WEBSITE INQUIRY\n\nName: ${data.name}\nEmail: ${data.email}\nBusiness: ${data.business || '—'}\n\n${data.message}\n`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'journeys-inquiry.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// Kie.ai artwork progressively enhances the hero once generated server-side.
fetch('/assets/generated/manifest.json').then(response => response.ok ? response.json() : null).then(manifest => {
  if (!manifest?.heroPlane?.startsWith('/assets/generated/')) return;
  const image = new Image();
  image.onload = () => {
    const heroPlane = document.querySelector('.hero-plane');
    heroPlane.src = manifest.heroPlane;
    heroPlane.alt = 'Sculptural amber plane, created with Kie.ai';
    heroPlane.classList.add('generated-plane');
    if (manifest.transparent) {
      const finalPlane = document.querySelector('.contact-plane');
      finalPlane.src = manifest.heroPlane;
      finalPlane.classList.add('generated-plane');
      document.querySelector('.journey-plane').src = manifest.heroPlane;
    }
  };
  image.src = manifest.heroPlane;
}).catch(() => {});


const dialog = document.querySelector('.live-dialog');
let lastProjectButton;
document.querySelectorAll('.project-open').forEach(button => button.addEventListener('click', () => {
  const fillpack = button.dataset.project === 'fillpack';
  const url = fillpack ? 'https://fillpackusa.com/' : 'https://mrbl-management-website.replit.app';
  lastProjectButton = button;
  document.getElementById('live-dialog-title').textContent = `${fillpack ? 'FillPack' : 'MRBL'} — the live website`;
  document.getElementById('live-external').href = url;
  dialog.querySelector('iframe').src = url;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { dialog.querySelector('iframe').removeAttribute('src'); document.body.style.overflow = ''; lastProjectButton?.focus({ preventScroll: true }); });
