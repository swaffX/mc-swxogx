#!/bin/bash
# VPS Kurulum Scripti - Node.js + PM2 + Minecraft

set -e

echo "🚀 VPS Kurulumu Başlıyor..."

# Node.js kur
echo "📦 Node.js kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kur
echo "📦 PM2 kuruluyor..."
sudo npm install -g pm2

# PM2 startup
sudo pm2 startup systemd -u root --hp /root

# Java kontrol et
if ! command -v java &> /dev/null; then
    echo "📦 Java kuruluyor..."
    sudo apt-get install -y openjdk-21-jdk
fi

# Minecraft dizini oluştur
echo "📂 Dizinler oluşturuluyor..."
mkdir -p /opt/minecraft/plugins
mkdir -p /opt/minecraft/public
mkdir -p /opt/minecraft/logs

cd /opt/minecraft

# Dependencies kur
echo "📦 Node.js dependencies kuruluyor..."
npm install

# Firewall ayarları
echo "🔥 Firewall ayarlanıyor..."
sudo ufw allow 3000/tcp  # Web panel
sudo ufw allow 25565/tcp # Minecraft
sudo ufw allow 22/tcp    # SSH

# PM2 başlat
echo "🚀 PM2 ile servisler başlatılıyor..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ KURULUM TAMAMLANDI!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎮 Minecraft Server: $(hostname -I | awk '{print $1}'):25565"
echo "🌐 Web Panel: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📊 PM2 Durumu:"
pm2 status
echo ""
echo "📝 Komutlar:"
echo "  pm2 status          - Servis durumu"
echo "  pm2 logs minecraft  - Minecraft logları"
echo "  pm2 logs minecraft-api - API logları"
echo "  pm2 restart all     - Tüm servisleri restart"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
