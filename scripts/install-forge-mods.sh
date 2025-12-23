#!/bin/bash

echo "📦 Forge 1.21.1 Popüler Modlar Kurulumu"
echo "========================================"
echo ""

cd /opt/minecraft

# Mods klasörü yoksa oluştur
mkdir -p mods
cd mods

# Temizlik
echo "🧹 Boş mod dosyaları temizleniyor..."
find . -name "*.jar" -size 0 -delete 2>/dev/null
find . -name "*.jar" -size -1k -delete 2>/dev/null

echo ""
echo "⬇️  Modlar indiriliyor..."
echo ""

# CurseForge API kullanarak doğrudan indirme
# Not: Bu URL'ler CurseForge CDN'den direkt indirme yapar

# 1. JEI (Just Enough Items) - Tarif görüntüleyici (ZORUNLU)
echo "[1/6] JEI (Just Enough Items)..."
curl -L -o jei.jar --retry 3 --retry-delay 2 -f \
  "https://www.curseforge.com/api/v1/mods/238222/files/5700321/download" 2>/dev/null || \
curl -L -o jei.jar --retry 3 --retry-delay 2 -f \
  "https://edge.forgecdn.net/files/5700/321/jei-1.21.1-forge-19.8.5.186.jar" 2>/dev/null

# 2. JourneyMap - Harita modu
echo "[2/6] JourneyMap..."
curl -L -o journeymap.jar --retry 3 --retry-delay 2 -f \
  "https://edge.forgecdn.net/files/5689/892/journeymap-1.21.1-6.0.0-beta.27-forge.jar" 2>/dev/null

# 3. Jade - Blok bilgisi gösterici (WAILA alternatifi)
echo "[3/6] Jade..."
curl -L -o jade.jar --retry 3 --retry-delay 2 -f \
  "https://edge.forgecdn.net/files/5698/789/Jade-1.21.1-Forge-15.9.3.jar" 2>/dev/null

# 4. Iron Chests - Büyük sandıklar
echo "[4/6] Iron Chests..."
curl -L -o ironchests.jar --retry 3 --retry-delay 2 -f \
  "https://edge.forgecdn.net/files/5651/892/ironchest-1.21.1-forge-14.8.2.jar" 2>/dev/null

# 5. Gravestone - Ölünce eşyaları koru
echo "[5/6] Gravestone..."
curl -L -o gravestone.jar --retry 3 --retry-delay 2 -f \
  "https://edge.forgecdn.net/files/5685/321/gravestone-1.21.1-forge-1.0.23.jar" 2>/dev/null

# 6. Waystones - Işınlanma taşları
echo "[6/6] Waystones..."
curl -L -o waystones.jar --retry 3 --retry-delay 2 -f \
  "https://edge.forgecdn.net/files/5690/789/waystones-forge-1.21.1-21.1.0.jar" 2>/dev/null

echo ""
echo "📊 İndirilen modlar kontrol ediliyor..."
echo ""

success=0
failed=0

for file in *.jar; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ -z "$size" ] || [ "$size" -lt 10000 ]; then
            echo "❌ $file - BAŞARISIZ (indirilemedi veya çok küçük)"
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
    echo "   1. https://www.curseforge.com/minecraft/mc-mods adresine git"
    echo "   2. Filtre: Game Version = 1.21.1, Mod Loader = Forge"
    echo "   3. Modu indir ve /opt/minecraft/mods/ klasörüne kopyala"
    echo ""
    echo "   Örnek (lokal bilgisayardan):"
    echo "   scp mod.jar root@194.105.5.37:/opt/minecraft/mods/"
fi

echo ""
echo "📚 Mod Açıklamaları:"
echo "   - JEI: Tarif görüntüleyici (E tuşu ile aç)"
echo "   - JourneyMap: Minimap ve dünya haritası (J tuşu)"
echo "   - Jade: Baktığın bloğun bilgisini gösterir"
echo "   - Iron Chests: Demir, altın, elmas sandıklar"
echo "   - Gravestone: Ölünce eşyaların mezar taşında kalır"
echo "   - Waystones: Işınlanma noktaları oluştur"
echo ""
