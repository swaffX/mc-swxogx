const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');
const { verifyToken, requireRole, setUserRole, getUserRole } = require('./public/middleware/auth');

// RCON Client
class RconClient {
  constructor(host, port, password) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.requestId = 0;
  }

  async send(command) {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      socket.setTimeout(5000);
      
      socket.connect(this.port, this.host, () => {
        // Auth packet
        const authPacket = this.createPacket(this.requestId++, 3, this.password);
        socket.write(authPacket);
      });

      let authenticated = false;
      let responseData = '';

      socket.on('data', (data) => {
        if (!authenticated) {
          authenticated = true;
          // Command packet
          const cmdPacket = this.createPacket(this.requestId++, 2, command);
          socket.write(cmdPacket);
        } else {
          // Parse response
          const length = data.readInt32LE(0);
          const id = data.readInt32LE(4);
          const type = data.readInt32LE(8);
          responseData = data.slice(12, 12 + length - 10).toString('utf8');
          socket.destroy();
          resolve(responseData);
        }
      });

      socket.on('timeout', () => { socket.destroy(); reject(new Error('Timeout')); });
      socket.on('error', (err) => { reject(err); });
    });
  }

  createPacket(id, type, body) {
    const bodyBuffer = Buffer.from(body, 'utf8');
    const length = 10 + bodyBuffer.length;
    const buffer = Buffer.alloc(4 + length);
    buffer.writeInt32LE(length, 0);
    buffer.writeInt32LE(id, 4);
    buffer.writeInt32LE(type, 8);
    bodyBuffer.copy(buffer, 12);
    buffer.writeInt16LE(0, 12 + bodyBuffer.length);
    return buffer;
  }
}

const rcon = new RconClient('127.0.0.1', 25575, 'SwxOgx2024Rcon!');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================================
// AUTH ENDPOINTS
// ============================================

// Kullanıcı kaydı
app.post('/api/auth/register', verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // İlk kullanıcı admin olsun
    const isFirstUser = [...require('./middleware/auth').userRoles.keys()].length === 0;
    const role = isFirstUser ? 'admin' : 'user';
    
    setUserRole(email, role);
    
    res.json({
      success: true,
      role,
      message: isFirstUser ? 'İlk kullanıcı olarak admin yetkisi verildi!' : 'Kayıt başarılı!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcı rolü sorgula
app.get('/api/auth/role', verifyToken, (req, res) => {
  res.json({ role: req.user.role, email: req.user.email, name: req.user.name });
});

// Kullanıcı rolü güncelle (sadece admin)
app.post('/api/auth/set-role', verifyToken, requireRole('admin'), (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({ error: 'Email ve rol gerekli' });
    }
    
    setUserRole(email, role);
    res.json({ success: true, message: `${email} kullanıcısının rolü ${role} olarak güncellendi` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm kullanıcıları listele (sadece admin)
app.get('/api/auth/users', verifyToken, requireRole('admin'), (req, res) => {
  const users = Array.from(require('./middleware/auth').userRoles.entries()).map(([email, role]) => ({
    email,
    role
  }));
  res.json({ users });
});

// ============================================
// PROTECTED ENDPOINTS (Authentication Required)
// ============================================

// Minecraft sunucu durumu
app.get('/api/status', (req, res) => {
  exec('pm2 jlist', (error, stdout) => {
    if (error) {
      return res.json({ running: false, error: error.message });
    }
    
    try {
      const processes = JSON.parse(stdout);
      const minecraft = processes.find(p => p.name === 'minecraft');
      
      if (minecraft) {
        // CPU'yu core sayısına böl (multi-core sistemlerde %100'ü geçmesin)
        const cpuCores = require('os').cpus().length;
        const normalizedCpu = Math.round((minecraft.monit.cpu / cpuCores) * 10) / 10;
        
        res.json({
          running: minecraft.pm2_env.status === 'online',
          uptime: Date.now() - minecraft.pm2_env.pm_uptime,
          memory: minecraft.monit.memory,
          cpu: Math.min(normalizedCpu, 100),
          restarts: minecraft.pm2_env.restart_time
        });
      } else {
        res.json({ running: false });
      }
    } catch (e) {
      res.json({ running: false, error: 'Parse error' });
    }
  });
});

// Oyuncu listesi (RCON ile gerçek zamanlı)
app.get('/api/players', async (req, res) => {
  const propsPath = path.join(__dirname, 'server.properties');
  
  let maxPlayers = 20;
  if (fs.existsSync(propsPath)) {
    const props = fs.readFileSync(propsPath, 'utf8');
    maxPlayers = parseInt(props.match(/max-players=(\d+)/)?.[1] || '20');
  }
  
  try {
    // RCON ile online oyuncuları al
    const response = await rcon.send('list');
    // Response: "There are X of a max of Y players online: player1, player2"
    const match = response.match(/There are (\d+) of a max of \d+ players online:?\s*(.*)?/i);
    
    if (match) {
      const online = parseInt(match[1]);
      const playerNames = match[2] ? match[2].split(',').map(p => p.trim()).filter(p => p) : [];
      
      res.json({
        online,
        max: maxPlayers,
        players: playerNames
      });
    } else {
      res.json({ online: 0, max: maxPlayers, players: [] });
    }
  } catch (e) {
    // RCON bağlantısı yoksa log'dan parse et
    const logPath = path.join(__dirname, 'logs', 'latest.log');
    let onlinePlayers = [];
    
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, 'utf8');
      const lines = logs.split('\n').slice(-500);
      const joinedPlayers = new Set();
      const leftPlayers = new Set();
      
      for (const line of lines) {
        const joinMatch = line.match(/(\w+)\[\/[\d.:]+\] logged in/);
        const joinMatch2 = line.match(/(\w+) joined the game/);
        const leftMatch = line.match(/(\w+) left the game/);
        const lostMatch = line.match(/(\w+) lost connection/);
        
        if (joinMatch) joinedPlayers.add(joinMatch[1]);
        if (joinMatch2) joinedPlayers.add(joinMatch2[1]);
        if (leftMatch) leftPlayers.add(leftMatch[1]);
        if (lostMatch) leftPlayers.add(lostMatch[1]);
      }
      
      onlinePlayers = [...joinedPlayers].filter(p => !leftPlayers.has(p));
    }
    
    res.json({ online: onlinePlayers.length, max: maxPlayers, players: onlinePlayers });
  }
});

// Sunucu başlat (duplicate kontrolü ile) - Moderator+ yetkisi gerekli
app.post('/api/start', verifyToken, requireRole('admin', 'moderator'), (req, res) => {
  // Önce sunucu durumunu kontrol et
  exec('pm2 jlist', (error, stdout) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    
    try {
      const processes = JSON.parse(stdout);
      const minecraft = processes.find(p => p.name === 'minecraft');
      
      // Zaten çalışıyorsa başlatma
      if (minecraft && minecraft.pm2_env.status === 'online') {
        return res.json({ success: false, message: 'Sunucu zaten çalışıyor!' });
      }
      
      // Çalışmıyorsa başlat
      exec('pm2 start minecraft', (err, out, stderr) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: 'Sunucu başlatılıyor...' });
      });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Parse error' });
    }
  });
});

