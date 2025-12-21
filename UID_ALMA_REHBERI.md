# 🔑 UID Alma Rehberi

Firebase config'in entegre edildi! Şimdi UID'leri alıp whitelist'e ekleme zamanı.

## 🚀 Hızlı Başlangıç

### 1. Sunucuyu Başlat

```bash
npm start
```

### 2. Login Sayfasına Git

Tarayıcıda aç: `http://localhost:3000/login.html`

### 3. Google ile Giriş Yap

"Sign in with Google" butonuna tıkla ve Google hesabınla giriş yap.

**Sonuç:** "Access Denied" hatası alacaksın (normal, henüz whitelist'e eklemedin)

---

## 🔍 UID'ni Bulma Yöntemleri

### Yöntem 1: Firebase Console (Önerilen)

1. [Firebase Console](https://console.firebase.google.com/) → `swxogx-minecraft` projesine git
2. Sol menüden **Build > Authentication** seç
3. **Users** sekmesine git
4. Kullanıcını bul (Google ile giriş yaptığın hesap)
5. **User UID** sütunundaki değeri kopyala

Örnek UID:
```
abc123xyz456def789ghi012jkl345mno678
```

### Yöntem 2: Browser Console

1. Login sayfasında **F12** tuşuna bas
2. **Console** sekmesine git
3. Giriş yaptıktan sonra şu komutu çalıştır:

```javascript
localStorage.getItem('userUID')
```

4. Çıkan UID'yi kopyala

### Yöntem 3: Server Logs

```bash
# Terminal'de
pm2 logs server

# veya
npm start
```

Giriş yaptığında logda şöyle bir satır göreceksin:
```
🚫 Unauthorized access attempt: senin@gmail.com (UID: abc123xyz456...)
```

UID'yi buradan kopyala.

---

## ✏️ Whitelist'e Ekleme

### Adım 1: Frontend (`public/auth.js`)

Dosyayı aç ve `AUTHORIZED_UIDS` dizisine UID'ni ekle:

```javascript
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678", // Senin UID'n
];
```

### Adım 2: Backend (`middleware/auth.js`)

Aynı dosyayı aç ve aynı UID'yi ekle:

```javascript
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678", // Senin UID'n
];
```

⚠️ **ÖNEMLİ**: Her iki dosyaya da aynı UID'leri ekle!

### Adım 3: Sunucuyu Restart Et

```bash
pm2 restart server

# veya Ctrl+C ile durdur ve tekrar
npm start
```

### Adım 4: Tekrar Giriş Yap

1. `http://localhost:3000/login.html` aç
2. "Sign in with Google" butonuna tıkla
3. ✅ Artık ana panele yönlendirileceksin!

---

## 👥 Birden Fazla Geliştirici Ekleme

### Örnek: 3 Geliştirici

**`public/auth.js` ve `middleware/auth.js`:**

```javascript
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678", // Geliştirici 1
    "def456ghi789jkl012mno345pqr678stu901", // Geliştirici 2
    "ghi789jkl012mno345pqr678stu901vwx234", // Geliştirici 3
];
```

### Yeni Geliştirici Ekleme Süreci

1. Yeni geliştirici login sayfasına gitsin
2. Google ile giriş yapsın → Access Denied
3. Firebase Console'dan UID'sini al
4. Whitelist'e ekle (frontend + backend)
5. Restart
6. Yeni geliştirici tekrar giriş yapsın → ✅ Erişim

---

## 🧪 Test Etme

### Test 1: Yetkili Kullanıcı

```bash
# 1. UID'ni whitelist'e ekle
# 2. Restart
pm2 restart server

# 3. Login sayfasına git
# 4. Google ile giriş yap
# 5. Beklenen: Ana panele yönlendirilme ✅
```

### Test 2: Yetkisiz Kullanıcı

```bash
# 1. Farklı bir Google hesabıyla giriş yap
# 2. Beklenen: "Access Denied" mesajı ❌
# 3. Console'da log: "🚫 Unauthorized access attempt..."
```

---

## 📊 Mevcut Durum

### Firebase Config
✅ Entegre edildi!

```javascript
projectId: "swxogx-minecraft"
authDomain: "swxogx-minecraft.firebaseapp.com"
```

### Whitelist
⚠️ Henüz boş!

```javascript
const AUTHORIZED_UIDS = [
    // Buraya UID'leri ekle
];
```

### Yapılması Gerekenler

- [ ] Google ile giriş yap
- [ ] UID'ni al (Firebase Console / Browser Console / Server Logs)
- [ ] `public/auth.js` dosyasına ekle
- [ ] `middleware/auth.js` dosyasına ekle
- [ ] Sunucuyu restart et
- [ ] Tekrar giriş yap ve test et

---

## 🐛 Sorun Giderme

### "Access Denied" Hatası

**Sebep**: UID whitelist'te yok

**Çözüm**:
1. Firebase Console > Authentication > Users
2. UID'ni kopyala
3. Her iki dosyaya da ekle
4. Restart

### "Firebase could not be loaded"

**Sebep**: Firebase config yanlış (ama senin config'in doğru!)

**Çözüm**: Sayfayı yenile (Ctrl+Shift+R)

### "Popup blocked"

**Sebep**: Tarayıcı popup'ları engelliyor

**Çözüm**:
1. Adres çubuğunda popup ikonu
2. "Always allow popups"
3. Tekrar dene

### UID Görünmüyor

**Sebep**: Henüz giriş yapmadın

**Çözüm**:
1. Login sayfasına git
2. Google ile giriş yap
3. "Access Denied" alsan bile UID kaydedilir
4. Firebase Console'dan kontrol et

---

## 📝 Örnek Senaryo

### Senaryo: İlk Kurulum

```bash
# 1. Sunucuyu başlat
npm start

# 2. Login sayfasına git
# http://localhost:3000/login.html

# 3. Google ile giriş yap
# Sonuç: Access Denied ❌

# 4. Firebase Console'a git
# Authentication > Users > UID'ni kopyala
# Örnek: "abc123xyz456def789ghi012jkl345mno678"

# 5. public/auth.js dosyasını aç
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678",
];

# 6. middleware/auth.js dosyasını aç
const AUTHORIZED_UIDS = [
    "abc123xyz456def789ghi012jkl345mno678",
];

# 7. Restart
pm2 restart server

# 8. Tekrar giriş yap
# http://localhost:3000/login.html
# Sonuç: Ana panele yönlendirilme ✅
```

---

## 🎉 Başarı!

UID'ni whitelist'e eklediğinde:

1. ✅ Google ile giriş yapabileceksin
2. ✅ Ana panele erişebileceksin
3. ✅ Otomatik olarak **Admin** yetkisi alacaksın
4. ✅ Tüm sunucu kontrollerine erişebileceksin

---

## 📚 Ek Kaynaklar

- [Whitelist Kurulum Rehberi](WHITELIST_KURULUM.md)
- [Değişiklikler](DEGISIKLIKLER.md)
- [Firebase Kurulum](docs/FIREBASE_KURULUM.md)

---

**Firebase Config**: ✅ Entegre  
**Whitelist**: ⚠️ Boş (UID ekle!)  
**Durum**: Kuruluma hazır!

Şimdi UID'ni al ve whitelist'e ekle! 🚀
