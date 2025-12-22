#!/bin/bash

echo "📦 Installing ESSENTIAL plugins for Minecraft 1.20.6..."
echo "Minimal set - only the most important plugins"
echo ""

cd /opt/minecraft/plugins

# Temizlik
echo "🧹 Cleaning old/empty plugin files..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

echo ""
echo "📥 Downloading essential plugins..."
echo ""

# 1. WorldEdit (Dünya düzenleme - ZORUNLU)
echo "⬇️  [1/8] WorldEdit..."
curl -L -o WorldEdit.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5391/411/worldedit-bukkit-7.3.0.jar"

# 2. WorldGuard (Bölge koruma - ZORUNLU)
echo "⬇️  [2/8] WorldGuard..."
curl -L -o WorldGuard.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5391/413/worldguard-bukkit-7.0.10.jar"

# 3. LuckPerms (İzin sistemi - ÖNERİLEN)
echo "⬇️  [3/8] LuckPerms..."
curl -L -o LuckPerms.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://download.luckperms.net/1556/bukkit/loader/LuckPerms-Bukkit-5.4.141.jar"

# 4. CoreProtect (Log/rollback - ÖNERİLEN)
echo "⬇️  [4/8] CoreProtect..."
curl -L -o CoreProtect.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/PlayPro/CoreProtect/releases/download/22.4/CoreProtect-22.4.jar"

# 5. GriefPrevention (Grief koruması - ÖNERİLEN)
echo "⬇️  [5/8] GriefPrevention..."
curl -L -o GriefPrevention.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://mediafilez.forgecdn.net/files/5391/415/GriefPrevention-16.18.3.jar"

# 6. Citizens (NPC sistemi - POPÜLER)
echo "⬇️  [6/8] Citizens..."
curl -L -o Citizens.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://ci.citizensnpcs.co/job/Citizens2/lastSuccessfulBuild/artifact/dist/target/Citizens-2.0.35-b3570.jar"

# 7. ChestShop (Ekonomi/Mağaza - POPÜLER)
echo "⬇️  [7/8] ChestShop..."
curl -L -o ChestShop.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/ChestShop-authors/ChestShop-3/releases/download/3.12.2/ChestShop.jar"

# 8. TreeAssist (Ağaç kesme - KULLANICI İSTEĞİ)
echo "⬇️  [8/8] TreeAssist..."
curl -L -o TreeAssist.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Silthus/TreeAssist/releases/download/v7.0.0/TreeAssist-7.0.0.jar"

echo ""
echo "✅ Download completed!"
echo ""
echo "📊 Verifying downloads..."
echo ""

success=0
failed=0

for file in WorldEdit.jar WorldGuard.jar LuckPerms.jar CoreProtect.jar GriefPrevention.jar Citizens.jar ChestShop.jar TreeAssist.jar; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$size" -lt 1024 ]; then
            echo "❌ $file - FAILED (${size} bytes)"
            rm -f "$file"
            ((failed++))
        else
            size_kb=$((size / 1024))
            echo "✅ $file - OK (${size_kb} KB)"
            ((success++))
        fi
    else
        echo "❌ $file - NOT FOUND"
        ((failed++))
    fi
done

echo ""
echo "📈 Results: $success successful, $failed failed"
echo ""

if [ $success -ge 6 ]; then
    echo "🎉 Installation successful! ($success/8 plugins)"
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
    echo "⚠️  Warning: Only $success/8 plugins downloaded successfully"
    echo "   You may need to download some plugins manually"
fi

echo ""
echo "📚 Quick Plugin Guide:"
echo ""
echo "WorldEdit Commands:"
echo "  //wand - Get selection tool"
echo "  //set <block> - Fill selection"
echo "  //copy, //paste - Copy/paste"
echo ""
echo "WorldGuard Commands:"
echo "  /rg define <name> - Create region"
echo "  /rg flag <region> pvp deny - Disable PvP"
echo ""
echo "LuckPerms Commands:"
echo "  /lp user <player> permission set <perm> - Give permission"
echo "  /lp creategroup <name> - Create group"
echo ""
echo "CoreProtect Commands:"
echo "  /co inspect - Inspect blocks"
echo "  /co rollback u:<user> t:<time> - Rollback"
echo ""
echo "GriefPrevention:"
echo "  Golden Shovel - Claim land"
echo "  /trust <player> - Trust player"
echo ""
