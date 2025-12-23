#!/bin/bash

echo "📦 NeoForge 1.21.1 Mod Kurulumu"
echo "================================"
echo ""

cd /opt/minecraft
mkdir -p mods
cd mods

# Temizlik
echo "🧹 Boş/bozuk mod dosyaları temizleniyor..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

echo ""
echo "⬇️  Modlar indiriliyor..."
echo ""
echo "⚠️  Not: CurseForge API kısıtlamaları nedeniyle"
echo "    bazı modlar manuel indirilmeli."
echo ""

# Modrinth API kullanarak indirme (daha güvenilir)

# 1. JEI (Just Enough Items) - ZORUNLU
echo "[1/5] JEI indiriliyor..."
curl -L -o jei.jar -s --retry 3 \
  "https://cdn.modrinth.com/data/u6dRKJwZ/versions/qPaJVNyf/jei-1.21.1-neoforge-19.8.5.186.jar" 2>/dev/null

# 2. JourneyMap - Harita
echo "[2/5] JourneyMap indiriliyor..."
curl -L -o journeymap.jar -s --retry 3 \
  "https://cdn.modrinth.com/data/lfHFW1mp/versions/kMPJgvNB/journeymap-1.21.1-6.0.0-beta.27-neoforge.jar" 2>/dev/null

# 3. Jade - Blok bilgisi
echo "[3/5] Jade indiriliyor..."
curl -L -o jade.jar -s --retry 3 \
  "https://cdn.modrinth.com/data/nvQzSEkH/versions/lghbfQFH/Jade-1.21.1-NeoForge-15.9.3.jar" 2>/dev/null

# 4. Inventory Sorter - Envanter düzenleme
echo "[4/5] Inventory Sorter indiriliyor..."
curl -L -o inventorysorter.jar -s --retry 3 \
  "https://cdn.modrinth.com/data/GWKfvfnO/versions/oBfGfWBB/inventorysorter-1.21.1-28.0.1.jar" 2>/dev/null

# 5. Controlling - Tuş ayarları
echo "[5/5] Controlling indiriliyor..."
curl -L -o controlling.jar -s --retry 3 \
  "https://cdn.modrinth.com/data/xv94TkTM/versions/Ayo5pJVg/Controlling-neoforge-1.21.1-19.0.4.jar" 2>/dev/null

echo ""
echo "📊 İndirilen modlar kontrol ediliyor..."
echo ""

success=0
failed=0

for file in *.jar; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ -z "$size" ] || [ "$size" -lt 10000 ]; then
            echo "❌ $file - BAŞARISIZ"
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
echo "📈 Sonuç: $success başarılı, $failed başarısız"
echo ""

# Mevcut modları listele
echo "📋 Mods klasöründeki tüm modlar:"
ls -lh /opt/minecraft/mods/*.jar 2>/dev/null | awk '{print "   ", $9, "-", $5}' || echo "   Hiç mod yok"

echo ""
if [ $success -ge 3 ]; then
    echo "🎉 Mod kurulumu tamamlandı!"
    echo ""
    echo "🔄 Sunucuyu restart et:"
    echo "   pm2 restart minecraft"
else
    echo "⚠️  Bazı modlar indirilemedi."
    echo ""
    echo "📥 Manuel indirme için:"
    echo "   1. https://modrinth.com/mods adresine git"
    echo "   2. Filtre: Minecraft 1.21.1, NeoForge"
    echo "   3. Modu indir ve /opt/minecraft/mods/ klasörüne kopyala"
fi

echo ""
echo "📚 Popüler NeoForge Modları (Manuel İndir):"
echo ""
echo "   🔧 Tech Modları:"
echo "   - Create: https://modrinth.com/mod/create"
echo "   - Mekanism: https://modrinth.com/mod/mekanism"
echo "   - Applied Energistics 2: https://modrinth.com/mod/ae2"
echo ""
echo "   🎮 Oynanış:"
echo "   - Waystones: https://modrinth.com/mod/waystones"
echo "   - Iron Chests: https://modrinth.com/mod/iron-chests"
echo "   - Sophisticated Backpacks: https://modrinth.com/mod/sophisticated-backpacks"
echo ""
echo "   🌍 Dünya:"
echo "   - Biomes O' Plenty: https://modrinth.com/mod/biomes-o-plenty"
echo "   - Terralith: https://modrinth.com/mod/terralith"
echo ""
