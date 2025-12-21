# 🚀 SWXOGX Minecraft Server - Kurulum Adımları

Bu dosya, projeyi sıfırdan kurmanız için gereken tüm adımları içerir.

## 📋 Ön Gereksinimler

- ✅ Node.js (v16 veya üzeri)
- ✅ npm veya yarn
- ✅ Firebase hesabı (ücretsiz)
- ✅ VPS/Sunucu (opsiyonel, subdomain için)

---

## 🔥 Adım 1: Firebase Kurulumu

### 1.1 Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/) adresine git
2. "Add project" butonuna tıkla
3. Proje adı gir: `swxogx-minecraft`
4. Google Analytics'i istersen etkinleştir
5. "Create project" butonuna tıkla

### 1.2 Authentication'ı Etkinleştir

1. Sol menüden **Build > Authentication** seç
2. "Get started" butonuna tıkla
3. **Sign-in method** sekmesine git
4. **Email/Password** provider'ı etkinleştir
5. **Google** provider'ı etkinleştir (proje desteği e-postası gir)

### 1.3 Web App Config Al

1. Project Settings (⚙️) > Your apps bölümüne git
2. Web ikonuna (</>)  tıkla
3. App nickname gir: `Web Panel`
4. "Register app" butonuna tıkla
5. Firebase SDK configuration'ı kopyala:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. `public/auth.js` dosyasını aç
7. `firebaseConfig` objesini yukarıdaki değerlerle değiştir

### 1.4 Service Account Key İndir

1. Project Settings > **Service Accounts** sekmesine git
2. "Generate new private key" butonuna tıkla
3. İndirilen JSON dosyasını projenin root dizinine `firebase-service-account.json` adıyla kaydet

⚠️ **ÖNEMLİ**: Bu dosya `.gitignore`'da olduğu için GitHub'a yüklenmeyecek!

---

## 📦 Adım 2: Proje Kurulumu

### 2.1 Bağımlılıkları Yükle

```bash
npm install
```

Bu komut şunları yükler:
- express
- cors
- firebase-admin
- diğer bağımlılıklar

### 2.2 Dosya Yapısını Kontrol Et

```
.
├── public/
│   ├── login.html          ✅ Oluşturuldu
│   ├── login.css           ✅ Oluşturuldu
│   ├── auth.js             ✅ Oluşturuldu (Firebase config ekle!)
│   ├── admin.html          ✅ Oluşturuldu
│   ├── index.html          ✅ Mevcut
│   └── app.js              ✅ Güncellendi
├── middleware/
│   └── auth.js             ✅ Oluşturuldu
├── docs/
│   ├── FIREBASE_KURULUM.md ✅ Oluşturuldu
│   └── SUBDOMAIN_KURULUM.md ✅ Oluşturuldu
├── server.js               ✅ Güncellendi
├── package.json            ✅ Güncellendi
└── firebase-service-account.json ⚠️ İNDİRMEN GEREK!
```

---

## 🎯 Adım 3: İlk Çalıştırma

### 3.1 Sunucuyu Başlat

```bash
npm start
```

Çıktı:
```
✅ Firebase Admin initialized
✅ Loaded 0 user roles
🚀 Minecraft Server Manager API running on port 3000
📊 Dashboard: http://localhost:3000
```

### 3.2 Login Sayfasına Git

Tarayıcıda aç: `http://localhost:3000/login.html`

### 3.3 İlk Kullanıcıyı Oluştur

1. "Kayıt Ol" sekmesine geç
2. Bilgileri doldur:
   - Kullanıcı Adı: `admin`
   - E-posta: `admin@swxogx.com`
   - Şifre: `admin123` (en az 6 karakter)
   - Şifre Tekrar: `admin123`
3. "Kayıt Ol" butonuna tıkla

✨ **İlk kullanıcı otomatik olarak Admin yetkisi alır!**

### 3.4 Ana Panele Giriş

Başarılı kayıt sonrası otomatik olarak ana panele yönlendirileceksin.

Sağ üstte göreceksin:
```
👤 admin • Admin 👑 🚪
```

---

## 👥 Adım 4: Kullanıcı Yönetimi

### 4.1 Admin Paneline Git

1. Sağ üstteki 👑 ikonuna tıkla
2. Veya direkt `http://localhost:3000/admin.html` adresine git

### 4.2 Yeni Kullanıcı Ekle

1. Başka bir tarayıcı/incognito modda `http://localhost:3000/login.html` aç
2. Yeni kullanıcı kaydet (örn: `moderator@swxogx.com`)
3. Admin panelinde bu kullanıcı görünecek

### 4.3 Rol Değiştir

1. Admin panelinde kullanıcı listesini gör
2. Dropdown'dan rolü seç (Admin/Moderator/User)
3. Otomatik olarak kaydedilir

---

