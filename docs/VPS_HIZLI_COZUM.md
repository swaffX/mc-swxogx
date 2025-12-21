# 🚀 VPS Hızlı Çözüm Rehberi

## ⚡ Tek Komutla Çözüm

VPS'te şunu çalıştır:

```bash
cd /opt/minecraft && \
git pull origin main && \
rm -f world/session.lock world_nether/session.lock world_the_end/session.lock && \
pm2 restart minecraft && \
pm2 restart minecraft-api && \
pm2 logs minecraft-api --lines 20
```

## 📋 Adım Adım

### 1. Git Pull
```bash
cd /opt/minecraft
git pull origin main
```

### 2. Session Lock Temizle
```bash
rm -f world/session.lock
rm -f world_nether/session.lock
rm -f world_the_end/session.lock
```

### 3. Sunucuları Restart Et
```bash
pm2 restart minecraft
pm2 restart minecraft-api
```

### 4. Logları Kontrol Et
```bash
pm2 logs minecraft-api --lines 30
```

## ✅ Başarı Kontrolü

Şunları görmelisin:

### Minecraft API (Web Panel)
```
✅ Firebase Admin initialized
✅ Whitelist active with 1 authorized UID(s)
🚀 Minecraft Server Manager API running on port 3000
📊 Dashboard: http://localhost:3000
```

### Minecraft Server
```
[INFO]: Done (5.234s)! For help, type "help"
```

## 🌐 Siteye Erişim

1. **Login:** `http://194.105.5.37:3000/login.html`
2. **Dashboard:** `http://194.105.5.37:3000/dashboard.html`

## 🐛 Hala Hata Varsa

### Hata: "Cannot find module './public/middleware/auth'"
```bash
# Dosya var mı kontrol et
ls -la /opt/minecraft/public/middleware/auth.js

# Yoksa git pull tekrar
cd /opt/minecraft
git fetch origin
git reset --hard origin/main
```

### Hata: "Port 3000 already in use"
```bash
# Hangi process kullanıyor?
lsof -i :3000

# PM2'yi restart et
pm2 delete minecraft-api
pm2 start server.js --name minecraft-api
```

### Hata: "Session lock"
```bash
# Lock dosyalarını sil
rm -f /opt/minecraft/world/session.lock
rm -f /opt/minecraft/world_nether/session.lock
rm -f /opt/minecraft/world_the_end/session.lock

# Minecraft'ı restart et
pm2 restart minecraft
```

## 📁 Dosya Yapısı (Güncel)

```
/opt/minecraft/
├── server.js                    # Express API
├── public/
│   ├── middleware/
│   │   └── auth.js             # ✅ Buraya taşındı!
│   ├── login.html
│   ├── dashboard.html
│   ├── dashboard.css
│   ├── dashboard.js
│   ├── auth.js
│   └── ... (diğer frontend dosyaları)
├── docs/                        # ✅ Tüm .md dosyaları buraya taşındı
│   ├── VPS_KURULUM.md
│   ├── SESSION_LOCK_FIX.md
│   └── ... (diğer dokümantasyon)
└── ... (minecraft dosyaları)
```

## 🎯 Özet

1. ✅ Tüm .md dosyaları `docs/` klasöründe
2. ✅ `middleware/auth.js` → `public/middleware/auth.js` taşındı
3. ✅ `server.js` path'i güncellendi
4. ✅ Public klasörü organize edildi
5. ✅ Session lock çözümü eklendi

**Artık çalışmalı!** 🚀

## 📞 Destek

Hala sorun varsa log'ları gönder:
```bash
pm2 logs minecraft-api --lines 50 > api-logs.txt
pm2 logs minecraft --lines 50 > minecraft-logs.txt
```
