# Katkıda Bulunma Rehberi

Bu projeye katkıda bulunmak istediğiniz için teşekkürler! 🎉

## 🚀 Nasıl Katkıda Bulunurum?

### 1. Fork ve Clone

```bash
# Projeyi fork edin (GitHub'da Fork butonuna tıklayın)

# Fork'unuzu klonlayın
git clone https://github.com/KULLANICI_ADIN/minecraft-server.git
cd minecraft-server
```

### 2. Branch Oluşturun

```bash
# Feature branch oluşturun
git checkout -b feature/yeni-ozellik

# Veya bug fix için
git checkout -b fix/hata-duzeltmesi
```

### 3. Değişikliklerinizi Yapın

- Kod yazın
- Test edin
- Dokümantasyon güncelleyin

### 4. Commit ve Push

```bash
# Değişiklikleri ekleyin
git add .

# Commit yapın (açıklayıcı mesaj)
git commit -m "feat: yeni özellik eklendi"

# Push yapın
git push origin feature/yeni-ozellik
```

### 5. Pull Request Açın

- GitHub'da Pull Request açın
- Değişikliklerinizi açıklayın
- Review bekleyin

---

## 📝 Commit Mesaj Formatı

```
<tip>: <kısa açıklama>

<detaylı açıklama (opsiyonel)>
```

**Tipler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod iyileştirme
- `test`: Test ekleme
- `chore`: Bakım işleri

**Örnekler:**
```
feat: TimeHUD plugin'ine oyuncu sayısı eklendi
fix: RAM ayarlarında hata düzeltildi
docs: kurulum rehberi güncellendi
```

---

## 🧪 Test

Değişikliklerinizi test edin:

```bash
# Plugin'i derleyin
cd plugins/TimeHUD
mvn clean package

# Test sunucusunda çalıştırın
# Hataları kontrol edin
```

---

## 📋 Kod Standartları

- **Java:** Java 21 kullanın
- **Indentation:** 4 boşluk
- **Naming:** camelCase (değişkenler), PascalCase (sınıflar)
- **Comments:** Türkçe veya İngilizce

---

## 🐛 Bug Raporu

Bug bulduysanız:

1. GitHub Issues'da yeni issue açın
2. Şu bilgileri ekleyin:
   - Bug açıklaması
   - Adım adım nasıl oluştuğu
   - Beklenen davranış
   - Gerçek davranış
   - Sistem bilgileri (OS, Java version)
   - Log dosyaları

---

## 💡 Özellik İsteği

Yeni özellik önerisi:

1. GitHub Issues'da yeni issue açın
2. `enhancement` etiketi ekleyin
3. Özelliği detaylı açıklayın
4. Neden gerekli olduğunu belirtin

---

## ✅ Pull Request Checklist

- [ ] Kod çalışıyor ve test edildi
- [ ] Dokümantasyon güncellendi
- [ ] Commit mesajları açıklayıcı
- [ ] Kod standartlarına uygun
- [ ] Gereksiz dosyalar eklenmedi

---

Teşekkürler! 🙏
