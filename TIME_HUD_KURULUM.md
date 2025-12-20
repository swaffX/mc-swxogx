# Time HUD Datapack - Kurulum Rehberi

## 📦 Özellikler

- ⏰ Oyun içi zamanı gerçek zamanlı gösterir
- 🎨 Actionbar'da (ekranın alt ortasında) görünür
- 🕐 24 saat formatında (00:00 - 23:59)
- 🌍 Tüm oyunculara otomatik gösterilir
- ⚡ Performans dostu (vanilla datapack)

---

## 🚀 Kurulum

### Yöntem 1: World Klasörü ile Birlikte Yükle

Datapack zaten `world/datapacks/time_hud/` klasöründe hazır.

```bash
# World klasörünü VPS'e yükle
scp -r world root@194.105.5.37:/opt/minecraft/

# VPS'te sunucuyu yeniden başlat
ssh root@194.105.5.37
screen -r minecraft
stop
screen -dmS minecraft ./start.sh
```

### Yöntem 2: Sadece Datapack'i Yükle

Eğer world zaten VPS'teyse, sadece datapack'i yükle:

```bash
# Datapack klasörünü yükle
scp -r world/datapacks/time_hud root@194.105.5.37:/opt/minecraft/world/datapacks/

# VPS'te sunucuya bağlan
ssh root@194.105.5.37
screen -r minecraft

# Datapack'i yükle (server konsolunda)
/reload
```

---

## 🎮 Kullanım

### Otomatik Çalışma

Datapack yüklendikten sonra otomatik olarak çalışır. Tüm oyuncular ekranın alt ortasında şu şekilde zaman görecek:

```
⏰ 14:35
```

### Komutlar

**Datapack'i yeniden yükle:**
```
/reload
```

**Datapack'i kaldır:**
```
/function time_hud:uninstall
```

**Datapack durumunu kontrol et:**
```
/datapack list
```

---

## ⚙️ Özelleştirme

### Renk Değiştirme

`world/datapacks/time_hud/data/time_hud/functions/display.mcfunction` dosyasını düzenle:

```json
{"text":"⏰ ","color":"gold"}  // Saat ikonu rengi
{"text":"14","color":"white"}  // Saat rakamları rengi
{"text":":","color":"gray"}    // İki nokta rengi
```

**Renk seçenekleri:**
- `gold`, `yellow`, `green`, `aqua`, `blue`, `red`, `white`, `gray`, `dark_gray`

### Pozisyon Değiştirme

Actionbar yerine başka yerde göstermek için `display.mcfunction` içindeki `actionbar`'ı değiştir:

```mcfunction
# Actionbar (alt orta) - varsayılan
title @s actionbar [...]

# Title (ekran ortası)
title @s title [...]

# Subtitle (ekran ortası alt)
title @s subtitle [...]
```

### Güncelleme Hızı

Varsayılan: Her tick (saniyede 20 kez)

Daha az sıklıkta güncellemek için `tick.mcfunction` dosyasına timer ekle:

```mcfunction
# Her 20 tick'te bir güncelle (saniyede 1 kez)
scoreboard players add #timer time_hud 1
execute if score #timer time_hud matches 20.. run function time_hud:update
execute if score #timer time_hud matches 20.. run scoreboard players set #timer time_hud 0
```

---

## 🔧 Sorun Giderme

### Datapack çalışmıyor

```bash
# Server konsolunda kontrol et
/datapack list

# Eğer listede yoksa manuel yükle
/datapack enable "file/time_hud"

# Reload yap
/reload
```

### Zaman yanlış gösteriliyor

Minecraft'ta zaman 0-24000 tick arasında. Datapack bunu 00:00-23:59 formatına çeviriyor.

- 0 tick = 06:00 (sabah)
- 6000 tick = 12:00 (öğle)
- 12000 tick = 18:00 (akşam)
- 18000 tick = 00:00 (gece yarısı)

### Performans sorunu

Datapack çok hafif ama yine de kapatmak istersen:

```bash
/datapack disable "file/time_hud"
```

---

## 📁 Dosya Yapısı

```
world/
└── datapacks/
    └── time_hud/
        ├── pack.mcmeta                          # Datapack bilgileri
        └── data/
            ├── minecraft/
            │   └── tags/
            │       └── functions/
            │           ├── load.json            # Yükleme hook
            │           └── tick.json            # Tick hook
            └── time_hud/
                └── functions/
                    ├── load.mcfunction          # İlk yükleme
                    ├── tick.mcfunction          # Her tick çalışır
                    ├── display.mcfunction       # Ekranda gösterim
                    └── uninstall.mcfunction     # Kaldırma
```

---

## 🎨 Görünüm Örnekleri

**Sabah (06:00):**
```
⏰ 06:00
```

**Öğle (12:30):**
```
⏰ 12:30
```

**Akşam (18:45):**
```
⏰ 18:45
```

**Gece (23:59):**
```
⏰ 23:59
```

---

## 🔄 Güncelleme

Datapack'i güncellemek için:

1. Eski datapack'i sil: `/function time_hud:uninstall`
2. Yeni dosyaları yükle
3. Reload yap: `/reload`

---

## ⚠️ Önemli Notlar

- ✅ Vanilla Minecraft 1.21.10 ile uyumlu
- ✅ Forge/Fabric gerektirmez
- ✅ Client-side mod gerektirmez
- ✅ Tüm oyuncular görebilir
- ⚠️ Datapack pack_format: 48 (1.21.x için)

---

## 🎯 Hızlı Test

```bash
# VPS'te sunucuya bağlan
ssh root@194.105.5.37
screen -r minecraft

# Zamanı değiştir (test için)
/time set day      # 06:00
/time set noon     # 12:00
/time set sunset   # 18:00
/time set midnight # 00:00

# Datapack durumunu kontrol et
/datapack list enabled
```

---

**Başarılar! ⏰**
