/**
 * Dark Mode Module
 * Handles dark mode toggle functionality with localStorage persistence
 */

interface DarkModeToggleEventDetail {
  isDarkMode: boolean;
}

interface DarkModeAPI {
  isCurrentlyDark(): boolean;
  toggle(): void;
  set(isDark: boolean): void;
}

declare global {
  interface Window {
    DarkMode: DarkModeAPI;
  }
  interface HTMLElementEventMap {
    darkModeToggled: CustomEvent<DarkModeToggleEventDetail>;
  }
}

class DarkModeManager {
  private readonly STORAGE_KEY = 'darkMode';
  private readonly DARK_MODE_CLASS = 'dark-mode';
  private button: HTMLButtonElement | null = null;
  private isDarkMode: boolean = false;

  constructor() {
    this.init();
  }

  private createToggleButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.innerHTML = '🌙';
    button.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(button);
    return button;
  }

  private getSystemDarkModePreference(): boolean {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  }

  private getSavedPreference(): boolean | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    } catch (e) {
      return null;
    }
  }

  private savePreference(isDark: boolean): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, isDark.toString());
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  private applyDarkMode(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add(this.DARK_MODE_CLASS);
    } else {
      document.body.classList.remove(this.DARK_MODE_CLASS);
    }
  }

  private updateButton(button: HTMLButtonElement, isDark: boolean): void {
    button.innerHTML = isDark ? '☀️' : '🌙';
  }

  private initDarkMode(): void {
    this.button = this.createToggleButton();
    
    // Determine initial state
    const saved = this.getSavedPreference();
    this.isDarkMode = saved !== null ? saved : this.getSystemDarkModePreference();
    
    // Apply initial state
    this.applyDarkMode(this.isDarkMode);
    this.updateButton(this.button, this.isDarkMode);
    
    // Add click handler
    this.button.addEventListener('click', () => {
      this.isDarkMode = !this.isDarkMode;
      this.applyDarkMode(this.isDarkMode);
      this.updateButton(this.button!, this.isDarkMode);
      this.savePreference(this.isDarkMode);
      
      // Dispatch custom event for other components
      const event: CustomEvent<DarkModeToggleEventDetail> = new CustomEvent('darkModeToggled', { 
        detail: { isDarkMode: this.isDarkMode } 
      });
      document.dispatchEvent(event);
    });
  }

  private watchSystemTheme(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
        // Only apply if user hasn't explicitly set a preference
        if (this.getSavedPreference() === null) {
          const isDark = e.matches;
          this.isDarkMode = isDark;
          this.applyDarkMode(isDark);
          if (this.button) {
            this.updateButton(this.button, isDark);
          }
        }
      });
    }
  }

  public isCurrentlyDark(): boolean {
    return document.body.classList.contains(this.DARK_MODE_CLASS);
  }
  
  public toggle(): void {
    if (this.button) {
      this.button.click();
    }
  }
  
  public set(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyDarkMode(isDark);
    if (this.button) {
      this.updateButton(this.button, isDark);
    }
    this.savePreference(isDark);
  }

  private init(): void {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initDarkMode();
        this.watchSystemTheme();
      });
    } else {
      this.initDarkMode();
      this.watchSystemTheme();
    }

    // Expose API globally
    window.DarkMode = {
      isCurrentlyDark: () => this.isCurrentlyDark(),
      toggle: () => this.toggle(),
      set: (isDark: boolean) => this.set(isDark)
    };
  }
}

// Initialize the dark mode manager
new DarkModeManager();

export default DarkModeManager;