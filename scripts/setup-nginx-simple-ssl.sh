#!/bin/bash

# Simple Nginx + SSL Setup using existing certificates
# Uses existing Let's Encrypt certificates from /etc/letsencrypt

echo "🔒 Setting up Nginx with existing SSL certificates"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check for existing certificates
echo "🔍 Checking for existing SSL certificates..."
if [ -d "/etc/letsencrypt/live" ]; then
    echo "📁 Found certificates in /etc/letsencrypt/live:"
    ls -la /etc/letsencrypt/live/
    echo ""
fi

# 2. Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt update
    apt install -y nginx
else
    echo "✅ Nginx already installed"
fi

# 3. Stop Nginx if running
echo "⏸️  Stopping Nginx..."
systemctl stop nginx 2>/dev/null || true

# 4. Detect available certificate
CERT_DIR=""
if [ -d "/etc/letsencrypt/live/194.105.5.37.nip.io" ]; then
    CERT_DIR="/etc/letsencrypt/live/194.105.5.37.nip.io"
    echo "✅ Using certificate: 194.105.5.37.nip.io"
elif [ -d "/etc/letsencrypt/live/194.105.5.37.sslip.io" ]; then
    CERT_DIR="/etc/letsencrypt/live/194.105.5.37.sslip.io"
    echo "✅ Using certificate: 194.105.5.37.sslip.io"
else
    echo "⚠️  No existing certificates found"
    echo "Creating HTTP-only configuration..."
fi

# 5. Create Nginx configuration
echo "📝 Creating Nginx configuration..."

if [ -n "$CERT_DIR" ]; then
    # HTTPS configuration with existing certificate
    cat > /etc/nginx/sites-available/swxogx-panel << EOF
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name swxogx.mooo.com 194.105.5.37;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS - Main configuration
server {
    listen 443 ssl http2;
    server_name swxogx.mooo.com 194.105.5.37;

    # SSL Certificate
    ssl_certificate ${CERT_DIR}/fullchain.pem;
    ssl_certificate_key ${CERT_DIR}/privkey.pem;

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

    # Logs
    access_log /var/log/nginx/swxogx-panel-access.log;
    error_log /var/log/nginx/swxogx-panel-error.log;

    # Reverse proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
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
    echo "✅ Created HTTPS configuration"
else
    # HTTP-only configuration
    cat > /etc/nginx/sites-available/swxogx-panel << 'EOF'
server {
    listen 80;
    server_name swxogx.mooo.com 194.105.5.37;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
    echo "✅ Created HTTP-only configuration"
fi

# 6. Enable site
echo "🔗 Enabling site..."
ln -sf /etc/nginx/sites-available/swxogx-panel /etc/nginx/sites-enabled/

# 7. Remove default site
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Removing default site..."
    rm /etc/nginx/sites-enabled/default
fi

# 8. Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    # 9. Start Nginx
    echo "🔄 Starting Nginx..."
    systemctl start nginx
    systemctl enable nginx
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Nginx setup completed!"
    echo ""
    
    if [ -n "$CERT_DIR" ]; then
        echo "🔒 SSL: Enabled (using existing certificate)"
        echo "🌐 Web Panel: https://swxogx.mooo.com"
        echo "🌐 Alternative: https://194.105.5.37"
    else
        echo "⚠️  SSL: Not configured (HTTP only)"
        echo "🌐 Web Panel: http://swxogx.mooo.com"
        echo "🌐 Alternative: http://194.105.5.37"
    fi
    
    echo "🎮 Minecraft: swxogx.mooo.com:25565"
    echo ""
    echo "📊 Nginx Status:"
    systemctl status nginx --no-pager | head -10
    echo ""
    echo "🔍 Test the panel:"
    if [ -n "$CERT_DIR" ]; then
        echo "   curl -I https://swxogx.mooo.com"
    else
        echo "   curl -I http://swxogx.mooo.com"
    fi
    echo ""
    echo "📝 Logs:"
    echo "   tail -f /var/log/nginx/swxogx-panel-access.log"
    echo "   tail -f /var/log/nginx/swxogx-panel-error.log"
    echo ""
    echo "⚠️  IMPORTANT: Update Firebase authorized domains!"
    echo "   Firebase Console > Authentication > Settings > Authorized domains"
    echo "   Add: swxogx.mooo.com"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi
