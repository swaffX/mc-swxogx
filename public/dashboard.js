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
        roles: {
            title: 'Role Manager',
            content: getRolesContent
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
        if (page === 'roles') initRoles();
        if (page === 'settings') initSettings();
    }
}

// Dashboard Content
function getDashboardContent() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon purple">🎮</div>
                <div class="stat-info">
                    <div class="stat-label">Server Status</div>
                    <div class="stat-value" id="dashStatus">Checking...</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">👥</div>
                <div class="stat-info">
                    <div class="stat-label">Online Players</div>
                    <div class="stat-value" id="dashPlayers">0/20</div>
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
                <div class="stat-icon blue">💾</div>
                <div class="stat-info">
                    <div class="stat-label">Memory</div>
                    <div class="stat-value" id="dashMemory">--</div>
                </div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🎮</span>
                    <h2 class="card-title">Server Control</h2>
                </div>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;">
                    <button class="btn btn-success" onclick="serverAction('start')">
                        <span>▶️</span> Start
                    </button>
                    <button class="btn btn-danger" onclick="serverAction('stop')">
                        <span>⏹️</span> Stop
                    </button>
                    <button class="btn btn-warning" onclick="serverAction('restart')">
                        <span>🔄</span> Restart
                    </button>
                </div>
                <div id="serverControlInfo" style="font-size: 13px; color: var(--text-secondary);">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                        <span>⏱️ Uptime:</span>
                        <span id="serverUptime">--</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                        <span>💻 CPU:</span>
                        <span id="serverCPU">--</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                        <span>🔢 Version:</span>
                        <span>Paper 1.21.4</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">👥</span>
                    <h2 class="card-title">Online Players</h2>
                    <span class="nav-badge" id="dashPlayerCount" style="margin-left: auto;">0</span>
                </div>
                <div id="dashPlayersList" style="max-height: 200px; overflow-y: auto;">
                    <p style="color: var(--text-secondary); text-align: center; padding: 20px;">No players online</p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <span class="card-icon">📊</span>
                <h2 class="card-title">System Information</h2>
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

