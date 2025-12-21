// ============================================
// SWXOGX Minecraft Server Panel - JavaScript
// ============================================

const API_URL = '';
let serverData = { running: false, uptime: 0, memory: 0, cpu: 0, restarts: 0 };
let serverInfo = { motd: '-', port: '25565', difficulty: '-', gamemode: '-', maxPlayers: 20 };
let playersData = { online: 0, max: 20 };
let statsChart = null;
let authToken = null;
let userRole = 'user';

// Auth Check
function checkAuth() {
    authToken = localStorage.getItem('authToken');
    userRole = localStorage.getItem('userRole') || 'user';
    const userName = localStorage.getItem('userName');
    
    if (!authToken) {
        window.location.href = '/checking.html';
        return false;
    }
    
    // Kullanıcı bilgisini göster
    updateUserInfo(userName, userRole);
    return true;
}

// Update User Info
function updateUserInfo(name, role) {
    const roleColors = {
        admin: '#ef4444',
        moderator: '#f59e0b',
        user: '#10b981'
    };
    
    const roleNames = {
        admin: 'Admin',
        moderator: 'Moderatör',
        user: 'Kullanıcı'
    };
    
    // Header'a kullanıcı bilgisi ekle
    const headerContent = document.querySelector('.header-content');
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `
        <div class="user-badge" style="background: ${roleColors[role]}20; color: ${roleColors[role]}; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px;">
            <span>👤 ${name}</span>
            <span style="opacity: 0.7;">•</span>
            <span>${roleNames[role]}</span>
        </div>
        ${role === 'admin' ? '<a href="/admin.html" class="btn-icon" title="Admin Panel" style="margin-left: 12px; padding: 8px 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #ef4444; text-decoration: none; font-size: 14px; font-weight: 600;">👑 Admin</a>' : ''}
        <button onclick="logout()" style="margin-left: 12px; padding: 8px 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #ef4444; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">Çıkış Yap</button>
    `;
    headerContent.appendChild(userInfo);
    
    // Yetki kontrolü - butonları gizle/göster
    updateUIPermissions(role);
}

// Update UI based on permissions
function updateUIPermissions(role) {
    const btnStop = document.getElementById('btnStop');
    const btnStart = document.getElementById('btnStart');
    const btnRestart = document.getElementById('btnRestart');
    const consoleInput = document.getElementById('consoleInput');
    const btnSend = document.querySelector('.btn-send');
    
    // Butonlar henüz render edilmemişse çık
    if (!btnStop || !btnStart || !btnRestart) {
        console.warn('⚠️ Control buttons not found yet, will update after render');
        return;
    }
    
    if (role === 'user') {
        // Normal kullanıcılar sadece izleyebilir
        btnStop.style.display = 'none';
        btnStart.style.display = 'none';
        btnRestart.style.display = 'none';
        if (consoleInput) consoleInput.disabled = true;
        if (btnSend) btnSend.disabled = true;
    } else if (role === 'moderator') {
        // Moderatörler stop hariç her şeyi yapabilir
        btnStop.style.display = 'none';
    }
}

// Logout
function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        window.location.href = '/login.html';
    }
}

