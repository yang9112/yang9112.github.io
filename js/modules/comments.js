// Modern Comment System with local storage
class CommentSystem {
  constructor() {
    this.comments = this.loadComments();
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  init() {
    this.addCommentSection();
    this.initEvents();
    this.renderComments();
  }

  loadComments() {
    const stored = localStorage.getItem('blogComments');
    return stored ? JSON.parse(stored) : [];
  }

  saveComments() {
    localStorage.setItem('blogComments', JSON.stringify(this.comments));
  }

  getCurrentUser() {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  addCommentSection() {
    const articles = document.querySelectorAll('.article-entry');
    
    articles.forEach(article => {
      const commentSection = document.createElement('div');
      commentSection.className = 'comment-section';
      commentSection.innerHTML = `
        <div class="comments-header">
          <h3><i class="fas fa-comments"></i> 评论区 (${this.comments.length})</h3>
          <div class="comment-sort">
            <select id="commentSort">
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
            </select>
          </div>
        </div>
        
        <div class="comment-form-container">
          ${this.renderCommentForm()}
        </div>
        
        <div class="comments-list" id="commentsList">
          <!-- Comments will be rendered here -->
        </div>
      `;
      
      article.appendChild(commentSection);
    });
  }

  renderCommentForm() {
    if (this.currentUser) {
      return `
        <div class="comment-form">
          <div class="user-info">
            <img src="${this.currentUser.avatar}" alt="avatar" class="user-avatar">
            <div class="user-details">
              <div class="user-name">${this.currentUser.name}</div>
              <button class="change-user-btn" onclick="commentSystem.changeUser()">
                <i class="fas fa-exchange-alt"></i> 切换账号
              </button>
            </div>
          </div>
          <textarea 
            id="commentText" 
            placeholder="写下你的想法..." 
            rows="3"
          ></textarea>
          <div class="comment-actions">
            <button type="button" class="submit-comment-btn" onclick="commentSystem.submitComment()">
              <i class="fas fa-paper-plane"></i> 发表评论
            </button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="login-prompt">
          <i class="fas fa-user-circle"></i>
          <div class="login-content">
            <h4>加入讨论</h4>
            <p>请先登录以发表评论</p>
            <div class="login-form">
              <input type="text" id="userName" placeholder="您的昵称" required>
              <input type="email" id="userEmail" placeholder="您的邮箱" required>
              <button type="button" onclick="commentSystem.login()">快速登录</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  initEvents() {
    const sortSelect = document.getElementById('commentSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.renderComments();
      });
    }
  }

  login() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    if (!name || !email) {
      this.showMessage('请填写昵称和邮箱', 'error');
      return;
    }

    const user = {
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4CAF50&color=fff`
    };

    this.saveCurrentUser(user);
    this.showMessage('登录成功！', 'success');
    
    // Refresh UI
    this.refreshCommentSection();
  }

  changeUser() {
    if (confirm('确定要切换账号吗？')) {
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      this.refreshCommentSection();
    }
  }

  refreshCommentSection() {
    const formContainer = document.querySelector('.comment-form-container');
    if (formContainer) {
      formContainer.innerHTML = this.renderCommentForm();
    }
  }

  submitComment() {
    const textarea = document.getElementById('commentText');
    const content = textarea.value.trim();
    
    if (!content) {
      this.showMessage('请输入评论内容', 'error');
      return;
    }

    const comment = {
      id: Date.now(),
      content,
      author: {
        name: this.currentUser.name,
        avatar: this.currentUser.avatar
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false
    };

    this.comments.unshift(comment);
    this.saveComments();
    this.renderComments();
    
    // Clear form
    textarea.value = '';
    this.showMessage('评论发表成功！', 'success');
  }

  renderComments() {
    const commentsList = document.getElementById('commentsList');
    const sortSelect = document.getElementById('commentSort');
    
    if (!commentsList) return;

    let sortedComments = [...this.comments];
    const sortBy = sortSelect?.value || 'newest';
    
    if (sortBy === 'oldest') {
      sortedComments.reverse();
    }

    commentsList.innerHTML = sortedComments.map(comment => this.renderComment(comment)).join('');
    
    // Update comment count
    const header = document.querySelector('.comments-header h3');
    if (header) {
      header.innerHTML = `<i class="fas fa-comments"></i> 评论区 (${this.comments.length})`;
    }
  }

  renderComment(comment) {
    const date = new Date(comment.timestamp);
    const formattedDate = this.formatDate(date);
    
    return `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-avatar">
          <img src="${comment.author.avatar}" alt="${comment.author.name}">
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${comment.author.name}</span>
            <span class="comment-time">${formattedDate}</span>
          </div>
          <div class="comment-body">
            ${this.escapeHtml(comment.content)}
          </div>
          <div class="comment-actions">
            <button class="like-btn ${comment.liked ? 'liked' : ''}" onclick="commentSystem.likeComment(${comment.id})">
              <i class="fas fa-thumbs-up"></i>
              <span>${comment.likes}</span>
            </button>
            <button class="reply-btn" onclick="commentSystem.replyComment(${comment.id})">
              <i class="fas fa-reply"></i> 回复
            </button>
            ${this.canDeleteComment(comment) ? `
              <button class="delete-btn" onclick="commentSystem.deleteComment(${comment.id})">
                <i class="fas fa-trash"></i> 删除
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  likeComment(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      if (comment.liked) {
        comment.likes--;
        comment.liked = false;
      } else {
        comment.likes++;
        comment.liked = true;
      }
      this.saveComments();
      this.renderComments();
    }
  }

  deleteComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
      this.comments = this.comments.filter(c => c.id !== commentId);
      this.saveComments();
      this.renderComments();
      this.showMessage('评论已删除', 'success');
    }
  }

  replyComment(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      const textarea = document.getElementById('commentText');
      if (textarea) {
        textarea.value = `@${comment.author.name} `;
        textarea.focus();
      }
    }
  }

  canDeleteComment(comment) {
    return this.currentUser && this.currentUser.name === comment.author.name;
  }

  formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showMessage(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.commentSystem = new CommentSystem();
});