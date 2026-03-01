/**
 * Lazy Loading for Images - Performance Optimization
 * Implements intersection observer for efficient image loading
 */

class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.loadedImages = new Set();
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.setupLegacyLoading();
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null, // relative to viewport
      rootMargin: '50px 0px', // start loading 50px before entering viewport
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, options);

    // Observe all images with data-src attribute
    this.observeImages();
  }

  setupLegacyLoading() {
    // Simple scroll-based loading for older browsers
    let timer = null;
    
    const checkImages = () => {
      this.lazyLoadLegacy();
    };

    const scrollHandler = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(checkImages, 200);
    };

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', scrollHandler);
    window.addEventListener('orientationchange', scrollHandler);

    // Initial check
    checkImages();
  }

  observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (!this.loadedImages.has(img.src)) {
        this.imageObserver.observe(img);
      }
    });
  }

  lazyLoadLegacy() {
    const images = document.querySelectorAll('img[data-src]');
    const viewportHeight = window.innerHeight;

    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.top <= viewportHeight + 200;

      if (isInViewport && !this.loadedImages.has(img.src)) {
        this.loadImage(img);
      }
    });
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src || this.loadedImages.has(src)) return;

    this.loadedImages.add(src);

    // Create new image to preload
    const newImg = new Image();
    
    newImg.onload = () => {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
      this.addLoadingAnimation(img);
    };

    newImg.onerror = () => {
      img.classList.add('error');
      console.warn('Failed to load image:', src);
    };

    newImg.src = src;
  }

  addLoadingAnimation(img) {
    // Add fade-in effect
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
      img.style.opacity = '1';
    }, 10);
  }

  // Method to convert existing images to lazy load
  convertExistingImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
      // Skip if already processed, very small images, or external images
      if (img.src.includes('data:') || 
          img.hasAttribute('data-skip-lazy') ||
          img.width < 100 || img.height < 100) {
        return;
      }

      // Convert to lazy load
      img.setAttribute('data-src', img.src);
      img.src = this.getPlaceholderImage();
      
      if (this.imageObserver) {
        this.imageObserver.observe(img);
      }
    });
  }

  getPlaceholderImage() {
    // Simple SVG placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=';
  }

  // Preload critical images
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    
    criticalImages.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src && !this.loadedImages.has(src)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });
  }

  // Initialize lazy loading for the entire page
  static init() {
    if (window.lazyLoader) {
      return window.lazyLoader;
    }

    window.lazyLoader = new LazyLoader();
    return window.lazyLoader;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LazyLoader.init());
} else {
  LazyLoader.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}