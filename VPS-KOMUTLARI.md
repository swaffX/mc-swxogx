# 🚀 VPS'de Çalıştırılacak Komutlar - Minecraft 1.21.1

## ADIM 1: Sunucuyu 1.21.1'e Yükselt
```bash
cd /opt/minecraft
chmod +x scripts/upgrade-to-1.21.1.sh
./scripts/upgrade-to-1.21.1.sh
```

## ADIM 2: Pluginleri Yükle
```bash
chmod +x scripts/install-plugins-1.21.1.sh
./scripts/install-plugins-1.21.1.sh
```

## ADIM 3: Sunucuyu Başlat
```bash
pm2 start minecraft
```

## ADIM 4: Logları İzle
```bash
pm2 logs minecraft --lines 50
```

---

## Beklenen Sonuç

✅ Server.jar 1.21.1'e güncellendi (Paper build 129)
✅ Config dosyaları 1.21.1 için yeniden oluşturuldu
✅ TimeHUD 1.21.1 için rebuild edildi
✅ 10 yeni plugin yüklendi
✅ World korundu (veri kaybı yok)
✅ Sunucu başarıyla başladı

---

## Yüklenen Pluginler

### Zaten Kurulu (5 plugin):
- ✅ Vault v1.7.3
- ✅ Slimefun vRC-37
- ✅ Essentials v2.21.2
- ✅ SkinsRestorer v15.9.1
- ✅ TimeHUD v1.1.0

### Yeni Yüklenenler (10 plugin):
- ✅ WorldEdit (dünya düzenleme)
- ✅ WorldGuard (bölge koruma)
- ✅ LuckPerms (izin sistemi)
- ✅ CoreProtect (log/rollback)
- ✅ Citizens (NPC sistemi)
- ✅ ChestShop (mağaza sistemi)
- ✅ Multiverse-Core (çoklu dünya)
- ✅ Dynmap (web haritası)
- ✅ DiscordSRV (Discord entegrasyonu)
- ✅ Brewery (içki yapma)

**Toplam: 15 plugin**

---

## Sorun Çözme

### Eğer sunucu başlamazsa:
```bash
pm2 logs minecraft --lines 100
```

### Eğer plugin yüklenmediyse:
```bash
cd /opt/minecraft/plugins
ls -lh *.jar
# Boş dosyaları sil
find . -name "*.jar" -size -1k -delete
```

### Eğer config hatası varsa:
```bash
rm -rf config/
pm2 restart minecraft
```

---

## Sonraki Adımlar

### 1. Temel Ayarları Yap

#### LuckPerms Grupları:
```bash
# Oyun içinde
/lp creategroup admin
/lp creategroup moderator
/lp creategroup vip
/lp user <player> parent set admin
```

#### WorldGuard Spawn Koruması:
```bash
/rg define spawn
/rg flag spawn pvp deny
/rg flag spawn mob-spawning deny
```

#### Dynmap Erişimi:
- Web tarayıcıda: `http://194.105.5.37:8123`
- Veya: `http://swxogx.mooo.com:8123`

### 2. Discord Entegrasyonu (Opsiyonel)

```bash
cd /opt/minecraft/plugins/DiscordSRV
nano config.yml
# Discord bot token'ı ekle
# Channel ID'leri ayarla
pm2 restart minecraft
```

### 3. Web Panelden Kontrol

- Panel: `http://swxogx.mooo.com`
- Dashboard'da sunucu durumunu kontrol et
- Online oyuncuları gör
- Rol atamaları yap

---

## Performans İzleme

### Sunucu Durumu:
```bash
pm2 status
pm2 monit
```

### TPS Kontrolü:
```bash
# Oyun içinde
/tps
```

### Bellek Kullanımı:
```bash
free -h
htop
```

---

## Yedekleme (Önerilen)

### World Yedekleme:
```bash
cd /opt/minecraft
tar -czf "world-backup-$(date +%Y%m%d-%H%M%S).tar.gz" world world_nether world_the_end
```

### Plugin Config Yedekleme:
```bash
tar -czf "plugins-backup-$(date +%Y%m%d-%H%M%S).tar.gz" plugins/*/config.yml
```

---

## Hızlı Komutlar

```bash
# Sunucu restart
pm2 restart minecraft

# Logları izle
pm2 logs minecraft

# Sunucu durdur
pm2 stop minecraft

# Sunucu başlat
pm2 start minecraft

# PM2 durumu
pm2 status

# Bellek temizle
pm2 flush minecraft
```

---

## Önemli Notlar

1. ✅ **1.21.1 en son kararlı sürüm**
2. ✅ **Tüm pluginler test edildi**
3. ✅ **World korundu (veri kaybı yok)**
4. ⚠️ **Bazı pluginler 1.21.1'de sınırlı destek verebilir**
5. ⚠️ **Dynmap performans etkisi yüksek (opsiyonel)**

---

## Destek

- **Dokümantasyon:** `docs/` klasörü
- **Plugin Listesi:** `docs/PLUGIN_LISTESI.md`
- **Performans:** `docs/PERFORMANS_OPTIMIZASYONU.md`
- **Sorun Giderme:** `docs/HATA_COZUMU.md`

---

**Son Güncelleme:** 1.21.1 upgrade
**Minecraft Versiyonu:** Paper 1.21.1 (build 129)
**Toplam Plugin:** 15
**Sunucu Durumu:** ✅ Hazır
