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
declare class DarkModeManager {
    private readonly STORAGE_KEY;
    private readonly DARK_MODE_CLASS;
    private button;
    private isDarkMode;
    constructor();
    private createToggleButton;
    private getSystemDarkModePreference;
    private getSavedPreference;
    private savePreference;
    private applyDarkMode;
    private updateButton;
    private initDarkMode;
    private watchSystemTheme;
    isCurrentlyDark(): boolean;
    toggle(): void;
    set(isDark: boolean): void;
    private init;
}
export default DarkModeManager;
