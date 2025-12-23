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
