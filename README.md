# 🎮 Minecraft Server 1.21.10 - Production Setup

Ubuntu VPS için optimize edilmiş Minecraft Paper sunucusu kurulum paketi.

## 📋 Özellikler

- ✅ **Paper 1.21.1** sunucu desteği
- ✅ **8GB RAM** için optimize edilmiş JVM ayarları
- ✅ **Otomatik kurulum** scriptleri
- ✅ **Systemd service** desteği
- ✅ **Otomatik yedekleme** sistemi
- ✅ **TimeHUD Plugin** - Oyun içi saat göstergesi
- ✅ **Performans optimizasyonları**

---

## 🚀 Hızlı Kurulum

### 1. Dosyaları VPS'e Yükle

```bash
git clone https://github.com/KULLANICI_ADIN/minecraft-server.git
cd minecraft-server
scp -r * root@VPS_IP:/opt/minecraft/
```

### 2. VPS'te Kurulumu Başlat

```bash
ssh root@VPS_IP
cd /opt/minecraft
chmod +x install.sh start.sh backup.sh
./install.sh
```

### 3. Sunucuyu Başlat

```bash
# Screen ile (önerilir)
screen -dmS minecraft ./start.sh

# Veya Systemd ile
sudo systemctl start minecraft
```

---

## 📦 İçerik

### Kurulum Scriptleri

- **install.sh** - Otomatik kurulum (Java 21, firewall, screen)
- **start.sh** - Sunucu başlatma (optimizasyonlu, auto-restart)
- **backup.sh** - Yedekleme scripti
- **minecraft.service** - Systemd service dosyası

### Yapılandırma

- **server.properties** - Sunucu ayarları (8GB RAM için optimize)
- **eula.txt** - EULA kabul dosyası

### Plugin

