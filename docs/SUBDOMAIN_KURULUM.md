# 🌐 Subdomain ile Erişim Kurulum Rehberi

Bu rehber, Minecraft sunucu web panelinize subdomain üzerinden erişimi yapılandırmanızı sağlar.

## 📋 Gereksinimler

- Bir domain adı (örn: `swxogx.com`)
- VPS/Sunucu erişimi (root veya sudo yetkisi)
- Nginx veya Apache web sunucusu
- SSL sertifikası (Let's Encrypt önerilir)

## 🎯 Hedef

**Şu an**: `http://YOUR_VPS_IP:3000`  
**Hedef**: `https://panel.swxogx.com`

---

## 🔧 Yöntem 1: Nginx ile Reverse Proxy (Önerilen)

### Adım 1: Nginx Kurulumu

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

### Adım 2: DNS Ayarları

Domain sağlayıcınızın (Cloudflare, GoDaddy, Namecheap vb.) DNS panelinden:

1. Yeni bir **A Record** ekleyin:
   - **Name**: `panel` (veya istediğiniz subdomain)
   - **Type**: `A`
   - **Value**: VPS IP adresiniz (örn: `123.45.67.89`)
   - **TTL**: Auto veya 3600

2. Değişikliklerin yayılmasını bekleyin (5-30 dakika)

3. Test edin:
```bash
ping panel.swxogx.com
# VPS IP'nizi görmeli
```

### Adım 3: Nginx Yapılandırması

Yeni bir site yapılandırması oluşturun:

```bash
sudo nano /etc/nginx/sites-available/minecraft-panel
```

Aşağıdaki içeriği yapıştırın (domain'i kendi domain'inizle değiştirin):

```nginx
server {
    listen 80;
    server_name panel.swxogx.com;

    # Güvenlik başlıkları
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Reverse proxy
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
        
        # Timeout ayarları
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket desteği (gelecekte kullanılabilir)
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Adım 4: Yapılandırmayı Etkinleştirme

```bash
# Symlink oluştur
sudo ln -s /etc/nginx/sites-available/minecraft-panel /etc/nginx/sites-enabled/

# Nginx yapılandırmasını test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Adım 5: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx -y

# SSL sertifikası al
sudo certbot --nginx -d panel.swxogx.com

# Otomatik yenileme testi
sudo certbot renew --dry-run
```

Certbot otomatik olarak Nginx yapılandırmanızı güncelleyecek ve HTTPS'i etkinleştirecektir.

### Adım 6: Firewall Ayarları

```bash
# HTTP ve HTTPS portlarını aç
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Port 3000'i dışarıdan erişime kapat (güvenlik)
sudo ufw deny 3000/tcp

# Firewall'u yeniden yükle
sudo ufw reload
```

---

## 🔧 Yöntem 2: Apache ile Reverse Proxy

### Adım 1: Apache ve Modüller

```bash
# Apache kurulumu
sudo apt install apache2 -y

# Gerekli modülleri etkinleştir
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod headers
```

### Adım 2: Virtual Host Yapılandırması

```bash
sudo nano /etc/apache2/sites-available/minecraft-panel.conf
```

İçerik:

```apache
<VirtualHost *:80>
    ServerName panel.swxogx.com
    
    # Reverse proxy
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # Güvenlik başlıkları
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    ErrorLog ${APACHE_LOG_DIR}/minecraft-panel-error.log
    CustomLog ${APACHE_LOG_DIR}/minecraft-panel-access.log combined
</VirtualHost>
```

### Adım 3: Etkinleştirme

```bash
sudo a2ensite minecraft-panel.conf
sudo systemctl restart apache2

# SSL için Certbot
sudo certbot --apache -d panel.swxogx.com
```

---

## 🔧 Yöntem 3: Cloudflare Tunnel (Port Açmadan)

Cloudflare Tunnel, VPS'inizde port açmadan güvenli erişim sağlar.

### Adım 1: Cloudflared Kurulumu

```bash
# Ubuntu/Debian
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Adım 2: Cloudflare'e Giriş

```bash
cloudflared tunnel login
```

Tarayıcıda açılan sayfadan domain'inizi seçin.

### Adım 3: Tunnel Oluşturma

```bash
# Tunnel oluştur
cloudflared tunnel create minecraft-panel

# Tunnel ID'yi not edin
```

### Adım 4: DNS Yapılandırması

```bash
cloudflared tunnel route dns minecraft-panel panel.swxogx.com
```

### Adım 5: Config Dosyası

```bash
nano ~/.cloudflared/config.yml
```

İçerik:

```yaml
tunnel: TUNNEL_ID_BURAYA
credentials-file: /root/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: panel.swxogx.com
    service: http://localhost:3000
  - service: http_status:404
```

### Adım 6: Tunnel'ı Başlatma

```bash
# Test
cloudflared tunnel run minecraft-panel

# Servis olarak çalıştır
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## 🔐 Firebase Authorized Domains Güncelleme

Subdomain'i Firebase'e ekleyin:

1. [Firebase Console](https://console.firebase.google.com/) > Authentication > Settings
2. **Authorized domains** bölümüne gidin
3. `panel.swxogx.com` ekleyin

---

## ✅ Test Etme

1. Tarayıcıda `https://panel.swxogx.com` adresine gidin
2. Login sayfası açılmalı
3. Giriş yapın ve panel çalışmalı
4. SSL sertifikası geçerli olmalı (yeşil kilit ikonu)

---

## 🐛 Sorun Giderme

### "502 Bad Gateway" hatası
```bash
# Node.js sunucusunun çalıştığından emin olun
pm2 status
pm2 restart server

# Nginx loglarını kontrol edin
sudo tail -f /var/log/nginx/error.log
```

### DNS yayılmadı
```bash
# DNS propagation kontrolü
nslookup panel.swxogx.com
dig panel.swxogx.com

# Cloudflare kullanıyorsanız proxy'yi geçici olarak kapatın (turuncu bulut)
```

### SSL sertifikası alınamıyor
```bash
# Port 80'in açık olduğundan emin olun
sudo ufw status

# Certbot loglarını kontrol edin
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Firebase authentication çalışmıyor
- Firebase Console'da subdomain'in authorized domains listesinde olduğundan emin olun
- `public/auth.js` dosyasında `authDomain` değerini kontrol edin

---

## 📊 Performans İyileştirmeleri

### Nginx Caching

```nginx
# /etc/nginx/sites-available/minecraft-panel içine ekleyin
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Gzip Compression

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

---

## 🎉 Tamamlandı!

Artık web panelinize subdomain üzerinden güvenli bir şekilde erişebilirsiniz!

**Öncesi**: `http://123.45.67.89:3000`  
**Sonrası**: `https://panel.swxogx.com` ✨
