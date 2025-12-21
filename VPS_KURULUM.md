# 🚀 VPS Kurulum Rehberi

## 📁 Dosya Yapısı Kontrolü

### Public Klasörü (Frontend) ✅
```
public/
├── access-denied.html      ✅ Erişim engellendi sayfası
├── admin.html              ✅ Admin paneli (eski)
├── app.js                  ✅ Eski panel JS
├── auth.js                 ✅ Firebase auth + whitelist
├── checking.html           ✅ Doğrulama sayfası
├── dashboard.css           ✅ Yeni panel CSS (mor tema)
├── dashboard.html          ✅ Yeni panel HTML
├── dashboard.js            ✅ Yeni panel JS (rol yönetimi)
├── favicon.ico             ✅ Site ikonu
├── index.html              ✅ Eski panel HTML
├── login.css               ✅ Login sayfası CSS
├── login.html              ✅ Login sayfası
├── styles.css              ✅ Eski panel CSS
└── test.html               ✅ Test sayfası
```

### Backend Dosyaları
```
/opt/minecraft/
├── server.js               ✅ Express API server
├── middleware/
│   └── auth.js             ⚠️  EKSIK - Manuel oluşturulacak
├── package.json            ✅ Dependencies
├── node_modules/           ✅ npm install ile
└── public/                 ✅ Yukarıdaki dosyalar
```

## 🔧 VPS'te Yapılacaklar

### 1. Middleware Klasörünü Oluştur
```bash
cd /opt/minecraft
mkdir -p middleware
```

### 2. Auth.js Dosyasını Oluştur
```bash
nano middleware/auth.js
```

**İçeriği yapıştır:**
```javascript
// Firebase Admin SDK
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Whitelist - Sadece bu UID'lere sahip kullanıcılar erişebilir
const AUTHORIZED_UIDS = [
    "P2xHD09hwFaXf6Ci2RE4zlZYYnc2" // Admin
];

// Firebase Admin'i başlat
let firebaseAdmin = null;

function initFirebaseAdmin() {
    try {
        const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
        
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = require(serviceAccountPath);
            firebaseAdmin = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized');
            
            if (AUTHORIZED_UIDS.length === 0) {
                console.warn('⚠️  WARNING: Whitelist is empty!');
            } else {
                console.log(\`✅ Whitelist active with \${AUTHORIZED_UIDS.length} authorized UID(s)\`);
            }
        } else {
            console.warn('⚠️  Firebase service account not found. Auth will be disabled.');
        }
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error.message);
    }
}

initFirebaseAdmin();

const userRoles = new Map();

function loadUserRoles() {
    try {
        const rolesPath = path.join(__dirname, '..', 'data', 'user-roles.json');
        if (fs.existsSync(rolesPath)) {
            const data = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
            Object.entries(data).forEach(([email, role]) => {
                userRoles.set(email, role);
            });
            console.log(\`✅ Loaded \${userRoles.size} user roles\`);
        }
    } catch (error) {
        console.error('Error loading user roles:', error);
    }
}

function saveUserRoles() {
    try {
        const rolesPath = path.join(__dirname, '..', 'data', 'user-roles.json');
        const dataDir = path.dirname(rolesPath);
        
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const data = Object.fromEntries(userRoles);
        fs.writeFileSync(rolesPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving user roles:', error);
    }
}

loadUserRoles();

async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token bulunamadı' });
        }
        
        const token = authHeader.split('Bearer ')[1];
        
        if (!firebaseAdmin) {
            console.warn('⚠️  Auth disabled - Firebase Admin not initialized');
            req.user = { email: 'dev@localhost', uid: 'dev', role: 'admin' };
            return next();
        }
        
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        if (!isAuthorized(decodedToken.uid)) {
            console.warn(\`🚫 Unauthorized access attempt: \${decodedToken.email} (UID: \${decodedToken.uid})\`);
            return res.status(403).json({ 
                error: 'Access denied',
                message: 'Your account is not authorized to access this panel'
            });
        }
        
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email.split('@')[0],
            role: userRoles.get(decodedToken.email) || 'admin'
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Geçersiz token' });
    }
}

function isAuthorized(uid) {
    if (AUTHORIZED_UIDS.length === 0) {
        console.error('🚫 SECURITY: Whitelist is empty! Access denied to all users.');
        return false;
    }
    
    const isAllowed = AUTHORIZED_UIDS.includes(uid);
    
    if (!isAllowed) {
        console.warn(\`🚫 Backend: Access denied for UID: \${uid}\`);
    } else {
        console.log(\`✅ Backend: Access granted for UID: \${uid}\`);
    }
    
    return isAllowed;
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Yetkilendirme gerekli' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
        }
        
        next();
    };
}

function setUserRole(email, role) {
    const validRoles = ['admin', 'moderator', 'user'];
    if (!validRoles.includes(role)) {
        throw new Error('Geçersiz rol');
    }
    
    userRoles.set(email, role);
    saveUserRoles();
}

function getUserRole(email) {
    return userRoles.get(email) || 'user';
}

module.exports = {
    verifyToken,
    requireRole,
    setUserRole,
    getUserRole,
    userRoles,
    AUTHORIZED_UIDS
};
```

Kaydet: `Ctrl+O`, `Enter`, `Ctrl+X`

### 3. Git Pull ve Restart
```bash
cd /opt/minecraft
git pull origin main
pm2 restart minecraft-api
pm2 logs minecraft-api --lines 30
```

### 4. Kontrol Et
```bash
# Dosya var mı?
ls -la middleware/auth.js

# Sunucu çalışıyor mu?
pm2 status

# Log'larda hata var mı?
pm2 logs minecraft-api --lines 50
```

## ✅ Başarı Kontrolü

Şunları görmelisin:
```
✅ Firebase Admin initialized
✅ Whitelist active with 1 authorized UID(s)
🚀 Minecraft Server Manager API running on port 3000
```

## 🌐 Siteye Erişim

1. **Login:** `http://194.105.5.37:3000/login.html`
2. **Dashboard:** `http://194.105.5.37:3000/dashboard.html`
3. **Eski Panel:** `http://194.105.5.37:3000/index.html`

## 🎯 Test Adımları

1. Login sayfasına git
2. Google ile giriş yap
3. Checking sayfası görünecek
4. Dashboard'a yönlendirileceksin
5. Mor-pembe tema görünmeli
6. Server control, online players, role manager çalışmalı

## 🐛 Sorun Giderme

### Hata: "Cannot find module './middleware/auth'"
```bash
# Middleware klasörü var mı?
ls -la middleware/

# Auth.js var mı?
ls -la middleware/auth.js

# Yoksa yukarıdaki adımları tekrarla
```

### Hata: "Port 3000 already in use"
```bash
# Hangi process kullanıyor?
lsof -i :3000

# PM2'yi restart et
pm2 restart minecraft-api
```

### Hata: "Firebase Admin not initialized"
```bash
# Firebase service account var mı?
ls -la firebase-service-account.json

# Yoksa Firebase Console'dan indir
# Project Settings > Service Accounts > Generate new private key
```

## 📦 Gerekli Paketler

Eğer `npm install` gerekiyorsa:
```bash
cd /opt/minecraft
npm install express cors firebase-admin
```

## 🎉 Tamamlandı!

Artık:
- ✅ Middleware/auth.js oluşturuldu
- ✅ Public klasöründe tüm dosyalar var
- ✅ Mor-pembe tema aktif
- ✅ Oyuncu kafaları gösteriliyor
- ✅ Rol yönetim sistemi hazır
- ✅ Dashboard'da server control var

**Siteye giriş yapabilirsin!** 🚀
