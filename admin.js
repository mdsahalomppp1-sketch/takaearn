// ============================================
// TakaEarn Admin Panel - Main Script
// ============================================

// Application State
const adminState = {
    currentSection: 'dashboard',
    users: [],
    tasks: [],
    withdrawals: [],
    referrals: [],
    notices: [],
    banners: [],
    settings: {
        taskReward: 10,
        referralReward: 20,
        minWithdrawal: 200,
        requiredReferrals: 5,
        appStatus: 'active'
    },
    charts: {
        revenue: null,
        activity: null
    }
};

const STORAGE_PREFIX = 'takaearn_';

// ============================================
// Initialize Admin Panel
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadAllData();
    setupMenuNavigation();
    loadDashboard();
});

function initializeEventListeners() {
    // Menu Navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });

    // Sidebar Toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);

    // Modal Close Buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Task Management
    document.getElementById('addTaskBtn')?.addEventListener('click', openAddTaskModal);
    document.getElementById('taskForm')?.addEventListener('submit', saveTask);

    // Notice Management
    document.getElementById('addNoticeBtn')?.addEventListener('click', openAddNoticeModal);
    document.getElementById('noticeForm')?.addEventListener('submit', saveNotice);

    // Banner Management
    document.getElementById('addBannerBtn')?.addEventListener('click', openAddBannerModal);
    document.getElementById('bannerForm')?.addEventListener('submit', saveBanner);

    // Settings
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);

    // Search & Filter
    document.getElementById('userSearch')?.addEventListener('input', filterUsers);
    document.getElementById('referralSearch')?.addEventListener('input', filterReferrals);
    document.getElementById('withdrawalFilter')?.addEventListener('change', filterWithdrawals);

    // Logout
    document.getElementById('adminLogout').addEventListener('click', logoutAdmin);
}

function setupMenuNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function toggleSidebar() {
    document.querySelector('.admin-container').classList.toggle('sidebar-collapsed');
}

// ============================================
// Section Navigation
// ============================================

function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionName + 'Section');
    if (section) {
        section.classList.add('active');
        document.getElementById('sectionTitle').textContent = sectionName
            .charAt(0).toUpperCase() + sectionName.slice(1);

        // Load section-specific data
        if (sectionName === 'dashboard') {
            loadDashboard();
        } else if (sectionName === 'users') {
            loadUsersTable();
        } else if (sectionName === 'tasks') {
            loadTasksTable();
        } else if (sectionName === 'withdrawals') {
            loadWithdrawalsTable();
        } else if (sectionName === 'referrals') {
            loadReferralsTable();
        } else if (sectionName === 'notices') {
            loadNoticesList();
        } else if (sectionName === 'banners') {
            loadBannersList();
        } else if (sectionName === 'settings') {
            loadSettings();
        }
    }

    adminState.currentSection = sectionName;
}

// ============================================
// Dashboard
// ============================================

function loadDashboard() {
    loadAllData();
    updateDashboardStats();
    updateCharts();
    loadRecentWithdrawals();
}

function updateDashboardStats() {
    const users = getFromLocalStorage('users') || [];
    const tasks = getFromLocalStorage('tasks') || [];
    const withdrawals = getFromLocalStorage('withdrawals') || [];

    const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
    const activeTasks = tasks.filter(t => t.status === 'available').length;

    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalBalance').textContent = totalBalance.toFixed(2) + ' BDT';
    document.getElementById('pendingCount').textContent = pendingWithdrawals;
    document.getElementById('activeTasks').textContent = activeTasks;
}

function updateCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        if (adminState.charts.revenue) {
            adminState.charts.revenue.destroy();
        }

        adminState.charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue (BDT)',
                    data: [1200, 1900, 1500, 2200],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#f1f5f9'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: '#334155'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: '#334155'
                        }
                    }
                }
            }
        });
    }

    // Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        if (adminState.charts.activity) {
            adminState.charts.activity.destroy();
        }

        adminState.charts.activity = new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: ['Tasks', 'Referrals', 'Withdrawals'],
                datasets: [{
                    label: 'Activity Count',
                    data: [45, 32, 18],
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#10b981'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#f1f5f9'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: '#334155'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: '#334155'
                        }
                    }
                }
            }
        });
    }
}

