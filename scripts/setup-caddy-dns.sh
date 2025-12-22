#!/bin/bash

# Caddy DNS Challenge Setup for SSL
# Uses DNS-01 challenge instead of HTTP-01 (no port 80 needed)

echo "🔒 Setting up Caddy with DNS Challenge SSL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Install Caddy with DNS plugin
echo "📦 Installing Caddy with DNS plugin..."

# Download Caddy with Cloudflare DNS plugin
wget -O /tmp/caddy.tar.gz "https://caddyserver.com/api/download?os=linux&arch=amd64&p=github.com/caddy-dns/cloudflare"
tar -xzf /tmp/caddy.tar.gz -C /tmp
mv /tmp/caddy /usr/bin/caddy
chmod +x /usr/bin/caddy
rm /tmp/caddy.tar.gz

# 2. Create Caddyfile with DNS challenge
echo "📝 Creating Caddyfile with DNS challenge..."
cat > /etc/caddy/Caddyfile << 'EOF'
{
    email admin@swxogx.mooo.com
    
    # Use DNS challenge for SSL
    acme_dns cloudflare {env.CLOUDFLARE_API_TOKEN}
}

swxogx.mooo.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    encode gzip
    
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
}
EOF

echo ""
echo "⚠️  IMPORTANT: Set Cloudflare API Token"
echo ""
echo "1. Go to: https://dash.cloudflare.com/profile/api-tokens"
echo "2. Create Token with 'Edit zone DNS' permission"
echo "3. Set environment variable:"
echo ""
echo "   export CLOUDFLARE_API_TOKEN='your-token-here'"
echo "   echo 'export CLOUDFLARE_API_TOKEN=\"your-token-here\"' >> /etc/environment"
echo ""
echo "4. Restart Caddy:"
echo "   systemctl restart caddy"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