// Roles Content
function getRolesContent() {
    return `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">👑</span>
                <h2 class="card-title">Role Management</h2>
                <button class="btn btn-primary" onclick="createNewRole()" style="margin-left: auto;">
                    <span>➕</span> Create Role
                </button>
            </div>
            <div id="rolesList">Loading roles...</div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <span class="card-icon">👥</span>
                <h2 class="card-title">Player Roles</h2>
            </div>
            <div id="playerRolesList">Loading players...</div>
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

// Initialize Roles
function initRoles() {
    loadRoles();
    loadPlayerRoles();
}

// Role Management System
const defaultRoles = {
    admin: {
        name: 'Admin',
        color: '#ef4444',
        permissions: ['*']
    },
    moderator: {
        name: 'Moderator',
        color: '#f59e0b',
        permissions: ['kick', 'mute', 'warn', 'teleport']
    },
    vip: {
        name: 'VIP',
        color: '#8b5cf6',
        permissions: ['fly', 'kit.vip', 'home.3']
    },
    player: {
        name: 'Player',
        color: '#10b981',
        permissions: ['chat', 'build', 'break']
    }
};

async function loadRoles() {
    const rolesDiv = document.getElementById('rolesList');
    if (!rolesDiv) return;
    
    const roles = JSON.parse(localStorage.getItem('serverRoles') || JSON.stringify(defaultRoles));
    
    rolesDiv.innerHTML = Object.entries(roles).map(([id, role]) => `
        <div class="role-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: ${role.color}; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                    👑
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 16px;">${role.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${role.permissions.length} permissions</div>
                </div>
                <button class="btn btn-primary" onclick="editRole('${id}')" style="padding: 8px 16px; font-size: 13px;">
                    ✏️ Edit
                </button>
                ${id !== 'admin' && id !== 'player' ? `
                <button class="btn btn-danger" onclick="deleteRole('${id}')" style="padding: 8px 16px; font-size: 13px;">
                    🗑️
                </button>
                ` : ''}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${role.permissions.slice(0, 10).map(perm => `
                    <span style="background: rgba(139, 92, 246, 0.2); padding: 4px 10px; border-radius: 6px; font-size: 11px; color: #c4b5fd;">
                        ${perm}
                    </span>
                `).join('')}
                ${role.permissions.length > 10 ? `<span style="color: var(--text-secondary); font-size: 11px;">+${role.permissions.length - 10} more</span>` : ''}
            </div>
        </div>
    `).join('');
}

async function loadPlayerRoles() {
    const listDiv = document.getElementById('playerRolesList');
    if (!listDiv) return;
    
    try {
        const res = await fetch('/api/players', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.players && data.players.length > 0) {
            listDiv.innerHTML = data.players.map(playerName => {
                const playerRole = localStorage.getItem(`player_role_${playerName}`) || 'player';
                const roles = JSON.parse(localStorage.getItem('serverRoles') || JSON.stringify(defaultRoles));
                const role = roles[playerRole] || roles.player;
                
                return `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 8px;">
                        <img src="https://mc-heads.net/avatar/${playerName}/40" 
                             style="width: 40px; height: 40px; border-radius: 8px; image-rendering: pixelated;"
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect fill=%22%23374151%22 width=%2240%22 height=%2240%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2220%22>?</text></svg>'">
                        <div style="flex: 1;">
                            <div style="font-weight: 600;">${playerName}</div>
                            <div style="font-size: 12px; color: ${role.color};">${role.name}</div>
                        </div>
                        <select onchange="changePlayerRole('${playerName}', this.value)" 
                                style="background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; color: white; font-size: 13px;">
                            ${Object.entries(roles).map(([id, r]) => `
                                <option value="${id}" ${playerRole === id ? 'selected' : ''}>${r.name}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
            }).join('');
        } else {
            listDiv.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No players online</p>';
        }
    } catch (error) {
        listDiv.innerHTML = '<p style="color: var(--danger);">Failed to load players</p>';
    }
}

function createNewRole() {
    const roleName = prompt('Enter role name:');
    if (!roleName) return;
    
    const roleId = roleName.toLowerCase().replace(/\s+/g, '_');
    const roles = JSON.parse(localStorage.getItem('serverRoles') || JSON.stringify(defaultRoles));
    
    if (roles[roleId]) {
        showToast('Role already exists!', 'error');
        return;
    }
    
    roles[roleId] = {
        name: roleName,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        permissions: []
    };
    
    localStorage.setItem('serverRoles', JSON.stringify(roles));
    loadRoles();
    showToast(`Role "${roleName}" created!`, 'success');
}

function editRole(roleId) {
    const roles = JSON.parse(localStorage.getItem('serverRoles') || JSON.stringify(defaultRoles));
    const role = roles[roleId];
    
    const perms = prompt(`Edit permissions for ${role.name} (comma separated):`, role.permissions.join(', '));
    if (perms === null) return;
    
    role.permissions = perms.split(',').map(p => p.trim()).filter(p => p);
    localStorage.setItem('serverRoles', JSON.stringify(roles));
    loadRoles();
    showToast(`Role "${role.name}" updated!`, 'success');
}

function deleteRole(roleId) {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    const roles = JSON.parse(localStorage.getItem('serverRoles') || JSON.stringify(defaultRoles));
    delete roles[roleId];
    localStorage.setItem('serverRoles', JSON.stringify(roles));
    loadRoles();
    showToast('Role deleted!', 'success');
}

function changePlayerRole(playerName, newRole) {
    localStorage.setItem(`player_role_${playerName}`, newRole);
    showToast(`${playerName}'s role changed!`, 'success');
    loadPlayerRoles();
}

// API Calls
async function fetchServerStatus() {
    try {
        const [statusRes, tpsRes, playersRes] = await Promise.all([
            fetch('/api/status', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/tps', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/players', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const statusData = await statusRes.json();
        const tpsData = await tpsRes.json();
        const playersData = await playersRes.json();
        
        // Combine data
        const data = {
            online: statusData.running || false,
            players: playersData.online || 0,
            tps: tpsData.tps1m ? tpsData.tps1m.toFixed(1) : '--',
            memory: statusData.memory ? `${(statusData.memory / 1024 / 1024).toFixed(0)} MB` : '--',
            cpu: statusData.cpu ? `${statusData.cpu}%` : '--'
        };
        
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
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
                        <img src="https://mc-heads.net/avatar/${p}/40" 
                             style="width: 40px; height: 40px; border-radius: 8px; image-rendering: pixelated;"
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect fill=%22%23374151%22 width=%2240%22 height=%2240%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2220%22>?</text></svg>'">
                        <strong>👤 ${p}</strong>
                    </div>
                `).join('');
            } else {
                listDiv.innerHTML = '<p style="color: var(--text-secondary);">No players online</p>';
            }
        }
        
        // Update badge
        const badge = document.getElementById('playerBadge');
        if (badge) {
            badge.textContent = data.online || 0;
        }
    } catch (error) {
        console.error('Players fetch error:', error);
    }
}

async function updateDashboardPlayers() {
    try {
        const res = await fetch('/api/players', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        const listDiv = document.getElementById('dashPlayersList');
        if (listDiv) {
            if (data.players && data.players.length > 0) {
                listDiv.innerHTML = data.players.map(p => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 6px;">
                        <img src="https://mc-heads.net/avatar/${p}/32" 
                             style="width: 32px; height: 32px; border-radius: 6px; image-rendering: pixelated;"
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect fill=%22%23374151%22 width=%2232%22 height=%2232%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2216%22>?</text></svg>'">
                        <span style="font-weight: 500; font-size: 14px;">${p}</span>
                        <span style="margin-left: auto; width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
                    </div>
                `).join('');
            } else {
                listDiv.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No players online</p>';
            }
        }
    } catch (error) {
        console.error('Dashboard players fetch error:', error);
    }
}

function updateServerStatus(data) {
    const statusEl = document.getElementById('serverStatus');
    const dashStatus = document.getElementById('dashStatus');
    const dashPlayers = document.getElementById('dashPlayers');
    const dashTPS = document.getElementById('dashTPS');
    const dashMemory = document.getElementById('dashMemory');
    const dashPlayerCount = document.getElementById('dashPlayerCount');
    const serverUptime = document.getElementById('serverUptime');
    const serverCPU = document.getElementById('serverCPU');
    
    if (statusEl) {
        statusEl.className = 'server-status ' + (data.online ? 'online' : 'offline');
        statusEl.querySelector('span').textContent = data.online ? 'Online' : 'Offline';
    }
    
    if (dashStatus) dashStatus.textContent = data.online ? '✅ Online' : '❌ Offline';
    if (dashPlayers) dashPlayers.textContent = `${data.players || 0}/20`;
    if (dashTPS) dashTPS.textContent = data.tps || '--';
    if (dashMemory) dashMemory.textContent = data.memory || '--';
    if (dashPlayerCount) dashPlayerCount.textContent = data.players || 0;
    if (serverUptime) serverUptime.textContent = data.uptime || '--';
    if (serverCPU) serverCPU.textContent = data.cpu || '--';
    
    // Update dashboard players list
    updateDashboardPlayers();
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