function loadRecentWithdrawals() {
    const withdrawals = getFromLocalStorage('withdrawals') || [];
    const users = getFromLocalStorage('users') || [];
    const container = document.getElementById('recentWithdrawals');

    const recentItems = withdrawals
        .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
        .slice(0, 5);

    if (recentItems.length === 0) {
        container.innerHTML = '<p class="no-data">No withdrawals yet</p>';
        return;
    }

    container.innerHTML = recentItems.map(item => {
        const user = users.find(u => u.id === item.userId);
        return `
            <div class="recent-item">
                <div>
                    <strong>${item.amount} BDT</strong>
                    <br>
                    <small>${user?.firstName || 'Unknown'} • ${item.method.toUpperCase()}</small>
                </div>
                <span class="status-badge status-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
            </div>
        `;
    }).join('');
}

// ============================================
// Users Management
// ============================================

function loadUsersTable() {
    const users = getFromLocalStorage('users') || [];
    adminState.users = users;
    displayUsersTable(users);
}

function displayUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName || ''}</td>
            <td>@${user.username || '-'}</td>
            <td>${user.balance?.toFixed(2) || '0.00'} BDT</td>
            <td>${user.tasksCompleted || 0}</td>
            <td>${user.activeReferrals || 0}</td>
            <td><span class="status-badge status-active">Active</span></td>
            <td>
                <button class="action-btn edit" onclick="viewUserDetails(${user.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterUsers(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = adminState.users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.username?.toLowerCase().includes(searchTerm)
    );
    displayUsersTable(filtered);
}