// Sunucu durdur - Admin yetkisi gerekli
app.post('/api/stop', verifyToken, requireRole('admin'), (req, res) => {
  exec('pm2 stop minecraft', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true, message: 'Server stopped' });
  });
});

// Sunucu restart (lock temizleme ile) - Moderator+ yetkisi gerekli
app.post('/api/restart', verifyToken, requireRole('admin', 'moderator'), (req, res) => {
  // Önce durdur, lock temizle, sonra başlat
  exec('pm2 stop minecraft', (err1) => {
    // Lock dosyalarını temizle
    const lockFiles = [
      '/opt/minecraft/world/session.lock',
      '/opt/minecraft/world_nether/session.lock',
      '/opt/minecraft/world_the_end/session.lock'
    ];
    lockFiles.forEach(f => {
      try { fs.unlinkSync(f); } catch(e) {}
    });
    
    // 2 saniye bekle ve başlat
    setTimeout(() => {
      exec('pm2 start minecraft', (err2, out, stderr) => {
        if (err2) {
          return res.status(500).json({ success: false, error: err2.message });
        }
        res.json({ success: true, message: 'Sunucu yeniden başlatılıyor...' });
      });
    }, 2000);
  });
});

// Sunucu logları
app.get('/api/logs', (req, res) => {
  const logPath = path.join(__dirname, 'logs', 'latest.log');
  
  if (fs.existsSync(logPath)) {
    const logs = fs.readFileSync(logPath, 'utf8');
    const lines = logs.split('\n').slice(-100); // Son 100 satır
    res.json({ logs: lines });
  } else {
    res.json({ logs: [] });
  }
});

// MOTD renk kodlarını temizle
function cleanMotd(motd) {
  if (!motd) return 'Minecraft Server';
  // Minecraft renk kodlarını temizle (§x formatı)
  return motd
    .replace(/\\u00a7[0-9a-fklmnor]/gi, '')
    .replace(/§[0-9a-fklmnor]/gi, '')
    .replace(/\\n/g, ' | ')
    .trim();
}

