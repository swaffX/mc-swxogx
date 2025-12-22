module.exports = {
  apps: [
    {
      name: 'minecraft',
      script: 'java',
      args: [
        '-Xms2G',
        '-Xmx6G',
        // Port: 25566 (server.properties'te ayarlı)
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
      autorestart: false,  // Manuel restart gerekli (session lock sorunu için)
      watch: false,
      max_memory_restart: '6G',
      max_restarts: 3,  // Maksimum 3 restart denemesi
      min_uptime: '10s',  // En az 10 saniye çalışmalı
      restart_delay: 5000,  // Restart arası 5 saniye bekle
      kill_timeout: 5000,  // Process'i kapatmak için 5 saniye bekle
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'minecraft-api',
      script: './server.js',
      cwd: '/opt/minecraft',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'discord-bot',
      script: './bot.js',
      cwd: '/opt/minecraft/discord-bot',
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env_file: '/opt/minecraft/.env',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
