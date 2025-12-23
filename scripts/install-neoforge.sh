#!/bin/bash

echo "🔥 NeoForge 1.21.1 Kurulum Scripti"
echo "==================================="
echo ""

cd /opt/minecraft

# 1. Sunucuyu durdur
echo "⏸️  Sunucu durduruluyor..."
pm2 stop minecraft 2>/dev/null || true
pm2 delete minecraft 2>/dev/null || true

# 2. Yedek al
echo "💾 World yedekleniyor..."
tar -czf backup-world-$(date +%Y%m%d-%H%M%S).tar.gz world world_nether world_the_end 2>/dev/null || true

# 3. Eski dosyaları temizle
echo "🧹 Eski dosyalar temizleniyor..."
rm -rf libraries/ 2>/dev/null
rm -rf versions/ 2>/dev/null
rm -f server.jar 2>/dev/null
rm -f run.sh run.bat 2>/dev/null
rm -f forge-*.jar 2>/dev/null
rm -f *.log 2>/dev/null

# 4. NeoForge installer kontrol et
if [ ! -f "neoforge-21.1.64-installer.jar" ]; then
    echo "⬇️  NeoForge 21.1.64 indiriliyor..."
    curl -L -o neoforge-21.1.64-installer.jar \
      "https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.64/neoforge-21.1.64-installer.jar"
fi

# 5. NeoForge'u kur
echo "🔧 NeoForge kuruluyor (2-5 dakika sürebilir)..."
java -jar neoforge-21.1.64-installer.jar --installServer

# 6. Kurulum kontrolü
if [ ! -d "libraries/net/neoforged" ]; then
    echo "❌ NeoForge kurulumu başarısız!"
    exit 1
fi

echo "✅ NeoForge kuruldu!"

# 7. EULA kabul et
echo "📝 EULA kabul ediliyor..."
echo "eula=true" > eula.txt

# 8. Mods klasörü oluştur
echo "📁 Mods klasörü oluşturuluyor..."
mkdir -p mods

# 9. user_jvm_args.txt oluştur
if [ ! -f "user_jvm_args.txt" ]; then
    echo "# Add custom JVM arguments here" > user_jvm_args.txt
fi

# 10. server.properties RCON ayarları
echo "🔧 RCON ayarları yapılıyor..."
if [ -f "server.properties" ]; then
    sed -i 's/enable-rcon=false/enable-rcon=true/' server.properties
    grep -q "rcon.password" server.properties || echo "rcon.password=SwxOgx2024Rcon!" >> server.properties
    grep -q "rcon.port" server.properties || echo "rcon.port=25575" >> server.properties
fi

# 11. Temizlik
echo "🧹 Installer temizleniyor..."
rm -f neoforge-21.1.64-installer.jar.log 2>/dev/null

echo ""
echo "✅ =========================================="
echo "✅ NEOFORGE 1.21.1 KURULUMU TAMAMLANDI!"
echo "✅ =========================================="
echo ""
echo "📋 Sonraki adımlar:"
echo ""
echo "1. Sunucuyu başlat:"
echo "   pm2 start ecosystem.config.js --only minecraft"
echo ""
echo "2. Logları izle (ilk başlatma 2-5 dakika):"
echo "   pm2 logs minecraft"
echo ""
echo "3. Mod eklemek için:"
echo "   cd /opt/minecraft/mods"
echo "   # Modları buraya kopyala"
echo ""
echo "4. Web API'yi başlat:"
echo "   pm2 start ecosystem.config.js --only minecraft-api"
echo ""
echo "⚠️  NOT: Bukkit pluginleri artık ÇALIŞMAZ!"
echo "⚠️  Sadece NeoForge/Forge modları kullanılabilir."
echo ""
