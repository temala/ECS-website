/* ===================================
   ECS75 - Main JavaScript
   =================================== */

// Azure Function API endpoint — update this after deploying
const API_URL = '/api/send-email';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initForms();
    initTrackingForm();
});

/* --- Header Scroll Effect --- */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        toggle.classList.add('active');
        nav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        nav.classList.contains('active') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach(el => observer.observe(el));
}

/* --- Form Handling --- */
function initForms() {
    const contactForm = document.getElementById('contact-form');
    const quoteForm = document.getElementById('quote-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
    }

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => handleFormSubmit(e, 'quote'));
    }
}

async function handleFormSubmit(e, formType) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    const formData = new FormData(form);
    const payload = { formType };
    for (const [key, value] of formData.entries()) {
        payload[key] = value;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showFormSuccess(form);
            form.reset();
        } else {
            showFormError(form, result.error || "Une erreur est survenue. Veuillez réessayer.");
        }
    } catch (error) {
        showFormError(form, "Impossible de joindre le serveur. Veuillez nous contacter par téléphone au 01 70 03 60 00.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function showFormSuccess(form) {
    const wrapper = form.parentElement;
    const existing = wrapper.querySelector('.form-success, .form-error');
    if (existing) existing.remove();

    const success = document.createElement('div');
    success.className = 'form-success show';
    success.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Message envoyé avec succès</h3>
        <p>Votre message a été transmis à notre équipe. Nous vous répondrons dans les plus brefs délais.</p>
    `;

    form.style.display = 'none';
    wrapper.appendChild(success);

    setTimeout(() => {
        form.style.display = '';
        success.remove();
    }, 6000);
}

function showFormError(form, message) {
    const wrapper = form.parentElement;
    const existing = wrapper.querySelector('.form-error');
    if (existing) existing.remove();

    const error = document.createElement('div');
    error.className = 'form-error show';
    error.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
    `;

    form.insertAdjacentElement('beforebegin', error);

    setTimeout(() => {
        error.remove();
    }, 8000);
}

/* --- Tracking Form --- */
function initTrackingForm() {
    const form = document.getElementById('tracking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const trackingNumber = document.getElementById('tracking-number').value.trim();
        if (trackingNumber) {
            window.open('http://149.202.68.114:8083/home/Track#!?colisId=' + encodeURIComponent(trackingNumber), '_blank');
        }
    });
}

/* --- Smooth Scroll for Anchor Links --- */
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    }
});
