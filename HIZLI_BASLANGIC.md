# ⚡ Hızlı Başlangıç - 5 Dakikada Kurulum

## 🎯 Hedef
Firebase Authentication ile güvenli Minecraft sunucu web paneli kurmak.

## 📝 Yapılacaklar Listesi

### ✅ 1. Firebase Projesi Oluştur (2 dakika)

1. [Firebase Console](https://console.firebase.google.com/) → "Add project"
2. Proje adı: `swxogx-minecraft`
3. Build > Authentication > Get started
4. Email/Password ve Google provider'ı etkinleştir

### ✅ 2. Firebase Config Al (1 dakika)

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

### ✅ 3. Service Account Key İndir (30 saniye)

1. Project Settings > Service Accounts
2. "Generate new private key" → İndir
3. Dosyayı `firebase-service-account.json` olarak root dizine kaydet

### ✅ 4. Bağımlılıkları Yükle (1 dakika)

```bash
npm install
```

### ✅ 5. Başlat ve Test Et (30 saniye)

```bash
npm start
```

Tarayıcıda aç: `http://localhost:3000/login.html`

İlk kullanıcıyı oluştur → Otomatik Admin olur! 🎉

---

## 🚀 Hemen Kullan

### Login Sayfası
```
http://localhost:3000/login.html
```

### Ana Panel
```
http://localhost:3000
```

### Admin Panel (Sadece Admin)
```
http://localhost:3000/admin.html
```

---

## 👥 Roller

| Rol | Yetkiler |
|-----|----------|
| 👑 **Admin** | Her şey (stop dahil) |
| ⚡ **Moderator** | Start, restart, komutlar |
| 👤 **User** | Sadece izleme |

---

## 🌐 Subdomain İstiyorsan

Detaylı rehber: [docs/SUBDOMAIN_KURULUM.md](docs/SUBDOMAIN_KURULUM.md)

**Hızlı özet:**
```bash
# Nginx kur
sudo apt install nginx certbot python3-certbot-nginx -y

# Config oluştur (rehberdeki içeriği kullan)
sudo nano /etc/nginx/sites-available/minecraft-panel

# Etkinleştir
sudo ln -s /etc/nginx/sites-available/minecraft-panel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL ekle
sudo certbot --nginx -d panel.swxogx.com
```

Firebase'e subdomain'i ekle: Authentication > Settings > Authorized domains

---

## 🐛 Sorun mu Var?

### Firebase Admin hatası
```bash
# firebase-service-account.json dosyasını kontrol et
ls -la firebase-service-account.json
```

### Token hatası
- `public/auth.js` dosyasındaki config'i kontrol et
- Sayfayı yenile (Ctrl+Shift+R)

### Port kullanımda
```bash
PORT=3001 npm start
```

---

## 📚 Detaylı Rehberler

- 📖 [Tam Kurulum Rehberi](KURULUM_ADIMLAR.md)
- 🔥 [Firebase Kurulum](docs/FIREBASE_KURULUM.md)
- 🌐 [Subdomain Kurulum](docs/SUBDOMAIN_KURULUM.md)
- 🔐 [Authentication Dokümantasyonu](README_AUTH.md)

---

## ✨ Özellikler

- ✅ Firebase Authentication (Email + Google)
- ✅ Rol bazlı yetkilendirme
- ✅ JWT token doğrulama
- ✅ Modern glassmorphism UI
- ✅ Responsive tasarım
- ✅ Admin panel
- ✅ Subdomain desteği
- ✅ SSL/HTTPS hazır

---

**Hazır mısın? Hadi başlayalım! 🚀**

```bash
npm install && npm start
```

Sonra: `http://localhost:3000/login.html` 🎮
