# TakaEarn - Telegram Web App Earning Platform

A complete Telegram Web App for earning money through tasks and referrals, with a comprehensive admin panel for management.

## 🚀 Features

### User Features
- **Home Dashboard**: View balance, tasks completed, referrals, and recent activity
- **Daily Tasks**: Complete tasks to earn 10 BDT per task
- **Referral System**: Earn 20 BDT for each successful referral
- **Withdrawal System**:
  - Minimum withdrawal: 200 BDT
  - First withdrawal requires at least 5 referrals
  - Support for bKash and Nagad payment methods
  - Withdrawal history tracking
- **User Profile**: View stats and account information
- **Bottom Navigation**: Quick access to Home, Tasks, Referrals, Withdrawals, and Profile
- **Telegram Login**: Seamless Telegram user authentication
- **Responsive Design**: Fully optimized for mobile devices

### Admin Panel Features
- **Dashboard**: Overview of key metrics and recent activities
- **User Management**:
  - View all users with detailed information
  - Update user balance
  - Block/delete users
  - Search functionality
- **Task Management**:
  - Create, edit, and delete tasks
  - Set rewards and task types
  - Track completion status
- **Withdrawal Management**:
  - Review pending withdrawal requests
  - Approve or reject withdrawals
  - View withdrawal history
- **Referral Management**:
  - Track all referrals
  - View referral status and earnings
  - Search and filter referrals
- **Notice Management**:
  - Create and manage notices
  - Set notice type (info, warning, success, error)
  - Push notices to users
- **Banner Management**:
  - Upload and manage promotional banners
  - Set banner status
  - Track banner performance
- **Settings**:
  - Configure task rewards
  - Configure referral rewards
  - Set minimum withdrawal amount
  - Set required referrals for first withdrawal
  - Manage application status
- **Analytics**:
  - Revenue overview charts
  - User activity statistics
  - Recent withdrawal requests display

## 📁 Project Structure

```
takaearn/
├── index.html              # Main user app
├── style.css               # User app styles
├── script.js               # User app logic
├── admin.html              # Admin panel
├── admin.css               # Admin panel styles
├── admin.js                # Admin panel logic
├── assets/
│   ├── logo.png            # Application logo
│   └── banner.png          # Default banner
├── package.json            # Project metadata
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Telegram Bot API key (for Telegram Web App integration)
- Node.js (optional, for local server)

### Local Development

1. **Clone or download the project**
   ```bash
   git clone https://github.com/yourusername/takaearn.git
   cd takaearn
   ```

2. **Start a local server** (required for Telegram Web App)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   
   # Or using npm script
   npm start
   ```

3. **Access the application**
   - User App: `http://localhost:8000`
   - Admin Panel: `http://localhost:8000/admin.html`

### Telegram Bot Setup

1. **Create a bot** with BotFather on Telegram
   - Start chat: @BotFather
   - Send `/start` and follow instructions
   - Save your bot token

2. **Set Web App URL**
   - Send `/mybots` to BotFather
   - Select your bot
   - Click "Bot Settings"
   - Click "Menu Button"
   - Set Web App URL to your deployed domain

3. **Deploy** to a secure HTTPS server
   - Vercel, Netlify, GitHub Pages, or your own server

4. **Update** the bot's inline button
   - Configure the button to open your Web App URL

## 📱 Usage

### For Users

1. **Start the Bot**: Click on the bot link in Telegram
2. **Login**: Authorize with your Telegram account
3. **Complete Tasks**: Earn 10 BDT per completed task
4. **Refer Friends**: Share your referral code and earn 20 BDT per referral
5. **Withdraw Money**: Once eligible (200+ BDT and 5+ referrals), request a withdrawal
6. **Track Progress**: Monitor your earnings in the dashboard

### For Admins

1. **Access Admin Panel**: Navigate to `/admin.html`
2. **Dashboard**: View key metrics and recent activities
3. **Manage Users**: View, update, and manage user accounts
4. **Manage Tasks**: Create and manage earning tasks
5. **Review Withdrawals**: Approve or reject withdrawal requests
6. **Send Notices**: Communicate with users via notices
7. **Upload Banners**: Manage promotional content
8. **Configure Settings**: Adjust platform parameters

## 🔐 Security Features

- **Local Storage**: User data persisted locally (upgrade to backend for production)
- **Data Validation**: Input validation on all forms
- **Session Management**: Automatic logout on browser close
- **Admin Authentication**: (Implement server-side auth for production)
- **HTTPS Only**: Required for Telegram Web App

## 💾 Data Structure

### User Object
```javascript
{
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    balance: number,
    taskBalance: number,
    referralBalance: number,
    tasksCompleted: number,
    activeReferrals: number,
    totalWithdrawn: number,
    referralCode: string,
    joinedDate: string
}
```

