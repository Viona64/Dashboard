#!/bin/bash

# Dashboard Deployment Script
echo "🚀 Starting Dashboard Deployment..."

# Frontend Deployment
echo "📱 Deploying Frontend to Vercel..."
cd frontend
vercel --prod

echo "✅ Frontend deployed successfully!"
echo "🌐 Your frontend URL will be shown above"

echo ""
echo "🐍 Backend Deployment Instructions:"
echo "1. Make sure you have Heroku CLI installed"
echo "2. Run: heroku create your-dashboard-name"
echo "3. Run: git push heroku main"
echo "4. Set environment variables on Heroku:"
echo "   - SECRET_KEY (generate a random one)"
echo "   - DEBUG=False"
echo "   - ALLOWED_HOSTS=your-heroku-app.herokuapp.com"

echo ""
echo "🎉 Deployment complete!"
