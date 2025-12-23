# 🚀 VPS Komutları - NeoForge 1.21.1

## Hızlı Kurulum

```bash
# 1. Sunucuyu durdur
pm2 stop minecraft
pm2 delete minecraft

# 2. Ana dizine git
cd /opt/minecraft

# 3. Eski dosyaları temizle
rm -rf libraries/ versions/
rm -f server.jar run.sh run.bat forge-*.jar *.log

# 4. NeoForge'u kur (installer zaten yüklü)
java -jar neoforge-21.1.64-installer.jar --installServer

# 5. EULA kabul et
echo "eula=true" > eula.txt

# 6. Mods klasörü oluştur
mkdir -p mods

# 7. user_jvm_args.txt oluştur
echo "# Custom JVM args" > user_jvm_args.txt

# 8. Sunucuyu başlat
pm2 start ecosystem.config.js --only minecraft

# 9. Logları izle
pm2 logs minecraft
```

## Mod Kurulumu

```bash
# Mod scripti çalıştır
chmod +x scripts/install-neoforge-mods.sh
./scripts/install-neoforge-mods.sh

# Sunucuyu restart et
pm2 restart minecraft
```

## Önemli Komutlar

```bash
# Sunucu durumu
pm2 status

# Logları izle
pm2 logs minecraft

# Sunucu restart
pm2 restart minecraft

# Sunucu durdur
pm2 stop minecraft

# Web API başlat
pm2 start ecosystem.config.js --only minecraft-api
```

## Dosya Konumları

- **Mods:** `/opt/minecraft/mods/`
- **Config:** `/opt/minecraft/config/`
- **World:** `/opt/minecraft/world/`
- **Logs:** `/opt/minecraft/logs/`

## Erişim Bilgileri

- **Minecraft:** `194.105.5.37:25565`
- **Web Panel:** `http://swxogx.mooo.com`
- **Versiyon:** NeoForge 1.21.1 (21.1.64)
