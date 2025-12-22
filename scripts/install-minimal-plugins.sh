#!/bin/bash

echo "📦 Installing MINIMAL plugins for Minecraft 1.20.6..."
echo "Focus: TreeAssist + Custom Items/Weapons"
echo ""

cd /opt/minecraft/plugins

# Temizlik
echo "🧹 Cleaning old/empty plugin files..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

echo ""
echo "📥 Downloading minimal plugin set..."
echo ""

# 1. TreeAssist (Ağaç kesme - KULLANICI İSTEĞİ)
echo "⬇️  [1/3] TreeAssist (ağaç kesme)..."
curl -L -o TreeAssist.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/Silthus/TreeAssist/releases/download/v7.0.0/TreeAssist-7.0.0.jar"

# 2. ItemsAdder (Custom items, silahlar, zırhlar - EN POPÜLER)
echo "⬇️  [2/3] ItemsAdder (custom items/silahlar)..."
curl -L -o ItemsAdder.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://github.com/LoneDev6/API-ItemsAdder/releases/download/3.6.3-beta14/ItemsAdder.jar" || \
echo "⚠️  ItemsAdder premium plugin - manuel indirme gerekli"

# 3. MMOItems (Custom items, RPG sistemi - ALTERNATIF)
echo "⬇️  [3/3] MMOItems (RPG items/silahlar)..."
curl -L -o MMOItems.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://phoenixdevt.fr/index.php?dir=MMOItems" || \
echo "⚠️  MMOItems premium plugin - manuel indirme gerekli"

echo ""
echo "✅ Download completed!"
echo ""
echo "📊 Verifying downloads..."
echo ""

success=0
failed=0

for file in TreeAssist.jar ItemsAdder.jar MMOItems.jar; do
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
        echo "⚠️  $file - NOT FOUND (may be premium)"
        ((failed++))
    fi
done

echo ""
echo "📈 Results: $success successful, $failed failed/premium"
echo ""

echo "✅ Already installed plugins:"
echo "   - Vault (economy API)"
echo "   - Slimefun (500+ custom items, machines, weapons)"
echo "   - Essentials (commands)"
echo "   - SkinsRestorer (skins)"
echo "   - TimeHUD (custom)"
echo ""

if [ -f "TreeAssist.jar" ]; then
    echo "🎉 TreeAssist installed successfully!"
    echo ""
    echo "🌲 TreeAssist Features:"
    echo "   - Ağacı kökünden kesince tüm ağaç düşer"
    echo "   - Animasyonlu düşme efekti"
    echo "   - Dayanıklılık kaybı ayarlanabilir"
    echo ""
    echo "🌲 TreeAssist Commands:"
    echo "   /ta - Ana menü"
    echo "   /ta toggle - Aç/kapat"
    echo "   /ta reload - Config yenile"
    echo ""
fi

echo "⚙️  Slimefun (Already Installed):"
echo "   - 500+ custom items"
echo "   - Custom weapons (swords, guns, bows)"
echo "   - Custom armor sets"
echo "   - Magic items"
echo "   - Tech items (jetpack, grappling hook)"
echo ""
echo "   Commands:"
echo "   /sf guide - Rehber kitabı al"
echo "   /sf search <item> - Item ara"
echo ""

echo "📚 Custom Items/Weapons Guide:"
echo ""
echo "Slimefun Weapons:"
echo "   - Soulbound Sword (can't be lost on death)"
echo "   - Explosive Bow (explosive arrows)"
echo "   - Seismic Axe (earthquake effect)"
echo "   - Blade of Vampires (life steal)"
echo "   - Grandma's Walking Stick (knockback)"
echo "   - Grandpa's Walking Stick (knockback)"
echo ""
echo "Slimefun Armor:"
echo "   - Damascus Steel Armor (strong)"
echo "   - Reinforced Alloy Armor (very strong)"
echo "   - Gilded Iron Armor (gold + iron)"
echo "   - Slime Armor (no fall damage)"
echo "   - Bee Armor (poison immunity)"
echo ""
echo "Slimefun Tools:"
echo "   - Explosive Pickaxe (3x3 mining)"
echo "   - Explosive Shovel (3x3 digging)"
echo "   - Lumber Axe (tree chopping)"
echo "   - Pickaxe of Containment (silk touch)"
echo ""

echo "🔄 Restart server to load plugins:"
echo "   pm2 restart minecraft"
echo ""

echo "⚠️  PREMIUM PLUGINS (Manuel İndirme Gerekli):"
echo ""
echo "ItemsAdder (En İyi - Önerilen):"
echo "   - 1000+ custom items"
echo "   - Custom weapons, armor, tools"
echo "   - Custom blocks, furniture"
echo "   - Resource pack otomatik"
echo "   - Link: https://www.spigotmc.org/resources/73355/"
echo "   - Price: ~15 EUR"
echo ""
echo "MMOItems (Alternatif):"
echo "   - RPG item sistemi"
echo "   - Custom stats, abilities"
echo "   - Crafting sistemi"
echo "   - Link: https://www.spigotmc.org/resources/39267/"
echo "   - Price: ~30 EUR"
echo ""
echo "Oraxen (Alternatif):"
echo "   - Custom items/blocks"
echo "   - Resource pack"
echo "   - Link: https://www.spigotmc.org/resources/72448/"
echo "   - Price: ~15 EUR"
echo ""

echo "💡 RECOMMENDATION:"
echo "   Slimefun (already installed) provides 500+ custom items for FREE!"
echo "   Start with Slimefun, buy premium plugins later if needed."
echo ""
echo "   Get Slimefun guide: /sf guide"
echo ""
