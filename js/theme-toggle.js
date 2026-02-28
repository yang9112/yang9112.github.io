// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', () => {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    document.body.appendChild(themeToggle);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }
    
    // Add dark theme styles
    const style = document.createElement('style');
    style.textContent = `
        .dark-theme {
            background: #1a1a1a !important;
            color: #e0e0e0 !important;
        }
        .dark-theme .header {
            background: #2d2d2d !important;
        }
        .dark-theme .article {
            background: #242424 !important;
            color: #e0e0e0 !important;
        }
        .dark-theme .nav {
            background: #333 !important;
        }
        .dark-theme a {
            color: #64b5f6 !important;
        }
        .dark-theme h1, .dark-theme h2, .dark-theme h3, .dark-theme h4 {
            color: #ffffff !important;
        }
        .dark-theme code, .dark-theme pre {
            background: #333 !important;
            color: #fff !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
    initThemeToggle();
}