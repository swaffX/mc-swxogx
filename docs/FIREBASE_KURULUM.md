# 🔥 Firebase Authentication Kurulum Rehberi

Bu rehber, Minecraft sunucu web panelinize Firebase Authentication entegrasyonunu adım adım anlatır.

## 📋 Gereksinimler

- Firebase hesabı (ücretsiz)
- Node.js ve npm yüklü
- Aktif internet bağlantısı

## 🚀 Adım 1: Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" (Proje ekle) butonuna tıklayın
3. Proje adı girin (örn: `swxogx-minecraft`)
4. Google Analytics'i istediğiniz gibi yapılandırın (opsiyonel)
5. "Create project" butonuna tıklayın

## 🔐 Adım 2: Authentication'ı Etkinleştirme

1. Sol menüden **Build > Authentication** seçin
2. "Get started" butonuna tıklayın
3. **Sign-in method** sekmesine gidin
4. Aşağıdaki yöntemleri etkinleştirin:
   - ✅ **Email/Password**: Enable butonuna tıklayın ve kaydedin
   - ✅ **Google**: Enable butonuna tıklayın, proje desteği e-postası girin ve kaydedin

## 🔑 Adım 3: Web App Yapılandırması

1. Firebase Console'da proje ayarlarına gidin (⚙️ Settings > Project settings)
2. "Your apps" bölümünde **Web** ikonuna (</>)  tıklayın
3. App nickname girin (örn: `Web Panel`)
4. "Register app" butonuna tıklayın
5. Firebase SDK configuration'ı kopyalayın:

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

6. Bu bilgileri `public/auth.js` dosyasındaki `firebaseConfig` objesine yapıştırın

## 🔐 Adım 4: Service Account Key (Backend için)

1. Firebase Console'da **Project Settings > Service Accounts** sekmesine gidin
2. "Generate new private key" butonuna tıklayın
3. İndirilen JSON dosyasını projenizin root dizinine `firebase-service-account.json` adıyla kaydedin

⚠️ **ÖNEMLİ**: Bu dosyayı asla GitHub'a yüklemeyin! `.gitignore` dosyasına eklenmiştir.

## 📦 Adım 5: Bağımlılıkları Yükleme

```bash
npm install
```

Bu komut `firebase-admin` paketini ve diğer bağımlılıkları yükleyecektir.

## 🎯 Adım 6: İlk Admin Kullanıcısı Oluşturma

1. Sunucuyu başlatın:
```bash
npm start
```

2. Tarayıcıda `http://localhost:3000/login.html` adresine gidin
3. "Kayıt Ol" sekmesine geçin
4. İlk kullanıcı olarak kaydolun

✨ **İlk kayıt olan kullanıcı otomatik olarak Admin yetkisi alır!**

## 👥 Kullanıcı Rolleri

Sistemde 3 rol vardır:

- **Admin** (🔴): Tüm yetkilere sahip (sunucu durdurma dahil)
- **Moderator** (🟡): Sunucu başlatma, restart, komut çalıştırma
- **User** (🟢): Sadece izleme yetkisi

### Rol Değiştirme

Admin kullanıcılar API üzerinden rol değiştirebilir:

```bash
# Örnek: Bir kullanıcıyı moderator yap
curl -X POST http://localhost:3000/api/auth/set-role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "role": "moderator"}'
```

Veya `data/user-roles.json` dosyasını manuel olarak düzenleyin:

```json
{
  "admin@example.com": "admin",
  "mod@example.com": "moderator",
  "user@example.com": "user"
}
```

## 🌐 Adım 7: Authorized Domains (Subdomain için)

Subdomain kullanacaksanız Firebase'e eklemeniz gerekir:

1. Firebase Console > **Authentication > Settings**
2. **Authorized domains** bölümüne gidin
3. "Add domain" butonuna tıklayın
4. Subdomain'inizi ekleyin (örn: `panel.swxogx.com`)

## 🔒 Güvenlik Kuralları

### Firebase Authentication Ayarları

1. **Email enumeration protection**: Etkinleştirin (Settings > Advanced)
2. **Password policy**: Minimum 6 karakter (varsayılan)

### Backend Güvenlik

- ✅ Token doğrulama her istekte yapılır
- ✅ Rol bazlı yetkilendirme aktif
- ✅ Tehlikeli komutlar engellenir
- ✅ CORS yapılandırması mevcut

## 🧪 Test Etme

1. Login sayfasına gidin: `http://localhost:3000/login.html`
2. Yeni bir hesap oluşturun
3. Ana panele yönlendirilmelisiniz
4. Sağ üstte kullanıcı adınız ve rolünüz görünmelidir

## 🐛 Sorun Giderme

### "Firebase Admin not initialized" hatası
- `firebase-service-account.json` dosyasının root dizinde olduğundan emin olun
- Dosya içeriğinin geçerli JSON formatında olduğunu kontrol edin

### "Token verification failed" hatası
- `public/auth.js` dosyasındaki Firebase config'in doğru olduğundan emin olun
- Tarayıcı console'unda hata mesajlarını kontrol edin

### Login sayfası sonsuz yükleniyor
- Firebase SDK'nın yüklendiğinden emin olun (Network sekmesinde kontrol edin)
- `firebaseConfig` değerlerinin doğru olduğunu kontrol edin

### Google Sign-In çalışmıyor
- Firebase Console'da Google provider'ın etkinleştirildiğinden emin olun
- Authorized domains listesinde domain'inizin olduğunu kontrol edin

## 📚 Ek Kaynaklar

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## 🎉 Tamamlandı!

Artık güvenli bir authentication sisteminiz var! Kullanıcılar kayıt olabilir, giriş yapabilir ve rollerine göre sunucuyu yönetebilir.
