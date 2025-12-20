#!/bin/bash
# Minecraft Server 1.21.10 - Ubuntu VPS Start Script
# ===================================================
# GitHub Actions Deployment: Active

# Memory settings (8GB VPS optimized)
MIN_RAM="4G"
MAX_RAM="7G"

# JVM optimization flags (Aikar's flags)
JVM_FLAGS="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 \
-XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch \
-XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M \
-XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 \
-XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 \
-XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem \
-XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs \
-Daikars.new.flags=true"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Minecraft Server 1.21.10${NC}"
echo -e "${GREEN}  IP: 194.105.5.37:25565${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Memory: ${MIN_RAM} to ${MAX_RAM}${NC}"
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}Java is not installed!${NC}"
    echo "Please run: ./install.sh"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 21 ]; then
    echo -e "${RED}Java 21 or higher is required!${NC}"
    echo "Current version: $JAVA_VERSION"
    exit 1
fi

# Start server with auto-restart
while true; do
    java -Xms${MIN_RAM} -Xmx${MAX_RAM} ${JVM_FLAGS} -jar server.jar nogui
    
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}Server stopped gracefully.${NC}"
        break
    else
        echo -e "${RED}Server crashed with exit code: $EXIT_CODE${NC}"
        echo -e "${YELLOW}Restarting in 10 seconds...${NC}"
        echo "Press Ctrl+C to cancel restart"
        sleep 10
    fi
done
