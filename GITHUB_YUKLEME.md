# GitHub'a Yükleme Rehberi

## 🚀 Adım Adım GitHub'a Yükleme

### 1. GitHub'da Yeni Repo Oluştur

1. https://github.com/new adresine git
2. Repository name: `minecraft-server` (veya istediğin isim)
3. Description: `Minecraft 1.21.10 Paper Server - Ubuntu VPS Setup`
4. Public veya Private seç
5. **Initialize this repository with:** hiçbir şey seçme (boş bırak)
6. **Create repository** butonuna tıkla

---

### 2. Git Kurulumu (Eğer yoksa)

```powershell
# Windows'ta Chocolatey ile
choco install git

# Veya manuel: https://git-scm.com/download/win
```

---

### 3. Projeyi Git'e Hazırla

```powershell
# Proje dizinine git
cd C:\Users\ireal\Desktop\minecraft

# Git başlat
git init

# README'yi yeniden adlandır
mv README.md README_OLD.md
mv README_GITHUB.md README.md

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: Minecraft 1.21.10 Paper Server setup"
```

---

### 4. GitHub'a Bağlan ve Yükle

```powershell
# GitHub repo'nuzu bağlayın (URL'i GitHub'dan kopyalayın)
git remote add origin https://github.com/KULLANICI_ADIN/minecraft-server.git

# Ana branch'i ayarla
git branch -M main

# GitHub'a yükle
git push -u origin main
```

**Not:** İlk push'ta GitHub kullanıcı adı ve token isteyecek.

---

### 5. GitHub Token Oluştur (Eğer yoksa)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token (classic)** tıkla
3. Note: `Minecraft Server`
4. Expiration: `90 days` veya `No expiration`
5. Scopes: `repo` seçeneğini işaretle
6. **Generate token** tıkla
7. Token'ı kopyala (bir daha göremezsin!)

Push yaparken:
- Username: GitHub kullanıcı adın
- Password: Token'ı yapıştır

---

### 6. Sonraki Güncellemeler

```powershell
# Değişiklikleri ekle
git add .

# Commit yap
git commit -m "feat: yeni özellik eklendi"

# GitHub'a yükle
git push
```

---

## 📝 Commit Mesaj Örnekleri

```bash
# Yeni özellik
git commit -m "feat: TimeHUD plugin eklendi"

# Hata düzeltme
git commit -m "fix: RAM ayarları düzeltildi"

# Dokümantasyon
git commit -m "docs: kurulum rehberi güncellendi"

# Performans
git commit -m "perf: JVM flags optimize edildi"
```

---

## 🔒 Hassas Dosyaları Gizle

`.gitignore` dosyası zaten oluşturuldu. Şu dosyalar GitHub'a yüklenmeyecek:

- `server.jar` (çok büyük)
- `world/` klasörü (çok büyük)
- `logs/` (gereksiz)
- `banned-players.json`, `ops.json` (hassas)
- `*.key`, `*.pem` (güvenlik)

---

## 🌟 README'yi Özelleştir

`README.md` dosyasını düzenle:

```powershell
notepad README.md
```

Değiştir:
- `KULLANICI_ADIN` → GitHub kullanıcı adın
- `VPS_IP` → Sunucu IP'n (194.105.5.37)
- Proje açıklamasını özelleştir

---

## 📸 Ekran Görüntüleri Ekle (Opsiyonel)

```powershell
# screenshots klasörü oluştur
mkdir screenshots

# Oyun içi HUD ekran görüntüsünü ekle
# screenshots/hud.png

# README.md'ye ekle
```

README.md'de:
```markdown
## 📸 Ekran Görüntüleri

![TimeHUD](screenshots/hud.png)
```

---

## 🏷️ Release Oluştur (Opsiyonel)

GitHub'da:
1. Releases → Create a new release
2. Tag: `v1.0.0`
3. Title: `Minecraft Server v1.0.0`
4. Description: Değişiklikleri yaz
5. Attach files: `TimeHUD-1.0.0.jar` ekle
6. **Publish release**

---

## ✅ Kontrol Listesi

- [ ] GitHub'da repo oluşturuldu
- [ ] Git kuruldu
- [ ] Proje commit edildi
- [ ] GitHub'a push yapıldı
- [ ] README.md özelleştirildi
- [ ] .gitignore çalışıyor
- [ ] LICENSE eklendi
- [ ] CONTRIBUTING.md eklendi

---

## 🎯 Hızlı Komutlar

```powershell
# Proje dizinine git
cd C:\Users\ireal\Desktop\minecraft

# Git başlat ve ilk commit
git init
git add .
git commit -m "Initial commit: Minecraft Server setup"

# GitHub'a bağlan (URL'i değiştir!)
git remote add origin https://github.com/KULLANICI_ADIN/minecraft-server.git
git branch -M main
git push -u origin main
```

---

**Başarılar! 🚀**
