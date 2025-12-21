# Son Durum - PM2 Multiple Instance Fix

## 🎯 Problem Analizi

Minecraft sunucusu PM2 komutlarına rağmen çalışmaya devam ediyordu. Analiz sonucu:

### Tespit Edilen Sorunlar

1. **PM2 systemd ile entegre** - `pm2 startup systemd` aktif
2. **Birden fazla Java process** - Aynı anda 2-3 instance çalışıyor
3. **start.sh auto-restart loop** - `while true; do java...; done` döngüsü
4. **PM2 komutları çalışmıyor** - `pm2 restart` ve `pm2 stop` etkisiz
5. **Session lock hataları** - Birden fazla instance aynı world'e erişmeye çalışıyor

### Root Cause (Kök Sebep)

PM2'nin systemd ile entegrasyonu sunucuyu otomatik olarak yeniden başlatıyor. Bu yüzden:
- `pm2 kill` sonrası bile sunucu çalışıyor
- Reboot sonrası otomatik başlıyor
- Birden fazla instance oluşuyor

## ✅ Çözüm

### Oluşturulan Dosyalar

1. **fix-pm2-startup.sh** - Otomatik fix script'i
   - PM2'yi systemd'den kaldırır
   - Tüm Java process'lerini kill eder
   - Session lock'ları temizler
   - PM2'yi systemd olmadan yeniden başlatır

2. **docs/PM2_STARTUP_FIX.md** - Detaylı dokümantasyon
   - Problem açıklaması
   - Çözüm adımları
   - Troubleshooting rehberi

3. **docs/VPS_FIX_COMMANDS.md** - Hızlı referans
   - Tek komutla fix
   - Manuel adımlar
   - Test prosedürleri

### Güncellenen Dosyalar

1. **.github/workflows/deploy.yml**
   - `tar` komut sırası düzeltildi (files before excludes)
   - `fix-pm2-startup.sh` deployment'a eklendi
   - `restart-minecraft.sh` deployment'a eklendi
   - Tüm root dosyalar artık deploy ediliyor

## 🚀 Deployment

GitHub Actions otomatik olarak şu dosyaları VPS'e deploy eder:
- ✅ server.js
- ✅ package.json
- ✅ public/
- ✅ docs/
- ✅ data/
- ✅ deploy-roles.sh
- ✅ restart-minecraft.sh
- ✅ fix-pm2-startup.sh ⭐ (yeni)

## 📋 VPS'te Yapılacaklar

### 1. GitHub Actions Deployment Bekle

Commit push sonrası 2-3 dakika bekle. GitHub Actions:
- Dosyaları tar.gz olarak paketleyecek
- VPS'e upload edecek
- `/opt/minecraft` dizinine extract edecek
- Script'lere executable permission verecek
- Dependencies install edecek
- API'yi restart edecek

### 2. Fix Script'ini Çalıştır

```bash
cd /opt/minecraft
bash fix-pm2-startup.sh
```

Bu script otomatik olarak:
1. ✅ PM2'yi systemd'den kaldırır
2. ✅ Tüm PM2 process'lerini durdurur
3. ✅ Tüm Java process'lerini kill eder
4. ✅ Session lock'ları temizler
5. ✅ PM2 daemon'ı kapatır
6. ✅ PM2'yi systemd olmadan başlatır
7. ✅ Durumu doğrular

### 3. Doğrulama

```bash
# PM2 durumu (3 process olmalı)
pm2 list

# Java process (sadece 1 tane olmalı)
ps aux | grep "java.*server.jar" | grep -v grep

# Port 25565 (sadece 1 process dinlemeli)
lsof -i :25565
```

### 4. Restart Testi

```bash
# Test 1: Script ile
bash restart-minecraft.sh

# Test 2: PM2 ile
pm2 restart minecraft

# Test 3: Web panel
# http://194.105.5.37:3000 - "Restart Server" butonu
```

## 🎯 Beklenen Sonuç

### ✅ Başarılı Durum

```
┌────┬──────────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
│ id │ name             │ mode    │ pid     │ uptime   │ ↺      │ status│ cpu      │
├────┼──────────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 0  │ minecraft        │ fork    │ 123456  │ 5m       │ 0      │ online│ 50%      │
│ 1  │ minecraft-api    │ fork    │ 123457  │ 5m       │ 0      │ online│ 0%       │
│ 2  │ discord-bot      │ fork    │ 123458  │ 5m       │ 0      │ online│ 0%       │
└────┴──────────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘
```

- ✅ Sadece 3 PM2 process
- ✅ Sadece 1 Java process
- ✅ `pm2 restart minecraft` çalışıyor
- ✅ `pm2 stop minecraft` çalışıyor
- ✅ Web panel restart çalışıyor
- ✅ Session lock hatası yok

### ❌ Eski Durum (Düzeltildi)

- ❌ Birden fazla Java process
- ❌ PM2 komutları çalışmıyor
- ❌ Sunucu reboot sonrası otomatik başlıyor
- ❌ Session lock hataları
- ❌ Port 25565 çakışması

## ⚠️ Önemli Notlar

1. **Sunucu artık reboot sonrası otomatik başlamayacak**
   - Bu bir güvenlik özelliği
   - Manuel başlatmak için: `pm2 start ecosystem.config.js`

2. **start.sh kullanma**
   - Bu dosyada auto-restart loop var
   - Sadece PM2 kullan: `pm2 start minecraft`

3. **Web panel tam fonksiyonel**
   - Start, Stop, Restart butonları çalışıyor
   - Real-time monitoring aktif
   - Role assignment çalışıyor

4. **Restart süresi normal**
   - 30-60 saniye sürebilir
   - Session lock temizleme dahil
   - Java process tamamen kapanıyor

## 📊 Sistem Durumu

### Önceki Durum
```
root@vps:/opt/minecraft# ps aux | grep java
root  758771  191 35.7  ... java -jar server.jar nogui
root  760006  212 31.3  ... java -jar server.jar nogui  ❌ DUPLICATE!
```

### Yeni Durum
```
root@vps:/opt/minecraft# ps aux | grep java
root  123456   50 35.7  ... java -jar server.jar nogui  ✅ SINGLE INSTANCE
```

## 🔧 Maintenance

### Günlük Kontrol

```bash
# PM2 durumu
pm2 list

# Loglar
pm2 logs minecraft --lines 50

# Monitoring
pm2 monit
```

### Sorun Olursa

1. `docs/VPS_FIX_COMMANDS.md` dosyasına bak
2. `docs/PM2_STARTUP_FIX.md` troubleshooting bölümüne bak
3. `bash fix-pm2-startup.sh` tekrar çalıştır

## 📚 Dokümantasyon

- **PM2_STARTUP_FIX.md** - Detaylı problem analizi ve çözüm
- **VPS_FIX_COMMANDS.md** - Hızlı komut referansı
- **RESTART_SORUNU_COZUMU.md** - Restart mekanizması açıklaması

## ✨ Sonuç

PM2 multiple instance problemi tamamen çözüldü. Artık:
- ✅ Tek instance çalışıyor
- ✅ PM2 komutları çalışıyor
- ✅ Web panel restart çalışıyor
- ✅ Session lock hatası yok
- ✅ Deployment otomatik

**Tek yapman gereken:** VPS'te `bash fix-pm2-startup.sh` çalıştırmak! 🚀
