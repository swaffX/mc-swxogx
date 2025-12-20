# 🎮 Minecraft Server + Node.js Web Panel

Modern Minecraft sunucu yönetim sistemi - PM2 ile yönetilen Minecraft sunucusu + Express.js API + Web Panel

## 🌟 Özellikler

- ✅ **PM2 ile Minecraft Yönetimi** - Otomatik restart, log yönetimi
- ✅ **Express.js API** - RESTful API ile sunucu kontrolü
- ✅ **Web Panel** - Gerçek zamanlı sunucu durumu, oyuncu listesi
- ✅ **GitHub Actions** - Otomatik deployment
- ✅ **Responsive Design** - Mobil uyumlu arayüz

## 📋 Gereksinimler

- Ubuntu 20.04+ VPS
- 8GB RAM
- Node.js 20+
- PM2
- Java 21

## 🚀 Kurulum

### 1. VPS'te İlk Kurulum

```bash
# Repo'yu klonla
cd /opt
git clone https://github.com/KULLANICI_ADIN/minecraft-server.git minecraft
cd minecraft

# Kurulum scriptini çalıştır
chmod +x vps-setup.sh
./vps-setup.sh
```

### 2. GitHub Secrets Ayarla

GitHub repo → Settings → Secrets → Actions:

```
VPS_SSH_KEY: [SSH private key]
VPS_HOST: 194.105.5.37
VPS_USER: root
```

### 3. Push ve Deploy

```bash
git add .
git commit -m "feat: Node.js + PM2 setup"
git push origin main
```

GitHub Actions otomatik olarak deploy edecek!

## 🎛️ Kullanım

### Web Panel

```
http://VPS_IP:3000
```

**Özellikler:**
- 📊 Sunucu durumu (uptime, RAM, CPU)
- 👥 Oyuncu sayısı
- 🎛️ Başlat/Durdur/Restart butonları
- 📜 Canlı log görüntüleme

### API Endpoints

```bash
# Sunucu durumu
GET /api/status

# Oyuncu listesi
GET /api/players

# Sunucu bilgileri
GET /api/info

# Loglar
GET /api/logs

# Sunucu başlat
POST /api/start

# Sunucu durdur
POST /api/stop

# Sunucu restart
POST /api/restart
```

### PM2 Komutları

```bash
# Durum kontrolü
pm2 status

# Logları görüntüle
pm2 logs minecraft
pm2 logs minecraft-api

# Restart
pm2 restart minecraft
pm2 restart minecraft-api
pm2 restart all

# Durdur
pm2 stop minecraft
pm2 stop minecraft-api

# Başlat
pm2 start ecosystem.config.js

# Kaydet (reboot sonrası otomatik başlat)
pm2 save
```

## 📁 Proje Yapısı

```
minecraft-server/
├── server.js              # Express.js API
├── ecosystem.config.js    # PM2 konfigürasyonu
├── package.json           # Node.js dependencies
├── public/
│   └── index.html        # Web panel arayüzü
├── plugins/
│   └── TimeHUD/          # Minecraft plugin
├── server.properties      # Minecraft config
├── server.jar            # Paper server
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions
```

## 🔧 Konfigürasyon

### ecosystem.config.js

PM2 konfigürasyonu - RAM, CPU, restart ayarları

### server.properties

Minecraft sunucu ayarları

### package.json

Node.js dependencies

## 🌐 Port Ayarları

- **25565** - Minecraft sunucu
- **3000** - Web panel / API

Firewall'da bu portları açın:

```bash
sudo ufw allow 25565/tcp
sudo ufw allow 3000/tcp
```

## 📊 Monitoring

### PM2 Monitoring

```bash
pm2 monit
```

### Web Panel

```
http://VPS_IP:3000
```

## 🔄 Güncelleme

```bash
# Local'de değişiklik yap
git add .
git commit -m "update: ..."
git push origin main

# GitHub Actions otomatik deploy eder
```

## 🐛 Sorun Giderme

### Minecraft başlamıyor

```bash
pm2 logs minecraft
pm2 restart minecraft
```

### API çalışmıyor

```bash
pm2 logs minecraft-api
pm2 restart minecraft-api
```

### Port zaten kullanımda

```bash
# Port 3000'i kullanan process'i bul
sudo lsof -i :3000

# Process'i öldür
sudo kill -9 PID
```

### PM2 kayboldu

```bash
pm2 resurrect
pm2 save
```

## 📝 Notlar

- PM2 otomatik restart yapar (crash durumunda)
- Loglar `/opt/minecraft/logs/` dizininde
- PM2 logları `~/.pm2/logs/` dizininde
- Reboot sonrası otomatik başlar (pm2 startup)

## 🎯 Gelecek Özellikler

- [ ] Gerçek zamanlı oyuncu listesi
- [ ] Konsol komut gönderme
- [ ] Backup yönetimi
- [ ] Plugin yönetimi
- [ ] Performans grafikleri
- [ ] Discord webhook entegrasyonu

## 📄 Lisans

MIT
