#!/bin/bash

# Remove Caddy Completely from VPS

echo "🗑️  Removing Caddy from VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Stop Caddy
echo "⏸️  Stopping Caddy..."
systemctl stop caddy
systemctl disable caddy

# 2. Remove Caddy package
echo "📦 Removing Caddy package..."
apt remove --purge -y caddy

# 3. Remove Caddy files
echo "🗑️  Removing Caddy files..."
rm -rf /etc/caddy
rm -rf /var/lib/caddy
rm -rf /var/log/caddy
rm -f /usr/bin/caddy
rm -f /etc/apt/sources.list.d/caddy-stable.list
rm -f /usr/share/keyrings/caddy-stable-archive-keyring.gpg

# 4. Clean up
echo "🧹 Cleaning up..."
apt autoremove -y
apt autoclean

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Caddy removed successfully!"
echo ""
echo "📊 Verification:"
command -v caddy >/dev/null 2>&1 && echo "❌ Caddy still installed" || echo "✅ Caddy not found"
systemctl status caddy 2>&1 | grep -q "could not be found" && echo "✅ Caddy service removed" || echo "⚠️  Caddy service still exists"
echo ""
echo "🔍 Port status:"
netstat -tulpn | grep -E ':(80|443)' || echo "✅ Ports 80 and 443 are free"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
