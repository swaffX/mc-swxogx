# 🚀 Quick Reference - Rol Sistemi

## Hızlı Komutlar

### Deployment
```bash
# Linux/Mac
bash deploy-roles.sh

# Windows
deploy-roles.bat
```

### Sunucu Yönetimi
```bash
# Başlat
pm2 start all

# Durdur
pm2 stop all

# Restart
pm2 restart all

# Loglar
pm2 logs

# Monitoring
pm2 monit
```

### Session Lock Temizle
```bash
# Linux/Mac
rm -f world/session.lock world_*/*.lock

# Windows
del /f /q world\session.lock world_*\session.lock
```

### RCON Test
```bash
# Bağlantı test
telnet localhost 25575

# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port 25575
```

## API Endpoints

### Rol Atama
```bash
POST /api/roles/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "playerName": "SwxOgx",
  "roleId": "vip",
  "roleName": "VIP"
}
```

### Rolleri Getir
```bash
GET /api/roles/players
Authorization: Bearer <token>
```

### Sunucu Durumu
```bash
GET /api/status
GET /api/players
GET /api/tps
```

## Rol Renkleri

| Rol | Renk | Minecraft Color |
|-----|------|-----------------|
| Admin | 🔴 | `red` |
| Moderator | 🟡 | `gold` |
| VIP | 🟣 | `light_purple` |
| Player | 🟢 | `green` |

## Dosya Yolları

```
server.js                              # Backend API
public/scripts/dashboard.js            # Frontend
public/middleware/auth.js              # Auth
data/player-roles.json                 # Rol veritabanı
docs/ROL_SISTEMI.md                    # Detaylı dok
```

## Whitelist

**Dosya:** `public/middleware/auth.js`

```javascript
const AUTHORIZED_UIDS = [
    "P2xHD09hwFaXf6Ci2RE4zlZYYnc2"
];
```

## URL'ler

- **Web Panel:** http://194.105.5.37:3000
- **Login:** http://194.105.5.37:3000/pages/login.html
- **Dashboard:** http://194.105.5.37:3000/pages/dashboard.html
- **Minecraft:** swxogx.mooo.com:25565

## Sorun Giderme

### Sunucu başlamıyor
```bash
rm -f world/session.lock
pm2 restart minecraft
```

### RCON çalışmıyor
```bash
# server.properties kontrol
cat server.properties | grep rcon

# Beklenen:
# enable-rcon=true
# rcon.port=25575
# rcon.password=SwxOgx2024Rcon!
```

### Roller kaydedilmiyor
```bash
# İzinleri kontrol
ls -la data/
chmod 755 data/

# JSON kontrol
cat data/player-roles.json
```

### 403 Forbidden
```bash
# Whitelist kontrol
cat public/middleware/auth.js | grep AUTHORIZED_UIDS

# UID ekle ve restart
pm2 restart server
```

## Test Senaryoları

### ✅ Normal Rol Atama
1. Sunucu online
2. Web panel → Role Manager
3. Rol seç → OK
4. Minecraft'ta bildirim gör

### ✅ Offline Sunucu
1. `pm2 stop minecraft`
2. Web panel → Rol ata
3. Toast: "⚠️ Role saved locally only."
4. `pm2 start minecraft`
5. Roller hala mevcut

### ✅ Kalıcılık
1. Rol ata
2. `pm2 restart all`
3. Web panel yenile
4. Roller hala orada

## Monitoring

```bash
# Real-time logs
pm2 logs --lines 0

# CPU/Memory
pm2 monit

# Process list
pm2 list

# Detailed info
pm2 show minecraft
pm2 show server
```

## Backup

```bash
# Manuel backup
cp data/player-roles.json data/player-roles.backup.json

# Otomatik backup (cron)
0 0 * * * cp /opt/minecraft/data/player-roles.json /opt/minecraft/backups/player-roles-$(date +\%Y\%m\%d).json
```

## Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| `ROL_SISTEMI.md` | Detaylı sistem dokümantasyonu |
| `ROL_TEST.md` | Test senaryoları |
| `REAL_TIME_ROL_TAMAMLANDI.md` | Tamamlanan özellikler |
| `VPS_SON_KURULUM.md` | VPS kurulum |
| `OZET.md` | Genel bakış |
| `DEPLOYMENT_CHECKLIST.md` | Deployment adımları |
| `QUICK_REFERENCE.md` | Bu dosya |

## Kısayollar

```bash
# Hızlı restart
pm2 restart all && pm2 logs --lines 20

# Hızlı deployment
cd /opt/minecraft && git pull && pm2 restart all

# Hızlı log temizleme
pm2 flush && pm2 logs --lines 0

# Hızlı backup
cp -r data/ backups/data-$(date +%Y%m%d)/
```

## Performans

### Beklenen Metrikler
- **API Response:** < 100ms
- **RCON Response:** < 200ms
- **Rol Atama:** < 500ms
- **TPS:** 19-20
- **CPU:** < 50%
- **Memory:** < 80%

### Optimizasyon
```bash
# PM2 optimize
pm2 optimize

# Node.js memory limit
pm2 start server.js --max-memory-restart 500M

# Logs rotate
pm2 install pm2-logrotate
```

## Güvenlik

### Checklist
- [x] Firebase token doğrulaması
- [x] Whitelist kontrolü
- [x] Rol bazlı yetkilendirme
- [x] Input validasyonu
- [x] HTTPS (production)
- [x] Rate limiting (önerilir)

### Whitelist Güncelleme
```javascript
// public/middleware/auth.js
const AUTHORIZED_UIDS = [
    "UID1",
    "UID2",
    "UID3"
];
```

```bash
# Restart gerekli
pm2 restart server
```

## Destek

**Sorun mu var?**
1. Logları kontrol et: `pm2 logs`
2. Dokümantasyonu oku: `docs/`
3. Test rehberini kullan: `docs/ROL_TEST.md`
4. GitHub Issues'da rapor et

**İletişim:**
- Web Panel: http://194.105.5.37:3000
- Minecraft: swxogx.mooo.com

---

**Son Güncelleme:** 21 Aralık 2024  
**Versiyon:** 2.0.0
