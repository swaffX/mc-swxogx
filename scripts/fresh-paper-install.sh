#!/bin/bash

echo "🧹 Paper 1.21.1 Temiz Kurulum"
echo "=============================="
echo ""
echo "⚠️  UYARI: Tüm eski veriler silinecek!"
echo ""

cd /opt/minecraft

# 1. Sunucuyu durdur
echo "⏸️  Sunucu durduruluyor..."
export PM2_HOME=/tmp/.pm2
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# 2. Tüm eski dosyaları sil
echo "🗑️  Eski dosyalar siliniyor..."
rm -rf world/ world_nether/ world_the_end/
rm -rf mods/ plugins/ config/ libraries/ versions/ cache/
rm -rf logs/ crash-reports/
rm -f *.jar *.log
rm -f run.sh run.bat start-*.sh user_jvm_args.txt
rm -f banned-ips.json banned-players.json ops.json whitelist.json
rm -f usercache.json eula.txt

# 3. Paper 1.21.1 indir (wget ile)
echo "⬇️  Paper 1.21.1 indiriliyor..."
wget -q --show-progress -O server.jar \
  "https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/132/downloads/paper-1.21.1-132.jar"

# wget başarısız olursa curl dene
if [ ! -f "server.jar" ] || [ $(stat -c%s "server.jar" 2>/dev/null || echo 0) -lt 1000000 ]; then
    echo "wget başarısız, curl deneniyor..."
    rm -f server.jar
    curl -L -o server.jar \
      "https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/132/downloads/paper-1.21.1-132.jar"
fi

if [ ! -f "server.jar" ]; then
    echo "❌ Paper indirilemedi!"
    exit 1
fi

size=$(stat -c%s "server.jar" 2>/dev/null || stat -f%z "server.jar" 2>/dev/null)
if [ "$size" -lt 1000000 ]; then
    echo "❌ Paper dosyası çok küçük ($size bytes), indirme başarısız!"
    exit 1
fi
echo "✅ Paper indirildi: $((size / 1024 / 1024)) MB"

# 4. EULA kabul et
echo "📝 EULA kabul ediliyor..."
echo "eula=true" > eula.txt

# 5. Plugins klasörü oluştur
echo "📁 Plugins klasörü oluşturuluyor..."
mkdir -p plugins

# 6. server.properties oluştur
echo "⚙️  server.properties oluşturuluyor..."
cat > server.properties << 'EOF'
#Minecraft server properties
server-port=25565
motd=\u00a7b\u00a7lSwxOgx \u00a7f| \u00a7aPaper 1.21.1
max-players=20
view-distance=10
simulation-distance=8
online-mode=false
enable-rcon=true
rcon.port=25575
rcon.password=SwxOgx2024Rcon!
difficulty=normal
gamemode=survival
pvp=true
spawn-protection=16
allow-flight=false
white-list=false
enforce-whitelist=false
spawn-npcs=true
spawn-animals=true
spawn-monsters=true
generate-structures=true
level-name=world
level-seed=
level-type=minecraft\:normal
max-world-size=29999984
network-compression-threshold=256
enable-command-block=true
enable-query=false
player-idle-timeout=0
prevent-proxy-connections=false
broadcast-rcon-to-ops=true
broadcast-console-to-ops=true
max-tick-time=60000
use-native-transport=true
enable-status=true
allow-nether=true
op-permission-level=4
function-permission-level=2
rate-limit=0
sync-chunk-writes=true
text-filtering-config=
entity-broadcast-range-percentage=100
EOF

# 7. bukkit.yml oluştur
echo "⚙️  bukkit.yml oluşturuluyor..."
cat > bukkit.yml << 'EOF'
settings:
  allow-end: true
  warn-on-overload: true
  permissions-file: permissions.yml
  update-folder: update
  plugin-profiling: false
  connection-throttle: 4000
  query-plugins: true
  deprecated-verbose: default
  shutdown-message: Server kapandi!
  minimum-api: none
  use-map-color-cache: true
