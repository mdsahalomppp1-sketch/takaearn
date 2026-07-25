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
   # Update system
   sudo apt update && sudo apt upgrade
   
   # Install Node.js (optional)
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
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
   Create `/etc/nginx/sites-available/takaearn`:
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

## Backend API Setup (Production)

### Database Setup

1. **Choose Database**
   - MongoDB Atlas (Cloud)
   - PostgreSQL
   - MySQL

2. **Create Collections/Tables**
   ```sql
   -- Users
   CREATE TABLE users (
       id INT PRIMARY KEY,
       firstName VARCHAR(100),
       lastName VARCHAR(100),
       username VARCHAR(100),
       balance DECIMAL(10, 2),
       tasksCompleted INT DEFAULT 0,
       activeReferrals INT DEFAULT 0,
       totalWithdrawn DECIMAL(10, 2) DEFAULT 0,
       referralCode VARCHAR(50) UNIQUE,
       joinedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Tasks
   CREATE TABLE tasks (
       id INT PRIMARY KEY AUTO_INCREMENT,
       title VARCHAR(200),
       description TEXT,
       reward INT,
       type VARCHAR(50),
       url VARCHAR(500),
       status VARCHAR(20),
       completedCount INT DEFAULT 0
   );
   
   -- Withdrawals
   CREATE TABLE withdrawals (
       id INT PRIMARY KEY AUTO_INCREMENT,
       userId INT,
       amount DECIMAL(10, 2),
       method VARCHAR(20),
       phone VARCHAR(20),
       status VARCHAR(20),
       requestDate TIMESTAMP,
       approvalDate TIMESTAMP,
       rejectionReason TEXT
   );
   ```

### API Server Setup

1. **Create Node.js Backend**
   ```bash
   mkdir takaearn-api
   cd takaearn-api
   npm init
   npm install express cors dotenv
   ```

2. **Create Server File (server.js)**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   // Routes
   app.post('/api/auth/login', (req, res) => {
       // Telegram verification
   });
   
   app.get('/api/users/:id', (req, res) => {
       // Get user
   });
   
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Deploy Backend**
   - Use Heroku, Railway, or your VPS
   - Update `API_BASE_URL` in script.js

## Telegram Bot Configuration

1. **Create Bot with BotFather**
   - Chat: @BotFather
   - Command: `/start`
   - Command: `/newbot`
   - Follow instructions, save token

2. **Get Bot ID**
   ```bash
   # Use token to get bot info
   curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
   ```

3. **Set Web App Menu Button**
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

4. **Add Bot Commands**
   ```bash
   curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/setMyCommands \
   -H "Content-Type: application/json" \
   -d '{
       "commands": [
           {"command": "start", "description": "Start earning"},
           {"command": "balance", "description": "Check balance"},
           {"command": "withdraw", "description": "Withdraw money"},
           {"command": "refer", "description": "Get referral code"},
           {"command": "help", "description": "Get help"}
       ]
   }'
   ```

## Payment Gateway Integration

### bKash Integration

1. **Create Merchant Account**
   - Visit bKash Developer Portal
   - Create app
   - Get API key and secret

2. **Add Payment Handler** (backend)
   ```javascript
   app.post('/api/payment/bkash', async (req, res) => {
       const { amount, phone } = req.body;
       // Call bKash API
       // Create payment
       // Return payment URL
   });
   ```

### Nagad Integration

1. **Create Merchant Account**
   - Visit Nagad Developer Portal
   - Register merchant
   - Get credentials

2. **Add Payment Handler** (backend)
   ```javascript
   app.post('/api/payment/nagad', async (req, res) => {
       const { amount, phone } = req.body;
       // Call Nagad API
       // Create transaction
       // Return transaction URL
   });
   ```

## Environment Variables (.env)

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_APP_ENV=production

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_APP_URL=https://yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=takaearn
DB_USER=postgres
DB_PASSWORD=password

# Payment Gateways
BKASH_API_KEY=your_bkash_key
BKASH_API_SECRET=your_bkash_secret
NAGAD_API_KEY=your_nagad_key
NAGAD_API_SECRET=your_nagad_secret

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## SSL/HTTPS Renewal

### Auto Renewal with Certbot

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
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

3. **Monitor Performance**
   - Uptime monitoring
   - Performance tracking
   - Error alerts

## Backup Strategy

1. **Database Backups**
   ```bash
   # Daily backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mysqldump -u user -p database > backup_$DATE.sql
   ```

2. **File Backups**
   - Use Git for version control
   - Use automated backup services

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

## Troubleshooting

### HTTPS Not Working
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew
```

### API Connection Issues
- Check API endpoint URL
- Verify CORS settings
- Check firewall rules
- Test API directly

### Database Connection Issues
- Verify credentials
- Check database is running
- Verify firewall rules
- Check connection string

## Support & Help

For deployment support:
- Email: deploy@takaearn.com
- Telegram: @takaearn_support
- GitHub Issues: https://github.com/yourusername/takaearn/issues

---

**Last Updated**: 2026-07-25