## 🌐 Adım 5: Subdomain Kurulumu (Opsiyonel)

Eğer VPS IP'si yerine `https://panel.swxogx.com` gibi bir subdomain kullanmak istiyorsan:

### 5.1 Detaylı Rehberi Oku

[docs/SUBDOMAIN_KURULUM.md](docs/SUBDOMAIN_KURULUM.md) dosyasını oku.

### 5.2 Hızlı Özet (Nginx)

```bash
# Nginx kur
sudo apt install nginx -y

# DNS ayarla (domain sağlayıcında)
# A Record: panel -> VPS_IP

# Nginx config oluştur
sudo nano /etc/nginx/sites-available/minecraft-panel

# Config içeriği (docs/SUBDOMAIN_KURULUM.md'de)
# ...

# Etkinleştir
sudo ln -s /etc/nginx/sites-available/minecraft-panel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL ekle
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d panel.swxogx.com
```

### 5.3 Firebase'e Subdomain Ekle

1. Firebase Console > Authentication > Settings
2. **Authorized domains** bölümüne git
3. `panel.swxogx.com` ekle

---

## ✅ Adım 6: Test Etme

### 6.1 Authentication Testi

- [ ] Login sayfası açılıyor
- [ ] Email/Password ile kayıt olunuyor
- [ ] Google ile giriş yapılıyor
- [ ] Ana panele yönlendiriliyor
- [ ] Kullanıcı bilgisi görünüyor
- [ ] Çıkış yapılıyor

### 6.2 Yetkilendirme Testi

**Admin kullanıcı ile:**
- [ ] Sunucu başlatılabiliyor
- [ ] Sunucu durduruluyor
- [ ] Restart yapılıyor
- [ ] Konsol komutu çalışıyor
- [ ] Admin paneline erişiliyor

**Moderator kullanıcı ile:**
- [ ] Sunucu başlatılabiliyor
- [ ] Restart yapılıyor
- [ ] Konsol komutu çalışıyor
- [ ] Stop butonu görünmüyor
- [ ] Admin paneline erişilemiyor

**User kullanıcı ile:**
- [ ] Sadece izleme yapılabiliyor
- [ ] Butonlar görünmüyor
- [ ] Konsol devre dışı

### 6.3 Subdomain Testi (Eğer kurduysan)

- [ ] `https://panel.swxogx.com` açılıyor
- [ ] SSL sertifikası geçerli (yeşil kilit)
- [ ] Login çalışıyor
- [ ] Ana panel çalışıyor

---

## 🐛 Sorun Giderme

### "Firebase Admin not initialized"

**Sebep**: `firebase-service-account.json` dosyası bulunamadı

**Çözüm**:
```bash
# Dosyanın varlığını kontrol et
ls -la firebase-service-account.json

# Yoksa Firebase Console'dan indir
# Project Settings > Service Accounts > Generate new private key
```

### "Token verification failed"

**Sebep**: `public/auth.js` dosyasındaki Firebase config yanlış

**Çözüm**:
1. Firebase Console > Project Settings > Your apps
2. Config'i kopyala
3. `public/auth.js` dosyasına yapıştır
4. Sayfayı yenile (Ctrl+Shift+R)

### "Port 3000 kullanımda"

**Sebep**: Başka bir uygulama 3000 portunu kullanıyor

**Çözüm**:
```bash
# Portu kullanan uygulamayı bul
lsof -i :3000

# Veya farklı port kullan
PORT=3001 npm start
```

### Login sayfası sonsuz yükleniyor

**Sebep**: Firebase SDK yüklenemedi veya config hatalı

**Çözüm**:
1. Tarayıcı Console'u aç (F12)
2. Hata mesajlarını kontrol et
3. Network sekmesinde Firebase SDK'nın yüklendiğini kontrol et
4. `firebaseConfig` değerlerini kontrol et

---

## 📚 Ek Kaynaklar

- [Firebase Kurulum Rehberi](docs/FIREBASE_KURULUM.md)
- [Subdomain Kurulum Rehberi](docs/SUBDOMAIN_KURULUM.md)
- [Authentication Sistemi Dokümantasyonu](README_AUTH.md)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)

---

## 🎉 Tamamlandı!

Artık güvenli bir authentication sistemi ile Minecraft sunucunuzu yönetebilirsiniz!

**Sonraki adımlar:**
1. ✅ Kullanıcıları ekle ve rollerini ayarla
2. ✅ Subdomain kur (opsiyonel)
3. ✅ SSL sertifikası ekle
4. ✅ Firewall kurallarını ayarla
5. ✅ Backup sistemi kur

**Sorularınız için:**
- GitHub Issues
- Discord sunucusu
- E-posta: admin@swxogx.com

---

**Geliştirici**: SWXOGX Team  
**Versiyon**: 2.0.0  
**Son Güncelleme**: 2024