// Fetch with Auth
async function fetchWithAuth(url, options = {}) {
    if (!authToken) {
        window.location.href = '/login.html';
        return;
    }
    
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`
    };
    
    const response = await fetch(url, options);
    
    if (response.status === 401) {
        showToast('Oturum süreniz doldu. Lütfen tekrar giriş yapın.', 'error');
        setTimeout(() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        }, 2000);
        throw new Error('Unauthorized');
    }
    
    return response;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    renderStatsGrid();
    renderControlCard();
    renderInfoCard();
    initChart();
    fetchAll();
    setInterval(fetchStatus, 5000);
    setInterval(fetchPlayers, 10000);
    setInterval(fetchLogs, 8000);
    setInterval(fetchTPS, 10000);
    setInterval(fetchStatsHistory, 5000);
});

// Render Stats Grid
function renderStatsGrid() {
    const grid = document.getElementById('statsGrid');
    grid.innerHTML = `
        <div class="stat-card">
            <div class="stat-header"><span class="stat-icon">💻</span><span class="stat-trend" id="cpuTrend">-</span></div>
            <div class="stat-value" id="cpuStat">0%</div>
            <div class="stat-label">CPU Kullanımı</div>
            <div class="stat-bar"><div class="stat-bar-fill" id="cpuBar" style="width: 0%"></div></div>
        </div>
        <div class="stat-card">
            <div class="stat-header"><span class="stat-icon">🧠</span><span class="stat-trend" id="ramTrend">-</span></div>
            <div class="stat-value" id="ramStat">0 GB</div>
            <div class="stat-label">RAM Kullanımı</div>
            <div class="stat-bar"><div class="stat-bar-fill" id="ramBar" style="width: 0%"></div></div>
        </div>
        <div class="stat-card">
            <div class="stat-header"><span class="stat-icon">👥</span></div>
            <div class="stat-value" id="playersStat">0/20</div>
            <div class="stat-label">Aktif Oyuncular</div>
            <div class="stat-bar"><div class="stat-bar-fill" id="playersBar" style="width: 0%"></div></div>
        </div>
        <div class="stat-card">
            <div class="stat-header"><span class="stat-icon">⏱️</span></div>
            <div class="stat-value" id="uptimeStat">-</div>
            <div class="stat-label">Çalışma Süresi</div>
        </div>
    `;
}


// Render Control Card
function renderControlCard() {
    const body = document.getElementById('controlBody');
    body.innerHTML = `
        <div class="info-grid">
            <div class="info-row"><span class="info-label">⏰ Çalışma Süresi</span><span class="info-value" id="uptime">-</span></div>
            <div class="info-row"><span class="info-label">💾 Bellek</span><span class="info-value" id="memory">-</span></div>
            <div class="info-row"><span class="info-label">⚡ CPU</span><span class="info-value" id="cpu">-</span></div>
            <div class="info-row"><span class="info-label">🔄 Yeniden Başlatma</span><span class="info-value" id="restarts">-</span></div>
        </div>
        <div class="controls">
            <button class="btn btn-start" onclick="startServer()" id="btnStart"><span>▶️ Başlat</span></button>
            <button class="btn btn-restart" onclick="restartServer()" id="btnRestart"><span>🔄 Restart</span></button>
            <button class="btn btn-stop" onclick="stopServer()" id="btnStop"><span>⏹️ Durdur</span></button>
        </div>
    `;
}

// Render Info Card
function renderInfoCard() {
    const body = document.getElementById('infoBody');
    body.innerHTML = `
        <div class="info-grid">
            <div class="info-row"><span class="info-label">📝 MOTD</span><span class="info-value" id="motd">-</span></div>
            <div class="info-row"><span class="info-label">🔌 Port</span><span class="info-value" id="port">-</span></div>
            <div class="info-row"><span class="info-label">⚔️ Zorluk</span><span class="info-value" id="difficulty">-</span></div>
            <div class="info-row"><span class="info-label">🎮 Oyun Modu</span><span class="info-value" id="gamemode">-</span></div>
            <div class="info-row"><span class="info-label">👥 Max Oyuncu</span><span class="info-value" id="playersMax">20</span></div>
        </div>
    `;
}

// Fetch All Data
async function fetchAll() {
    await Promise.all([fetchStatus(), fetchPlayers(), fetchInfo(), fetchLogs()]);
}

// Fetch Status
async function fetchStatus() {
    try {
        const res = await fetch(`${API_URL}/api/status`);
        const data = await res.json();
        serverData = data;
        updateStatusUI(data);
    } catch (e) { console.error('Status error:', e); }
}

// Update Status UI
function updateStatusUI(data) {
    const statusDot = document.getElementById('mainStatusDot');
    const statusText = document.getElementById('mainStatusText');
    const statusIndicator = document.getElementById('mainStatus');
    
    if (data.running) {
        statusDot.classList.add('online');
        statusIndicator.classList.add('online');
        statusIndicator.classList.remove('offline');
        statusText.textContent = 'Çevrimiçi';
        
        const uptimeFormatted = formatUptime(data.uptime);
        const memoryFormatted = formatMemory(data.memory);
        const memoryGB = data.memory / 1024 / 1024 / 1024;
        const memoryPercent = Math.min((memoryGB / 6) * 100, 100);
        const cpuPercent = Math.min(data.cpu, 100);
        
        document.getElementById('uptime').textContent = uptimeFormatted;
        document.getElementById('memory').textContent = memoryFormatted;
        document.getElementById('cpu').textContent = data.cpu + '%';
        document.getElementById('restarts').textContent = data.restarts;
        
        document.getElementById('cpuStat').textContent = data.cpu + '%';
        document.getElementById('ramStat').textContent = memoryFormatted;
        document.getElementById('uptimeStat').textContent = uptimeFormatted;
        document.getElementById('cpuBar').style.width = cpuPercent + '%';
        document.getElementById('ramBar').style.width = memoryPercent + '%';
    } else {
        statusDot.classList.remove('online');
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Çevrimdışı';
        ['cpuStat', 'ramStat', 'uptimeStat', 'uptime', 'memory', 'cpu'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '-';
        });
        document.getElementById('cpuBar').style.width = '0%';
        document.getElementById('ramBar').style.width = '0%';
    }
}


// Fetch Players
async function fetchPlayers() {
    try {
        const res = await fetch(`${API_URL}/api/players`);
        const data = await res.json();
        playersData = data;
        document.getElementById('playersMax').textContent = data.max;
        document.getElementById('playersStat').textContent = `${data.online}/${data.max}`;
        document.getElementById('playersBar').style.width = ((data.online / data.max) * 100) + '%';
        document.getElementById('playerCount').textContent = data.online;
        
        // Oyuncu listesini güncelle
        const playersList = document.getElementById('playersList');
        if (data.players && data.players.length > 0) {
            playersList.innerHTML = data.players.map(player => `
                <div class="player-item">
                    <img src="https://mc-heads.net/avatar/${player}/32" alt="${player}" class="player-avatar">
                    <span class="player-name">${player}</span>
                    <span class="player-status online"></span>
                </div>
            `).join('');
        } else {
            playersList.innerHTML = '<div class="no-players">Şu an kimse online değil</div>';
        }
    } catch (e) { console.error('Players error:', e); }
}

// Fetch Info
async function fetchInfo() {
    try {
        const res = await fetch(`${API_URL}/api/info`);
        const data = await res.json();
        serverInfo = data;
        document.getElementById('motd').textContent = data.motd || '-';
        document.getElementById('port').textContent = data.port || '-';
        document.getElementById('difficulty').textContent = translateDifficulty(data.difficulty);
        document.getElementById('gamemode').textContent = translateGamemode(data.gamemode);
    } catch (e) { console.error('Info error:', e); }
}

// Fetch Logs
async function fetchLogs() {
    try {
        const res = await fetch(`${API_URL}/api/logs`);
        const data = await res.json();
        const logsDiv = document.getElementById('logs');
        const wasAtBottom = logsDiv.scrollHeight - logsDiv.scrollTop <= logsDiv.clientHeight + 50;
        
        logsDiv.innerHTML = data.logs.map(line => {
            let cls = '';
            if (line.includes('INFO')) cls = 'info';
            else if (line.includes('WARN')) cls = 'warn';
            else if (line.includes('ERROR')) cls = 'error';
            else if (line.includes('joined') || line.includes('Done')) cls = 'success';
            return `<div class="log-line ${cls}">${escapeHtml(line)}</div>`;
        }).join('');
        
        if (wasAtBottom) logsDiv.scrollTop = logsDiv.scrollHeight;
    } catch (e) { console.error('Logs error:', e); }
}

function clearLogs() {
    document.getElementById('logs').innerHTML = '<div class="log-line">Loglar temizlendi...</div>';
}

// Server Controls
async function startServer() {
    const btn = document.getElementById('btnStart');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    try {
        const res = await fetchWithAuth(`${API_URL}/api/start`, { method: 'POST' });
        const data = await res.json();
        showToast(data.message || 'Sunucu başlatılıyor...', 'success');
        setTimeout(fetchStatus, 2000);
    } catch (e) { 
        if (e.message !== 'Unauthorized') {
            showToast('Hata: ' + e.message, 'error'); 
        }
    }
    finally { btn.disabled = false; btn.innerHTML = '<span>▶️ Başlat</span>'; }
}

async function stopServer() {
    if (!confirm('Sunucuyu durdurmak istediğinizden emin misiniz?')) return;
    const btn = document.getElementById('btnStop');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    try {
        const res = await fetchWithAuth(`${API_URL}/api/stop`, { method: 'POST' });
        const data = await res.json();
        showToast(data.message || 'Sunucu durduruluyor...', 'warning');
        setTimeout(fetchStatus, 2000);
    } catch (e) { 
        if (e.message !== 'Unauthorized') {
            showToast('Hata: ' + e.message, 'error'); 
        }
    }
    finally { btn.disabled = false; btn.innerHTML = '<span>⏹️ Durdur</span>'; }
}

async function restartServer() {
    if (!confirm('Sunucuyu yeniden başlatmak istediğinizden emin misiniz?')) return;
    const btn = document.getElementById('btnRestart');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    try {
        const res = await fetchWithAuth(`${API_URL}/api/restart`, { method: 'POST' });
        const data = await res.json();
        showToast(data.message || 'Sunucu yeniden başlatılıyor...', 'warning');
        setTimeout(fetchStatus, 3000);
    } catch (e) { 
        if (e.message !== 'Unauthorized') {
            showToast('Hata: ' + e.message, 'error'); 
        }
    }
    finally { btn.disabled = false; btn.innerHTML = '<span>🔄 Restart</span>'; }
}


// Utilities
function formatUptime(ms) {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}g ${hours % 24}s`;
    if (hours > 0) return `${hours}s ${minutes % 60}d`;
    if (minutes > 0) return `${minutes}d ${seconds % 60}s`;
    return `${seconds}s`;
}