spawn-limits:
  monsters: 70
  animals: 10
  water-animals: 5
  water-ambient: 20
  water-underground-creature: 5
  axolotls: 5
  ambient: 15
chunk-gc:
  period-in-ticks: 600
ticks-per:
  animal-spawns: 400
  monster-spawns: 1
  water-spawns: 1
  water-ambient-spawns: 1
  water-underground-creature-spawns: 1
  axolotl-spawns: 1
  ambient-spawns: 1
  autosave: 6000
EOF

# 8. spigot.yml oluştur
echo "⚙️  spigot.yml oluşturuluyor..."
cat > spigot.yml << 'EOF'
settings:
  debug: false
  bungeecord: false
  late-bind: false
  sample-count: 12
  player-shuffle: 0
  user-cache-size: 1000
  save-user-cache-on-stop-only: false
  moved-wrongly-threshold: 0.0625
  moved-too-quickly-multiplier: 10.0
  timeout-time: 60
  restart-on-crash: false
  restart-script: ./start.sh
  netty-threads: 4
  log-villager-deaths: true
  log-named-deaths: true
messages:
  whitelist: Sunucuya erisim izniniz yok!
  unknown-command: Bilinmeyen komut.
  server-full: Sunucu dolu!
  outdated-client: Eski istemci! Lutfen {0} surumunu kullanin.
  outdated-server: Eski sunucu! Lutfen {0} surumunu kullanin.
  restart: Sunucu yeniden baslatiliyor...
commands:
  replace-commands:
  - setblock
  - summon
  - testforblock
  - tellraw
  spam-exclusions:
  - /skill
  silent-commandblock-console: false
  log: true
  tab-complete: 0
  send-namespaced: true
world-settings:
  default:
    verbose: false
    merge-radius:
      item: 2.5
      exp: 3.0
    item-despawn-rate: 6000
    view-distance: default
    simulation-distance: default
    thunder-chance: 100000
    enable-zombie-pigmen-portal-spawns: true
    wither-spawn-sound-radius: 0
    hanging-tick-frequency: 100
    arrow-despawn-rate: 1200
    trident-despawn-rate: 1200
    zombie-aggressive-towards-villager: true
    nerf-spawner-mobs: false
    mob-spawn-range: 8
    end-portal-sound-radius: 0
    max-tnt-per-tick: 100
    entity-activation-range:
      animals: 32
      monsters: 32
      raiders: 48
      misc: 16
      water: 16
      villagers: 32
      flying-monsters: 32
      villagers-work-immunity-after: 100
      villagers-work-immunity-for: 20
      villagers-active-for-panic: true
      tick-inactive-villagers: true
      wake-up-inactive:
        animals-max-per-tick: 4
        animals-every: 1200
        animals-for: 100
        monsters-max-per-tick: 8
        monsters-every: 400
        monsters-for: 100
        villagers-max-per-tick: 4
        villagers-every: 600
        villagers-for: 100
        flying-monsters-max-per-tick: 8
        flying-monsters-every: 200
        flying-monsters-for: 100
    entity-tracking-range:
      players: 48
      animals: 48
      monsters: 48
      misc: 32
      display: 128
      other: 64
    growth:
      cactus-modifier: 100
      cane-modifier: 100
      melon-modifier: 100
      mushroom-modifier: 100
      pumpkin-modifier: 100
      sapling-modifier: 100
      beetroot-modifier: 100
      carrot-modifier: 100
      potato-modifier: 100
      wheat-modifier: 100
      netherwart-modifier: 100
      vine-modifier: 100
      cocoa-modifier: 100
      bamboo-modifier: 100
      sweetberry-modifier: 100
      kelp-modifier: 100
      twistingvines-modifier: 100
      weepingvines-modifier: 100
      cavevines-modifier: 100
      glowberry-modifier: 100
      pitcherplant-modifier: 100
      torchflower-modifier: 100
EOF

