// ============================================
// TakaEarn Telegram Web App - Main Script
// ============================================

// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Application State
const appState = {
    user: null,
    tasks: [],
    withdrawals: [],
    referrals: [],
    currentFilter: 'all',
    notifications: []
};

// Configuration
const CONFIG = {
    TASK_REWARD: 10,
    REFERRAL_REWARD: 20,
    MIN_WITHDRAWAL: 200,
    REQUIRED_REFERRALS_FIRST_WITHDRAWAL: 5,
    API_BASE_URL: 'https://api.takaearn.com', // Replace with actual API
    STORAGE_PREFIX: 'takaearn_'
};

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeTelegramApp();
    initializeEventListeners();
    loadUserData();
    loadDashboardData();
    setupBottomNavigation();
});

function initializeTelegramApp() {
    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes();
    
    // Set header color
    tg.setHeaderColor('#6366f1');
    tg.setBackgroundColor('#0f172a');
    
    // Get user data from Telegram
    const telegramUser = tg.initDataUnsafe?.user;
    if (telegramUser) {
        appState.user = {
            id: telegramUser.id,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name || '',
            username: telegramUser.username || '',
            photoUrl: telegramUser.photo_url || '',
            balance: 0,
            taskBalance: 0,
            referralBalance: 0,
            tasksCompleted: 0,
            activeReferrals: 0,
            totalWithdrawn: 0,
            referralCode: generateReferralCode(telegramUser.id),
            joinedDate: new Date().toLocaleDateString(),
            lastActivityDate: new Date()
        };
        
        // Save user to localStorage for persistence
        saveToLocalStorage('user', appState.user);
        updateUserDisplay();
    }
}

function initializeEventListeners() {
    // Bottom Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });

    // Task Modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('taskModal').addEventListener('click', (e) => {
        if (e.target.id === 'taskModal') closeModal();
    });

    // Tasks Page
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTaskFilter);
    });

    // Referral Page
    document.getElementById('copyCodeBtn').addEventListener('click', copyReferralCode);
    document.getElementById('shareWhatsApp').addEventListener('click', () => shareReferralCode('whatsapp'));
    document.getElementById('shareTelegram').addEventListener('click', () => shareReferralCode('telegram'));
    document.getElementById('shareFacebook').addEventListener('click', () => shareReferralCode('facebook'));

    // Withdrawal Page
    document.getElementById('submitWithdrawBtn').addEventListener('click', submitWithdrawal);
    document.getElementById('withdrawAmount').addEventListener('input', validateWithdrawalForm);
    document.getElementById('withdrawMethod').addEventListener('change', validateWithdrawalForm);
    document.getElementById('withdrawPhoneNumber').addEventListener('input', validateWithdrawalForm);

    // Profile Page
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// ============================================
// Navigation
// ============================================

function setupBottomNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function handleNavigation(e) {
    const pageId = e.currentTarget.dataset.page;
    switchPage(pageId);
}

function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update navigation button states
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        }
    });

    // Load page-specific data
    if (pageId === 'tasksPage') {
        loadTasks();
    } else if (pageId === 'referPage') {
        loadReferralData();
    } else if (pageId === 'withdrawPage') {
        loadWithdrawalData();
    } else if (pageId === 'profilePage') {
        loadProfileData();
    }
}

// ============================================
// Home Page
// ============================================

function loadDashboardData() {
    updateBalanceDisplay();
    loadRecentActivity();
    loadBanners();
}

function updateBalanceDisplay() {
    if (!appState.user) return;

    document.getElementById('totalBalance').textContent = appState.user.balance.toFixed(2);
    document.getElementById('taskEarnings').textContent = appState.user.taskBalance.toFixed(2);
    document.getElementById('referralEarnings').textContent = appState.user.referralBalance.toFixed(2);
    document.getElementById('completedTasks').textContent = appState.user.tasksCompleted;
    document.getElementById('totalReferrals').textContent = appState.user.activeReferrals;
    document.getElementById('totalWithdrawn').textContent = appState.user.totalWithdrawn.toFixed(2);
}