function viewUserDetails(userId) {
    const user = adminState.users.find(u => u.id === userId);
    if (!user) return;

    const detailsDiv = document.getElementById('userDetails');
    detailsDiv.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">User ID:</span>
            <span class="detail-value">${user.id}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${user.firstName} ${user.lastName || ''}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Username:</span>
            <span class="detail-value">@${user.username || '-'}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Balance:</span>
            <span class="detail-value">${user.balance?.toFixed(2)} BDT</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Tasks Completed:</span>
            <span class="detail-value">${user.tasksCompleted || 0}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Active Referrals:</span>
            <span class="detail-value">${user.activeReferrals || 0}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Joined Date:</span>
            <span class="detail-value">${user.joinedDate || '-'}</span>
        </div>
    `;

    document.getElementById('userModal').classList.add('active');
    document.getElementById('updateUserBalanceBtn').onclick = () => updateUserBalance(user.id);
    document.getElementById('blockUserBtn').onclick = () => blockUser(user.id);
}

function updateUserBalance(userId) {
    const newBalance = prompt('Enter new balance (BDT):');
    if (newBalance === null) return;

    const user = adminState.users.find(u => u.id === userId);
    if (user) {
        user.balance = parseFloat(newBalance) || 0;
        saveToLocalStorage('users', adminState.users);
        showNotification('User balance updated successfully', 'success');
        closeModal('userModal');
    }
}

function blockUser(userId) {
    if (confirm('Are you sure you want to block this user?')) {
        const users = adminState.users.filter(u => u.id !== userId);
        saveToLocalStorage('users', users);
        adminState.users = users;
        showNotification('User blocked successfully', 'success');
        loadUsersTable();
        closeModal('userModal');
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        blockUser(userId);
    }
}

// ============================================
// Tasks Management
// ============================================

function loadTasksTable() {
    const tasks = getFromLocalStorage('tasks') || [];
    adminState.tasks = tasks;
    displayTasksTable(tasks);
}

function displayTasksTable(tasks) {
    const tbody = document.getElementById('tasksTableBody');

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No tasks found</td></tr>';
        return;
    }

    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.reward} BDT</td>
            <td>${task.type || 'other'}</td>
            <td><span class="status-badge status-${task.status}">${task.status}</span></td>
            <td>${task.completedCount || 0}</td>
            <td>
                <button class="action-btn edit" onclick="editTask(${task.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteTask(${task.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openAddTaskModal() {
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskForm').dataset.taskId = '';
    document.getElementById('taskModal').classList.add('active');
}

function editTask(taskId) {
    const task = adminState.tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskRewardInput').value = task.reward;
    document.getElementById('taskType').value = task.type || 'other';
    document.getElementById('taskUrl').value = task.url || '';
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskForm').dataset.taskId = taskId;
    document.getElementById('taskModal').classList.add('active');
}

function saveTask(e) {
    e.preventDefault();

    const taskId = parseInt(e.target.dataset.taskId) || Date.now();
    const task = {
        id: taskId,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        reward: parseInt(document.getElementById('taskRewardInput').value),
        type: document.getElementById('taskType').value,
        url: document.getElementById('taskUrl').value,
        status: document.getElementById('taskStatus').value,
        completedCount: adminState.tasks.find(t => t.id === taskId)?.completedCount || 0
    };

    const index = adminState.tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
        adminState.tasks[index] = task;
    } else {
        adminState.tasks.push(task);
    }

    saveToLocalStorage('tasks', adminState.tasks);
    loadTasksTable();
    closeModal('taskModal');
    showNotification('Task saved successfully', 'success');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        adminState.tasks = adminState.tasks.filter(t => t.id !== taskId);
        saveToLocalStorage('tasks', adminState.tasks);
        loadTasksTable();
        showNotification('Task deleted successfully', 'success');
    }
}

// ============================================
// Withdrawals Management
// ============================================

function loadWithdrawalsTable() {
    const withdrawals = getFromLocalStorage('withdrawals') || [];
    adminState.withdrawals = withdrawals;
    displayWithdrawalsTable(withdrawals);
}

function displayWithdrawalsTable(withdrawals) {
    const tbody = document.getElementById('withdrawalsTableBody');

    if (withdrawals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No withdrawals found</td></tr>';
        return;
    }

    const users = getFromLocalStorage('users') || [];

    tbody.innerHTML = withdrawals.map(w => {
        const user = users.find(u => u.id === w.userId);
        return `
            <tr>
                <td>${w.id}</td>
                <td>${user?.firstName || 'Unknown'}</td>
                <td>${w.amount} BDT</td>
                <td>${w.method.toUpperCase()}</td>
                <td>${w.phone}</td>
                <td>${new Date(w.requestDate).toLocaleDateString()}</td>
                <td><span class="status-badge status-${w.status}">${w.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="viewWithdrawalDetails(${w.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterWithdrawals(e) {
    const status = e.target.value;
    let filtered = adminState.withdrawals;

    if (status) {
        filtered = adminState.withdrawals.filter(w => w.status === status);
    }

    displayWithdrawalsTable(filtered);
}

function viewWithdrawalDetails(withdrawalId) {
    const withdrawal = adminState.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    const users = getFromLocalStorage('users') || [];
    const user = users.find(u => u.id === withdrawal.userId);

    const detailsDiv = document.getElementById('withdrawalDetails');
    detailsDiv.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Withdrawal ID:</span>
            <span class="detail-value">${withdrawal.id}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">User:</span>
            <span class="detail-value">${user?.firstName} ${user?.lastName || ''}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Amount:</span>
            <span class="detail-value">${withdrawal.amount} BDT</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Method:</span>
            <span class="detail-value">${withdrawal.method.toUpperCase()}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${withdrawal.phone}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Request Date:</span>
            <span class="detail-value">${new Date(withdrawal.requestDate).toLocaleString()}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value"><span class="status-badge status-${withdrawal.status}">${withdrawal.status}</span></span>
        </div>
    `;

    const rejectionGroup = document.getElementById('rejectionReasonGroup');
    if (withdrawal.status === 'pending') {
        rejectionGroup.style.display = 'block';
    } else {
        rejectionGroup.style.display = 'none';
    }

    document.getElementById('withdrawalModal').classList.add('active');
    document.getElementById('approveWithdrawalBtn').onclick = () => approveWithdrawal(withdrawalId);
    document.getElementById('rejectWithdrawalBtn').onclick = () => rejectWithdrawal(withdrawalId);
}

function approveWithdrawal(withdrawalId) {
    const withdrawal = adminState.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    withdrawal.status = 'approved';
    withdrawal.approvalDate = new Date().toISOString();

    const users = getFromLocalStorage('users') || [];
    const user = users.find(u => u.id === withdrawal.userId);
    if (user) {
        user.totalWithdrawn = (user.totalWithdrawn || 0) + withdrawal.amount;
        saveToLocalStorage('users', users);
    }

    saveToLocalStorage('withdrawals', adminState.withdrawals);
    loadWithdrawalsTable();
    closeModal('withdrawalModal');
    showNotification('Withdrawal approved successfully', 'success');
}

function rejectWithdrawal(withdrawalId) {
    const reason = document.getElementById('rejectionReason').value;
    if (!reason) {
        showNotification('Please provide a rejection reason', 'error');
        return;
    }

    const withdrawal = adminState.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = reason;

    const users = getFromLocalStorage('users') || [];
    const user = users.find(u => u.id === withdrawal.userId);
    if (user) {
        user.balance += withdrawal.amount; // Refund to user
        saveToLocalStorage('users', users);
    }

    saveToLocalStorage('withdrawals', adminState.withdrawals);
    loadWithdrawalsTable();
    closeModal('withdrawalModal');
    showNotification('Withdrawal rejected successfully', 'success');
}

// ============================================
// Referrals Management
// ============================================

function loadReferralsTable() {
    const referrals = getFromLocalStorage('referrals') || [];
    adminState.referrals = referrals;
    displayReferralsTable(referrals);
}

function displayReferralsTable(referrals) {
    const tbody = document.getElementById('referralsTableBody');

    if (referrals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No referrals found</td></tr>';
        return;
    }

    tbody.innerHTML = referrals.map(ref => `
        <tr>
            <td>${ref.id}</td>
            <td>${ref.referrerName || 'Unknown'}</td>
            <td>${ref.refereeName || 'Unknown'}</td>
            <td><span class="status-badge status-${ref.status}">${ref.status}</span></td>
            <td>${ref.status === 'active' ? '20.00' : '0.00'} BDT</td>
            <td>${new Date(ref.joinedDate).toLocaleDateString()}</td>
            <td>
                <button class="action-btn delete" onclick="deleteReferral(${ref.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterReferrals(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = adminState.referrals.filter(ref =>
        ref.referrerName?.toLowerCase().includes(searchTerm) ||
        ref.refereeName?.toLowerCase().includes(searchTerm)
    );
    displayReferralsTable(filtered);
}

