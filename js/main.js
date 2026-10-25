/**
 * XCLUSIVE DENT - MODERN FRONTEND CONTROLLER
 * Zero backend required. 100% Client-side interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmileSlider();
  initSedesScheduleStatus();
  initAppointmentWizard();
  initSmileQuiz();
  initServicesFilter();
  initFaqAccordion();
  initStatCounters();
  initTreatmentsToggle();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  // Sticky navbar with background shift
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-4-line"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="ri-menu-4-line"></i>';
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE BEFORE & AFTER SMILE SLIDER
   ========================================================================== */
function initSmileSlider() {
  const rangeInput = document.getElementById('smileRange');
  const beforeImg = document.getElementById('sliderBeforeImg');
  const handleLine = document.getElementById('sliderHandleLine');

  if (!rangeInput || !beforeImg || !handleLine) return;

  function updateSlider(val) {
    const percentage = Math.max(0, Math.min(100, val));
    beforeImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handleLine.style.left = `${percentage}%`;
  }

  rangeInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Touch & drag smooth support
  updateSlider(50);
}

/* ==========================================================================
   3. LIVE CLINIC HOURS & STATUS (SEDES HUÁNUCO)
   Timezone: America/Lima (UTC-5)
   Sede Bolívar: Mon-Sat: 8:30am - 1:30pm & 3:30pm - 8:30pm. Sun: Closed.
   Sede Amarilis: Mon-Sat: 3:30pm - 8:30pm. Sun: Closed.
   ========================================================================== */
function initSedesScheduleStatus() {
  const bolivarStatusEl = document.getElementById('statusBolivar');
  const amarilisStatusEl = document.getElementById('statusAmarilis');

  function checkClinicStatus() {
    // Current time in Peru (UTC-5)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const peruTime = new Date(utc - (5 * 3600000));
    
    const day = peruTime.getDay(); // 0 is Sunday, 1-6 Mon-Sat
    const hour = peruTime.getHours();
    const minute = peruTime.getMinutes();
    const currentTimeInMinutes = (hour * 60) + minute;

    // Check Bolívar
    let bolivarOpen = false;
    let amarilisOpen = false;

    if (day >= 1 && day <= 6) {
      // 8:30 am (510 min) to 1:30 pm (810 min) OR 3:30 pm (930 min) to 8:30 pm (1230 min)
      if ((currentTimeInMinutes >= 510 && currentTimeInMinutes < 810) || 
          (currentTimeInMinutes >= 930 && currentTimeInMinutes < 1230)) {
        bolivarOpen = true;
      }
      
      // Amarilis: 3:30 pm (930 min) to 8:30 pm (1230 min)
      if (currentTimeInMinutes >= 930 && currentTimeInMinutes < 1230) {
        amarilisOpen = true;
      }
    }

    if (bolivarStatusEl) {
      if (bolivarOpen) {
        bolivarStatusEl.className = 'sede-card__status status--open';
        bolivarStatusEl.innerHTML = '<span class="status-indicator"></span> Abierto Ahora • Atendiendo';
      } else {
        bolivarStatusEl.className = 'sede-card__status status--closed';
        bolivarStatusEl.innerHTML = '<span class="status-indicator"></span> Cerrado • Abre 8:30 AM';
      }
    }

    if (amarilisStatusEl) {
      if (amarilisOpen) {
        amarilisStatusEl.className = 'sede-card__status status--open';
        amarilisStatusEl.innerHTML = '<span class="status-indicator"></span> Abierto Ahora • Atendiendo';
      } else {
        amarilisStatusEl.className = 'sede-card__status status--closed';
        amarilisStatusEl.innerHTML = '<span class="status-indicator"></span> Cerrado • Abre 3:30 PM';
      }
    }
  }

  checkClinicStatus();
  setInterval(checkClinicStatus, 60000);
}

/* ==========================================================================
   4. APPOINTMENT WIZARD (WHATSAPP FUNNEL)
   ========================================================================== */
