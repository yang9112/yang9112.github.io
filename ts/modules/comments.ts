/**
 * 评论系统模块 - 现代化本地存储评论组件
 * 支持用户名、内容、时间戳和回复功能
 */

interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: number;
  replies: Comment[];
  parentId?: string | undefined;
}

class CommentsSystem {
  private storageKey = 'blog_comments';
  private comments: Comment[] = [];
  
  constructor() {
    this.loadComments();
    this.initializeEventListeners();
  }

  /**
   * 从本地存储加载评论
   */
  private loadComments(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.comments = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load comments from localStorage');
        this.comments = [];
      }
    }
  }

  /**
   * 保存评论到本地存储
   */
  private saveComments(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 格式化时间戳
   */
  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  }

  /**
   * 添加新评论
   */
  public addComment(username: string, content: string, parentId?: string): void {
    const newComment: Comment = {
      id: this.generateId(),
      username: username.trim(),
      content: content.trim(),
      timestamp: Date.now(),
      replies: [],
      ...(parentId && { parentId })
    };

    if (parentId) {
      // 添加回复
      const parentComment = this.findComment(parentId);
      if (parentComment) {
        parentComment.replies.push(newComment);
      }
    } else {
      // 添加根级评论
      this.comments.unshift(newComment);
    }

    this.saveComments();
    this.renderComments();
    
    // 清空表单
    this.clearForm(parentId);
  }

  /**
   * 查找评论
   */
  private findComment(id: string, comments: Comment[] = this.comments): Comment | null {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      const found = this.findComment(id, comment.replies);
      if (found) return found;
    }
    return null;
  }

  /**
   * 删除评论
   */
  public deleteComment(id: string): void {
    const deleteFromList = (comments: Comment[]): boolean => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === id) {
          comments.splice(i, 1);
          return true;
        }
        if (deleteFromList(comments[i].replies)) {
          return true;
        }
      }
      return false;
    };

    if (deleteFromList(this.comments)) {
      this.saveComments();
      this.renderComments();
    }
  }

  /**
   * 渲染评论列表
   */
  public renderComments(): void {
    const container = document.getElementById('comments-container');
    if (!container) return;

    if (this.comments.length === 0) {
      container.innerHTML = `
        <div class="no-comments">
          <p>暂无评论，来发表第一条评论吧！</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.comments
      .map(comment => this.renderComment(comment, 0))
      .join('');
  }

  /**
   * 渲染单个评论
   */
  private renderComment(comment: Comment, level: number): string {
    const indentClass = level > 0 ? 'comment-reply' : '';
    const marginLeft = level * 30;

    return `
      <div class="comment ${indentClass}" style="margin-left: ${marginLeft}px;" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="comment-meta">
            <span class="username">${this.escapeHtml(comment.username)}</span>
            <span class="timestamp">${this.formatTimestamp(comment.timestamp)}</span>
          </div>
        </div>
        <div class="comment-content">
          ${this.escapeHtml(comment.content).replace(/\n/g, '<br>')}
        </div>
        <div class="comment-actions">
          <button class="reply-btn" onclick="commentsSystem.showReplyForm('${comment.id}')">
            <i class="fas fa-reply"></i> 回复
          </button>
          <button class="delete-btn" onclick="commentsSystem.deleteComment('${comment.id}')">
            <i class="fas fa-trash"></i> 删除
          </button>
        </div>
        <div id="reply-form-${comment.id}" class="reply-form" style="display: none;"></div>
        ${comment.replies.length > 0 ? 
          comment.replies.map(reply => this.renderComment(reply, level + 1)).join('') : 
          ''
        }
      </div>
    `;
  }

  /**
   * HTML转义
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/onerror/gi, '');
  }

  /**
   * 显示回复表单
   */
  public showReplyForm(parentId: string): void {
    const formContainer = document.getElementById(`reply-form-${parentId}`);
    if (!formContainer) return;

    formContainer.innerHTML = `
      <div class="comment-form">
        <div class="form-group">
          <input type="text" id="reply-username-${parentId}" placeholder="用户名" maxlength="50">
        </div>
        <div class="form-group">
          <textarea id="reply-content-${parentId}" placeholder="写下你的回复..." rows="3" maxlength="500"></textarea>
        </div>
        <div class="form-actions">
          <button onclick="commentsSystem.addComment(
            document.getElementById('reply-username-${parentId}').value,
            document.getElementById('reply-content-${parentId}').value,
            '${parentId}'
          )" class="submit-btn">
            <i class="fas fa-paper-plane"></i> 发表回复
          </button>
          <button onclick="commentsSystem.cancelReply('${parentId}')" class="cancel-btn">
            取消
          </button>
        </div>
      </div>
    `;

    formContainer.style.display = 'block';
  }

  /**
   * 取消回复
   */
  public cancelReply(parentId: string): void {
    const formContainer = document.getElementById(`reply-form-${parentId}`);
    if (formContainer) {
      formContainer.style.display = 'none';
      formContainer.innerHTML = '';
    }
  }

  /**
   * 清空表单
   */
  private clearForm(parentId?: string): void {
    if (parentId) {
      const usernameInput = document.getElementById(`reply-username-${parentId}`) as HTMLInputElement;
      const contentInput = document.getElementById(`reply-content-${parentId}`) as HTMLTextAreaElement;
      if (usernameInput) usernameInput.value = '';
      if (contentInput) contentInput.value = '';
      this.cancelReply(parentId);
    } else {
      const mainUsername = document.getElementById('comment-username') as HTMLInputElement;
      const mainContent = document.getElementById('comment-content') as HTMLTextAreaElement;
      if (mainUsername) mainUsername.value = '';
      if (mainContent) mainContent.value = '';
    }
  }

  /**
   * 初始化事件监听器
   */
  private initializeEventListeners(): void {
    const submitBtn = document.getElementById('comment-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const username = (document.getElementById('comment-username') as HTMLInputElement)?.value;
        const content = (document.getElementById('comment-content') as HTMLTextAreaElement)?.value;
        
        if (!username?.trim()) {
          alert('请输入用户名');
          return;
        }
        
        if (!content?.trim()) {
          alert('请输入评论内容');
          return;
        }
        
        this.addComment(username, content);
      });
    }
  }

  /**
   * 获取评论统计
   */
  public getCommentsCount(): number {
    const countComments = (comments: Comment[]): number => {
      let count = comments.length;
      comments.forEach(comment => {
        count += countComments(comment.replies);
      });
      return count;
    };
    return countComments(this.comments);
  }
}

// 初始化评论系统
declare global {
  interface Window {
    commentsSystem: CommentsSystem;
  }
}

export default CommentsSystem;