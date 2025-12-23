#!/bin/bash

echo "📦 Installing plugins for Minecraft 1.21.1..."
echo "Using curl with proper headers and redirects"
echo ""

cd /opt/minecraft/plugins

# Temizlik
echo "🧹 Cleaning old/empty plugin files..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

echo ""
echo "📥 Downloading plugins..."
echo ""

# 1. WorldEdit (1.21+ uyumlu)
echo "⬇️  [1/10] WorldEdit..."
curl -L -o WorldEdit.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5656/539/worldedit-bukkit-7.3.6.jar"

# 2. WorldGuard (1.21+ uyumlu)
echo "⬇️  [2/10] WorldGuard..."
curl -L -o WorldGuard.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5656/541/worldguard-bukkit-7.0.11.jar"

# 3. LuckPerms (1.21+ uyumlu)
echo "⬇️  [3/10] LuckPerms..."
curl -L -o LuckPerms.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://download.luckperms.net/1556/bukkit/loader/LuckPerms-Bukkit-5.4.141.jar"

# 4. CoreProtect (1.21+ uyumlu)
echo "⬇️  [4/10] CoreProtect..."
curl -L -o CoreProtect.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/PlayPro/CoreProtect/releases/download/22.4/CoreProtect-22.4.jar"

# 5. Citizens (1.21+ uyumlu)
echo "⬇️  [5/10] Citizens..."
curl -L -o Citizens.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://ci.citizensnpcs.co/job/Citizens2/lastSuccessfulBuild/artifact/dist/target/Citizens-2.0.35-b3570.jar"

# 6. ChestShop (1.21+ uyumlu)
echo "⬇️  [6/10] ChestShop..."
curl -L -o ChestShop.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/ChestShop-authors/ChestShop-3/releases/download/3.12.2/ChestShop.jar"

# 7. Multiverse-Core (1.21+ uyumlu)
echo "⬇️  [7/10] Multiverse-Core..."
curl -L -o Multiverse-Core.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Multiverse/Multiverse-Core/releases/download/4.3.12/multiverse-core-4.3.12.jar"

# 8. Dynmap (1.21+ uyumlu)
echo "⬇️  [8/10] Dynmap..."
curl -L -o Dynmap.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/webbukkit/dynmap/releases/download/v3.7-beta-6/Dynmap-3.7-beta-6-spigot.jar"

# 9. DiscordSRV (1.21+ uyumlu)
echo "⬇️  [9/10] DiscordSRV..."
curl -L -o DiscordSRV.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/DiscordSRV/DiscordSRV/releases/download/v1.28.0/DiscordSRV-Build-1.28.0.jar"

# 10. Brewery (1.21+ uyumlu)
echo "⬇️  [10/10] Brewery..."
curl -L -o Brewery.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/DieReicheErethons/Brewery/releases/download/3.3.1/Brewery-3.3.1.jar"

echo ""
echo "✅ Download completed!"
echo ""
echo "📊 Verifying downloads..."
echo ""

success=0
failed=0

for file in *.jar; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$size" -lt 1024 ]; then
            echo "❌ $file - FAILED (${size} bytes - too small)"
            rm -f "$file"
            ((failed++))
        else
            size_kb=$((size / 1024))
            echo "✅ $file - OK (${size_kb} KB)"
            ((success++))
        fi
    fi
done

echo ""
echo "📈 Results: $success successful, $failed failed"
echo ""

if [ $success -ge 7 ]; then
    echo "🎉 Installation successful! ($success/10 plugins)"
    echo ""
    echo "✅ Already installed:"
    echo "   - Vault (economy API)"
    echo "   - Slimefun (tech/magic)"
    echo "   - Essentials (commands)"
    echo "   - SkinsRestorer (skins)"
    echo "   - TimeHUD (custom)"
    echo ""
    echo "🔄 Restart server to load new plugins:"
    echo "   pm2 restart minecraft"
else
    echo "⚠️  Warning: Only $success/10 plugins downloaded successfully"
    echo "   You may need to download some plugins manually"
fi

echo ""
echo "📚 Plugin Documentation:"
echo "   - WorldEdit: https://worldedit.enginehub.org/"
echo "   - WorldGuard: https://worldguard.enginehub.org/"
echo "   - LuckPerms: https://luckperms.net/wiki"
echo "   - CoreProtect: https://docs.coreprotect.net/"
echo "   - Citizens: https://wiki.citizensnpcs.co/"
echo "   - Dynmap: http://YOUR_IP:8123"
echo ""
echo "⚠️  Note: Some plugins may have limited 1.21.1 support"
echo "   Check logs after restart: pm2 logs minecraft"
