# GitHub Actions Otomatik Deployment Kurulumu

## 🚀 Özellikler

- ✅ **Otomatik Deployment:** `main` branch'e push yapınca VPS'e otomatik yüklenir
- ✅ **Akıllı Tespit:** Sadece değişen dosyalar güncellenir
- ✅ **Otomatik Yedekleme:** Her deployment öncesi yedek alınır
- ✅ **Plugin Derleme:** Maven ile otomatik derlenir
- ✅ **Sunucu Reload:** Değişiklikler otomatik uygulanır
- ✅ **Manuel Deployment:** İstediğin zaman manuel tetikleyebilirsin

---

## 📋 Kurulum Adımları

### Adım 1: SSH Key Oluştur

**Windows PowerShell'de çalıştır:**

```powershell
# SSH key oluştur (şifresiz)
ssh-keygen -t ed25519 -C "github-actions" -f github-actions-key -N ""
```

**Çıktı:**
```
Generating public/private ed25519 key pair.
Your identification has been saved in github-actions-key
Your public key has been saved in github-actions-key.pub
```

**İki dosya oluşur:**
- `github-actions-key` → **Private key** (GitHub'a eklenecek)
- `github-actions-key.pub` → **Public key** (VPS'e eklenecek)

---

### Adım 2: Public Key'i VPS'e Ekle

#### 2.1. Public Key'i Kopyala

**PowerShell'de:**

```powershell
# Public key'i göster
Get-Content github-actions-key.pub
```

**Çıktı (örnek):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJxxx... github-actions
```

Bu satırın **tamamını** kopyala (Ctrl+C).

---

#### 2.2. VPS'e Bağlan ve Ekle

**PowerShell'de:**

```powershell
# VPS'e bağlan
ssh root@194.105.5.37
```

**VPS'te çalıştır:**

```bash
# .ssh klasörünü oluştur (yoksa)
mkdir -p ~/.ssh

# Public key'i ekle (KOPYALADIĞIN KEY'İ YAPIŞTIRACAKSIN)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJxxx... github-actions" >> ~/.ssh/authorized_keys

# İzinleri ayarla
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Çıkış
exit
```

**Önemli:** `echo "..."` kısmına kendi public key'ini yapıştır!

---

#### 2.3. Bağlantıyı Test Et

**PowerShell'de:**

```powershell
# Private key ile test et
ssh -i github-actions-key root@194.105.5.37

# Başarılıysa VPS'e giriş yapacaksın
# exit ile çık
```

✅ Eğer şifre sormadan giriş yaptıysan başarılı!

---

### Adım 3: GitHub Secrets Ekle

#### 3.1. Private Key'i Kopyala

**PowerShell'de:**

```powershell
# Private key'i göster
Get-Content github-actions-key

# Veya panoya kopyala
Get-Content github-actions-key | clip
```

**Çıktı (örnek):**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
...
-----END OPENSSH PRIVATE KEY-----
```

**Tüm içeriği** kopyala (-----BEGIN ... END----- dahil).

---

#### 3.2. GitHub'da Secrets Ekle

1. **GitHub repo'na git:**
   ```
   https://github.com/KULLANICI_ADIN/minecraft-server
   ```

2. **Settings** sekmesine tıkla

3. Sol menüden **Secrets and variables** → **Actions** seç

4. **New repository secret** butonuna tıkla

---

#### 3.3. İlk Secret: VPS_SSH_KEY

```
Name: VPS_SSH_KEY
Secret: [Private key'in tamamını yapıştır]
```

**Add secret** tıkla.

---

#### 3.4. İkinci Secret: VPS_HOST

```
Name: VPS_HOST
Secret: 194.105.5.37
```

**Add secret** tıkla.

---

#### 3.5. Üçüncü Secret: VPS_USER

```
Name: VPS_USER
Secret: root
```

**Add secret** tıkla.

---

#### 3.6. Kontrol Et

**Settings** → **Secrets and variables** → **Actions** sayfasında şunları görmelisin:

```
✓ VPS_SSH_KEY
✓ VPS_HOST
✓ VPS_USER
```

---

### Adım 4: GitHub'a Push Et

**PowerShell'de:**

```powershell
cd C:\Users\ireal\Desktop\minecraft

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "feat: GitHub Actions deployment hazır"

# GitHub'a yükle
git push origin main
```

---

### Adım 5: Deployment'ı İzle

1. **GitHub repo'na git**

2. **Actions** sekmesine tıkla

3. **Deploy to VPS** workflow'unu göreceksin

4. Çalışan workflow'a tıkla ve logları izle

---

## ✅ Başarı Kontrolü

### GitHub'da

**Actions** sekmesinde yeşil ✓ işareti görmelisin.

### VPS'te

```bash
ssh root@194.105.5.37
cd /opt/minecraft

# Yedekleri kontrol et
ls -lh ~/github-actions-backups/

# Plugin'i kontrol et
ls -lh plugins/TimeHUD-1.0.0.jar

# Sunucu çalışıyor mu?
screen -list
```

---

## 🎯 Kullanım

### Otomatik Deployment

```powershell
# Değişiklik yap
notepad plugins/TimeHUD/src/main/java/com/server/timehud/TimeHUD.java

# Commit ve push
git add .
git commit -m "feat: TimeHUD güncellendi"
git push origin main

# GitHub Actions otomatik çalışır!
```

**GitHub'da izle:**
- Repo → **Actions** sekmesi
- Çalışan workflow'u görebilirsin

---

### Manuel Deployment

**GitHub'da:**

1. **Actions** sekmesi
2. **Deploy to VPS** workflow'u seç
3. **Run workflow** dropdown'unu aç
4. **Run workflow** butonuna tıkla
5. Opsiyonel: "Force restart" seçeneğini işaretle

---

## 🔍 Deployment İzleme

### GitHub'da

```
Repo → Actions → Son workflow
```

**Logları görebilirsin:**
- 📥 Checkout
- 🔍 Değişiklik tespiti
- 🔨 Plugin derleme
- 💾 Yedekleme
- 🔌 Deployment
- ✅ Doğrulama

---

### VPS'te

```bash
# Yedekleri kontrol et
ls -lh ~/github-actions-backups/

# Son yedekten geri yükle
cd ~/github-actions-backups
tar -xzf backup-YYYYMMDD_HHMMSS.tar.gz -C /opt/minecraft/
```

---

## ❓ Sorun Giderme

### SSH Connection Failed

**Hata:**
```
Permission denied (publickey)
```

**Çözüm:**

```bash
# VPS'te authorized_keys'i kontrol et
ssh root@194.105.5.37
cat ~/.ssh/authorized_keys

# Public key'in orada olduğundan emin ol
# İzinleri kontrol et
ls -la ~/.ssh/

# Doğru olmalı:
# drwx------ (700) .ssh/
# -rw------- (600) authorized_keys

# Düzelt
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

### Plugin Build Failed

**Hata:**
```
[ERROR] Failed to execute goal
```

**Çözüm:**

```powershell
# Local'de test et
cd plugins/TimeHUD
mvn clean package

# Hata varsa düzelt
# Sonra tekrar push et
```

---

### Deployment Çalışmıyor

**GitHub Actions loglarını kontrol et:**

1. **Actions** sekmesi
2. Başarısız workflow'a tıkla
3. Kırmızı adımı aç
4. Hata mesajını oku

**Yaygın hatalar:**
- SSH key yanlış → Secret'ı kontrol et
- VPS'e erişilemiyor → IP ve port kontrol et
- Maven hatası → pom.xml kontrol et

---

## 🔒 Güvenlik

- ✅ Private key GitHub'da şifreli saklanır
- ✅ VPS'te sadece authorized_keys kullanılır
- ✅ Her deployment öncesi yedek alınır
- ✅ Sadece belirli dosyalar deploy edilir
- ✅ SSH key şifresiz (GitHub Actions için gerekli)

---

## ✅ Kurulum Kontrol Listesi

- [ ] SSH key oluşturuldu (`github-actions-key` ve `github-actions-key.pub`)
- [ ] Public key VPS'e eklendi (`~/.ssh/authorized_keys`)
- [ ] İzinler ayarlandı (700 ve 600)
- [ ] Bağlantı test edildi (`ssh -i github-actions-key root@194.105.5.37`)
- [ ] GitHub Secrets eklendi (VPS_SSH_KEY, VPS_HOST, VPS_USER)
- [ ] Workflow dosyaları push edildi
- [ ] İlk deployment test edildi
- [ ] Yedekleme çalışıyor

---

## 📝 Özet Komutlar

```powershell
# 1. SSH Key Oluştur
ssh-keygen -t ed25519 -C "github-actions" -f github-actions-key -N ""

# 2. Public Key'i Göster
Get-Content github-actions-key.pub

# 3. VPS'e Ekle (VPS'te)
echo "PUBLIC_KEY_BURAYA" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

# 4. Private Key'i Göster
Get-Content github-actions-key

# 5. GitHub Secrets'e Ekle (Web'de)
# VPS_SSH_KEY → Private key
# VPS_HOST → 194.105.5.37
# VPS_USER → root

# 6. Push Et
git push origin main
```

---

**Başarılar! 🚀**
