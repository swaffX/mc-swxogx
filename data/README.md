# 📁 Data Klasörü

Bu klasör, web panelinin kalıcı verilerini saklar.

## Dosyalar

### `player-roles.json`
Oyuncu rol atamalarını saklar.

**Yapı:**
```json
{
  "PlayerName": {
    "roleId": "vip",
    "roleName": "VIP",
    "assignedAt": "2024-12-21T10:30:00.000Z"
  }
}
```

**Özellikler:**
- ✅ Otomatik oluşturulur (ilk rol atamasında)
- ✅ Sunucu yeniden başlatılsa bile korunur
- ✅ .gitignore'da (güvenlik için)
- ✅ Backend tarafından yönetilir

### `user-roles.json`
Web panel kullanıcı rollerini saklar (admin, moderator, user).

**Yapı:**
```json
{
  "user@example.com": "admin",
  "mod@example.com": "moderator"
}
```

## Güvenlik

⚠️ **ÖNEMLİ:** Bu klasördeki dosyalar hassas veri içerir!

- ❌ Git'e commit edilmez (.gitignore)
- ✅ Sadece backend erişebilir
- ✅ Firebase token doğrulaması gerekli
- ✅ Rol bazlı yetkilendirme aktif

## Yedekleme

Düzenli olarak yedekleme yapın:

```bash
# Manuel yedekleme
cp data/player-roles.json data/player-roles.backup.json

# Otomatik yedekleme (cron)
0 0 * * * cp /opt/minecraft/data/player-roles.json /opt/minecraft/backups/player-roles-$(date +\%Y\%m\%d).json
```

## Sorun Giderme

### Dosya bulunamadı hatası

```bash
# Klasörü oluştur
mkdir -p data

# İzinleri düzelt
chmod 755 data
```

### JSON parse hatası

```bash
# Dosyayı kontrol et
cat data/player-roles.json

# Geçersizse sıfırla
echo "{}" > data/player-roles.json
```

## İlgili Dokümantasyon

- **Rol Sistemi:** `../docs/ROL_SISTEMI.md`
- **Test Rehberi:** `../docs/ROL_TEST.md`
- **API Dokümantasyonu:** `../docs/REAL_TIME_ROL_TAMAMLANDI.md`

---

**Not:** Bu klasör otomatik olarak yönetilir. Manuel düzenleme önerilmez!
