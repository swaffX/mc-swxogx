# 🎮 Minecraft Plugins Klasörü

Bu klasör Minecraft server pluginlerini içerir.

## 📦 Plugin Kurulumu

### Otomatik Kurulum (Önerilen)

VPS'te şu komutu çalıştır:

```bash
cd /opt/minecraft
bash scripts/install-plugins.sh
```

Bu script şu pluginleri indirecek:
1. TreeAssist - Ağaç kesme
2. Slimefun4 - Teknik modlar
3. MythicMobs - Özel moblar
4. EliteMobs - Boss sistemi
5. WorldEdit - Yapı düzenleme
6. WorldGuard - Bölge koruma
7. Citizens - NPC sistemi
8. Denizen - NPC scripting
9. Brewery - İçki yapma
10. Chairs - Oturma sistemi
11. CustomCrafting - Özel craft'lar
12. WolfyUtilities - Dependency

### Manuel Kurulum

```bash
cd /opt/minecraft/plugins
wget <plugin_url> -O PluginName.jar
pm2 restart minecraft
```

## 📖 Dokümantasyon

Detaylı plugin rehberi için: `docs/PLUGIN_LISTESI.md`

## ⚠️ Önemli Notlar

- Plugin .jar dosyaları git'e commit edilmez (çok büyük)
- Her deployment sonrası `install-plugins.sh` çalıştırılmalı
- Plugin config dosyaları git'e commit edilir
- Yeni plugin eklemek için `install-plugins.sh` dosyasını düzenle

## 🔧 Plugin Yönetimi

### Plugin Listesi
```bash
# Oyun içinde
/plugins

# VPS'te
ls -lh /opt/minecraft/plugins/*.jar
```

### Plugin Reload
```bash
# Oyun içinde (bazı pluginler için)
/reload confirm

# Veya sunucuyu restart et
pm2 restart minecraft
```

### Plugin Kaldırma
```bash
cd /opt/minecraft/plugins
rm PluginName.jar
pm2 restart minecraft
```

## 📊 Plugin Durumu

Kurulu pluginleri kontrol et:
```bash
pm2 logs minecraft | grep -i "enabling"
```

## 🆘 Sorun Giderme

### Plugin yüklenmediyse:
```bash
# Loglara bak
pm2 logs minecraft | grep -i "error"

# Plugin dosyasını kontrol et
ls -lh /opt/minecraft/plugins/PluginName.jar

# Dosya bozuksa yeniden indir
cd /opt/minecraft/plugins
rm PluginName.jar
wget <plugin_url> -O PluginName.jar
pm2 restart minecraft
```

### Uyumluluk sorunları:
- Paper 1.21.1 kullanıyoruz
- Bazı pluginler 1.21.1'i desteklemeyebilir
- Alternatif plugin ara veya eski versiyona geç

## 🔗 Faydalı Linkler

- **SpigotMC:** https://www.spigotmc.org/resources/
- **Bukkit:** https://dev.bukkit.org/bukkit-plugins
- **Hangar (Paper):** https://hangar.papermc.io/
- **Modrinth:** https://modrinth.com/plugins

## 📝 Yeni Plugin Ekleme

1. `scripts/install-plugins.sh` dosyasını aç
2. Yeni plugin için wget satırı ekle:
   ```bash
   echo "🎮 [X/Y] PluginName - Description..."
   wget -q --show-progress <plugin_url> -O PluginName.jar
   ```
3. Script'i çalıştır
4. `docs/PLUGIN_LISTESI.md` dosyasını güncelle

## 🎯 Önerilen Ek Pluginler

Eğer daha fazla özellik istersen:
- **Vault** - Ekonomi API
- **ChestShop** - Mağaza sistemi
- **Dynmap** - Web haritası
- **DiscordSRV** - Discord entegrasyonu
- **CoreProtect** - Rollback sistemi
- **GriefPrevention** - Claim sistemi
