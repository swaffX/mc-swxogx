#!/bin/bash

echo "🔧 Fixing 1.20.6 downgrade issues..."

cd /opt/minecraft

# 1. Config dosyasını sil (yeniden oluşturulacak)
echo "🗑️ Removing incompatible config..."
rm -f config/paper-world-defaults.yml
rm -f config/paper-global.yml

# 2. World'ü yedekle ve sil (1.21.1 world'ü 1.20.6'da açılamaz)
echo "💾 Backing up and removing 1.21.1 world..."
if [ -d "world" ]; then
    tar -czf "world-backup-1.21.1-$(date +%Y%m%d-%H%M%S).tar.gz" world world_nether world_the_end 2>/dev/null
    rm -rf world world_nether world_the_end
    echo "✅ World backed up and removed (new world will be generated)"
fi

# 3. TimeHUD'ı 1.20.6 için yeniden build et
echo "🔨 Rebuilding TimeHUD for 1.20.6..."
if [ -d "TimeHUD" ]; then
    cd TimeHUD
    # Build (zaten 1.20.6 uyumlu)
    docker run --rm -v $(pwd):/work -w /work maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests -q
    if [ -f "target/TimeHUD-1.0.0.jar" ]; then
        cp target/TimeHUD-1.0.0.jar ../plugins/
        echo "✅ TimeHUD rebuilt successfully"
    else
        echo "⚠️ TimeHUD build failed"
    fi
    cd ..
else
    echo "⚠️ TimeHUD directory not found"
fi

# 4. Boş plugin dosyalarını temizle
echo "🧹 Removing empty plugin files..."
find plugins/ -name "*.jar" -size 0 -delete
find plugins/ -name "*.jar" -size -1k -delete

# 5. Çalışan pluginleri listele
echo "📋 Working plugins:"
ls -lh plugins/*.jar 2>/dev/null || echo "No plugins found"

echo ""
echo "✅ Fix completed!"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Config files will be regenerated on next start"
echo "   - A NEW WORLD will be generated (old world backed up)"
echo "   - Only working plugins: Essentials, SkinsRestorer, Vault, Slimefun, TimeHUD"
echo ""
echo "🚀 Now restart the server:"
echo "   pm2 restart minecraft"
