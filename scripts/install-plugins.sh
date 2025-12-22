#!/bin/bash

echo "🎮 Installing Creative Plugin Pack for Minecraft 1.21.1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /opt/minecraft/plugins

echo ""
echo "📦 Downloading plugins..."
echo ""

# 1. TreeCapitator - Ağaç kesme
echo "🌲 [1/12] TreeAssist - Tree chopping..."
wget -q --show-progress https://github.com/Vk2/TreeAssist/releases/download/v7.0.0/TreeAssist-7.0.0.jar -O TreeAssist.jar

# 2. Slimefun - Tekkit benzeri makineler
echo "⚙️  [2/12] Slimefun4 - Machines & Tech..."
wget -q --show-progress https://blob.build/dl/Slimefun4/Dev/latest -O Slimefun4.jar

# 3. MythicMobs - Custom moblar
echo "👹 [3/12] MythicMobs - Custom Mobs..."
wget -q --show-progress https://www.mythiccraft.io/downloads/mythicmobs-5.6.2.jar -O MythicMobs.jar

# 4. EliteMobs - Boss sistemi
echo "👑 [4/12] EliteMobs - Boss System..."
wget -q --show-progress https://github.com/MagmaGuy/EliteMobs/releases/download/9.2.8/EliteMobs-9.2.8.jar -O EliteMobs.jar

# 5. WorldEdit - Yapı düzenleme
echo "🏗️  [5/12] WorldEdit - Building Tools..."
wget -q --show-progress https://mediafilez.forgecdn.net/files/5779/537/worldedit-bukkit-7.3.8.jar -O WorldEdit.jar

# 6. WorldGuard - Bölge koruma
echo "🛡️  [6/12] WorldGuard - Region Protection..."
wget -q --show-progress https://mediafilez.forgecdn.net/files/5779/540/worldguard-bukkit-7.0.12.jar -O WorldGuard.jar

# 7. Citizens - NPC sistemi
echo "🧑 [7/12] Citizens - NPC System..."
wget -q --show-progress https://ci.citizensnpcs.co/job/Citizens2/lastSuccessfulBuild/artifact/dist/target/Citizens-2.0.35-b3596.jar -O Citizens.jar

# 8. Denizen - NPC scripting
echo "📜 [8/12] Denizen - NPC Scripting..."
wget -q --show-progress https://ci.citizensnpcs.co/job/Denizen/lastSuccessfulBuild/artifact/paper/target/Denizen-1.3.1-b6697-REL.jar -O Denizen.jar

# 9. Brewery - İçki yapma
echo "🍺 [9/12] Brewery - Brewing System..."
wget -q --show-progress https://github.com/DieReicheErethons/Brewery/releases/download/v3.3.0/Brewery-3.3.0.jar -O Brewery.jar

# 10. Chairs - Oturma sistemi
echo "🪑 [10/12] Chairs - Sitting System..."
wget -q --show-progress https://github.com/Plugily-Projects/Chairs/releases/download/1.0.0/Chairs-1.0.0.jar -O Chairs.jar

# 11. CustomCrafting - Custom craftlar
echo "🔨 [11/12] CustomCrafting - Custom Recipes..."
wget -q --show-progress https://github.com/WolfyScript/CustomCrafting/releases/download/4.16.11.1/customcrafting-spigot-4.16.11.1.jar -O CustomCrafting.jar

# 12. WolfyUtilities - CustomCrafting dependency
echo "🔧 [12/12] WolfyUtilities - Dependency..."
wget -q --show-progress https://github.com/WolfyScript/WolfyUtilities/releases/download/4.17.3.1/wolfyutilities-spigot-4.17.3.1.jar -O WolfyUtilities.jar

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All plugins downloaded!"
echo ""
echo "📊 Plugin List:"
ls -lh *.jar | awk '{print "  •", $9, "-", $5}'
echo ""
echo "🔄 Restarting server..."
cd /opt/minecraft
pm2 restart minecraft

echo ""
echo "⏳ Waiting for server to load plugins (30 seconds)..."
sleep 30

echo ""
echo "📝 Checking logs..."
pm2 logs minecraft --lines 20 --nostream

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Plugin installation completed!"
echo ""
echo "🎮 Installed Features:"
echo "  🌲 TreeAssist - Ağacı kökünden kes, hepsi düşsün"
echo "  ⚙️  Slimefun4 - Makineler, jeneratörler, otomatik sistemler"
echo "  👹 MythicMobs - Özel moblar ve yaratıklar"
echo "  👑 EliteMobs - Boss'lar ve dungeon'lar"
echo "  🏗️  WorldEdit - Yapı düzenleme araçları"
echo "  🛡️  WorldGuard - Bölge koruma"
echo "  🧑 Citizens - NPC'ler ve quest'ler"
echo "  📜 Denizen - NPC scriptleri"
echo "  🍺 Brewery - İçki yapma sistemi"
echo "  🪑 Chairs - Merdiven ve basamaklara oturma"
echo "  🔨 CustomCrafting - Özel craft tarifleri"
echo ""
echo "📖 Commands:"
echo "  /ta - TreeAssist ayarları"
echo "  /sf guide - Slimefun rehberi"
echo "  /em - EliteMobs menüsü"
echo "  /npc - NPC oluştur"
echo "  //wand - WorldEdit değneği"
echo ""
echo "🔍 To check plugin status: /plugins"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
