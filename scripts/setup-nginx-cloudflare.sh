#!/bin/bash

# Nginx + Cloudflare Origin Certificate Setup
# Uses Cloudflare's free 15-year SSL certificate

echo "🔒 Setting up Nginx with Cloudflare Origin Certificate"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt update
    apt install -y nginx
else
    echo "✅ Nginx already installed"
fi

# 2. Create SSL directory
echo "📁 Creating SSL directory..."
mkdir -p /etc/nginx/ssl

# 3. Instructions for Cloudflare Origin Certificate
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 STEP 1: Get Cloudflare Origin Certificate"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Select your domain (or add one)"
echo "3. Go to: SSL/TLS → Origin Server"
echo "4. Click: Create Certificate"
echo "5. Settings:"
echo "   - Private key type: RSA (2048)"
echo "   - Hostnames: swxogx.mooo.com, *.swxogx.mooo.com"
echo "   - Certificate Validity: 15 years"
echo "6. Click: Create"
echo ""
echo "7. Copy the Origin Certificate (PEM format)"
echo "8. Save to: /etc/nginx/ssl/cloudflare-origin.crt"
echo ""
echo "9. Copy the Private Key"
echo "10. Save to: /etc/nginx/ssl/cloudflare-origin.key"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Press Enter when you have saved both files..."

# 4. Verify SSL files exist
if [ ! -f /etc/nginx/ssl/cloudflare-origin.crt ]; then
    echo "❌ Certificate file not found: /etc/nginx/ssl/cloudflare-origin.crt"
    echo "Please create the file and run this script again"
    exit 1
fi

if [ ! -f /etc/nginx/ssl/cloudflare-origin.key ]; then
    echo "❌ Private key file not found: /etc/nginx/ssl/cloudflare-origin.key"
    echo "Please create the file and run this script again"
    exit 1
fi

# 5. Set permissions
echo "🔐 Setting SSL file permissions..."
chmod 644 /etc/nginx/ssl/cloudflare-origin.crt
chmod 600 /etc/nginx/ssl/cloudflare-origin.key
chown root:root /etc/nginx/ssl/*

# 6. Create Nginx config
echo "📝 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/swxogx-panel << 'EOF'
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name swxogx.mooo.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS - Main configuration
server {
    listen 443 ssl http2;
    server_name swxogx.mooo.com;

    # Cloudflare Origin Certificate
    ssl_certificate /etc/nginx/ssl/cloudflare-origin.crt;
    ssl_certificate_key /etc/nginx/ssl/cloudflare-origin.key;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logs
    access_log /var/log/nginx/swxogx-panel-access.log;
    error_log /var/log/nginx/swxogx-panel-error.log;

    # Reverse proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 7. Enable site
echo "🔗 Enabling site..."
ln -sf /etc/nginx/sites-available/swxogx-panel /etc/nginx/sites-enabled/

# 8. Remove default site
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Removing default site..."
    rm /etc/nginx/sites-enabled/default
fi

# 9. Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    # 10. Restart Nginx
    echo "🔄 Restarting Nginx..."
    systemctl restart nginx
    systemctl enable nginx
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Nginx + Cloudflare SSL setup completed!"
    echo ""
    echo "🌐 Web Panel URL: https://swxogx.mooo.com"
    echo "🎮 Minecraft Server: swxogx.mooo.com:25565"
    echo ""
    echo "📊 Nginx Status:"
    systemctl status nginx --no-pager | head -10
    echo ""
    echo "⚠️  IMPORTANT: Configure Cloudflare"
    echo "   1. Cloudflare Dashboard → SSL/TLS"
    echo "   2. Set Encryption Mode: Full (strict)"
    echo "   3. Enable: Always Use HTTPS"
    echo ""
    echo "🔍 Test the panel:"
    echo "   https://swxogx.mooo.com"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi
