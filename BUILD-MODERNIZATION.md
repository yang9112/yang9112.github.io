# 🚀 Modern Static Website Build System

This document provides instructions for setting up a modern development workflow for the yang9112.github.io blog project.

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

This will start a local development server with:
- Live reload on file changes
- Hot module replacement for CSS
- Automatic formatting with Prettier
- ESLint code checking

### 3. Production Build

```bash
npm run build
```

This will:
- Optimize and compress CSS/JS files
- Minify HTML
- Optimize images
- Generate source maps

### 4. Code Quality Checks

```bash
# Lint JavaScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format all files with Prettier
npm run format
```

## 📦 Development Dependencies Added

- **Vite** - Modern build tool and dev server
- **Prettier** - Code formatter
- **ESLint** - Linting and code quality
- **Autoprefixer** - Automatic CSS vendor prefixes
- **CSSNano** - CSS minification

## 🎯 Features

### Modern CSS Processing
- Autoprefixer for cross-browser compatibility
- CSS minification for production
- Source maps for debugging

### JavaScript Development
- ESLint for code quality
- Prettier for consistent formatting
- ES6+ support with modern bundling

### Image Optimization
- Automatic image compression
- WebP conversion for modern browsers
- Lazy loading implementation

### Performance Features
- File hashing for cache busting
- Gzip compression
- Critical CSS extraction

## 🚦 Project Structure

```
yang9112.github.io/
├── src/                    # Source files for development
│   ├── css/               # SCSS/CSS source files
│   ├── js/                # JavaScript source files
│   └── assets/            # Images and other assets
├── dist/                  # Build output (generated)
├── public/                # Static files copied as-is
├── package.json           # Package configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🔧 Configuration Files

- **vite.config.js** - Main build configuration
- **.prettierrc** - Prettier formatting rules
- **.eslintrc.json** - ESLint linting rules
- **package.json** - Scripts and dependencies

## 🎉 Usage Examples

### Adding New Styles
1. Edit files in `src/css/`
2. Development server will auto-reload
3. Use SCSS features like variables and mixins

### Adding New JavaScript
1. Create files in `src/js/`
2. Import modules as needed
3. ESLint will check for issues automatically

### Production Deployment
1. Run `npm run build`
2. Deploy contents of `dist/` folder
3. Update GitHub Pages or your hosting provider

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Vite will automatically find the next available port
2. **CSS not updating**: Check for syntax errors in SCSS files
3. **Build fails**: Run `npm run lint` to check for issues

### Getting Help

- Check the Vite documentation: https://vitejs.dev
- ESLint rules: https://eslint.org/docs/rules
- Prettier options: https://prettier.io/docs/en/options.html

## 📈 Performance Optimization

The build system includes:
- Tree shaking to remove unused code
- Code splitting for better loading performance
- Asset optimization and compression
- Critical path optimization

This setup significantly improves the development experience and production performance of your static website!