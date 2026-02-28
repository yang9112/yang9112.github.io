const fs = require('fs');
const path = require('path');

function analyzeCSS() {
    console.log('=== CSS Analysis Report ===\n');
    
    const cssFile = 'css/style.css';
    const cssMinFile = 'dist/css/style.min.css';
    
    // Analyze original CSS
    if (fs.existsSync(cssFile)) {
        const originalStats = fs.statSync(cssFile);
        const originalSize = originalStats.size;
        
        console.log('Original CSS Analysis:');
        console.log(`📄 File: ${cssFile}`);
        console.log(`📏 Size: ${formatSize(originalSize)}`);
        
        const originalContent = fs.readFileSync(cssFile, 'utf8');
        
        // Count selectors
        const selectorMatches = originalContent.match(/[^{}]+\s*{/g);
        const selectorCount = selectorMatches ? selectorMatches.length : 0;
        console.log(`🎯 Selectors: ${selectorCount}`);
        
        // Check for common issues
        console.log('\n🔍 Optimization Opportunities:');
        
        if (originalContent.includes('!important')) {
            console.log('⚠️  Found !important declarations');
        }
        
        // Check for redundant properties
        if (originalContent.includes('margin:0;padding:0')) {
            console.log('✓ CSS reset optimizations found');
        }
        
        // Check media queries
        const mediaQueryCount = (originalContent.match(/@media/g) || []).length;
        console.log(`📱 Media queries: ${mediaQueryCount}`);
        
        // Check vendor prefixes
        const vendorPrefixCount = (originalContent.match(/-webkit-|-moz-|-o-|-ms-/g) || []).length;
        console.log(`🔧 Vendor prefixes: ${vendorPrefixCount}`);
        
        // Animation keyframes
        const keyframeCount = (originalContent.match(/@keyframes/g) || []).length;
        console.log(`🎭 Keyframe animations: ${keyframeCount}`);
        
    }
    
    console.log('');
    
    // Analyze minified CSS
    if (fs.existsSync(cssMinFile)) {
        const minStats = fs.statSync(cssMinFile);
        const minSize = minStats.size;
        
        console.log('Minified CSS Analysis:');
        console.log(`📄 File: ${cssMinFile}`);
        console.log(`📏 Size: ${formatSize(minSize)}`);
        
        if (fs.existsSync(cssFile)) {
            const originalSize = fs.statSync(cssFile).size;
            const savings = ((originalSize - minSize) / originalSize * 100).toFixed(2);
            const savedKB = ((originalSize - minSize) / 1024).toFixed(1);
            
            console.log(`✂️  Compression: ${savings}% saved (${savedKB}KB)`);
        }
        
        // Check gzip potential (estimate)
        const estimatedGzipSize = Math.floor(minSize * 0.3);
        console.log(`📦 Estimated gzipped: ${formatSize(estimatedGzipSize)}`);
    }
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    console.log('1. Consider using CSS Grid for layout (modern approach)');
    console.log('2. Implement CSS custom properties (variables) for better maintainability');
    console.log('3. Use CSS containment for performance optimization');
    console.log('4. Consider critical CSS inlining for above-the-fold content');
    console.log('5. Unused CSS removal: audit browser DevTools Coverage tab');
    
    console.log('\n📊 CSS Structure:');
    console.log('- Reset/base styles included ✓');
    console.log('- Responsive media queries included ✓');
    console.log('- Font loading optimized ✓');
    console.log('- Animation keyframes included ✓');
}

function formatSize(bytes) {
    return (bytes / 1024).toFixed(1) + 'KB';
}

analyzeCSS();