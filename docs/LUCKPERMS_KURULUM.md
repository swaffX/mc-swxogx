# 🔐 LuckPerms Kurulum Rehberi

## Genel Bakış

LuckPerms, Minecraft'ta izin yönetimi için en popüler plugin'dir. Web panelden verilen roller, LuckPerms sayesinde Minecraft'ta gerçek izinlere dönüşür.

## 📥 Kurulum

### 1. LuckPerms İndir

```bash
cd /opt/minecraft/plugins
wget https://download.luckperms.net/1563/bukkit/loader/LuckPerms-Bukkit-5.4.145.jar
```

Veya manuel:
1. https://luckperms.net/download adresine git
2. **Bukkit/Spigot** versiyonunu indir
3. `plugins/` klasörüne koy

### 2. Sunucuyu Restart Et

```bash
pm2 restart minecraft
```

### 3. Kurulumu Kontrol Et

Minecraft'ta `/lp` komutunu çalıştır. Eğer LuckPerms menüsü açılırsa kurulum başarılı!

## 🎭 Rol İzinleri

Web panelden rol atandığında, otomatik olarak şu izinler verilir:

### 👑 Admin
```
- luckperms.user.permission.set (izin yönetimi)
- minecraft.command.gamemode (oyun modu değiştirme)
- minecraft.command.give (item verme)
- minecraft.command.tp (teleport)
- minecraft.command.kick (oyuncu atma)
- minecraft.command.ban (ban)
- essentials.fly (uçma)
- essentials.god (ölümsüzlük)
- essentials.heal (can yenileme)
- essentials.feed (açlık giderme)
```

**Komutlar:**
- `/gamemode creative` - Yaratıcı mod
- `/give @s diamond 64` - 64 elmas ver
- `/tp PlayerName` - Oyuncuya ışınlan
- `/kick PlayerName` - Oyuncuyu at
- `/fly` - Uçmayı aç/kapat
- `/god` - Ölümsüzlük
- `/heal` - Canını doldur
- `/feed` - Açlığını gider

### 🛡️ Moderator
```
- minecraft.command.kick (oyuncu atma)
- minecraft.command.tp (teleport)
- essentials.fly (uçma)
- essentials.heal (can yenileme)
```

**Komutlar:**
- `/kick PlayerName` - Oyuncuyu at
- `/tp PlayerName` - Oyuncuya ışınlan
- `/fly` - Uçmayı aç/kapat
- `/heal` - Canını doldur

### 💎 VIP
```
- essentials.fly (uçma)
- essentials.heal (can yenileme)
- essentials.feed (açlık giderme)
- essentials.home.3 (3 ev kurma)
```

**Komutlar:**
- `/fly` - Uçmayı aç/kapat
- `/heal` - Canını doldur
- `/feed` - Açlığını gider
- `/sethome [name]` - Ev kur (max 3)
- `/home [name]` - Eve ışınlan

### 🎮 Player
```
- minecraft.command.help (yardım)
- essentials.home.1 (1 ev kurma)
```

**Komutlar:**
- `/help` - Yardım menüsü
- `/sethome` - Ev kur (max 1)
- `/home` - Eve ışınlan

## 🔧 Manuel Komutlar

### Rol Verme (Manuel)
```bash
/lp user SwxOgx parent set vip
```

### İzin Verme (Manuel)
```bash
/lp user SwxOgx permission set essentials.fly true
```

### İzin Kaldırma
```bash
/lp user SwxOgx permission unset essentials.fly
```

### Tüm İzinleri Temizle
```bash
/lp user SwxOgx clear
```

### Kullanıcı Bilgisi
```bash
/lp user SwxOgx info
```

### Grup Oluşturma
```bash
/lp creategroup vip
/lp group vip permission set essentials.fly true
```

## 🌐 Web Panel Entegrasyonu

Web panelden rol atandığında, backend otomatik olarak şu komutları çalıştırır:

```javascript
// 1. Eski izinleri temizle
lp user PlayerName clear

// 2. Yeni izinleri ekle
lp user PlayerName permission set essentials.fly true
lp user PlayerName permission set essentials.heal true
// ... diğer izinler

// 3. Grubu ayarla
lp user PlayerName parent set vip

// 4. Bildirim gönder
tellraw @a {"text":"[PANEL] PlayerName oyuncusuna VIP rolü verildi!","color":"light_purple","bold":true}
```

## 📊 Essentials Plugin (Opsiyonel)

LuckPerms ile birlikte **EssentialsX** plugin'i kullanılırsa daha fazla komut kullanılabilir:

### Kurulum
```bash
cd /opt/minecraft/plugins
wget https://github.com/EssentialsX/Essentials/releases/download/2.20.1/EssentialsX-2.20.1.jar
pm2 restart minecraft
```

### Essentials Komutları
- `/fly` - Uçma
- `/heal` - Can yenileme
- `/feed` - Açlık giderme
- `/god` - Ölümsüzlük
- `/home` - Eve ışınlanma
- `/sethome` - Ev kurma
- `/warp` - Warp noktalarına ışınlanma
- `/tpa` - Oyuncuya ışınlanma isteği

## 🚨 Sorun Giderme

### LuckPerms komutları çalışmıyor

**Kontrol 1:** Plugin yüklü mü?
```bash
ls -la /opt/minecraft/plugins/ | grep LuckPerms
```

**Kontrol 2:** Sunucu loglarını kontrol et
```bash
pm2 logs minecraft | grep LuckPerms
```

**Kontrol 3:** RCON bağlantısı çalışıyor mu?
```bash
telnet localhost 25575
```

### İzinler verilmiyor

**Kontrol 1:** Web panelden rol atandı mı?
- Dashboard → Role Manager → Rol seç

**Kontrol 2:** Backend loglarını kontrol et
```bash
pm2 logs server | grep "Role assigned"
```

**Kontrol 3:** Minecraft'ta manuel kontrol et
```bash
/lp user PlayerName info
```

### Fly çalışmıyor

**Sebep:** `allow-flight=false` olabilir

**Çözüm:**
```bash
# server.properties
allow-flight=true

# Restart
pm2 restart minecraft
```

## 📝 Önemli Notlar

1. **LuckPerms zorunlu değil** - Ama olmadan komutlar çalışmaz
2. **Essentials opsiyonel** - Ama daha fazla komut sağlar
3. **Web panel otomatik** - Rol atandığında izinler otomatik verilir
4. **Manuel yönetim mümkün** - `/lp` komutlarıyla manuel de yönetilebilir

## 🔗 Faydalı Linkler

- **LuckPerms:** https://luckperms.net/
- **LuckPerms Wiki:** https://luckperms.net/wiki/
- **EssentialsX:** https://essentialsx.net/
- **Komut Listesi:** https://luckperms.net/wiki/Command-Usage

---

**Son Güncelleme:** 21 Aralık 2024  
**Versiyon:** 1.0.0
