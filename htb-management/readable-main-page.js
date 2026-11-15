/**
 * Marketing site for "Management", a fictional managed IT provider.
 * Readable rewrite of app_decrypted.js.
 *
 * Renders the whole page into <div id="app"> and wires up the mobile menu,
 * the contact form and the scroll-reveal animation. Makes no network requests.
 */
(function () {
  'use strict';

  const SSO_URL = 'https://sso.management.htb/';

  // ---------------------------------------------------------------------------
  // Icons: the inner SVG markup for each icon name
  // ---------------------------------------------------------------------------

  const ICONS = {
    infra:  '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
    id:     '<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><path d="M12 11.5v3"/>',
    desk:   '<path d="M4 5h16v10H4z"/><path d="M2 19h20"/><path d="M9 15v4M15 15v4"/>',
    backup: '<path d="M12 3v9"/><path d="M8.5 8.5 12 12l3.5-3.5"/><path d="M4 14a8 8 0 0 0 16 0"/>',
    eye:    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/>',
    shield: '<path d="M12 3 5 6v5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6Z"/><path d="m9.2 12 1.9 1.9 3.7-3.8"/>',
    key:    '<circle cx="8" cy="14" r="3.2"/><path d="m10.5 11.5 8-8M16 6l2.5 2.5M14 8l2 2"/>',
    flow:   '<rect x="3" y="3" width="6" height="6" rx="1.4"/><rect x="15" y="15" width="6" height="6" rx="1.4"/><path d="M9 6h4a3 3 0 0 1 3 3v6"/>',
    clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail:   '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin:    '<path d="M12 21s-7-5.7-7-11a7 7 0 0 1 14 0c0 5.3-7 11-7 11Z"/><circle cx="12" cy="10" r="2.4"/>',
    phone:  '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    menu:   '<path d="M3 6h18M3 12h18M3 18h18"/>',
    arrow:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };

  // ---------------------------------------------------------------------------
  // Page content
  // ---------------------------------------------------------------------------

  const SERVICES = [
    {
      icon: 'infra',
      title: 'Managed Infrastructure',
      description: 'We run your servers, networks and virtualisation as one estate — patched, hardened and monitored around the clock.',
      points: ['24/7 NOC coverage', 'Patch & configuration baselines', 'Capacity and lifecycle planning'],
    },
    {
      icon: 'id',
      title: 'Identity & Access',
      description: 'A single sign-on broker fronts every client application, with federation, MFA and self-service recovery built in.',
      points: ['SSO / SAML & OAuth federation', 'Multi-factor enforcement', 'Joiner / mover / leaver automation'],
    },
    {
      icon: 'desk',
      title: 'Service Desk & Assets',
      description: 'One ITIL service desk tracks every ticket, asset and licence across your fleet, with full CMDB visibility.',
      points: ['Incident & change management', 'Asset & licence inventory', 'SLA reporting'],
    },
    {
      icon: 'backup',
      title: 'Backup & Disaster Recovery',
      description: 'Deduplicated, encrypted backups of every managed host, with rehearsed restores and documented recovery targets.',
      points: ['Encrypted off-site repositories', 'Daily integrity verification', 'Tested restore runbooks'],
    },
    {
      icon: 'eye',
      title: 'Monitoring & Response',
      description: 'Telemetry from every endpoint feeds a single alert pipeline so we catch problems before your users do.',
      points: ['Metrics & log aggregation', 'Threshold & anomaly alerting', 'Guided remediation'],
    },
    {
      icon: 'shield',
      title: 'Security Operations',
      description: 'Continuous hardening, vulnerability triage and access review keep your environment audit-ready all year.',
      points: ['Vulnerability management', 'Quarterly access reviews', 'Audit & compliance support'],
    },
  ];

  const FEATURES = [
    {
      icon: 'key',
      title: 'Unified identity broker',
      description: 'Every portal, from the service desk to client dashboards, authenticates through one hardened SSO gateway.',
    },
    {
      icon: 'flow',
      title: 'One operations platform',
      description: 'Assets, tickets, monitoring and backup share a single source of truth — no spreadsheets, no blind spots.',
    },
    {
      icon: 'backup',
      title: 'Recovery you can prove',
      description: 'Restores are rehearsed on a schedule, not improvised during an incident.',
    },
    {
      icon: 'clock',
      title: '15-minute response',
      description: 'Priority incidents are acknowledged by a named engineer within fifteen minutes, day or night.',
    },
  ];

  const STATS = [
    { value: '99.98<span>%</span>', label: 'Platform uptime, trailing 12 months' },
    { value: '15<span>m</span>', label: 'Median priority response time' },
    { value: '4,200<span>+</span>', label: 'Endpoints under management' },
    { value: '24<span>/7</span>', label: 'Network operations coverage' },
  ];

  const CONTACT_DETAILS = [
    { icon: 'mail', label: 'Email', value: 'hello@management.htb' },
    { icon: 'phone', label: 'Service desk', value: '+44 20 7946 0142' },
    { icon: 'pin', label: 'Operations centre', value: 'Holborn, London' },
  ];

  const SYSTEM_STATUS = [
    { name: 'identity.broker', status: 'online' },
    { name: 'service-desk', status: 'online' },
    { name: 'monitoring', status: 'online' },
    { name: 'backup.repo', status: 'verified' },
  ];

  const SERVICE_OPTIONS = [
    'Managed infrastructure',
    'Identity & access',
    'Service desk & assets',
    'Backup & DR',
    'Full managed estate',
  ];

  // ---------------------------------------------------------------------------
  // HTML helpers
  // ---------------------------------------------------------------------------

  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

  const serviceCard = ({ icon: name, title, description, points }) => `
    <article class="card rev">
      <div class="ico">${icon(name)}</div>
      <h3>${title}</h3>
      <p>${description}</p>
      <ul>${points.map((point) => `<li>${point}</li>`).join('')}</ul>
    </article>`;

  const featureRow = ({ icon: name, title, description }) => `
    <div class="feature">
      <div class="fi">${icon(name)}</div>
      <div><h3>${title}</h3><p>${description}</p></div>
    </div>`;

  const statBlock = ({ value, label }) =>
    `<div><div class="n">${value}</div><div class="l">${label}</div></div>`;

  const contactRow = ({ icon: name, label, value }) => `
    <div class="row">
      <div class="ci">${icon(name)}</div>
      <div><div class="t">${label}</div><div class="v">${value}</div></div>
    </div>`;

  const statusRow = ({ name, status }) =>
    `<div class="row"><span class="d">${name}</span><span class="g">${status}</span></div>`;

  const brand = (style = '') => `
    <a class="brand" href="#top"${style ? ` style="${style}"` : ''}>
      <span class="mark"></span><span>MANAGE<b>MENT</b></span>
    </a>`;

  // ---------------------------------------------------------------------------
  // Page sections
  // ---------------------------------------------------------------------------

  const renderHeader = () => `
    <header class="nav">
      <div class="wrap nav-in">
        ${brand()}
        <nav class="nav-links" id="menu">
          <a href="#services">Services</a>
          <a href="#platform">Platform</a>
          <a href="#why">Why us</a>
          <a href="#contact">Contact</a>
          <a class="btn btn-primary" href="${SSO_URL}">Client login</a>
        </nav>
        <button class="nav-toggle" id="burger" aria-label="Menu">${icon('menu')}</button>
      </div>
    </header>`;

  const renderHero = () => `
    <section class="hero">
      <div class="hero-grid"></div>
      <div class="wrap hero-in">
        <p class="eyebrow rev">Managed IT &amp; infrastructure</p>
        <h1 class="rev">Your infrastructure, <span class="hl">fully managed</span>.</h1>
        <p class="lead rev">Management runs the identity, service desk, monitoring and backup that keep mid-market businesses online — so your team ships, and we keep the lights on.</p>
        <div class="hero-cta rev">
          <a class="btn btn-primary" href="#services">Explore services ${icon('arrow')}</a>
          <a class="btn btn-ghost" href="${SSO_URL}">Client login</a>
        </div>
        <div class="hero-meta rev">
          <div><div class="n">99.98%</div><div class="l">Uptime</div></div>
          <div><div class="n">15&nbsp;min</div><div class="l">Response</div></div>
          <div><div class="n">ISO&nbsp;27001</div><div class="l">Aligned</div></div>
        </div>
      </div>
    </section>`;

  const renderServices = () => `
    <section class="section" id="services">
      <div class="wrap">
        <div class="section-head rev">
          <p class="eyebrow">What we run</p>
          <h2>Everything your IT needs, under one roof.</h2>
          <p>Six managed services that share one platform and one accountable team. Pick the cover you need today and grow into the rest.</p>
        </div>
        <div class="grid grid-3">${SERVICES.map(serviceCard).join('')}</div>
      </div>
    </section>`;

  const renderPlatform = () => `
    <section class="section" id="platform">
      <div class="wrap">
        <div class="split">
          <div>
            <p class="eyebrow rev">The platform</p>
            <h2 class="rev">One pane of glass for the whole estate.</h2>
            <p class="muted rev" style="margin:16px 0 26px">Management isn't a folder of disconnected tools. Identity, assets, monitoring and backup feed a single operations platform, so every engineer sees the same truth and nothing falls through the cracks.</p>
            <div class="rev">${FEATURES.map(featureRow).join('')}</div>
          </div>
          <div class="panel rev">
            <div class="bar"><i></i><i></i><i></i></div>
            <div class="scr">
              ${SYSTEM_STATUS.map(statusRow).join('')}
              <div style="margin-top:14px"><span class="k">$</span> <span class="d">estate status --summary</span></div>
              <div class="d">hosts managed&nbsp;&nbsp;&nbsp;4218 / 4218 healthy</div>
              <div class="d">open incidents&nbsp;&nbsp;2 low &nbsp;0 high</div>
              <div class="d">last backup&nbsp;&nbsp;&nbsp;&nbsp;02:14 &middot; integrity ok</div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const renderWhy = () => `
    <section class="section" id="why">
      <div class="wrap">
        <div class="section-head rev">
          <p class="eyebrow">Why Management</p>
          <h2>The numbers our clients hold us to.</h2>
        </div>
        <div class="strip rev">${STATS.map(statBlock).join('')}</div>
      </div>
    </section>`;

  const renderContact = () => `
    <section class="section" id="contact">
      <div class="wrap">
        <div class="contact">
          <div>
            <p class="eyebrow rev">Talk to us</p>
            <h2 class="rev">Scope a managed engagement.</h2>
            <p class="muted rev" style="margin-top:16px">Tell us what you run today. An engineer — not a sales bot — will come back with a clear scope and a fixed monthly figure.</p>
            <div class="cinfo rev" style="margin-top:28px">${CONTACT_DETAILS.map(contactRow).join('')}</div>
          </div>
          <form class="form rev" id="cform" novalidate>
            <div class="field"><label for="fn">Full name</label><input id="fn" name="fn" type="text" autocomplete="name" required></div>
            <div class="field"><label for="fc">Company</label><input id="fc" name="fc" type="text" autocomplete="organization"></div>
            <div class="field"><label for="fe">Work email</label><input id="fe" name="fe" type="email" autocomplete="email" required></div>
            <div class="field">
              <label for="fs">What do you need managed?</label>
              <select id="fs" name="fs">${SERVICE_OPTIONS.map((option) => `<option>${option}</option>`).join('')}</select>
            </div>
            <div class="field"><label for="fm">Message</label><textarea id="fm" name="fm" placeholder="Roughly how many users and sites?"></textarea></div>
            <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Request a scope</button>
            <div class="toast" id="toast">Thanks — your request is queued. An engineer will reply to your work email shortly.</div>
          </form>
        </div>
      </div>
    </section>`;

  const renderFooter = () => `
    <footer>
      <div class="wrap">
        <div class="foot">
          <div>
            ${brand('margin-bottom:14px')}
            <p class="muted" style="max-width:280px;font-size:.9rem">Managed IT, identity and infrastructure for businesses that would rather build than babysit servers.</p>
          </div>
          <div class="cols">
            <div>
              <h4>Services</h4>
              <a href="#services">Managed infrastructure</a>
              <a href="#services">Identity &amp; access</a>
              <a href="#services">Service desk</a>
              <a href="#services">Backup &amp; DR</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#platform">Platform</a>
              <a href="#why">Why us</a>
              <a href="#contact">Contact</a>
              <a href="${SSO_URL}">Client login</a>
            </div>
          </div>
        </div>
        <div class="copy">&copy; 2026 Management Managed Services Ltd. All rights reserved.</div>
      </div>
    </footer>`;

  // ---------------------------------------------------------------------------
  // Behaviour
  // ---------------------------------------------------------------------------

  /** Burger button toggles the mobile menu; choosing a link closes it. */
  function setUpMobileMenu() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');

    if (burger) {
      burger.addEventListener('click', () => menu.classList.toggle('open'));
    }
    document.querySelectorAll('#menu a').forEach((link) => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  /**
   * Requires a name and an email, focusing an empty one, then shows the
   * "thanks" toast and clears the form. The form data is never sent anywhere.
   */
  function setUpContactForm() {
    const form = document.getElementById('cform');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('fn');
      const email = document.getElementById('fe');

      const nameEmpty = !name.value.trim();
      const emailEmpty = !email.value.trim();

      if (nameEmpty || emailEmpty) {
        // Kept from the original: when both are empty, focus lands on email.
        (emailEmpty ? email : name).focus();
        return;
      }

      document.getElementById('toast').classList.add('on');
      form.reset();
    });
  }

  /** Adds the "in" class to each .rev element once it scrolls into view. */
  function setUpScrollReveal() {
    const elements = document.querySelectorAll('.rev');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
  }

  // ---------------------------------------------------------------------------
  // Startup
  // ---------------------------------------------------------------------------

  function init() {
    document.getElementById('app').innerHTML = `
      ${renderHeader()}
      <main id="top">
        ${renderHero()}
        ${renderServices()}
        ${renderPlatform()}
        ${renderWhy()}
        ${renderContact()}
      </main>
      ${renderFooter()}`;

    setUpMobileMenu();
    setUpContactForm();
    setUpScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
