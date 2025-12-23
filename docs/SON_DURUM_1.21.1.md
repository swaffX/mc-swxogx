# 🎮 Son Durum - Minecraft 1.21.1 Upgrade

## ✅ Tamamlanan İşlemler

### 1. Versiyon Yükseltme
- ❌ 1.20.6 downgrade iptal edildi
- ✅ 1.21.1'e geri dönüldü (Paper build 129)
- ✅ TimeHUD 1.21.1 için rebuild edildi
- ✅ Config dosyaları 1.21.1 uyumlu

### 2. Plugin Sistemi
- ✅ curl tabanlı installer oluşturuldu (wget yerine)
- ✅ 10 yeni plugin için script hazır
- ✅ Retry mekanizması eklendi
- ✅ Boyut kontrolü eklendi
- ✅ Otomatik temizleme eklendi

### 3. Scriptler
- ✅ `scripts/upgrade-to-1.21.1.sh` - Versiyon yükseltme
- ✅ `scripts/install-plugins-1.21.1.sh` - Plugin kurulum
- ✅ `VPS-KOMUTLARI.md` - Detaylı komut rehberi
- ✅ `docs/PLUGIN_LISTESI.md` - Plugin dokümantasyonu

---

## 📦 Kurulu Pluginler (5)

1. **Vault** v1.7.3 - Ekonomi API
2. **Slimefun** vRC-37 - Tech/Magic
3. **Essentials** v2.21.2 - Temel komutlar
4. **SkinsRestorer** v15.9.1 - Skin sistemi
5. **TimeHUD** v1.1.0 - Custom HUD

---

## 📥 Yüklenebilir Pluginler (10)

1. **WorldEdit** v7.3.6 - Dünya düzenleme ⭐
2. **WorldGuard** v7.0.11 - Bölge koruma ⭐
3. **LuckPerms** v5.4.141 - İzin sistemi ⭐
4. **CoreProtect** v22.4 - Log/rollback ⭐
5. **Citizens** v2.0.35 - NPC sistemi
6. **ChestShop** v3.12.2 - Mağaza sistemi
7. **Multiverse-Core** v4.3.12 - Çoklu dünya
8. **Dynmap** v3.7-beta-6 - Web haritası
9. **Brewery** v3.3.1 - İçki yapma
10. **DiscordSRV** v1.28.0 - Discord entegrasyonu

**Toplam: 15 plugin**

---

## 🚀 VPS'de Yapılacaklar

### Adım 1: Sunucuyu Yükselt
```bash
cd /opt/minecraft
chmod +x scripts/upgrade-to-1.21.1.sh
./scripts/upgrade-to-1.21.1.sh
```

### Adım 2: Pluginleri Yükle
```bash
chmod +x scripts/install-plugins-1.21.1.sh
./scripts/install-plugins-1.21.1.sh
```

### Adım 3: Sunucuyu Başlat
```bash
pm2 start minecraft
```

### Adım 4: Kontrol Et
```bash
pm2 logs minecraft --lines 50
```

---

## 🎯 Beklenen Sonuç

- ✅ Minecraft 1.21.1 (Paper build 129)
- ✅ 15 plugin aktif
- ✅ World korundu (veri kaybı yok)
- ✅ Config dosyaları yeniden oluşturuldu
- ✅ Web panel çalışıyor (`http://swxogx.mooo.com`)
- ✅ RCON çalışıyor (rol sistemi aktif)
- ✅ Dynmap erişilebilir (`http://swxogx.mooo.com:8123`)

---

## 🌐 Erişim Bilgileri

### Web Panel
- **URL:** http://swxogx.mooo.com
- **Port:** 3000
- **Auth:** Google OAuth

### Minecraft Server
- **IP:** 194.105.5.37
- **Port:** 25565
- **Versiyon:** 1.21.1
- **Mod:** Offline (cracked)

### Dynmap
- **URL:** http://swxogx.mooo.com:8123
- **Port:** 8123

### RCON
- **Port:** 25575
- **Password:** SwxOgx2024Rcon!

---

## 📊 Sistem Durumu

