# 🚨 KRİTİK DURUM - 1.20.6 Downgrade Sorunları

## Sorunlar

### 1. Config Uyumsuzluğu ❌
```
Loading a newer configuration than is supported (31 > 29)
```
- `config/paper-world-defaults.yml` version 31 (1.21.1 formatı)
- 1.20.6 sadece version 29'u destekliyor
- **Çözüm**: Config dosyasını silip yeniden oluşturmak

### 2. TimeHUD Plugin Uyumsuzluğu ❌
```
Unsupported API version 1.21
```
- TimeHUD 1.21 için build edilmiş
- **Çözüm**: `plugin.yml`'de `api-version: 1.20` yapıp yeniden build

### 3. World Uyumsuzluğu ❌
```
Server attempted to load chunk saved with newer version of minecraft! 4556 > 3839
```
- World 1.21.1'de kaydedilmiş
- 1.20.6 bu chunk version'ı okuyamıyor
- **Çözüm**: World'ü yedekleyip silmek, yeni world oluşturmak

### 4. Boş Plugin Dosyaları ❌
- Birçok plugin .jar dosyası 0 byte (wget hataları)
- **Çözüm**: Boş dosyaları silmek

## Çalışan Pluginler ✅

- ✅ **Vault** v1.7.3-b131
- ✅ **Slimefun** vRC-37
- ✅ **Essentials** v2.21.2
- ✅ **SkinsRestorer** v15.9.1
- ⚠️ **TimeHUD** (rebuild gerekli)

## Hızlı Çözüm

VPS'de şu komutları çalıştır:

```bash
cd /opt/minecraft
chmod +x scripts/fix-downgrade-issues.sh
./scripts/fix-downgrade-issues.sh
pm2 restart minecraft
```

## Ne Olacak?

1. ✅ Config dosyaları yeniden oluşturulacak (1.20.6 uyumlu)
2. ✅ TimeHUD 1.20.6 için yeniden build edilecek
3. ⚠️ **Eski world yedeklenip silinecek** (yeni world oluşturulacak)
4. ✅ Boş plugin dosyaları temizlenecek
5. ✅ Sunucu 1.20.6'da çalışacak

## Alternatif: 1.21.1'e Geri Dön

Eğer world'ü kaybetmek istemiyorsan:

```bash
cd /opt/minecraft
# Eski server.jar'ı geri yükle
wget -O server.jar https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/129/downloads/paper-1.21.1-129.jar
pm2 restart minecraft
```

**Ama**: 1.21.1'de plugin desteği çok zayıf!

## Önerilen Çözüm

1. **1.20.6'da kal** (plugin desteği çok daha iyi)
2. Yeni world oluştur (eski world zaten yeni, oyuncular yok)
3. Pluginleri manuel indir ve yükle (wget çalışmıyor)

## Manuel Plugin İndirme

Wget çalışmadığı için pluginleri manuel indirmen gerekiyor:

1. **TreeAssist**: https://www.spigotmc.org/resources/treeassist.67436/
2. **WorldEdit**: https://dev.bukkit.org/projects/worldedit
3. **WorldGuard**: https://dev.bukkit.org/projects/worldguard
4. **Citizens**: https://www.spigotmc.org/resources/citizens.13811/
5. **MythicMobs**: https://mythiccraft.io/index.php?resources/mythicmobs.1/

İndirdikten sonra:
```bash
# Lokal bilgisayardan VPS'ye yükle
scp plugin.jar root@194.105.5.37:/opt/minecraft/plugins/
```
