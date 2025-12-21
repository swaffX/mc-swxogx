# VPS Fix Commands - Quick Reference

## 🚨 IMMEDIATE FIX (Run This Now)

GitHub Actions deployment tamamlandıktan sonra VPS'te şunu çalıştır:

```bash
cd /opt/minecraft
bash fix-pm2-startup.sh
```

Bu komut tüm sorunu otomatik olarak çözecek.

## 📋 Adım Adım Manuel Kontrol

Eğer otomatik script çalışmazsa:

### 1. Mevcut Durumu Kontrol Et

```bash
# PM2 durumu
pm2 list

# Java process'leri (kaç tane var?)
ps aux | grep "java.*server.jar" | grep -v grep

# Port 25565 (kim kullanıyor?)
lsof -i :25565

# Systemd servisi (aktif mi?)
systemctl status pm2-root.service
```

### 2. Temizlik Yap

```bash
# PM2'yi systemd'den kaldır
pm2 unstartup systemd

# Tüm PM2 process'lerini durdur
pm2 stop all
pm2 delete all

# TÜM Java process'lerini kill et
pkill -9 -f "java.*server.jar"

# Session lock'ları temizle
cd /opt/minecraft
rm -f world/session.lock
rm -f world_nether/session.lock
rm -f world_the_end/session.lock

# PM2 daemon'ı kapat
pm2 kill
```

### 3. Yeniden Başlat

```bash
# PM2'yi systemd OLMADAN başlat
cd /opt/minecraft
pm2 start ecosystem.config.js
pm2 save
```

### 4. Doğrula

```bash
# PM2 listesi (sadece 3 process olmalı: minecraft, minecraft-api, discord-bot)
pm2 list

# Java process (sadece 1 tane olmalı)
ps aux | grep "java.*server.jar" | grep -v grep

# Port 25565 (sadece 1 process dinlemeli)
lsof -i :25565
```

## ✅ Başarılı Sonuç

Şöyle görünmeli:

```
┌────┬──────────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
│ id │ name             │ mode    │ pid     │ uptime   │ ↺      │ status│ cpu      │
├────┼──────────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 0  │ minecraft        │ fork    │ 123456  │ 2m       │ 0      │ online│ 50%      │
│ 1  │ minecraft-api    │ fork    │ 123457  │ 2m       │ 0      │ online│ 0%       │
│ 2  │ discord-bot      │ fork    │ 123458  │ 2m       │ 0      │ online│ 0%       │
└────┴──────────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘
```

## 🧪 Restart Testi

Fix sonrası restart'ı test et:

```bash
# Yöntem 1: Script ile
bash restart-minecraft.sh

# Yöntem 2: PM2 ile
pm2 restart minecraft

# Yöntem 3: Web panel
# http://194.105.5.37:3000 adresinden "Restart Server" butonuna tıkla
```

Her üç yöntem de çalışmalı!

## 🔍 Sorun Giderme

### Problem: Hala birden fazla Java process var

```bash
pkill -9 java
sleep 2
pm2 start minecraft
```

### Problem: "Address already in use" hatası

```bash
# Port'u kullanan process'i bul
lsof -i :25565

# Kill et
kill -9 <PID>

# Restart
pm2 start minecraft
```

### Problem: Session lock hatası

```bash
cd /opt/minecraft
rm -f world*/session.lock
pm2 restart minecraft
```

### Problem: PM2 komutları çalışmıyor

```bash
pm2 kill
pm2 start ecosystem.config.js
pm2 save
```

## ⚠️ ÖNEMLİ NOTLAR

1. **Artık sunucu reboot sonrası otomatik başlamayacak**
   - Reboot sonrası manuel başlatmak için: `pm2 start ecosystem.config.js`

2. **start.sh kullanma**
   - Bu dosyada auto-restart loop var
   - Sadece PM2 üzerinden başlat: `pm2 start minecraft`

3. **Web panel çalışacak**
   - Start, Stop, Restart butonları düzgün çalışmalı
   - http://194.105.5.37:3000

4. **Restart süresi**
   - Restart 30-60 saniye sürebilir
   - Sabırlı ol, logları kontrol et: `pm2 logs minecraft`

## 📊 Monitoring

Sunucuyu izlemek için:

```bash
# Canlı loglar
pm2 logs minecraft

# Sadece son 100 satır
pm2 logs minecraft --lines 100

# Sadece hatalar
pm2 logs minecraft --err

# PM2 monitoring dashboard
pm2 monit
```

## 🎯 Özet

1. GitHub Actions deployment bekle (2-3 dakika)
2. VPS'te `bash fix-pm2-startup.sh` çalıştır
3. `pm2 list` ile kontrol et (3 process olmalı)
4. Web panelden restart test et
5. Başarılı! 🎉

Herhangi bir sorun olursa bu dokümandaki manuel adımları takip et.
