class SearchManager {
    constructor() {
        this.searchIndex = null;
        this.isSearchReady = false;
    }
    buildSearchIndex() {
        const posts = [];
        const postElements = document.querySelectorAll('section.post, article.post-expand');
        postElements.forEach((post) => {
            var _a, _b, _c;
            const titleElement = post.querySelector('h1');
            const linkElement = post.querySelector('a');
            const contentElement = post.querySelector('.article-content');
            const timeElement = post.querySelector('time');
            if (titleElement && linkElement) {
                const postData = {
                    title: ((_a = titleElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                    url: linkElement.href || linkElement.getAttribute('href') || '',
                    content: contentElement ? ((_b = contentElement.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '' : '',
                    excerpt: this.getExcerpt(contentElement),
                    date: timeElement ? ((_c = timeElement.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '' : '',
                    element: post
                };
                posts.push(postData);
            }
        });
        this.searchIndex = posts;
        this.isSearchReady = true;
        return posts;
    }
    getExcerpt(contentElement, maxLength = 150) {
        var _a;
        if (!contentElement)
            return '';
        let text = ((_a = contentElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        text = text.replace(/\s+/g, ' ');
        if (text.length > maxLength) {
            text = text.substring(0, maxLength);
            const lastSpace = text.lastIndexOf(' ');
            if (lastSpace > maxLength * 0.8) {
                text = text.substring(0, lastSpace);
            }
            text += '...';
        }
        return text;
    }
    performSearch(query) {
        if (!this.isSearchReady || !this.searchIndex) {
            return [];
        }
        const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        if (terms.length === 0) {
            return [];
        }
        const results = [];
        this.searchIndex.forEach((post) => {
            let score = 0;
            const titleLower = post.title.toLowerCase();
            const contentLower = post.content.toLowerCase();
            terms.forEach((term) => {
                if (titleLower.includes(term)) {
                    score += 10;
                    if (titleLower.startsWith(term)) {
                        score += 5;
                    }
                }
                const contentMatches = contentLower.split(term).length - 1;
                score += contentMatches * 2;
                if (post.url.toLowerCase().includes(term)) {
                    score += 3;
                }
            });
            if (score > 0) {
                results.push({
                    ...post,
                    score: score,
                    highlightedTitle: this.highlightTerms(post.title, terms),
                    highlightedExcerpt: this.highlightTerms(post.excerpt, terms)
                });
            }
        });
        results.sort((a, b) => b.score - a.score);
        return results;
    }
    highlightTerms(text, terms) {
        let highlighted = text;
        terms.forEach((term) => {
            const regex = new RegExp('(' + this.escapeRegex(term) + ')', 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        return highlighted;
    }
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    createSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
      <div class="search-overlay"></div>
      <div class="search-container">
        <div class="search-header">
          <input type="text" class="search-input" placeholder="搜索文章..." autocomplete="off">
          <button class="search-close" aria-label="关闭搜索">&times;</button>
        </div>
        <div class="search-results">
          <div class="search-status">输入关键词开始搜索...</div>
        </div>
      </div>
    `;
        this.addSearchStyles();
        document.body.appendChild(modal);
        return modal;
    }
    addSearchStyles() {
        if (document.querySelector('#search-styles')) {
            return;
        }
        const styles = document.createElement('style');
        styles.id = 'search-styles';
        styles.textContent = `
      .search-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
      }
      
      .search-modal.active {
        display: block;
      }
      
      .search-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
      }
      
      .search-container {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 600px;
        max-height: 80%;
        background: var(--bg-secondary, #fafafa);
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      
      .search-header {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color, #ddd);
      }
      
      .search-input {
        flex: 1;
        font-size: 18px;
        padding: 12px;
        border: 2px solid var(--border-color, #ddd);
        border-radius: 4px;
        background: var(--bg-primary, #fff);
        color: var(--text-primary, #333);
        outline: none;
      }
      
      .search-input:focus {
        border-color: var(--accent, #ff9670);
      }
      
      .search-close {
        margin-left: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary, #666);
        padding: 5px;
        line-height: 1;
      }
      
      .search-close:hover {
        color: var(--accent, #ff9670);
      }
      
      .search-results {
        max-height: calc(80vh - 100px);
        overflow-y: auto;
        padding: 20px;
      }
      
      .search-status {
        text-align: center;
        color: var(--text-secondary, #666);
        padding: 20px;
      }
      
      .search-result-item {
        padding: 15px 0;
        border-bottom: 1px solid var(--border-color, #eee);
      }
      
      .search-result-item:last-child {
        border-bottom: none;
      }
      
      .search-result-title {
        margin: 0 0 8px 0;
        font-size: 18px;
        line-height: 1.3;
      }
      
      .search-result-title a {
        color: var(--text-primary, #333);
        text-decoration: none;
      }
      
      .search-result-title a:hover {
        color: var(--accent, #ff9670);
      }
      
      .search-result-excerpt {
        margin: 0 0 8px 0;
        color: var(--text-secondary, #666);
        font-size: 14px;
        line-height: 1.5;
      }
      
      .search-result-meta {
        font-size: 12px;
        color: var(--text-secondary, #999);
      }
      
      .search-result-score {
        float: right;
        background: var(--accent, #ff9670);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
      }
      
      mark {
        background: #ffeb3b;
        color: #000;
        padding: 1px 2px;
        border-radius: 2px;
      }
      
      body.dark-mode mark {
        background: #ffc107;
        color: #000;
      }
      
      @media (max-width: 768px) {
        .search-container {
          top: 5%;
          width: 95%;
        }
        
        .search-header {
          padding: 15px;
        }
        
        .search-input {
          font-size: 16px;
        }
        
        .search-results {
          padding: 15px;
        }
      }
    `;
        document.head.appendChild(styles);
    }
    showSearchModal() {
        let modal = document.querySelector('.search-modal');
        if (!modal) {
            modal = this.createSearchModal();
        }
        modal.classList.add('active');
        const input = modal.querySelector('.search-input');
        input.value = '';
        input.focus();
        return modal;
    }
    hideSearchModal() {
        const modal = document.querySelector('.search-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    displayResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-status">没有找到相关文章</div>';
            return;
        }
        let html = '';
        results.forEach((result) => {
            html += `
        <div class="search-result-item">
          <h3 class="search-result-title">
            <a href="${result.url}">${result.highlightedTitle}</a>
          </h3>
          <p class="search-result-excerpt">${result.highlightedExcerpt}</p>
          <div class="search-result-meta">
            ${result.date ? '<span>' + result.date + '</span>' : ''}
            <span class="search-result-score">相关度: ${result.score}</span>
          </div>
        </div>
      `;
        });
        container.innerHTML = html;
    }
    initSearch() {
        this.buildSearchIndex();
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const modal = this.showSearchModal();
                this.setupSearchHandlers(modal);
            }
        });
        const existingSearchForm = document.querySelector('.search form');
        if (existingSearchForm) {
            existingSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const modal = this.showSearchModal();
                this.setupSearchHandlers(modal);
            });
        }
    }
    setupSearchHandlers(modal) {
        const input = modal.querySelector('.search-input');
        const closeBtn = modal.querySelector('.search-close');
        const resultsContainer = modal.querySelector('.search-results');
        const overlay = modal.querySelector('.search-overlay');
        let searchTimeout;
        const performLiveSearch = () => {
            const query = input.value.trim();
            if (query.length === 0) {
                resultsContainer.innerHTML = '<div class="search-status">输入关键词开始搜索...</div>';
                return;
            }
            resultsContainer.innerHTML = '<div class="search-status">搜索中...</div>';
            clearTimeout(searchTimeout);
            searchTimeout = window.setTimeout(() => {
                const results = this.performSearch(query);
                this.displayResults(results, resultsContainer);
            }, 300);
        };
        input.addEventListener('input', performLiveSearch);
        const closeModal = () => {
            this.hideSearchModal();
            modal.removeEventListener('input', performLiveSearch);
        };
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    init() {
        this.initSearch();
    }
    search(query) {
        return this.performSearch(query);
    }
    show() {
        return this.showSearchModal();
    }
    hide() {
        this.hideSearchModal();
    }
    isReady() {
        return this.isSearchReady;
    }
}
const searchManager = new SearchManager();
window.Search = {
    init: () => searchManager.init(),
    search: (query) => searchManager.search(query),
    show: () => searchManager.show(),
    hide: () => searchManager.hide(),
    isReady: () => searchManager.isReady()
};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => searchManager.init());
}
else {
    searchManager.init();
}
export default SearchManager;
//# sourceMappingURL=search.js.map