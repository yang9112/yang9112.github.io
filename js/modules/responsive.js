/**
 * Responsive Module - Mobile optimization and responsive behaviors
 * Handles mobile menu, touch gestures, and responsive layouts
 */
(function($) {
  'use strict';
  
  const responsive = {
    config: {
      mobileBreakpoint: 768,
      touchThreshold: 10
    },

    // Initialize responsive features
    init: function() {
      this.setupMobileMenu();
      this.setupTouchGestures();
      this.setupViewportOptimizations();
    },

    // Mobile menu functionality
    setupMobileMenu: function() {
      // Add mobile menu toggle if navigation exists
      const $nav = $('#nav');
      const $header = $('.header');
      
      if ($nav.length && $header.length) {
        // Create mobile menu toggle button
        const $menuToggle = $('<button class="mobile-menu-toggle" aria-label="Toggle menu">' +
          '<span class="menu-icon"></span>' +
          '</button>');
        
        $header.prepend($menuToggle);
        
        // Toggle menu on click
        $menuToggle.on('click', function(e) {
          e.preventDefault();
          $nav.toggleClass('mobile-open');
          $menuToggle.toggleClass('active');
          $('body').toggleClass('menu-open');
        });

        // Close menu when clicking outside
        $(document).on('click', function(e) {
          if (!$(e.target).closest('.header, #nav').length) {
            $nav.removeClass('mobile-open');
            $menuToggle.removeClass('active');
            $('body').removeClass('menu-open');
          }
        });
      }
    },

    // Touch gesture support
    setupTouchGestures: function() {
      let touchStartX = 0;
      let touchEndX = 0;

      $(document).on('touchstart', function(e) {
        touchStartX = e.originalEvent.touches[0].clientX;
      });

      $(document).on('touchend', function(e) {
        touchEndX = e.originalEvent.changedTouches[0].clientX;
        handleSwipe();
      });

      function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > responsive.config.touchThreshold) {
          if (swipeDistance > 0) {
            // Swipe right - could open menu
            $(document).trigger('swipeRight');
          } else {
            // Swipe left - could close menu
            $(document).trigger('swipeLeft');
          }
        }
      }
    },

    // Viewport and layout optimizations
    setupViewportOptimizations: function() {
      // Optimize images for different screen sizes
      this.optimizeImages();
      
      // Handle viewport resize
      let resizeTimer;
      $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          responsive.handleResize();
        }, 250);
      });
    },

    // Image optimization based on screen size
    optimizeImages: function() {
      const isMobile = window.innerWidth <= this.config.mobileBreakpoint;
      
      $('img').each(function() {
        const $img = $(this);
        
        // Add responsive image attributes if not present
        if (!$img.attr('loading')) {
          $img.attr('loading', 'lazy');
        }
        
        // Optimize for mobile
        if (isMobile && !$img.hasClass('no-resize')) {
          $img.addClass('mobile-optimized');
        }
      });
    },

    // Handle resize events
    handleResize: function() {
      const isMobile = window.innerWidth <= this.config.mobileBreakpoint;
      
      // Toggle mobile/desktop classes
      $('body').toggleClass('mobile-view', isMobile).toggleClass('desktop-view', !isMobile);
      
      // Re-initialize components that depend on viewport
      this.optimizeImages();
    }
  };

  // Export for use in other modules
  window.ResponsiveModule = responsive;
  
})(jQuery);