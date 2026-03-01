class Application {
    constructor() {
        this.modules = new Map();
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
    init() {
        this.log('Initializing application...');
        $(document).ready(() => {
            this.loadModules();
            this.setupEventListeners();
            this.optimizePerformance();
        });
    }
    loadModules() {
        this.config.modules.forEach((moduleName) => {
            const module = window[moduleName];
            if (module && typeof module.init === 'function') {
                try {
                    module.init();
                    this.log('Module initialized:', moduleName);
                }
                catch (error) {
                    this.log('Error initializing module:', moduleName, error);
                }
            }
            else {
                this.log('Module not found:', moduleName);
            }
        });
    }
    setupEventListeners() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                this.log('Page load time:', loadTime + 'ms');
            });
        }
        window.addEventListener('error', (e) => {
            this.log('JavaScript error:', e.error);
        });
        window.addEventListener('online', () => {
            this.log('Connection restored');
            $('body').removeClass('offline').addClass('online');
        });
        window.addEventListener('offline', () => {
            this.log('Connection lost');
            $('body').removeClass('online').addClass('offline');
        });
    }
    optimizePerformance() {
        const $body = $('body');
        $body.addClass('js-loaded');
        this.preloadFonts();
        this.setupPassiveListeners();
    }
    preloadFonts() {
        const fonts = [];
        fonts.forEach((fontUrl) => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }
    setupPassiveListeners() {
        const supportsPassive = this.detectPassiveEvents();
        if (supportsPassive) {
            document.addEventListener('touchstart', () => { }, { passive: true });
            document.addEventListener('touchmove', () => { }, { passive: true });
        }
    }
    detectPassiveEvents() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('testPassive', () => { }, opts);
            window.removeEventListener('testPassive', () => { }, opts);
        }
        catch (e) { }
        return supportsPassive;
    }
    log(...args) {
        if (this.config.debug && console && console.log) {
            const logArgs = ['[APP]', ...args];
            console.log.apply(console, logArgs);
        }
    }
}
const app = new Application();
app.init();
window.App = app;
export default Application;
//# sourceMappingURL=app.js.map