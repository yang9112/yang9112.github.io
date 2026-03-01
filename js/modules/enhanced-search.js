/**
 * Enhanced Search System with Full-Text Search
 * Provides comprehensive search functionality with highlighting
 */

class EnhancedSearch {
  constructor() {
    this.searchData = new Map();
    this.searchIndex = new Map();
    this.isInitialized = false;
    this.searchForm = null;
    this.searchInput = null;
    this.searchResults = null;
    this.init();
  }

  init() {
    this.setupSearchElements();
    this.buildSearchIndex();
    this.bindEvents();
    this.isInitialized = true;
  }

  setupSearchElements() {
    this.searchForm = document.querySelector('.search');
    this.searchInput = document.querySelector('.search input[type="search"]');
    
    // Create search results container if it doesn't exist
    if (!document.getElementById('search-results')) {
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'search-results';
      resultsContainer.className = 'search-results';
      resultsContainer.innerHTML = `
        <div class="search-results-header">
          <h3>搜索结果</h3>
          <button class="search-close" id="searchClose">&times;</button>
        </div>
        <div class="search-results-list" id="searchResultsList"></div>
      `;
      document.body.appendChild(resultsContainer);
    }
    
    this.searchResults = document.getElementById('search-results');
    this.searchResultsList = document.getElementById('searchResultsList');
  }

  buildSearchIndex() {
    // Get all articles and posts
    const articles = document.querySelectorAll('article.post, article.page');
    
    articles.forEach((article, index) => {
      const title = article.querySelector('h1')?.textContent || '';
      const content = article.querySelector('.article-content')?.textContent || '';
      const url = article.querySelector('a[href]')?.href || window.location.href;
      const date = article.querySelector('time')?.textContent || '';
      const categories = this.extractCategories(article);
      const tags = this.extractTags(article);
      
      const searchData = {
        index,
        title: title.toLowerCase(),
        content: content.toLowerCase(),
        url,
        date,
        categories: categories.map(c => c.toLowerCase()),
        tags: tags.map(t => t.toLowerCase()),
        excerpt: this.createExcerpt(content)
      };
      
      this.searchData.set(index, searchData);
      
      // Build keyword index
      this.indexKeywords(searchData);
    });
  }

  extractKeywords(text) {
    // Simple keyword extraction - split and filter common words
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    return text.toLowerCase()
      .split(/[\\s\\W_]+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .filter(word => /[\\u4e00-\\u9fa5a-zA-Z0-9]/.test(word));
  }

  indexKeywords(searchData) {
    const allText = `${searchData.title} ${searchData.content} ${searchData.categories.join(' ')} ${searchData.tags.join(' ')}`;
    const keywords = this.extractKeywords(allText);
    
    keywords.forEach(keyword => {
      if (!this.searchIndex.has(keyword)) {
        this.searchIndex.set(keyword, new Set());
      }
      this.searchIndex.get(keyword).add(searchData.index);
    });
  }

  extractCategories(article) {
    const categories = [];
    const categoryElements = article.querySelectorAll('.article-categories a');
    categoryElements.forEach(el => categories.push(el.textContent));
    return categories;
  }

  extractTags(article) {
    const tags = [];
    const tagElements = article.querySelectorAll('.article-tags a');
    tagElements.forEach(el => tags.push(el.textContent));
    return tags;
  }

  createExcerpt(content, maxLength = 150) {
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.debounce((e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
          this.performSearch(query);
        } else {
          this.hideSearchResults();
        }
      }, 300));
      
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = e.target.value.trim();
          if (query.length >= 2) {
            this.performSearch(query);
          }
        }
        
        if (e.key === 'Escape') {
          this.hideSearchResults();
        }
      });
    }
    
    // Close button
    const closeButton = document.getElementById('searchClose');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideSearchResults());
    }
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.searchResults.contains(e.target) && 
          !this.searchForm.contains(e.target)) {
        this.hideSearchResults();
      }
    });
  }

  performSearch(query) {
    const keywords = this.extractKeywords(query);
    const results = new Map();
    
    // Find matching documents
    keywords.forEach(keyword => {
      const matchingIndices = this.searchIndex.get(keyword);
      if (matchingIndices) {
        matchingIndices.forEach(index => {
          if (this.searchData.has(index)) {
            const data = this.searchData.get(index);
            const score = this.calculateScore(data, keywords);
            
            if (!results.has(index) || results.get(index).score < score) {
              results.set(index, { ...data, score });
            }
          }
        });
      }
    });
    
    // Sort by relevance score
    const sortedResults = Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limit to 10 results
    
    this.displaySearchResults(sortedResults, query);
  }

  calculateScore(searchData, keywords) {
    let score = 0;
    const title = searchData.title;
    const content = searchData.content;
    
    keywords.forEach(keyword => {
      // Title matches get higher score
      if (title.includes(keyword)) {
        score += keyword === title ? 10 : 5;
      }
      
      // Content matches
      const contentMatches = (content.match(new RegExp(keyword, 'g')) || []).length;
      score += contentMatches;
      
      // Category and tag matches
      searchData.categories.forEach(category => {
        if (category.includes(keyword)) score += 3;
      });
      
      searchData.tags.forEach(tag => {
        if (tag.includes(keyword)) score += 2;
      });
    });
    
    // Boost exact phrase matches
    const phrase = keywords.join(' ');
    if (content.includes(phrase)) score += 8;
    if (title.includes(phrase)) score += 15;
    
    return score;
  }

  displaySearchResults(results, query) {
    if (results.length === 0) {
      this.searchResultsList.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>未找到与 "<strong>${this.escapeHtml(query)}</strong>" 相关的内容</p>
          <p>建议：</p>
          <ul>
            <li>检查拼写是否正确</li>
            <li>尝试使用更通用的关键词</li>
            <li>尝试使用不同的搜索词</li>
          </ul>
        </div>
      `;
    } else {
      this.searchResultsList.innerHTML = results.map(result => {
        const highlightedTitle = this.highlightText(result.title, query);
        const highlightedExcerpt = this.highlightText(result.excerpt, query);
        
        return `
          <div class="search-result-item">
            <h4><a href="${result.url}">${highlightedTitle}</a></h4>
            <p class="search-result-excerpt">${highlightedExcerpt}</p>
            <div class="search-result-meta">
              ${result.date ? `<span class="search-result-date">${result.date}</span>` : ''}
              ${result.categories.length > 0 ? `
                <span class="search-result-categories">
                  <i class="fas fa-folder"></i> ${result.categories.join(', ')}
                </span>
              ` : ''}
              ${result.tags.length > 0 ? `
                <span class="search-result-tags">
                  <i class="fas fa-tag"></i> ${result.tags.slice(0, 3).join(', ')}
                  ${result.tags.length > 3 ? '...' : ''}
                </span>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
    
    this.showSearchResults();
  }

  highlightText(text, query) {
    if (!query) return this.escapeHtml(text);
    
    const keywords = this.extractKeywords(query);
    let highlightedText = this.escapeHtml(text);
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showSearchResults() {
    this.searchResults.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  hideSearchResults() {
    this.searchResults.classList.remove('show');
    document.body.style.overflow = '';
    if (this.searchInput) {
      this.searchInput.value = '';
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public API
  static init() {
    if (window.enhancedSearch) {
      return window.enhancedSearch;
    }
    
    window.enhancedSearch = new EnhancedSearch();
    return window.enhancedSearch;
  }

  search(query) {
    if (this.isInitialized) {
      this.performSearch(query);
    }
  }

  clearSearch() {
    this.hideSearchResults();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => EnhancedSearch.init());
} else {
  EnhancedSearch.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedSearch;
}