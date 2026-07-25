# TakaEarn - Quick Start Guide

## 🎯 Project Overview

TakaEarn is a complete Telegram Web App earning platform with:
- User dashboard for earning money
- Task completion system (10 BDT per task)
- Referral program (20 BDT per referral)
- Withdrawal system (bKash & Nagad)
- Full-featured admin panel

## 📦 Files Created

```
takaearn/
├── index.html              # Main user application
├── style.css               # User app styling
├── script.js               # User app functionality
├── admin.html              # Admin dashboard
├── admin.css               # Admin styling
├── admin.js                # Admin functionality
├── package.json            # Project metadata
├── .gitignore              # Git configuration
├── README.md               # Full documentation
├── API_DOCS.md             # API reference
├── DEPLOYMENT.md           # Deployment guide
├── QUICK_START.md          # This file
└── assets/                 # Assets folder (optional)
    ├── logo.png
    └── banner.png
```

## 🚀 Getting Started (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/takaearn.git
cd takaearn
```

### 2. Run Local Server
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server

# Or using npm
npm start
```

### 3. Access the App
- **User App**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin.html

## 🔧 Configuration

### Update Telegram Bot Settings

1. Get your Telegram Bot Token from @BotFather
2. Configure Web App URL in BotFather settings
3. Update `script.js` if needed

### Customize Colors

Edit `:root` variables in `style.css`:
```css
--primary-color: #6366f1;
--secondary-color: #8b5cf6;
```

### Adjust Rewards

Edit `CONFIG` in `script.js`:
```javascript
const CONFIG = {
    TASK_REWARD: 10,           // BDT per task
    REFERRAL_REWARD: 20,       // BDT per referral
    MIN_WITHDRAWAL: 200,       // Minimum withdrawal
    REQUIRED_REFERRALS_FIRST_WITHDRAWAL: 5
};
```

## 📱 Features Overview

### For Users ✅

**Home Page**
- View current balance
- See earnings from tasks and referrals
- Track statistics (tasks done, referrals, withdrawn)
- View recent activity
- See promotional banners

**Tasks Page**
- Browse available tasks
- Filter by status
- Complete tasks to earn 10 BDT
- Track completion history

**Referral Page**
- Generate and copy referral code
- Share via WhatsApp, Telegram, Facebook
- View referral statistics
- Track earned referral bonuses

**Withdrawal Page**
- Request withdrawal (minimum 200 BDT)
- Choose payment method (bKash/Nagad)
- View withdrawal history
- Track withdrawal status

**Profile Page**
- View user information
- Check account statistics
- See account status
- Logout option

### For Admins 🛠️

**Dashboard**
- View total users, balance, and statistics
- See revenue and activity charts
- Monitor pending withdrawals
- Real-time metrics

**User Management**
- View all users with details
- Search users
- Update user balance
- Block/delete users

**Task Management**
- Create new tasks
- Edit existing tasks
- Set task rewards
- Delete tasks
- Track completion count

**Withdrawal Management**
- Review pending requests
- Approve withdrawals
- Reject with reasons
- View history

**Referral Management**
- Monitor all referrals
- Track referral status
- View earnings
- Search referrals

**Notice Management**
- Create notices (info, warning, success, error)
- Manage notice status
- Delete notices

**Banner Management**
- Upload promotional banners
- Set banner status
- Manage banner links
- Delete banners

**Settings**
- Configure task rewards
- Set referral rewards
- Adjust minimum withdrawal
- Manage app status

## 💾 Data Structure

All data is stored in browser's localStorage with prefix `takaearn_`:

```
takaearn_user              # Current user data
takaearn_users             # All users (admin)
takaearn_tasks             # Tasks list
takaearn_withdrawals       # Withdrawal requests
takaearn_referrals         # Referral records
takaearn_notices           # Notices/announcements
takaearn_banners           # Promotional banners
takaearn_settings          # App settings (admin)
takaearn_activities        # User activities
```

## 🔑 Key Functions

### User App (script.js)

```javascript
// Initialize app
initializeTelegramApp()          // Setup Telegram Web App
loadUserData()                   // Load user from localStorage
loadDashboardData()              // Populate home screen
loadTasks()                      // Fetch available tasks
completeTask(taskId)             // Mark task as complete
loadReferralData()               // Get referral info
shareReferralCode(platform)      // Share via social
submitWithdrawal()               // Request withdrawal
```

