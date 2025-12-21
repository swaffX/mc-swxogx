# 🔒 Whitelist Kurulum Rehberi

Bu rehber, sadece belirli Google hesaplarına sahip geliştiricilerin web panele erişmesini sağlar.

## 🎯 Nasıl Çalışır?

1. Kullanıcı Google ile giriş yapar
2. Firebase UID'si kontrol edilir
3. UID whitelist'te varsa → ✅ Erişim izni
4. UID whitelist'te yoksa → ❌ Erişim reddedilir

---

## 🚀 Kurulum Adımları

### 1. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/) → "Add project"
2. Proje adı: `swxogx-minecraft`
3. Build > Authentication > Get started
4. **Sadece Google provider'ı etkinleştir**
   - Sign-in method > Google > Enable
   - Proje desteği e-postası gir
   - Save

### 2. Firebase Config Ekle

1. Project Settings (⚙️) > Your apps > Web (</>)
2. App nickname: `Web Panel`
3. Config'i kopyala ve `public/auth.js` dosyasına yapıştır:

```javascript
const firebaseConfig = {
  apiKey: "BURAYA_YAPISTIR",
  authDomain: "BURAYA_YAPISTIR",
  projectId: "BURAYA_YAPISTIR",
  storageBucket: "BURAYA_YAPISTIR",
  messagingSenderId: "BURAYA_YAPISTIR",
  appId: "BURAYA_YAPISTIR"
};
```

### 3. Service Account Key İndir

1. Project Settings > Service Accounts
2. "Generate new private key" → İndir
3. Dosyayı `firebase-service-account.json` olarak root dizine kaydet

### 4. İlk Giriş Yap (UID Almak İçin)

```bash
npm install
npm start
```

