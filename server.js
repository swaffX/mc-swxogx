// Environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

const rcon = new RconClient(
  process.env.RCON_HOST || '127.0.0.1', 
  parseInt(process.env.RCON_PORT) || 25575, 
  process.env.RCON_PASSWORD || 'SwxOgx2024Rcon!'
);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://www.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com"]
    }
  }
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına 100 istek
  message: { error: 'Çok fazla istek gönderdiniz, lütfen bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Auth için daha sıkı limit
  message: { error: 'Çok fazla giriş denemesi, lütfen bekleyin.' }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting uygula
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

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

// Sunucu restart - /api/server/restart'a yönlendir (legacy endpoint)
app.post('/api/restart', verifyToken, requireRole('admin', 'moderator'), (req, res) => {
  // Legacy endpoint - yeni endpoint'e yönlendir
  req.url = '/api/server/restart';
  app.handle(req, res);
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
  console.log('🔄 Restart request received...');
  
  // Önce stop et
  exec('pm2 stop minecraft', (stopErr) => {
    if (stopErr) {
      console.error('Stop error:', stopErr);
    }
    
    console.log('⏸️ Minecraft stopped, cleaning locks...');
    
    // Lock dosyalarını temizle
    const lockFiles = [
      path.join(__dirname, 'world', 'session.lock'),
      path.join(__dirname, 'world_nether', 'session.lock'),
      path.join(__dirname, 'world_the_end', 'session.lock')
    ];
    
    lockFiles.forEach(f => {
      try {
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
          console.log(`🧹 Cleaned: ${f}`);
        }
      } catch(e) {
        console.warn(`⚠️ Could not clean ${f}:`, e.message);
      }
    });
    
    // 3 saniye bekle (Java process'in tamamen kapanması için)
    console.log('⏳ Waiting 3 seconds for Java process to exit...');
    setTimeout(() => {
      // Java process'lerini kontrol et ve gerekirse kill et
      exec('pgrep -f "java.*server.jar"', (pgrepErr, stdout) => {
        if (stdout && stdout.trim()) {
          console.log('⚠️ Java process still running, killing...');
          exec('pkill -9 -f "java.*server.jar"', (killErr) => {
            if (killErr) {
              console.warn('Kill error:', killErr);
            }
            // 1 saniye daha bekle
            setTimeout(startMinecraft, 1000);
          });
        } else {
          startMinecraft();
        }
      });
      
      function startMinecraft() {
        console.log('▶️ Starting Minecraft...');
        exec('pm2 start minecraft', (startErr, stdout, stderr) => {
          if (startErr) {
            console.error('Start error:', startErr);
            return res.status(500).json({ 
              success: false, 
              message: 'Restart failed: ' + startErr.message 
            });
          }
          console.log('✅ Minecraft restarted successfully');
          res.json({ 
            success: true, 
            message: 'Server is restarting... (this may take 30-60 seconds)' 
          });
        });
      }
    }, 3000);
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
    
    // Send commands to Minecraft server via RCON
    try {
      // Role colors for Minecraft chat
      const roleColors = {
        admin: 'red',
        moderator: 'gold',
        vip: 'light_purple',
        player: 'green'
      };
      
      const color = roleColors[roleId] || 'aqua';
      
      // OP levels for each role
      // 4 = Full admin (all commands)
      // 3 = Moderator (most commands except server management)
      // 2 = VIP (limited commands)
      // 0 = Player (no OP)
      const opLevels = {
        admin: 4,
        moderator: 3,
        vip: 2,
        player: 0
      };
      
      const opLevel = opLevels[roleId] || 0;
      
      // Remove OP first (if player role)
      if (roleId === 'player') {
        await rcon.send(`deop ${playerName}`).catch(() => {});
      } else {
        // Give OP with appropriate level
        await rcon.send(`op ${playerName}`).catch(() => {});
      }
      
      // Tellraw command with colored text
      const tellrawCommand = `tellraw @a {"text":"[PANEL] ${playerName} oyuncusuna ${roleName} rolü verildi!","color":"${color}","bold":true}`;
      
      await rcon.send(tellrawCommand);
      
      console.log(`✅ Role assigned: ${playerName} -> ${roleName} (OP level: ${opLevel}, notified in-game)`);
      
      res.json({ 
        success: true, 
        message: 'Role assigned and Minecraft notified',
        playerName,
        roleName,
        opLevel
      });
    } catch (rconError) {
      console.warn('⚠️ Role saved but RCON notification failed:', rconError.message);
      res.json({ 
        success: true, 
        message: 'Role saved but server notification failed',
        warning: 'Server might be offline'
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

// ============================================
// BACKUP ENDPOINTS
// ============================================

// Backup listesi
app.get('/api/backups', verifyToken, requireRole('admin'), (req, res) => {
  const backupDir = process.env.BACKUP_DIR || path.join(os.homedir(), 'minecraft-backups');
  
  try {
    if (!fs.existsSync(backupDir)) {
      return res.json({ success: true, backups: [] });
    }
    
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('minecraft-backup-') && f.endsWith('.tar.gz'))
      .map(f => {
        const stats = fs.statSync(path.join(backupDir, f));
        return {
          name: f,
          size: stats.size,
          sizeFormatted: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
          created: stats.mtime,
          createdFormatted: stats.mtime.toLocaleString('tr-TR')
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.json({ success: true, backups: files, backupDir });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manuel backup oluştur
app.post('/api/backups/create', verifyToken, requireRole('admin'), (req, res) => {
  const scriptPath = path.join(__dirname, 'scripts', 'backup.sh');
  
  if (!fs.existsSync(scriptPath)) {
    return res.status(404).json({ success: false, error: 'Backup script bulunamadı' });
  }
  
  console.log('📦 Manual backup started...');
  
  exec(`bash "${scriptPath}"`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('Backup error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    
    console.log('✅ Backup completed');
    res.json({ 
      success: true, 
      message: 'Backup oluşturuldu',
      output: stdout
    });
  });
});

// Backup sil
app.delete('/api/backups/:filename', verifyToken, requireRole('admin'), (req, res) => {
  const backupDir = process.env.BACKUP_DIR || path.join(os.homedir(), 'minecraft-backups');
  const filename = req.params.filename;
  
  // Güvenlik kontrolü
  if (!filename.startsWith('minecraft-backup-') || !filename.endsWith('.tar.gz')) {
    return res.status(400).json({ success: false, error: 'Geçersiz dosya adı' });
  }
  
  const filePath = path.join(backupDir, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Backup silindi' });
    } else {
      res.status(404).json({ success: false, error: 'Dosya bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// MONITORING ENDPOINTS
// ============================================

// Detaylı sistem bilgisi
app.get('/api/monitoring/system', verifyToken, (req, res) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  // CPU kullanımı hesapla
  let cpuUsage = 0;
  cpus.forEach(cpu => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    cpuUsage += ((total - idle) / total) * 100;
  });
  cpuUsage = cpuUsage / cpus.length;
  
  res.json({
    cpu: {
      cores: cpus.length,
      model: cpus[0].model,
      speed: cpus[0].speed,
      usage: Math.round(cpuUsage * 10) / 10
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      usagePercent: Math.round((usedMem / totalMem) * 100)
    },
    os: {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      hostname: os.hostname(),
      uptime: os.uptime()
    },
    timestamp: Date.now()
  });
});

// TPS geçmişi
let tpsHistory = [];
const MAX_TPS_HISTORY = 120; // 1 saat (30 saniyede bir)

async function recordTps() {
  try {
    const response = await rcon.send('tps');
    const match = response.match(/(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)/);
    if (match) {
      tpsHistory.push({
        time: Date.now(),
        tps1m: parseFloat(match[1]),
        tps5m: parseFloat(match[2]),
        tps15m: parseFloat(match[3])
      });
      if (tpsHistory.length > MAX_TPS_HISTORY) tpsHistory.shift();
    }
  } catch (e) {
    // RCON bağlantısı yok
  }
}
setInterval(recordTps, 30000);

app.get('/api/monitoring/tps-history', verifyToken, (req, res) => {
  res.json(tpsHistory);
});

// Oyuncu istatistikleri
app.get('/api/monitoring/player-stats', verifyToken, async (req, res) => {
  try {
    const statsDir = path.join(__dirname, 'world', 'stats');
    
    if (!fs.existsSync(statsDir)) {
      return res.json({ success: true, stats: [] });
    }
    
    const files = fs.readdirSync(statsDir).filter(f => f.endsWith('.json'));
    const stats = [];
    
    for (const file of files.slice(0, 20)) { // Max 20 oyuncu
      try {
        const data = JSON.parse(fs.readFileSync(path.join(statsDir, file), 'utf8'));
        const uuid = file.replace('.json', '');
        
        stats.push({
          uuid,
          playTime: data.stats?.['minecraft:custom']?.['minecraft:play_time'] || 0,
          deaths: data.stats?.['minecraft:custom']?.['minecraft:deaths'] || 0,
          mobKills: data.stats?.['minecraft:custom']?.['minecraft:mob_kills'] || 0,
          jumps: data.stats?.['minecraft:custom']?.['minecraft:jump'] || 0
        });
      } catch (e) {}
    }
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime(),
    version: require('./package.json').version
  });
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
