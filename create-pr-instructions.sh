#!/bin/bash

echo "🚀 Creating Pull Request for Yang's Blog Security Modernization"
echo "=================================================================="

# Check if we're on the feature branch
current_branch=$(git branch --show-current)
if [[ "$current_branch" != "security-and-modernization-2024" ]]; then
    echo "❌ Please switch to the feature branch first:"
    echo "   git checkout security-and-modernization-2024"
    exit 1
fi

echo "✅ Current branch: $current_branch"

# Instructions for manual PR creation
echo ""
echo "📋 To complete the Pull Request:"
echo ""
echo "1️⃣  Push the branch to GitHub:"
echo "   git push -u origin security-and-modernization-2024"
echo ""
echo "2️⃣  Go to GitHub and create PR:"
echo "   🔗 https://github.com/yang9112/yang9112.github.io"
echo ""
echo "3️⃣  Use this title and description:"
echo ""
echo "   📝 Title: 🔒 Security Modernization & Critical Updates"
echo ""
echo "   📄 Description: (copy from PR-README.md)"
echo ""
echo "4️⃣  Create as Draft PR for review then publish"
echo ""
echo "📊 Stats of changes:"
git diff --stat origin/master..HEAD
echo ""
echo "🎯 Ready for safe deployment! 🚀"

# Show commit details
echo ""
echo "📋 Latest commit details:"
git log --oneline -1

echo ""
echo "✨ All security fixes completed successfully!"