// Sunucu bilgileri
app.get('/api/info', (req, res) => {
  const propsPath = path.join(__dirname, 'server.properties');
  
  if (fs.existsSync(propsPath)) {
    const props = fs.readFileSync(propsPath, 'utf8');
    const rawMotd = props.match(/motd=(.+)/)?.[1] || 'Minecraft Server';
    const info = {
      motd: cleanMotd(rawMotd),
      port: props.match(/server-port=(\d+)/)?.[1] || '25565',
      maxPlayers: props.match(/max-players=(\d+)/)?.[1] || '20',
      difficulty: props.match(/difficulty=(\w+)/)?.[1] || 'normal',
      gamemode: props.match(/gamemode=(\w+)/)?.[1] || 'survival'
    };
    res.json(info);
  } else {
    res.status(404).json({ error: 'server.properties not found' });
  }
});

// Konsol komutu gönder (RCON) - Moderator+ yetkisi gerekli
app.post('/api/command', verifyToken, requireRole('admin', 'moderator'), async (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ success: false, error: 'Komut gerekli' });
  }
  
  // Tehlikeli komutları engelle
  const dangerous = ['stop', 'restart', 'op ', 'deop ', 'ban ', 'pardon '];
  if (dangerous.some(d => command.toLowerCase().startsWith(d))) {
    return res.status(403).json({ success: false, error: 'Bu komut web panelden çalıştırılamaz' });
  }
  
  try {
    const response = await rcon.send(command);
    res.json({ success: true, response: response || 'Komut çalıştırıldı' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'RCON bağlantısı kurulamadı: ' + e.message });
  }
});

// TPS bilgisi (RCON)
app.get('/api/tps', async (req, res) => {
  try {
    const response = await rcon.send('tps');
    // Paper TPS response: "TPS from last 1m, 5m, 15m: 20.0, 20.0, 20.0"
    const match = response.match(/(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)/);
    if (match) {
      res.json({
        tps1m: parseFloat(match[1]),
        tps5m: parseFloat(match[2]),
        tps15m: parseFloat(match[3])
      });
    } else {
      res.json({ tps1m: 20, tps5m: 20, tps15m: 20 });
    }
  } catch (e) {
    res.json({ tps1m: 0, tps5m: 0, tps15m: 0, error: 'RCON bağlantısı yok' });
  }
});

// System info endpoint for dashboard
app.get('/api/system-info', verifyToken, async (req, res) => {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Get server uptime
    let serverUptime = 'N/A';
    exec('pm2 jlist', (error, stdout) => {
      if (!error) {
        try {
          const processes = JSON.parse(stdout);
          const minecraft = processes.find(p => p.name === 'minecraft');
          if (minecraft && minecraft.pm2_env.status === 'online') {
            const uptimeMs = Date.now() - minecraft.pm2_env.pm_uptime;
            const hours = Math.floor(uptimeMs / 3600000);
            const minutes = Math.floor((uptimeMs % 3600000) / 60000);
            serverUptime = `${hours}h ${minutes}m`;
          }
        } catch (e) {}
      }
    });
    
    res.json({
      cpu: `${cpus.length} cores @ ${cpus[0].speed} MHz`,
      memory: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: serverUptime,
      platform: `${os.type()} ${os.release()}`,
      hostname: os.hostname()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server control endpoints for dashboard
app.post('/api/server/start', verifyToken, requireRole('admin', 'moderator'), (req, res) => {
  exec('pm2 jlist', (error, stdout) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    
    try {
      const processes = JSON.parse(stdout);
      const minecraft = processes.find(p => p.name === 'minecraft');
      
      if (minecraft && minecraft.pm2_env.status === 'online') {
        return res.json({ success: false, message: 'Server is already running!' });
      }
      
      exec('pm2 start minecraft', (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: 'Server is starting...' });
      });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Parse error' });
    }
  });
});

app.post('/api/server/stop', verifyToken, requireRole('admin'), (req, res) => {
  exec('pm2 stop minecraft', (error) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, message: 'Server stopped successfully' });
  });
});

app.post('/api/server/restart', verifyToken, requireRole('admin', 'moderator'), (req, res) => {
  exec('pm2 stop minecraft', () => {
    const lockFiles = [
      '/opt/minecraft/world/session.lock',
      '/opt/minecraft/world_nether/session.lock',
      '/opt/minecraft/world_the_end/session.lock'
    ];
    lockFiles.forEach(f => {
      try { fs.unlinkSync(f); } catch(e) {}
    });
    
    setTimeout(() => {
      exec('pm2 start minecraft', (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: 'Server is restarting...' });
      });
    }, 2000);
  });
});