function initAppointmentWizard() {
  // Sede numbers in Huánuco
  const phoneNumbers = {
    bolivar: '51942538705',
    amarilis: '51926252914'
  };

  const forms = [document.getElementById('heroQuickForm'), document.getElementById('modalAppointmentForm')];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const sede = form.querySelector('[name="sede"]')?.value || 'bolivar';
      const tratamiento = form.querySelector('[name="tratamiento"]')?.value || 'Evaluación General';
      const fecha = form.querySelector('[name="fecha"]')?.value || 'Lo antes posible';
      const nombre = form.querySelector('[name="nombre"]')?.value || 'Paciente interesado';

      const targetPhone = phoneNumbers[sede] || phoneNumbers.bolivar;
      const sedeName = sede === 'amarilis' ? 'Sede Amarilis (Óvalo Esteban Pavletich)' : 'Sede Bolívar (Jr. Bolívar 191)';

      const message = `👋 ¡Hola Xclusive Dent! Deseo agendar una cita.%0A%0A` +
        `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
        `📍 *Sede de preferencia:* ${encodeURIComponent(sedeName)}%0A` +
        `🦷 *Tratamiento / Consulta:* ${encodeURIComponent(tratamiento)}%0A` +
        `🗓️ *Fecha / Horario sugerido:* ${encodeURIComponent(fecha)}%0A%0A` +
        `¿Tienen disponibilidad para esta fecha? Muchas gracias.`;

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      // Close modal if open
      closeModal();
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE SMILE DIAGNOSTIC QUIZ (TEST DE SONRISA)
   ========================================================================== */
function initSmileQuiz() {
  const steps = document.querySelectorAll('.quiz-step');
  const progressBar = document.getElementById('quizProgressBar');
  const stepNumber = document.getElementById('quizStepNumber');
  const options = document.querySelectorAll('.quiz-option');
  const btnNext = document.getElementById('quizBtnNext');
  const btnPrev = document.getElementById('quizBtnPrev');
  const resultTreatment = document.getElementById('quizResultTreatment');
  const resultDesc = document.getElementById('quizResultDesc');
  const btnClaim = document.getElementById('quizBtnClaim');

  if (!steps.length || !progressBar) return;

  let currentStep = 1;
  const userAnswers = {
    concern: '',
    duration: '',
    sede: 'bolivar'
  };

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const stepEl = opt.closest('.quiz-step');
      const stepOptions = stepEl.querySelectorAll('.quiz-option');
      stepOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      const key = opt.dataset.key;
      const value = opt.dataset.val;
      userAnswers[key] = value;

      if (btnNext) btnNext.disabled = false;
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < 3) {
        currentStep++;
        updateQuizStep();
      } else if (currentStep === 3) {
        showQuizResults();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateQuizStep();
      }
    });
  }

  function updateQuizStep() {
    steps.forEach((st, idx) => {
      st.classList.toggle('active', idx + 1 === currentStep);
    });

    progressBar.style.width = `${(currentStep / 3) * 100}%`;
    if (stepNumber) stepNumber.textContent = `${currentStep}/3`;

    if (btnPrev) btnPrev.style.display = currentStep > 1 ? 'inline-flex' : 'none';

    // Verify if this step has a selected option
    const activeStep = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    const hasSelected = activeStep && activeStep.querySelector('.quiz-option.selected');
    if (btnNext) {
      btnNext.disabled = !hasSelected;
      btnNext.textContent = currentStep === 3 ? 'Ver Mi Diagnóstico 🎯' : 'Siguiente Pregunta →';
    }
  }

  function showQuizResults() {
    document.getElementById('quizQuestionsArea').style.display = 'none';
    const resultArea = document.getElementById('quizResultArea');
    resultArea.style.display = 'block';

    let recommended = 'Ortodoncia Avanzada & Estética';
    let description = 'Tu sonrisa califica para una alineación dental de alta precisión con tecnología digital Xclusive. Corrige la mordida y luce dientes perfectamente alineados.';

    let concernLabel = 'Alineación Dental';
    if (userAnswers.concern === 'manchas') {
      recommended = 'Diseño de Sonrisa & Blanqueamiento LED';
      description = 'Para manchas o tono dental amarillento, recomendamos una profilaxis profunda con blanqueamiento dental de última generación en 1 sola sesión.';
      concernLabel = 'Dientes amarillos / Manchas';
    } else if (userAnswers.concern === 'perdida') {
      recommended = 'Implantología Oral & Rehabilitación Dental';
      description = 'Recupera la masticación y la estética natural de tu dentadura con implantes dentales osteointegrados con estándar brasileño.';
      concernLabel = 'Falta de diente o muela';
    }

    if (resultTreatment) resultTreatment.textContent = recommended;
    if (resultDesc) resultDesc.textContent = description;

    if (btnClaim) {
      btnClaim.addEventListener('click', () => {
        const targetPhone = userAnswers.sede === 'amarilis' ? '51926252914' : '51942538705';
        const sedeName = userAnswers.sede === 'amarilis' 
          ? 'Sede Amarilis (Av. Esteban Pavletich)' 
          : 'Sede Jr. Bolívar (Centro de Huánuco)';

        const message = `👋 ¡Hola Xclusive Dent! Hice el Test de Sonrisa en su web y mi resultado fue:%0A%0A` +
          `🎯 *Tratamiento Sugerido:* ${encodeURIComponent(recommended)}%0A` +
          `🔍 *Motivo principal:* ${encodeURIComponent(concernLabel)}%0A` +
          `📍 *Sede elegida:* ${encodeURIComponent(sedeName)}%0A%0A` +
          `Deseo agendar una cita de evaluación para este tratamiento. ¿Qué días tienen disponibilidad?`;

        window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
      });
    }
  }
}

/* ==========================================================================
   6. SERVICES FILTER & MODAL DETAIL
   ========================================================================== */
function initServicesFilter() {
  const tabs = document.querySelectorAll('.services-tab');
  const cards = document.querySelectorAll('.service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close others
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   8. STAT COUNTERS ON SCROLL
   ========================================================================== */
function initStatCounters() {
  const stats = document.querySelectorAll('.counter-val');
  let started = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = `+${target.toLocaleString()}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `+${Math.floor(current).toLocaleString()}${suffix}`;
      }
    }, stepTime);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        stats.forEach(st => countUp(st));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   MODAL UTILITIES (GLOBAL)
   ========================================================================== */
