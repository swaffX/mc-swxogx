#!/bin/bash

# Minecraft Restart Script
# Güvenli ve sağlam restart işlemi

echo "🔄 Minecraft Restart Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. PM2 ile durdur
echo "⏸️  Stopping Minecraft via PM2..."
pm2 stop minecraft

# 2. 2 saniye bekle
sleep 2

# 3. Java process'lerini kontrol et
echo "🔍 Checking for running Java processes..."
JAVA_PID=$(pgrep -f "java.*server.jar")

if [ ! -z "$JAVA_PID" ]; then
    echo "⚠️  Java process still running (PID: $JAVA_PID), killing..."
    pkill -9 -f "java.*server.jar"
    sleep 1
else
    echo "✅ No Java processes found"
fi

# 4. Session lock'ları temizle
echo "🧹 Cleaning session locks..."
cd /opt/minecraft
rm -f world/session.lock 2>/dev/null && echo "   ✓ world/session.lock" || echo "   ✗ world/session.lock (not found)"
rm -f world_nether/session.lock 2>/dev/null && echo "   ✓ world_nether/session.lock" || echo "   ✗ world_nether/session.lock (not found)"
rm -f world_the_end/session.lock 2>/dev/null && echo "   ✓ world_the_end/session.lock" || echo "   ✗ world_the_end/session.lock (not found)"

# 5. 1 saniye bekle
sleep 1

# 6. PM2 ile başlat
echo "▶️  Starting Minecraft via PM2..."
pm2 start minecraft

# 7. Durum kontrolü
sleep 2
echo ""
echo "📊 PM2 Status:"
pm2 list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Restart completed!"
echo "⏳ Server may take 30-60 seconds to fully start"
echo ""
echo "📝 To check logs: pm2 logs minecraft"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
