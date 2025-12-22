# Caddy Setup - Otomatik SSL

## 🎯 Neden Caddy?

Caddy, Nginx'e göre çok daha kolay ve **otomatik SSL** sağlar:

- ✅ **Otomatik SSL**: Let's Encrypt sertifikası otomatik alır ve yeniler
- ✅ **Kolay Konfigürasyon**: Tek dosya, basit syntax
- ✅ **HTTP/2 ve HTTP/3**: Varsayılan olarak aktif
- ✅ **Otomatik HTTPS Yönlendirme**: HTTP → HTTPS otomatik
- ✅ **Zero Downtime**: Sertifika yenileme sırasında kesinti yok

## 🚀 Kurulum

### 1. Caddy Kurulumu

VPS'te şu komutu çalıştır:

```bash
cd /opt/minecraft
bash scripts/setup-caddy.sh
```

Bu script:
- ✅ Nginx'i durdurur (eğer çalışıyorsa)
- ✅ Caddy'yi kurar
- ✅ Caddyfile oluşturur
- ✅ Caddy'yi başlatır
- ✅ SSL sertifikası otomatik alınır (ilk HTTPS isteğinde)

### 2. Test Et

```bash
# Caddy durumu
systemctl status caddy

# Logları izle
journalctl -u caddy -f
```

Tarayıcıdan:
```
https://swxogx.mooo.com
```

## 📝 Caddyfile

Dosya: `/etc/caddy/Caddyfile`

```caddy
swxogx.mooo.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    
    log {
        output file /var/log/caddy/swxogx-panel.log
    }
    
    encode gzip
}
```

## 🔧 Caddy Komutları

```bash
# Caddy restart
systemctl restart caddy

# Caddy durumu
systemctl status caddy

# Caddyfile test
caddy validate --config /etc/caddy/Caddyfile

# Caddyfile reload (zero downtime)
caddy reload --config /etc/caddy/Caddyfile

# Loglar
journalctl -u caddy -f
tail -f /var/log/caddy/swxogx-panel.log
```

## 🔒 SSL Sertifikası

Caddy otomatik olarak:
1. İlk HTTPS isteğinde Let's Encrypt'ten sertifika alır
2. Sertifikayı `/var/lib/caddy/.local/share/caddy/certificates/` dizinine kaydeder
3. Sertifika süresi dolmadan otomatik yeniler
4. HTTP isteklerini HTTPS'e yönlendirir

**Manuel kontrol:**
```bash
# Sertifika dosyaları
ls -la /var/lib/caddy/.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/

# Caddy logları
journalctl -u caddy | grep -i certificate
```

## 🛠️ Troubleshooting

### Problem: SSL sertifikası alınamıyor

```bash
# DNS kontrolü
dig swxogx.mooo.com

# Port 80 ve 443 açık mı?
netstat -tulpn | grep -E ':(80|443)'

# Caddy logları
journalctl -u caddy -n 50
```

### Problem: 502 Bad Gateway

Node.js API çalışmıyor:

```bash
# PM2 durumu
pm2 list

# API restart
pm2 restart minecraft-api

# API logları
pm2 logs minecraft-api
```

### Problem: Caddy başlamıyor

```bash
# Caddyfile syntax kontrolü
caddy validate --config /etc/caddy/Caddyfile

# Detaylı hata logları
journalctl -u caddy -xe
```

## 🔄 Nginx'ten Caddy'ye Geçiş

Eğer Nginx kuruluysa:

```bash
# Nginx'i durdur
systemctl stop nginx
systemctl disable nginx

# Caddy'yi kur
bash scripts/setup-caddy.sh
```

## 📊 Karşılaştırma

| Özellik | Nginx + Certbot | Caddy |
|---------|----------------|-------|
| SSL Kurulumu | Manuel (certbot) | Otomatik |
| Konfigürasyon | Karmaşık | Basit |
| SSL Yenileme | Cron job | Otomatik |
| HTTP/2 | Manuel aktif | Varsayılan |
| HTTP/3 | Desteklenmez | Varsayılan |
| Zero Downtime Reload | Hayır | Evet |

## ⚠️ Önemli Notlar

1. **Port 80 ve 443 açık olmalı**
   ```bash
   # Firewall kontrolü
   ufw status
   
   # Portları aç (gerekirse)
   ufw allow 80/tcp
   ufw allow 443/tcp
   ```

2. **DNS doğru işaret etmeli**
   ```bash
   dig swxogx.mooo.com
   # Sonuç: 194.105.5.37
   ```

3. **Firebase Authorized Domains**
   - Firebase Console'da `swxogx.mooo.com` ekle

4. **PM2 çalışıyor olmalı**
   ```bash
   pm2 list
   # minecraft-api: online
   ```

## 🎉 Sonuç

Caddy kurulumu sonrası:

- ✅ **Web Panel**: `https://swxogx.mooo.com` (HTTPS otomatik!)
- ✅ **Minecraft**: `swxogx.mooo.com:25565`
- ✅ **SSL**: Let's Encrypt (otomatik yenileme)
- ✅ **HTTP → HTTPS**: Otomatik yönlendirme

Artık güvenli HTTPS bağlantısı ile web paneline erişebilirsin! 🔒
