#!/bin/bash

# Caddy with Self-Signed SSL Certificate
# Quick SSL without Let's Encrypt (for testing/internal use)

echo "🔒 Setting up Caddy with Self-Signed SSL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Create SSL directory
mkdir -p /etc/caddy/ssl
cd /etc/caddy/ssl

# 2. Generate self-signed certificate
echo "🔐 Generating self-signed certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout swxogx.key \
    -out swxogx.crt \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=SWXOGX/CN=swxogx.mooo.com"

# 3. Set permissions
chown caddy:caddy /etc/caddy/ssl/*
chmod 600 /etc/caddy/ssl/swxogx.key
chmod 644 /etc/caddy/ssl/swxogx.crt

# 4. Create Caddyfile with self-signed cert
echo "📝 Creating Caddyfile..."
cat > /etc/caddy/Caddyfile << 'EOF'
swxogx.mooo.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    encode gzip
    
    tls /etc/caddy/ssl/swxogx.crt /etc/caddy/ssl/swxogx.key
}
EOF

# 5. Restart Caddy
echo "🔄 Restarting Caddy..."
systemctl restart caddy

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Self-signed SSL setup completed!"
echo ""
echo "🌐 Web Panel URL: https://swxogx.mooo.com"
echo ""
echo "⚠️  Browser Warning:"
echo "   Your browser will show 'Not Secure' warning"
echo "   Click 'Advanced' → 'Proceed to swxogx.mooo.com'"
echo "   This is normal for self-signed certificates"
echo ""
echo "📊 Caddy Status:"
systemctl status caddy --no-pager | head -10
echo ""
echo "🔍 Test:"
echo "   https://swxogx.mooo.com"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
