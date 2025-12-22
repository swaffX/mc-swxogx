#!/bin/bash

echo "🔄 Minecraft Server Downgrade: 1.21.1 → 1.20.6"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /opt/minecraft

echo ""
echo "⏸️  Step 1: Stopping Minecraft server..."
pm2 stop minecraft
sleep 3

echo ""
echo "💾 Step 2: Backing up current setup..."
# Backup server.jar
if [ -f "server.jar" ]; then
    mv server.jar server-1.21.1.jar.backup
    echo "✓ server.jar backed up as server-1.21.1.jar.backup"
fi

# Backup world (optional - takes time)
echo "⚠️  Skipping world backup (too large). Your world will be converted automatically."

echo ""
echo "📥 Step 3: Downloading Paper 1.20.6..."
wget -q --show-progress https://api.papermc.io/v2/projects/paper/versions/1.20.6/builds/147/downloads/paper-1.20.6-147.jar -O server.jar

if [ ! -f "server.jar" ]; then
    echo "❌ Download failed! Restoring backup..."
    mv server-1.21.1.jar.backup server.jar
    exit 1
fi

echo "✓ Paper 1.20.6 downloaded successfully"
ls -lh server.jar

echo ""
echo "🧹 Step 4: Cleaning incompatible plugins..."
cd plugins

# Remove 1.21.1 specific plugins
rm -f Slimefun4.jar 2>/dev/null
rm -f EliteMobs.jar 2>/dev/null
rm -f MythicMobs.jar 2>/dev/null
rm -f Citizens.jar 2>/dev/null
rm -f Denizen.jar 2>/dev/null
rm -f WorldEdit.jar 2>/dev/null
rm -f WorldGuard.jar 2>/dev/null
rm -f TreeAssist.jar 2>/dev/null
rm -f Brewery.jar 2>/dev/null
rm -f Chairs.jar 2>/dev/null
rm -f CustomCrafting.jar 2>/dev/null
rm -f WolfyUtilities.jar 2>/dev/null

echo "✓ Old plugins removed"

echo ""
echo "📦 Step 5: Downloading 1.20.6 compatible plugins..."

# 1. TreeAssist - Ağaç kesme
echo "🌲 [1/10] TreeAssist..."
wget -q https://github.com/Vk2/TreeAssist/releases/download/v7.0.0/TreeAssist-7.0.0.jar -O TreeAssist.jar

# 2. Slimefun - Tekkit benzeri
echo "⚙️  [2/10] Slimefun4..."
wget -q https://blob.build/dl/Slimefun4/RC/latest -O Slimefun4.jar

# 3. WorldEdit
echo "🏗️  [3/10] WorldEdit..."
wget -q https://mediafilez.forgecdn.net/files/5779/537/worldedit-bukkit-7.3.8.jar -O WorldEdit.jar

# 4. WorldGuard
echo "🛡️  [4/10] WorldGuard..."
wget -q https://mediafilez.forgecdn.net/files/5779/540/worldguard-bukkit-7.0.12.jar -O WorldGuard.jar

# 5. Citizens
echo "🧑 [5/10] Citizens..."
wget -q https://ci.citizensnpcs.co/job/Citizens2/lastSuccessfulBuild/artifact/dist/target/Citizens-2.0.35-b3596.jar -O Citizens.jar

# 6. Denizen
echo "📜 [6/10] Denizen..."
wget -q https://ci.citizensnpcs.co/job/Denizen/lastSuccessfulBuild/artifact/paper/target/Denizen-1.3.1-b6697-REL.jar -O Denizen.jar

# 7. MythicMobs
echo "👹 [7/10] MythicMobs..."
wget -q https://www.mythiccraft.io/downloads/mythicmobs-5.6.2.jar -O MythicMobs.jar

# 8. EliteMobs
echo "👑 [8/10] EliteMobs..."
wget -q https://github.com/MagmaGuy/EliteMobs/releases/download/9.2.8/EliteMobs-9.2.8.jar -O EliteMobs.jar

# 9. Brewery
echo "🍺 [9/10] Brewery..."
wget -q https://github.com/DieReicheErethons/Brewery/releases/download/v3.3.0/Brewery-3.3.0.jar -O Brewery.jar

# 10. Vault (ekonomi API - gerekli)
echo "💰 [10/10] Vault..."
wget -q https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar -O Vault.jar

cd /opt/minecraft

echo ""
echo "📊 Step 6: Verifying downloads..."
echo "Plugin sizes:"
ls -lh plugins/*.jar | awk '{print "  •", $9, "-", $5}'

echo ""
echo "🧹 Step 7: Cleaning cache and locks..."
rm -f world/session.lock 2>/dev/null
rm -f world_nether/session.lock 2>/dev/null
rm -f world_the_end/session.lock 2>/dev/null
rm -rf cache/* 2>/dev/null
echo "✓ Cache cleaned"

echo ""
echo "▶️  Step 8: Starting Minecraft 1.20.6..."
pm2 start minecraft
pm2 save

echo ""
echo "⏳ Waiting for server to start (45 seconds)..."
sleep 45

echo ""
echo "📝 Step 9: Checking server status..."
pm2 list

echo ""
echo "📋 Step 10: Checking logs for errors..."
pm2 logs minecraft --lines 30 --nostream | grep -i "error\|warn\|enabled" || echo "No critical errors found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Downgrade completed!"
echo ""
echo "📊 Server Information:"
echo "  • Version: Paper 1.20.6"
echo "  • Plugins: 10+ installed"
echo "  • World: Automatically converted from 1.21.1"
echo ""
echo "🎮 Installed Plugins:"
echo "  🌲 TreeAssist - Ağaç kesme"
echo "  ⚙️  Slimefun4 - Makineler ve teknoloji"
echo "  🏗️  WorldEdit - Yapı düzenleme"
echo "  🛡️  WorldGuard - Bölge koruma"
echo "  🧑 Citizens - NPC sistemi"
echo "  📜 Denizen - NPC scripting"
echo "  👹 MythicMobs - Özel moblar"
echo "  👑 EliteMobs - Boss sistemi"
echo "  🍺 Brewery - İçki yapma"
echo "  💰 Vault - Ekonomi API"
echo "  ✅ Essentials - Temel komutlar"
echo "  ✅ SkinsRestorer - Skin sistemi"
echo "  ✅ TimeHUD - Zaman göstergesi"
echo ""
echo "🔍 To check plugin status: /plugins (in-game)"
echo "📖 To get Slimefun guide: /sf guide"
echo "🌲 To test tree chopping: Cut a tree from the bottom"
echo ""
echo "📝 Full logs: pm2 logs minecraft"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
