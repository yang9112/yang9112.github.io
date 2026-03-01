class DarkModeManager {
    constructor() {
        this.STORAGE_KEY = 'darkMode';
        this.DARK_MODE_CLASS = 'dark-mode';
        this.button = null;
        this.isDarkMode = false;
        this.init();
    }
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.innerHTML = '🌙';
        button.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(button);
        return button;
    }
    getSystemDarkModePreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    }
    getSavedPreference() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) === 'true';
        }
        catch (e) {
            return null;
        }
    }
    savePreference(isDark) {
        try {
            localStorage.setItem(this.STORAGE_KEY, isDark.toString());
        }
        catch (e) {
        }
    }
    applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add(this.DARK_MODE_CLASS);
        }
        else {
            document.body.classList.remove(this.DARK_MODE_CLASS);
        }
    }
    updateButton(button, isDark) {
        button.innerHTML = isDark ? '☀️' : '🌙';
    }
    initDarkMode() {
        this.button = this.createToggleButton();
        const saved = this.getSavedPreference();
        this.isDarkMode = saved !== null ? saved : this.getSystemDarkModePreference();
        this.applyDarkMode(this.isDarkMode);
        this.updateButton(this.button, this.isDarkMode);
        this.button.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            this.applyDarkMode(this.isDarkMode);
            this.updateButton(this.button, this.isDarkMode);
            this.savePreference(this.isDarkMode);
            const event = new CustomEvent('darkModeToggled', {
                detail: { isDarkMode: this.isDarkMode }
            });
            document.dispatchEvent(event);
        });
    }
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
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
    isCurrentlyDark() {
        return document.body.classList.contains(this.DARK_MODE_CLASS);
    }
    toggle() {
        if (this.button) {
            this.button.click();
        }
    }
    set(isDark) {
        this.isDarkMode = isDark;
        this.applyDarkMode(isDark);
        if (this.button) {
            this.updateButton(this.button, isDark);
        }
        this.savePreference(isDark);
    }
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initDarkMode();
                this.watchSystemTheme();
            });
        }
        else {
            this.initDarkMode();
            this.watchSystemTheme();
        }
        window.DarkMode = {
            isCurrentlyDark: () => this.isCurrentlyDark(),
            toggle: () => this.toggle(),
            set: (isDark) => this.set(isDark)
        };
    }
}
new DarkModeManager();
export default DarkModeManager;
//# sourceMappingURL=darkmode.js.map