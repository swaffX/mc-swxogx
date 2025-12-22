#!/bin/bash

echo "📦 Installing plugins for Minecraft 1.20.6..."
echo "Using curl with proper headers and redirects"
echo ""

cd /opt/minecraft/plugins

# Temizlik
echo "🧹 Cleaning old/empty plugin files..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

# curl parametreleri:
# -L = redirects'i takip et
# -o = output dosya adı
# -f = HTTP hata kodlarında fail et
# -s = sessiz mod
# -S = hata mesajlarını göster
# --retry 3 = 3 kez dene
# --retry-delay 2 = denemeler arası 2 saniye bekle

echo ""
echo "📥 Downloading plugins..."
echo ""

# 1. WorldEdit (1.20.6 uyumlu)
echo "⬇️  WorldEdit..."
curl -L -o WorldEdit.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://dev.bukkit.org/projects/worldedit/files/latest" || \
curl -L -o WorldEdit.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5391/411/worldedit-bukkit-7.3.0.jar"

# 2. WorldGuard (1.20.6 uyumlu)
echo "⬇️  WorldGuard..."
curl -L -o WorldGuard.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://dev.bukkit.org/projects/worldguard/files/latest" || \
curl -L -o WorldGuard.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5391/413/worldguard-bukkit-7.0.10.jar"

# 3. Citizens (1.20.6 uyumlu)
echo "⬇️  Citizens..."
curl -L -o Citizens.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://ci.citizensnpcs.co/job/Citizens2/lastSuccessfulBuild/artifact/dist/target/Citizens-2.0.35-b3570.jar"

# 4. TreeAssist (1.20.6 uyumlu)
echo "⬇️  TreeAssist..."
curl -L -o TreeAssist.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Silthus/TreeAssist/releases/download/v7.0.0/TreeAssist-7.0.0.jar"

# 5. ChestShop (1.20.6 uyumlu)
echo "⬇️  ChestShop..."
curl -L -o ChestShop.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/ChestShop-authors/ChestShop-3/releases/download/3.12.2/ChestShop.jar"

# 6. GriefPrevention (1.20.6 uyumlu)
echo "⬇️  GriefPrevention..."
curl -L -o GriefPrevention.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5391/415/GriefPrevention-16.18.3.jar"

# 7. CoreProtect (1.20.6 uyumlu)
echo "⬇️  CoreProtect..."
curl -L -o CoreProtect.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/PlayPro/CoreProtect/releases/download/22.4/CoreProtect-22.4.jar"

# 8. Multiverse-Core (1.20.6 uyumlu)
echo "⬇️  Multiverse-Core..."
curl -L -o Multiverse-Core.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Multiverse/Multiverse-Core/releases/download/4.3.12/multiverse-core-4.3.12.jar"

# 9. Brewery (1.20.6 uyumlu)
echo "⬇️  Brewery..."
curl -L -o Brewery.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/DieReicheErethons/Brewery/releases/download/3.3.1/Brewery-3.3.1.jar"

# 10. Jobs Reborn (1.20.6 uyumlu)
echo "⬇️  Jobs Reborn..."
curl -L -o Jobs.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Zrips/Jobs/releases/download/v5.2.2.3/Jobs5.2.2.3.jar"

# 11. mcMMO (1.20.6 uyumlu)
echo "⬇️  mcMMO..."
curl -L -o mcMMO.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/mcMMO-Dev/mcMMO/releases/download/mcMMO-2.2.010/mcMMO-2.2.010.jar"

# 12. QuickShop Hikari (1.20.6 uyumlu)
echo "⬇️  QuickShop..."
curl -L -o QuickShop.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Ghost-chu/QuickShop-Hikari/releases/download/6.2.0.8/QuickShop-Hikari-6.2.0.8.jar"

# 13. LuckPerms (1.20.6 uyumlu)
echo "⬇️  LuckPerms..."
curl -L -o LuckPerms.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://download.luckperms.net/1556/bukkit/loader/LuckPerms-Bukkit-5.4.141.jar"

# 14. DiscordSRV (1.20.6 uyumlu)
echo "⬇️  DiscordSRV..."
curl -L -o DiscordSRV.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/DiscordSRV/DiscordSRV/releases/download/v1.28.0/DiscordSRV-Build-1.28.0.jar"

# 15. Dynmap (1.20.6 uyumlu)
echo "⬇️  Dynmap..."
curl -L -o Dynmap.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/webbukkit/dynmap/releases/download/v3.7-beta-6/Dynmap-3.7-beta-6-spigot.jar"

echo ""
echo "✅ Download completed!"
echo ""
echo "📊 Checking downloaded files..."
echo ""

# Dosya boyutlarını kontrol et
for file in *.jar; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$size" -lt 1024 ]; then
            echo "❌ $file - FAILED (${size} bytes - too small)"
            rm -f "$file"
        else
            size_kb=$((size / 1024))
            echo "✅ $file - OK (${size_kb} KB)"
        fi
    fi
done

echo ""
echo "📋 Final plugin list:"
ls -lh *.jar 2>/dev/null | awk '{print $9, "-", $5}'

echo ""
echo "🎉 Plugin installation completed!"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Some plugins may require configuration"
echo "   - Restart server: pm2 restart minecraft"
echo "   - Check logs: pm2 logs minecraft"
echo ""
echo "📚 Plugin Documentation:"
echo "   - WorldEdit: https://worldedit.enginehub.org/en/latest/"
echo "   - WorldGuard: https://worldguard.enginehub.org/en/latest/"
echo "   - Citizens: https://wiki.citizensnpcs.co/"
echo "   - LuckPerms: https://luckperms.net/wiki"
echo "   - Dynmap: http://YOUR_IP:8123"
