/**
 * Dark Mode Module
 * Handles dark mode toggle functionality with localStorage persistence
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'darkMode';
  const DARK_MODE_CLASS = 'dark-mode';
  
  // Create toggle button
  function createToggleButton() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.innerHTML = '🌙';
    button.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(button);
    return button;
  }

  // Check system preference
  function getSystemDarkModePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  }

  // Get saved preference
  function getSavedPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return null;
    }
  }

  // Save preference
  function savePreference(isDark) {
    try {
      localStorage.setItem(STORAGE_KEY, isDark.toString());
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  // Apply dark mode
  function applyDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add(DARK_MODE_CLASS);
    } else {
      document.body.classList.remove(DARK_MODE_CLASS);
    }
  }

  // Initialize dark mode
  function initDarkMode() {
    const button = createToggleButton();
    
    // Determine initial state
    const saved = getSavedPreference();
    let isDarkMode = saved !== null ? saved : getSystemDarkModePreference();
    
    // Apply initial state
    applyDarkMode(isDarkMode);
    updateButton(button, isDarkMode);
    
    // Add click handler
    button.addEventListener('click', function() {
      isDarkMode = !isDarkMode;
      applyDarkMode(isDarkMode);
      updateButton(button, isDarkMode);
      savePreference(isDarkMode);
      
      // Dispatch custom event for other components
      const event = new CustomEvent('darkModeToggled', { 
        detail: { isDarkMode: isDarkMode } 
      });
      document.dispatchEvent(event);
    });
  }

  // Update button appearance
  function updateButton(button, isDark) {
    button.innerHTML = isDark ? '☀️' : '🌙';
  }

  // Listen for system theme changes
  function watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(function(e) {
        // Only apply if user hasn't explicitly set a preference
        if (getSavedPreference() === null) {
          const isDark = e.matches;
          applyDarkMode(isDark);
          updateButton(document.querySelector('.dark-mode-toggle'), isDark);
        }
      });
    }
  }

  // Utility functions for other modules
  window.DarkMode = {
    isCurrentlyDark: function() {
      return document.body.classList.contains(DARK_MODE_CLASS);
    },
    
    toggle: function() {
      const button = document.querySelector('.dark-mode-toggle');
      if (button) {
        button.click();
      }
    },
    
    set: function(isDark) {
      applyDarkMode(isDark);
      updateButton(document.querySelector('.dark-mode-toggle'), isDark);
      savePreference(isDark);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initDarkMode();
      watchSystemTheme();
    });
  } else {
    initDarkMode();
    watchSystemTheme();
  }

})();