# Minecraft Server 1.21.10 - Ubuntu VPS

## 🌐 Server IP: 194.105.5.37:25565

---

## 🚀 Hızlı Kurulum

### 1. Dosyaları VPS'e Yükle

```bash
# SFTP/SCP ile yükle
scp -r * root@194.105.5.37:/opt/minecraft/

# Veya rsync ile
rsync -avz --progress ./ root@194.105.5.37:/opt/minecraft/
```

### 2. VPS'e Bağlan ve Kur

```bash
ssh root@194.105.5.37
cd /opt/minecraft
chmod +x install.sh start.sh backup.sh
./install.sh
```

### 3. Sunucuyu Başlat

```bash
# Arka planda başlat
screen -dmS minecraft ./start.sh

# Konsola bağlan
screen -r minecraft

# Konsoldan çık: Ctrl+A ardından D
```

---

## ⚙️ RAM Ayarları

`start.sh` dosyasını düzenle:

```bash
nano start.sh

# VPS RAM'ine göre ayarla:
MIN_RAM="2G"  # Başlangıç RAM
MAX_RAM="4G"  # Maksimum RAM
```

**Önerilen ayarlar:**
- 4GB VPS → `MIN_RAM="1G"` `MAX_RAM="3G"`
- 8GB VPS → `MIN_RAM="2G"` `MAX_RAM="6G"`
- 16GB VPS → `MIN_RAM="4G"` `MAX_RAM="12G"`

---

## 🎮 Bağlantı

Oyuncular şu adresle bağlanır:
```
194.105.5.37:25565
```

---

## 🔧 Yönetim Komutları

### Sunucu Başlat/Durdur

```bash
# Screen ile başlat
screen -dmS minecraft ./start.sh

# Konsola bağlan
screen -r minecraft

# Sunucuyu durdur (konsol içinde)
stop

# Konsoldan çık (Ctrl+A, D)
```

### Systemd Service (Önerilir)

```bash
# Service'i kur
sudo cp minecraft.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable minecraft

# Başlat/Durdur
sudo systemctl start minecraft
sudo systemctl stop minecraft
sudo systemctl restart minecraft

# Durumu kontrol et
sudo systemctl status minecraft

# Logları izle
sudo journalctl -u minecraft -f
```

---

## 🔄 Yedekleme

### Manuel Yedekleme

```bash
./backup.sh
```

### Otomatik Yedekleme (Cron)

```bash
crontab -e

# Her gün saat 03:00'te
0 3 * * * /opt/minecraft/backup.sh

# Her 6 saatte bir
0 */6 * * * /opt/minecraft/backup.sh
```

---

## 🛡️ Güvenlik

### Firewall

```bash
sudo ufw allow 25565/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Whitelist

```bash
# Server konsolunda
whitelist on
whitelist add oyuncu_adi
```

---

## 📊 İzleme

```bash
# Sistem kaynakları
htop

# Port kontrolü
netstat -tulpn | grep 25565

# Logları izle
tail -f logs/latest.log
```

---

## 🔧 Server Komutları

```
/op oyuncu          # Admin yetkisi
/whitelist add      # Whitelist'e ekle
/ban oyuncu         # Yasakla
/kick oyuncu        # At
/stop               # Sunucuyu kapat
/save-all           # Kaydet
/list               # Oyuncuları listele
```

---

## ❓ Sorun Giderme

### Oyuncular bağlanamıyor

```bash
# Firewall kontrolü
sudo ufw status

# Port açık mı?
netstat -tulpn | grep 25565
```

### RAM yetersiz

```bash
nano start.sh
# MAX_RAM'i artır
```

### Crash oluyor

```bash
cat logs/latest.log
```

---

**Server IP: 194.105.5.37:25565**

**Başarılar! 🎮**
