# 🚀 VPS Son Kurulum - Organize Edilmiş Public Klasörü

## ✅ Yapılan Değişiklikler

### 📁 Public Klasörü Yeniden Organize Edildi

**Önceki Yapı:**
```
public/
├── login.html
├── dashboard.html
├── auth.js
├── dashboard.css
└── ... (karmakarışık)
```

**Yeni Yapı:**
```
public/
├── pages/              # 📄 Tüm HTML dosyaları
│   ├── login.html
│   ├── checking.html
│   ├── access-denied.html
│   ├── dashboard.html
│   ├── index.html
│   ├── admin.html
│   └── test.html
│
├── styles/             # 🎨 Tüm CSS dosyaları
│   ├── login.css
│   ├── dashboard.css
│   └── styles.css
│
├── scripts/            # ⚙️ Tüm JS dosyaları
│   ├── auth.js
│   ├── dashboard.js
│   └── app.js
│
├── assets/             # 🖼️ Statik dosyalar
│   └── favicon.ico
│
├── middleware/         # 🔐 Backend auth
│   └── auth.js
│
└── README.md           # 📖 Dokümantasyon
```

## 🚀 VPS'te Tek Komutla Kurulum

```bash
cd /opt/minecraft && \
git pull origin main && \
rm -f world/session.lock world_nether/session.lock world_the_end/session.lock && \
pm2 restart minecraft && \
pm2 restart minecraft-api && \
pm2 logs minecraft-api --lines 30
```

## 🌐 Yeni URL'ler

### Önceki URL'ler (Artık Çalışmaz)
- ❌ `http://194.105.5.37:3000/login.html`
- ❌ `http://194.105.5.37:3000/dashboard.html`

### Yeni URL'ler (Kullan)
- ✅ `http://194.105.5.37:3000/pages/login.html`
- ✅ `http://194.105.5.37:3000/pages/dashboard.html`
- ✅ `http://194.105.5.37:3000/pages/index.html` (eski panel)

## 📝 Path Değişiklikleri

### HTML Dosyalarında
```html
<!-- Önceki -->
<link rel="stylesheet" href="dashboard.css">
<script src="dashboard.js"></script>

<!-- Yeni -->
<link rel="stylesheet" href="../styles/dashboard.css">
<script src="../scripts/dashboard.js"></script>
```

### JavaScript Dosyalarında
```javascript
// Önceki
window.location.href = '/login.html';

// Yeni
window.location.href = 'login.html';  // Relative path
```

## ✅ Başarı Kontrolü

### 1. Sunucu Logları
```bash
pm2 logs minecraft-api --lines 20
```

**Beklenen çıktı:**
```
✅ Firebase Admin initialized
✅ Whitelist active with 1 authorized UID(s)
🚀 Minecraft Server Manager API running on port 3000
📊 Dashboard: http://localhost:3000
```

### 2. Dosya Yapısı
```bash
ls -la /opt/minecraft/public/
```

**Beklenen çıktı:**
```
drwxr-xr-x pages/
drwxr-xr-x styles/
drwxr-xr-x scripts/
drwxr-xr-x assets/
drwxr-xr-x middleware/
-rw-r--r-- README.md
```

### 3. Web Erişimi
Tarayıcıda aç: `http://194.105.5.37:3000/pages/login.html`

## 🔧 Sorun Giderme

### Hata: "404 Not Found"
**Sebep:** Eski URL kullanıyorsun

**Çözüm:**
```
Eski: http://194.105.5.37:3000/login.html
Yeni: http://194.105.5.37:3000/pages/login.html
```

### Hata: "Cannot find module './public/middleware/auth'"
**Sebep:** Git pull yapılmamış

**Çözüm:**
```bash
cd /opt/minecraft
git pull origin main
pm2 restart minecraft-api
```

### Hata: "Session lock"
**Sebep:** Minecraft sunucusu zaten çalışıyor

**Çözüm:**
```bash
pm2 stop minecraft
rm -f /opt/minecraft/world/session.lock
rm -f /opt/minecraft/world_nether/session.lock
rm -f /opt/minecraft/world_the_end/session.lock
pm2 start minecraft
```

## 📊 Dosya Referansları

### Login Flow
```
pages/login.html
  ├── styles/login.css
  ├── scripts/auth.js
  └── → pages/checking.html
       └── → pages/dashboard.html
            ├── styles/dashboard.css
            └── scripts/dashboard.js
```

### Dashboard Pages
```
pages/dashboard.html
  ├── Dashboard (Ana sayfa)
  ├── Server Control
  ├── Players
  ├── Console
  ├── Performance
  └── Role Manager
```

## 🎯 Hızlı Başlangıç

1. **VPS'te git pull:**
   ```bash
   cd /opt/minecraft && git pull origin main
   ```

2. **Session lock temizle:**
   ```bash
   rm -f world/*.lock world_*/*.lock
   ```

3. **Restart:**
   ```bash
   pm2 restart all
   ```

4. **Tarayıcıda aç:**
   ```
   http://194.105.5.37:3000/pages/login.html
   ```

5. **Google ile giriş yap**

6. **Dashboard'u kullan!** 🎉

## 📝 Notlar

- ✅ Tüm .md dosyaları `docs/` klasöründe
- ✅ Public klasörü kategorize edildi
- ✅ Path'ler relative olarak güncellendi
- ✅ Middleware `public/middleware/` altında
- ✅ README.md her klasörde mevcut

## 🎉 Sonuç

Artık public klasörü düzenli ve organize! Her şey kategorize edilmiş durumda:
- 📄 HTML → `pages/`
- 🎨 CSS → `styles/`
- ⚙️ JS → `scripts/`
- 🖼️ Assets → `assets/`
- 🔐 Auth → `middleware/`

**Siteye erişim:** `http://194.105.5.37:3000/pages/login.html` 🚀