- **plugins/TimeHUD/** - Oyun içi saat göstergesi plugin
  - Türkçe arayüz
  - Ekranın sağ tarafında HUD
  - Gerçek zamanlı güncelleme

### Dokümantasyon

- **README.md** - Hızlı başlangıç
- **PLUGIN_KURULUM.md** - Plugin kurulum rehberi
- **PERFORMANS_NOTLARI.md** - Performans optimizasyonları

---

## ⚙️ Sistem Gereksinimleri

- **OS:** Ubuntu 20.04/22.04/24.04 LTS
- **RAM:** Minimum 4GB (8GB+ önerilir)
- **Disk:** 10GB+ boş alan
- **Java:** 21 (otomatik kurulur)
- **Port:** 25565 (TCP)

---

## 🎮 Sunucu Bilgileri

- **Versiyon:** Minecraft 1.21.10 (Paper 1.21.1)
- **Port:** 25565
- **Max Players:** 20 (ayarlanabilir)
- **View Distance:** 12
- **Simulation Distance:** 8

---

## 🔧 Kullanım

### Sunucu Yönetimi

```bash
# Başlat
screen -dmS minecraft ./start.sh

# Konsola bağlan
screen -r minecraft

# Konsoldan çık (Ctrl+A, D)

# Durdur (konsol içinde)
stop
```

### Systemd Service

```bash
# Service'i kur
sudo cp minecraft.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable minecraft

# Yönetim
sudo systemctl start minecraft
sudo systemctl stop minecraft
sudo systemctl restart minecraft
sudo systemctl status minecraft
```

### Yedekleme

```bash
# Manuel yedekleme
./backup.sh

# Otomatik yedekleme (cron)
crontab -e
# Her gün saat 03:00
0 3 * * * /opt/minecraft/backup.sh
```

---

## 🎨 TimeHUD Plugin

Oyun içi saat göstergesi plugin'i. Ekranın sağ tarafında görünür.

### Görünüm

```
━━━━━━━━━━━━━━━
⏰ SUNUCU BİLGİ
━━━━━━━━━━━━━━━

Saat:
 15:22

Zaman Dilimi:
 ☀ Öğleden Sonra

━━━━━━━━━━━━━━━
```

### Komutlar

```
/timehud        - HUD'u aç/kapat
/timehud aç     - HUD'u aç
/timehud kapat  - HUD'u kapat
```

### Plugin'i Derle

```bash
cd plugins/TimeHUD
mvn clean package
cp target/TimeHUD-1.0.0.jar /opt/minecraft/plugins/
```

---

## 📊 Performans Ayarları

### RAM Ayarları (start.sh)

```bash
# 4GB VPS
MIN_RAM="1G"
MAX_RAM="3G"

# 8GB VPS (varsayılan)
MIN_RAM="4G"
MAX_RAM="7G"

# 16GB VPS
MIN_RAM="4G"
MAX_RAM="12G"
```

### Server.properties Optimizasyonları

```properties
view-distance=12
simulation-distance=8
sync-chunk-writes=false
network-compression-threshold=512
max-tick-time=120000
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

## 📁 Dizin Yapısı

```
minecraft-server/
├── install.sh                  # Kurulum scripti
├── start.sh                    # Başlatma scripti
├── backup.sh                   # Yedekleme scripti
├── minecraft.service           # Systemd service
├── server.properties           # Sunucu ayarları
├── eula.txt                    # EULA
├── plugins/
│   └── TimeHUD/               # Saat HUD plugin
│       ├── pom.xml
│       └── src/
└── docs/
    ├── PLUGIN_KURULUM.md
    └── PERFORMANS_NOTLARI.md
```

---

## 🔄 Güncelleme

### Paper Güncelleme

```bash
cd /opt/minecraft
curl -o server.jar https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/LATEST/downloads/paper-1.21.1-LATEST.jar
screen -r minecraft
stop
screen -dmS minecraft ./start.sh
```

### Plugin Güncelleme

```bash
cd plugins/TimeHUD
git pull
mvn clean package
cp target/TimeHUD-1.0.0.jar /opt/minecraft/plugins/
screen -r minecraft
reload
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
# start.sh'de MAX_RAM'i artır
nano start.sh
```

### Plugin çalışmıyor

```bash
# Log'ları kontrol et
tail -f logs/latest.log

# Plugin listesi
screen -r minecraft
plugins
```

---

## � DPaper Server Hakkında

### Paper Nedir?

**Paper**, Minecraft'ın vanilla sunucusunun optimize edilmiş bir versiyonudur. Spigot'un fork'udur ve şu avantajları sunar:

- ⚡ **Daha İyi Performans:** Vanilla'ya göre %30-50 daha az lag
- 🔌 **Plugin Desteği:** Binlerce hazır plugin kullanabilirsiniz
- 🛠️ **API:** Kendi plugin'lerinizi geliştirebilirsiniz
- 🔧 **Yapılandırma:** Daha fazla özelleştirme seçeneği
- 🐛 **Bug Fixes:** Vanilla'daki hatalar düzeltilmiş
- 🔄 **Geriye Uyumlu:** Vanilla world'leri sorunsuz çalışır

### Paper vs Vanilla

| Özellik | Vanilla | Paper |
|---------|---------|-------|
| Plugin Desteği | ❌ | ✅ |
| Performans | Orta | Yüksek |
| TPS Optimizasyonu | ❌ | ✅ |
| Chunk Loading | Yavaş | Hızlı |
| Mob AI | Ağır | Optimize |
| Özelleştirme | Sınırlı | Gelişmiş |

### Paper Yapılandırması

Paper, ek yapılandırma dosyaları sunar:

```
paper-global.yml    # Global ayarlar
paper-world-defaults.yml    # World ayarları
```

**Önemli Ayarlar:**

```yaml
# paper-global.yml
chunk-loading:
  max-concurrent-sends: 2
  target-player-chunk-send-rate: 100

# paper-world-defaults.yml
entities:
  spawning:
    all-chunks-are-slime-chunks: false
  behavior:
    disable-chest-cat-detection: true
```

---

## 🎨 Plugin Geliştirme Rehberi

### Gereksinimler

- **Java 21** - OpenJDK veya Oracle JDK
- **Maven** - Proje yönetimi ve derleme
- **IDE** - IntelliJ IDEA (önerilir) veya Eclipse
- **Paper API** - Plugin geliştirme için

### Maven Kurulumu

**Windows:**
```powershell
choco install maven
```

**Ubuntu:**
```bash
sudo apt install maven -y
```

**Kontrol:**
```bash
mvn -version
```

---

### Plugin Yapısı

```
TimeHUD/
├── pom.xml                          # Maven yapılandırması
└── src/
    └── main/
        ├── java/
        │   └── com/server/timehud/
        │       ├── TimeHUD.java           # Ana plugin sınıfı
        │       └── TimeHUDCommand.java    # Komut handler
        └── resources/
            └── plugin.yml                 # Plugin metadata
```

---

### pom.xml Açıklaması

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <!-- Proje bilgileri -->
    <groupId>com.server</groupId>
    <artifactId>TimeHUD</artifactId>
    <version>1.0.0</version>
    
    <!-- Java versiyonu -->
    <properties>
        <java.version>21</java.version>
    </properties>
    
    <!-- Paper API dependency -->
    <dependencies>
        <dependency>
            <groupId>io.papermc.paper</groupId>
            <artifactId>paper-api</artifactId>
            <version>1.21-R0.1-SNAPSHOT</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
    
    <!-- Maven repository -->
    <repositories>
        <repository>
            <id>papermc-repo</id>
            <url>https://repo.papermc.io/repository/maven-public/</url>
        </repository>
    </repositories>
</project>
```

**Önemli Noktalar:**
- `scope>provided</scope>` - Paper API sunucuda zaten var, JAR'a dahil etme
- `paper-api` - Sadece API, sunucu kodu değil (hafif)

---

### plugin.yml Açıklaması

```yaml
name: TimeHUD                    # Plugin adı (benzersiz olmalı)
version: 1.0.0                   # Versiyon
main: com.server.timehud.TimeHUD # Ana sınıf (tam yol)
api-version: 1.21                # Minecraft API versiyonu
author: Server                   # Geliştirici
description: Oyuncu HUD'unda sunucu saatini gösterir

# Komutlar
commands:
  timehud:
    description: Zaman HUD'unu aç/kapat
    usage: /timehud [aç|kapat]
    aliases: [zamanHUD, saat]    # Alternatif komutlar
    permission: timehud.toggle

# İzinler
permissions:
  timehud.toggle:
    description: Zaman HUD'unu açma/kapatma izni
    default: true                # true = herkes, op = sadece OP'ler
```

---

### Ana Plugin Sınıfı

```java
package com.server.timehud;

import org.bukkit.plugin.java.JavaPlugin;

public class TimeHUD extends JavaPlugin {
    
    @Override
    public void onEnable() {
        // Plugin yüklendiğinde çalışır
        getLogger().info("TimeHUD plugin enabled!");
        
        // Komut kaydet
        getCommand("timehud").setExecutor(new TimeHUDCommand(this));
        
        // Task başlat (her saniye çalışır)
        new BukkitRunnable() {
            @Override
            public void run() {
                // HUD güncelleme kodu
            }
        }.runTaskTimer(this, 0L, 20L); // 20 tick = 1 saniye
    }
    
    @Override
    public void onDisable() {
        // Plugin kapatılırken çalışır
        getLogger().info("TimeHUD plugin disabled!");
    }
}
```

**Önemli Metodlar:**
- `onEnable()` - Plugin başlatılırken
- `onDisable()` - Plugin kapatılırken
- `getLogger()` - Console'a log yazmak için
- `getCommand()` - Komut kaydetmek için

---

### Scoreboard (HUD) Sistemi

Minecraft'ta ekranın sağında HUD göstermek için **Scoreboard API** kullanılır:

```java
// Scoreboard oluştur
ScoreboardManager manager = Bukkit.getScoreboardManager();
Scoreboard scoreboard = manager.getNewScoreboard();

// Objective oluştur (başlık)
Objective objective = scoreboard.registerNewObjective(
    "timehud",                                    // ID (benzersiz)
    "dummy",                                      // Criteria (dummy = manuel)
    ChatColor.GOLD + "⏰ SUNUCU BİLGİ"           // Başlık (renkli)
);

// Sidebar'da göster (sağ taraf)
objective.setDisplaySlot(DisplaySlot.SIDEBAR);

// Satır ekle (skor = sıralama, yüksek = üstte)
Score line1 = objective.getScore("Saat:");
line1.setScore(5);

Score line2 = objective.getScore("15:22");
line2.setScore(4);

// Oyuncuya göster
player.setScoreboard(scoreboard);
```

**DisplaySlot Seçenekleri:**
- `SIDEBAR` - Sağ taraf (HUD)
- `PLAYER_LIST` - Tab listesi (oyuncu adlarının yanı)
- `BELOW_NAME` - Oyuncu adının altı

**Renk Kodları:**
```java
ChatColor.GOLD        // Altın sarısı
ChatColor.AQUA        // Açık mavi
ChatColor.WHITE       // Beyaz
ChatColor.GRAY        // Gri
ChatColor.BOLD        // Kalın
```

---

### Event Sistemi

Plugin'ler event'leri dinleyerek oyun olaylarına tepki verir:

```java
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public class JoinListener implements Listener {
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        player.sendMessage("Hoş geldin!");
    }
}

// Ana sınıfta kaydet
getServer().getPluginManager().registerEvents(new JoinListener(), this);
```

**Popüler Event'ler:**
- `PlayerJoinEvent` - Oyuncu giriş yaptı
- `PlayerQuitEvent` - Oyuncu çıktı
- `PlayerMoveEvent` - Oyuncu hareket etti
- `BlockBreakEvent` - Blok kırıldı
- `EntityDamageEvent` - Hasar alındı

---

### Plugin Derleme

```bash
# Plugin dizinine git
cd plugins/TimeHUD

# Derle (JAR oluştur)
mvn clean package

# Oluşan JAR
target/TimeHUD-1.0.0.jar
```

**Maven Komutları:**
- `mvn clean` - Eski derlemeleri temizle
- `mvn compile` - Sadece derle
- `mvn package` - Derle ve JAR oluştur
- `mvn install` - Local Maven repo'ya kur

---

### Plugin Test Etme

```bash
# JAR'ı plugins klasörüne kopyala
cp target/TimeHUD-1.0.0.jar /opt/minecraft/plugins/

# Sunucuyu yeniden başlat veya reload
screen -r minecraft
reload

# Plugin listesini kontrol et
plugins

# Log'ları izle
tail -f logs/latest.log
```

**Debug İpuçları:**
- `getLogger().info()` - Bilgi mesajı
- `getLogger().warning()` - Uyarı
- `getLogger().severe()` - Hata
- `e.printStackTrace()` - Exception detayları

---

### Gelişmiş Özellikler

#### 1. Config Dosyası

```java
// config.yml oluştur
saveDefaultConfig();

// Değer oku
int updateInterval = getConfig().getInt("update-interval", 20);
String message = getConfig().getString("welcome-message");

// Değer yaz
getConfig().set("player-count", 10);
saveConfig();
```

#### 2. Database (SQLite)

```java
// JDBC dependency ekle (pom.xml)
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.45.0.0</version>
</dependency>

// Bağlantı
Connection conn = DriverManager.getConnection(
    "jdbc:sqlite:plugins/TimeHUD/data.db"
);
```

#### 3. Async Task (Ağır işlemler için)

```java
// Ana thread'i bloklamaz
Bukkit.getScheduler().runTaskAsynchronously(this, () -> {
    // Ağır işlem (database, API call)
});
```

---

### Yararlı Kaynaklar

- **Paper API Docs:** https://jd.papermc.io/paper/1.21/
- **Spigot Wiki:** https://www.spigotmc.org/wiki/
- **Bukkit API:** https://hub.spigotmc.org/javadocs/bukkit/
- **Plugin Örnekleri:** https://github.com/PaperMC/Paper/tree/master/test-plugin

---

## � Geüvenlik ve IP Yönetimi

### VPS IP'sini Gizleme

**Sorun:** VPS IP'si (194.105.5.37) public olarak paylaşılırsa güvenlik riski oluşur.

**Çözümler:**

#### 1. Domain Kullanımı (Önerilir)

Domain satın alın ve IP'yi gizleyin:

```bash
# Domain: minecraft.example.com
# Gerçek IP: 194.105.5.37 (gizli kalır)
```

**Adımlar:**

1. **Domain Satın Al** (Namecheap, GoDaddy, Cloudflare)
2. **DNS A Kaydı Ekle:**
   ```
   Type: A
   Name: @ veya mc
   Value: 194.105.5.37
   TTL: 3600
   ```
3. **Oyuncular Bağlanır:**
   ```
   minecraft.example.com:25565
   ```

**Avantajlar:**
- ✅ IP gizli kalır
- ✅ IP değişirse sadece DNS güncellenir
- ✅ Profesyonel görünüm
- ✅ DDoS koruması (Cloudflare ile)

---

#### 2. Cloudflare Spectrum (DDoS Koruması)

Cloudflare üzerinden Minecraft trafiğini yönlendir:

1. **Cloudflare'e domain ekle**
2. **Spectrum'u aktifleştir** (Pro plan gerekli)
3. **Minecraft uygulaması oluştur:**
   ```
   Protocol: TCP
   Port: 25565
   Origin: 194.105.5.37:25565
   ```

**Avantajlar:**
- ✅ DDoS koruması
- ✅ IP tamamen gizli
- ✅ Trafik filtreleme

---

#### 3. SRV Kaydı (Port Gizleme)

Port numarasını da gizle:

```
Type: SRV
Service: _minecraft
Protocol: _tcp
Priority: 0
Weight: 5
Port: 25565
Target: mc.example.com
```

**Oyuncular bağlanır:**
```
example.com  (port yazmadan!)
```

---

### SSH Güvenliği

VPS'e SSH erişimini güvenli hale getir:

#### 1. SSH Port Değiştir

```bash
# SSH config düzenle
sudo nano /etc/ssh/sshd_config

# Port değiştir
Port 2222  # 22 yerine

# Root login kapat
PermitRootLogin no

# Şifre ile giriş kapat (SSH key kullan)
PasswordAuthentication no

# Restart
sudo systemctl restart sshd
```

**Yeni bağlantı:**
```bash
ssh -p 2222 kullanici@194.105.5.37
```

---

#### 2. SSH Key Kullan (Şifre Yerine)

**Local'de key oluştur:**
```powershell
ssh-keygen -t ed25519 -C "minecraft-server"
```

**Public key'i VPS'e kopyala:**
```powershell
scp ~/.ssh/id_ed25519.pub root@194.105.5.37:/root/.ssh/authorized_keys
```

**Artık şifresiz giriş:**
```bash
ssh root@194.105.5.37
```

---

#### 3. Fail2ban (Brute Force Koruması)

```bash
# Kur
sudo apt install fail2ban -y

# Yapılandır
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 3600
```

```bash
# Başlat
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

### Firewall Kuralları

Sadece gerekli portları aç:

```bash
# Varsayılan: Tüm gelen trafiği reddet
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Minecraft
sudo ufw allow 25565/tcp

# SSH (değiştirilmiş port)
sudo ufw allow 2222/tcp

# Aktifleştir
sudo ufw enable

# Kontrol
sudo ufw status
```

---

### IP Whitelist (Opsiyonel)

Sadece belirli IP'lerden SSH'ye izin ver:

```bash
# Sadece kendi IP'nden SSH
sudo ufw allow from KENDI_IP_N to any port 2222

# Minecraft herkese açık
sudo ufw allow 25565/tcp
```

---

### README.md'de IP Gizleme

GitHub'a yüklerken IP'yi gizle:

**Kötü:**
```markdown
Server IP: 194.105.5.37:25565
```

**İyi:**
```markdown
Server IP: YOUR_VPS_IP:25565
# veya
Server IP: minecraft.example.com:25565
```

**Otomatik değiştirme:**
```bash
# Tüm dosyalarda IP'yi değişken yap
find . -type f -name "*.md" -exec sed -i 's/194.105.5.37/YOUR_VPS_IP/g' {} +
```

---

### Güvenlik Kontrol Listesi

- [ ] SSH port değiştirildi (22 → 2222)
- [ ] Root login kapatıldı
- [ ] SSH key kullanılıyor
- [ ] Fail2ban kuruldu
- [ ] Firewall yapılandırıldı
- [ ] Domain kullanılıyor (IP gizli)
- [ ] DDoS koruması aktif (Cloudflare)
- [ ] README.md'de IP gizlendi
- [ ] Otomatik güncellemeler aktif
- [ ] Yedekleme sistemi çalışıyor

---

## 🛠️ Script Oluşturma Rehberi

### Bash Script Temelleri

#### 1. Script Yapısı

```bash
#!/bin/bash
# Script açıklaması
# Yazar: İsim
# Tarih: 2025-12-20

# Renkler (opsiyonel)
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonksiyonlar
function hata_mesaji() {
    echo -e "${RED}HATA: $1${NC}"
    exit 1
}

function basarili_mesaji() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Ana kod
echo "Script başladı..."

# Hata kontrolü
if [ ! -f "server.jar" ]; then
    hata_mesaji "server.jar bulunamadı!"
fi

basarili_mesaji "İşlem tamamlandı!"
```

---

#### 2. Değişkenler

```bash
# String
SUNUCU_ADI="Minecraft Server"
VPS_IP="194.105.5.37"

# Sayı
MAX_RAM="7G"
PORT=25565

# Komut çıktısı
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')

# Kullanıcı input
read -p "Sunucu adını girin: " SUNUCU_ADI
```

---

#### 3. Koşullar

```bash
# Dosya kontrolü
if [ -f "server.jar" ]; then
    echo "Server.jar mevcut"
elif [ -f "paper.jar" ]; then
    echo "Paper.jar mevcut"
else
    echo "JAR dosyası bulunamadı!"
    exit 1
fi

# Sayı karşılaştırma
if [ $RAM -lt 4 ]; then
    echo "RAM yetersiz!"
fi

# String karşılaştırma
if [ "$OS" == "Ubuntu" ]; then
    echo "Ubuntu tespit edildi"
fi

# Komut başarılı mı?
if command -v java &> /dev/null; then
    echo "Java kurulu"
fi
```

---

#### 4. Döngüler

```bash
# For döngüsü
for i in {1..5}; do
    echo "Sayı: $i"
done

# Dosyalar üzerinde
for file in *.jar; do
    echo "JAR: $file"
done

# While döngüsü
while true; do
    echo "Sunucu çalışıyor..."
    sleep 60
done
```

---

#### 5. Fonksiyonlar

```bash
# Basit fonksiyon
function selamla() {
    echo "Merhaba $1!"
}

selamla "Dünya"  # Çıktı: Merhaba Dünya!

# Return değeri
function topla() {
    local sonuc=$(($1 + $2))
    echo $sonuc
}

TOPLAM=$(topla 5 3)
echo "Toplam: $TOPLAM"  # 8
```

---

### Minecraft Script Örnekleri

#### 1. Otomatik Yedekleme Scripti

```bash
#!/bin/bash
# Minecraft Otomatik Yedekleme

BACKUP_DIR="$HOME/minecraft-backups"
SERVER_DIR="/opt/minecraft"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="minecraft-backup-${DATE}.tar.gz"

# Yedekleme dizini oluştur
mkdir -p ${BACKUP_DIR}

# Sunucu konsoluna mesaj gönder
screen -S minecraft -p 0 -X stuff "say Yedekleme başlıyor...^M"

# Dünyayı kaydet
screen -S minecraft -p 0 -X stuff "save-all^M"
sleep 5

# Yedekle
tar -czf ${BACKUP_DIR}/${BACKUP_NAME} \
    -C ${SERVER_DIR} \
    world/ world_nether/ world_the_end/ \
    server.properties ops.json whitelist.json

# Eski yedekleri sil (7 günden eski)
find ${BACKUP_DIR} -name "minecraft-backup-*.tar.gz" -mtime +7 -delete

# Mesaj
screen -S minecraft -p 0 -X stuff "say Yedekleme tamamlandı!^M"

echo "Yedek: ${BACKUP_DIR}/${BACKUP_NAME}"
```

---

#### 2. Sunucu Restart Scripti

```bash
#!/bin/bash
# Minecraft Restart Script

SCREEN_NAME="minecraft"
SERVER_DIR="/opt/minecraft"

# Uyarı mesajları
for i in 60 30 10 5; do
    screen -S ${SCREEN_NAME} -p 0 -X stuff "say Sunucu ${i} saniye içinde yeniden başlatılacak!^M"
    sleep $((i - (i > 10 ? 10 : 5)))
done

# Sunucuyu durdur
screen -S ${SCREEN_NAME} -p 0 -X stuff "stop^M"
sleep 10

# Yeniden başlat
cd ${SERVER_DIR}
screen -dmS ${SCREEN_NAME} ./start.sh

echo "Sunucu yeniden başlatıldı!"
```

---

#### 3. Performans İzleme Scripti

```bash
#!/bin/bash
# Minecraft Performans İzleme

LOG_FILE="/opt/minecraft/performance.log"

while true; do
    # CPU kullanımı
    CPU=$(ps aux | grep java | grep -v grep | awk '{print $3}')
    
    # RAM kullanımı
    RAM=$(ps aux | grep java | grep -v grep | awk '{print $4}')
    
    # Disk kullanımı
    DISK=$(df -h /opt/minecraft | tail -1 | awk '{print $5}')
    
    # TPS (sunucu konsolundan)
    # Not: Bu kısım plugin gerektirir
    
    # Log'a yaz
    echo "$(date) - CPU: ${CPU}% RAM: ${RAM}% DISK: ${DISK}" >> ${LOG_FILE}
    
    # Uyarı (CPU %90'ın üstünde)
    if (( $(echo "$CPU > 90" | bc -l) )); then
        echo "UYARI: CPU kullanımı yüksek!"
    fi
    
    sleep 60
done
```

---

#### 4. Plugin Güncelleme Scripti

```bash
#!/bin/bash
# Plugin Otomatik Güncelleme

PLUGIN_DIR="/opt/minecraft/plugins"
GITHUB_REPO="kullanici/minecraft-plugin"
PLUGIN_NAME="MyPlugin"

# En son release'i indir
LATEST_URL=$(curl -s https://api.github.com/repos/${GITHUB_REPO}/releases/latest \
    | grep "browser_download_url.*jar" \
    | cut -d '"' -f 4)

# İndir
wget -O ${PLUGIN_DIR}/${PLUGIN_NAME}.jar ${LATEST_URL}

# Sunucuyu reload et
screen -S minecraft -p 0 -X stuff "reload^M"

echo "Plugin güncellendi: ${PLUGIN_NAME}"
```

---

### Script İzinleri

```bash
# Çalıştırılabilir yap
chmod +x script.sh

# Sadece owner çalıştırabilir
chmod 700 script.sh

# Herkes okuyabilir, sadece owner çalıştırabilir
chmod 755 script.sh
```

---

### Cron ile Otomatik Çalıştırma

```bash
# Crontab düzenle
crontab -e

# Her gün saat 03:00'te yedek al
0 3 * * * /opt/minecraft/backup.sh

# Her 6 saatte bir restart
0 */6 * * * /opt/minecraft/restart.sh