### Task Object
```javascript
{
    id: number,
    title: string,
    description: string,
    reward: number,
    status: 'available' | 'completed' | 'inactive',
    url: string,
    type: string,
    completedCount: number
}
```

### Withdrawal Object
```javascript
{
    id: number,
    userId: number,
    amount: number,
    method: 'bkash' | 'nagad',
    phone: string,
    status: 'pending' | 'approved' | 'rejected',
    requestDate: string,
    approvalDate?: string,
    rejectionReason?: string
}
```

### Notice Object
```javascript
{
    id: number,
    title: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error',
    status: 'active' | 'inactive',
    createdAt: string
}
```

### Banner Object
```javascript
{
    id: number,
    title: string,
    imageUrl: string,
    link?: string,
    status: 'active' | 'inactive',
    createdAt: string
}
```

## 🎨 Customization

### Colors
Edit the CSS variables in `style.css` and `admin.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    /* ... more colors ... */
}
```

### Configuration
Edit constants in `script.js`:
```javascript
const CONFIG = {
    TASK_REWARD: 10,
    REFERRAL_REWARD: 20,
    MIN_WITHDRAWAL: 200,
    REQUIRED_REFERRALS_FIRST_WITHDRAWAL: 5,
    API_BASE_URL: 'https://api.takaearn.com'
};
```

## 📊 Analytics & Reporting

The admin panel includes:
- **Revenue Overview**: Weekly revenue tracking with chart.js
- **User Activity**: Task and referral activity metrics
- **Withdrawal Statistics**: Pending and approved withdrawal tracking
- **User Growth**: Total registered users and active users

## 🔄 Backend Integration (Production)

For production deployment, integrate with a backend API:

1. **Authentication**: Implement server-side Telegram login verification
2. **Database**: Replace localStorage with database calls
3. **API Endpoints**: Create REST or GraphQL API
4. **Payment Processing**: Integrate bKash and Nagad APIs
5. **Admin Authentication**: Implement secure admin login

### Sample API Endpoints

```
POST   /api/auth/login              # Telegram login
GET    /api/users/:id               # Get user details
PUT    /api/users/:id/balance       # Update balance
POST   /api/tasks                   # Create task
GET    /api/withdrawals             # Get withdrawals
POST   /api/withdrawals/:id/approve # Approve withdrawal
POST   /api/withdrawals/:id/reject  # Reject withdrawal
```

## 🐛 Troubleshooting

### Telegram Web App Not Loading
- Ensure HTTPS is used (required by Telegram)
- Check bot token validity
- Verify Web App URL in BotFather settings
- Check browser console for errors

### Data Not Persisting
- Check browser localStorage is enabled
- Clear cache and reload
- Use incognito mode to test
- Check browser storage limits

### Admin Panel Issues
- Ensure data exists in localStorage
- Check browser console for errors
- Verify admin.html path is correct
- Clear browser cache

## 📝 Browser Support

- Chrome/Chromium 88+
- Firefox 87+
- Safari 14+
- Edge 88+
- Telegram App (Built-in WebView)

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support and questions:
- Email: support@takaearn.com
- Telegram: @takaearn_support
- GitHub Issues: [Create an issue](https://github.com/yourusername/takaearn/issues)

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel deploy
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### Deploy to GitHub Pages
```bash
git push origin main
# Enable GitHub Pages in repository settings
```

### Deploy to Custom Server
1. Upload all files to your server
2. Ensure HTTPS is enabled
3. Update bot's Web App URL
4. Test thoroughly

## 🔄 Updates & Roadmap

### Version 1.0 (Current)
- ✅ Basic task system
- ✅ Referral system
- ✅ Withdrawal system
- ✅ Admin panel
- ✅ Mobile responsive design
- ✅ Telegram Web App integration
- ✅ Charts and analytics

### Version 1.1 (Planned)
- 🔄 Real bKash/Nagad integration
- 🔄 Backend API integration
- 🔄 Advanced analytics
- 🔄 User notifications
- 🔄 Two-factor authentication

### Version 2.0 (Planned)
- 🔄 Multiple payment methods
- 🔄 Leaderboards
- 🔄 Achievements system
- 🔄 Community features
- 🔄 Mobile app version

## ⚠️ Disclaimer

This is a demonstration project. For production use:
- Implement proper backend security
- Add payment gateway integration
- Comply with legal requirements
- Set up proper data protection
- Implement fraud prevention
- Add rate limiting
- Implement proper logging

## 📚 Additional Resources

- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

**Made with ❤️ by TakaEarn Team**

Version 1.0.0 | Last Updated: 2026-07-25