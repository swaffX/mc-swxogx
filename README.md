# ⚔️ SwxOgx | Live Craft - Minecraft Server

Paper 1.21.1 Minecraft sunucusu + Web Panel + Discord Bot

## 🌐 Bağlantı

- **Sunucu:** `swxogx.mooo.com`
- **Sürüm:** TLauncher 1.21.10
- **Web Panel:** http://194.105.5.37:3000

## 📁 Proje Yapısı

```
├── 🎮 Minecraft Server (root)
│   ├── server.jar          # Paper 1.21.1
│   ├── server.properties   # Sunucu ayarları
│   ├── bukkit.yml          # Bukkit config
│   ├── spigot.yml          # Spigot config
│   ├── plugins/            # Minecraft pluginleri
│   └── world/              # Dünya dosyaları
│
├── 🌐 Web Panel
│   ├── server.js           # Express.js API
│   └── public/             # Frontend (HTML/CSS/JS)
│
├── 🤖 Discord Bot
│   └── discord-bot/        # Discord.js bot
│
├── 🔧 Plugin Geliştirme
│   └── TimeHUD/            # Özel TimeHUD plugin
│
├── 📚 Dokümantasyon
│   └── docs/               # Kurulum rehberleri
│
└── ⚙️ Konfigürasyon
    ├── ecosystem.config.js # PM2 config
    └── .github/workflows/  # CI/CD
```

## 🚀 Özellikler

### Minecraft Server
- Paper 1.21.1 (optimize edilmiş)
- TimeHUD plugin (scoreboard + pusula)
- SkinsRestorer (TLauncher desteği)
- RCON aktif

### Web Panel
- Sunucu durumu (CPU, RAM, TPS)
- Oyuncu listesi
- Konsol komutu gönderme
- Performans grafiği
- Başlat/Durdur/Restart

### Discord Bot
- `/durum` - Sunucu durumu
- `/oyuncular` - Online oyuncular
- `/sunucu` - Detaylı bilgi (TPS)
- `/ping` - Bağlantı testi
- `/whitelist` - Whitelist yönetimi
- Canlı bilgi paneli (otomatik güncellenen embed)
- Oyuncu giriş/çıkış bildirimleri
- Sunucu çöküş bildirimi

## 🛠️ Kurulum

### VPS'te

```bash
cd /opt/minecraft
git pull origin main
pm2 restart all
```

### Geliştirme

```bash
# Plugin derle
cd TimeHUD && mvn clean package

# Push et (otomatik deploy)
git add . && git commit -m "update" && git push
```

## 📊 PM2 Servisleri

| Servis | Port | Açıklama |
|--------|------|----------|
| minecraft | 25565 | MC Server |
| minecraft-api | 3000 | Web Panel |
| discord-bot | - | Discord Bot |

## 📝 Lisans

MIT
