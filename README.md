# ⚔️ SwxOgx | Live Craft - Minecraft Server

Paper 1.21.1 Minecraft sunucusu + Web Panel + Discord Bot + 🔐 **Firebase Authentication**

## 🌐 Bağlantı

- **Sunucu:** `swxogx.mooo.com`
- **Sürüm:** TLauncher 1.21.10
- **Web Panel:** http://194.105.5.37:3000 (veya subdomain ile)
- **🔐 Login:** `/login.html`
- **👑 Admin Panel:** `/admin.html`

## ✨ Yeni: Authentication Sistemi

### 🔐 Özellikler
- **Google OAuth 2.0** ile giriş
- **Whitelist-based** authentication (sadece yetkili UID'ler)
- Rol bazlı yetkilendirme (Admin, Moderator, User)
- JWT token doğrulama
- Modern glassmorphism UI
- Admin panel (kullanıcı yönetimi)
- Subdomain desteği

### 👥 Erişim Kontrolü
- **🔒 Whitelist**: Sadece belirli Google UID'lerine sahip geliştiriciler erişebilir
- **👑 Admin**: Whitelist'teki kullanıcılar varsayılan admin
- **⚡ Moderator**: Admin tarafından atanabilir
- **👤 User**: Sadece izleme yetkisi

### 🚀 Hızlı Başlangıç
```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Firebase config ekle (docs/FIREBASE_KURULUM.md)
# public/auth.js dosyasına Firebase config'i yapıştır
# firebase-service-account.json dosyasını root'a kaydet

# 3. Başlat
npm start

# 4. Google ile giriş yap ve UID'ni al
# http://localhost:3000/login.html

# 5. UID'ni whitelist'e ekle
# public/auth.js ve middleware/auth.js dosyalarındaki AUTHORIZED_UIDS dizisine ekle

# 6. Restart ve tekrar giriş yap
pm2 restart server
```

📚 **Detaylı Rehberler:**
- [🔒 Whitelist Kurulum (YENİ!)](WHITELIST_KURULUM.md)
- [⚡ Hızlı Başlangıç](HIZLI_BASLANGIC.md)
- [📖 Tam Kurulum Rehberi](KURULUM_ADIMLAR.md)
- [🔥 Firebase Kurulum](docs/FIREBASE_KURULUM.md)
- [🌐 Subdomain Kurulum](docs/SUBDOMAIN_KURULUM.md)
- [🔐 Authentication Dokümantasyonu](README_AUTH.md)

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
│   ├── server.js           # Express.js API + Auth
│   ├── middleware/         # JWT doğrulama
│   ├── data/               # Kullanıcı rolleri
│   └── public/             # Frontend
│       ├── login.html      # Login/Register
│       ├── admin.html      # Admin panel
│       └── index.html      # Ana panel
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

### 🔐 Authentication & Yetkilendirme
- **Google OAuth 2.0** ile giriş
- **Whitelist-based** authentication (sadece yetkili UID'ler)
- Rol bazlı yetkilendirme (Admin, Moderator, User)
- JWT token doğrulama
- Admin panel (kullanıcı yönetimi)
- Modern glassmorphism UI
- Access denied ekranı
- Subdomain desteği (Nginx/Apache)

### Minecraft Server
- Paper 1.21.1 (optimize edilmiş)
- TimeHUD plugin (scoreboard + pusula)
- SkinsRestorer (TLauncher desteği)
- RCON aktif

### Web Panel
- 🔐 Güvenli giriş sistemi
- Sunucu durumu (CPU, RAM, TPS)
- Oyuncu listesi
- Konsol komutu gönderme (Moderator+)
- Performans grafiği
- Başlat/Durdur/Restart (Yetki bazlı)
- Kullanıcı bilgisi ve rol gösterimi

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

### İlk Kurulum (Authentication ile)

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Firebase kurulumu (detaylı: docs/FIREBASE_KURULUM.md)
# - Firebase Console'da proje oluştur
# - Authentication'ı etkinleştir
# - Web app config'i public/auth.js'e ekle
# - Service account key'i firebase-service-account.json olarak kaydet

# 3. Sunucuyu başlat
npm start

# 4. İlk kullanıcıyı oluştur
# http://localhost:3000/login.html adresine git
# İlk kayıt olan kullanıcı otomatik admin olur!
```

### VPS'te

```bash
cd /opt/minecraft
git pull origin main
npm install  # Yeni bağımlılıklar için
pm2 restart all
```

### Subdomain Kurulumu (Opsiyonel)

```bash
# Nginx ile reverse proxy (detaylı: docs/SUBDOMAIN_KURULUM.md)
sudo apt install nginx certbot python3-certbot-nginx -y

# Config oluştur ve SSL ekle
sudo certbot --nginx -d panel.swxogx.com

# Firebase'e subdomain ekle
# Firebase Console > Authentication > Settings > Authorized domains
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
| minecraft-api | 3000 | Web Panel + Auth API |
| discord-bot | - | Discord Bot |

## 🔒 Güvenlik

- ✅ Firebase Authentication
- ✅ JWT token doğrulama
- ✅ Rol bazlı yetkilendirme
- ✅ Tehlikeli komutlar engellendi
- ✅ CORS yapılandırması
- ✅ HTTPS desteği (subdomain ile)
- ✅ Firebase credentials güvenli saklanır

## 🤝 Katkıda Bulunma

Bu proje GitHub'da collaboration olarak geliştirilmektedir.

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

MIT
