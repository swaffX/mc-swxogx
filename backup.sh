#!/bin/bash
# Minecraft Server Backup Script
# ================================

BACKUP_DIR="$HOME/minecraft-backups"
SERVER_DIR="$(pwd)"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="minecraft-backup-${DATE}.tar.gz"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo -e "${YELLOW}Starting backup...${NC}"
echo "Backup name: ${BACKUP_NAME}"

# Create backup
tar -czf ${BACKUP_DIR}/${BACKUP_NAME} \
    --exclude='*.log' \
    --exclude='cache' \
    world/ \
    world_nether/ \
    world_the_end/ \
    server.properties \
    ops.json \
    whitelist.json \
    banned-players.json \
    banned-ips.json \
    2>/dev/null

# Keep only last 7 backups
cd ${BACKUP_DIR}
ls -t minecraft-backup-*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm

echo -e "${GREEN}Backup completed!${NC}"
echo "Location: ${BACKUP_DIR}/${BACKUP_NAME}"
echo "Total backups: $(ls -1 minecraft-backup-*.tar.gz 2>/dev/null | wc -l)"
