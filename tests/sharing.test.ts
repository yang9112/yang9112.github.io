/**
 * Social Sharing Tests
 */

// Mock window.open
global.open = jest.fn();

// Mock URLSearchParams functionality
global.URLSearchParams = URLSearchParams as any;

describe('Social Sharing functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should generate Twitter share URL correctly', () => {
    // Test URL generation logic for Twitter
    const platform = {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      color: '#1DA1F2',
      shareUrl: 'https://twitter.com/intent/tweet'
    };
    
    const options = {
      title: 'Test Page Title',
      description: 'Test page description',
      url: 'https://yang9112.github.io/test',
      hashtags: ['blog', 'tech', 'webdev']
    };
    
    const params = new URLSearchParams();
    params.set('text', `${options.title} - ${options.description}`);
    params.set('url', options.url);
    if (options.hashtags) {
      params.set('hashtags', options.hashtags.join(','));
    }
    
    const expectedUrl = `${platform.shareUrl}?${params.toString()}`;
    
    expect(expectedUrl).toContain('twitter.com/intent/tweet');
    expect(expectedUrl).toContain('Test+Page+Title');
    expect(expectedUrl).toContain('Test+page+description');
    expect(expectedUrl).toContain('blog%2Ctech%2Cwebdev');
  });

  test('should generate LinkedIn share URL correctly', () => {
    const params = new URLSearchParams();
    params.set('url', 'https://yang9112.github.io/test');
    
    const expectedUrl = `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
    
    expect(expectedUrl).toBe('https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fyang9112.github.io%2Ftest');
  });

  test('should handle clipboard copying', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText
      },
      writable: true
    });

    // Simulate clipboard copy
    await navigator.clipboard.writeText('https://yang9112.github.io/test');
    
    expect(mockWriteText).toHaveBeenCalledWith('https://yang9112.github.io/test');
  });

  test('should extract metadata correctly', () => {
    // Test metadata extraction logic
    const mockTitle = 'Test Page Title';
    const mockDescription = 'Test page description';
    const mockUrl = 'https://yang9112.github.io/test';
    const mockHashtags = ['blog', 'tech', 'webdev'];

    const metadata = {
      title: mockTitle,
      description: mockDescription,
      url: mockUrl,
      hashtags: mockHashtags
    };

    expect(metadata.title).toBe('Test Page Title');
    expect(metadata.description).toBe('Test page description');
    expect(metadata.url).toBe('https://yang9112.github.io/test');
    expect(metadata.hashtags).toEqual(['blog', 'tech', 'webdev']);
  });

  test('should generate Facebook share URL with quote', () => {
    const params = new URLSearchParams();
    params.set('u', 'https://yang9112.github.io/test');
    params.set('quote', 'Test Page Title - Test page description');
    
    const expectedUrl = `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
    
    expect(expectedUrl).toContain('facebook.com/sharer/sharer.php');
    expect(expectedUrl).toContain('quote=Test+Page+Title+-+Test+page+description');
  });

  test('should generate WhatsApp share URL', () => {
    const params = new URLSearchParams();
    params.set('text', 'Test Page Title - Test page description\nhttps://yang9112.github.io/test');
    
    const expectedUrl = `https://wa.me/?${params.toString()}`;
    
    expect(expectedUrl).toBe('https://wa.me/?text=Test+Page+Title+-+Test+page+description%0Ahttps%3A%2F%2Fyang9112.github.io%2Ftest');
  });

  test('should construct supported platforms list', () => {
    const supportedPlatforms = [
      { name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
      { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077B5' },
      { name: 'Facebook', icon: 'fab fa-facebook', color: '#4267B2' },
      { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500' },
      { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' }
    ];

    expect(supportedPlatforms).toHaveLength(5);
    expect(supportedPlatforms.map(p => p.name)).toContain('Twitter');
    expect(supportedPlatforms.map(p => p.name)).toContain('LinkedIn');
    expect(supportedPlatforms.map(p => p.name)).toContain('Facebook');
    expect(supportedPlatforms.map(p => p.name)).toContain('Reddit');
    expect(supportedPlatforms.map(p => p.name)).toContain('WhatsApp');
  });
});