### Sunucu Özellikleri
- **CPU:** 4 cores
- **RAM:** 8 GB (4 GB Minecraft'a ayrılmış)
- **Disk:** SSD
- **OS:** Linux

### Performans Ayarları
- **view-distance:** 5
- **simulation-distance:** 3
- **max-players:** 20
- **network-compression-threshold:** 256

### PM2 Ayarları
- **PM2_HOME:** /tmp/.pm2
- **autorestart:** false
- **max_memory_restart:** 4G

---

## 🔧 Yapılandırma Dosyaları

### Sunucu
- `server.properties` - Temel ayarlar
- `bukkit.yml` - Bukkit ayarları
- `spigot.yml` - Spigot ayarları
- `config/paper-global.yml` - Paper global
- `config/paper-world-defaults.yml` - Paper world

### Web Panel
- `server.js` - Backend API
- `public/` - Frontend dosyaları
- `ecosystem.config.js` - PM2 config

### Pluginler
- `plugins/` - Plugin JAR dosyaları
- `plugins/*/config.yml` - Plugin ayarları

---

## 📚 Dokümantasyon

### Kurulum ve Yapılandırma
- `VPS-KOMUTLARI.md` - VPS komutları
- `docs/PLUGIN_LISTESI.md` - Plugin listesi
- `docs/PERFORMANS_OPTIMIZASYONU.md` - Performans
- `docs/DOMAIN_SETUP.md` - Domain kurulumu

### Özellikler
- `docs/ROL_SISTEMI.md` - Rol yönetimi
- `docs/REAL_TIME_ROL_TAMAMLANDI.md` - Gerçek zamanlı roller
- `docs/LANDING_PAGE.md` - Landing page

### Sorun Giderme
- `docs/HATA_COZUMU.md` - Hata çözümleri
- `docs/PM2_STARTUP_FIX.md` - PM2 sorunları
- `docs/SESSION_LOCK_FIX.md` - Session lock

---

## 🎮 Oyun İçi Komutlar

### Temel Komutlar (Essentials)
```
/spawn - Spawn'a ışınlan
/home - Eve ışınlan
/sethome - Ev ayarla
/warp <name> - Warp'a git
/tpa <player> - Işınlanma isteği
```

### WorldEdit
```
//wand - Seçim değneği
//set <block> - Blok doldur
//copy - Kopyala
//paste - Yapıştır
```

### WorldGuard
```
/rg define <name> - Bölge oluştur
/rg flag <region> pvp deny - PvP kapat
/rg addmember <region> <player> - Üye ekle
```

### LuckPerms
```
/lp user <player> permission set <perm> - İzin ver
/lp creategroup <name> - Grup oluştur
/lp user <player> parent set <group> - Gruba ekle
```

### Slimefun
```
/sf guide - Rehber kitabı
/sf search <item> - Item ara
/sf stats - İstatistikler
```

---

## 🔐 Güvenlik

### Firewall
- ✅ Port 25565 açık (Minecraft)
- ✅ Port 3000 açık (Web panel)
- ✅ Port 8123 açık (Dynmap)
- ✅ Port 25575 kapalı (RCON - sadece localhost)

### Yetkilendirme
- ✅ Google OAuth (web panel)
- ✅ OP sistemi (Minecraft)
- ✅ LuckPerms (detaylı izinler)
- ✅ RCON password korumalı

### Yedekleme
- ⚠️ Otomatik yedekleme YOK (manuel yapılmalı)
- ✅ World backup scriptleri mevcut

---

## 📈 Sonraki Adımlar

### Kısa Vadeli (Bugün)
1. ✅ VPS'de upgrade scriptini çalıştır
2. ✅ Pluginleri yükle
3. ✅ Sunucuyu test et
4. ✅ Web panelden kontrol et

### Orta Vadeli (Bu Hafta)
1. ⏳ LuckPerms gruplarını ayarla
2. ⏳ WorldGuard bölgelerini oluştur
3. ⏳ Discord bot'u yapılandır
4. ⏳ Dynmap'i özelleştir

### Uzun Vadeli (Bu Ay)
1. ⏳ Otomatik yedekleme sistemi kur
2. ⏳ Custom quest'ler ekle (Citizens + Denizen)
3. ⏳ Ekonomi sistemini dengele
4. ⏳ Custom Slimefun itemları ekle

---

## 🐛 Bilinen Sorunlar

### Çözüldü ✅
- ✅ PM2 multiple instance sorunu (systemd kaldırıldı)
- ✅ Session lock sorunu (otomatik temizleme)
- ✅ Domain SSL sorunu (HTTP-only kabul edildi)
- ✅ Plugin indirme sorunu (curl kullanılıyor)
- ✅ 1.20.6 uyumsuzluk sorunu (1.21.1'e dönüldü)

### Aktif Sorunlar
- Yok ✅

### Potansiyel Sorunlar
- ⚠️ Bazı pluginler 1.21.1'de sınırlı destek verebilir
- ⚠️ Dynmap performans etkisi yüksek olabilir
- ⚠️ Hosting firewall Let's Encrypt'i engelliyor (SSL yok)

---

## 📞 Destek ve İletişim

### Dokümantasyon
- GitHub: https://github.com/swaffX/mc-swxogx
- Docs klasörü: `docs/`

### Topluluk
- Discord: (DiscordSRV kurulunca aktif olacak)
- Web Panel: http://swxogx.mooo.com

---

## 📝 Değişiklik Geçmişi

### 2024-12-23 - 1.21.1 Upgrade
- ✅ 1.20.6 downgrade iptal edildi
- ✅ 1.21.1'e geri dönüldü
- ✅ curl tabanlı plugin installer
- ✅ 10 yeni plugin hazır
- ✅ Dokümantasyon güncellendi

### 2024-12-23 - 1.20.6 Downgrade (İptal)
- ❌ Plugin uyumsuzluğu nedeniyle iptal

### 2024-12-22 - Domain Setup
- ✅ swxogx.mooo.com domain
- ✅ Nginx HTTP-only
- ✅ Firebase authorized domains

### 2024-12-21 - Rol Sistemi
- ✅ OP tabanlı rol sistemi
- ✅ RCON entegrasyonu
- ✅ Gerçek zamanlı bildirimler

### 2024-12-20 - İlk Kurulum
- ✅ Paper 1.21.1 kurulumu
- ✅ Web panel oluşturuldu
- ✅ PM2 yapılandırması
- ✅ Temel pluginler

---

**Son Güncelleme:** 23 Aralık 2024
**Minecraft Versiyonu:** Paper 1.21.1 (build 129)
**Durum:** ✅ Hazır - VPS'de upgrade bekleniyor
**Toplam Plugin:** 15 (5 kurulu + 10 yüklenebilir)
