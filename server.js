const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

// Oyuncu listesi (loglardan parse et)
app.get('/api/players', (req, res) => {
  const propsPath = path.join(__dirname, 'server.properties');
  const logPath = path.join(__dirname, 'logs', 'latest.log');
  
  let maxPlayers = 20;
  if (fs.existsSync(propsPath)) {
    const props = fs.readFileSync(propsPath, 'utf8');
    maxPlayers = parseInt(props.match(/max-players=(\d+)/)?.[1] || '20');
  }
  
  // Loglardan online oyuncuları bul
  let onlinePlayers = [];
  if (fs.existsSync(logPath)) {
    const logs = fs.readFileSync(logPath, 'utf8');
    const lines = logs.split('\n');
    
    // Son 500 satırı kontrol et
    const recentLines = lines.slice(-500);
    const joinedPlayers = new Set();
    const leftPlayers = new Set();
    
    for (const line of recentLines) {
      // Oyuncu giriş: "PlayerName joined the game" veya "PlayerName[/IP:port] logged in"
      const joinMatch = line.match(/(\w+)\[\/[\d.:]+\] logged in/);
      const joinMatch2 = line.match(/(\w+) joined the game/);
      
      // Oyuncu çıkış: "PlayerName left the game"
      const leftMatch = line.match(/(\w+) left the game/);
      const lostMatch = line.match(/(\w+) lost connection/);
      
      if (joinMatch) joinedPlayers.add(joinMatch[1]);
      if (joinMatch2) joinedPlayers.add(joinMatch2[1]);
      if (leftMatch) leftPlayers.add(leftMatch[1]);
      if (lostMatch) leftPlayers.add(lostMatch[1]);
    }
    
    // Giren ama çıkmamış oyuncular
    onlinePlayers = [...joinedPlayers].filter(p => !leftPlayers.has(p));
  }
  
  res.json({
    online: onlinePlayers.length,
    max: maxPlayers,
    players: onlinePlayers
  });
});

// Sunucu başlat (duplicate kontrolü ile)
app.post('/api/start', (req, res) => {
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

// Sunucu durdur
app.post('/api/stop', (req, res) => {
  exec('pm2 stop minecraft', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true, message: 'Server stopped' });
  });
});

// Sunucu restart (lock temizleme ile)
app.post('/api/restart', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`🚀 Minecraft Server Manager API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});
