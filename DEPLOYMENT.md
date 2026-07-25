# TakaEarn - Deployment Guide

This guide explains how to deploy TakaEarn to production.

## Prerequisites

- Domain name (e.g., takaearn.com)
- HTTPS certificate (Let's Encrypt is free)
- Telegram Bot Token
- Payment gateway accounts (bKash, Nagad)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides free hosting for static sites with automatic HTTPS.

1. **Create Vercel Account**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel deploy --prod
   ```

3. **Configure Custom Domain**
   - Go to Vercel dashboard
   - Select project
   - Go to Settings > Domains
   - Add your domain

### Option 2: Netlify

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select your GitHub repository

2. **Configure Build Settings**
   - Build Command: (leave empty)
   - Publish Directory: (root directory)

3. **Deploy**
   - Netlify will automatically deploy on push

### Option 3: GitHub Pages

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Select "Pages" from left menu
   - Select "main" branch
   - Save

3. **Configure Custom Domain**
   - Add domain in GitHub Pages settings
   - Update DNS records with GitHub's IP addresses

### Option 4: Self-Hosted VPS

1. **Get VPS**
   - DigitalOcean, Linode, AWS, etc.

2. **Install Dependencies**
   ```bash
   sudo apt update && sudo apt upgrade
   sudo apt install nodejs
   ```

3. **Install HTTPS with Let's Encrypt**
   ```bash
   sudo apt install certbot
   sudo certbot certonly --standalone -d yourdomain.com
   ```

4. **Setup Web Server (Nginx)**
   ```bash
   sudo apt install nginx
   ```

5. **Configure Nginx**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name takaearn.com www.takaearn.com;
       
       ssl_certificate /etc/letsencrypt/live/takaearn.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/takaearn.com/privkey.pem;
       
       root /var/www/takaearn;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   
   server {
       listen 80;
       server_name takaearn.com www.takaearn.com;
       return 301 https://$server_name$request_uri;
   }
   ```

6. **Upload Files**
   ```bash
   scp -r ./* user@yourserver:/var/www/takaearn/
   ```

7. **Start Nginx**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

## Telegram Bot Configuration

1. **Create Bot with BotFather**
   - Chat: @BotFather
   - Command: `/start`
   - Command: `/newbot`
   - Follow instructions, save token

2. **Set Web App Menu Button**
   ```bash
   curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/setChatMenuButton \
   -H "Content-Type: application/json" \
   -d '{
       "menu_button": {
           "type": "web_app",
           "text": "Start Earning",
           "web_app": {
               "url": "https://yourdomain.com"
           }
       }
   }'
   ```

## Monitoring & Logging

1. **Setup Error Tracking**
   - Sentry.io
   - Rollbar
   - LogRocket

2. **Setup Analytics**
   - Google Analytics
   - Plausible
   - Mixpanel

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong admin password
- [ ] Database backups configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Regular security updates
- [ ] Monitoring enabled
- [ ] Error logging configured
- [ ] Payment data encrypted

---

**Last Updated**: 2026-07-25