// Auth Check
const token = localStorage.getItem('authToken');
if (!token) {
    window.location.href = '/login.html';
}

// User Info
const userName = localStorage.getItem('userName') || 'User';
const userRole = localStorage.getItem('userRole') || 'user';

document.getElementById('userName').textContent = userName;
document.getElementById('userRole').textContent = userRole;

// Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
});

// Restore sidebar state
if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const { getAuth, signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const auth = getAuth();
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    localStorage.clear();
    window.location.href = '/login.html';
});

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const contentArea = document.getElementById('contentArea');
const pageTitle = document.getElementById('pageTitle');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Load page
        const page = item.dataset.page;
        loadPage(page);
    });
});

// Load Page Content
function loadPage(page) {
    const pages = {
        dashboard: {
            title: 'Dashboard',
            content: getDashboardContent
        },
        server: {
            title: 'Server Control',
            content: getServerContent
        },
        players: {
            title: 'Players',
            content: getPlayersContent
        },
        console: {
            title: 'Console',
            content: getConsoleContent
        },
        performance: {
            title: 'Performance',
            content: getPerformanceContent
        },
        settings: {
            title: 'Settings',
            content: getSettingsContent
        }
    };
    
    const pageData = pages[page];
    if (pageData) {
        pageTitle.textContent = pageData.title;
        contentArea.innerHTML = pageData.content();
        
        // Initialize page-specific functionality
        if (page === 'dashboard') initDashboard();
        if (page === 'server') initServerControl();
        if (page === 'players') initPlayers();
        if (page === 'console') initConsole();
        if (page === 'performance') initPerformance();
        if (page === 'settings') initSettings();
    }
}

