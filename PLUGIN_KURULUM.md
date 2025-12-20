# TimeHUD Plugin - Kurulum Rehberi

## ⚠️ ÖNEMLİ: Paper/Spigot Gerekli

Vanilla Minecraft sunucusu plugin desteklemez. **Paper** veya **Spigot** sunucusu kullanman gerekiyor.

---

## 🚀 Paper Sunucusuna Geçiş

### 1. Paper İndir

```bash
# VPS'e bağlan
ssh root@194.105.5.37
cd /opt/minecraft

# Mevcut server.jar'ı yedekle
mv server.jar server_vanilla.jar

# Paper indir (1.21.10 için)
wget https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/latest/downloads/paper-1.21.1-latest.jar -O server.jar
```

### 2. Sunucuyu Yeniden Başlat

```bash
screen -r minecraft
stop
screen -dmS minecraft ./start.sh
```

Paper, vanilla ile %100 uyumlu. Tüm world'ün ve ayarların korunur.

---

## 📦 Plugin Kurulumu

### Seçenek 1: Hazır JAR Kullan (Önerilir)

```bash
# Plugin'i derle (local bilgisayarında)
cd plugins/TimeHUD
mvn clean package

# Oluşan JAR'ı VPS'e yükle
scp target/TimeHUD-1.0.0.jar root@194.105.5.37:/opt/minecraft/plugins/

# VPS'te sunucuyu yeniden başlat
ssh root@194.105.5.37
screen -r minecraft
reload
```

### Seçenek 2: Maven Yok mu?

Maven kurulu değilse:

```bash
# Ubuntu'da Maven kur
sudo apt install maven -y

# Plugin'i derle
cd plugins/TimeHUD
mvn clean package
```

---

## 🎮 Kullanım

### Otomatik Çalışma

Plugin yüklendikten sonra tüm oyuncular ekranın **SAĞ TARAFINDA** şöyle bir HUD görecek:

```
━━━━━━━━━━━━━━
⏰ SERVER INFO
━━━━━━━━━━━━━━
Time:
  14:35

Period:
  ☀ Afternoon

━━━━━━━━━━━━━━
```

### Komutlar

```
/timehud        - HUD'u aç/kapat (toggle)
/timehud on     - HUD'u aç
/timehud off    - HUD'u kapat
```

---

## 🎨 Görünüm Örnekleri

**Sabah (06:00-12:00):**
```
Time: 08:30
Period: ☀ Morning
```

**Öğleden Sonra (12:00-18:00):**
```
Time: 14:35
Period: ☀ Afternoon
```

**Akşam (18:00-21:00):**
```
Time: 19:45
Period: 🌙 Evening
```

**Gece (21:00-06:00):**
```
Time: 23:59
Period: 🌙 Night
```

---

## ⚙️ Özelleştirme

### Renkleri Değiştir

`TimeHUD.java` dosyasını düzenle:

```java
// Başlık rengi
ChatColor.GOLD + "" + ChatColor.BOLD + "⏰ SERVER INFO"

// Zaman rengi
ChatColor.AQUA + "  " + timeString

// Period renkleri
ChatColor.YELLOW + "☀ Morning"      // Sabah
ChatColor.GOLD + "☀ Afternoon"      // Öğle
ChatColor.DARK_PURPLE + "🌙 Evening" // Akşam
ChatColor.DARK_BLUE + "🌙 Night"    // Gece
```

### Güncelleme Hızı

Varsayılan: Her saniye (20 tick)

Değiştirmek için `TimeHUD.java` içinde:

```java
.runTaskTimer(this, 0L, 20L); // 20 = 1 saniye
.runTaskTimer(this, 0L, 40L); // 40 = 2 saniye
```

### Ek Bilgiler Ekle

`updateHUD()` metoduna yeni satırlar ekle:

```java
// Oyuncu sayısı
Score lineX = objective.getScore(ChatColor.WHITE + "Players: " + 
    ChatColor.GREEN + Bukkit.getOnlinePlayers().size());
lineX.setScore(X);

// TPS
Score lineY = objective.getScore(ChatColor.WHITE + "TPS: " + 
    ChatColor.GREEN + String.format("%.1f", Bukkit.getTPS()[0]));
lineY.setScore(Y);

// Koordinatlar
Score lineZ = objective.getScore(ChatColor.WHITE + "Pos: " + 
    ChatColor.AQUA + player.getLocation().getBlockX() + ", " + 
    player.getLocation().getBlockY() + ", " + 
    player.getLocation().getBlockZ());
lineZ.setScore(Z);
```

---

## 🔧 Sorun Giderme

### Plugin yüklenmiyor

```bash
# Plugin klasörünü kontrol et
ls -la /opt/minecraft/plugins/

# Log'ları kontrol et
tail -f /opt/minecraft/logs/latest.log

# Paper/Spigot kullandığından emin ol
# Vanilla sunucu plugin desteklemez!
```

### HUD görünmüyor

```bash
# Server konsolunda
/plugins

# TimeHUD yeşil olmalı (enabled)
# Kırmızıysa hata var, log'lara bak
```

### Maven build hatası

```bash
# Java 21 kurulu mu kontrol et
java -version

# Maven kurulu mu kontrol et
mvn -version

# Temiz build
cd plugins/TimeHUD
mvn clean install
```

---

## 📁 Dosya Yapısı

```
plugins/
└── TimeHUD/
    ├── pom.xml                                    # Maven config
    ├── plugin.yml                                 # Plugin metadata
    └── src/main/java/com/server/timehud/
        ├── TimeHUD.java                          # Ana plugin
        └── TimeHUDCommand.java                   # Komut handler
```

---

## 🎯 Hızlı Kurulum Özeti

```bash
# 1. Paper'a geç
cd /opt/minecraft
wget https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/latest/downloads/paper-1.21.1-latest.jar -O server.jar

# 2. Plugin'i derle (local)
cd plugins/TimeHUD
mvn clean package

# 3. VPS'e yükle
scp target/TimeHUD-1.0.0.jar root@194.105.5.37:/opt/minecraft/plugins/

# 4. Sunucuyu yeniden başlat
ssh root@194.105.5.37
screen -r minecraft
reload
```

---

## ⚡ Paper'ın Avantajları

- ✅ Vanilla ile %100 uyumlu
- ✅ Daha iyi performans (TPS optimization)
- ✅ Plugin desteği
- ✅ Daha az lag
- ✅ Daha fazla özelleştirme

---

## 📞 Alternatif: Basit Çözüm

Eğer Paper'a geçmek istemiyorsan, vanilla datapack ile **bossbar** kullanabilirsin (ekranın üstünde görünür). Ama sağ tarafta sidebar için plugin şart.

---

**Başarılar! 🎮**
