const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
let hideTimer;

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (siteHeader) {
  const showHeader = () => {
    siteHeader.classList.remove('is-hidden');
    siteHeader.classList.add('is-visible');
  };

  const hideHeader = () => {
    if (window.scrollY > 8) {
      siteHeader.classList.remove('is-visible');
      siteHeader.classList.add('is-hidden');
    }
  };

  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      hideHeader();
    }, 220);
  };

  showHeader();

  window.addEventListener('scroll', () => {
    showHeader();

    if (window.scrollY > 8) {
      scheduleHide();
    }
  }, { passive: true });

  window.addEventListener('wheel', () => {
    showHeader();
  }, { passive: true });

  window.addEventListener('touchmove', () => {
    showHeader();
  }, { passive: true });

  document.addEventListener('mousemove', (event) => {
    if (event.clientY <= 100) {
      showHeader();
    }
  });

  siteHeader.addEventListener('mouseenter', showHeader);
  siteHeader.addEventListener('mouseleave', () => {
    if (window.scrollY > 8) {
      scheduleHide();
    }
  });
}

