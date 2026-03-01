#!/usr/bin/env node

/**
 * Build Performance Monitor
 * Monitors build performance and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');

const DIST_PATH = path.join(__dirname, '../dist');
const PACKAGE_PATH = path.join(__dirname, '../package.json');

function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024 * 100) / 100,
      sizeMB: Math.round(stats.size / (1024 * 1024) * 100) / 100
    };
  } catch (err) {
    return null;
  }
}

function scanDirectory(dirPath, extensions = [], maxSizeKB = 100) {
  const results = [];
  
  function scan(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scan(itemPath);
        } else if (stats.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (extensions.length === 0 || extensions.includes(ext)) {
            const fileStats = getFileStats(itemPath);
            if (fileStats) {
              results.push({
                path: path.relative(dirPath, itemPath),
                ...fileStats,
                isLarge: fileStats.sizeKB > maxSizeKB
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Warning: Could not read directory ${currentPath}: ${err.message}`);
    }
  }
  
  scan(dirPath);
  return results.sort((a, b) => b.size - a.size);
}

function analyzeDependencies() {
  try {
    const packageData = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
    
    const deps = Object.keys(packageData.dependencies || {});
    const devDeps = Object.keys(packageData.devDependencies || {});
    
    return {
      production: deps.length,
      development: devDeps.length,
      total: deps.length + devDeps.length
    };
  } catch (err) {
    return { production: 0, development: 0, total: 0 };
  }
}

function generateReport() {
  console.log('🚀 Build Performance Report');
  console.log('='.repeat(50));
  
  // Check if dist directory exists
  if (!fs.existsSync(DIST_PATH)) {
    console.log('❌ Build directory not found. Run `npm run build` first.');
    return;
  }
  
  // Analyze CSS files
  console.log('\n📊 CSS Files Analysis');
  const cssFiles = scanDirectory(DIST_PATH, ['.css']);
  let totalCSS = 0;
  
  cssFiles.forEach(file => {
    totalCSS += file.size;
    const status = file.isLarge ? '⚠️' : '✅';
    console.log(`  ${status} ${file.path}: ${file.sizeKB}KB`);
  });
  
  console.log(`  Total CSS: ${Math.round(totalCSS / 1024)}KB`);
  
  // Analyze JavaScript files
  console.log('\n📊 JavaScript Files Analysis');
  const jsFiles = scanDirectory(DIST_PATH, ['.js'], 50);
  let totalJS = 0;
  
  jsFiles.forEach(file => {
    totalJS += file.size;
    const status = file.isLarge ? '⚠️' : '✅';
    console.log(`  ${status} ${file.path}: ${file.sizeKB}KB`);
  });
  
  console.log(`  Total JS: ${Math.round(totalJS / 1024)}KB`);
  
  // Analyze images
  console.log('\n📊 Image Files Analysis');
  const imageFiles = scanDirectory(DIST_PATH, ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);
  let totalImages = 0;
  const webpCount = imageFiles.filter(f => f.path.endsWith('.webp')).length;
  
  imageFiles.slice(0, 10).forEach(file => {
    totalImages += file.size;
    const status = file.isLarge ? '⚠️' : '✅';
    console.log(`  ${status} ${file.path}: ${file.sizeKB}KB`);
  });
  
  if (imageFiles.length > 10) {
    console.log(`  ... and ${imageFiles.length - 10} more files`);
  }
  
  console.log(`  Total Images: ${Math.round(totalImages / 1024)}KB`);
  console.log(`  WebP files: ${webpCount}/${imageFiles.length}`);
  
  // Dependencies analysis
  console.log('\n📊 Dependencies Analysis');
  const deps = analyzeDependencies();
  console.log(`  Production dependencies: ${deps.production}`);
  console.log(`  Development dependencies: ${deps.development}`);
  console.log(`  Total dependencies: ${deps.total}`);
  
  // Overall statistics
  const totalSize = totalCSS + totalJS + totalImages;
  console.log('\n📊 Overall Statistics');
  console.log(`  Total bundle size: ${Math.round(totalSize / 1024)}KB`);
  console.log(`  CSS: ${Math.round((totalCSS / totalSize) * 100)}%`);
  console.log(`  JavaScript: ${Math.round((totalJS / totalSize) * 100)}%`);
  console.log(`  Images: ${Math.round((totalImages / totalSize) * 100)}%`);
  
  // Optimization recommendations
  console.log('\n💡 Optimization Recommendations');
  
  if (totalJS > 100 * 1024) {
    console.log('  ⚠️ Consider JavaScript code splitting');
  }
  
  if (totalCSS > 50 * 1024) {
    console.log('  ⚠️ Consider CSS optimization and critical path extraction');
  }
  
  const largeJSFiles = jsFiles.filter(f => f.isLarge);
  if (largeJSFiles.length > 0) {
    console.log('  ⚠️ Large JavaScript files detected:');
    largeJSFiles.forEach(f => console.log(`    - ${f.path} (${f.sizeKB}KB)`));
  }
  
  if (webpCount < imageFiles.length * 0.8) {
    console.log('  ⚠️ Consider converting more images to WebP format');
  }
  
  if (deps.total > 50) {
    console.log('  ⚠️ Consider reducing dependency count');
  }
  
  if (totalJS < 50 * 1024 && totalCSS < 25 * 1024) {
    console.log('  ✅ Bundle sizes are well optimized!');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Report completed successfully! 🎉');
}

// Run if called directly
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport, scanDirectory, getFileStats };