// Role assignment endpoint - Real-time Minecraft integration
app.post('/api/roles/assign', verifyToken, requireRole('admin', 'moderator'), async (req, res) => {
  const { playerName, roleId, roleName } = req.body;
  
  if (!playerName || !roleId || !roleName) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  try {
    // Save role assignment to JSON file
    const rolesPath = path.join(__dirname, 'data', 'player-roles.json');
    const dataDir = path.dirname(rolesPath);
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let playerRoles = {};
    if (fs.existsSync(rolesPath)) {
      playerRoles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
    }
    
    playerRoles[playerName] = { roleId, roleName, assignedAt: new Date().toISOString() };
    fs.writeFileSync(rolesPath, JSON.stringify(playerRoles, null, 2));
    
    // Send colored message to Minecraft server via RCON
    try {
      // Role colors for Minecraft chat
      const roleColors = {
        admin: 'red',
        moderator: 'gold',
        vip: 'light_purple',
        player: 'green'
      };
      
      const color = roleColors[roleId] || 'aqua';
      
      // LuckPerms permissions for each role
      const rolePermissions = {
        admin: [
          'luckperms.user.permission.set',
          'minecraft.command.gamemode',
          'minecraft.command.give',
          'minecraft.command.tp',
          'minecraft.command.kick',
          'minecraft.command.ban',
          'essentials.fly',
          'essentials.god',
          'essentials.heal',
          'essentials.feed'
        ],
        moderator: [
          'minecraft.command.kick',
          'minecraft.command.tp',
          'essentials.fly',
          'essentials.heal'
        ],
        vip: [
          'essentials.fly',
          'essentials.heal',
          'essentials.feed',
          'essentials.home.3'
        ],
        player: [
          'minecraft.command.help',
          'essentials.home.1'
        ]
      };
      
      const permissions = rolePermissions[roleId] || rolePermissions.player;
      
      // Clear old permissions (remove from all groups)
      await rcon.send(`lp user ${playerName} clear`).catch(() => {});
      
      // Add new permissions
      for (const perm of permissions) {
        await rcon.send(`lp user ${playerName} permission set ${perm} true`).catch(() => {});
      }
      
      // Set primary group
      await rcon.send(`lp user ${playerName} parent set ${roleId}`).catch(() => {});
      
      // Tellraw command with colored text
      const tellrawCommand = `tellraw @a {"text":"[PANEL] ${playerName} oyuncusuna ${roleName} rolü verildi!","color":"${color}","bold":true}`;
      
      await rcon.send(tellrawCommand);
      
      console.log(`✅ Role assigned: ${playerName} -> ${roleName} (notified in-game)`);
      
      res.json({ 
        success: true, 
        message: 'Role assigned and Minecraft notified',
        playerName,
        roleName,
        permissions: permissions.length
      });
    } catch (rconError) {
      console.warn('⚠️ Role saved but RCON notification failed:', rconError.message);
      res.json({ 
        success: true, 
        message: 'Role saved but server notification failed',
        warning: 'Server might be offline or LuckPerms not installed'
      });
    }
  } catch (error) {
    console.error('Role assignment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get player roles
app.get('/api/roles/players', verifyToken, (req, res) => {
  try {
    const rolesPath = path.join(__dirname, 'data', 'player-roles.json');
    
    if (fs.existsSync(rolesPath)) {
      const playerRoles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
      res.json({ success: true, roles: playerRoles });
    } else {
      res.json({ success: true, roles: {} });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// İstatistik geçmişi (grafik için)
let statsHistory = [];
const MAX_HISTORY = 60; // Son 60 veri noktası (5 dakika)

function recordStats() {
  exec('pm2 jlist', (error, stdout) => {
    if (error) return;
    try {
      const processes = JSON.parse(stdout);
      const minecraft = processes.find(p => p.name === 'minecraft');
      if (minecraft && minecraft.pm2_env.status === 'online') {
        const cpuCores = os.cpus().length;
        statsHistory.push({
          time: Date.now(),
          cpu: Math.round((minecraft.monit.cpu / cpuCores) * 10) / 10,
          memory: Math.round(minecraft.monit.memory / 1024 / 1024) // MB
        });
        if (statsHistory.length > MAX_HISTORY) statsHistory.shift();
      }
    } catch (e) {}
  });
}
setInterval(recordStats, 5000);

app.get('/api/stats/history', (req, res) => {
  res.json(statsHistory);
});

// Port kullanımda mı kontrol et
const server = app.listen(PORT, () => {
  console.log(`🚀 Minecraft Server Manager API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} kullanımda! 5 saniye sonra tekrar denenecek...`);
    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 5000);
  } else {
    console.error('Server error:', err);
  }
});
