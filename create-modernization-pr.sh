#!/bin/bash

echo "🎉 博客现代化任务完成 - 创建 PR"
echo "======================================="

# Configuration
REPO_OWNER="yang9112"
REPO_NAME="yang9112.github.io"
BRANCH_NAME="security-and-modernization-2024"
BASE_BRANCH="master"
PR_TITLE="🎉 博客现代化高优先级任务完成"
PR_BODY_FILE="MODERNIZATION-PR.md"

echo "📝 PR 详情:"
echo "- 仓库: $REPO_OWNER/$REPO_NAME"
echo "- 分支: $BRANCH_NAME -> $BASE_BRANCH"
echo "- 标题: $PR_TITLE"
echo "- 描述文件: $PR_BODY_FILE"

# Check if PR body file exists
if [[ ! -f "$PR_BODY_FILE" ]]; then
    echo "❌ PR 描述文件不存在: $PR_BODY_FILE"
    exit 1
fi

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]]; then
    echo "❌ 当前分支不是 $BRANCH_NAME，当前是: $CURRENT_BRANCH"
    exit 1
fi

echo ""
echo "🔍 准备 GitHub API 请求..."

# Push branch first
echo "📤 推送分支到 GitHub..."
git push -u origin "$BRANCH_NAME"

if [[ $? -ne 0 ]]; then
    echo "❌ 分支推送失败"
    exit 1
fi

# Read PR body and escape for JSON
PR_BODY=$(sed ':a;N;$!ba;s/\n/\\n/g' "$PR_BODY_FILE" | sed 's/"/\\"/g')

echo ""
echo "📤 创建 Pull Request..."

# Check if GITHUB_TOKEN is set
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "❌ GITHUB_TOKEN 环境变量未设置"
    echo "💡 请设置 GitHub Personal Access Token"
    exit 1
fi

# Create PR using curl
PR_RESPONSE=$(curl -s -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls \
  -d "{
    \"title\": \"$PR_TITLE\",
    \"body\": \"$PR_BODY\",
    \"head\": \"$BRANCH_NAME\",
    \"base\": \"$BASE_BRANCH\"
  }")

# Extract PR URL and number
PR_URL=$(echo "$PR_RESPONSE" | grep -o '"html_url":"[^"]*' | cut -d'"' -f4)
PR_NUMBER=$(echo "$PR_RESPONSE" | grep -o '"number":[0-9]*' | cut -d':' -f2)
PR_STATE=$(echo "$PR_RESPONSE" | grep -o '"state":"[^"]*' | cut -d'"' -f4)

if [[ -n "$PR_URL" && -n "$PR_NUMBER" ]]; then
    echo "✅ Pull Request 创建成功!"
    echo ""
    echo "📋 PR 详情:"
    echo "#$PR_NUMBER: $PR_TITLE"
    echo "状态: $PR_STATE"
    echo "URL: $PR_URL"
    echo ""
    
    # Save PR info
    echo "$PR_URL" > LATEST_PR_URL.txt
    echo "#$PR_NUMBER" > LATEST_PR_NUMBER.txt
    
    echo "🌐 在浏览器中打开 PR..."
    # For server environment, just output the URL
    echo "请手动访问: $PR_URL"
    
    echo ""
    echo "📊 完成的任务摘要:"
    echo "✅ 添加项目 README.md (完整文档)"
    echo "✅ 现代化评论系统 (Gitalk 替换 Duoshuo)"
    echo "✅ 移动端适配验证 (响应式设计优秀)"
    echo "✅ 构建脚本优化 (移除废弃依赖)"
    echo "✅ 安全策略更新 (CSP 配置)"
    
else
    echo "❌ 创建 PR 失败"
    echo "响应: $PR_RESPONSE"
    echo ""
    echo "💡 可能的解决方案:"
    echo "1. 检查 GITHUB_TOKEN 是否设置且有正确权限"
    echo "2. 验证分支是否存在: $BRANCH_NAME"
    echo "3. 检查是否已存在相同的 PR"
    echo "4. 检查网络连接"
    echo ""
    echo "🔧 手动创建:"
    echo "访问: https://github.com/$REPO_OWNER/$REPO_NAME/compare/$BASE_BRANCH...$BRANCH_NAME"
fi

echo ""
echo "🎉 博客现代化任务完成!"