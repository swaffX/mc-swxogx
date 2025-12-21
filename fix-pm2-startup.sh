#!/bin/bash

# PM2 Startup Fix Script
# Removes systemd integration and cleans up multiple instances

echo "🔧 PM2 Startup Fix Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Remove PM2 from systemd startup
echo "🗑️  Step 1: Removing PM2 from systemd startup..."
pm2 unstartup systemd
echo ""

# 2. Stop all PM2 processes
echo "⏸️  Step 2: Stopping all PM2 processes..."
pm2 stop all
pm2 delete all
echo ""

# 3. Kill ALL Java processes
echo "🔪 Step 3: Killing ALL Java processes..."
pkill -9 -f "java.*server.jar"
sleep 2
echo ""

# 4. Clean session locks
echo "🧹 Step 4: Cleaning session locks..."
cd /opt/minecraft
rm -f world/session.lock 2>/dev/null && echo "   ✓ world/session.lock" || echo "   ✗ world/session.lock (not found)"
rm -f world_nether/session.lock 2>/dev/null && echo "   ✓ world_nether/session.lock" || echo "   ✗ world_nether/session.lock (not found)"
rm -f world_the_end/session.lock 2>/dev/null && echo "   ✓ world_the_end/session.lock" || echo "   ✗ world_the_end/session.lock (not found)"
echo ""

# 5. Kill PM2 daemon
echo "💀 Step 5: Killing PM2 daemon..."
pm2 kill
sleep 2
echo ""

# 6. Verify systemd service is disabled
echo "🔍 Step 6: Verifying systemd service status..."
systemctl status pm2-root.service 2>/dev/null || echo "   ✓ pm2-root.service not found (good!)"
echo ""

# 7. Start PM2 without systemd
echo "▶️  Step 7: Starting PM2 (without systemd)..."
pm2 start ecosystem.config.js
pm2 save
echo ""

# 8. Final verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fix completed!"
echo ""
echo "📊 PM2 Status:"
pm2 list
echo ""
echo "🔍 Java Processes:"
ps aux | grep "java.*server.jar" | grep -v grep || echo "   No Java processes found"
echo ""
echo "🌐 Port 25565 Status:"
lsof -i :25565 2>/dev/null || echo "   No process listening on port 25565"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "   • PM2 will NO LONGER auto-start on server reboot"
echo "   • To start manually after reboot: pm2 start ecosystem.config.js"
echo "   • To test restart: bash restart-minecraft.sh"
echo "   • Server should take 30-60 seconds to fully start"
echo ""
echo "📝 To check logs: pm2 logs minecraft"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
