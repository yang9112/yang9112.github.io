/**
 * Main Application Entry Point
 * Coordinates loading and initialization of all modules
 */

interface ModuleConfig {
  name: string;
  init?: () => void;
}

interface AppConfig {
  debug: boolean;
  modules: string[];
}

interface PerformanceTiming {
  navigationStart: number;
  loadEventEnd: number;
}

interface Window {
  performance?: {
    timing?: PerformanceTiming;
  };
  [key: string]: any;
}

declare const jQuery: any;
declare const $: any;

class Application {
  public config: AppConfig;
  private modules: Map<string, ModuleConfig> = new Map();

  constructor() {
    this.config = {
      debug: false,
      modules: [
        'ResponsiveModule',
        'GalleryModule', 
        'ScrollToTopModule',
        'PreloaderModule'
      ]
    };
  }

  /**
   * Initialize application
   */
  public init(): void {
    this.log('Initializing application...');
    
    // Wait for DOM to be ready
    $(document).ready(() => {
      this.loadModules();
      this.setupEventListeners();
      this.optimizePerformance();
    });
  }

  /**
   * Load and initialize modules
   */
  private loadModules(): void {
    this.config.modules.forEach((moduleName: string) => {
      const module = (window as any)[moduleName];
      if (module && typeof module.init === 'function') {
        try {
          module.init();
          this.log('Module initialized:', moduleName);
        } catch (error) {
          this.log('Error initializing module:', moduleName, error);
        }
      } else {
        this.log('Module not found:', moduleName);
      }
    });
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Performance monitoring
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const loadTime = window.performance.timing!.loadEventEnd - window.performance.timing!.navigationStart;
        this.log('Page load time:', loadTime + 'ms');
      });
    }

    // Error handling
    window.addEventListener('error', (e: ErrorEvent) => {
      this.log('JavaScript error:', e.error);
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.log('Connection restored');
      $('body').removeClass('offline').addClass('online');
    });

    window.addEventListener('offline', () => {
      this.log('Connection lost');
      $('body').removeClass('online').addClass('offline');
    });
  }

  /**
   * Performance optimizations
   */
  private optimizePerformance(): void {
    // Minimize reflows and repaints
    const $body = $('body');
    
    // Add performance class
    $body.addClass('js-loaded');

    // Preload critical fonts if available
    this.preloadFonts();

    // Setup passive event listeners for better scroll performance
    this.setupPassiveListeners();
  }

  /**
   * Preload fonts
   */
  private preloadFonts(): void {
    const fonts: string[] = [
      // Add font files here if using custom fonts
    ];

    fonts.forEach((fontUrl: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  }

  /**
   * Setup passive event listeners for better performance
   */
  private setupPassiveListeners(): void {
    const supportsPassive = this.detectPassiveEvents();
    
    if (supportsPassive) {
      // Use passive listeners for better scroll performance
      document.addEventListener('touchstart', () => {}, { passive: true } as any);
      document.addEventListener('touchmove', () => {}, { passive: true } as any);
    }
  }

  /**
   * Detect passive event support
   */
  private detectPassiveEvents(): boolean {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
          return true;
        }
      });
      window.addEventListener('testPassive', () => {}, opts);
      window.removeEventListener('testPassive', () => {}, opts);
    } catch (e) {}
    return supportsPassive;
  }

  /**
   * Utility logging function
   */
  private log(...args: any[]): void {
    if (this.config.debug && console && console.log) {
      const logArgs = ['[APP]', ...args];
      console.log.apply(console, logArgs);
    }
  }
}

// Initialize the application
const app = new Application();
app.init();

// Make App globally available
(window as any).App = app;

export default Application;