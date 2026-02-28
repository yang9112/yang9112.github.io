#!/bin/bash

echo "🎯 Creating Pull Request via GitHub API"
echo "======================================"

# GitHub repository info
REPO_OWNER="yang9112"
REPO_NAME="yang9112.github.io"
BRANCH="security-and-modernization-2024"

echo "✅ Repository: $REPO_OWNER/$REPO_NAME"
echo "✅ Branch: $BRANCH"

# Read PR description
if [[ -f "PR-README.md" ]]; then
    BODY=$(cat PR-README.md)
    echo "✅ PR description loaded"
else
    echo "❌ PR-README.md not found"
    exit 1
fi

# Show URL for manual PR creation
echo ""
echo "🌐 Create PR manually at:"
echo "https://github.com/yang9112/yang9112.github.io/pull/new/security-and-modernization-2024"

# Or use curl with token
echo ""
echo "🔑 To create via API:"
echo "1. Get GitHub token: https://github.com/settings/tokens"
echo "2. Run curl command with the token"

curl_template='curl -X POST \\
  -H "Authorization: token YOUR_GITHUB_TOKEN" \\
  -H "Accept: application/vnd.github.v3+json" \\
  https://api.github.com/repos/yang9112/yang9112.github.io/pulls \\
  -d '"'"'{
    "title": "🔒 Security Modernization & Critical Updates",
    "head": "security-and-modernization-2024",
    "base": "master",
    "body": "'"'"'"$BODY"'"'"'"
  }'"'"'

echo ""
echo "📋 CURL Command:"
echo "================"
echo "$curl_template"

echo ""
echo "🚀 Branch pushed successfully! Ready for PR creation!"