#!/bin/bash
# Minecraft Server 1.21.10 - Ubuntu VPS Installation Script
# ===========================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Minecraft Server Installation${NC}"
echo -e "${GREEN}  IP: 194.105.5.37:25565${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Update system
echo -e "${YELLOW}[1/5] Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Java 21
echo -e "${YELLOW}[2/5] Installing Java 21...${NC}"
if ! command -v java &> /dev/null; then
    sudo apt install openjdk-21-jre-headless -y
else
    echo "Java is already installed"
fi

# Verify Java installation
java -version

# Install screen (for background running)
echo -e "${YELLOW}[3/5] Installing screen...${NC}"
sudo apt install screen -y

# Configure firewall
echo -e "${YELLOW}[4/5] Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 25565/tcp
    sudo ufw allow 22/tcp
    echo "Firewall rules added (port 25565 opened)"
else
    echo "UFW not found, skipping firewall configuration"
fi

# Make scripts executable
echo -e "${YELLOW}[5/5] Setting permissions...${NC}"
chmod +x start.sh backup.sh

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Server IP: 194.105.5.37:25565${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit server.properties if needed"
echo "2. Run: ./start.sh"
echo "   Or use screen: screen -dmS minecraft ./start.sh"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "- Start in background: screen -dmS minecraft ./start.sh"
echo "- Attach to console: screen -r minecraft"
echo "- Detach from console: Ctrl+A then D"
echo "- Stop server: Type 'stop' in console"
echo ""
