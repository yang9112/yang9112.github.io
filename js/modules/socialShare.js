// Social Media Sharing Module
class SocialShare {
  constructor() {
    this.init();
  }

  init() {
    // Add share buttons to article content
    this.addShareButtons();
    // Initialize share functionality
    this.initShareEvents();
  }

  addShareButtons() {
    const articles = document.querySelectorAll('.article-entry');
    
    articles.forEach(article => {
      const title = document.querySelector('title')?.textContent || 'Yang\'s Home';
      const url = window.location.href;
      
      const shareContainer = document.createElement('div');
      shareContainer.className = 'social-share-container';
      shareContainer.innerHTML = `
        <div class="social-share">
          <span class="share-label">分享到：</span>
          <a href="#" class="share-btn share-weibo" data-platform="weibo" title="分享到微博">
            <i class="fab fa-weibo"></i>
          </a>
          <a href="#" class="share-btn share-twitter" data-platform="twitter" title="分享到Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="share-btn share-facebook" data-platform="facebook" title="分享到Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="share-btn share-linkedin" data-platform="linkedin" title="分享到LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="#" class="share-btn share-copy" data-platform="copy" title="复制链接">
            <i class="fas fa-link"></i>
          </a>
        </div>
      `;
      
      // Insert after article content
      if (article.firstChild) {
        article.appendChild(shareContainer);
      }
    });
  }

  initShareEvents() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.dataset.platform;
        this.share(platform);
      });
    });
  }

  share(platform) {
    const title = document.querySelector('title')?.textContent || 'Yang\'s Home';
    const url = window.location.href;
    const description = document.querySelector('meta[name="description"]')?.content || '';
    
    const shareUrls = {
      weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (platform === 'copy') {
      this.copyToClipboard(url);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  }

  copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showCopyMessage();
      }).catch(err => {
        console.error('Failed to copy: ', err);
        this.fallbackCopyToClipboard(text);
      });
    } else {
      this.fallbackCopyToClipboard(text);
    }
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyMessage();
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  showCopyMessage() {
    const copyButton = document.querySelector('.share-copy');
    const originalHTML = copyButton.innerHTML;
    
    copyButton.innerHTML = '<i class="fas fa-check"></i>';
    copyButton.style.color = '#4CAF50';
    
    setTimeout(() => {
      copyButton.innerHTML = originalHTML;
      copyButton.style.color = '';
    }, 2000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SocialShare();
});