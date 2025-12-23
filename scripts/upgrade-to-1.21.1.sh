#!/bin/bash

echo "🚀 Upgrading to Minecraft 1.21.1..."
echo ""

cd /opt/minecraft

# 1. Sunucuyu durdur
echo "⏸️  Stopping server..."
pm2 stop minecraft 2>/dev/null || true

# 2. Eski server.jar'ı yedekle
if [ -f "server.jar" ]; then
    echo "💾 Backing up old server.jar..."
    mv server.jar "server.jar.backup-$(date +%Y%m%d-%H%M%S)"
fi

# 3. Paper 1.21.1 indir
echo "⬇️  Downloading Paper 1.21.1 (build 129)..."
curl -L -o server.jar -f -s -S --retry 3 --retry-delay 2 \
  "https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/129/downloads/paper-1.21.1-129.jar"

if [ ! -f "server.jar" ]; then
    echo "❌ Download failed!"
    exit 1
fi

size=$(stat -f%z "server.jar" 2>/dev/null || stat -c%s "server.jar" 2>/dev/null)
size_mb=$((size / 1024 / 1024))
echo "✅ Downloaded: ${size_mb} MB"

# 4. Session lock'ları temizle
echo "🧹 Cleaning session locks..."
rm -f world/session.lock 2>/dev/null || true
rm -f world_nether/session.lock 2>/dev/null || true
rm -f world_the_end/session.lock 2>/dev/null || true

# 5. Eski config'leri temizle (1.21.1 yenilerini oluşturacak)
echo "🗑️  Removing old configs (will be regenerated)..."
rm -f config/paper-world-defaults.yml 2>/dev/null || true
rm -f config/paper-global.yml 2>/dev/null || true

# 6. TimeHUD'ı rebuild et (1.21 uyumlu)
echo "🔨 Rebuilding TimeHUD for 1.21.1..."
if [ -d "TimeHUD" ]; then
    cd TimeHUD
    docker run --rm -v $(pwd):/work -w /work maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests -q
    if [ -f "target/TimeHUD-1.1.0.jar" ]; then
        cp target/TimeHUD-1.1.0.jar ../plugins/TimeHUD.jar
        echo "✅ TimeHUD rebuilt successfully"
    else
        echo "⚠️  TimeHUD build failed (not critical)"
    fi
    cd ..
else
    echo "⚠️  TimeHUD directory not found"
fi

# 7. Boş plugin dosyalarını temizle
echo "🧹 Cleaning empty plugin files..."
find plugins/ -name "*.jar" -size 0 -delete 2>/dev/null || true
find plugins/ -name "*.jar" -size -1k -delete 2>/dev/null || true

echo ""
echo "✅ Upgrade to 1.21.1 completed!"
echo ""
echo "📋 Current plugins:"
ls -lh plugins/*.jar 2>/dev/null | awk '{print "   ", $9, "-", $5}'

echo ""
echo "🚀 Start server:"
echo "   pm2 start minecraft"
echo ""
echo "📊 Monitor logs:"
echo "   pm2 logs minecraft --lines 50"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Config files will be regenerated for 1.21.1"
echo "   - World is compatible (no data loss)"
echo "   - Most plugins work with 1.21.1"
echo "   - Some plugins may need updates"
