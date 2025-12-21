# ⚠️ ÖNEMLİ NOTLAR - Mutlaka Oku!

## 🔴 Kritik: Firebase Credentials

### ❌ ASLA YAPMA
```bash
# Bu dosyayı GitHub'a YÜKLEME!
firebase-service-account.json
```

Bu dosya `.gitignore`'da olduğu için otomatik olarak yüklenmeyecek, ama yine de dikkat et!

### ✅ Doğru Kullanım
1. Firebase Console'dan indir
2. Projenin root dizinine kaydet
3. Dosya adı tam olarak: `firebase-service-account.json`
4. Git status kontrol et: `git status` (görünmemeli)

---

## 🔐 İlk Kullanıcı = Admin

**ÖNEMLİ**: İlk kayıt olan kullanıcı otomatik olarak **Admin** yetkisi alır!

### Güvenlik İçin:
1. Sunucuyu ilk başlattığında hemen kayıt ol
2. Güçlü bir şifre kullan
3. Diğer kullanıcıları sonra ekle

### Eğer Yanlış Kişi Admin Olduysa:
```bash
# data/user-roles.json dosyasını düzenle
{
  "dogru-admin@email.com": "admin",
  "yanlis-admin@email.com": "user"
}

# Sunucuyu restart et
pm2 restart server
```

---

## 🌐 Subdomain Kurulumu

### DNS Ayarları
DNS değişikliklerinin yayılması **5-30 dakika** sürebilir. Sabırlı ol!

```bash
# DNS yayılımını kontrol et
nslookup panel.swxogx.com
ping panel.swxogx.com
```

### Firebase Authorized Domains
Subdomain kullanacaksan **mutlaka** Firebase'e ekle:
1. Firebase Console > Authentication > Settings
2. Authorized domains > Add domain
3. `panel.swxogx.com` ekle

Yoksa login çalışmaz! ❌

---

## 🔒 Port Güvenliği

### Subdomain Kullanıyorsan
```bash
# Port 3000'i dışarıdan erişime KAPAT
sudo ufw deny 3000/tcp
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

Böylece sadece Nginx üzerinden (subdomain ile) erişilebilir.

### Subdomain Kullanmıyorsan
```bash
# Port 3000'i aç
sudo ufw allow 3000/tcp
```

---

## 📝 Kullanıcı Rolleri Dosyası

### Konum
```
data/user-roles.json
```

### Format
```json
{
  "admin@example.com": "admin",
  "mod@example.com": "moderator",
  "user@example.com": "user"
}
```

### Manuel Düzenleme
1. Dosyayı düzenle
2. Sunucuyu restart et: `pm2 restart server`
3. Kullanıcı tekrar giriş yapsın

---

## 🔄 Güncelleme Sonrası

### VPS'te Güncelleme
```bash
cd /opt/minecraft
git pull origin main

# YENİ BAĞIMLILIKLARI YÜKLE!
npm install

# Restart
pm2 restart all
```

`npm install` yapmayı unutma! Firebase Admin SDK yeni eklendi.

---

## 🐛 Sık Karşılaşılan Hatalar

### "Firebase Admin not initialized"
**Sebep**: `firebase-service-account.json` bulunamadı

**Çözüm**:
```bash
ls -la firebase-service-account.json
# Dosya yoksa Firebase Console'dan indir
```

### "Token verification failed"
**Sebep**: `public/auth.js` dosyasındaki config yanlış

**Çözüm**:
1. Firebase Console > Project Settings > Your apps
2. Config'i kopyala
3. `public/auth.js` dosyasına yapıştır
4. Hard refresh: Ctrl+Shift+R

### "Port 3000 kullanımda"
**Sebep**: Başka bir uygulama portu kullanıyor

**Çözüm**:
```bash
# Portu kullanan uygulamayı bul
lsof -i :3000

