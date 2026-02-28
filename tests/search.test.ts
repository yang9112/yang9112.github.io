/**
 * Search Module Tests
 */

// Mock DOM environment with sample posts
document.body.innerHTML = `
  <div>
    <article class="post-expand">
      <h1>Test Post 1</h1>
      <a href="/post1.html">Read more</a>
      <div class="article-content">
        This is a test post about TypeScript and JavaScript development.
      </div>
      <time>2023-01-01</time>
    </article>
    
    <article class="post-expand">
      <h1>Test Post 2</h1>
      <a href="/post2.html">Read more</a>
      <div class="article-content">
        Learn about CSS and responsive design in this post.
      </div>
      <time>2023-01-02</time>
    </article>
  </div>
`;

describe('Search functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should extract post data from DOM', () => {
    const posts = document.querySelectorAll('article.post-expand');
    expect(posts.length).toBe(2);
    
    const firstPost = posts[0];
    if (firstPost) {
      const title = firstPost.querySelector('h1')?.textContent?.trim();
      expect(title).toBe('Test Post 1');
      
      const content = firstPost.querySelector('.article-content')?.textContent?.trim();
      expect(content).toBe('This is a test post about TypeScript and JavaScript development.');
    }
  });

  test('should generate excerpts from content', () => {
    const getExcerpt = (content: string, maxLength = 150) => {
      let text = content.trim();
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
    };

    const longContent = 'This is a very long content that should be truncated when it exceeds the maximum length limit for excerpts in the search functionality.';
    const excerpt = getExcerpt(longContent, 50);
    
    expect(excerpt.length).toBeLessThanOrEqual(53); // 50 + '...'
    expect(excerpt).toMatch(/\.\.\.$/);
  });

  test('should search and rank results', () => {
    const mockPosts = [
      {
        title: 'TypeScript Guide',
        content: 'Learn TypeScript basics and advanced features',
        url: '/typescript-guide'
      },
      {
        title: 'JavaScript Tips',
        content: 'Modern JavaScript development practices',
        url: '/javascript-tips'
      }
    ];

    const searchAndRank = (query: string, posts: any[]) => {
      const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      
      return posts.map(post => {
        let score = 0;
        const titleLower = post.title.toLowerCase();
        const contentLower = post.content.toLowerCase();
        
        terms.forEach(term => {
          if (titleLower.includes(term)) score += 10;
          if (contentLower.includes(term)) score += 2;
        });
        
        return { ...post, score };
      }).filter(post => post.score > 0)
        .sort((a, b) => b.score - a.score);
    };

    const results = searchAndRank('TypeScript', mockPosts);
    
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('TypeScript Guide');
    expect(results[0].score).toBeGreaterThan(0);
  });

  test('should escape regex special characters in search terms', () => {
    const escapeRegex = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const testString = 'test+file*.doc?';
    const escaped = escapeRegex(testString);
    
    expect(escaped).toBe('test\\+file\\*\\.doc\\?');
  });

  test('should handle empty search queries', () => {
    const emptyQuery = '';
    const terms = emptyQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    
    expect(terms.length).toBe(0);
  });
});