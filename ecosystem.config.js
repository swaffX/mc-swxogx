module.exports = {
  apps: [
    {
      name: 'minecraft',
      script: '/opt/minecraft/start-neoforge.sh',
      cwd: '/opt/minecraft',
      interpreter: '/bin/bash',
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
