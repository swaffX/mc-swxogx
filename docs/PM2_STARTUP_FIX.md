# PM2 Startup Fix - Multiple Instance Problem

## Problem

Minecraft sunucusu PM2 komutlarına rağmen çalışmaya devam ediyordu. Birden fazla Java process'i aynı anda çalışıyordu ve bu da şu sorunlara yol açıyordu:

- Port 25565 çakışması
- Session lock hataları
- `pm2 restart` ve `pm2 stop` komutları çalışmıyor
- Sunucu reboot sonrası otomatik başlıyor

## Root Cause (Kök Sebep)

1. **PM2 systemd ile entegre edilmiş**: `pm2 startup systemd` komutu çalıştırılmış ve PM2 sistem başlangıcına eklenmiş
2. **start.sh auto-restart loop**: `start.sh` dosyasında `while true; do java...; done` döngüsü var
3. **Birden fazla Java process**: Aynı anda 2-3 Java process'i çalışıyor

## Solution (Çözüm)

### Otomatik Fix (Önerilen)

VPS'te şu komutu çalıştır:

```bash
cd /opt/minecraft
bash fix-pm2-startup.sh
```

Bu script şunları yapar:
1. PM2'yi systemd'den kaldırır (`pm2 unstartup systemd`)
2. Tüm PM2 process'lerini durdurur ve siler
3. Tüm Java process'lerini kill eder
4. Session lock dosyalarını temizler
5. PM2 daemon'ı kapatır
6. PM2'yi systemd olmadan yeniden başlatır
7. Durumu doğrular

### Manuel Fix

Eğer script çalışmazsa manuel olarak:

```bash
# 1. PM2'yi systemd'den kaldır
pm2 unstartup systemd

# 2. Tüm process'leri durdur
pm2 stop all
pm2 delete all

# 3. Java process'lerini kill et
pkill -9 -f "java.*server.jar"

# 4. Session lock'ları temizle
cd /opt/minecraft
rm -f world/session.lock
rm -f world_nether/session.lock
rm -f world_the_end/session.lock

# 5. PM2 daemon'ı kapat
pm2 kill

# 6. Systemd servisini kontrol et
systemctl status pm2-root.service
# Eğer aktifse:
systemctl disable pm2-root.service
systemctl stop pm2-root.service

# 7. PM2'yi yeniden başlat (systemd olmadan)
pm2 start ecosystem.config.js
pm2 save
```

## Verification (Doğrulama)

Fix sonrası kontrol:

```bash
# PM2 durumu
pm2 list

# Java process'leri (sadece 1 tane olmalı)
ps aux | grep "java.*server.jar" | grep -v grep

# Port 25565 (sadece 1 process dinlemeli)
lsof -i :25565

# Systemd servisi (bulunamadı olmalı)
systemctl status pm2-root.service
```

## Expected Behavior (Beklenen Davranış)

✅ **Doğru Davranış:**
- `pm2 list` sadece 1 minecraft process göstermeli
- `ps aux | grep java` sadece 1 Java process göstermeli
- `pm2 restart minecraft` çalışmalı
- `pm2 stop minecraft` sunucuyu durdurmalı
- Sunucu reboot sonrası **otomatik başlamamalı**

❌ **Yanlış Davranış (Eski):**
- Birden fazla Java process
- PM2 komutları çalışmıyor
- Sunucu reboot sonrası otomatik başlıyor
- Session lock hataları

## Important Notes

⚠️ **ÖNEMLİ:**
- PM2 artık sunucu reboot sonrası **otomatik başlamayacak**
- Reboot sonrası manuel başlatmak için: `pm2 start ecosystem.config.js`
- Web panelden start/stop/restart çalışacak
- `restart-minecraft.sh` script'i çalışacak

## Configuration Files

### ecosystem.config.js
```javascript
{
  name: 'minecraft',
  autorestart: false,  // Manuel restart gerekli
  max_restarts: 3,
  min_uptime: '10s',
  restart_delay: 5000,
  kill_timeout: 5000
}
```

### start.sh
⚠️ Bu dosya **kullanılmamalı** (auto-restart loop var)
PM2 üzerinden başlatma yapılmalı: `pm2 start minecraft`

## Troubleshooting

### Problem: Hala birden fazla Java process var

```bash
# Tüm Java process'lerini zorla kill et
pkill -9 java
sleep 2
pm2 start minecraft
```

### Problem: Port 25565 kullanımda

```bash
# Port'u kullanan process'i bul ve kill et
lsof -i :25565
kill -9 <PID>
```

### Problem: Session lock hatası

```bash
# Lock dosyalarını temizle
cd /opt/minecraft
rm -f world*/session.lock
```

### Problem: PM2 restart çalışmıyor

```bash
# PM2'yi tamamen sıfırla
pm2 kill
pm2 start ecosystem.config.js
pm2 save
```

## Testing Restart Functionality

Restart fonksiyonunu test et:

```bash
# 1. Script ile restart
bash restart-minecraft.sh

# 2. PM2 ile restart
pm2 restart minecraft

# 3. Web panel restart
# Dashboard'dan "Restart Server" butonuna tıkla
```

Her üç yöntem de şunları yapmalı:
1. Sunucuyu durdur
2. Java process'i kill et
3. Session lock'ları temizle
4. 3 saniye bekle
5. Sunucuyu başlat

## Related Files

- `fix-pm2-startup.sh` - Otomatik fix script'i
- `restart-minecraft.sh` - Güvenli restart script'i
- `ecosystem.config.js` - PM2 konfigürasyonu
- `server.js` - API restart endpoint'leri
- `.github/workflows/deploy.yml` - Deployment workflow

## Deployment

GitHub Actions otomatik olarak şu dosyaları deploy eder:
- `server.js`
- `package.json`
- `public/`
- `docs/`
- `data/`
- `deploy-roles.sh`
- `restart-minecraft.sh`
- `fix-pm2-startup.sh` ✨ (yeni)

Commit ve push sonrası otomatik deploy olur.

## Summary

Bu fix PM2'nin systemd entegrasyonunu kaldırarak ve birden fazla instance'ı temizleyerek restart sorununu çözer. Artık PM2 komutları ve web panel restart düzgün çalışacak.