function loadRecentActivity() {
    const activities = getFromLocalStorage('activities') || [];
    const activityList = document.getElementById('recentActivity');

    if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-data">No activity yet</p>';
        return;
    }

    activityList.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-text">
                <div class="activity-type">${activity.type}</div>
            </div>
            <div class="activity-amount">+${activity.amount} BDT</div>
        </div>
    `).join('');
}

function loadBanners() {
    const banners = getFromLocalStorage('banners') || [];
    if (banners.length > 0) {
        document.getElementById('bannerImage').src = banners[0].imageUrl || 'assets/banner.png';
    }
}

// ============================================
// Tasks Page
// ============================================

function loadTasks() {
    const tasks = getFromLocalStorage('tasks') || generateDemoTasks();
    appState.tasks = tasks;
    displayTasks(appState.currentFilter);
}

function generateDemoTasks() {
    const demoTasks = [
        {
            id: 1,
            title: 'Follow Our Instagram',
            description: 'Follow @takaearn on Instagram',
            reward: 10,
            status: 'available',
            url: 'https://instagram.com/takaearn',
            type: 'follow'
        },
        {
            id: 2,
            title: 'Join Our Telegram Channel',
            description: 'Join our official Telegram channel for daily updates',
            reward: 10,
            status: 'available',
            url: 'https://t.me/takaearn',
            type: 'join'
        },
        {
            id: 3,
            title: 'Subscribe to YouTube',
            description: 'Subscribe to our YouTube channel',
            reward: 10,
            status: 'available',
            url: 'https://youtube.com/@takaearn',
            type: 'subscribe'
        },
        {
            id: 4,
            title: 'Like Our Facebook Page',
            description: 'Like and follow our Facebook page',
            reward: 10,
            status: 'available',
            url: 'https://facebook.com/takaearn',
            type: 'like'
        },
        {
            id: 5,
            title: 'Complete Your Profile',
            description: 'Fill in all your profile information',
            reward: 10,
            status: 'available',
            type: 'profile'
        }
    ];

    saveToLocalStorage('tasks', demoTasks);
    return demoTasks;
}

function displayTasks(filter) {
    appState.currentFilter = filter;
    const tasksList = document.getElementById('tasksList');

    let filteredTasks = appState.tasks;
    if (filter === 'available') {
        filteredTasks = appState.tasks.filter(t => t.status === 'available');
    } else if (filter === 'completed') {
        filteredTasks = appState.tasks.filter(t => t.status === 'completed');
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<p class="no-data">No tasks available</p>';
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-card" onclick="openTaskModal(${task.id})">
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <span class="task-reward">+${task.reward} BDT</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-footer">
                <span class="task-status ${task.status}">${task.status === 'completed' ? '✓ Completed' : 'Pending'}</span>
            </div>
        </div>
    `).join('');
}

function handleTaskFilter(e) {
    const filter = e.target.dataset.filter;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    displayTasks(filter);
}

function openTaskModal(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('taskModalTitle').textContent = task.title;
    document.getElementById('taskModalDescription').textContent = task.description;
    document.getElementById('taskModalReward').textContent = `${task.reward} BDT`;
    document.getElementById('taskModalStatus').textContent = task.status === 'completed' ? 'Completed' : 'Available';

    if (task.url) {
        document.getElementById('taskModalUrl').style.display = 'block';
        document.getElementById('taskLink').href = task.url;
    } else {
        document.getElementById('taskModalUrl').style.display = 'none';
    }

    const completeBtn = document.getElementById('completeTaskBtn');
    if (task.status === 'completed') {
        completeBtn.textContent = '✓ Task Completed';
        completeBtn.disabled = true;
    } else {
        completeBtn.textContent = 'Complete Task';
        completeBtn.disabled = false;
        completeBtn.onclick = () => completeTask(taskId);
    }

    document.getElementById('taskModal').classList.add('active');
}

function completeTask(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task || task.status === 'completed') return;

    task.status = 'completed';
    
    // Update balance
    appState.user.taskBalance += task.reward;
    appState.user.balance += task.reward;
    appState.user.tasksCompleted += 1;

    // Save data
    saveToLocalStorage('tasks', appState.tasks);
    saveToLocalStorage('user', appState.user);

    // Add activity
    addActivity(`Task Completed: ${task.title}`, task.reward);

    // Update UI
    updateBalanceDisplay();
    closeModal();
    displayTasks(appState.currentFilter);

    // Show success message
    showNotification('Task completed! +' + task.reward + ' BDT', 'success');
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
}

// ============================================
// Referral Page
// ============================================