# Her dakika performans izle
* * * * * /opt/minecraft/monitor.sh

# Her Pazar 04:00'te güncelleme
0 4 * * 0 /opt/minecraft/update.sh
```

**Cron Format:**
```
* * * * * komut
│ │ │ │ │
│ │ │ │ └─── Haftanın günü (0-7, 0=Pazar)
│ │ │ └───── Ay (1-12)
│ │ └─────── Ayın günü (1-31)
│ └───────── Saat (0-23)
└─────────── Dakika (0-59)
```

---

### Hata Ayıklama

```bash
# Debug mode
bash -x script.sh

# Log'a yaz
./script.sh > output.log 2>&1

# Sadece hataları logla
./script.sh 2> error.log

# Her şeyi logla
./script.sh &> full.log
```

---

### Script Şablonu (Template)

```bash
#!/bin/bash
#
# Script Adı: minecraft-tool.sh
# Açıklama: Minecraft sunucu yönetim aracı
# Yazar: İsim
# Tarih: 2025-12-20
# Versiyon: 1.0.0
#

set -e  # Hata olursa dur
set -u  # Tanımsız değişken kullanma

# Renkler
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m'

# Sabitler
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SERVER_DIR="/opt/minecraft"
readonly LOG_FILE="${SERVER_DIR}/script.log"

