# Minecraft Server Performans Optimizasyonları

## ✅ Yapılan Değişiklikler (8GB VPS için)

### RAM Ayarları
- **MIN_RAM:** 2G → **4G**
- **MAX_RAM:** 4G → **7G**
- 8GB VPS'in %87.5'ini kullanıyor (1GB sistem için ayrıldı)

### Server.properties Optimizasyonları

#### Ping Azaltma
```properties
network-compression-threshold=512  # 256'dan artırıldı (daha az CPU, daha az lag)
sync-chunk-writes=false            # Disk I/O lag'ini azaltır
max-tick-time=120000               # Server crash'i önler
```

#### Performans İyileştirme
```properties
view-distance=12                   # 10'dan artırıldı (daha iyi görüş, 8GB yeterli)
simulation-distance=8              # CPU yükünü dengeler
```

---

## 🔧 VPS'te Uygulanacak Komutlar

### 1. Dosyaları Güncelle
```bash
# start.sh, minecraft.service ve server.properties dosyalarını VPS'e yükle
scp start.sh minecraft.service server.properties root@194.105.5.37:/opt/minecraft/
```

### 2. Sunucuyu Durdur
```bash
ssh root@194.105.5.37
screen -r minecraft
# Konsol içinde: stop
```

### 3. Service'i Güncelle (Eğer systemd kullanıyorsan)
```bash
sudo cp /opt/minecraft/minecraft.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl restart minecraft
```

### 4. Screen ile Yeniden Başlat
```bash
cd /opt/minecraft
screen -dmS minecraft ./start.sh
```

---

## 📊 Performans İzleme

### RAM Kullanımını Kontrol Et
```bash
# Toplam sistem RAM'i
free -h

# Minecraft process RAM'i
ps aux | grep java | grep -v grep
```

### TPS (Ticks Per Second) Kontrol
```bash
# Server konsolunda
/forge tps
# veya
/tps
```

**İdeal TPS:** 20.0 (lag yoksa)
**Kabul edilebilir:** 18-20
**Lag var:** <18

---

## 🚀 Ek Optimizasyon Önerileri

### 1. Paper/Spigot Kullan (Vanilla yerine)
Paper, vanilla Minecraft'tan çok daha optimize:
```bash
# Paper indir
wget https://api.papermc.io/v2/projects/paper/versions/1.21.10/builds/latest/downloads/paper-1.21.10-latest.jar -O server.jar
```

### 2. Chunk Pre-generation
Dünyayı önceden oluştur (ilk join lag'ini önler):
```bash
# Chunky plugin kullan
/chunky radius 5000
/chunky start
```

### 3. Entity Limitleri
```properties
# server.properties'e ekle (eğer mob lag'i varsa)
spawn-limits.monster=50
spawn-limits.creature=10
spawn-limits.ambient=15
```

### 4. Linux Kernel Optimizasyonu
```bash
# /etc/sysctl.conf dosyasına ekle
sudo nano /etc/sysctl.conf

# Ekle:
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_rmem=4096 87380 16777216
net.ipv4.tcp_wmem=4096 65536 16777216

# Uygula
sudo sysctl -p
```

---

## 🔍 Ping Sorunları İçin Kontrol Listesi

### 1. VPS Lokasyonu
- Oyuncular hangi ülkeden? (Türkiye ise Avrupa VPS ideal)
- Ping testi: `ping 194.105.5.37`

### 2. CPU Kullanımı
```bash
htop
# Java process %100'e yakınsa CPU bottleneck var
```

### 3. Disk I/O
```bash
iostat -x 1
# %util yüksekse (>80) disk yavaş
```

### 4. Ağ Bağlantısı
```bash
# Bandwidth testi
iperf3 -s  # VPS'te
iperf3 -c 194.105.5.37  # Kendi bilgisayarında
```

---

## 📈 Beklenen Performans (8GB VPS)

- **Oyuncu Kapasitesi:** 30-50 oyuncu (vanilla)
- **TPS:** 19.5-20.0 (stabil)
- **RAM Kullanımı:** 4-7GB
- **CPU Kullanımı:** %40-60 (normal)
- **Ping:** 30-80ms (Avrupa oyuncular için)

---

## ⚠️ Önemli Notlar

1. **Sunucuyu yeniden başlat** - Değişiklikler uygulanması için restart gerekli
2. **Yedek al** - Değişiklik öncesi `./backup.sh` çalıştır
3. **İzle** - İlk 30 dakika performansı izle: `htop` ve `/tps`
4. **Ayarla** - Gerekirse view-distance'ı 10'a düşür

---

## 🎯 Hızlı Uygulama

```bash
# 1. VPS'e bağlan
ssh root@194.105.5.37

# 2. Sunucuyu durdur
screen -r minecraft
stop

# 3. Dosyaları güncelle (local'den)
# (start.sh, minecraft.service, server.properties)

# 4. Yeniden başlat
cd /opt/minecraft
screen -dmS minecraft ./start.sh

# 5. Performansı izle
screen -r minecraft
```

**Başarılar! 🚀**