function loadReferralData() {
    if (!appState.user) return;

    document.getElementById('referralCode').value = appState.user.referralCode;
    
    const referrals = getFromLocalStorage('referrals') || [];
    appState.referrals = referrals;

    const pending = referrals.filter(r => r.status === 'pending').length;
    const active = referrals.filter(r => r.status === 'active').length;
    const earned = referrals.reduce((sum, r) => sum + (r.status === 'active' ? CONFIG.REFERRAL_REWARD : 0), 0);

    document.getElementById('pendingReferrals').textContent = pending;
    document.getElementById('activeReferrals').textContent = active;
    document.getElementById('referralEarned').textContent = earned.toFixed(2);

    displayReferrals(referrals);
}

function displayReferrals(referrals) {
    const referralsList = document.getElementById('referralsList');

    if (referrals.length === 0) {
        referralsList.innerHTML = '<p class="no-data">No referrals yet. Share your code to get started!</p>';
        return;
    }

    referralsList.innerHTML = referrals.map((ref, index) => `
        <div class="referral-item">
            <div class="referral-info">
                <div class="referral-name">Referral ${index + 1}</div>
                <div class="referral-status">Status: ${ref.status} • Date: ${new Date(ref.joinedDate).toLocaleDateString()}</div>
            </div>
            <div class="referral-earning">${ref.status === 'active' ? '+' + CONFIG.REFERRAL_REWARD : '0'} BDT</div>
        </div>
    `).join('');
}

function copyReferralCode() {
    const code = document.getElementById('referralCode').value;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyCodeBtn');
        btn.classList.add('copied');
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = '📋 Copy';
        }, 2000);
        showNotification('Referral code copied!', 'success');
    });
}

function shareReferralCode(platform) {
    const code = document.getElementById('referralCode').value;
    const message = `Join TakaEarn and earn money! Use my referral code: ${code}\n\nEarn 20 BDT per successful referral!\n\nhttps://t.me/takaearn_bot`;

    let url = '';
    switch (platform) {
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(message)}`;
            break;
        case 'telegram':
            url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/takaearn_bot')}&text=${encodeURIComponent('Join TakaEarn with my code: ' + code)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=https://t.me/takaearn_bot&quote=${encodeURIComponent(message)}`;
            break;
    }

    if (url) {
        window.open(url, '_blank');
        addActivity(`Shared referral code via ${platform}`, 0);
    }
}

