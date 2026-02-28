/**
 * 现代化评论系统 - Gitalk 集成
 * 替换已废弃的 Duoshuo 评论系统
 */

(function() {
  'use strict';

  // Gitalk 配置
  var gitalkConfig = {
    clientID: 'GitHub OAuth App Client ID', // 需要替换为实际的 Client ID
    clientSecret: 'GitHub OAuth App Client Secret', // 需要替换为实际的 Client Secret
    repo: 'yang9112.github.io', // 仓库名称
    owner: 'yang9112', // 仓库所有者
    admin: ['yang9112'], // 仓库管理员
    id: location.pathname, // 页面唯一标识
    distractionFreeMode: false, // 是否启用无干扰模式
    language: 'zh-CN', // 语言设置
    pagerDirection: 'first', // 评论排序方向
    createIssueManually: false, // 是否手动创建 issue
    updateCountCallback: function(commentCount) {
      // 更新评论数的回调函数
      var commentElements = document.querySelectorAll('.comment-count');
      commentElements.forEach(function(element) {
        element.textContent = commentCount + ' 条评论';
      });
    }
  };

  // 初始化评论系统
  function initComments() {
    // 检查是否有评论容器
    var commentContainer = document.getElementById('gitalk-container');
    if (!commentContainer) {
      console.warn('评论容器 #gitalk-container 未找到');
      return;
    }

    // 加载 Gitalk
    loadGitalk(function() {
      if (typeof Gitalk !== 'undefined') {
        var gitalk = new Gitalk(gitalkConfig);
        gitalk.render('gitalk-container');
        
        // 添加加载完成标记
        commentContainer.classList.add('comments-loaded');
        console.log('Gitalk 评论系统加载完成');
      } else {
        console.error('Gitalk 加载失败');
      }
    });
  }

  // 动态加载 Gitalk
  function loadGitalk(callback) {
    // 检查是否已经加载
    if (typeof Gitalk !== 'undefined') {
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = callback;
    script.onerror = function() {
      console.error('Gitalk 脚本加载失败');
    };

    // 加载 Gitalk CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
    link.type = 'text/css';

    document.head.appendChild(link);
    document.head.appendChild(script);
  }

  // 评论系统状态管理
  var CommentSystem = {
    isLoaded: false,
    
    // 初始化评论系统
    init: function() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComments);
      } else {
        initComments();
      }
    },

    // 刷新评论
    refresh: function() {
      var commentContainer = document.getElementById('gitalk-container');
      if (commentContainer) {
        commentContainer.innerHTML = '';
        this.init();
      }
    },

    // 获取评论数
    getCommentCount: function() {
      // Gitalk 会自动更新评论数
      return document.querySelectorAll('.gitalk-comment-count').length;
    },

    // 检查评论系统状态
    checkStatus: function() {
      var commentContainer = document.getElementById('gitalk-container');
      return commentContainer && commentContainer.classList.contains('comments-loaded');
    }
  };

  // 页面加载时初始化评论系统
  CommentSystem.init();

  // 暴露到全局作用域（如果需要）
  window.CommentSystem = CommentSystem;

})();