### Admin Panel (admin.js)

```javascript
// Dashboard
loadDashboard()                  // Show main dashboard
updateDashboardStats()           // Update statistics
updateCharts()                   // Render charts

// User Management
loadUsersTable()                 // Show all users
viewUserDetails(userId)          // View user info
updateUserBalance(userId)        // Change balance
blockUser(userId)                // Block/delete user

// Task Management
openAddTaskModal()               // Create task form
saveTask(e)                      // Save/update task
deleteTask(taskId)               // Remove task

// Withdrawal Management
loadWithdrawalsTable()           // Show requests
approveWithdrawal(withdrawalId)  // Approve request
rejectWithdrawal(withdrawalId)   // Reject request

// Other Management
saveNotice(e)                    // Create notice
saveBanner(e)                    // Upload banner
saveSettings()                   // Save app settings
```

## 🧪 Testing Checklist

### User App
- [ ] Open app and see dashboard
- [ ] Complete a task
- [ ] Copy referral code
- [ ] Share referral code
- [ ] Check withdrawal page
- [ ] View profile
- [ ] Test navigation

### Admin Panel
- [ ] View dashboard stats
- [ ] Search users
- [ ] Create new task
- [ ] View pending withdrawals
- [ ] Create notice
- [ ] Upload banner
- [ ] Update settings

## 📊 Local Storage Data Example

```javascript
// User object
{
    id: 123456,
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    balance: 350.50,
    taskBalance: 100.00,
    referralBalance: 250.50,
    tasksCompleted: 10,
    activeReferrals: 5,
    totalWithdrawn: 0,
    referralCode: "TAK123456ABCDEF",
    joinedDate: "2026-07-25"
}

// Task object
{
    id: 1,
    title: "Follow Instagram",
    description: "Follow @takaearn on Instagram",
    reward: 10,
    type: "follow",
    url: "https://instagram.com/takaearn",
    status: "available",
    completedCount: 45
}

// Withdrawal object
{
    id: 1,
    userId: 123456,
    amount: 200,
    method: "bkash",
    phone: "01712345678",
    status: "pending",
    requestDate: "2026-07-25T12:00:00Z"
}
```

## 🐛 Common Issues & Solutions

### Issue: Telegram Web App SDK not loading
**Solution**: Ensure you're accessing from Telegram bot, not directly in browser

### Issue: Data not persisting
**Solution**: Check if localStorage is enabled in browser settings

### Issue: Admin panel not showing data
**Solution**: Create some sample data first in user app

### Issue: Styles not loading
**Solution**: Verify style.css and admin.css paths are correct

## 🚢 Deployment Steps

### Quick Deploy (Vercel)
```bash
npm install -g vercel
vercel deploy --prod
```

### Full Setup
See `DEPLOYMENT.md` for detailed instructions

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **API_DOCS.md** - REST API reference
- **DEPLOYMENT.md** - Production deployment guide
- **QUICK_START.md** - This file

## 🔐 Security Notes

### Current (Development)
- Data stored in localStorage
- No backend authentication
- Demo-only payment methods

### For Production
- Implement backend authentication
- Use secure database
- Add payment gateway integration
- Enable HTTPS
- Implement rate limiting
- Add input validation
- Implement CSRF protection

## 📞 Support & Help

- 📧 Email: support@takaearn.com
- 💬 Telegram: @takaearn_support
- 🐛 GitHub Issues: Report bugs here

## 🎓 Learning Resources

- [Telegram Web Apps Docs](https://core.telegram.org/bots/webapps)
- [JavaScript Fundamentals](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📈 Next Steps

1. **Test locally** - Verify all features work
2. **Customize branding** - Update colors and text
3. **Create content** - Add tasks and notices
4. **Deploy** - Push to production
5. **Promote** - Share with users
6. **Monitor** - Track performance
7. **Update** - Add features based on feedback

## 🎉 You're All Set!

The TakaEarn platform is ready to use. Start with the user app, test features, then use the admin panel to manage tasks and withdrawals.

### Quick Commands

```bash
# Start development server
npm start

# View user app
open http://localhost:8000

# View admin panel
open http://localhost:8000/admin.html

# Deploy to Vercel
vercel deploy --prod

# Push to GitHub
git push origin develop
```

---

**Version**: 1.0.0  
**Created**: 2026-07-25  
**License**: MIT

Happy earning! 🚀💰
