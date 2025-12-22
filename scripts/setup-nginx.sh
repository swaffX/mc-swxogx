#!/bin/bash

# Nginx Reverse Proxy Setup for Web Panel
# Domain: swxogx.mooo.com -> http://localhost:3000

echo "🌐 Setting up Nginx Reverse Proxy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt update
    apt install -y nginx
else
    echo "✅ Nginx already installed"
fi

# 2. Create Nginx config for web panel
echo "📝 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/swxogx-panel << 'EOF'
server {
    listen 80;
    server_name swxogx.mooo.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/swxogx-panel-access.log;
    error_log /var/log/nginx/swxogx-panel-error.log;

    # Reverse proxy to Node.js API
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

# 3. Enable site
echo "🔗 Enabling site..."
ln -sf /etc/nginx/sites-available/swxogx-panel /etc/nginx/sites-enabled/

# 4. Remove default site if exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "🗑️  Removing default site..."
    rm /etc/nginx/sites-enabled/default
fi

# 5. Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    # 6. Restart Nginx
    echo "🔄 Restarting Nginx..."
    systemctl restart nginx
    systemctl enable nginx
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Nginx setup completed!"
    echo ""
    echo "🌐 Web Panel URL: http://swxogx.mooo.com"
    echo "🎮 Minecraft Server: swxogx.mooo.com:25565"
    echo ""
    echo "📊 Nginx Status:"
    systemctl status nginx --no-pager | head -10
    echo ""
    echo "🔍 Test the panel:"
    echo "   curl -I http://swxogx.mooo.com"
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
