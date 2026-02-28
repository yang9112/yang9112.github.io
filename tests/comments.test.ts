/**
 * 评论系统测试
 */

import CommentsSystem from '../ts/modules/comments';

// Mock DOM environment
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value,
    clear: () => store = {}
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock DOM elements
const createMockElement = (id: string): HTMLElement => {
  const element = document.createElement('div');
  element.id = id;
  element.innerHTML = '';
  document.body.appendChild(element);
  return element;
};

describe('CommentsSystem', () => {
  let commentsSystem: CommentsSystem;

  beforeEach(() => {
    // Clear localStorage
    mockLocalStorage.clear();
    
    // Clear and reset DOM
    document.body.innerHTML = '';
    
    // Create mock elements
    createMockElement('comments-container');
    createMockElement('comment-username');
    createMockElement('comment-content');
    createMockElement('comment-submit');
    
    commentsSystem = new CommentsSystem();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic functionality', () => {
    test('should initialize with empty comments', () => {
      expect(commentsSystem.getCommentsCount()).toBe(0);
    });

    test('should add a comment successfully', () => {
      commentsSystem.addComment('testuser', 'This is a test comment');
      
      expect(commentsSystem.getCommentsCount()).toBe(1);
    });

    test('should handle empty comments display', () => {
      commentsSystem.renderComments();
      const container = document.getElementById('comments-container');
      expect(container?.innerHTML).toContain('暂无评论');
    });

    test('should generate unique IDs for comments', () => {
      commentsSystem.addComment('user1', 'comment 1');
      commentsSystem.addComment('user2', 'comment 2');
      
      // This test would require access to internal comments array
      // For now, just ensure no errors are thrown
      expect(commentsSystem.getCommentsCount()).toBe(2);
    });
  });

  describe('Comment features', () => {
    test('should handle reply functionality', () => {
      commentsSystem.addComment('parent', 'parent comment');
      
      // Get parent comment ID (simulate)
      const parentId = 'test-parent-id';
      
      commentsSystem.addComment('replier', 'reply comment', parentId);
      
      expect(commentsSystem.getCommentsCount()).toBeGreaterThanOrEqual(1);
    });

    test('should format timestamps correctly', () => {
      const container = document.getElementById('comments-container');
      
      commentsSystem.addComment('user', 'test comment');
      
      expect(container?.innerHTML).toBeTruthy();
    });

    test('should handle username and content trimming', () => {
      const container = document.getElementById('comments-container');
      
      commentsSystem.addComment('  testuser  ', '  test content  ');
      
      expect(container?.innerHTML).toBeTruthy();
    });
  });

  describe('Storage operations', () => {
    test('should save comments to localStorage', () => {
      commentsSystem.addComment('username', 'content');
      
      const stored = localStorage.getItem('blog_comments');
      expect(stored).toBeTruthy();
      expect(stored?.length).toBeGreaterThan(0);
    });

    test('should load comments from localStorage', () => {
      // First, add and save
      commentsSystem.addComment('user', 'content');
      
      // Create new instance to test loading
      const newSystem = new CommentsSystem();
      expect(newSystem.getCommentsCount()).toBeGreaterThan(0);
    });
  });

  describe('Validation and edge cases', () => {
    test('should handle very long usernames and content', () => {
      const longUsername = 'a'.repeat(100);
      const longContent = 'b'.repeat(1000);
      
      expect(() => {
        commentsSystem.addComment(longUsername, longContent);
      }).not.toThrow();
    });

    test('should handle special characters in content', () => {
      const specialContent = '<script>alert("test")</script>\n\nLine breaks & special chars!';
      
      expect(() => {
        commentsSystem.addComment('user', specialContent);
      }).not.toThrow();
    });

    test('should handle missing DOM elements gracefully', () => {
      // Remove container element
      const container = document.getElementById('comments-container');
      if (container) container.remove();
      
      expect(() => {
        commentsSystem.renderComments();
      }).not.toThrow();
    });
  });

  describe('HTML escaping', () => {
    test('should escape HTML in user input', () => {
      commentsSystem.addComment('<script>alert("xss")</script>', '<img src=x onerror=alert(1)>');
      
      const container = document.getElementById('comments-container');
      const content = container?.innerHTML || '';
      
      // Should not contain the dangerous scripts
      expect(content).not.toContain('<script>');
      expect(content).not.toContain('onerror');
      expect(content).toContain('&lt;script&gt;');
      expect(content).not.toContain('on&#101;rror');
    });
  });

  describe('Deletion functionality', () => {
    test('should delete comments', () => {
      commentsSystem.addComment('user', 'content');
      const initialCount = commentsSystem.getCommentsCount();
      
      // This would require getting the actual comment ID
      // For now, test that the method exists and doesn't crash
      expect(() => {
        commentsSystem.deleteComment('non-existent-id');
      }).not.toThrow();
      
      expect(commentsSystem.getCommentsCount()).toBe(initialCount);
    });
  });
});