1. `http://localhost:3000/login.html` aç
2. "Sign in with Google" butonuna tıkla
3. Google hesabınla giriş yap
4. **"Access Denied" hatası alacaksın** (normal, henüz whitelist'e eklemedin)

### 5. UID'ni Bul

**Yöntem 1: Firebase Console**
1. Firebase Console > Authentication > Users
2. Kullanıcını bul
3. UID'yi kopyala (örn: `abc123xyz456def789ghi012jkl345mno678`)

**Yöntem 2: Browser Console**
1. Login sayfasında F12 > Console
2. Giriş yaptıktan sonra şu komutu çalıştır:
```javascript
localStorage.getItem('userUID')
```
3. UID'yi kopyala

**Yöntem 3: Server Logs**
```bash
pm2 logs server
# veya
npm start
```
Logda şöyle bir satır göreceksin:
```
🚫 Unauthorized access attempt: user@gmail.com (UID: abc123xyz456...)
```

### 6. Whitelist'e Ekle

**Frontend (`public/auth.js`):**
```javascript
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678", // İlk geliştirici
    "def456ghi789jkl012mno345pqr678stu901", // İkinci geliştirici
];
```

**Backend (`middleware/auth.js`):**
```javascript
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678", // İlk geliştirici
    "def456ghi789jkl012mno345pqr678stu901", // İkinci geliştirici
];
```

⚠️ **ÖNEMLİ**: Her iki dosyaya da aynı UID'leri ekle!

### 7. Sunucuyu Restart Et

```bash
pm2 restart server
# veya
npm start
```

### 8. Tekrar Giriş Yap

1. `http://localhost:3000/login.html` aç
2. "Sign in with Google" butonuna tıkla
3. ✅ Artık erişim izni alacaksın!

---

## 👥 Yeni Geliştirici Ekleme

### Adım 1: Geliştirici Giriş Yapsın
1. Yeni geliştirici login sayfasına gitsin
2. Google ile giriş yapsın
3. "Access Denied" hatası alacak

### Adım 2: UID'sini Al
Firebase Console > Authentication > Users bölümünden yeni kullanıcının UID'sini kopyala

### Adım 3: Whitelist'e Ekle
```javascript
// public/auth.js ve middleware/auth.js
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678", // Mevcut geliştirici
    "YENİ_UID_BURAYA",                       // Yeni geliştirici
];
```

### Adım 4: Restart ve Test
```bash
pm2 restart server
```

Yeni geliştirici tekrar giriş yapsın → ✅ Erişim izni alacak

---

## 🔐 Güvenlik

### Whitelist Boşsa Ne Olur?

Eğer `AUTHORIZED_UIDS` dizisi boşsa:
```javascript
const AUTHORIZED_UIDS = [];
```

**Tüm Google kullanıcılarına izin verilir!** ⚠️

Console'da uyarı göreceksin:
```
⚠️  WARNING: Whitelist is empty! Add UIDs to AUTHORIZED_UIDS
```

### Öneriler

1. **Asla whitelist'i boş bırakma** (production'da)
2. **UID'leri güvenli tut** (private repo kullan)
3. **Düzenli kontrol et** (Firebase Console > Authentication > Users)
4. **Gereksiz kullanıcıları sil** (Firebase Console'dan)

---

## 🎨 Login Sayfası Özellikleri

### Tasarım
- ✅ Modern glassmorphism
- ✅ Animasyonlu partiküller
- ✅ Grid pattern arka plan
- ✅ Gradient efektler
- ✅ Responsive tasarım

### Özellikler
- ✅ Sadece Google ile giriş
- ✅ Whitelist kontrolü
- ✅ Access denied mesajı
- ✅ Loading overlay
- ✅ Toast bildirimleri
- ✅ Developer info section

---

## 🐛 Sorun Giderme

### "Access Denied" Hatası

**Sebep**: UID whitelist'te yok

**Çözüm**:
1. Firebase Console > Authentication > Users
2. UID'yi kopyala
3. `public/auth.js` ve `middleware/auth.js` dosyalarına ekle
4. Sunucuyu restart et

### "Firebase could not be loaded"

**Sebep**: Firebase config yanlış

**Çözüm**:
1. Firebase Console > Project Settings > Your apps
2. Config'i kopyala
3. `public/auth.js` dosyasına yapıştır
4. Sayfayı yenile (Ctrl+Shift+R)

### "Popup blocked"

**Sebep**: Tarayıcı popup'ları engelliyor

**Çözüm**:
1. Tarayıcı adres çubuğunda popup ikonu
2. "Always allow popups from this site"
3. Tekrar dene

### Backend'de "Unauthorized access attempt"

**Sebep**: Frontend whitelist'te var ama backend'de yok

**Çözüm**:
Her iki dosyaya da aynı UID'leri ekle:
- `public/auth.js`
- `middleware/auth.js`

---

## 📊 Whitelist Yönetimi

### Mevcut Kullanıcıları Görme

Firebase Console > Authentication > Users

### Kullanıcı Silme

1. Firebase Console > Authentication > Users
2. Kullanıcıyı bul
3. ⋮ (üç nokta) > Delete account

### UID Değişir mi?

❌ Hayır! UID kalıcıdır. Kullanıcı hesabını silip tekrar oluştursa bile aynı UID'yi alır (aynı Google hesabıyla).

---

## 🚀 Production Deployment

### 1. Whitelist'i Doldur
```javascript
const AUTHORIZED_UIDS = [
    "gelistirici1_uid",
    "gelistirici2_uid",
    "gelistirici3_uid",
];
```

### 2. Firebase'e Subdomain Ekle
Firebase Console > Authentication > Settings > Authorized domains
- `panel.swxogx.com` ekle

### 3. Deploy
```bash
git add .
git commit -m "Add whitelist UIDs"
git push origin main

# VPS'te
cd /opt/minecraft
git pull
npm install
pm2 restart all
```

### 4. Test Et
`https://panel.swxogx.com/login.html` adresine git ve giriş yap

---

## 📝 Checklist

Kurulum tamamlandı mı?

- [ ] Firebase projesi oluşturuldu
- [ ] Google provider etkinleştirildi
- [ ] Firebase config eklendi (`public/auth.js`)
- [ ] Service account key indirildi
- [ ] İlk giriş yapıldı (UID alındı)
- [ ] UID whitelist'e eklendi (frontend + backend)
- [ ] Sunucu restart edildi
- [ ] Tekrar giriş yapıldı (başarılı)
- [ ] Diğer geliştiriciler eklendi
- [ ] Production'a deploy edildi

Hepsi ✅ ise tebrikler! Whitelist sistemi aktif! 🎉

---

## 🔮 Gelecek Geliştirmeler

- [ ] Admin panel'den whitelist yönetimi
- [ ] UID ekleme/çıkarma UI'ı
- [ ] Kullanıcı aktivite logları
- [ ] Email bildirimleri (yetkisiz erişim)
- [ ] 2FA (Two-Factor Authentication)

---

**Geliştirici**: SWXOGX Team  
**Versiyon**: 2.1.0  
**Son Güncelleme**: 2024
