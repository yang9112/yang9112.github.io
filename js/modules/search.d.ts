interface PostData {
    title: string;
    url: string;
    content: string;
    excerpt: string;
    date: string;
    element: Element;
}
interface SearchResult extends PostData {
    score: number;
    highlightedTitle: string;
    highlightedExcerpt: string;
}
interface SearchAPI {
    init(): void;
    search(query: string): SearchResult[];
    show(): HTMLElement;
    hide(): void;
    isReady(): boolean;
}
declare global {
    interface Window {
        Search: SearchAPI;
    }
}
declare class SearchManager {
    private searchIndex;
    private isSearchReady;
    private buildSearchIndex;
    private getExcerpt;
    performSearch(query: string): SearchResult[];
    private highlightTerms;
    private escapeRegex;
    private createSearchModal;
    private addSearchStyles;
    showSearchModal(): HTMLElement;
    hideSearchModal(): void;
    private displayResults;
    private initSearch;
    private setupSearchHandlers;
    init(): void;
    search(query: string): SearchResult[];
    show(): HTMLElement;
    hide(): void;
    isReady(): boolean;
}
export default SearchManager;
