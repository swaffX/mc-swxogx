# Domain Setup - swxogx.mooo.com

## 🎯 Hedef

`http://194.105.5.37:3000` yerine `http://swxogx.mooo.com` kullanmak.

## 📋 Gereksinimler

- ✅ Domain: `swxogx.mooo.com` (zaten var)
- ✅ VPS IP: `194.105.5.37`
- ✅ Node.js API: Port 3000'de çalışıyor
- ⚠️ Nginx: Kurulacak (reverse proxy)
- ⚠️ SSL: Let's Encrypt (opsiyonel ama önerilen)

## 🚀 Kurulum Adımları

### 1. DNS Kontrolü

Önce domain'in VPS'e işaret ettiğini kontrol et:

```bash
# VPS'te çalıştır
dig swxogx.mooo.com

# Veya
nslookup swxogx.mooo.com
```

**Beklenen sonuç:** `194.105.5.37` IP'sini görmeli.

### 2. Nginx Kurulumu

VPS'te şu komutu çalıştır:

```bash
cd /opt/minecraft
bash scripts/setup-nginx.sh
```

Bu script:
- ✅ Nginx'i kurar
- ✅ Reverse proxy konfigürasyonu oluşturur
- ✅ `swxogx.mooo.com` → `localhost:3000` yönlendirmesi yapar
- ✅ Nginx'i başlatır

### 3. Test Et

```bash
# HTTP testi
curl -I http://swxogx.mooo.com

# Tarayıcıdan
http://swxogx.mooo.com
```

### 4. SSL Kurulumu (Önerilen)

HTTPS için Let's Encrypt SSL sertifikası kur:

```bash
cd /opt/minecraft
bash scripts/setup-ssl.sh
```

Bu script:
- ✅ Certbot'u kurar
- ✅ SSL sertifikası alır
- ✅ HTTP → HTTPS yönlendirmesi yapar
- ✅ Otomatik yenileme ayarlar

### 5. Firebase Authorized Domains

Firebase Console'da domain'i yetkilendir:

1. Firebase Console aç: https://console.firebase.google.com
2. Projeyi seç: `swxogx-minecraft`
3. **Authentication** → **Settings** → **Authorized domains**
4. **Add domain** butonuna tıkla
5. `swxogx.mooo.com` ekle
6. Kaydet

## 🌐 Sonuç

### HTTP (Nginx kurulumu sonrası)
- ✅ Web Panel: `http://swxogx.mooo.com`
- ✅ Minecraft: `swxogx.mooo.com:25565`

### HTTPS (SSL kurulumu sonrası)
- ✅ Web Panel: `https://swxogx.mooo.com` 🔒
- ✅ Minecraft: `swxogx.mooo.com:25565`

## 📊 Port Kullanımı

| Servis | Port | Erişim |
|--------|------|--------|
| Minecraft Server | 25565 | `swxogx.mooo.com:25565` |
| Web Panel (Node.js) | 3000 | `localhost:3000` (internal) |
| Nginx (HTTP) | 80 | `http://swxogx.mooo.com` |
| Nginx (HTTPS) | 443 | `https://swxogx.mooo.com` |

## 🔧 Nginx Konfigürasyonu

Dosya: `/etc/nginx/sites-available/swxogx-panel`

```nginx
server {
    listen 80;
    server_name swxogx.mooo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🛠️ Troubleshooting

### Problem: Domain erişilemiyor

```bash
# DNS kontrolü
dig swxogx.mooo.com

# Nginx durumu
systemctl status nginx

# Nginx logları
tail -f /var/log/nginx/swxogx-panel-error.log
```

### Problem: 502 Bad Gateway

Node.js API çalışmıyor olabilir:

```bash
# PM2 durumu
pm2 list

# API'yi restart et
pm2 restart minecraft-api

# API logları
pm2 logs minecraft-api
```

### Problem: SSL sertifikası alınamıyor

```bash
# DNS kontrolü
dig swxogx.mooo.com

# Port 80 açık mı?
netstat -tulpn | grep :80

# Certbot debug
certbot certificates
```

## 📝 Manuel Nginx Komutları

```bash
# Nginx test
nginx -t

# Nginx restart
systemctl restart nginx

# Nginx durumu
systemctl status nginx

# Nginx logları
tail -f /var/log/nginx/swxogx-panel-access.log
tail -f /var/log/nginx/swxogx-panel-error.log

# Konfigürasyon düzenle
nano /etc/nginx/sites-available/swxogx-panel
```

## 🔒 SSL Yenileme

Certbot otomatik yenileme ayarlar. Manuel test:

```bash
# Dry run (test)
certbot renew --dry-run

# Gerçek yenileme
certbot renew

# Sertifika bilgisi
certbot certificates
```

## ⚠️ Önemli Notlar

1. **Firewall**: Port 80 ve 443 açık olmalı
   ```bash
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw status
   ```

2. **DNS**: `swxogx.mooo.com` → `194.105.5.37` işaret etmeli

3. **Firebase**: Authorized domains'e `swxogx.mooo.com` eklenmiş olmalı

4. **PM2**: `minecraft-api` çalışıyor olmalı
   ```bash
   pm2 list
   pm2 logs minecraft-api
   ```

## 🎉 Başarı Kontrolü

Tüm adımlar tamamlandıktan sonra:

```bash
# HTTP testi
curl -I http://swxogx.mooo.com

# HTTPS testi (SSL kuruluysa)
curl -I https://swxogx.mooo.com

# Tarayıcıdan
https://swxogx.mooo.com
```

Başarılı olursa:
- ✅ Google ile giriş yapabilirsin
- ✅ Dashboard açılır
- ✅ Tüm API endpoint'leri çalışır
- ✅ Real-time monitoring aktif

## 📚 İlgili Dosyalar

- `scripts/setup-nginx.sh` - Nginx kurulum script'i
- `scripts/setup-ssl.sh` - SSL kurulum script'i
- `/etc/nginx/sites-available/swxogx-panel` - Nginx config
- `/var/log/nginx/swxogx-panel-*.log` - Nginx logları
