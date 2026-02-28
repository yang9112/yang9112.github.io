# TOOLS.md - Project Configuration

## 🛠️ Development Tools

### Build Tools
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **Clean CSS**: v5.6.3 (CSS minification)
- **Uglify JS**: v3.19.3 (JS minification)

### Development Server
- **Custom Server**: `dev-server.js`
- **Port**: 4000 (configurable via PORT env var)
- **Features**: Security headers, SPA routing support
- **Dependencies**: Zero external dependencies

## 🌐 External Services

### CDN Integration
- **FontAwesome**: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/
- **jQuery**: Local copy (version 3.7.1)
- **Analytics**: Baidu Analytics (async loading)

### GitHub Pages
- **Repository**: yang9112/yang9112.github.io
- **Branch**: master (deployed automatically)
- **Domain**: https://yang9112.github.io

## 🔒 Security Configuration

### Content Security Policy
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://hm.baidu.com; 
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
font-src 'self' https://cdnjs.cloudflare.com; 
img-src 'self' data:; 
connect-src 'self';
```

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

## 📁 Asset Organization

### Image Assets
- **Originals**: `img/` directory
- **Fancybox**: `fancybox/` directory for lightbox
- **Formats**: PNG, JPG, SVG supported
- **Optimization**: Manual optimization recommended

### JavaScript Modules
- **Core**: jQuery + custom scripts
- **Gallery**: Image lightbox functionality
- **UI**: Scroll-to-top and interactions
- **Analytics**: Baidu tracking integration

## 🎯 Build Process

### Development
```bash
npm run dev        # Start dev server
npm run build      # Build minified assets
npm run test       # Build and validate
```

### Production
```bash
npm run prod-build  # Production build
npm run size-check  # Check asset sizes
npm run deploy-check # Final validation
```

## 📊 Performance Metrics

### Target Goals
- **First Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
-JavaScript**
- Total bundle size: < 500KB compressed

### Monitoring
- Lighthouse audit quarterly
- Real User Monitoring when available
- GitHub Pages Insights

## 🔄 Maintenance Schedule

### Weekly
- Check for security updates
- Monitor build errors
- Review performance metrics

### Monthly
- Update dependencies
- Optimize new images
- Review documentation

### Quarterly
- Full security audit
- Performance optimization review
- Feature enhancement planning

---

**Last Updated**: 2026-02-28
**Version**: 1.0.2 (Secure Modernized)