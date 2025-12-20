const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
        res.json({
          running: minecraft.pm2_env.status === 'online',
          uptime: minecraft.pm2_env.pm_uptime,
          memory: minecraft.monit.memory,
          cpu: minecraft.monit.cpu,
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

// Oyuncu listesi (server.properties'den max players)
app.get('/api/players', (req, res) => {
  const propsPath = path.join(__dirname, 'server.properties');
  
  if (fs.existsSync(propsPath)) {
    const props = fs.readFileSync(propsPath, 'utf8');
    const maxPlayers = props.match(/max-players=(\d+)/)?.[1] || '20';
    
    // Gerçek oyuncu sayısı için logs'u parse edebiliriz
    res.json({
      online: 0, // TODO: Parse from logs
      max: parseInt(maxPlayers)
    });
  } else {
    res.json({ online: 0, max: 20 });
  }
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

// Sunucu bilgileri
app.get('/api/info', (req, res) => {
  const propsPath = path.join(__dirname, 'server.properties');
  
  if (fs.existsSync(propsPath)) {
    const props = fs.readFileSync(propsPath, 'utf8');
    const info = {
      motd: props.match(/motd=(.+)/)?.[1] || 'Minecraft Server',
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
