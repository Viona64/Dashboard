# 🚀 Deployment Guide

## 📋 Prerequisites

- Node.js 16+ installed
- Python 3.8+ installed  
- Git for version control
- Domain name (for production)
- Hosting provider (Vercel, Netlify, Heroku, etc.)

---

## 🌐 Frontend Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from frontend directory**
```bash
cd c:/Users/viona/Desktop/BS/frontend
vercel --prod
```

4. **Follow prompts** - Vercel will automatically detect React app

### Option 2: Netlify (Free & Easy)

1. **Build the app**
```bash
cd c:/Users/viona/Desktop/BS/frontend
npm run build
```

2. **Deploy to Netlify**
- Go to [netlify.com](https://netlify.com)
- Drag `build` folder to deploy area
- Your site will be live instantly

### Option 3: GitHub Pages (Free)

1. **Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. **Install and deploy**
```bash
npm install --save-dev gh-pages
npm run deploy
```

---

## 🐍 Backend Deployment Options

### Option 1: Heroku (Free Tier)

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create requirements.txt** (if not exists)
```bash
cd c:/Users/viona/Desktop/BS
pip freeze > requirements.txt
```

4. **Create Procfile**
```bash
echo "web: gunicorn dashboard_project.wsgi:application" > Procfile
```

5. **Deploy**
```bash
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: PythonAnywhere (Free Tier)

1. **Sign up** at [pythonanywhere.com](https://pythonanywhere.com)

2. **Upload code** via Git or manual upload

3. **Configure**:
   - Python version: 3.8+
   - Web app: Django
   - Virtualenv: Create new one
   - Install requirements

4. **Set up static files** and database

### Option 3: DigitalOcean/AWS (Paid)

1. **Create server** (Ubuntu 20.04+)

2. **Setup server**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip python3-venv nginx -y

# Setup app
git clone your-repo
cd your-repo
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure nginx for reverse proxy
# Configure Gunicorn as application server
```

---

## 🔧 Environment Configuration

### Production Settings

1. **Update Django settings** (`dashboard_project/settings.py`):
```python
import os

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Database (PostgreSQL recommended for production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# CORS for production
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

2. **Update frontend API URL** (`.env` file):
```
REACT_APP_API_URL=https://your-backend-api.com
```

---

## 🚀 Quick Deployment Script

### Automated Deployment (Vercel + Heroku)

1. **Frontend to Vercel**
```bash
cd c:/Users/viona/Desktop/BS/frontend
vercel --prod
```

2. **Backend to Heroku**
```bash
cd c:/Users/viona/Desktop/BS
heroku create your-dashboard-api
git add .
git commit -m "Deploy production"
git push heroku main
```

---

## 🌍 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ENV=production
```

### Backend (Heroku Config Vars)
```
SECRET_KEY=your-super-secret-key
DEBUG=False
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
```

---

## 🔍 Pre-Deployment Checklist

### Security
- [ ] Change default SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS correctly

### Performance
- [ ] Enable static file compression
- [ ] Set up CDN for static assets
- [ ] Configure database caching
- [ ] Enable Gzip compression

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Backup strategy

---

## 🛠️ Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Update CORS_ALLOWED_ORIGINS in Django settings

### Issue: Static Files Not Loading
**Solution**: Run `python manage.py collectstatic` and configure web server

### Issue: Database Connection Errors
**Solution**: Check database credentials and network connectivity

### Issue: Build Failures
**Solution**: Check Node.js version and clear npm cache

---

## 📱 Mobile Optimization

The app is already mobile-responsive, but ensure:

1. **Test on real devices**
2. **Check touch interactions**
3. **Verify performance on 3G/4G**
4. **Test on different screen sizes**

---

## 🔄 CI/CD Pipeline (Advanced)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📊 Post-Deployment

1. **Monitor performance** with Google Lighthouse
2. **Set up analytics** (Google Analytics, Mixpanel)
3. **Test all features** thoroughly
4. **Monitor error rates**
5. **Check security** with tools like OWASP ZAP

---

## 🎯 Recommended Deployment Stack

**For Production:**
- **Frontend**: Vercel (CDN, HTTPS, auto-deploy)
- **Backend**: Heroku or DigitalOcean
- **Database**: PostgreSQL (via Heroku Postgres or AWS RDS)
- **Monitoring**: Sentry for errors, Google Analytics for usage

**Total Cost**: Free tier available, scales to ~$20-50/month for production

---

## 🆘 Support & Troubleshooting

If you encounter issues:

1. **Check logs**: `heroku logs --tail` or Vercel dashboard
2. **Verify environment variables**
3. **Test locally** with production settings
4. **Check browser console** for JavaScript errors
5. **Monitor network tab** for API calls

---

**🎉 Your optimized dashboard is ready for production deployment!**
