# 🔧 Minecraft Session Lock Hatası Çözümü

## ❌ Hata
```
net.minecraft.util.DirectoryLock$LockException: /opt/minecraft/./world/session.lock: already locked (possibly by other Minecraft instance?)
```

## 🔍 Sebep
Minecraft sunucusu zaten çalışıyor veya önceki çalışmadan kalan lock dosyası var.

## ✅ Çözüm

### VPS'te Şu Komutları Çalıştır:

```bash
# 1. Minecraft sunucusunu durdur
pm2 stop minecraft

# 2. Lock dosyalarını sil
rm -f /opt/minecraft/world/session.lock
rm -f /opt/minecraft/world_nether/session.lock
rm -f /opt/minecraft/world_the_end/session.lock

# 3. Sunucuyu tekrar başlat
pm2 start minecraft

# 4. Logları kontrol et
pm2 logs minecraft --lines 50
```

## 🚀 Alternatif: Restart Script Kullan

```bash
# Restart endpoint'i kullan (otomatik lock temizler)
curl -X POST http://localhost:3000/api/restart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Kalıcı Çözüm

`start.sh` dosyasına lock temizleme ekle:

```bash
#!/bin/bash

# Lock dosyalarını temizle
rm -f world/session.lock
rm -f world_nether/session.lock
rm -f world_the_end/session.lock

# Sunucuyu başlat
java -Xms4G -Xmx4G -jar paper.jar nogui
```

## ⚠️ Önemli Notlar

- Lock dosyaları sunucu çalışırken oluşur
- Sunucu düzgün kapanmazsa lock kalır
- Restart yaparken her zaman lock'ları temizle
- PM2 restart komutu otomatik temizler (server.js'de yapılıyor)

## ✅ Kontrol

Sunucu başarıyla başladıysa şunu görmelisin:
```
[INFO]: Done (5.234s)! For help, type "help"
```
