#!/bin/bash
# Minecraft Server Backup Script
# ================================

# Environment variables'dan veya varsayılan değerlerden al
BACKUP_DIR="${BACKUP_DIR:-$HOME/minecraft-backups}"
SERVER_DIR="$(pwd)"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="minecraft-backup-${DATE}.tar.gz"
DISCORD_WEBHOOK="${BACKUP_DISCORD_WEBHOOK:-}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Discord bildirim fonksiyonu
send_discord_notification() {
    local title="$1"
    local description="$2"
    local color="$3"
    
    if [ -n "$DISCORD_WEBHOOK" ]; then
        curl -s -H "Content-Type: application/json" \
            -d "{\"embeds\":[{\"title\":\"$title\",\"description\":\"$description\",\"color\":$color,\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}]}" \
            "$DISCORD_WEBHOOK" > /dev/null 2>&1
    fi
}

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo -e "${YELLOW}Starting backup...${NC}"
echo "Backup name: ${BACKUP_NAME}"

# Backup başladı bildirimi
send_discord_notification "📦 Backup Başladı" "Sunucu backup'ı oluşturuluyor..." "16776960"

# Create backup
tar -czf ${BACKUP_DIR}/${BACKUP_NAME} \
    --exclude='*.log' \
    --exclude='cache' \
    --exclude='libraries' \
    world/ \
    world_nether/ \
    world_the_end/ \
    server.properties \
    ops.json \
    whitelist.json \
    banned-players.json \
    banned-ips.json \
    plugins/ \
    2>/dev/null

# Backup başarılı mı kontrol et
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h ${BACKUP_DIR}/${BACKUP_NAME} | cut -f1)
    echo -e "${GREEN}Backup completed!${NC}"
    echo "Location: ${BACKUP_DIR}/${BACKUP_NAME}"
    echo "Size: ${BACKUP_SIZE}"
    
    # Başarı bildirimi
    send_discord_notification "✅ Backup Tamamlandı" "Dosya: ${BACKUP_NAME}\\nBoyut: ${BACKUP_SIZE}" "65280"
else
    echo -e "${RED}Backup failed!${NC}"
    send_discord_notification "❌ Backup Hatası" "Backup oluşturulurken bir hata oluştu!" "16711680"
    exit 1
fi

# Keep only last N backups (based on retention days, assuming 1 backup per day)
cd ${BACKUP_DIR}
BACKUP_COUNT=$((RETENTION_DAYS + 1))
DELETED=$(ls -t minecraft-backup-*.tar.gz 2>/dev/null | tail -n +${BACKUP_COUNT} | wc -l)
ls -t minecraft-backup-*.tar.gz 2>/dev/null | tail -n +${BACKUP_COUNT} | xargs -r rm

echo "Total backups: $(ls -1 minecraft-backup-*.tar.gz 2>/dev/null | wc -l)"
if [ "$DELETED" -gt 0 ]; then
    echo "Deleted $DELETED old backup(s)"
fi
