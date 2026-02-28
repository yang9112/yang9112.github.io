/**
 * Social Sharing Module
 * Provides social media sharing functionality for the website
 */

interface SharingOptions {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
}

interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: string;
}

class SocialShare {
  private platforms: SocialPlatform[] = [
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      color: '#1DA1F2',
      shareUrl: 'https://twitter.com/intent/tweet'
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin',
      color: '#0077B5',
      shareUrl: 'https://www.linkedin.com/sharing/share-offsite/'
    },
    {
      name: 'Facebook',
      icon: 'fab fa-facebook',
      color: '#4267B2',
      shareUrl: 'https://www.facebook.com/sharer/sharer.php'
    },
    {
      name: 'Reddit',
      icon: 'fab fa-reddit',
      color: '#FF4500',
      shareUrl: 'https://reddit.com/submit'
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: '#25D366',
      shareUrl: 'https://wa.me/'
    }
  ];

  constructor() {
    this.init();
  }

  private init(): void {
    console.log('Social sharing module initialized');
  }

  /**
   * Get current page metadata for sharing
   */
  private getPageMetadata(): SharingOptions {
    const title = document.title || "Yang's Home";
    const description = this.getMetaContent('description') || "Not only a better work is needed, but also a good life is importance";
    const url = window.location.href;
    const hashtags = ['blog', 'tech', 'webdev'];

    return { title, description, url, hashtags };
  }

  /**
   * Get meta content by name
   */
  private getMetaContent(name: string): string {
    const meta = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
    return meta?.getAttribute('content') || '';
  }

  /**
   * Generate share URL for a specific platform
   */
  private generateShareUrl(platform: SocialPlatform, options: SharingOptions): string {
    const params = new URLSearchParams();
    
    switch (platform.name) {
      case 'Twitter':
        params.set('text', `${options.title} - ${options.description}`);
        params.set('url', options.url);
        if (options.hashtags) {
          params.set('hashtags', options.hashtags.join(','));
        }
        break;
      
      case 'LinkedIn':
        params.set('url', options.url);
        break;
      
      case 'Facebook':
        params.set('u', options.url);
        params.set('quote', `${options.title} - ${options.description}`);
        break;
      
      case 'Reddit':
        params.set('url', options.url);
        params.set('title', `${options.title} - ${options.description}`);
        break;
      
      case 'WhatsApp':
        params.set('text', `${options.title} - ${options.description}\n${options.url}`);
        break;
      
      default:
        return options.url;
    }

    return `${platform.shareUrl}?${params.toString()}`;
  }

  /**
   * Share on a specific platform
   */
  public share(platformName: string): void {
    const platform = this.platforms.find(p => p.name.toLowerCase() === platformName.toLowerCase());
    if (!platform) {
      console.error(`Platform "${platformName}" not supported`);
      return;
    }

    const options = this.getPageMetadata();
    const shareUrl = this.generateShareUrl(platform, options);
    
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  }

  /**
   * Copy link to clipboard
   */
  public async copyLink(): Promise<boolean> {
    const options = this.getPageMetadata();
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(options.url);
        this.showToast('链接已复制到剪贴板！');
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = options.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          this.showToast('链接已复制到剪贴板！');
          return true;
        } catch (error) {
          console.error('Fallback copy failed:', error);
          return false;
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      return false;
    }
  }

  /**
   * Show toast notification
   */
  private showToast(message: string): void {
    // Remove existing toast if any
    const existingToast = document.querySelector('.share-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Create share buttons HTML
   */
  public createShareButtons(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    const shareContainer = document.createElement('div');
    shareContainer.className = 'social-share-container';
    shareContainer.style.cssText = `
      padding: 20px 0;
      text-align: center;
      border-top: 1px solid #eee;
      margin-top: 30px;
    `;

    const title = document.createElement('h3');
    title.textContent = '分享这篇文章';
    title.style.cssText = `
      margin-bottom: 15px;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    `;

    // Create platform buttons
    this.platforms.forEach(platform => {
      const button = document.createElement('button');
      button.className = `share-btn share-btn-${platform.name.toLowerCase()}`;
      button.innerHTML = `<i class="${platform.icon}"></i> ${platform.name}`;
      button.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: ${platform.color};
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: opacity 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      `;

      button.addEventListener('click', () => this.share(platform.name));
      button.addEventListener('mouseenter', () => {
        button.style.opacity = '0.8';
      });
      button.addEventListener('mouseleave', () => {
        button.style.opacity = '1';
      });

      buttonsContainer.appendChild(button);
    });

    // Copy link button
    const copyButton = document.createElement('button');
    copyButton.className = 'share-btn share-btn-copy';
    copyButton.innerHTML = '<i class="fas fa-link"></i> 复制链接';
    copyButton.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      color: #666;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    `;

    copyButton.addEventListener('click', () => this.copyLink());
    copyButton.addEventListener('mouseenter', () => {
      copyButton.style.borderColor = '#007bff';
      copyButton.style.color = '#007bff';
    });
    copyButton.addEventListener('mouseleave', () => {
      copyButton.style.borderColor = '#ddd';
      copyButton.style.color = '#666';
    });

    buttonsContainer.appendChild(copyButton);

    shareContainer.appendChild(title);
    shareContainer.appendChild(buttonsContainer);
    container.appendChild(shareContainer);
  }

  /**
   * Get all available platforms
   */
  public getPlatforms(): SocialPlatform[] {
    return [...this.platforms];
  }
}

// Initialize and export
const socialShare = new SocialShare();

// Make available globally for easy access
(window as any).socialShare = socialShare;

export default socialShare;