# 📋 Proje Özeti - Minecraft Web Panel

**Proje Adı:** SwxOgx Minecraft Server Manager  
**Versiyon:** 2.0.0  
**Son Güncelleme:** 21 Aralık 2024  
**Durum:** ✅ Production Ready

## 🎯 Proje Amacı

Minecraft sunucusunu web üzerinden yönetmek için modern, güvenli ve kullanıcı dostu bir panel.

## ✨ Özellikler

### 🔐 Güvenlik
- ✅ Firebase Authentication (Google OAuth)
- ✅ UID bazlı whitelist sistemi
- ✅ Rol bazlı yetkilendirme (Admin, Moderator, User)
- ✅ Token doğrulaması
- ✅ Access denied sayfası

### 🎨 Arayüz
- ✅ Modern glassmorphism tasarım
- ✅ Purple-pink gradient tema (#8b5cf6, #ec4899)
- ✅ Responsive design
- ✅ Sidebar navigasyon
- ✅ Toast bildirimleri
- ✅ Minecraft player heads (mc-heads.net API)

### 🎮 Sunucu Yönetimi
- ✅ Start/Stop/Restart kontrolleri
- ✅ Real-time sunucu durumu
- ✅ Online oyuncu listesi
- ✅ TPS monitoring
- ✅ CPU/Memory kullanımı
- ✅ Console erişimi (RCON)
- ✅ Performans grafikleri

### 👑 Rol Sistemi (YENİ!)
- ✅ Web panelden rol atama
- ✅ Minecraft'ta real-time bildirimler
- ✅ Renkli chat mesajları
- ✅ Kalıcı veri saklama
- ✅ Offline sunucu desteği
- ✅ Rol oluşturma/düzenleme/silme
- ✅ İzin yönetimi

## 📁 Proje Yapısı

```
mc-swxogx/
├── server.js                          # Backend API
├── ecosystem.config.js                # PM2 config
├── package.json                       # Dependencies
│
├── public/                            # Frontend
│   ├── index.html                     # Landing page
│   ├── pages/                         # HTML sayfaları
│   │   ├── login.html                 # Giriş sayfası
│   │   ├── checking.html              # Doğrulama sayfası
│   │   ├── access-denied.html         # Erişim reddedildi
│   │   ├── dashboard.html             # Ana panel
│   │   └── legacy.html                # Eski panel
│   ├── styles/                        # CSS dosyaları
│   │   ├── login.css
│   │   └── dashboard.css
│   ├── scripts/                       # JavaScript dosyaları
│   │   ├── auth.js                    # Authentication
│   │   └── dashboard.js               # Dashboard logic
│   ├── assets/                        # Statik dosyalar
│   │   └── favicon.ico
│   └── middleware/                    # Backend middleware
│       └── auth.js                    # Token verification
│
├── data/                              # Kalıcı veri
│   ├── player-roles.json              # Oyuncu rolleri
│   └── user-roles.json                # Kullanıcı rolleri
│
├── docs/                              # Dokümantasyon
│   ├── ROL_SISTEMI.md                 # Rol sistemi detayları
│   ├── ROL_TEST.md                    # Test rehberi
│   ├── REAL_TIME_ROL_TAMAMLANDI.md    # Tamamlanan özellikler
│   ├── VPS_SON_KURULUM.md             # VPS kurulum
│   ├── LANDING_PAGE.md                # Landing page bilgisi
│   └── OZET.md                        # Bu dosya
│
├── plugins/                           # Minecraft plugins
├── config/                            # Minecraft config
├── scripts/                           # Utility scripts
├── deploy-roles.sh                    # Linux deployment
└── deploy-roles.bat                   # Windows deployment
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PM2
- Minecraft Paper Server 1.21.4
- Firebase Project
- RCON enabled

### Hızlı Kurulum

```bash
# 1. Repository'yi klonla
git clone <repo-url>
cd mc-swxogx

# 2. Dependencies yükle
npm install

# 3. Firebase config ekle
# swxogx-minecraft-firebase-adminsdk-*.json dosyasını kök dizine koy

# 4. PM2 ile başlat
pm2 start ecosystem.config.js

# 5. Logları kontrol et
pm2 logs
```

### VPS Deployment

```bash
# Linux
bash deploy-roles.sh

# Windows
deploy-roles.bat
```

## 🌐 URL'ler

### Production
- **Web Panel:** http://194.105.5.37:3000
- **Landing Page:** http://194.105.5.37:3000
- **Login:** http://194.105.5.37:3000/pages/login.html
- **Dashboard:** http://194.105.5.37:3000/pages/dashboard.html
- **Minecraft:** swxogx.mooo.com:25565

### Local Development
- **Web Panel:** http://localhost:3000
- **Minecraft:** localhost:25565

## 🔑 Whitelist

**Dosya:** `public/middleware/auth.js`

```javascript
const AUTHORIZED_UIDS = [
    "P2xHD09hwFaXf6Ci2RE4zlZYYnc2" // Admin
];
```

**UID Ekleme:**
1. Firebase Console → Authentication → Users
2. Kullanıcının UID'sini kopyala
3. `AUTHORIZED_UIDS` array'ine ekle
4. PM2 restart

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/auth/role` - Kullanıcı rolü sorgula
- `POST /api/auth/set-role` - Rol güncelle (admin only)
- `GET /api/auth/users` - Tüm kullanıcılar (admin only)

### Server Control
- `GET /api/status` - Sunucu durumu
- `GET /api/players` - Online oyuncular
- `POST /api/start` - Sunucu başlat
- `POST /api/stop` - Sunucu durdur
- `POST /api/restart` - Sunucu yeniden başlat
- `GET /api/tps` - TPS bilgisi
- `POST /api/command` - Console komutu gönder

### Role Management (YENİ!)
- `POST /api/roles/assign` - Rol ata
- `GET /api/roles/players` - Oyuncu rolleri

### System
- `GET /api/system-info` - Sistem bilgisi
- `GET /api/stats/history` - Performans geçmişi

## 🎭 Rol Sistemi

### Varsayılan Roller

| Rol | Renk | İzinler | Açıklama |
|-----|------|---------|----------|
| Admin | 🔴 Red | `*` | Tüm yetkiler |
| Moderator | 🟡 Gold | `kick, mute, warn, teleport` | Moderasyon |
| VIP | 🟣 Purple | `fly, kit.vip, home.3` | Premium üye |
| Player | 🟢 Green | `chat, build, break` | Normal oyuncu |

### Rol Atama Akışı

1. **Web Panel:** Dashboard → Role Manager → Player seç → Rol seç
2. **Backend:** `/api/roles/assign` endpoint'i çağrılır
3. **Veri:** `data/player-roles.json` dosyasına kaydedilir
4. **RCON:** Minecraft'a renkli bildirim gönderilir
5. **Minecraft:** Tüm oyuncular bildirimi görür

**Örnek bildirim:**
```
[PANEL] SwxOgx oyuncusuna VIP rolü verildi!
```

## 🔧 Konfigürasyon

### server.properties
```properties
enable-rcon=true
rcon.port=25575
rcon.password=SwxOgx2024Rcon!
```

### ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'minecraft',
      script: 'java',
      args: '-Xms4G -Xmx6G -jar server.jar nogui',
      cwd: '/opt/minecraft'
    },
    {
      name: 'server',
      script: 'server.js',
      cwd: '/opt/minecraft'
    }
  ]
};
```

## 📈 Performans

### Optimizasyonlar
- ✅ View distance: 6 chunks
- ✅ Simulation distance: 4 chunks
- ✅ Entity tracking: 50% azaltıldı
- ✅ Mob spawn limits: 30% azaltıldı
- ✅ Redstone: ALTERNATE_CURRENT
- ✅ Chunk loading: Agresif sınırlandırma

### Beklenen Sonuçlar
- **TPS:** 15-18 → 19-20
- **RAM:** -20-30%
- **CPU:** -30-40%

## 🧪 Test

### Manuel Test
```bash
# 1. Sunucuyu başlat
pm2 start all

