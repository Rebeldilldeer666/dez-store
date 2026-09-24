#!/bin/bash
# Vercel deployment script

echo "Preparing DEZ-STORE for Vercel deployment..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Run build to make sure everything works
echo "Running build to verify the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful! Ready for Vercel deployment."
    echo "Run 'vercel --prod' to deploy to production"
    echo "Or 'vercel' to deploy to staging"
else
    echo "Build failed. Please fix errors before deploying."
    exit 1
fi