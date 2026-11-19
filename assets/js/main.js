(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');
  const navigationLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation' : 'Open navigation'
      );
    });

    navigationLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const sections = document.querySelectorAll('main section[id]');
  const setActiveLink = (sectionId) => {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('active', isActive);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleSections.length) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const submitButton = contactForm.querySelector('[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      const formData = new FormData(contactForm);

      formStatus.textContent = 'Sending your message…';
      formStatus.classList.remove('is-error', 'is-success');
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.textContent = 'Sending…';

      try {
        const response = await fetch(contactForm.dataset.endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'The message could not be sent.');
        }

        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.classList.add('is-success');
        contactForm.reset();
      } catch (error) {
        formStatus.textContent =
          'Sorry, your message could not be sent. Please try again in a moment.';
        formStatus.classList.add('is-error');
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.innerHTML = originalButtonText;
      }
    });
  }
})();
