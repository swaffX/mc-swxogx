# 🔑 UID Ekleme Rehberi

## Adım 1: UID'nizi Öğrenin

1. Tarayıcınızda login sayfasına gidin: `http://localhost:3000/login.html`
2. "Sign in with Google" butonuna tıklayın
3. Google hesabınızla giriş yapın
4. Otomatik olarak "Access Denied" sayfasına yönlendirileceksiniz
5. Bu sayfada **"Your UID"** bölümünde UID'niz görünecek
6. **"Copy UID"** butonuna tıklayarak UID'nizi kopyalayın

## Adım 2: Frontend Whitelist'e Ekleyin

1. `public/auth.js` dosyasını açın
2. Yaklaşık 15. satırda `AUTHORIZED_UIDS` dizisini bulun:
   ```javascript
   const AUTHORIZED_UIDS = [
       // Buraya yetkili kullanıcıların Firebase UID'lerini ekleyin
   ];
   ```
3. Kopyaladığınız UID'yi tırnak içinde ekleyin:
   ```javascript
   const AUTHORIZED_UIDS = [
       "BURAYA_KOPYALADIGINIZ_UID"
   ];
   ```

## Adım 3: Backend Whitelist'e Ekleyin

1. `middleware/auth.js` dosyasını açın
2. Yaklaşık 10. satırda `AUTHORIZED_UIDS` dizisini bulun:
   ```javascript
   const AUTHORIZED_UIDS = [
       // Buraya yetkili kullanıcıların Firebase UID'lerini ekleyin
   ];
   ```
3. **AYNI UID'yi** tırnak içinde ekleyin:
   ```javascript
   const AUTHORIZED_UIDS = [
       "BURAYA_KOPYALADIGINIZ_UID"
   ];
   ```

## Adım 4: Sunucuyu Yeniden Başlatın

```bash
pm2 restart server
```

## Adım 5: Tekrar Giriş Yapın

1. Login sayfasına gidin
2. Google ile giriş yapın
3. Artık panele erişebileceksiniz! ✅

---

## Örnek UID Formatı

UID'ler genellikle şu formatta olur:
```
abc123xyz456def789ghi012jkl345mno678
```

## Birden Fazla Kullanıcı Eklemek

Virgülle ayırarak birden fazla UID ekleyebilirsiniz:

```javascript
const AUTHORIZED_UIDS = [
    "ilk_kullanici_uid",
    "ikinci_kullanici_uid",
    "ucuncu_kullanici_uid"
];
```

## ⚠️ Önemli Notlar

- UID'ler **her zaman tırnak içinde** olmalı
- **Her iki dosyada da** aynı UID'leri eklemelisiniz
- UID'leri ekledikten sonra **mutlaka sunucuyu yeniden başlatın**
- Whitelist boşsa **kimse** panele erişemez (güvenlik özelliği)

## 🔍 Sorun Giderme

**Hala erişemiyorum:**
1. UID'yi doğru kopyaladığınızdan emin olun
2. Her iki dosyaya da eklediğinizi kontrol edin
3. Sunucuyu yeniden başlattığınızdan emin olun
4. Tarayıcı önbelleğini temizleyin (Ctrl+Shift+Delete)
5. Konsol loglarını kontrol edin: `pm2 logs server`

**UID'mi bulamıyorum:**
- Access denied sayfasında görünmüyorsa, Firebase Console'dan alabilirsiniz:
  1. Firebase Console > Authentication > Users
  2. Kullanıcınızı bulun
  3. UID sütunundaki değeri kopyalayın
