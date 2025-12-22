# 🔄 Minecraft Server Versiyon Değişikliği

## 1.21.1 → 1.20.6 Downgrade

### Neden 1.20.6?

**1.21.1 Sorunları:**
- ❌ Slimefun desteklemiyor
- ❌ MythicMobs desteklemiyor
- ❌ EliteMobs desteklemiyor
- ❌ Citizens desteklemiyor
- ❌ Çoğu büyük plugin henüz güncellenmedi

**1.20.6 Avantajları:**
- ✅ Tüm popüler pluginler destekliyor
- ✅ Stabil ve test edilmiş
- ✅ Geniş plugin kütüphanesi
- ✅ Performans optimize edilmiş

### Otomatik Downgrade

```bash
cd /opt/minecraft
bash scripts/downgrade-to-1.20.6.sh
```

Bu script:
1. Sunucuyu durdurur
2. Mevcut server.jar'ı yedekler
3. Paper 1.20.6'yı indirir
4. Eski pluginleri temizler
5. 1.20.6 uyumlu pluginleri indirir
6. Sunucuyu başlatır

### Manuel Downgrade

```bash
cd /opt/minecraft

# 1. Sunucuyu durdur
pm2 stop minecraft

# 2. Yedek al
mv server.jar server-1.21.1.jar.backup

# 3. Paper 1.20.6 indir
wget https://api.papermc.io/v2/projects/paper/versions/1.20.6/builds/147/downloads/paper-1.20.6-147.jar -O server.jar

# 4. Pluginleri temizle
cd plugins
rm -f *.jar

# 5. Yeni pluginleri kur
bash ../scripts/install-plugins.sh

# 6. Başlat
cd /opt/minecraft
pm2 start minecraft
```

### Dünya Uyumluluğu

**Önemli:** Minecraft dünyaları geriye uyumludur!
- 1.21.1 dünyası → 1.20.6'da çalışır ✅
- Yeni bloklar/özellikler kaybolabilir ⚠️
- Oyuncu envanteri korunur ✅
- Yapılar korunur ✅

**Kaybedilecek Özellikler:**
- 1.21.1'e özel yeni bloklar
- 1.21.1'e özel yeni moblar
- 1.21.1'e özel yeni itemlar

**Korunacak:**
- Tüm yapılar
- Oyuncu envanteri
- Chest'ler
- Redstone devreleri
- Eski bloklar

### Yeni Dünya Başlatma (Opsiyonel)

Eğer temiz başlamak istersen:

```bash
cd /opt/minecraft

# Eski dünyayı yedekle
mv world world-1.21.1-backup
mv world_nether world_nether-1.21.1-backup
mv world_the_end world_the_end-1.21.1-backup

# server.properties'te level-name değiştir
nano server.properties
# level-name=world-1.20.6

# Sunucuyu başlat (yeni dünya oluşturulacak)
pm2 restart minecraft
```

### Kurulu Pluginler (1.20.6)

| Plugin | Versiyon | Açıklama |
|--------|----------|----------|
| **TreeAssist** | 7.0.0 | Ağaç kesme sistemi |
| **Slimefun4** | RC-37 | Makineler ve teknoloji |
| **WorldEdit** | 7.3.8 | Yapı düzenleme |
| **WorldGuard** | 7.0.12 | Bölge koruma |
| **Citizens** | 2.0.35 | NPC sistemi |
| **Denizen** | 1.3.1 | NPC scripting |
| **MythicMobs** | 5.6.2 | Özel moblar |
| **EliteMobs** | 9.2.8 | Boss sistemi |
| **Brewery** | 3.3.0 | İçki yapma |
| **Vault** | 1.7.3 | Ekonomi API |
| **Essentials** | 2.21.2 | Temel komutlar |
| **SkinsRestorer** | 15.9.1 | Skin sistemi |
| **TimeHUD** | 1.0.0 | Zaman göstergesi |

### Test Etme

```bash
# Sunucu durumunu kontrol et
pm2 list

# Loglara bak
pm2 logs minecraft --lines 50

# Oyun içinde
/plugins
/sf guide
/version
```

### Sorun Giderme

#### Plugin yüklenmediyse:
```bash
cd /opt/minecraft/plugins
ls -lh *.jar
# Dosya boyutlarını kontrol et, 0 byte olanları sil ve yeniden indir
```

#### Dünya bozulduysa:
```bash
# Yedekten geri yükle
cd /opt/minecraft
rm -rf world world_nether world_the_end
mv world-1.21.1-backup world
mv world_nether-1.21.1-backup world_nether
mv world_the_end-1.21.1-backup world_the_end
pm2 restart minecraft
```

#### Server başlamazsa:
```bash
# Loglara bak
pm2 logs minecraft --lines 100

# Java versiyonunu kontrol et
java -version
# Java 21 olmalı

# Eski versiyona dön
cd /opt/minecraft
rm server.jar
mv server-1.21.1.jar.backup server.jar
pm2 restart minecraft
```

### Performans Karşılaştırması

| Metrik | 1.21.1 | 1.20.6 |
|--------|--------|--------|
| **TPS** | 18-19 | 19-20 |
| **RAM** | 2.5GB | 2.2GB |
| **Startup** | 35s | 30s |
| **Plugins** | 4 | 13+ |

### Gelecek Güncellemeler

**1.21.1'e Geri Dönmek İçin:**
```bash
cd /opt/minecraft
pm2 stop minecraft
rm server.jar
mv server-1.21.1.jar.backup server.jar
pm2 start minecraft
```

**1.21.x Desteği:**
- Slimefun: ~2-3 ay
- MythicMobs: ~1-2 ay
- EliteMobs: ~1-2 ay
- Citizens: ~2-3 ay

### Notlar

- ✅ Downgrade güvenlidir
- ✅ Dünya korunur
- ✅ Oyuncu verileri korunur
- ⚠️ 1.21.1 özellikleri kaybolur
- ⚠️ Yeni bloklar hava olur

### Yardım

Sorun yaşarsan:
```bash
pm2 logs minecraft
```

Veya Discord/Forum'da yardım iste.
