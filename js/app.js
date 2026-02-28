/**
 * Main Application Entry Point
 * Coordinates loading and initialization of all modules
 */
(function($) {
  'use strict';

  // Application configuration
  const App = {
    config: {
      debug: false,
      modules: [
        'ResponsiveModule',
        'GalleryModule', 
        'ScrollToTopModule',
        'PreloaderModule'
      ]
    },

    // Initialize application
    init: function() {
      this.log('Initializing application...');
      
      // Wait for DOM to be ready
      $(document).ready(function() {
        App.loadModules();
        App.setupEventListeners();
        App.optimizePerformance();
      });
    },

    // Load and initialize modules
    loadModules: function() {
      this.config.modules.forEach(function(moduleName) {
        if (window[moduleName] && typeof window[moduleName].init === 'function') {
          try {
            window[moduleName].init();
            this.log('Module initialized:', moduleName);
          } catch (error) {
            this.log('Error initializing module:', moduleName, error);
          }
        } else {
          this.log('Module not found:', moduleName);
        }
      }.bind(this));
    },

    // Setup global event listeners
    setupEventListeners: function() {
      // Performance monitoring
      if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
          const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
          this.log('Page load time:', loadTime + 'ms');
        }.bind(this));
      }

      // Error handling
      window.addEventListener('error', function(e) {
        this.log('JavaScript error:', e.error);
      }.bind(this));

      // Handle online/offline status
      window.addEventListener('online', function() {
        this.log('Connection restored');
        $('body').removeClass('offline').addClass('online');
      }.bind(this));

      window.addEventListener('offline', function() {
        this.log('Connection lost');
        $('body').removeClass('online').addClass('offline');
      }.bind(this));
    },

    // Performance optimizations
    optimizePerformance: function() {
      // Minimize reflows and repaints
      const $body = $('body');
      
      // Add performance class
      $body.addClass('js-loaded');

      // Preload critical fonts if available
      this.preloadFonts();

      // Setup passive event listeners for better scroll performance
      this.setupPassiveListeners();
    },

    // Preload fonts
    preloadFonts: function() {
      const fonts = [
        // Add font files here if using custom fonts
      ];

      fonts.forEach(function(fontUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = fontUrl;
        document.head.appendChild(link);
      });
    },

    // Setup passive event listeners for better performance
    setupPassiveListeners: function() {
      const supportsPassive = this.detectPassiveEvents();
      
      if (supportsPassive) {
        // Use passive listeners for better scroll performance
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
      }
    },

    // Detect passive event support
    detectPassiveEvents: function() {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
            return true;
          }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) {}
      return supportsPassive;
    },

    // Utility logging function
    log: function() {
      if (this.config.debug && console && console.log) {
        const args = Array.prototype.slice.call(arguments);
        args.unshift('[APP]');
        console.log.apply(console, args);
      }
    }
  };

  // Initialize the application
  App.init();

  // Make App globally available
  window.App = App;

})(jQuery);