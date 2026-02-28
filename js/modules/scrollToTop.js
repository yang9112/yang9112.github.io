/**
 * Scroll To Top Module - Back to top functionality
 * Shows/hides scroll to top button based on scroll position
 */
(function($) {
  'use strict';
  
  const scrollToTop = {
    // Configuration
    config: {
      upperLimit: 1000,        // When to show the scroll link
      scrollSpeed: 500,        // Scroll to top speed
      scrollElem: $("#totop")  // Scroll link element
    },

    // Initialize the module
    init: function() {
      const config = this.config;
      
      // Initially hide the scroll element
      config.scrollElem.hide();
      
      // Bind scroll event
      $(window).scroll(function() {
        var scrollTop = $(document).scrollTop();
        if (scrollTop > config.upperLimit) {
          config.scrollElem.stop().fadeTo(300, 1); // fade back in
        } else {
          config.scrollElem.stop().fadeTo(300, 0); // fade out
        }
      });

      // Bind click event
      config.scrollElem.click(function() {
        $("html, body").animate({scrollTop: 0}, config.scrollSpeed);
        return false;
      });
    }
  };

  // Export for use in other modules
  window.ScrollToTopModule = scrollToTop;
  
})(jQuery);