window.openModal = function(modalId = 'appointmentModal') {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
};

// Close on backdrop click or ESC key
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

window.handleContactPageBooking = function(e) {
  e.preventDefault();
  const name = document.getElementById('contact_name')?.value || '';
  const phone = document.getElementById('contact_phone')?.value || '';
  const branch = document.getElementById('contact_branch')?.value || 'Sede Bolívar';
  const service = document.getElementById('contact_service')?.value || 'Evaluación General';
  const notes = document.getElementById('contact_notes')?.value || '';

  const targetPhone = branch.includes('Amarilis') ? '51926252914' : '51942538705';

  const message = `👋 ¡Hola Xclusive Dent! Deseo agendar una cita.%0A%0A` +
    `👤 *Nombre:* ${encodeURIComponent(name)}%0A` +
    `📱 *Teléfono:* ${encodeURIComponent(phone)}%0A` +
    `📍 *Sede:* ${encodeURIComponent(branch)}%0A` +
    `🦷 *Tratamiento:* ${encodeURIComponent(service)}%0A` +
    (notes ? `📝 *Consulta adicional:* ${encodeURIComponent(notes)}%0A%0A` : `%0A`) +
    `¿Tienen disponibilidad para esta semana? Muchas gracias.`;

  window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
};

/* ==========================================================================
   TREATMENTS TOGGLE (VER MÁS / VER MENOS)
   ========================================================================== */
function initTreatmentsToggle() {
  const btnToggle = document.getElementById('btnToggleTreatments');
  const btnText = document.getElementById('btnToggleTreatmentsText');
  const btnIcon = document.getElementById('btnToggleTreatmentsIcon');
  const extraCards = document.querySelectorAll('.service-card--extra');

  if (!btnToggle || extraCards.length === 0) return;

  btnToggle.addEventListener('click', () => {
    const isExpanded = btnToggle.getAttribute('aria-expanded') === 'true';

    extraCards.forEach(card => {
      if (!isExpanded) {
        card.classList.add('is-visible');
      } else {
        card.classList.remove('is-visible');
      }
    });

    if (!isExpanded) {
      btnToggle.setAttribute('aria-expanded', 'true');
      if (btnText) btnText.textContent = 'Ver Menos';
      if (btnIcon) btnIcon.className = 'ri-arrow-up-s-line';
    } else {
      btnToggle.setAttribute('aria-expanded', 'false');
      if (btnText) btnText.textContent = 'Ver Más Tratamientos';
      if (btnIcon) btnIcon.className = 'ri-arrow-down-s-line';

      const treatmentsSection = document.getElementById('tratamientos');
      if (treatmentsSection) {
        treatmentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}