# 9. PM2 ecosystem.config.js güncelle
echo "⚙️  ecosystem.config.js güncelleniyor..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'minecraft',
      script: 'java',
      args: [
        '-Xms4G',
        '-Xmx4G',
        '-XX:+UseG1GC',
        '-XX:+ParallelRefProcEnabled',
        '-XX:MaxGCPauseMillis=200',
        '-XX:+UnlockExperimentalVMOptions',
        '-XX:+DisableExplicitGC',
        '-XX:+AlwaysPreTouch',
        '-XX:G1NewSizePercent=30',
        '-XX:G1MaxNewSizePercent=40',
        '-XX:G1HeapRegionSize=8M',
        '-XX:G1ReservePercent=20',
        '-XX:G1HeapWastePercent=5',
        '-XX:G1MixedGCCountTarget=4',
        '-XX:InitiatingHeapOccupancyPercent=15',
        '-XX:G1MixedGCLiveThresholdPercent=90',
        '-XX:G1RSetUpdatingPauseTimePercent=5',
        '-XX:SurvivorRatio=32',
        '-XX:+PerfDisableSharedMem',
        '-XX:MaxTenuringThreshold=1',
        '-Dusing.aikars.flags=https://mcflags.emc.gs',
        '-Daikars.new.flags=true',
        '-jar',
        'server.jar',
        'nogui'
      ],
      cwd: '/opt/minecraft',
      autorestart: false,
      max_memory_restart: '4G',
      env: {
        PM2_HOME: '/tmp/.pm2'
      }
    },
    {
      name: 'minecraft-api',
      script: 'server.js',
      cwd: '/opt/minecraft',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# 10. Temel pluginleri indir
echo "📦 Temel pluginler indiriliyor..."
cd plugins

# Vault
echo "   - Vault..."
wget -q -O Vault.jar "https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar" || \
curl -L -o Vault.jar "https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar"

# EssentialsX
echo "   - EssentialsX..."
wget -q -O EssentialsX.jar "https://github.com/EssentialsX/Essentials/releases/download/2.21.0/EssentialsX-2.21.0.jar" || \
curl -L -o EssentialsX.jar "https://github.com/EssentialsX/Essentials/releases/download/2.21.0/EssentialsX-2.21.0.jar"

# LuckPerms
echo "   - LuckPerms..."
wget -q -O LuckPerms.jar "https://download.luckperms.net/1556/bukkit/loader/LuckPerms-Bukkit-5.4.141.jar" || \
curl -L -o LuckPerms.jar "https://download.luckperms.net/1556/bukkit/loader/LuckPerms-Bukkit-5.4.141.jar"

# SkinsRestorer
echo "   - SkinsRestorer..."
wget -q -O SkinsRestorer.jar "https://github.com/SkinsRestorer/SkinsRestorer/releases/download/15.4.4/SkinsRestorer.jar" || \
curl -L -o SkinsRestorer.jar "https://github.com/SkinsRestorer/SkinsRestorer/releases/download/15.4.4/SkinsRestorer.jar"

cd ..

# 11. Plugin kontrolü
echo ""
echo "📊 Plugin kontrolü..."
for file in plugins/*.jar; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ "$size" -gt 10000 ]; then
            echo "   ✅ $(basename $file)"
        else
            echo "   ❌ $(basename $file) - başarısız"
            rm -f "$file"
        fi
    fi
done

# 12. Sunucuyu başlat
echo ""
echo "🚀 Sunucu başlatılıyor..."
pm2 start ecosystem.config.js

echo ""
echo "✅ =========================================="
echo "✅ PAPER 1.21.1 TEMİZ KURULUM TAMAMLANDI!"
echo "✅ =========================================="
echo ""
echo "📋 Bilgiler:"
echo "   - Versiyon: Paper 1.21.1 (build 132)"
echo "   - Port: 25565"
echo "   - RCON: 25575"
echo "   - Max Players: 20"
echo ""
echo "📊 Logları izle:"
echo "   pm2 logs minecraft"
echo ""
echo "🌐 Bağlantı:"
echo "   IP: 194.105.5.37:25565"
echo "   Domain: swxogx.mooo.com"
echo ""
