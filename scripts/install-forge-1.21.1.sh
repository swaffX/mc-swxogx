#!/bin/bash

echo "🔥 Forge 1.21.1 Otomatik Kurulum Scripti"
echo "=========================================="
echo ""

cd /opt/minecraft

# 1. Sunucuyu durdur
echo "⏸️  Sunucu durduruluyor..."
pm2 stop minecraft 2>/dev/null || true
pm2 delete minecraft 2>/dev/null || true

# 2. Yedek al
echo "💾 Yedek alınıyor..."
tar -czf backup-before-forge-$(date +%Y%m%d-%H%M%S).tar.gz world world_nether world_the_end server.properties 2>/dev/null || true

# 3. Eski dosyaları temizle
echo "🧹 Eski dosyalar temizleniyor..."
rm -f server.jar 2>/dev/null
rm -f neoforge-installer.jar 2>/dev/null
rm -f forge-installer.jar 2>/dev/null
rm -rf libraries/ 2>/dev/null
rm -rf cache/ 2>/dev/null
rm -f run.sh run.bat user_jvm_args.txt 2>/dev/null

# 4. Forge 1.21.1 installer indir
echo "⬇️  Forge 1.21.1 indiriliyor..."
FORGE_URL="https://maven.minecraftforge.net/net/minecraftforge/forge/1.21.1-52.0.28/forge-1.21.1-52.0.28-installer.jar"
curl -L -o forge-installer.jar "$FORGE_URL"

if [ ! -f "forge-installer.jar" ]; then
    echo "❌ Forge indirilemedi!"
    exit 1
fi

size=$(stat -c%s "forge-installer.jar" 2>/dev/null || stat -f%z "forge-installer.jar" 2>/dev/null)
echo "✅ Forge installer indirildi: $((size / 1024 / 1024)) MB"

# 5. Forge'u kur
echo "🔧 Forge kuruluyor (bu 2-3 dakika sürebilir)..."
java -jar forge-installer.jar --installServer

if [ ! -f "run.sh" ]; then
    echo "❌ Forge kurulumu başarısız!"
    exit 1
fi

echo "✅ Forge kuruldu!"

# 6. EULA kabul et
echo "📝 EULA kabul ediliyor..."
echo "eula=true" > eula.txt

# 7. Mods klasörü oluştur
echo "📁 Mods klasörü oluşturuluyor..."
mkdir -p mods

# 8. Start script oluştur
echo "📜 Start script oluşturuluyor..."
cat > start-forge.sh << 'STARTEOF'
#!/bin/bash
cd /opt/minecraft

# JVM Flags (Aikar's Flags - Forge için optimize)
java -Xms4G -Xmx4G \
  -XX:+UseG1GC \
  -XX:+ParallelRefProcEnabled \
  -XX:MaxGCPauseMillis=200 \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+DisableExplicitGC \
  -XX:+AlwaysPreTouch \
  -XX:G1NewSizePercent=30 \
  -XX:G1MaxNewSizePercent=40 \
  -XX:G1HeapRegionSize=8M \
  -XX:G1ReservePercent=20 \
  -XX:G1HeapWastePercent=5 \
  -XX:G1MixedGCCountTarget=4 \
  -XX:InitiatingHeapOccupancyPercent=15 \
  -XX:G1MixedGCLiveThresholdPercent=90 \
  -XX:G1RSetUpdatingPauseTimePercent=5 \
  -XX:SurvivorRatio=32 \
  -XX:+PerfDisableSharedMem \
  -XX:MaxTenuringThreshold=1 \
  @user_jvm_args.txt \
  @libraries/net/minecraftforge/forge/1.21.1-52.0.28/unix_args.txt \
  nogui
STARTEOF

chmod +x start-forge.sh

# 9. user_jvm_args.txt oluştur (boş olabilir)
if [ ! -f "user_jvm_args.txt" ]; then
    echo "# Add custom JVM args here" > user_jvm_args.txt
fi

# 10. ecosystem.config.js güncelle
echo "⚙️  PM2 config güncelleniyor..."
cat > ecosystem.config.js << 'ECOEOF'
module.exports = {
  apps: [
    {
      name: 'minecraft',
      script: '/opt/minecraft/start-forge.sh',
      cwd: '/opt/minecraft',
      interpreter: '/bin/bash',
      autorestart: false,
      max_memory_restart: '4G',
      env: {
        PM2_HOME: '/tmp/.pm2'
      }
    },
    {
      name: 'minecraft-api',
      script: 'server.js',
      cwd: '/opt/minecraft',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
ECOEOF

# 11. server.properties RCON ayarları
echo "🔧 RCON ayarları yapılıyor..."
if [ -f "server.properties" ]; then
    sed -i 's/enable-rcon=false/enable-rcon=true/' server.properties
    sed -i 's/rcon.password=/rcon.password=SwxOgx2024Rcon!/' server.properties
    sed -i 's/rcon.port=25575/rcon.port=25575/' server.properties
fi

# 12. Temizlik
echo "🧹 Temizlik yapılıyor..."
rm -f forge-installer.jar
rm -f forge-installer.jar.log

echo ""
echo "✅ =========================================="
echo "✅ FORGE 1.21.1 KURULUMU TAMAMLANDI!"
echo "✅ =========================================="
echo ""
echo "📋 Sonraki adımlar:"
echo ""
echo "1. Sunucuyu başlat:"
echo "   pm2 start ecosystem.config.js --only minecraft"
echo ""
echo "2. Logları izle (ilk başlatma 2-3 dakika sürer):"
echo "   pm2 logs minecraft"
echo ""
echo "3. Mod eklemek için:"
echo "   cd /opt/minecraft/mods"
echo "   curl -L -o modadi.jar <mod_url>"
echo ""
echo "4. Popüler modlar için:"
echo "   ./scripts/install-forge-mods.sh"
echo ""
echo "⚠️  NOT: Bukkit pluginleri artık ÇALIŞMAZ!"
echo "⚠️  Sadece Forge modları kullanılabilir."
echo ""
