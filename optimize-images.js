const { default: imagemin } = require('imagemin');
const imageminPngquant = require('imagemin-pngquant').default;
const imageminMozjpeg = require('imagemin-mozjpeg').default;
const imageminSvgo = require('imagemin-svgo').default;
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    console.log('Starting image optimization...');
    
    // Optimize PNG files
    const pngFiles = await imagemin(['img/*.png'], {
        destination: 'img/optimized/',
        plugins: [
            imageminPngquant({
                quality: [0.6, 0.8],
                speed: 4
            })
        ]
    });
    
    console.log('PNG files optimized:', pngFiles.length);
    
    // Optimize JPEG files
    const jpgFiles = await imagemin(['img/*.jpg', 'img/*.jpeg'], {
        destination: 'img/optimized/',
        plugins: [
            imageminMozjpeg({
                quality: 80,
                progressive: true
            })
        ]
    });
    
    console.log('JPEG files optimized:', jpgFiles.length);
    
    // Optimize SVG files  
    const svgFiles = await imagemin(['img/*.svg'], {
        destination: 'img/optimized/',
        plugins: [
            imageminSvgo({
                plugins: [
                    { name: 'removeDimensions', active: true },
                    { name: 'cleanupAttrs', active: true },
                    { name: 'mergeStyles', active: true },
                    { name: 'inlineStyles', active: true },
                    { name: 'removeDoctype', active: true },
                    { name: 'removeXMLProcInst', active: true },
                    { name: 'removeComments', active: true },
                    { name: 'removeMetadata', active: true },
                    { name: 'removeUselessDefs', active: true }
                ]
            })
        ]
    });
    
    console.log('SVG files optimized:', svgFiles.length);
    
    // Optimize Fancybox images
    await imagemin(['fancybox/*.png', 'fancybox/*.jpg', 'fancybox/*.jpeg'], {
        destination: 'fancybox/optimized/',
        plugins: [
            imageminPngquant({
                quality: [0.7, 0.9],
                speed: 4
            }),
            imageminMozjpeg({
                quality: 85,
                progressive: true
            })
        ]
    });
    
    console.log('Fancybox images optimized!');
    
    // Calculate compression savings
    const originalSizes = {};
    const optimizedSizes = {};
    
    // Calculate original sizes
    ['img/logo1.png', 'img/logo2.png', 'img/banner.jpg', 'img/author.jpg', 'img/jacman.jpg'].forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            originalSizes[file] = stats.size;
        }
    });
    
    // Calculate optimized sizes
    ['img/optimized/logo1.png', 'img/optimized/logo2.png', 'img/optimized/banner.jpg', 'img/optimized/author.jpg', 'img/optimized/jacman.jpg'].forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            optimizedSizes[file] = stats.size;
        }
    });
    
    console.log('\n=== Optimization Results ===');
    Object.keys(originalSizes).forEach(originalFile => {
        const optimizedFile = originalFile.replace('img/', 'img/optimized/');
        if (optimizedSizes[optimizedFile]) {
            const original = originalSizes[originalFile];
            const optimized = optimizedSizes[optimizedFile];
            const savings = ((original - optimized) / original * 100).toFixed(2);
            const savedKB = ((original - optimized) / 1024).toFixed(1);
            
            console.log(`${originalFile}: ${(original/1024).toFixed(1)}KB → ${(optimized/1024).toFixed(1)}KB (${savings}% saved, ${savedKB}KB)`);
        }
    });
}

optimizeImages().catch(console.error);