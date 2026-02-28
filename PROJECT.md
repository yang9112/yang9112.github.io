# PROJECT.md - Blog Project Guidelines

## 📋 Project Overview

This is Yang's personal blog - a secure, modern static website built with HTML, CSS, and JavaScript.

## 🎯 Project Goals

- **Security First**: Modern security practices and vulnerability-free code
- **Performance**: Fast loading times and optimized assets
- **Maintainability**: Clean, organized code structure
- **Accessibility**: Mobile-responsive and accessible design

## 📁 Directory Structure

```
yang9112.github.io/
├── css/                 # Stylesheets
├── js/                  # JavaScript
├── img/                 # Images and assets
├── fancybox/           # Lightbox components
├── dist/               # Built assets
├── memory/             # Project logs
├── scripts/            # Utility scripts
├── tools/              # Development tools
├── docs/               # Documentation
├── index.html          # Main page
├── README.md           # Project documentation
├── PROJECT.md          # This file
├── TOOLS.md            # Tool configuration
├── TODOLIST.md         # Task tracking
└── HEARTBEAT.md        # Maintenance checklist
```

## 🛡️ Security Requirements

All code must:
- Use Content Security Policy headers
- Implement XSS protection
- Have zero npm vulnerabilities
- Use secure dependency versions
- Avoid unsafe script loading practices

## 🚀 Development Standards

### Code Style
- HTML: Semantic markup, accessibility attributes
- CSS: Organized, commented, minified for production
- JavaScript: Modern ES6+, error handling, async patterns

### File Organization
- Keep related files together
- Use descriptive file names
- Separate source from built files
- Document important decisions

## 🔄 Development Process

### Before Starting
1. Read memory logs for recent context
2. Check TODOLIST.md for current tasks
3. Review TOOLS.md for configuration
4. Run security audit: `npm audit`

### During Development
1. Create branches for new features
2. Test changes thoroughly
3. Update documentation
4. Maintain security standards

### Before Deploying
1. Run `npm run deploy-check`
2. Review security audit results
3. Test production build
4. Update changelog

## 📊 Quality Standards

### Security
- Zero high/medium vulnerabilities
- HTTPS for all external resources
- Proper security headers
- No sensitive data exposure

### Performance
- First paint < 1.5s
- Bundle size optimized
- Images optimized and compressed
- Minimal external dependencies

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Responsive design
- Keyboard navigation support

## 📝 Documentation Standards

### Keep Updated
- README.md (project overview)
- PACKAGE.json (dependencies)
- TODOLIST.md (current tasks)
- SECURITY.md (vulnerability findings)

### Memory Keeping
- Daily logs in memory/YYYY-MM-DD.md
- Important decisions documented
- Lessons learned recorded
- Technical debt tracked

## 🚨 Emergency Procedures

### Security Incident
1. Immediate vulnerability assessment
2. Branch for security patch
3. Test and deploy fix
4. Document incident and solution

### Build Failure
1. Check dependency versions
2. Review build logs
3. Test with clean environment
4. Roll back if needed

---

**Version**: 1.0.2  
**Security Status**: ✅ Secure  
**Deployment**: Ready for production  
**Last Updated**: 2026-02-28