# Veya farklı port kullan
PORT=3001 npm start
```

### Login sayfası sonsuz yükleniyor
**Sebep**: Firebase SDK yüklenemedi

**Çözüm**:
1. F12 > Console > Hataları kontrol et
2. F12 > Network > Firebase SDK'nın yüklendiğini kontrol et
3. `firebaseConfig` değerlerini kontrol et

### Google Sign-In çalışmıyor
**Sebep**: Authorized domains eksik

**Çözüm**:
1. Firebase Console > Authentication > Settings
2. Authorized domains > Domain'i ekle
3. Sayfayı yenile

---

## 📊 Performans

### Token Caching
Token'lar localStorage'da saklanır. Kullanıcı her istekte token gönderir.

### Token Süresi
Firebase token'ları **1 saat** geçerlidir. Sonra otomatik yenilenir.

### Oturum Yönetimi
Kullanıcı çıkış yapmadıkça oturum açık kalır (localStorage temizlenene kadar).

---

## 🔐 Güvenlik Best Practices

### 1. Güçlü Şifreler
- En az 8 karakter
- Büyük/küçük harf
- Sayı ve özel karakter

### 2. Admin Sayısını Sınırla
- Sadece güvendiğin kişilere admin ver
- Çoğu kullanıcı için "moderator" yeterli

### 3. HTTPS Kullan
- Subdomain + SSL sertifikası
- Let's Encrypt ücretsiz

### 4. Firewall Kuralları
```bash
# Sadece gerekli portları aç
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 25565/tcp   # Minecraft
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw deny 3000/tcp     # Node.js (Nginx arkasında)
sudo ufw enable
```

### 5. Düzenli Güncelleme
```bash
# Bağımlılıkları güncelle
npm update

# Güvenlik açıklarını kontrol et
npm audit
npm audit fix
```

---

## 📱 Mobil Kullanım

Web panel responsive tasarıma sahip. Mobil cihazlardan da kullanılabilir:
- Login/Register
- Sunucu durumu izleme
- Oyuncu listesi
- Konsol komutları (Moderator+)

---

## 🎯 Önerilen Workflow

### Yeni Kullanıcı Ekleme
1. Kullanıcı `login.html`'den kayıt olur
2. Admin `admin.html`'den rolünü ayarlar
3. Kullanıcı sayfayı yeniler (veya tekrar giriş yapar)
4. Yeni yetkileri aktif olur

### Sunucu Yönetimi
1. **User**: Sadece izler
2. **Moderator**: Günlük işlemler (start, restart, komutlar)
3. **Admin**: Kritik işlemler (stop, kullanıcı yönetimi)

---

## 📞 Destek

### Sorun mu Yaşıyorsun?

1. **Dokümantasyonu kontrol et**:
   - [HIZLI_BASLANGIC.md](HIZLI_BASLANGIC.md)
   - [KURULUM_ADIMLAR.md](KURULUM_ADIMLAR.md)
   - [docs/FIREBASE_KURULUM.md](docs/FIREBASE_KURULUM.md)

2. **Logları kontrol et**:
   ```bash
   pm2 logs server
   ```

3. **GitHub Issues**:
   - Hata raporu aç
   - Detaylı açıklama yaz
   - Log çıktılarını ekle

---

## ✅ Checklist: Kurulum Tamamlandı mı?

- [ ] Firebase projesi oluşturuldu
- [ ] Authentication etkinleştirildi
- [ ] Web app config eklendi (`public/auth.js`)
- [ ] Service account key indirildi (`firebase-service-account.json`)
- [ ] `npm install` çalıştırıldı
- [ ] Sunucu başlatıldı (`npm start`)
- [ ] İlk kullanıcı oluşturuldu (admin)
- [ ] Login çalışıyor
- [ ] Ana panel açılıyor
- [ ] Kullanıcı bilgisi görünüyor
- [ ] Rol yetkileri çalışıyor
- [ ] (Opsiyonel) Subdomain kuruldu
- [ ] (Opsiyonel) SSL sertifikası eklendi
- [ ] (Opsiyonel) Firebase'e subdomain eklendi

Hepsi ✅ ise tebrikler! Sistem hazır! 🎉

---

**Son Güncelleme**: 2024  
**Versiyon**: 2.0.0  
**Geliştirici**: SWXOGX Team
