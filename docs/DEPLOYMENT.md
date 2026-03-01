# 🚀 部署指南 (Deployment Guide)

## 📋 目录
- [本地开发](#本地开发)
- [构建流程](#构建流程)
- [CI/CD 配置](#cicd-配置)
- [GitHub Pages 部署](#github-pages-部署)
- [性能监控](#性能监控)
- [故障排除](#故障排除)

## 🛠️ 本地开发

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 快速开始
```bash
# 克隆项目
git clone https://github.com/yang9112/yang9112.github.io.git
cd yang9112.github.io

# 安装依赖
npm ci

# 启动开发服务器
npm run dev

# 在浏览器中打开 http://localhost:4000
```

### 开发命令
```bash
npm run dev          # 启动开发服务器 (端口 4000)
npm run dev:watch    # 监听文件变化并自动重启
npm run build        # 构建生产版本
npm run test         # 运行测试套件
npm run lint         # 代码检查
```

## 🏗️ 构建流程

### 构建步骤
1. **TypeScript 编译**: 将 `.ts` 文件编译为 JavaScript
2. **图片优化**: 压缩图片并转换为 WebP 格式
3. **资源复制**: 复制生产环境 HTML 和静态资源
4. **CSS 压缩**: 使用 clean-css 压缩样式文件
5. **JavaScript 打包**: 合并并压缩所有 JS 模块

### 构建产物
```
dist/
├── css/
│   └── style.min.css      # 压缩后的样式文件
├── js/
│   ├── app.js            # 主应用文件
│   ├── app.min.js        # 压缩版主文件
│   ├── bundle.min.js     # 打包后的所有模块
│   └── modules/          # 独立模块
├── img/                  # 优化后的图片
├── index.html            # 生产环境页面
└── sw.js                 # Service Worker
```

## ⚙️ CI/CD 配置

### 工作流程
项目使用 GitHub Actions 进行自动化部署：

#### 1. Optimized CI/CD Pipeline (`.github/workflows/optimized-ci-cd.yml`)
- **触发条件**: Push/PR 到 main/master/develop 分支
- **功能**: 构建、测试、安全审计、部署
- **优化特性**:
  - Node.js 模块缓存
  - 构建产物缓存
  - 增强的构建验证
  - 详细的构建报告

#### 2. Performance Monitoring (`.github/workflows/performance-monitoring.yml`)
- **触发条件**: PR、每周定时运行、手动触发
- **功能**: 
  - 包大小分析
  - 性能指标监控
  - 依赖分析
  - 安全审计报告

### 环境变量和密钥
- `GITHUB_TOKEN`: 自动由 GitHub Actions 提供
- 可选: 添加自定义环境变量用于配置

## 🌐 GitHub Pages 部署

### 自动部署
当代码推送到 `main` 或 `master` 分支时，GitHub Actions 会自动：
1. 构建项目
2. 部署到 GitHub Pages
3: 更新构建报告

### 手动部署
```bash
# 构建生产版本
npm run build

# 检查构建结果
ls -la dist/

# 使用 gh cli 部署 (如果需要)
gh pages deploy dist/
```

### 自定义域名设置
1. 在仓库设置中配置 GitHub Pages
2. 添加 `CNAME` 文件到项目根目录（如需要）
3. 更新 DNS 记录

## 📊 性能监控

### 构建性能指标
- **构建时间**: 监控构建过程耗时
- **包大小**: 跟踪 CSS/JS 文件大小变化
- **资源加载**: 图片优化效果

### 关键指标阈值
- JS Bundle: < 100KB
- CSS Bundle: < 50KB  
- 图片文件: 优化后 < 100KB
- 构建时间: < 3分钟

### 监控工具
- GitHub Actions 构建报告
- Lighthouse 性能审计
- npm 安全审计

## 🔧 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存和重新构建
npm run clean
npm ci
npm run build
```

#### 2. TypeScript 编译错误
```bash
# 检查 TypeScript 配置
npx tsc --noEmit

# 更新类型定义
npm install @types/node@latest
```

#### 3. 图片优化失败
```bash
# 检查 cwebp 工具
which cwebp

# 安装图片优化工具
npm install -g webp-bin
```

#### 4. 测试失败
```bash
# 运行测试并输出详细信息
npm run test:unit -- --verbose

# 运行特定测试文件
npm run test:unit -- tests/gallery.test.js
```

#### 5. GitHub Actions 失败
1. 检查工作流配置文件语法
2. 验证 Node.js 版本兼容性
3. 确认依赖项缓存状态
4. 查看构建日志中的具体错误

### 性能优化建议

#### JavaScript 优化
- 使用代码分割减少初始包大小
- 启用 Tree Shaking 移除未使用代码
- 考虑使用 ES Modules 进行模块化

#### CSS 优化
- 提取关键 CSS 进行内联
- 使用 CSS 压缩和去重
- 实施按需加载策略

#### 图片优化
- 使用现代格式 (WebP, AVIF)
- 实施响应式图片策略
- 启用懒加载机制

## 📝 维护任务

### 定期检查
- [ ] 依赖包更新 (每月)
- [ ] 安全漏洞扫描 (每周)  
- [ ] 性能基准测试 (每季度)
- [ ] 构建时间优化检查 (每月)

### 更新流程
1. 检查依赖更新
```bash
npm run update-deps
npm audit fix
```

2. 运行完整测试
```bash
npm run test
npm run security-check
```

3. 提交更改
```bash
git add .
git commit -m "chore(deps): update dependencies and security patches"
git push
```

## 📚 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 指南](https://docs.github.com/en/pages)
- [Node.js 最佳实践](https://nodejs.org/en/docs/guides/)
- [Web 性能优化](https://web.dev/performance/)

---

**最后更新**: 2026-03-01  
**维护者**: yang9112  
**版本**: 1.0.0