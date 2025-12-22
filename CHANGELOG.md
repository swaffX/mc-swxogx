# Changelog

## [1.1.0] - 2025-12-22

### 🔒 Güvenlik İyileştirmeleri
- **Environment Variables**: Hassas bilgiler (RCON şifresi, Discord token) artık `.env` dosyasından okunuyor
- **Rate Limiting**: API endpoint'lerine rate limiting eklendi (15 dakikada 100 istek)
- **Helmet.js**: HTTP güvenlik header'ları eklendi (CSP, XSS koruması vb.)
- **Auth Rate Limiting**: Giriş endpoint'lerine daha sıkı limit (15 dakikada 20 deneme)

### 🚀 Yeni Özellikler

#### Web Panel
- `/api/backups` - Backup listesi görüntüleme
- `/api/backups/create` - Manuel backup oluşturma
- `/api/backups/:filename` - Backup silme
- `/api/monitoring/system` - Detaylı sistem bilgisi
- `/api/monitoring/tps-history` - TPS geçmişi (1 saat)
- `/api/monitoring/player-stats` - Oyuncu istatistikleri
- `/api/health` - Health check endpoint

#### Discord Bot
- `/backup create` - Manuel backup oluşturma
- `/backup list` - Backup listesi görüntüleme
- `/restart` - Sunucu yeniden başlatma (yönetici)
- `/stats` - Sunucu/oyuncu istatistikleri
- Global error handling eklendi

#### TimeHUD Plugin (v1.1.0)
- Config dosyası desteği (`config.yml`)
- `/timehud reload` komutu
- `/timehud help` komutu
- Tab completion desteği
- Özelleştirilebilir mesajlar ve renkler

#### Backup Sistemi
- Discord webhook bildirimleri
- Yapılandırılabilir retention süresi
- Otomatik backup kurulum script'i (`setup-auto-backup.sh`)
- Hata durumunda bildirim

### 🧹 Temizlik & İyileştirmeler
- Duplicate `/api/restart` endpoint'i kaldırıldı (legacy endpoint yönlendirme yapıyor)
- `VPS-KOMUTLARI.md` → `docs/VPS_KOMUTLARI.md` taşındı
- Discord bot config'inden RCON şifresi kaldırıldı
- Boş `web/` klasörü temizlendi
- Kullanılmayan değişkenler temizlendi

### 📁 Yeni Dosyalar
- `.env.example` - Environment variables şablonu
- `CHANGELOG.md` - Değişiklik günlüğü
- `scripts/setup-auto-backup.sh` - Otomatik backup kurulumu
- `TimeHUD/src/main/resources/config.yml` - Plugin yapılandırması
- `TimeHUD/src/main/java/.../TimeHUDCommand.java` - Geliştirilmiş komut handler

### 📦 Yeni Bağımlılıklar
- `dotenv` - Environment variables
- `express-rate-limit` - Rate limiting
- `helmet` - HTTP güvenlik

### ⚠️ Breaking Changes
- RCON şifresi artık `discord-bot/config.json`'da değil, `.env` dosyasında
- VPS'te `.env` dosyası oluşturulmalı

### 📝 Kurulum Notları
```bash
# 1. .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle ve değerleri gir

# 2. Bağımlılıkları yükle
npm install
cd discord-bot && npm install && cd ..

# 3. TimeHUD plugin'i yeniden derle
cd TimeHUD && mvn clean package && cd ..

# 4. Servisleri yeniden başlat
pm2 restart all
```
