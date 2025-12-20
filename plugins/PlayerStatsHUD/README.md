# 📊 PlayerStatsHUD Plugin

Minecraft Paper sunucusu için oyuncu istatistiklerini gösteren HUD plugin'i.

## ✨ Özellikler

- ❤️ **Can Göstergesi** - Gerçek zamanlı can durumu ve progress bar
- 🍖 **Açlık Göstergesi** - Açlık seviyesi ve bar
- ✨ **XP Sistemi** - Level ve XP progress bar
- 📍 **Konum Bilgisi** - X, Y, Z koordinatları ve biome
- ⏱️ **Oynama Süresi** - Session bazlı oynama süresi
- 🕐 **Dünya Zamanı** - Oyun içi saat ve zaman dilimi

## 📦 Kurulum

### 1. Plugin'i Derle

```bash
cd plugins/PlayerStatsHUD
mvn clean package
```

### 2. JAR'ı Kopyala

```bash
cp target/PlayerStatsHUD-1.0.0.jar /opt/minecraft/plugins/
```

### 3. Sunucuyu Restart veya Reload

```bash
# Sunucu konsolunda
reload
```

## 🎮 Kullanım

### Komutlar

```
/playerhud          - HUD'u aç/kapat (toggle)
/playerhud aç       - HUD'u aç
/playerhud kapat    - HUD'u kapat
/playerhud reload   - Config'i yeniden yükle (admin)
```

**Alternatif Komutlar:**
- `/phud`
- `/statshud`

### İzinler

```yaml
playerstats.use      # HUD kullanma izni (varsayılan: true)
playerstats.admin    # Admin komutları (varsayılan: op)
```

## ⚙️ Yapılandırma

`config.yml` dosyasını düzenleyerek plugin'i özelleştirebilirsiniz:

### Modülleri Aç/Kapat

```yaml
modules:
  health: true          # Can göster
  hunger: true          # Açlık göster
  xp: true             # XP göster
  location: true       # Konum göster
  playtime: true       # Oynama süresi göster
  world-time: true     # Dünya zamanı göster
```

### Renkleri Özelleştir

```yaml
colors:
  health: "&c"         # Kırmızı
  hunger: "&e"         # Sarı
  xp: "&a"             # Yeşil
  location: "&b"       # Açık mavi
  playtime: "&d"       # Pembe
  world-time: "&f"     # Beyaz
  label: "&7"          # Gri
```

**Renk Kodları:**
- `&0` - Siyah
- `&1` - Koyu Mavi
- `&2` - Koyu Yeşil
- `&3` - Koyu Cyan
- `&4` - Koyu Kırmızı
- `&5` - Mor
- `&6` - Altın
- `&7` - Gri
- `&8` - Koyu Gri
- `&9` - Mavi
- `&a` - Yeşil
- `&b` - Cyan
- `&c` - Kırmızı
- `&d` - Pembe
- `&e` - Sarı
- `&f` - Beyaz
- `&l` - Kalın
- `&o` - İtalik

### Güncelleme Sıklığı

```yaml
hud:
  update-interval: 20  # 20 tick = 1 saniye
```

### Başlığı Değiştir

```yaml
hud:
  title: "&6&l⚡ OYUNCU BİLGİ"
```

## 📊 HUD Görünümü

```
━━━━━━━━━━━━━━━
⚡ OYUNCU BİLGİ
━━━━━━━━━━━━━━━

❤ Can:
 ████████░░ 16/20

🍖 Açlık:
 ████████░░ 18/20

✨ XP:
 Level 15 (45%)
 ████░░░░░░

📍 Konum:
 X:125 Y:64 Z:-89
 🌲 Forest

⏱ Oynama Süresi:
 2dk 15sn

🕐 Dünya Zamanı:
 15:22 ☀ Öğleden Sonra

━━━━━━━━━━━━━━━
```

## 🔧 Geliştirme

### Proje Yapısı

```
PlayerStatsHUD/
├── pom.xml
├── src/
│   └── main/
│       ├── java/com/server/playerstats/
│       │   ├── PlayerStatsHUD.java      # Ana plugin sınıfı
│       │   ├── HUDManager.java          # HUD yönetimi
│       │   ├── PlayerHUDCommand.java    # Komut handler
│       │   └── PlayerListener.java      # Event listener
│       └── resources/
│           ├── plugin.yml               # Plugin metadata
│           └── config.yml               # Yapılandırma
└── README.md
```

### Yeni Modül Ekleme

1. `config.yml`'e yeni modül ekle:
```yaml
modules:
  yeni-modul: true
```

2. `HUDManager.java`'da `updateHUD()` metoduna ekle:
```java
if (plugin.getConfig().getBoolean("modules.yeni-modul", true)) {
    // Modül kodu
}
```

## 🐛 Sorun Giderme

### HUD Görünmüyor

1. Plugin yüklü mü kontrol et:
```
/plugins
```

2. İzinleri kontrol et:
```
/lp user <oyuncu> permission check playerstats.use
```

3. HUD açık mı kontrol et:
```
/playerhud aç
```

### Renkler Çalışmıyor

- Minecraft 1.16+ için `&` yerine `§` kullanılabilir
- Config'te renk kodlarını kontrol et

### Performans Sorunu

`config.yml`'de güncelleme sıklığını artır:
```yaml
hud:
  update-interval: 40  # 2 saniye
```

## 📝 Changelog

### v1.0.0 (2025-12-20)
- ✅ İlk sürüm
- ✅ Can, açlık, XP göstergesi
- ✅ Konum ve biome bilgisi
- ✅ Oynama süresi tracker
- ✅ Dünya zamanı göstergesi
- ✅ Yapılandırılabilir modüller
- ✅ Renk özelleştirme

## 📄 Lisans

MIT License - Özgürce kullanabilir ve değiştirebilirsiniz.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📞 Destek

- GitHub Issues: https://github.com/kxrk0/minecraft-server/issues
- Discord: [Sunucu linki]

---

**Başarılar! 🎮**
