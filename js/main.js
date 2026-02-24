/* Mukwano Coffee - main.js */
(function () {
  'use strict';

  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navBackdrop = document.getElementById('nav-backdrop');
  var body = document.body;

  function openNav() {
    if (navMenu) { navMenu.classList.remove('nav-closed'); navMenu.classList.add('nav-open'); }
    if (navBackdrop) navBackdrop.classList.remove('hidden');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (navMenu) { navMenu.classList.remove('nav-open'); navMenu.classList.add('nav-closed'); }
    if (navBackdrop) navBackdrop.classList.add('hidden');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', function () {
    if (navToggle.getAttribute('aria-expanded') === 'true') closeNav();
    else openNav();
  });
  if (navBackdrop) navBackdrop.addEventListener('click', closeNav);

  var navLinks = document.querySelectorAll('#nav-menu a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 768) closeNav();
    });
  });

  /* Scroll-triggered animations */
  var animated = document.querySelectorAll('.animate-on-scroll');
  if (animated.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    animated.forEach(function (el) { observer.observe(el); });
  }

  /* Instagram: embed via oEmbed. Use manual post URL first if set (works on localhost); else try API. */
  var instagramContainer = document.getElementById('instagram-embed-container');
  var instagramFallback = document.getElementById('instagram-fallback');
  var instagramSection = document.getElementById('instagram-section');
  if (instagramContainer) {
    var apiUrl = (typeof window.MUKWANO_INSTAGRAM_API === 'string' && window.MUKWANO_INSTAGRAM_API)
      ? window.MUKWANO_INSTAGRAM_API
      : '/api/instagram-latest';
    var manualPostUrl = instagramSection && instagramSection.getAttribute('data-instagram-post');
    var manualUrlTrimmed = manualPostUrl && manualPostUrl.trim();
    var hasManual = manualUrlTrimmed && manualUrlTrimmed.indexOf('instagram.com/p/') !== -1;

    function showFallback() {
      instagramContainer.innerHTML = '';
      if (instagramFallback) instagramFallback.classList.remove('hidden');
    }

    function embedPost(postUrl) {
      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () {
          reject(new Error('timeout'));
        }, 12000);
        var callbackName = 'instEmbedCallback_' + Date.now();
        window[callbackName] = function (oembed) {
          clearTimeout(timeout);
          if (oembed && oembed.html) {
            instagramContainer.innerHTML = '<div class="flex justify-center">' + oembed.html + '</div>';
            if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
              var ig = document.createElement('script');
              ig.async = true;
              ig.src = 'https://www.instagram.com/embed.js';
              document.body.appendChild(ig);
            }
            resolve();
          } else reject();
        };
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://api.instagram.com/oembed?url=' + encodeURIComponent(postUrl) + '&omitscript=true&maxwidth=540&callback=' + callbackName;
        script.onerror = function () { clearTimeout(timeout); reject(new Error('script error')); };
        document.head.appendChild(script);
      });
    }

    function tryEmbed(url) {
      embedPost(url).catch(showFallback);
    }

    if (hasManual) {
      tryEmbed(manualUrlTrimmed);
    } else {
      fetch(apiUrl)
        .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
        .then(function (data) { return data && data.url ? data.url : Promise.reject(); })
        .then(tryEmbed)
        .catch(showFallback);
    }
  }
})();