// Dashboard Content
function getDashboardContent() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue">🎮</div>
                <div class="stat-info">
                    <div class="stat-label">Server Status</div>
                    <div class="stat-value" id="dashStatus">Checking...</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">👥</div>
                <div class="stat-info">
                    <div class="stat-label">Online Players</div>
                    <div class="stat-value" id="dashPlayers">0</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">⚡</div>
                <div class="stat-info">
                    <div class="stat-label">TPS</div>
                    <div class="stat-value" id="dashTPS">--</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple">💾</div>
                <div class="stat-info">
                    <div class="stat-label">Memory</div>
                    <div class="stat-value" id="dashMemory">--</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <span class="card-icon">📊</span>
                <h2 class="card-title">Quick Overview</h2>
            </div>
            <div id="dashboardOverview">Loading...</div>
        </div>
    `;
}

// Server Control Content
function getServerContent() {
    return `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">🎮</span>
                <h2 class="card-title">Server Controls</h2>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-success" onclick="serverAction('start')">
                    <span>▶️</span> Start Server
                </button>
                <button class="btn btn-danger" onclick="serverAction('stop')">
                    <span>⏹️</span> Stop Server
                </button>
                <button class="btn btn-primary" onclick="serverAction('restart')">
                    <span>🔄</span> Restart Server
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <span class="card-icon">📊</span>
                <h2 class="card-title">System Information</h2>
            </div>
            <div id="systemInfo">Loading...</div>
        </div>
    `;
}

// Players Content
function getPlayersContent() {
    return `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">👥</span>
                <h2 class="card-title">Online Players</h2>
            </div>
            <div id="playersList">Loading...</div>
        </div>
    `;
}

// Console Content
function getConsoleContent() {
    return `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">💻</span>
                <h2 class="card-title">Server Console</h2>
            </div>
            <div style="margin-bottom: 16px; display: flex; gap: 12px;">
                <input type="text" id="consoleInput" placeholder="Enter command..." 
                    style="flex: 1; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 10px; color: white; font-family: 'JetBrains Mono', monospace;">
                <button class="btn btn-primary" onclick="sendConsoleCommand()">
                    <span>📤</span> Send
                </button>
            </div>
            <div id="consoleOutput" style="background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 10px; padding: 16px; height: 500px; overflow-y: auto; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
                <div style="color: var(--text-secondary);">Console ready...</div>
            </div>
        </div>
    `;
}

// Performance Content
function getPerformanceContent() {
    return `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">📈</span>
                <h2 class="card-title">Performance Metrics</h2>
            </div>
            <canvas id="perfChart" height="300"></canvas>
        </div>
    `;
}

// Settings Content
function getSettingsContent() {
    return `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">⚙️</span>
                <h2 class="card-title">Server Settings</h2>
            </div>
            <div id="settingsContent">
                <p style="color: var(--text-secondary);">Settings panel coming soon...</p>
            </div>
        </div>
    `;
}

// Initialize Dashboard
function initDashboard() {
    fetchServerStatus();
    setInterval(fetchServerStatus, 5000);
}

// Initialize Server Control
function initServerControl() {
    fetchSystemInfo();
}

// Initialize Players
function initPlayers() {
    fetchPlayers();
    setInterval(fetchPlayers, 5000);
}

// Initialize Console
function initConsole() {
    const input = document.getElementById('consoleInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendConsoleCommand();
        });
    }
}

// Initialize Performance
function initPerformance() {
    initPerformanceChart();
}

// Initialize Settings
function initSettings() {
    // Settings initialization
}

// API Calls
async function fetchServerStatus() {
    try {
        const res = await fetch('/api/status', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        updateServerStatus(data);
    } catch (error) {
        console.error('Status fetch error:', error);
    }
}

async function fetchSystemInfo() {
    try {
        const res = await fetch('/api/system-info', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        const infoDiv = document.getElementById('systemInfo');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <div style="display: grid; gap: 12px;">
                    <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <strong>CPU:</strong> ${data.cpu || 'N/A'}
                    </div>
                    <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <strong>Memory:</strong> ${data.memory || 'N/A'}
                    </div>
                    <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <strong>Uptime:</strong> ${data.uptime || 'N/A'}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('System info fetch error:', error);
    }
}

async function fetchPlayers() {
    try {
        const res = await fetch('/api/players', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        const listDiv = document.getElementById('playersList');
        if (listDiv) {
            if (data.players && data.players.length > 0) {
                listDiv.innerHTML = data.players.map(p => `
                    <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
                        <strong>${p.name}</strong>
                    </div>
                `).join('');
            } else {
                listDiv.innerHTML = '<p style="color: var(--text-secondary);">No players online</p>';
            }
        }
        
        // Update badge
        const badge = document.getElementById('playerBadge');
        if (badge) {
            badge.textContent = data.count || 0;
        }
    } catch (error) {
        console.error('Players fetch error:', error);
    }
}

function updateServerStatus(data) {
    const statusEl = document.getElementById('serverStatus');
    const dashStatus = document.getElementById('dashStatus');
    const dashPlayers = document.getElementById('dashPlayers');
    const dashTPS = document.getElementById('dashTPS');
    const dashMemory = document.getElementById('dashMemory');
    
    if (statusEl) {
        statusEl.className = 'server-status ' + (data.online ? 'online' : 'offline');
        statusEl.querySelector('span').textContent = data.online ? 'Online' : 'Offline';
    }
    
    if (dashStatus) dashStatus.textContent = data.online ? 'Online' : 'Offline';
    if (dashPlayers) dashPlayers.textContent = data.players || 0;
    if (dashTPS) dashTPS.textContent = data.tps || '--';
    if (dashMemory) dashMemory.textContent = data.memory || '--';
}

async function serverAction(action) {
    try {
        const res = await fetch(`/api/server/${action}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        showToast(data.message || `Server ${action} successful`, 'success');
    } catch (error) {
        showToast(`Failed to ${action} server`, 'error');
    }
}

async function sendConsoleCommand() {
    const input = document.getElementById('consoleInput');
    const output = document.getElementById('consoleOutput');
    
    if (!input || !output) return;
    
    const command = input.value.trim();
    if (!command) return;
    
    try {
        const res = await fetch('/api/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ command })
        });
        const data = await res.json();
        
        output.innerHTML += `<div style="color: #3b82f6; margin-top: 8px;">> ${command}</div>`;
        output.innerHTML += `<div style="color: #10b981;">${data.output || 'Command sent'}</div>`;
        output.scrollTop = output.scrollHeight;
        
        input.value = '';
    } catch (error) {
        output.innerHTML += `<div style="color: #ef4444;">Error: ${error.message}</div>`;
    }
}

function initPerformanceChart() {
    const canvas = document.getElementById('perfChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'TPS',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, max: 20 }
            }
        }
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `<span style="font-size: 20px;">${icons[type]}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Load initial page
loadPage('dashboard');
