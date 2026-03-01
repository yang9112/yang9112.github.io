/**
 * Dynamic Module Loader
 * Loads JavaScript modules based on priority and user interaction
 */
(function() {
    'use strict';

    // Core modules that load immediately
    const CRITICAL_MODULES = [
        '/dist/js/critical.min.js'
    ];

    // Enhanced features that load after page load
    const ENHANCED_MODULES = [
        '/dist/js/enhanced.min.js'
    ];

    // Core functionality that can load with slight delay
    const CORE_MODULES = [
        '/dist/js/core.min.js'
    ];

    // Load critical modules immediately
    function loadCriticalModules() {
        CRITICAL_MODULES.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => console.log('✅ Critical module loaded:', src);
            script.onerror = () => console.error('❌ Failed to load critical module:', src);
            document.head.appendChild(script);
        });
    }

    // Load enhanced modules after page load
    function loadEnhancedModules() {
        setTimeout(() => {
            ENHANCED_MODULES.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => console.log('✅ Enhanced module loaded:', src);
                script.onerror = () => console.error('❌ Failed to load enhanced module:', src);
                document.head.appendChild(script);
            });
        }, 1000); // 1 second delay
    }

    // Load core modules with slight delay
    function loadCoreModules() {
        setTimeout(() => {
            CORE_MODULES.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => console.log('✅ Core module loaded:', src);
                script.onerror = () => console.error('❌ Failed to load core module:', src);
                document.head.appendChild(script);
            });
        }, 500); // 500ms delay
    }

    // Initialize loading strategy
    function init() {
        // Load critical modules immediately
        loadCriticalModules();
        
        // Load core modules after DOM is partially ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadCoreModules);
        } else {
            loadCoreModules();
        }
        
        // Load enhanced modules after page is fully loaded
        if (document.readyState === 'complete') {
            loadEnhancedModules();
        } else {
            window.addEventListener('load', loadEnhancedModules);
        }
    }

    // Start the loading process
    init();

    // Expose loading functions for manual control if needed
    window.ModuleLoader = {
        loadCritical: loadCriticalModules,
        loadCore: loadCoreModules,
        loadEnhanced: loadEnhancedModules
    };
})();