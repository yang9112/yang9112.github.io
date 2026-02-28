// Loading animation functionality
function initLoadingAnimation() {
    const loadingHTML = `
        <div id="loading-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.5s ease-out;
        ">
            <div style="position: relative; width: 80px; height: 80px;">
                <div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 8px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                "></div>
                <div style="
                    position: absolute;
                    width: 60%;
                    height: 60%;
                    border-radius: 50%;
                    border: 6px solid rgba(255, 255, 255, 0.3);
                    border-bottom-color: white;
                    animation: spin 1.5s linear infinite reverse;
                    top: 20%;
                    left: 20%;
                "></div>
            </div>
            <div style="
                position: absolute;
                bottom: 30%;
                color: white;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 18px;
                animation: pulse 2s ease-in-out infinite;
            ">Loading amazing content...</div>
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 0.6; transform: translateY(0); }
                50% { opacity: 1; transform: translateY(-10px); }
            }
        </style>
    `;
    
    // Insert loading overlay at the beginning of body
    document.body.insertAdjacentHTML("afterbegin", loadingHTML);
    
    // Hide loading overlay when page is fully loaded
    window.addEventListener("load", function() {
        setTimeout(() => {
            const overlay = document.getElementById("loading-overlay");
            if (overlay) {
                overlay.style.opacity = "0";
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }
        }, 1000); // Minimum display time for better UX
    });
    
    // Fallback: hide after 5 seconds even if load event doesn't fire
    setTimeout(() => {
        const overlay = document.getElementById("loading-overlay");
        if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    }, 5000);
}

// Initialize loading animation when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoadingAnimation);
} else {
    initLoadingAnimation();
}