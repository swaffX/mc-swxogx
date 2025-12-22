#!/bin/bash

# Caddy Setup with Automatic SSL
# Caddy automatically handles SSL certificates from Let's Encrypt

echo "🚀 Setting up Caddy with Automatic SSL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Stop and remove Nginx if running
if systemctl is-active --quiet nginx; then
    echo "⏸️  Stopping Nginx..."
    systemctl stop nginx
    systemctl disable nginx
fi

# 2. Install Caddy
if ! command -v caddy &> /dev/null; then
    echo "📦 Installing Caddy..."
    apt update
    apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
    apt update
    apt install -y caddy
else
    echo "✅ Caddy already installed"
fi

# 3. Create Caddyfile
echo "📝 Creating Caddyfile..."
cat > /etc/caddy/Caddyfile << 'EOF'
# Caddy Configuration for SWXOGX Panel
# Automatic HTTPS with Let's Encrypt

swxogx.mooo.com {
    # Reverse proxy to Node.js API
    reverse_proxy localhost:3000
    
    # Security headers
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Logging
    log {
        output file /var/log/caddy/swxogx-panel.log
        format json
    }
    
    # Gzip compression
    encode gzip
}
EOF

# 4. Create log directory
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy

# 5. Validate Caddyfile
echo "🧪 Validating Caddyfile..."
caddy validate --config /etc/caddy/Caddyfile

if [ $? -eq 0 ]; then
    # 6. Restart Caddy
    echo "🔄 Restarting Caddy..."
    systemctl restart caddy
    systemctl enable caddy
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Caddy setup completed!"
    echo ""
    echo "🌐 Web Panel URL: https://swxogx.mooo.com (HTTPS automatic!)"
    echo "🎮 Minecraft Server: swxogx.mooo.com:25565"
    echo ""
    echo "📊 Caddy Status:"
    systemctl status caddy --no-pager | head -10
    echo ""
    echo "🔒 SSL Certificate: Automatic (Let's Encrypt)"
    echo "   Caddy will obtain SSL certificate on first HTTPS request"
    echo ""
    echo "📝 Logs:"
    echo "   journalctl -u caddy -f"
    echo "   tail -f /var/log/caddy/swxogx-panel.log"
    echo ""
    echo "⚠️  IMPORTANT: Update Firebase authorized domains!"
    echo "   Firebase Console > Authentication > Settings > Authorized domains"
    echo "   Add: swxogx.mooo.com"
    echo ""
    echo "🔍 Test the panel:"
    echo "   https://swxogx.mooo.com"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Caddyfile validation failed!"
    exit 1
fi
