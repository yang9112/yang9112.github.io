#!/bin/bash

echo "🚀 Creating GitHub PR for Security Fix"
echo "======================================="

# Configuration
REPO_OWNER="yang9112"
REPO_NAME="yang9112.github.io"
BRANCH_NAME="security-and-modernization-2024"
BASE_BRANCH="master"
PR_TITLE="🔒 Security Fix: npm Vulnerability Resolution"
PR_BODY_FILE="PR-SECURITY-FIX.md"

echo "📝 PR Details:"
echo "- Repository: $REPO_OWNER/$REPO_NAME"
echo "- Branch: $BRANCH_NAME -> $BASE_BRANCH"
echo "- Title: $PR_TITLE"
echo "- Body file: $PR_BODY_FILE"

# Check if PR body file exists
if [[ ! -f "$PR_BODY_FILE" ]]; then
    echo "❌ PR body file not found: $PR_BODY_FILE"
    exit 1
fi

# Read PR body and escape for JSON
PR_BODY=$(sed ':a;N;$!ba;s/\n/\\n/g' "$PR_BODY_FILE" | sed 's/"/\\"/g')

echo ""
echo "🔍 Preparing GitHub API request..."

# Create PR using curl
echo "📤 Creating Pull Request..."
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

if [[ -n "$PR_URL" && -n "$PR_NUMBER" ]]; then
    echo "✅ Pull Request created successfully!"
    echo ""
    echo "📋 PR Details:"
    echo "#$PR_NUMBER: $PR_TITLE"
    echo "URL: $PR_URL"
    echo ""
    echo "🌐 Opening PR in browser..."
    if command -v xdg-open > /dev/null; then
        xdg-open "$PR_URL"
    elif command -v open > /dev/null; then
        open "$PR_URL"
    else
        echo "Please open manually: $PR_URL"
    fi
else
    echo "❌ Failed to create PR"
    echo "Response: $PR_RESPONSE"
    echo ""
    echo "💡 Possible solutions:"
    echo "1. Check if GITHUB_TOKEN is set and has proper permissions"
    echo "2. Verify branch exists: $BRANCH_NAME"
    echo "3. Check if PR already exists"
    echo ""
    echo "🔧 Manual creation:"
    echo "Visit: https://github.com/$REPO_OWNER/$REPO_NAME/compare/$BASE_BRANCH...$BRANCH_NAME"
fi