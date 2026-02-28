#!/bin/bash

echo "🚀 GitHub PR Automation for Yang's Blog Security"
echo "================================================"

# Check if we have the necessary files
if [[ ! -f "PR-README.md" ]]; then
    echo "❌ PR-README.md not found"
    exit 1
fi

echo "✅ PR description ready"

# Step 1: Authenticate with GitHub
echo ""
echo "🔐 Step 1: GitHub Authentication"
echo "Please run: gh auth login"
echo "Select: GitHub.com → HTTPS → Use web browser → Paste token"

# Step 2: Push branch
echo ""
echo "📤 Step 2: Push branch to GitHub"
echo "Command: git push -u origin security-and-modernization-2024"

# Step 3: Create PR
echo ""
echo "📝 Step 3: Create Pull Request"
echo "Command: gh pr create --title '🔒 Security Modernization & Critical Updates' --body-file PR-README.md --head security-and-modernization-2024 --base master --draft"

# Full script
echo ""
echo "🎯 Complete Script to Run:"
echo "=========================="
echo "# Authenticate first"
echo "gh auth login"
echo ""
echo "# Push and create PR"
echo "git push -u origin security-and-modernization-2024 && gh pr create --title '🔒 Security Modernization & Critical Updates' --body-file PR-README.md --head security-and-modernization-2024 --base master --draft"
echo ""
echo "# Then publish draft PR"
echo "gh pr view --web"

echo ""
echo "📊 Ready to create PR with:"
echo "- 24 security fixes"
echo "- Modern dependencies" 
echo "- Performance improvements"
echo "- Zero breaking changes"

echo ""
echo "✨ Execute the script above to create your PR! 🚀"