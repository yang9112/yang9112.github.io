class CommentsSystem {
    constructor() {
        this.storageKey = 'blog_comments';
        this.comments = [];
        this.loadComments();
        this.initializeEventListeners();
    }
    loadComments() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.comments = JSON.parse(stored);
            }
            catch (e) {
                console.warn('Failed to load comments from localStorage');
                this.comments = [];
            }
        }
    }
    saveComments() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days}天前`;
        if (hours > 0)
            return `${hours}小时前`;
        if (minutes > 0)
            return `${minutes}分钟前`;
        return '刚刚';
    }
    addComment(username, content, parentId) {
        const newComment = {
            id: this.generateId(),
            username: username.trim(),
            content: content.trim(),
            timestamp: Date.now(),
            replies: [],
            ...(parentId && { parentId })
        };
        if (parentId) {
            const parentComment = this.findComment(parentId);
            if (parentComment) {
                parentComment.replies.push(newComment);
            }
        }
        else {
            this.comments.unshift(newComment);
        }
        this.saveComments();
        this.renderComments();
        this.clearForm(parentId);
    }
    findComment(id, comments = this.comments) {
        for (const comment of comments) {
            if (comment.id === id)
                return comment;
            const found = this.findComment(id, comment.replies);
            if (found)
                return found;
        }
        return null;
    }
    deleteComment(id) {
        const deleteFromList = (comments) => {
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
    renderComments() {
        const container = document.getElementById('comments-container');
        if (!container)
            return;
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
    renderComment(comment, level) {
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
            ''}
      </div>
    `;
    }
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/onerror/gi, '');
    }
    showReplyForm(parentId) {
        const formContainer = document.getElementById(`reply-form-${parentId}`);
        if (!formContainer)
            return;
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
    cancelReply(parentId) {
        const formContainer = document.getElementById(`reply-form-${parentId}`);
        if (formContainer) {
            formContainer.style.display = 'none';
            formContainer.innerHTML = '';
        }
    }
    clearForm(parentId) {
        if (parentId) {
            const usernameInput = document.getElementById(`reply-username-${parentId}`);
            const contentInput = document.getElementById(`reply-content-${parentId}`);
            if (usernameInput)
                usernameInput.value = '';
            if (contentInput)
                contentInput.value = '';
            this.cancelReply(parentId);
        }
        else {
            const mainUsername = document.getElementById('comment-username');
            const mainContent = document.getElementById('comment-content');
            if (mainUsername)
                mainUsername.value = '';
            if (mainContent)
                mainContent.value = '';
        }
    }
    initializeEventListeners() {
        const submitBtn = document.getElementById('comment-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                var _a, _b;
                const username = (_a = document.getElementById('comment-username')) === null || _a === void 0 ? void 0 : _a.value;
                const content = (_b = document.getElementById('comment-content')) === null || _b === void 0 ? void 0 : _b.value;
                if (!(username === null || username === void 0 ? void 0 : username.trim())) {
                    alert('请输入用户名');
                    return;
                }
                if (!(content === null || content === void 0 ? void 0 : content.trim())) {
                    alert('请输入评论内容');
                    return;
                }
                this.addComment(username, content);
            });
        }
    }
    getCommentsCount() {
        const countComments = (comments) => {
            let count = comments.length;
            comments.forEach(comment => {
                count += countComments(comment.replies);
            });
            return count;
        };
        return countComments(this.comments);
    }
}
export default CommentsSystem;
//# sourceMappingURL=comments.js.map