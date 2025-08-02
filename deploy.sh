#!/bin/bash

# Smart Advisor - Manual Deployment Script
# This script builds and deploys the application to GitHub Pages

echo "🚀 Starting Smart Advisor deployment to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if API key is set for local testing
if [ -z "$VITE_GEMINI_API_KEY" ] && [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: No VITE_GEMINI_API_KEY found in environment or .env.local"
    echo "   The app will work but AI features may be disabled locally."
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to GitHub Pages
echo "🌍 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "Your app will be available at: https://Narden91.github.io/SmartAdvisor"
    echo "Note: It may take a few minutes for changes to appear."
else
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi
