#!/bin/bash

# Let's Encrypt SSL Setup for swxogx.mooo.com
# Requires: Nginx already configured

echo "🔒 Setting up Let's Encrypt SSL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Install Certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
else
    echo "✅ Certbot already installed"
fi

# 2. Get SSL certificate
echo "🔐 Obtaining SSL certificate..."
echo "⚠️  Make sure swxogx.mooo.com points to this server!"
echo ""

read -p "Continue with SSL setup? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ SSL setup cancelled"
    exit 1
fi

# Get certificate
certbot --nginx -d swxogx.mooo.com --non-interactive --agree-tos --email admin@swxogx.mooo.com --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ SSL certificate installed successfully!"
    echo ""
    echo "🌐 Web Panel URL: https://swxogx.mooo.com (HTTPS)"
    echo "🔒 SSL Certificate: Active"
    echo "🔄 Auto-renewal: Enabled"
    echo ""
    echo "📝 Certificate info:"
    certbot certificates
    echo ""
    echo "⚠️  IMPORTANT: Update Firebase authorized domains!"
    echo "   Firebase Console > Authentication > Settings > Authorized domains"
    echo "   Add: swxogx.mooo.com"
    echo ""
    echo "🔍 Test SSL:"
    echo "   curl -I https://swxogx.mooo.com"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ SSL certificate installation failed!"
    echo "   Make sure swxogx.mooo.com DNS points to this server"
    echo "   Check: dig swxogx.mooo.com"
    exit 1
fi
