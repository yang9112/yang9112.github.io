const fs = require('fs');
const path = require('path');

// Find all HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Fix security issues in HTML files
function fixSecurityIssues(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix Baidu Analytics security issue
    const oldBaiduPattern = /<!-- Analytics Begin -->[\s\S]*?<script[^>]*>[\s\S]*?document\.write\(unescape\(".*?h\.js%3F6c22fb185f3f5e48c548344f8e0a4dd9.*?"\)\);[\s\S]*?<\/script>[\s\S]*?<!-- Analytics End -->/g;
    const newBaiduCode = '<!-- Analytics Begin -->\n<!-- Modern Baidu Analytics with security best practices -->\n<script async src="https://hm.baidu.com/hm.js?6c22fb185f3f5e48c548344f8e0a4dd9"></script>\n<!-- Analytics End -->';
    
    if (oldBaiduPattern.test(content)) {
        content = content.replace(oldBaiduPattern, newBaiduCode);
        modified = true;
        console.log(`Fixed Baidu Analytics in ${filePath}`);
    }
    
    // Add CSP meta tag if not present
    const cspTag = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com https://hm.baidu.com; style-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com; font-src \'self\' https://cdnjs.cloudflare.com; img-src \'self\' data:; connect-src \'self\';">';
    if (!content.includes('Content-Security-Policy') && content.includes('<head>')) {
        content = content.replace('<head>', `<head>\n    ${cspTag}`);
        modified = true;
        console.log(`Added CSP header to ${filePath}`);
    }
    
    // Fix insecure HTTP MathJax
    content = content.replace(
        'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
        'https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
    );
    
    if (modified) {
        fs.writeFileSync(filePath, content);
    }
}

// Main execution
const htmlFiles = findHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files`);

htmlFiles.forEach(file => {
    fixSecurityIssues(file);
});

console.log('Security fixes completed!');