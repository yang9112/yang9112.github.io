interface AppConfig {
    debug: boolean;
    modules: string[];
}
declare class Application {
    config: AppConfig;
    private modules;
    constructor();
    init(): void;
    private loadModules;
    private setupEventListeners;
    private optimizePerformance;
    private preloadFonts;
    private setupPassiveListeners;
    private detectPassiveEvents;
    private log;
}
export default Application;
