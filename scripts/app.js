/**
 * SIXOS â€” Application Controller & Consultation Wizard (V2)
 */

(function() {
  'use strict';

  // Force page to always start at the very top (Home) on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  }

  // ----------------------------------------------------
  // 1. NAVBAR SCROLL INTERACTION
  // ----------------------------------------------------
  const navbarWrapper = document.getElementById('navbar-wrapper');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }
  }, { passive: true });

  // ----------------------------------------------------
  // 1b. SCROLL SPY & ACTIVE NAV LINK HIGHLIGHTING (BOLD)
  // ----------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let currentSectionId = 'home';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const linkNav = link.getAttribute('data-nav');
      if (
        (linkNav === 'home' && currentSectionId === 'home') ||
        (linkNav === 'about' && currentSectionId === 'about') ||
        (linkNav === 'services' && currentSectionId === 'services') ||
        (linkNav === 'why' && currentSectionId === 'why-sixos') ||
        (linkNav === 'how' && currentSectionId === 'how-it-works') ||
        (linkNav === 'security' && currentSectionId === 'security') ||
        (linkNav === 'contact' && currentSectionId === 'contact')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ----------------------------------------------------
  // 2. MOBILE DRAWER TOGGLE
  // ----------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  const mobileLinks = document.querySelectorAll('.mobile-drawer a:not(.mobile-dropdown-trigger)');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Prevent default scroll when clicking a mobile dropdown trigger
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown-trigger');
  mobileDropdowns.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
    });
  });

  // Ensure clicking the desktop Services link always opens the menu
  const desktopDropdowns = document.querySelectorAll('.desktop-dropdown-trigger');
  desktopDropdowns.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const navItem = this.closest('.nav-item');
      if (navItem) navItem.classList.remove('menu-closing');
    });
  });

  // ----------------------------------------------------
  // 3. INTERACTIVE SERVICES DATA & SWITCHER
  // ----------------------------------------------------
  const servicesData = {
    'customer-support': {
      tag: '01 / Omnichannel Support',
      title: 'Customer Support',
      desc: 'Seamless frontline communication that resolves customer questions, turns inquiries into loyalty, and protects your brand reputation around the clock.',
      features: [
        'Email support ticket triage',
        'Real-time live chat assistance',
        'Customer inquiries resolution',
        'Order status & delivery questions',
        'Follow-ups & satisfaction checks',
        'Returns, exchanges & refund workflows'
      ],
      visualTitle: 'Customer Support Hub',
      visualSub: 'Multichannel resolution pipeline active',
      flowChips: ['Live Chat', 'Email Tickets', 'Order Issues', 'Customer Loyalty']
    },
    'call-center': {
      tag: '02 / Voice & Communication',
      title: 'Call Center Support',
      desc: 'Professional inbound and outbound voice operations with trained representatives who speak your brand language and represent your business with warmth.',
      features: [
        'Inbound client call resolution',
        'Outbound courtesy follow-ups',
        'Appointment booking & scheduling',
        'Customer inquiry intake',
        'Basic sales & qualification support',
        'Service escalation handling'
      ],
      visualTitle: 'Voice Operations Center',
      visualSub: 'High-clarity acoustic & queue management',
      flowChips: ['Inbound Calls', 'Outbound Outreach', 'Appointments', 'Warm Routing']
    },
    'ecommerce': {
      tag: '03 / Retail & Marketplace Ops',
      title: 'E-commerce Support',
      desc: 'Comprehensive store management ensuring orders flow smoothly from checkout through delivery, keeping customers informed and marketplace ratings high.',
      features: [
        'Order processing & validation',
        'Real-time tracking notifications',
        'Product questions & fit guidance',
        'Returns, exchanges & refunds',
        'Amazon / Shopify / eBay marketplace care',
        'Inventory status inquiries'
      ],
      visualTitle: 'E-Commerce Ops Matrix',
      visualSub: 'End-to-end fulfillment & customer care flow',
      flowChips: ['Order Processing', 'Order Tracking', 'Returns/Refunds', 'Store Integrations']
    },
    'virtual-assistant': {
      tag: '04 / Administrative & Operations',
      title: 'Virtual Assistance & Data Entry',
      desc: 'Meticulous back-office execution that removes administrative friction, keeps databases clean, and frees your leadership to focus on core revenue.',
      features: [
        'Daily administrative task handling',
        'Accurate structured data entry',
        'Spreadsheet reporting & modeling',
        'Web research & lead sourcing',
        'CRM record updates & maintenance',
        'Document formatting & processing',
        'Executive inbox & email administration'
      ],
      visualTitle: 'Operations Intelligence',
      visualSub: 'Structured data integrity & administrative hygiene',
      flowChips: ['Data Entry', 'CRM Hygiene', 'Spreadsheets', 'Admin Workflows']
    },
    'dedicated-teams': {
      tag: '05 / Custom Department Architecture',
      title: 'Dedicated Teams',
      desc: 'Tailor-built remote divisions designed exclusively around your specific operational blueprints, software stack, shift hours, and scalability requirements.',
      features: [
        'Custom built around client processes',
        'Workload & queue volume adaptation',
        'Time-zone aligned shift coverage',
        'Hand-picked verified skill sets',
        'Integrated management & team lead',
        'Continuous KPI monitoring & reporting'
      ],
      visualTitle: 'Custom Remote Unit',
      visualSub: 'Fully integrated operational extension of your company',
      flowChips: ['Process Aligned', 'Dedicated Lead', 'Custom SOPs', 'Scalable Scale']
    }
  };

  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const serviceBadge = document.getElementById('service-pane-badge');
  const serviceTitle = document.getElementById('service-pane-title');
  const serviceDesc = document.getElementById('service-pane-description');
  const serviceFeatures = document.getElementById('service-features-list');
  const visualTitle = document.getElementById('service-visual-title');
  const visualSub = document.getElementById('service-visual-sub');
  const visualChips = document.getElementById('service-visual-chips');
  const serviceCtaBtn = document.getElementById('service-cta-btn');

  function renderService(serviceId) {
    const data = servicesData[serviceId];
    if (!data) return;

    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-service') === serviceId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (serviceBadge) serviceBadge.textContent = data.tag;
    if (serviceTitle) serviceTitle.textContent = data.title;
    if (serviceDesc) serviceDesc.textContent = data.desc;

    if (serviceFeatures) {
      serviceFeatures.innerHTML = data.features.map(f => `
        <li class="feature-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    if (visualTitle) visualTitle.textContent = data.visualTitle;
    if (visualSub) visualSub.textContent = data.visualSub;

    if (visualChips) {
      visualChips.innerHTML = data.flowChips.map(c => `<span class="flow-chip">${c}</span>`).join('');
    }

    if (serviceCtaBtn) {
      serviceCtaBtn.textContent = `Request ${data.title} Team`;
      serviceCtaBtn.onclick = function(e) {
        e.preventDefault();
        selectServiceInWizard(data.title);
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      };
    }

    // Sync active state on 3D hero overlay badges
    const heroBadges = document.querySelectorAll('.node-badge');
    heroBadges.forEach(b => {
      if (b.getAttribute('data-service') === serviceId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    window.dispatchEvent(new CustomEvent('sixos:service-changed', { detail: { serviceId } }));
  }

  // 3D Hero Badges Click Handler
  const heroBadges = document.querySelectorAll('.node-badge');
  heroBadges.forEach(badge => {
    badge.addEventListener('click', function(e) {
      e.preventDefault();
      const serviceId = this.getAttribute('data-service');
      const choiceName = this.getAttribute('data-choice-name');
      if (serviceId) renderService(serviceId);
      if (choiceName) selectServiceInWizard(choiceName);
      const servicesSec = document.getElementById('services');
      if (servicesSec) {
        servicesSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const serviceId = this.getAttribute('data-service');
      renderService(serviceId);
      // Scroll directly to the service content pane instantly
      const pane = document.getElementById('service-pane-content');
      if (pane) {
        setTimeout(() => {
          pane.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  window.addEventListener('sixos:select-service', function(e) {
    const serviceId = e.detail.serviceId;
    renderService(serviceId);
    const servicesSec = document.getElementById('services');
    if (servicesSec) {
      servicesSec.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Mega Menu & Mobile Menu Service Links Click Handler
  const menuServiceLinks = document.querySelectorAll('.mega-menu-card, .mobile-services-list a[data-service]');
  menuServiceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const serviceId = this.getAttribute('data-service');
      if (serviceId) {
        renderService(serviceId);
        const data = servicesData[serviceId];
        if (data) selectServiceInWizard(data.title);
      }

      // Close desktop mega menu & lock it closed to prevent flash/reopening
      const navItem = this.closest('.nav-item');
      if (navItem) {
        navItem.classList.add('menu-closing');
        navItem.blur();
        const servicesNavLink = navItem.querySelector('.nav-link');
        if (servicesNavLink) servicesNavLink.blur();
        
        // Keep it locked closed until the user actively moves their mouse or scrolls!
        const unlockMenu = () => {
          navItem.classList.remove('menu-closing');
          document.removeEventListener('mousemove', unlockMenu);
          document.removeEventListener('scroll', unlockMenu);
        };
        
        // Wait 300ms before tracking movement, so the instant jump doesn't trigger it
        setTimeout(() => {
          document.addEventListener('mousemove', unlockMenu);
          document.addEventListener('scroll', unlockMenu);
        }, 300);
      }

      const servicesSec = document.getElementById('services');
      if (servicesSec) {
        const offset = 100; // Account for fixed navbar height
        const topPos = servicesSec.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: topPos, behavior: 'instant' });
      }

      // Close mobile drawer if it's a mobile link
      if (this.closest('.mobile-drawer')) {
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileBackdrop = document.getElementById('mobile-backdrop');
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ----------------------------------------------------
  // 4. INTERACTIVE MULTI-STEP CONSULTATION WIZARD
  // ----------------------------------------------------
  const wizardState = {
    step: 1,
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Customer Support',
    headcount: '1 Specialist',
    timeline: 'Within 1-2 Weeks',
    notes: ''
  };

  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const progressFill = document.getElementById('progress-track-fill');

  function updateWizardUI() {
    stepPanes.forEach(pane => {
      const paneStep = parseInt(pane.getAttribute('data-step'), 10);
      if (paneStep === wizardState.step) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    stepNodes.forEach(node => {
      const nodeStep = parseInt(node.getAttribute('data-step'), 10);
      if (nodeStep === wizardState.step) {
        node.classList.add('active');
        node.classList.remove('completed');
      } else if (nodeStep < wizardState.step) {
        node.classList.remove('active');
        node.classList.add('completed');
      } else {
        node.classList.remove('active');
        node.classList.remove('completed');
      }
    });

    if (progressFill) {
      const pct = ((wizardState.step - 1) / (stepNodes.length - 1)) * 100;
      progressFill.style.width = pct + '%';
    }

    // If step 4 (summary), populate review panel
    if (wizardState.step === 4) {
      document.getElementById('summary-name').textContent = wizardState.name || 'Not specified';
      document.getElementById('summary-company').textContent = wizardState.company || 'Not specified';
      document.getElementById('summary-email').textContent = wizardState.email || 'Not specified';
      const sumPhone = document.getElementById('summary-phone');
      if (sumPhone) sumPhone.textContent = wizardState.phone || 'Not specified';
      document.getElementById('summary-service').textContent = wizardState.service;
      document.getElementById('summary-headcount').textContent = wizardState.headcount;
      document.getElementById('summary-timeline').textContent = wizardState.timeline;
      document.getElementById('summary-notes').textContent = wizardState.notes || 'None provided';
    } else {
      const banner = document.getElementById('step4-success-banner');
      if (banner) banner.style.display = 'none';
    }
  }

  // Next / Back navigation triggers
  const toStep2Btn = document.getElementById('step-1-next');
  const toStep1Btn = document.getElementById('step-2-back');
  const toStep3Btn = document.getElementById('step-2-next');
  const toStep2BackBtn = document.getElementById('step-3-back');
  const toStep4Btn = document.getElementById('step-3-next');
  const toStep3BackBtn = document.getElementById('step-4-back');

  // Step 1 Validation
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', function() {
      const nameInput = document.getElementById('wizard-name');
      const emailInput = document.getElementById('wizard-email');
      const compInput = document.getElementById('wizard-company');

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();

      if (!nameVal) {
        alert('Please provide your Full Name to proceed.');
        nameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        alert('Please provide a valid business email address.');
        emailInput.focus();
        return;
      }

      wizardState.name = nameVal;
      wizardState.email = emailVal;
      const phoneInput = document.getElementById('wizard-whatsapp');
      const phoneCodeEl = document.getElementById('phone-selected-code');
      const phoneCountryCode = phoneCodeEl ? phoneCodeEl.textContent.trim() : '';
      if (phoneInput) wizardState.phone = phoneInput.value.trim() ? (phoneCountryCode + ' ' + phoneInput.value.trim()) : '';
      wizardState.company = compInput.value.trim();

      wizardState.step = 2;
      updateWizardUI();
    });
  }

  if (toStep1Btn) {
    toStep1Btn.addEventListener('click', function() {
      wizardState.step = 1;
      updateWizardUI();
    });
  }

  // Step 2: Service Selection Cards
  const serviceCards = document.querySelectorAll('.service-choice-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      serviceCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      wizardState.service = this.getAttribute('data-choice-name');
    });
  });

  // Step 2: Headcount quick pills & custom input
  const headcountPills = document.querySelectorAll('.headcount-pill');
  const customHeadcountInput = document.getElementById('custom-headcount-input');

  headcountPills.forEach(pill => {
    pill.addEventListener('click', function() {
      headcountPills.forEach(p => p.classList.remove('selected'));
      this.classList.add('selected');
      if (customHeadcountInput) customHeadcountInput.value = '';
      wizardState.headcount = this.getAttribute('data-count');
    });
  });

  if (customHeadcountInput) {
    customHeadcountInput.addEventListener('input', function() {
      if (this.value) {
        headcountPills.forEach(p => p.classList.remove('selected'));
        wizardState.headcount = this.value.trim() + ' Specialists (Custom)';
      }
    });
  }

  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', function() {
      wizardState.step = 3;
      updateWizardUI();
    });
  }

  if (toStep2BackBtn) {
    toStep2BackBtn.addEventListener('click', function() {
      wizardState.step = 2;
      updateWizardUI();
    });
  }

  // Step 3: Timeline pills
  const timelineChoices = document.querySelectorAll('.timeline-pill-choice');
  timelineChoices.forEach(choice => {
    choice.addEventListener('click', function() {
      timelineChoices.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      wizardState.timeline = this.getAttribute('data-time');
    });
  });

  if (toStep4Btn) {
    toStep4Btn.addEventListener('click', function() {
      const notesEl = document.getElementById('wizard-notes');
      if (notesEl) wizardState.notes = notesEl.value.trim();
      wizardState.step = 4;
      updateWizardUI();
    });
  }

  if (toStep3BackBtn) {
    toStep3BackBtn.addEventListener('click', function() {
      wizardState.step = 3;
      updateWizardUI();
    });
  }

  // Helper to pre-select a service in the wizard
  function selectServiceInWizard(serviceName) {
    serviceCards.forEach(card => {
      const name = card.getAttribute('data-choice-name');
      if (name.toLowerCase() === serviceName.toLowerCase()) {
        serviceCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        wizardState.service = name;
      }
    });
  }

  // ----------------------------------------------------
  // 5. ETHIOPIA WHATSAPP ORDER DISPATCHER & CALL BOOKING
  // Send formatted order respectively to +251921647287
  // ----------------------------------------------------
  const sendWhatsAppBtn = document.getElementById('send-order-whatsapp-btn');
  const sendEmailBackupBtn = document.getElementById('send-order-email-btn');

  function generateStructuredOrderText() {
    return [
      'ðŸŒŸ *SIXOS â€” Team Consultation & Order Request* ðŸŒŸ',
      'â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€',
      `ðŸ‘¤ *Client Name:* ${wizardState.name || 'Not provided'}`,
      `ðŸ¢ *Company:* ${wizardState.company || 'Not provided'}`,
      `ðŸ“§ *Work Email:* ${wizardState.email || 'Not provided'}`,
      `ðŸ“± *WhatsApp / Phone:* ${wizardState.phone || 'Not provided'}`,
      `ðŸ› ï¸ *Service Needed:* ${wizardState.service}`,
      `ðŸ‘¥ *Team Size / Headcount:* ${wizardState.headcount}`,
      `â±ï¸ *Deployment Timeline:* ${wizardState.timeline}`,
      `ðŸ“ *Additional Notes:* ${wizardState.notes || 'None provided'}`,
      'â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€',
      'ðŸš€ *Requested Action:* Book a consultation call & confirm team availability.',
      'Sent via SIXOS Platform'
    ].join('\n');
  }

  const successBanner = document.getElementById('step4-success-banner');
  const successText = document.getElementById('success-banner-text');
  const resetWizardBtn = document.getElementById('reset-wizard-btn');

  function showDispatchSuccess(channelName) {
    if (successBanner) {
      if (successText) {
        const clientName = wizardState.name ? ` ${wizardState.name}` : '';
        successText.textContent = `Thank you${clientName}! Your consultation request for ${wizardState.service} has been dispatched via ${channelName}. Our operations team at SIXOS will review your parameters and contact you shortly.`;
      }
      successBanner.style.display = 'flex';
      setTimeout(() => {
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const message = generateStructuredOrderText();
      const encodedMsg = encodeURIComponent(message);
      // Ethiopia WhatsApp Number: +251921647287
      const whatsappUrl = `https://wa.me/251921647287?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      showDispatchSuccess('WhatsApp');
    });
  }

  if (sendEmailBackupBtn) {
    sendEmailBackupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const subject = encodeURIComponent(`SIXOS Consultation Order: ${wizardState.service} - ${wizardState.company || wizardState.name}`);
      const body = encodeURIComponent(generateStructuredOrderText().replace(/\*/g, ''));
      const mailtoUrl = `mailto:hello@sixoss.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
      showDispatchSuccess('Email');
    });
  }

  if (resetWizardBtn) {
    resetWizardBtn.addEventListener('click', function() {
      location.reload();
    });
  }

  // Phone number input validation
  const phoneInputBox = document.getElementById('wizard-whatsapp');
  if (phoneInputBox) {
    phoneInputBox.addEventListener('input', function() {
      this.value = this.value.replace(/[^\d\s\-\+\(\)]/g, '');
    });
  }

})();

// ============================================================
// PHONE COUNTRY CODE SELECTOR (TOP-OF-SCREEN MODAL)
// - Click list icon / country button to open modal from top of screen
// - Displays all countries with small flags, names, and dial codes
// - Live search by typing country name or dial code
// - Auto-sets country code + flag on selection and focuses phone input
// - Escape key / Close button / backdrop click to close
// ============================================================
(function () {
  'use strict';

  function getEls() {
    return {
      btn: document.getElementById('phone-country-btn'),
      overlay: document.getElementById('cp-overlay'),
      modal: document.getElementById('cp-modal'),
      closeBtn: document.getElementById('cp-close-btn'),
      search: document.getElementById('cp-search'),
      searchClear: document.getElementById('cp-search-clear'),
      noResult: document.getElementById('cp-no-result'),
      selFlag: document.getElementById('phone-selected-flag'),
      selCode: document.getElementById('phone-selected-code'),
      phoneInput: document.getElementById('wizard-whatsapp'),
      items: Array.prototype.slice.call(document.querySelectorAll('.cp-item'))
    };
  }

  function openPicker() {
    var els = getEls();
    if (!els.overlay || !els.modal) return;

    els.overlay.classList.add('active');
    els.modal.classList.add('active');
    els.overlay.setAttribute('aria-hidden', 'false');
    els.modal.setAttribute('aria-hidden', 'false');
    if (els.btn) els.btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    if (els.search) {
      els.search.value = '';
      if (els.searchClear) els.searchClear.style.display = 'none';
      filterCountries('');
      setTimeout(function () {
        els.search.focus();
      }, 100);
    }
  }

  function closePicker() {
    var els = getEls();
    if (els.overlay) {
      els.overlay.classList.remove('active');
      els.overlay.setAttribute('aria-hidden', 'true');
    }
    if (els.modal) {
      els.modal.classList.remove('active');
      els.modal.setAttribute('aria-hidden', 'true');
    }
    if (els.btn) els.btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function filterCountries(query) {
    var els = getEls();
    var q = (query || '').trim().toLowerCase();
    var matchCount = 0;

    els.items.forEach(function (item) {
      var name = (item.getAttribute('data-name') || '').toLowerCase();
      var code = (item.getAttribute('data-code') || '').toLowerCase();
      var matches = !q || name.indexOf(q) !== -1 || code.indexOf(q) !== -1;
      item.style.display = matches ? 'flex' : 'none';
      if (matches) matchCount++;
    });

    if (els.noResult) {
      els.noResult.style.display = matchCount === 0 ? 'block' : 'none';
      if (matchCount === 0) {
        els.noResult.textContent = 'No country found matching "' + query + '"';
      }
    }
  }

  function selectCountry(item) {
    var els = getEls();
    var code = item.getAttribute('data-code') || '';
    var iso = item.getAttribute('data-iso') || '';
    var flagImg = item.querySelector('img.cp-flag-img');

    if (els.selFlag) {
      if (flagImg) {
        els.selFlag.innerHTML = '<img src="' + flagImg.getAttribute('src') + '" alt="" class="phone-flag-img">';
      } else if (iso) {
        els.selFlag.innerHTML = '<img src="assets/flags/' + iso + '.png" alt="" class="phone-flag-img">';
      }
    }
    if (els.selCode) els.selCode.textContent = code;

    els.items.forEach(function (it) { it.classList.remove('selected'); });
    item.classList.add('selected');

    closePicker();

    if (els.phoneInput) {
      setTimeout(function () {
        els.phoneInput.focus();
      }, 120);
    }
  }

  // GLOBAL DOCUMENT EVENT DELEGATION
  // This guarantees clicks on the list button / flag / chevron ALWAYS trigger openPicker
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('#phone-country-btn, .phone-country-btn');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      openPicker();
      return;
    }

    if (e.target.closest('#cp-close-btn')) {
      e.preventDefault();
      e.stopPropagation();
      closePicker();
      return;
    }

    if (e.target.id === 'cp-overlay') {
      e.preventDefault();
      e.stopPropagation();
      closePicker();
      return;
    }

    var item = e.target.closest('.cp-item');
    if (item) {
      e.preventDefault();
      e.stopPropagation();
      selectCountry(item);
      return;
    }

    if (e.target.closest('#cp-search-clear')) {
      e.preventDefault();
      e.stopPropagation();
      var els = getEls();
      if (els.search) {
        els.search.value = '';
        els.search.focus();
      }
      e.target.closest('#cp-search-clear').style.display = 'none';
      filterCountries('');
      return;
    }
  });

  // Search input typing filter
  document.addEventListener('input', function (e) {
    if (e.target.id === 'cp-search') {
      var val = e.target.value;
      var clearBtn = document.getElementById('cp-search-clear');
      if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
      filterCountries(val);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    var els = getEls();
    if (e.key === 'Escape' && els.modal && els.modal.classList.contains('active')) {
      closePicker();
      return;
    }

    if (e.key === 'Enter' && e.target.id === 'cp-search') {
      e.preventDefault();
      var firstVisible = els.items.filter(function (it) {
        return it.style.display !== 'none';
      })[0];
      if (firstVisible) selectCountry(firstVisible);
    }
  });

  // Mobile nav drawer resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080) {
      var drawer   = document.getElementById('mobile-drawer');
      var backdrop = document.getElementById('mobile-backdrop');
      if (drawer)   drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }, { passive: true });

  console.log('[SIXOS] Country picker loaded successfully.');
}());