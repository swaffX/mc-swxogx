# 🔐 SWXOGX Minecraft Server - Authentication Sistemi

Firebase Authentication entegrasyonu ile güvenli web panel yönetimi.

## ✨ Özellikler

- 🔐 **Firebase Authentication**: Email/Password ve Google Sign-In
- 👥 **Rol Bazlı Yetkilendirme**: Admin, Moderator, User
- 🛡️ **JWT Token Doğrulama**: Her istekte güvenlik kontrolü
- 🎨 **Modern UI**: Glassmorphism tasarım
- 📱 **Responsive**: Mobil uyumlu
- 🌐 **Subdomain Desteği**: Nginx/Apache reverse proxy

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Firebase Kurulumu

Detaylı kurulum için: [docs/FIREBASE_KURULUM.md](docs/FIREBASE_KURULUM.md)

**Kısa özet:**
1. Firebase Console'da proje oluştur
2. Authentication'ı etkinleştir (Email/Password + Google)
3. Web app config'i `public/auth.js` dosyasına ekle
4. Service account key'i indir ve `firebase-service-account.json` olarak kaydet

### 3. Sunucuyu Başlat

```bash
npm start
```

### 4. İlk Kullanıcıyı Oluştur

1. `http://localhost:3000/login.html` adresine git
2. "Kayıt Ol" sekmesinden kayıt ol
3. **İlk kullanıcı otomatik olarak Admin olur!**

## 👥 Kullanıcı Rolleri

| Rol | Yetkiler | İkon |
|-----|----------|------|
| **Admin** | Tüm yetkiler (sunucu durdurma dahil) | 👑 |
| **Moderator** | Sunucu başlatma, restart, komut çalıştırma | ⚡ |
| **User** | Sadece izleme (read-only) | 👤 |

## 🎯 API Endpoints

### Authentication

```bash
# Kullanıcı kaydı
POST /api/auth/register
Headers: Authorization: Bearer <token>
Body: { "username": "...", "email": "..." }

# Rol sorgulama
GET /api/auth/role
Headers: Authorization: Bearer <token>

# Rol güncelleme (Admin only)
POST /api/auth/set-role
Headers: Authorization: Bearer <token>
Body: { "email": "...", "role": "admin|moderator|user" }

# Kullanıcı listesi (Admin only)
GET /api/auth/users
Headers: Authorization: Bearer <token>
```

### Sunucu Yönetimi (Protected)

```bash
# Sunucu başlat (Moderator+)
POST /api/start
Headers: Authorization: Bearer <token>

# Sunucu restart (Moderator+)
POST /api/restart
Headers: Authorization: Bearer <token>

# Sunucu durdur (Admin only)
POST /api/stop
Headers: Authorization: Bearer <token>

# Konsol komutu (Moderator+)
POST /api/command
Headers: Authorization: Bearer <token>
Body: { "command": "say Hello" }
```

## 🌐 Subdomain Kurulumu

Detaylı kurulum için: [docs/SUBDOMAIN_KURULUM.md](docs/SUBDOMAIN_KURULUM.md)

**3 yöntem:**
1. **Nginx Reverse Proxy** (Önerilen)
2. **Apache Reverse Proxy**
3. **Cloudflare Tunnel** (Port açmadan)

## 📁 Dosya Yapısı

```
.
├── public/
│   ├── login.html          # Login/Register sayfası
│   ├── login.css           # Login sayfası stilleri
│   ├── auth.js             # Firebase client SDK
│   ├── admin.html          # Admin panel (kullanıcı yönetimi)
│   ├── index.html          # Ana panel
│   └── app.js              # Ana panel JS (auth entegre)
├── middleware/
│   └── auth.js             # JWT doğrulama middleware
├── data/
│   └── user-roles.json     # Kullanıcı rolleri (otomatik oluşur)
├── docs/
│   ├── FIREBASE_KURULUM.md # Firebase kurulum rehberi
│   └── SUBDOMAIN_KURULUM.md # Subdomain kurulum rehberi
├── server.js               # Express server (auth endpoints)
└── firebase-service-account.json # Firebase admin key (gitignore'da)
```

## 🔒 Güvenlik

- ✅ Token doğrulama her istekte
- ✅ Rol bazlı yetkilendirme
- ✅ Tehlikeli komutlar engellenir
- ✅ Firebase service account güvenli saklanır
- ✅ CORS yapılandırması
- ✅ HTTPS desteği (subdomain ile)

## 🎨 Ekran Görüntüleri

### Login Sayfası
- Modern glassmorphism tasarım
- Email/Password ve Google Sign-In
- Şifre sıfırlama

### Ana Panel
- Kullanıcı bilgisi ve rol badge'i
- Rol bazlı buton görünürlüğü
- Çıkış yapma butonu

### Admin Panel
- Kullanıcı listesi
- Rol değiştirme
- Gerçek zamanlı güncelleme

## 🐛 Sorun Giderme

### "Firebase Admin not initialized"
- `firebase-service-account.json` dosyasının root dizinde olduğundan emin olun

### "Token verification failed"
- `public/auth.js` dosyasındaki Firebase config'i kontrol edin
- Token'ın süresi dolmuş olabilir, tekrar giriş yapın

### "Bu işlem için yetkiniz yok"
- Kullanıcı rolünüzü kontrol edin: `localStorage.getItem('userRole')`
- Admin panelden rolünüzü güncelleyin

### Login sayfası sonsuz yükleniyor
- Firebase SDK'nın yüklendiğini kontrol edin (Network sekmesi)
- `firebaseConfig` değerlerinin doğru olduğunu kontrol edin

## 📚 Ek Kaynaklar

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Express.js Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Katkıda Bulunma

Bu proje GitHub'da collaboration olarak geliştirilmektedir. Katkıda bulunmak için:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🎉 Teşekkürler

- Firebase ekibine authentication altyapısı için
- Minecraft topluluğuna ilham için
- Tüm katkıda bulunanlara

---

**Geliştirici**: SWXOGX Team  
**Versiyon**: 2.0.0 (Authentication Update)  
**Son Güncelleme**: 2024
