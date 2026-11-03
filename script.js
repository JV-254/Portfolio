/**
 * George Njau Wanjiku - Portfolio Interactive Scripts
 * Pure Vanilla JavaScript (No Frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Mobile Hamburger Navigation
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navToggle.classList.remove('open');
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // 2. Sticky Navbar Styling on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Active Link Highlighting on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNavigation);

  // 4. Project Filtering by Category
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. Scroll-Triggered Reveal Animations
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.skill-category-card, .project-card, .service-card, .timeline-step, .about-text-content, .analytical-approach-card');

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 6. Back-To-Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. Dynamic Copyright Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

 // 8. Contact Form Client-Side Validation & Web3Forms AJAX Submission
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(input, condition, errorId) {
    const errorEl = document.getElementById(errorId);
    if (!condition) {
      input.classList.add('is-invalid');
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2, 'nameError');
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'emailError');
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3, 'subjectError');
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 15, 'messageError');

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Disable button & show loader state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: json
          });

          const result = await response.json();

          formStatus.style.display = 'block';

          if (response.status === 200 && result.success) {
            formStatus.className = 'form-status';
            formStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
            formStatus.style.color = '#10b981';
            formStatus.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            formStatus.innerHTML = '<strong><i class="fa-solid fa-circle-check"></i> Message Sent!</strong> Thank you for reaching out. I will get back to you shortly.';
            contactForm.reset();
          } else {
            formStatus.className = 'form-status';
            formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            formStatus.style.color = '#ef4444';
            formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            formStatus.innerHTML = `<strong>Error:</strong> ${result.message || 'Something went wrong. Please check your access key or try again.'}`;
          }
        } catch (error) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status';
          formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
          formStatus.style.color = '#ef4444';
          formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
          formStatus.innerHTML = '<strong>Network Error:</strong> Unable to reach email server. Please check your connection or use direct email.';
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
      }
    });

    // Real-time error removal when user types
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
          const err = document.getElementById(`${input.id}Error`);
          if (err) err.classList.remove('visible');
        });
      }
    });
  }
});