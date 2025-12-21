#!/bin/bash

# Real-Time Rol Sistemi Deployment Script
# Kullanım: bash deploy-roles.sh

echo "🚀 Real-Time Rol Sistemi Deployment Başlıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Git pull
echo "📥 Git pull yapılıyor..."
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git pull başarılı${NC}"
else
    echo -e "${RED}❌ Git pull başarısız!${NC}"
    exit 1
fi
echo ""

# 2. Data klasörünü oluştur
echo "📁 Data klasörü kontrol ediliyor..."
if [ ! -d "data" ]; then
    mkdir -p data
    echo -e "${GREEN}✅ Data klasörü oluşturuldu${NC}"
else
    echo -e "${YELLOW}⚠️  Data klasörü zaten mevcut${NC}"
fi
echo ""

# 3. Node modules kontrol
echo "📦 Node modules kontrol ediliyor..."
if [ ! -d "node_modules" ]; then
    echo "📥 npm install yapılıyor..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ npm install başarılı${NC}"
    else
        echo -e "${RED}❌ npm install başarısız!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Node modules zaten mevcut${NC}"
fi
echo ""

# 4. Session lock temizle
echo "🧹 Session lock dosyaları temizleniyor..."
rm -f world/session.lock 2>/dev/null
rm -f world_nether/session.lock 2>/dev/null
rm -f world_the_end/session.lock 2>/dev/null
echo -e "${GREEN}✅ Lock dosyaları temizlendi${NC}"
echo ""

# 5. PM2 restart
echo "🔄 PM2 servisleri yeniden başlatılıyor..."
pm2 restart all
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 restart başarılı${NC}"
else
    echo -e "${RED}❌ PM2 restart başarısız!${NC}"
    exit 1
fi
echo ""

# 6. Logları göster
echo "📊 Backend logları (son 20 satır):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 logs server --lines 20 --nostream
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 7. Başarı mesajı
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🌐 Web Panel: http://194.105.5.37:3000"
echo "🎮 Minecraft: swxogx.mooo.com"
echo ""
echo "📚 Dokümantasyon:"
echo "   - Rol Sistemi: docs/ROL_SISTEMI.md"
echo "   - Test Rehberi: docs/ROL_TEST.md"
echo "   - Tamamlanan: docs/REAL_TIME_ROL_TAMAMLANDI.md"
echo ""
echo "🧪 Test için:"
echo "   1. Web panele giriş yap: http://194.105.5.37:3000"
echo "   2. Dashboard → Role Manager"
echo "   3. Bir oyuncuya rol ata"
echo "   4. Minecraft'ta renkli bildirim gör! 🎉"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
