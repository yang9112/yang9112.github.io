/**
 * Preloader Module - Resource preloading and performance optimization
 * Handles critical resource preloading and caching strategies
 */
(function($) {
  'use strict';
  
  const preloader = {
    config: {
      criticalCSS: ['css/style.min.css'],
      criticalJS: ['js/modules/gallery.js', 'js/modules/scrollToTop.js'],
      imageTypes: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
      preloadImages: true
    },

    // Initialize preloader
    init: function() {
      this.preloadCriticalResources();
      this.setupIntersectionObserver();
      this.createServiceWorker();
    },

    // Preload critical CSS and JS
    preloadCriticalResources: function() {
      const config = this.config;
      
      // Preload CSS
      config.criticalCSS.forEach(function(cssFile) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = cssFile;
        document.head.appendChild(link);
      });

      // Preload JS
      config.criticalJS.forEach(function(jsFile) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = jsFile;
        document.head.appendChild(link);
      });
    },

    // Setup Intersection Observer for lazy loading
    setupIntersectionObserver: function() {
      if (!('IntersectionObserver' in window)) {
        return;
      }

      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load image if data-src is present
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe images with data-src
      document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
      });
    },

    // Create basic Service Worker for offline caching
    createServiceWorker: function() {
      const swCode = `
const CACHE_NAME = 'blog-cache-v1';
const urlsToCache = [
  '/',
  '/dist/index.html',
  '/dist/css/style.min.css',
  '/dist/js/bundle.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
      `;

      // Create service worker file
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(swUrl)
          .then(function(registration) {
            console.log('ServiceWorker registration successful');
          })
          .catch(function(error) {
            console.log('ServiceWorker registration failed:', error);
          });
      }
    },

    // Prefetch resources for better performance
    prefetchResources: function() {
      // Prefetch next page images
      $('a[href*=".jpg"], a[href*=".png"], a[href*=".jpeg"]').each(function() {
        const $link = $(this);
        const href = $link.attr('href');
        
        if (href && !href.startsWith('http')) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        }
      });
    }
  };

  // Export for use in other modules
  window.PreloaderModule = preloader;
  
})(jQuery);