# 2. Web panele giriş yap
# http://194.105.5.37:3000

# 3. Rol ata
# Dashboard → Role Manager → Rol seç

# 4. Minecraft'ta kontrol et
# Chat'te bildirim görünmeli
```

### API Test
```bash
# Rol atama
curl -X POST http://194.105.5.37:3000/api/roles/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"playerName":"SwxOgx","roleId":"vip","roleName":"VIP"}'
```

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| `ROL_SISTEMI.md` | Rol sistemi detaylı dokümantasyon |
| `ROL_TEST.md` | Test senaryoları ve rehber |
| `REAL_TIME_ROL_TAMAMLANDI.md` | Tamamlanan özellikler |
| `VPS_SON_KURULUM.md` | VPS kurulum rehberi |
| `LANDING_PAGE.md` | Landing page bilgisi |
| `OZET.md` | Bu dosya (genel bakış) |

## 🐛 Sorun Giderme

### Sunucu başlamıyor
```bash
# Session lock temizle
rm -f world/session.lock world_*/*.lock

# PM2 restart
pm2 restart minecraft
```

### RCON bağlantısı yok
```bash
# RCON test
telnet localhost 25575

# server.properties kontrol
cat server.properties | grep rcon
```

### Roller kaydedilmiyor
```bash
# Data klasörü izinleri
chmod 755 data/

# JSON dosyası kontrol
cat data/player-roles.json
```

### 403 Forbidden
```bash
# Whitelist kontrol
cat public/middleware/auth.js | grep AUTHORIZED_UIDS

# UID ekle ve restart
pm2 restart server
```

## 🔮 Gelecek Özellikler

### Planlanıyor
- [ ] WebSocket/SSE entegrasyonu
- [ ] Minecraft plugin entegrasyonu (LuckPerms)
- [ ] Rol geçmişi ve audit log
- [ ] Toplu rol atama
- [ ] Rol şablonları
- [ ] Chat mesajlarını panelde gösterme
- [ ] Backup yönetimi
- [ ] Plugin yönetimi

### Tamamlandı
- [x] Firebase Authentication
- [x] Whitelist sistemi
- [x] Modern dashboard
- [x] Rol yönetimi
- [x] Real-time Minecraft entegrasyonu
- [x] RCON entegrasyonu
- [x] Performans optimizasyonları
- [x] Landing page

## 👥 Ekip

- **Geliştirici:** Kiro AI
- **Proje Sahibi:** SwxOgx
- **Sunucu:** VPS (194.105.5.37)

## 📄 Lisans

Bu proje özel kullanım içindir.

## 🙏 Teşekkürler

- Firebase (Authentication)
- Paper MC (Minecraft Server)
- mc-heads.net (Player Avatars)
- PM2 (Process Manager)

---

**Son Güncelleme:** 21 Aralık 2024  
**Versiyon:** 2.0.0  
**Durum:** ✅ Production Ready

**İletişim:**
- Web Panel: http://194.105.5.37:3000
- Minecraft: swxogx.mooo.com
