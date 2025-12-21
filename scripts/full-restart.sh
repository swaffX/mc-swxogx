#!/bin/bash
# Full restart script - Tüm servisleri düzgün şekilde yeniden başlatır
# Kullanım: bash /opt/minecraft/scripts/full-restart.sh

set -e
cd /opt/minecraft

echo "🛑 1. Tüm servisleri durdur..."
pm2 delete all 2>/dev/null || true
pkill -9 java 2>/dev/null || true
pkill -9 node 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
sleep 3

echo "🗑️ 2. Session lock dosyalarını temizle..."
rm -f /opt/minecraft/world/session.lock
rm -f /opt/minecraft/world_nether/session.lock
rm -f /opt/minecraft/world_the_end/session.lock

echo "📥 3. Git'ten son değişiklikleri al..."
git stash 2>/dev/null || true
git pull origin main

echo "🔨 4. TimeHUD plugin'i derle..."
cd /opt/minecraft/TimeHUD
mvn clean package -DskipTests -q
echo "✅ TimeHUD derlendi: $(ls -lh target/TimeHUD-1.0.0.jar)"

echo "📦 5. Plugin'i kopyala..."
rm -f /opt/minecraft/plugins/TimeHUD*.jar
cp target/TimeHUD-1.0.0.jar /opt/minecraft/plugins/
echo "✅ Plugin kopyalandı: $(ls -lh /opt/minecraft/plugins/TimeHUD-1.0.0.jar)"

echo "🚀 6. Servisleri başlat..."
cd /opt/minecraft
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Tüm servisler başlatıldı!"
pm2 list
