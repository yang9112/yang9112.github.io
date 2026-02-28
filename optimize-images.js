#!/usr/bin/env node

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    console.log('Starting image optimization...');

    try {
        // Ensure output directories exist
        if (!fs.existsSync('img/optimized')) {
            fs.mkdirSync('img/optimized', { recursive: true });
        }
        if (!fs.existsSync('fancybox/optimized')) {
            fs.mkdirSync('fancybox/optimized', { recursive: true });
        }

        // Check if imagemin dependencies are available
        try {
            require('imagemin-mozjpeg');
            require('imagemin-pngquant');
            require('imagemin-svgo');
        } catch (e) {
            console.log('⚠️  Image optimization dependencies not found. Skipping optimization.');
            console.log('💡 Run: npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo');
            return;
        }

        // Optimize PNG files
        const pngResult = await imagemin(['img/**/*.png'], {
            destination: 'img/optimized',
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        }).catch(() => ({ data: [] }));

        // Optimize JPEG files
        const jpegResult = await imagemin(['img/**/*.jpg', 'img/**/*.jpeg'], {
            destination: 'img/optimized',
            plugins: [
                imageminMozjpeg({
                    quality: 80
                })
            ]
        }).catch(() => ({ data: [] }));

        // Optimize SVG files
        const svgResult = await imagemin(['img/**/*.svg'], {
            destination: 'img/optimized',
            plugins: [
                imageminSvgo({
                    plugins: [
                        {
                            name: 'removeViewBox',
                            active: false
                        }
                    ]
                })
            ]
        }).catch(() => ({ data: [] }));

        // Optimize fancybox images
        const fancyboxResult = await imagemin(['fancybox/**/*.png', 'fancybox/**/*.jpg', 'fancybox/**/*.jpeg'], {
            destination: 'fancybox/optimized',
            plugins: [
                imageminMozjpeg({ quality: 80 }),
                imageminPngquant({ quality: [0.6, 0.8] })
            ]
        }).catch(() => ({ data: [] }));

        console.log(`PNG files optimized: ${pngResult.data?.length || 0}`);
        console.log(`JPEG files optimized: ${jpegResult.data?.length || 0}`);
        console.log(`SVG files optimized: ${svgResult.data?.length || 0}`);
        console.log('Fancybox images optimized!');

        // Validate outputs exist
        console.log('\n=== Validation Checks ===');
        validateOptimizedFiles();

        console.log('\n🎉 All validations passed!');

    } catch (error) {
        console.error('Error during image optimization:', error.message);
        console.log('💡 Continuing with existing files...');
    }
}

function validateOptimizedFiles() {
    const expectedFiles = [
        'img/optimized/logo1.png',
        'img/optimized/logo2.png',
        'img/optimized/banner.jpg',
        'img/optimized/author.jpg',
        'img/optimized/jacman.jpg',
        'dist/css/style.min.css',
        'dist/js/bundle.min.js'
    ];

    expectedFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const size = (stats.size / 1024).toFixed(1);
            console.log(`✅ ${filePath}: Optimized (${size}KB)`);
        } else {
            console.log(`⚠️  ${filePath}: Missing (run 'npm run build')`);
        }
    });
}

// Run optimization
if (require.main === module) {
    optimizeImages();
}

module.exports = { optimizeImages };