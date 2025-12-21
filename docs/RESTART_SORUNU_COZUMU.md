# 🔄 Restart Sorunu Çözümü

## Sorun

Minecraft sunucusu restart edildiğinde session lock dosyaları temizlenmediği için sunucu tekrar başlamıyor.

**Hata:**
```
Failed to start the minecraft server
net.minecraft.util.DirectoryLock$LockException: /opt/minecraft/./world/session.lock: already locked
```

## Çözüm

### 1. Güvenli Restart Mekanizması

Restart işlemi şu adımları takip eder:

1. **Stop** - PM2 ile Minecraft'ı durdur
2. **Wait** - 3 saniye bekle (Java process'in kapanması için)
3. **Check** - Hala çalışan Java process var mı kontrol et
4. **Kill** - Varsa zorla kapat (`pkill -9`)
5. **Clean** - Session lock dosyalarını temizle
6. **Wait** - 1 saniye daha bekle
7. **Start** - PM2 ile Minecraft'ı başlat

### 2. Restart Yöntemleri

#### A. Web Panel (Önerilen)
```
Dashboard → Server Control → Restart
```

**Avantajlar:**
- ✅ Otomatik lock temizleme
- ✅ Java process kontrolü
- ✅ Güvenli bekleme süreleri
- ✅ Hata yönetimi

#### B. Restart Script (Manuel)
```bash
bash /opt/minecraft/restart-minecraft.sh
```

**Avantajlar:**
- ✅ Detaylı log çıktısı
- ✅ Adım adım gösterim
- ✅ Hata kontrolü

#### C. PM2 Restart (Önerilmez)
```bash
pm2 restart minecraft
```

**Dezavantajlar:**
- ❌ Lock dosyalarını temizlemez
- ❌ Java process kontrolü yapmaz
- ❌ Session lock hatası verir

### 3. Manuel Restart (Acil Durum)

Eğer hiçbir yöntem çalışmazsa:

```bash
# 1. PM2'yi durdur
pm2 stop minecraft

# 2. Java process'lerini kontrol et
ps aux | grep java

# 3. Varsa kill et
pkill -9 -f "java.*server.jar"

# 4. Lock'ları temizle
cd /opt/minecraft
rm -f world/session.lock
rm -f world_nether/session.lock
rm -f world_the_end/session.lock

# 5. Başlat
pm2 start minecraft

# 6. Logları izle
pm2 logs minecraft
```

### 4. Otomatik Restart (Cron)

Günlük otomatik restart için:

```bash
# Crontab'ı aç
crontab -e

# Her gün saat 04:00'te restart
0 4 * * * /opt/minecraft/restart-minecraft.sh >> /opt/minecraft/logs/restart.log 2>&1
```

## Teknik Detaylar

### Session Lock Nedir?

Session lock, Minecraft'ın aynı world'ü birden fazla sunucunun açmasını engelleyen bir güvenlik mekanizmasıdır.

**Dosyalar:**
- `world/session.lock` - Overworld
- `world_nether/session.lock` - Nether
- `world_the_end/session.lock` - End

**İçerik:**
```
☃ (Snowman karakteri - lock işareti)
```

### Neden Sorun Oluyor?

1. **PM2 restart** komutu çok hızlı çalışır
2. Java process kapanmadan önce yeni process başlar
3. Eski lock dosyası hala mevcut
4. Yeni process lock dosyasını göremez ve hata verir

### Çözüm Mantığı

```javascript
// 1. Stop
pm2 stop minecraft

// 2. Wait (Java process'in kapanması için)
setTimeout(() => {
  
  // 3. Check & Kill (eğer hala çalışıyorsa)
  exec('pgrep -f "java.*server.jar"', (err, stdout) => {
    if (stdout) {
      exec('pkill -9 -f "java.*server.jar"');
    }
  });
  
  // 4. Clean locks
  fs.unlinkSync('world/session.lock');
  fs.unlinkSync('world_nether/session.lock');
  fs.unlinkSync('world_the_end/session.lock');
  
  // 5. Start
  pm2 start minecraft
  
}, 3000);
```

## API Endpoint

### POST `/api/server/restart`

**Request:**
```bash
curl -X POST http://194.105.5.37:3000/api/server/restart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (Başarılı):**
```json
{
  "success": true,
  "message": "Server is restarting... (this may take 30-60 seconds)"
}
```

**Response (Hata):**
```json
{
  "success": false,
  "message": "Restart failed: ..."
}
```

## Sorun Giderme

### Problem: Restart hala çalışmıyor

**Çözüm 1:** PM2'yi tamamen yeniden başlat
```bash
pm2 kill
pm2 start ecosystem.config.js
```

**Çözüm 2:** Manuel restart script kullan
```bash
bash /opt/minecraft/restart-minecraft.sh
```

**Çözüm 3:** Sunucuyu reboot et
```bash
sudo reboot
```

### Problem: Java process kapanmıyor

**Çözüm:**
```bash
# Tüm Java process'lerini zorla kapat
pkill -9 java

# Veya spesifik PID ile
ps aux | grep java
kill -9 <PID>
```

### Problem: Lock dosyaları silinmiyor

**Çözüm:**
```bash
# İzinleri kontrol et
ls -la world/session.lock

# Root olarak sil
sudo rm -f world/session.lock world_*/*.lock

# İzinleri düzelt
sudo chown -R $(whoami):$(whoami) world/
```

## Best Practices

### ✅ Yapılması Gerekenler

1. **Web panel kullan** - En güvenli yöntem
2. **Restart script kullan** - Manuel işlemler için
3. **Logları kontrol et** - Restart sonrası `pm2 logs`
4. **Düzenli restart** - Günlük otomatik restart (cron)
5. **Backup al** - Restart öncesi world backup

### ❌ Yapılmaması Gerekenler

1. **pm2 restart kullanma** - Lock temizlemez
2. **Çok sık restart** - Sunucu stabil değilse
3. **Restart sırasında işlem yapma** - 30-60 saniye bekle
4. **Lock dosyalarını manuel silme** - Script kullan

## Monitoring

### Restart Logları

```bash
# Backend logları
pm2 logs minecraft-api | grep "Restart"

# Minecraft logları
pm2 logs minecraft | grep "Starting"

# Restart script logları
tail -f /opt/minecraft/logs/restart.log
```

### Restart Başarı Kontrolü

```bash
# PM2 status
pm2 list

# Minecraft port kontrolü
netstat -tulpn | grep 25565

# RCON kontrolü
telnet localhost 25575
```

## Özet

**Sorun:** Session lock dosyaları restart'ı engelliyor  
**Çözüm:** Güvenli restart mekanizması (stop → wait → clean → start)  
**Yöntem:** Web panel veya restart script kullan  
**Süre:** 30-60 saniye  
**Durum:** ✅ Çözüldü

---

**Son Güncelleme:** 21 Aralık 2024  
**Versiyon:** 1.0.0
