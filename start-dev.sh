#!/bin/bash

# Kill any existing Next.js processes
echo "🔄 Stopping existing Next.js processes..."
pkill -f "next dev" || true

# Wait a moment for processes to stop
sleep 2

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Start development server
echo "🚀 Starting development server on port 3000..."
npm run dev 