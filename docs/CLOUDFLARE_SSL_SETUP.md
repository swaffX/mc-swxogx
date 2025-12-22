# Cloudflare SSL Setup - Ücretsiz HTTPS

## 🎯 Neden Cloudflare?

VPS'in firewall'u Let's Encrypt'i blokluyor. Cloudflare çözüm:
- ✅ **Ücretsiz SSL**: Otomatik HTTPS sertifikası
- ✅ **Firewall Bypass**: Cloudflare ↔ VPS arası HTTP yeterli
- ✅ **CDN**: Hızlı içerik dağıtımı
- ✅ **DDoS Koruması**: Otomatik saldırı koruması
- ✅ **Güvenli Görünüm**: Tarayıcıda 🔒 ikonu

## 📋 Gereksinimler

- Domain: `swxogx.mooo.com` (mooo.com ücretsiz DNS servisi)
- VPS: `194.105.5.37`
- Caddy/Nginx: HTTP (port 80) çalışıyor olmalı

## 🚀 Kurulum Adımları

### Adım 1: Cloudflare Hesabı Oluştur

1. **Cloudflare'e git**: https://dash.cloudflare.com/sign-up
2. **Email ve şifre** ile kayıt ol
3. **Email doğrulama** yap

### Adım 2: Domain Ekle

⚠️ **ÖNEMLİ**: `mooo.com` ücretsiz DNS servisi olduğu için Cloudflare'e direkt ekleyemeyebilirsin. İki seçenek var:

#### Seçenek A: Kendi Domain'in Varsa

1. Cloudflare Dashboard'da **"Add a Site"** tıkla
2. Domain'ini gir (örn: `example.com`)
3. **Free Plan** seç
4. Cloudflare nameserver'ları gösterecek:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
5. Domain sağlayıcında (GoDaddy, Namecheap, vs.) nameserver'ları değiştir
6. Cloudflare'de **"Done, check nameservers"** tıkla

#### Seçenek B: mooo.com Kullanıyorsan (Önerilen)

mooo.com Cloudflare'i desteklemiyorsa, **Cloudflare Tunnel** kullan:

