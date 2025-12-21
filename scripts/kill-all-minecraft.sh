#!/bin/bash

# Kill ALL Minecraft instances and restart clean

echo "🔪 Killing ALL Minecraft Instances"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Stop PM2 minecraft
echo "⏸️  Stopping PM2 minecraft..."
pm2 stop minecraft 2>/dev/null || true
pm2 delete minecraft 2>/dev/null || true

# 2. Kill ALL Java processes (no exceptions)
echo "🔪 Killing ALL Java processes..."
pkill -9 -f "java.*server.jar"
sleep 2

# Double check and force kill any remaining
REMAINING=$(pgrep -f "java.*server.jar")
if [ ! -z "$REMAINING" ]; then
    echo "⚠️  Found remaining processes: $REMAINING"
    kill -9 $REMAINING 2>/dev/null
    sleep 1
fi

# 3. Verify all killed
echo "🔍 Verifying all Java processes killed..."
FINAL_CHECK=$(pgrep -f "java.*server.jar")
if [ -z "$FINAL_CHECK" ]; then
    echo "✅ All Java processes killed"
else
    echo "❌ ERROR: Some processes still running: $FINAL_CHECK"
    exit 1
fi

# 4. Clean session locks
echo "🧹 Cleaning session locks..."
cd /opt/minecraft
rm -f world/session.lock 2>/dev/null && echo "   ✓ world/session.lock" || echo "   ✗ world/session.lock"
rm -f world_nether/session.lock 2>/dev/null && echo "   ✓ world_nether/session.lock" || echo "   ✗ world_nether/session.lock"
rm -f world_the_end/session.lock 2>/dev/null && echo "   ✓ world_the_end/session.lock" || echo "   ✗ world_the_end/session.lock"

# 5. Wait for port to be free
echo "⏳ Waiting for port 25565 to be free..."
sleep 3

# 6. Check port
PORT_CHECK=$(lsof -i :25565 2>/dev/null)
if [ ! -z "$PORT_CHECK" ]; then
    echo "⚠️  Port 25565 still in use!"
    lsof -i :25565
    exit 1
else
    echo "✅ Port 25565 is free"
fi

# 7. Start ONLY via PM2
echo "▶️  Starting Minecraft via PM2..."
pm2 start minecraft

# 8. Wait and verify
sleep 5
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Clean restart completed!"
echo ""
echo "📊 PM2 Status:"
pm2 list
echo ""
echo "🔍 Java Processes (should be ONLY 1):"
ps aux | grep "java.*server.jar" | grep -v grep
echo ""
JAVA_COUNT=$(ps aux | grep "java.*server.jar" | grep -v grep | wc -l)
if [ "$JAVA_COUNT" -eq 1 ]; then
    echo "✅ SUCCESS: Only 1 Java process running"
else
    echo "❌ ERROR: $JAVA_COUNT Java processes running (should be 1)"
fi
echo ""
echo "🌐 Port 25565:"
lsof -i :25565 2>/dev/null || echo "   Waiting for server to bind..."
echo ""
echo "📝 To check logs: pm2 logs minecraft"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
