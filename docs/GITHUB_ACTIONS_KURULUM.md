# GitHub Actions Otomatik Deployment Kurulumu

## 🚀 Özellikler

- ✅ **Otomatik Deployment:** `main` branch'e push yapınca VPS'e otomatik yüklenir
- ✅ **Akıllı Tespit:** Sadece değişen dosyalar güncellenir
- ✅ **Plugin Derleme:** Maven ile otomatik derlenir
- ✅ **Sunucu Reload:** Değişiklikler otomatik uygulanır

## 📋 Kurulum

### 1. SSH Key Oluştur

```powershell
ssh-keygen -t ed25519 -C "github-actions" -f github-actions-key -N ""
```

### 2. Public Key'i VPS'e Ekle

```bash
echo "PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
```

### 3. GitHub Secrets Ekle

- `VPS_SSH_KEY` → Private key
- `VPS_HOST` → 194.105.5.37
- `VPS_USER` → root

### 4. Push Et

```bash
git push origin main
```

GitHub Actions otomatik çalışır!