1. Cloudflare Dashboard → **Zero Trust**
2. **Access** → **Tunnels** → **Create a tunnel**
3. Tunnel adı: `swxogx-tunnel`
4. **Connector** kur (VPS'te):
   ```bash
   # Cloudflare'den verilen komutu çalıştır
   # Örnek:
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
   chmod +x cloudflared
   ./cloudflared tunnel --url http://localhost:3000
   ```

### Adım 3: DNS Ayarları (Kendi Domain'in Varsa)

Cloudflare Dashboard → **DNS** → **Records**

**A Record Ekle:**
- **Type**: A
- **Name**: `@` (veya `panel` subdomain için)
- **IPv4 address**: `194.105.5.37`
- **Proxy status**: ✅ **Proxied** (turuncu bulut)
- **TTL**: Auto

**CNAME Record (Subdomain için):**
- **Type**: CNAME
- **Name**: `panel`
- **Target**: `swxogx.mooo.com`
- **Proxy status**: ✅ **Proxied**

### Adım 4: SSL/TLS Ayarları

Cloudflare Dashboard → **SSL/TLS**

**Encryption Mode Seç:**

1. **Flexible** (Önerilen - VPS'te SSL gerekmez)
   - Tarayıcı ↔ Cloudflare: HTTPS 🔒
   - Cloudflare ↔ VPS: HTTP
   - En kolay, hemen çalışır

2. **Full** (Daha güvenli)
   - Tarayıcı ↔ Cloudflare: HTTPS 🔒
   - Cloudflare ↔ VPS: HTTPS (self-signed OK)
   - VPS'te self-signed sertifika gerekir

3. **Full (Strict)** (En güvenli)
   - Her iki taraf da geçerli SSL
   - VPS'te Cloudflare Origin Certificate gerekir

**Önerilen**: **Flexible** modunu seç (en kolay)

### Adım 5: VPS Ayarları

#### Flexible Mode İçin (HTTP)

Caddy'yi HTTP modunda çalıştır:

```bash
cat > /etc/caddy/Caddyfile << 'EOF'
http://swxogx.mooo.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
    }
    
    encode gzip
}
EOF

systemctl restart caddy
```

#### Full Mode İçin (Self-Signed SSL)

```bash
cd /opt/minecraft
bash scripts/setup-caddy-selfsigned.sh
```

### Adım 6: Cloudflare Optimizasyonları

#### A. Always Use HTTPS

**SSL/TLS** → **Edge Certificates** → **Always Use HTTPS**: ✅ ON

HTTP isteklerini otomatik HTTPS'e yönlendirir.

#### B. Automatic HTTPS Rewrites

**SSL/TLS** → **Edge Certificates** → **Automatic HTTPS Rewrites**: ✅ ON

HTTP linklerini HTTPS'e çevirir.

#### C. Minimum TLS Version

**SSL/TLS** → **Edge Certificates** → **Minimum TLS Version**: TLS 1.2

Eski TLS sürümlerini engeller.

#### D. Caching

**Caching** → **Configuration** → **Caching Level**: Standard

Static dosyaları cache'ler (hız artışı).

#### E. Brotli Compression

**Speed** → **Optimization** → **Brotli**: ✅ ON

Daha iyi sıkıştırma (hız artışı).

### Adım 7: Test Et

1. **DNS Propagation Bekle**: 5-10 dakika
2. **Test Et**:
   ```bash
   # DNS kontrolü
   dig swxogx.mooo.com
   
   # HTTPS testi
   curl -I https://swxogx.mooo.com
   ```
3. **Tarayıcıdan Aç**: `https://swxogx.mooo.com`
4. **SSL Kontrolü**: Tarayıcıda 🔒 ikonu görünmeli

## 🔧 Cloudflare Tunnel (Alternatif Yöntem)

Eğer DNS değişikliği yapamıyorsan, Cloudflare Tunnel kullan:

### 1. Tunnel Oluştur

Cloudflare Dashboard → **Zero Trust** → **Access** → **Tunnels** → **Create a tunnel**

### 2. Connector Kur (VPS'te)

```bash
# Cloudflared indir
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared

# Tunnel authenticate (Cloudflare'den verilen komutu çalıştır)
cloudflared tunnel login

# Tunnel oluştur
cloudflared tunnel create swxogx-tunnel

# Config dosyası oluştur
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: <TUNNEL-ID>
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: swxogx.mooo.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Tunnel'ı servis olarak çalıştır
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared
```

### 3. DNS Route Ekle

Cloudflare Dashboard → Tunnel → **Public Hostname**:
- **Subdomain**: `swxogx`
- **Domain**: `mooo.com` (veya kendi domain'in)
- **Service**: `http://localhost:3000`

## 🎉 Sonuç

Cloudflare kurulumu sonrası:

- ✅ **Web Panel**: `https://swxogx.mooo.com` 🔒
- ✅ **Minecraft**: `swxogx.mooo.com:25565`
- ✅ **SSL**: Cloudflare ücretsiz sertifika
- ✅ **CDN**: Hızlı içerik dağıtımı
- ✅ **DDoS Koruması**: Otomatik

## 📊 Cloudflare vs Let's Encrypt

| Özellik | Let's Encrypt | Cloudflare |
|---------|--------------|------------|
| Maliyet | Ücretsiz | Ücretsiz |
| Kurulum | Karmaşık | Kolay |
| Firewall Sorunu | Var | Yok |
| CDN | Yok | Var |
| DDoS Koruması | Yok | Var |
| SSL Yenileme | Manuel/Otomatik | Otomatik |

## ⚠️ Önemli Notlar

1. **Firebase Authorized Domains**: `swxogx.mooo.com` ekle
2. **DNS Propagation**: 5-10 dakika sürebilir
3. **Cloudflare Proxy**: Turuncu bulut ✅ aktif olmalı
4. **SSL Mode**: Flexible (en kolay) veya Full
5. **VPS Firewall**: Kapalı olmalı (zaten kapalı)

## 🛠️ Troubleshooting

### Problem: 521 Error (Web server is down)

```bash
# VPS'te Caddy çalışıyor mu?
systemctl status caddy

# Port 80 dinliyor mu?
netstat -tulpn | grep :80

# Caddy restart
systemctl restart caddy
```

### Problem: 525 Error (SSL handshake failed)

- SSL Mode'u **Flexible** yap
- VPS'te HTTP kullan (HTTPS değil)

### Problem: DNS değişmedi

```bash
# DNS kontrolü
dig swxogx.mooo.com

# Cloudflare nameserver'ları aktif mi?
dig NS mooo.com
```

## 📚 Kaynaklar

- Cloudflare Dashboard: https://dash.cloudflare.com
- Cloudflare Docs: https://developers.cloudflare.com
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