# Fonksiyonlar
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

error() {
    echo -e "${RED}HATA: $*${NC}" >&2
    log "HATA: $*"
    exit 1
}

success() {
    echo -e "${GREEN}✓ $*${NC}"
    log "BAŞARILI: $*"
}

warning() {
    echo -e "${YELLOW}⚠ $*${NC}"
    log "UYARI: $*"
}

# Kontroller
check_requirements() {
    command -v java >/dev/null 2>&1 || error "Java kurulu değil!"
    [ -f "${SERVER_DIR}/server.jar" ] || error "server.jar bulunamadı!"
}

# Ana fonksiyon
main() {
    log "Script başlatıldı"
    check_requirements
    
    # İşlemler buraya
    
    success "İşlem tamamlandı"
}

# Scripti çalıştır
main "$@"
```

---

## 📞 Destek

- **Minecraft Wiki:** https://minecraft.wiki/
- **Paper Docs:** https://docs.papermc.io/
- **Issues:** GitHub Issues sekmesini kullanın

---

## 📝 Lisans

MIT License - Özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing`)
5. Pull Request açın

---

## ⭐ Yıldız Vermeyi Unutmayın!

Bu proje işinize yaradıysa yıldız vermeyi unutmayın! ⭐

---

**Başarılar! 🎮**
