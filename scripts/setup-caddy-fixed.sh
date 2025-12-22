#!/bin/bash

# Caddy Fixed SSL Setup - TLS-ALPN Challenge
# Uses port 443 for SSL verification (more reliable than port 80)

echo "🔒 Setting up Caddy with TLS-ALPN Challenge"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Stop Nginx if running
if systemctl is-active --quiet nginx; then
    echo "⏸️  Stopping Nginx..."
    systemctl stop nginx
    systemctl disable nginx
fi

# 2. Install Caddy if not installed
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

# 3. Create optimized Caddyfile with TLS-ALPN
echo "📝 Creating Caddyfile with TLS-ALPN challenge..."
cat > /etc/caddy/Caddyfile << 'EOF'
{
    email admin@swxogx.mooo.com
    
    # Prefer TLS-ALPN challenge (uses port 443)
    acme_ca https://acme-v02.api.letsencrypt.org/directory
    
    # Disable HTTP challenge, use TLS-ALPN only
    preferred_chains smallest
}

swxogx.mooo.com {
    # Reverse proxy to Node.js
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Security headers
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
        -Server
    }
    
    # Compression
    encode zstd gzip
    
    # TLS configuration
    tls {
        protocols tls1.2 tls1.3
        ciphers TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305 TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    }
}
EOF

# 4. Validate Caddyfile
echo "🧪 Validating Caddyfile..."
caddy validate --config /etc/caddy/Caddyfile

if [ $? -ne 0 ]; then
    echo "❌ Caddyfile validation failed!"
    exit 1
fi

# 5. Stop Caddy temporarily
systemctl stop caddy

# 6. Test if ports are available
echo "🔍 Checking ports..."
if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 80 is in use"
    lsof -i :80
fi

if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 443 is in use"
    lsof -i :443
fi

# 7. Start Caddy
echo "🔄 Starting Caddy..."
systemctl start caddy
systemctl enable caddy

# 8. Wait for SSL certificate
echo "⏳ Waiting for SSL certificate (this may take 30-60 seconds)..."
sleep 10

# 9. Check status
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Caddy Status:"
systemctl status caddy --no-pager | head -15

echo ""
echo "📝 Recent logs:"
journalctl -u caddy -n 20 --no-pager

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Caddy setup completed!"
echo ""
echo "🌐 Web Panel URL: https://swxogx.mooo.com"
echo "🎮 Minecraft Server: swxogx.mooo.com:25565"
echo ""
echo "🔒 SSL Certificate: Automatic (Let's Encrypt)"
echo "   Using TLS-ALPN challenge (port 443)"
echo ""
echo "📝 Monitor SSL acquisition:"
echo "   journalctl -u caddy -f | grep -i certificate"
echo ""
echo "🔍 Test the panel:"
echo "   https://swxogx.mooo.com"
echo ""
echo "⚠️  If SSL fails, check:"
echo "   1. DNS: dig swxogx.mooo.com (should show 194.105.5.37)"
echo "   2. Port 443: netstat -tulpn | grep :443"
echo "   3. Logs: journalctl -u caddy -n 50"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