function generateReferralCode(userId) {
    return `TAK${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// ============================================
// Withdrawal Page
// ============================================

function loadWithdrawalData() {
    if (!appState.user) return;

    document.getElementById('availableBalance').textContent = appState.user.balance.toFixed(2) + ' BDT';

    const withdrawals = getFromLocalStorage('withdrawals') || [];
    appState.withdrawals = withdrawals;

    displayWithdrawalHistory(withdrawals);
    checkWithdrawalEligibility();
}

function checkWithdrawalEligibility() {
    const statusDiv = document.getElementById('withdrawalStatus');
    const form = document.querySelector('.withdrawal-form');
    const balance = appState.user.balance;
    const referrals = appState.referrals.filter(r => r.status === 'active').length;
    const previousWithdrawals = appState.withdrawals.filter(w => w.status === 'approved').length;

    statusDiv.innerHTML = '';
    statusDiv.classList.remove('success', 'error', 'warning');

    let canWithdraw = true;
    const issues = [];

    // Check minimum balance
    if (balance < CONFIG.MIN_WITHDRAWAL) {
        canWithdraw = false;
        issues.push(`Minimum balance required: ${CONFIG.MIN_WITHDRAWAL} BDT (You have ${balance.toFixed(2)} BDT)`);
    }

    // Check referrals for first withdrawal
    if (previousWithdrawals === 0 && referrals < CONFIG.REQUIRED_REFERRALS_FIRST_WITHDRAWAL) {
        canWithdraw = false;
        issues.push(`First withdrawal requires ${CONFIG.REQUIRED_REFERRALS_FIRST_WITHDRAWAL} active referrals (You have ${referrals})`);
    }

    if (!canWithdraw) {
        statusDiv.classList.add('warning');
        statusDiv.innerHTML = `<strong>⚠️ You cannot withdraw yet:</strong><br>` + issues.join('<br>');
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
    } else {
        statusDiv.classList.add('success');
        statusDiv.innerHTML = '✓ You are eligible to withdraw';
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
    }
}

function validateWithdrawalForm() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;
    const phone = document.getElementById('withdrawPhoneNumber').value;

    let amountError = '';
    let phoneError = '';

    if (amount && amount < CONFIG.MIN_WITHDRAWAL) {
        amountError = `Minimum withdrawal is ${CONFIG.MIN_WITHDRAWAL} BDT`;
    }
    if (amount && amount > appState.user.balance) {
        amountError = 'Insufficient balance';
    }

    if (phone && !/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) {
        phoneError = 'Invalid phone number';
    }

    document.getElementById('amountError').textContent = amountError;
    document.getElementById('phoneError').textContent = phoneError;

    const submitBtn = document.getElementById('submitWithdrawBtn');
    submitBtn.disabled = !amount || !method || !phone || amountError || phoneError;
}

function submitWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;
    const phone = document.getElementById('withdrawPhoneNumber').value;

    if (!amount || !method || !phone) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const withdrawal = {
        id: Date.now(),
        userId: appState.user.id,
        amount: amount,
        method: method,
        phone: phone,
        status: 'pending',
        requestDate: new Date().toISOString(),
        approvalDate: null,
        rejectionReason: null
    };

    // Deduct from balance temporarily
    appState.user.balance -= amount;
    
    // Save withdrawal
    const withdrawals = getFromLocalStorage('withdrawals') || [];
    withdrawals.push(withdrawal);
    saveToLocalStorage('withdrawals', withdrawals);
    saveToLocalStorage('user', appState.user);

    // Clear form
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawMethod').value = '';
    document.getElementById('withdrawPhoneNumber').value = '';

    // Show success message
    showNotification('Withdrawal request submitted! Your request is pending approval.', 'success');

    // Reload data
    updateBalanceDisplay();
    loadWithdrawalData();
}

function displayWithdrawalHistory(withdrawals) {
    const historyList = document.getElementById('withdrawalHistory');

    if (withdrawals.length === 0) {
        historyList.innerHTML = '<p class="no-data">No withdrawal history yet</p>';
        return;
    }

    historyList.innerHTML = withdrawals.slice().reverse().map(w => `
        <div class="history-item">
            <div class="history-info">
                <div class="history-amount">${w.amount} BDT</div>
                <div class="history-details">${w.method.toUpperCase()} • ${new Date(w.requestDate).toLocaleDateString()}</div>
            </div>
            <span class="history-status ${w.status}">${w.status.charAt(0).toUpperCase() + w.status.slice(1)}</span>
        </div>
    `).join('');
}

// ============================================
// Profile Page
// ============================================

function loadProfileData() {
    if (!appState.user) return;

    document.getElementById('profileName').textContent = `${appState.user.firstName} ${appState.user.lastName}`.trim();
    document.getElementById('profileId').textContent = `ID: ${appState.user.id}`;
    document.getElementById('profileJoinDate').textContent = `Joined: ${appState.user.joinedDate}`;

    document.getElementById('profileTasksCompleted').textContent = appState.user.tasksCompleted;
    document.getElementById('profileActiveReferrals').textContent = appState.user.activeReferrals;
    document.getElementById('profileTotalEarned').textContent = appState.user.balance.toFixed(2);
    document.getElementById('profileTotalWithdrawn').textContent = appState.user.totalWithdrawn.toFixed(2);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        tg.close();
    }
}

// ============================================
// User Display
// ============================================

function updateUserDisplay() {
    if (!appState.user) return;
    document.getElementById('userName').textContent = appState.user.firstName;
}

// ============================================
// Utilities
// ============================================

function saveToLocalStorage(key, data) {
    localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : null;
}

function addActivity(type, amount) {
    const activities = getFromLocalStorage('activities') || [];
    activities.unshift({
        type: type,
        amount: amount,
        date: new Date().toISOString()
    });
    // Keep only last 50 activities
    activities.splice(50);
    saveToLocalStorage('activities', activities);
    loadRecentActivity();
}

function showNotification(message, type = 'info') {
    const notification = {
        message: message,
        type: type,
        id: Date.now()
    };

    appState.notifications.push(notification);

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 150;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function loadUserData() {
    const savedUser = getFromLocalStorage('user');
    if (savedUser) {
        appState.user = savedUser;
        updateUserDisplay();
        updateBalanceDisplay();
    }
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle Telegram back button
tg.onEvent('backButtonClicked', () => {
    const activePage = document.querySelector('.page.active');
    if (activePage.id !== 'homePage') {
        switchPage('homePage');
    }
});
