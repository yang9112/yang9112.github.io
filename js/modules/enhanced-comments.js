/**
 * Enhanced Comments System
 * Features: moderation, real-time updates, rich text, threading
 */

class EnhancedComments {
    constructor(options = {}) {
        this.options = {
            container: '#comments',
            apiUrl: '/api/comments',
            enableReplies: true,
            enableModeration: false,
            enableRichText: true,
            maxCharacters: 1000,
            autoSave: true,
            ...options
        };
        
        this.comments = [];
        this.currentUser = null;
        this.sortBy = 'newest';
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadCurrentUser();
            await this.loadComments();
            this.setupEventListeners();
            this.render();
        } catch (error) {
            console.error('Failed to initialize comments:', error);
            this.showError('评论系统加载失败，请刷新页面重试');
        }
    }

    setupEventListeners() {
        // Form submission
        const form = document.querySelector('#comment-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Character counter
        const textarea = document.querySelector('#comment-text');
        if (textarea) {
            textarea.addEventListener('input', (e) => this.updateCharacterCount(e));
        }

        // Rich text editor (if enabled)
        if (this.options.enableRichText) {
            this.setupRichTextEditor();
        }

        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSort(e));
        });
    }

    async loadCurrentUser() {
        try {
            // Mock user data - in real app, this would come from auth system
            this.currentUser = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                name: '访客用户',
                avatar: null,
                email: null
            };
        } catch (error) {
            console.warn('Failed to load user:', error);
        }
    }

    async loadComments() {
        this.isLoading = true;
        try {
            // Mock data - in real app, this would be an API call
            const mockComments = [
                {
                    id: '1',
                    author: '张三',
                    content: '这个网站设计得真不错！界面简洁美观，加载速度也很快。',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    likes: 5,
                    replies: [
                        {
                            id: '1-1',
                            author: '李四',
                            content: '同意楼上的观点，特别是深色模式的设计很贴心。',
                            timestamp: new Date(Date.now() - 1800000).toISOString(),
                            likes: 2
                        }
                    ]
                },
                {
                    id: '2',
                    author: '王五',
                    content: '请问网站的源码是开源的吗？想学习一下前端开发技术。',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    likes: 3
                }
            ];
            
            this.comments = mockComments;
        } catch (error) {
            console.error('Failed to load comments:', error);
            this.comments = [];
        } finally {
            this.isLoading = false;
        }
    }

    render() {
        const container = document.querySelector(this.options.container);
        if (!container) return;

        container.innerHTML = `
            <div class="comments-section">
                ${this.renderHeader()}
                ${this.renderForm()}
                ${this.renderCommentsList()}
                ${this.renderLoadMore()}
            </div>
        `;

        this.attachEventListeners();
    }

    renderHeader() {
        return `
            <div class="comments-header">
                <div class="comments-count">共 ${this.getTotalComments()} 条评论</div>
                <div class="comments-sort">
                    <button class="sort-btn ${this.sortBy === 'newest' ? 'active' : ''}" data-sort="newest">
                        最新
                    </button>
                    <button class="sort-btn ${this.sortBy === 'popular' ? 'active' : ''}" data-sort="popular">
                        最热
                    </button>
                    <button class="sort-btn ${this.sortBy === 'oldest' ? 'active' : ''}" data-sort="oldest">
                        最早
                    </button>
                </div>
            </div>
        `;
    }

    renderForm() {
        if (!this.currentUser) {
            return `
                <div class="login-prompt">
                    <p>请登录后发表评论</p>
                </div>
            `;
        }

        return `
            <div class="comment-form">
                <form id="comment-form">
                    <div class="form-group">
                        <label class="form-label" for="comment-text">发表评论</label>
                        <textarea 
                            id="comment-text" 
                            class="form-textarea" 
                            placeholder="分享你的想法..."
                            maxlength="${this.options.maxCharacters}"
                            required
                        ></textarea>
                        <div class="character-count">
                            <span id="char-count">0</span> / ${this.options.maxCharacters}
                        </div>
                    </div>
                    
                    ${this.options.enableRichText ? this.renderRichTextToolbar() : ''}
                    
                    <div class="form-toolbar">
                        <div class="toolbar-actions">
                            ${this.options.enableRichText ? `
                                <button type="button" class="toolbar-btn" data-action="bold">
                                    <strong>B</strong>
                                </button>
                                <button type="button" class="toolbar-btn" data-action="italic">
                                    <em>I</em>
                                </button>
                                <button type="button" class="toolbar-btn" data-action="link">
                                    🔗
                                </button>
                            ` : ''}
                        </div>
                        <button type="submit" class="submit-btn" id="submit-btn">
                            发表评论
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    renderRichTextToolbar() {
        return `
            <div class="rich-text-toolbar">
                <div class="toolbar-actions">
                    <button type="button" class="toolbar-btn" data-action="bold">
                        <strong>B</strong>
                    </button>
                    <button type="button" class="toolbar-btn" data-action="italic">
                        <em>I</em>
                    </button>
                    <button type="button" class="toolbar-btn" data-action="link">
                        🔗
                    </button>
                    <button type="button" class="toolbar-btn" data-action="code">
                        &lt;/&gt;
                    </button>
                    <button type="button" class="toolbar-btn" data-action="quote">
                        ❝
                    </button>
                </div>
            </div>
        `;
    }

    renderCommentsList() {
        if (this.isLoading) {
            return '<div class="loading">加载评论中...</div>';
        }

        if (this.comments.length === 0) {
            return '<div class="no-comments">还没有评论，来发表第一条评论吧！</div>';
        }

        const sortedComments = this.sortComments(this.comments);
        
        return `
            <div class="comments-list">
                ${sortedComments.map(comment => this.renderComment(comment)).join('')}
            </div>
        `;
    }

    renderComment(comment, isReply = false) {
        if (isReply) {
            return `
                <div class="reply-item" data-comment-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-avatar">
                            ${comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div class="comment-meta">
                            <div class="comment-author">${comment.author}</div>
                            <div class="comment-time">${this.formatTime(comment.timestamp)}</div>
                        </div>
                    </div>
                    <div class="comment-content">
                        ${this.formatContent(comment.content)}
                    </div>
                    <div class="comment-actions">
                        <button class="action-btn" data-action="like">
                            👍 ${comment.likes || 0}
                        </button>
                        ${this.options.enableReplies ? `
                            <button class="action-btn" data-action="reply">
                                💬 回复
                            </button>
                        ` : ''}
                        ${this.options.enableModeration && this.currentUser?.id === comment.author ? `
                            <button class="action-btn" data-action="edit">
                                ✏️ 编辑
                            </button>
                            <button class="action-btn" data-action="delete">
                                🗑️ 删除
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        return `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-avatar">
                        ${comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div class="comment-meta">
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-time">${this.formatTime(comment.timestamp)}</div>
                    </div>
                    <div class="comment-actions">
                        <button class="action-btn" data-action="like">
                            👍 ${comment.likes || 0}
                        </button>
                        ${this.options.enableReplies ? `
                            <button class="action-btn" data-action="reply">
                                💬 回复
                            </button>
                        ` : ''}
                        ${this.options.enableModeration && this.currentUser?.id === comment.author ? `
                            <button class="action-btn" data-action="edit">
                                ✏️ 编辑
                            </button>
                            <button class="action-btn" data-action="delete">
                                🗑️ 删除
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="comment-content">
                    ${this.formatContent(comment.content)}
                </div>
                ${this.options.enableReplies && comment.replies?.length > 0 ? `
                    <div class="replies-section">
                        <div class="replies-list">
                            ${comment.replies.map(reply => this.renderComment(reply, true)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderLoadMore() {
        if (this.comments.length === 0) return '';
        
        return `
            <button class="load-more-btn" id="load-more-comments">
                加载更多评论
            </button>
        `;
    }

    attachEventListeners() {
        // Comment actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction(e);
            });
        });

        // Rich text toolbar
        document.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRichTextAction(e);
            });
        });

        // Load more
        const loadMoreBtn = document.querySelector('#load-more-comments');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreComments());
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const textarea = document.querySelector('#comment-text');
        const content = textarea.value.trim();
        
        if (!content) {
            this.showError('请输入评论内容');
            return;
        }

        this.submitComment(content);
    }

    async submitComment(content) {
        const submitBtn = document.querySelector('#submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '发布中...';

            const newComment = {
                id: 'comment_' + Date.now(),
                author: this.currentUser.name,
                content: content,
                timestamp: new Date().toISOString(),
                likes: 0,
                replies: []
            };

            // Add to beginning of array for newest first
            this.comments.unshift(newComment);
            
            // Clear form
            document.querySelector('#comment-text').value = '';
            this.updateCharacterCount({ target: { value: '' } });
            
            // Re-render
            this.render();
            
            this.showSuccess('评论发表成功！');
            
        } catch (error) {
            console.error('Failed to submit comment:', error);
            this.showError('评论发表失败，请重试');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    handleAction(e) {
        const button = e.currentTarget;
        const action = button.dataset.action;
        const commentElement = button.closest('[data-comment-id]');
        const commentId = commentElement.dataset.commentId;
        
        switch (action) {
            case 'like':
                this.likeComment(commentId);
                break;
            case 'reply':
                this.replyToComment(commentId);
                break;
            case 'edit':
                this.editComment(commentId);
                break;
            case 'delete':
                this.deleteComment(commentId);
                break;
        }
    }

    likeComment(commentId) {
        const comment = this.findComment(commentId);
        if (comment) {
            comment.likes = (comment.likes || 0) + 1;
            this.render();
        }
    }

    replyToComment(commentId) {
        const textarea = document.querySelector('#comment-text');
        textarea.value = `@${this.findComment(commentId).author} `;
        textarea.focus();
        this.updateCharacterCount({ target: textarea });
    }

    findComment(commentId) {
        // Search in main comments
        let comment = this.comments.find(c => c.id === commentId);
        if (comment) return comment;
        
        // Search in replies
        for (const mainComment of this.comments) {
            if (mainComment.replies) {
                comment = mainComment.replies.find(r => r.id === commentId);
                if (comment) return comment;
            }
        }
        
        return null;
    }

    handleSort(e) {
        const button = e.currentTarget;
        this.sortBy = button.dataset.sort;
        
        // Update active state
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        this.render();
    }

    sortComments(comments) {
        const sorted = [...comments];
        
        switch (this.sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            case 'popular':
                return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            default:
                return sorted;
        }
    }

    updateCharacterCount(e) {
        const textarea = e.target;
        const count = textarea.value.length;
        const counter = document.querySelector('#char-count');
        const submitBtn = document.querySelector('#submit-btn');
        
        if (counter) {
            counter.textContent = count;
            counter.style.color = count > this.options.maxCharacters * 0.9 ? '#ff6b6b' : '#666';
        }
        
        if (submitBtn) {
            submitBtn.disabled = count === 0 || count > this.options.maxCharacters;
        }
    }

    handleRichTextAction(e) {
        const action = e.currentTarget.dataset.action;
        const textarea = document.querySelector('#comment-text');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let replacement = '';
        
        switch (action) {
            case 'bold':
                replacement = `**${selectedText || '粗体文本'}**`;
                break;
            case 'italic':
                replacement = `*${selectedText || '斜体文本'}*`;
                break;
            case 'code':
                replacement = `\`${selectedText || '代码'}\``;
                break;
            case 'quote':
                replacement = `> ${selectedText || '引用文本'}`;
                break;
            case 'link':
                const url = prompt('请输入链接地址:', 'https://');
                if (url) {
                    replacement = `[${selectedText || '链接文本'}](${url})`;
                }
                break;
        }
        
        if (replacement) {
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
            this.updateCharacterCount({ target: textarea });
        }
    }

    formatContent(content) {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 30) return `${days}天前`;
        
        return date.toLocaleDateString('zh-CN');
    }

    getTotalComments() {
        let total = this.comments.length;
        this.comments.forEach(comment => {
            if (comment.replies) {
                total += comment.replies.length;
            }
        });
        return total;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            border-radius: 6px;
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#comments');
    if (container) {
        new EnhancedComments();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedComments;
}