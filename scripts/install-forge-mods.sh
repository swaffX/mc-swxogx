#!/bin/bash

echo "📦 Forge 1.21.1 Popüler Modlar Kurulumu"
echo "========================================"
echo ""

cd /opt/minecraft/mods

# Temizlik
echo "🧹 Boş mod dosyaları temizleniyor..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

echo ""
echo "⬇️  Modlar indiriliyor..."
echo ""

# 1. JEI (Just Enough Items) - Tarif görüntüleyici (ZORUNLU)
echo "[1/8] JEI (Just Enough Items)..."
curl -L -o jei.jar -s "https://mediafilez.forgecdn.net/files/5700/321/jei-1.21.1-forge-19.8.5.186.jar" 2>/dev/null

# 2. JourneyMap - Harita modu
echo "[2/8] JourneyMap..."
curl -L -o journeymap.jar -s "https://mediafilez.forgecdn.net/files/5689/892/journeymap-1.21.1-6.0.0-beta.27-forge.jar" 2>/dev/null

# 3. Jade - Blok bilgisi gösterici
echo "[3/8] Jade (WAILA)..."
curl -L -o jade.jar -s "https://mediafilez.forgecdn.net/files/5698/789/Jade-1.21.1-Forge-15.9.3.jar" 2>/dev/null

# 4. Iron Chests - Büyük sandıklar
echo "[4/8] Iron Chests..."
curl -L -o ironchests.jar -s "https://mediafilez.forgecdn.net/files/5651/892/ironchest-1.21.1-forge-14.8.2.jar" 2>/dev/null

# 5. Storage Drawers - Depolama çekmeceleri
echo "[5/8] Storage Drawers..."
curl -L -o storagedrawers.jar -s "https://mediafilez.forgecdn.net/files/5680/123/StorageDrawers-1.21.1-forge-13.5.0.jar" 2>/dev/null

# 6. Sophisticated Backpacks - Sırt çantaları
echo "[6/8] Sophisticated Backpacks..."
curl -L -o backpacks.jar -s "https://mediafilez.forgecdn.net/files/5695/456/sophisticatedbackpacks-1.21.1-3.21.2.1100.jar" 2>/dev/null

# 7. Waystones - Işınlanma taşları
echo "[7/8] Waystones..."
curl -L -o waystones.jar -s "https://mediafilez.forgecdn.net/files/5690/789/waystones-1.21.1-forge-18.2.0.jar" 2>/dev/null

# 8. Gravestone - Ölünce eşyaları koru
echo "[8/8] Gravestone..."
curl -L -o gravestone.jar -s "https://mediafilez.forgecdn.net/files/5685/321/gravestone-1.21.1-forge-1.0.23.jar" 2>/dev/null

echo ""
echo "📊 İndirilen modlar kontrol ediliyor..."
echo ""

success=0
failed=0

for file in *.jar; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ "$size" -lt 10000 ]; then
            echo "❌ $file - BAŞARISIZ (çok küçük)"
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

if [ $success -ge 4 ]; then
    echo "🎉 Mod kurulumu tamamlandı!"
    echo ""
    echo "🔄 Sunucuyu restart et:"
    echo "   pm2 restart minecraft"
    echo ""
    echo "📋 Mod listesi:"
    ls -lh *.jar 2>/dev/null | awk '{print "   ", $9, "-", $5}'
else
    echo "⚠️  Bazı modlar indirilemedi."
    echo "   Manuel olarak CurseForge'dan indirebilirsin:"
    echo "   https://www.curseforge.com/minecraft/mc-mods"
    echo ""
    echo "   Filtre: Minecraft 1.21.1, Forge"
fi

echo ""
echo "📚 Mod Açıklamaları:"
echo "   - JEI: Tarif görüntüleyici (E tuşu)"
echo "   - JourneyMap: Minimap ve dünya haritası (J tuşu)"
echo "   - Jade: Baktığın bloğun bilgisini gösterir"
echo "   - Iron Chests: Demir, altın, elmas sandıklar"
echo "   - Storage Drawers: Kompakt depolama çekmeceleri"
echo "   - Backpacks: Taşınabilir sırt çantaları"
echo "   - Waystones: Işınlanma noktaları"
echo "   - Gravestone: Ölünce eşyaların mezar taşında kalır"
echo ""
