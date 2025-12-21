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

# 3. TÜM Java process'lerini kontrol et ve kapat
echo "🔍 Checking for ALL running Java processes..."
JAVA_PIDS=$(pgrep -f "java.*server.jar")

if [ ! -z "$JAVA_PIDS" ]; then
    echo "⚠️  Found Java processes: $JAVA_PIDS"
    echo "🔪 Killing ALL Java processes..."
    pkill -9 -f "java.*server.jar"
    sleep 2
    
    # Tekrar kontrol et
    REMAINING=$(pgrep -f "java.*server.jar")
    if [ ! -z "$REMAINING" ]; then
        echo "⚠️  Some processes still running, force killing..."
        kill -9 $REMAINING 2>/dev/null
    fi
else
    echo "✅ No Java processes found"
fi

# 4. Session lock'ları temizle
echo "🧹 Cleaning session locks..."
cd /opt/minecraft
rm -f world/session.lock 2>/dev/null && echo "   ✓ world/session.lock" || echo "   ✗ world/session.lock (not found)"
rm -f world_nether/session.lock 2>/dev/null && echo "   ✓ world_nether/session.lock" || echo "   ✗ world_nether/session.lock (not found)"
rm -f world_the_end/session.lock 2>/dev/null && echo "   ✓ world_the_end/session.lock" || echo "   ✗ world_the_end/session.lock (not found)"

# 5. 2 saniye bekle
sleep 2

# 6. PM2 ile başlat
echo "▶️  Starting Minecraft via PM2..."
pm2 start minecraft

# 7. Durum kontrolü
sleep 3
echo ""
echo "� PoM2 Status:"
pm2 list

echo ""
echo "🔍 Java Processes:"
ps aux | grep "java.*server.jar" | grep -v grep

echo ""
echo "🌐 Port 25565 Status:"
lsof -i :25565 2>/dev/null || echo "   No process listening on port 25565"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Restart completed!"
echo "⏳ Server may take 30-60 seconds to fully start"
echo ""
echo "📝 To check logs: pm2 logs minecraft"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