function deleteReferral(referralId) {
    if (confirm('Are you sure you want to delete this referral?')) {
        adminState.referrals = adminState.referrals.filter(r => r.id !== referralId);
        saveToLocalStorage('referrals', adminState.referrals);
        loadReferralsTable();
        showNotification('Referral deleted successfully', 'success');
    }
}

// ============================================
// Notices Management
// ============================================

function loadNoticesList() {
    const notices = getFromLocalStorage('notices') || [];
    adminState.notices = notices;
    displayNoticesList(notices);
}

function displayNoticesList(notices) {
    const container = document.getElementById('noticesList');

    if (notices.length === 0) {
        container.innerHTML = '<p class="no-data">No notices found</p>';
        return;
    }

    container.innerHTML = notices.map(notice => `
        <div class="notice-card">
            <div class="notice-header">
                <h4 class="notice-title">${notice.title}</h4>
                <span class="notice-type ${notice.type}">${notice.type}</span>
            </div>
            <p class="notice-message">${notice.message}</p>
            <div class="notice-actions">
                <button class="action-btn edit" onclick="editNotice(${notice.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteNotice(${notice.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openAddNoticeModal() {
    document.getElementById('noticeModalTitle').textContent = 'Add Notice';
    document.getElementById('noticeForm').reset();
    document.getElementById('noticeForm').dataset.noticeId = '';
    document.getElementById('noticeModal').classList.add('active');
}

function editNotice(noticeId) {
    const notice = adminState.notices.find(n => n.id === noticeId);
    if (!notice) return;

    document.getElementById('noticeModalTitle').textContent = 'Edit Notice';
    document.getElementById('noticeTitle').value = notice.title;
    document.getElementById('noticeMessage').value = notice.message;
    document.getElementById('noticeType').value = notice.type;
    document.getElementById('noticeStatus').value = notice.status;
    document.getElementById('noticeForm').dataset.noticeId = noticeId;
    document.getElementById('noticeModal').classList.add('active');
}

function saveNotice(e) {
    e.preventDefault();

    const noticeId = parseInt(e.target.dataset.noticeId) || Date.now();
    const notice = {
        id: noticeId,
        title: document.getElementById('noticeTitle').value,
        message: document.getElementById('noticeMessage').value,
        type: document.getElementById('noticeType').value,
        status: document.getElementById('noticeStatus').value,
        createdAt: new Date().toISOString()
    };

    const index = adminState.notices.findIndex(n => n.id === noticeId);
    if (index >= 0) {
        adminState.notices[index] = notice;
    } else {
        adminState.notices.push(notice);
    }

    saveToLocalStorage('notices', adminState.notices);
    loadNoticesList();
    closeModal('noticeModal');
    showNotification('Notice saved successfully', 'success');
}

function deleteNotice(noticeId) {
    if (confirm('Are you sure you want to delete this notice?')) {
        adminState.notices = adminState.notices.filter(n => n.id !== noticeId);
        saveToLocalStorage('notices', adminState.notices);
        loadNoticesList();
        showNotification('Notice deleted successfully', 'success');
    }
}

// ============================================
// Banners Management
// ============================================

function loadBannersList() {
    const banners = getFromLocalStorage('banners') || [];
    adminState.banners = banners;
    displayBannersList(banners);
}

function displayBannersList(banners) {
    const container = document.getElementById('bannersList');

    if (banners.length === 0) {
        container.innerHTML = '<p class="no-data">No banners found</p>';
        return;
    }

    container.innerHTML = banners.map(banner => `
        <div class="banner-card">
            <div class="banner-image-container">
                <img src="${banner.imageUrl}" alt="${banner.title}">
            </div>
            <div class="banner-info">
                <h4 class="banner-title">${banner.title}</h4>
                <span class="status-badge status-${banner.status}">${banner.status}</span>
                <div class="banner-actions">
                    <button class="action-btn edit" onclick="editBanner(${banner.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteBanner(${banner.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openAddBannerModal() {
    document.getElementById('bannerModalTitle').textContent = 'Add Banner';
    document.getElementById('bannerForm').reset();
    document.getElementById('bannerForm').dataset.bannerId = '';
    document.getElementById('bannerModal').classList.add('active');
}

function editBanner(bannerId) {
    const banner = adminState.banners.find(b => b.id === bannerId);
    if (!banner) return;

    document.getElementById('bannerModalTitle').textContent = 'Edit Banner';
    document.getElementById('bannerTitle').value = banner.title;
    document.getElementById('bannerImage').value = banner.imageUrl;
    document.getElementById('bannerLink').value = banner.link || '';
    document.getElementById('bannerStatus').value = banner.status;
    document.getElementById('bannerForm').dataset.bannerId = bannerId;
    document.getElementById('bannerModal').classList.add('active');
}

function saveBanner(e) {
    e.preventDefault();

    const bannerId = parseInt(e.target.dataset.bannerId) || Date.now();
    const banner = {
        id: bannerId,
        title: document.getElementById('bannerTitle').value,
        imageUrl: document.getElementById('bannerImage').value,
        link: document.getElementById('bannerLink').value,
        status: document.getElementById('bannerStatus').value,
        createdAt: new Date().toISOString()
    };

    const index = adminState.banners.findIndex(b => b.id === bannerId);
    if (index >= 0) {
        adminState.banners[index] = banner;
    } else {
        adminState.banners.push(banner);
    }

    saveToLocalStorage('banners', adminState.banners);
    loadBannersList();
    closeModal('bannerModal');
    showNotification('Banner saved successfully', 'success');
}

function deleteBanner(bannerId) {
    if (confirm('Are you sure you want to delete this banner?')) {
        adminState.banners = adminState.banners.filter(b => b.id !== bannerId);
        saveToLocalStorage('banners', adminState.banners);
        loadBannersList();
        showNotification('Banner deleted successfully', 'success');
    }
}

// ============================================
// Settings Management
// ============================================

function loadSettings() {
    const settings = getFromLocalStorage('settings') || adminState.settings;

    document.getElementById('taskReward').value = settings.taskReward || 10;
    document.getElementById('referralReward').value = settings.referralReward || 20;
    document.getElementById('minWithdrawal').value = settings.minWithdrawal || 200;
    document.getElementById('requiredReferrals').value = settings.requiredReferrals || 5;
    document.getElementById('appStatus').value = settings.appStatus || 'active';
}

function saveSettings() {
    const settings = {
        taskReward: parseInt(document.getElementById('taskReward').value),
        referralReward: parseInt(document.getElementById('referralReward').value),
        minWithdrawal: parseInt(document.getElementById('minWithdrawal').value),
        requiredReferrals: parseInt(document.getElementById('requiredReferrals').value),
        appStatus: document.getElementById('appStatus').value
    };

    saveToLocalStorage('settings', settings);
    adminState.settings = settings;
    showNotification('Settings saved successfully', 'success');
}

// ============================================
// Utilities
// ============================================

function loadAllData() {
    adminState.users = getFromLocalStorage('users') || [];
    adminState.tasks = getFromLocalStorage('tasks') || [];
    adminState.withdrawals = getFromLocalStorage('withdrawals') || [];
    adminState.referrals = getFromLocalStorage('referrals') || [];
    adminState.notices = getFromLocalStorage('notices') || [];
    adminState.banners = getFromLocalStorage('banners') || [];
    adminState.settings = getFromLocalStorage('settings') || adminState.settings;
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : null;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 300;
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

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'admin-login.html';
    }
}

// Add animation styles
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

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
