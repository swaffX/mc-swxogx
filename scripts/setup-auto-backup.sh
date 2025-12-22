#!/bin/bash
# Otomatik Backup Kurulum Script'i
# =================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup.sh"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Otomatik backup kurulumu başlıyor...${NC}"

# Backup script'inin var olduğunu kontrol et
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}Hata: backup.sh bulunamadı!${NC}"
    exit 1
fi

# Script'i çalıştırılabilir yap
chmod +x "$BACKUP_SCRIPT"

# Mevcut crontab'ı al
CURRENT_CRON=$(crontab -l 2>/dev/null || echo "")

# Backup job zaten var mı kontrol et
if echo "$CURRENT_CRON" | grep -q "backup.sh"; then
    echo -e "${YELLOW}Backup cron job zaten mevcut.${NC}"
    echo "Mevcut cron jobs:"
    echo "$CURRENT_CRON" | grep "backup"
    exit 0
fi

# Yeni cron job ekle (her gün saat 04:00'te)
NEW_CRON="$CURRENT_CRON
# Minecraft Server Daily Backup - Her gün 04:00'te
0 4 * * * cd /opt/minecraft && /bin/bash ${BACKUP_SCRIPT} >> /var/log/minecraft-backup.log 2>&1"

echo "$NEW_CRON" | crontab -

echo -e "${GREEN}✅ Otomatik backup kuruldu!${NC}"
echo ""
echo "Backup zamanlaması: Her gün saat 04:00"
echo "Log dosyası: /var/log/minecraft-backup.log"
echo ""
echo "Cron job'ları görmek için: crontab -l"
echo "Manuel backup için: ./scripts/backup.sh"
