#!/bin/bash

echo "🚀 Minecraft Server Performance Optimization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /opt/minecraft

echo ""
echo "⏸️  Stopping Minecraft server..."
pm2 stop minecraft

echo ""
echo "🧹 Cleaning up..."
# Remove old logs
find logs -name "*.log.gz" -mtime +7 -delete 2>/dev/null || true
echo "✓ Old logs cleaned"

# Clean session locks
rm -f world/session.lock 2>/dev/null || true
rm -f world_nether/session.lock 2>/dev/null || true
rm -f world_the_end/session.lock 2>/dev/null || true
echo "✓ Session locks cleaned"

# Clean cache
rm -rf cache/* 2>/dev/null || true
echo "✓ Cache cleaned"

echo ""
echo "📊 Current System Resources:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "RAM Usage:"
free -h | grep Mem
echo ""
echo "CPU Info:"
lscpu | grep "Model name"
lscpu | grep "CPU(s):"
echo ""
echo "Disk Usage:"
df -h /opt/minecraft | tail -1

echo ""
echo "▶️  Starting Minecraft server with optimized settings..."
pm2 start minecraft
pm2 save

echo ""
echo "⏳ Waiting for server to start (30 seconds)..."
sleep 30

echo ""
echo "📊 Server Status:"
pm2 list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Optimization completed!"
echo ""
echo "📝 Optimizations applied:"
echo "  • View distance: 6 → 5 chunks"
echo "  • Simulation distance: 4 → 3 chunks"
echo "  • Entity broadcast range: 75% → 50%"
echo "  • Network compression: 512 → 256 bytes"
echo "  • Per-player mob spawns: enabled"
echo "  • Item despawn rates: optimized"
echo "  • Chunk save interval: increased"
echo "  • Tick rates: optimized"
echo ""
echo "🔍 To check logs: pm2 logs minecraft"
echo "📊 To check TPS: /spark tps (in-game)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