function formatMemory(bytes) {
    if (!bytes) return '-';
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function translateDifficulty(d) {
    const map = { peaceful: 'Barışçıl', easy: 'Kolay', normal: 'Normal', hard: 'Zor' };
    return map[d?.toLowerCase()] || d || '-';
}

function translateGamemode(g) {
    const map = { survival: 'Hayatta Kalma', creative: 'Yaratıcı', adventure: 'Macera', spectator: 'İzleyici' };
    return map[g?.toLowerCase()] || g || '-';
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Copy Address
function copyAddress() {
    const address = document.getElementById('serverAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        showToast('Sunucu adresi kopyalandı!', 'success');
    }).catch(() => {
        showToast('Kopyalama başarısız', 'error');
    });
}

// Console Command
async function sendCommand() {
    const input = document.getElementById('consoleInput');
    const output = document.getElementById('consoleOutput');
    const command = input.value.trim();
    
    if (!command) return;
    
    // Komutu output'a ekle
    output.innerHTML += `<div class="console-line cmd">> ${command}</div>`;
    input.value = '';
    
    try {
        const res = await fetchWithAuth(`${API_URL}/api/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
        });
        const data = await res.json();
        
        if (data.success) {
            output.innerHTML += `<div class="console-line success">${data.response || 'OK'}</div>`;
        } else {
            output.innerHTML += `<div class="console-line error">${data.error}</div>`;
        }
    } catch (e) {
        if (e.message !== 'Unauthorized') {
            output.innerHTML += `<div class="console-line error">Hata: ${e.message}</div>`;
        }
    }
    
    output.scrollTop = output.scrollHeight;
}

// TPS
async function fetchTPS() {
    try {
        const res = await fetch(`${API_URL}/api/tps`);
        const data = await res.json();
        const tps = data.tps1m || 0;
        const badge = document.getElementById('tpsBadge');
        badge.textContent = `TPS: ${tps.toFixed(1)}`;
        badge.className = 'tps-badge ' + (tps >= 19 ? 'good' : tps >= 15 ? 'warn' : 'bad');
    } catch (e) {}
}

// Chart
function initChart() {
    const ctx = document.getElementById('statsChart').getContext('2d');
    statsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'CPU %',
                    data: [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'RAM (MB)',
                    data: [],
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: { legend: { labels: { color: '#9ca3af' } } },
            scales: {
                x: { display: false },
                y: { 
                    position: 'left',
                    min: 0, max: 100,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                y1: {
                    position: 'right',
                    min: 0,
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

async function fetchStatsHistory() {
    try {
        const res = await fetch(`${API_URL}/api/stats/history`);
        const data = await res.json();
        
        if (data.length > 0 && statsChart) {
            statsChart.data.labels = data.map((_, i) => i);
            statsChart.data.datasets[0].data = data.map(d => d.cpu);
            statsChart.data.datasets[1].data = data.map(d => d.memory);
            statsChart.update('none');
        }
    } catch (e) {}
}