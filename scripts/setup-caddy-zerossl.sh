#!/bin/bash

# Caddy with ZeroSSL (Let's Encrypt Alternative)
# ZeroSSL sometimes works when Let's Encrypt fails

echo "🔒 Setting up Caddy with ZeroSSL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create Caddyfile with ZeroSSL
echo "📝 Creating Caddyfile with ZeroSSL..."
cat > /etc/caddy/Caddyfile << 'EOF'
{
    email admin@swxogx.mooo.com
    
    # Use ZeroSSL instead of Let's Encrypt
    acme_ca https://acme.zerossl.com/v2/DV90
}

swxogx.mooo.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    encode gzip
}
EOF

# Restart Caddy
echo "🔄 Restarting Caddy..."
systemctl restart caddy

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ZeroSSL setup completed!"
echo ""
echo "🌐 Web Panel URL: https://swxogx.mooo.com"
echo ""
echo "📊 Caddy Status:"
systemctl status caddy --no-pager | head -10
echo ""
echo "📝 Check logs:"
echo "   journalctl -u caddy -f"
echo ""
echo "🔍 Test:"
echo "   https://swxogx.mooo.com"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
