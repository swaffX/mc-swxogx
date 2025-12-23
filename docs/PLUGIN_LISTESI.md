# 📦 Plugin Listesi - Minecraft 1.21.1

## 🚀 Hızlı Kurulum

### Tüm Pluginler (10 plugin)
```bash
cd /opt/minecraft
chmod +x scripts/install-plugins-1.21.1.sh
./scripts/install-plugins-1.21.1.sh
pm2 restart minecraft
```

---

## ✅ Zaten Kurulu Pluginler

### 1. Vault v1.7.3 ✅
- Ekonomi API
- İzin sistemi entegrasyonu
- Arka planda çalışır

### 2. Slimefun vRC-37 ✅
- 500+ yeni item ve makine
- Elektrik sistemi
- Otomatik madenler
- Tekkit benzeri özellikler
- **Komut:** `/sf guide`

### 3. Essentials v2.21.2 ✅
- Temel komutlar (/home, /warp, /spawn)
- Ekonomi sistemi
- Kit sistemi
- Teleportasyon
- **Komut:** `/help`

### 4. SkinsRestorer v15.9.1 ✅
- Offline modda skin desteği
- Custom skin'ler
- Otomatik çalışır

### 5. TimeHUD v1.1.0 ✅
- Oyuncu HUD'unda sunucu saati
- Custom plugin (1.21.1 uyumlu)
- **Komut:** `/timehud`

---

## 📥 Yüklenebilir Pluginler (1.21.1 Uyumlu)

### 🏗️ Dünya Düzenleme

#### 1. WorldEdit v7.3.6 ⭐ ZORUNLU
- Hızlı yapı oluşturma
- Kopyala/yapıştır
- Terrain düzenleme
- Brush araçları
- **Komutlar:**
  - `//wand` - Seçim değneği
  - `//set <block>` - Blok doldur
  - `//copy` - Kopyala
  - `//paste` - Yapıştır
  - `//undo` - Geri al
  - `//sphere <block> <radius>` - Küre oluştur
- **Boyut:** ~3 MB
- **Performans:** Orta

#### 2. WorldGuard v7.0.11 ⭐ ZORUNLU
- Bölge koruma sistemi
- PvP kontrolü
- Mob spawn kontrolü
- Flag sistemi
- **Komutlar:**
  - `/rg define <isim>` - Bölge oluştur
  - `/rg flag <bölge> pvp deny` - PvP kapat
  - `/rg addmember <bölge> <oyuncu>` - Üye ekle
  - `/rg info <bölge>` - Bölge bilgisi
- **Boyut:** ~1 MB
- **Performans:** Düşük

---

### 🛡️ Koruma ve Güvenlik

#### 3. LuckPerms v5.4.141 ⭐ ÖNERİLEN
- Modern izin sistemi
- Grup yönetimi
- Web editör
- MySQL/SQLite desteği
- **Komutlar:**
  - `/lp user <player> permission set <perm>` - İzin ver
  - `/lp creategroup <name>` - Grup oluştur
  - `/lp user <player> parent set <group>` - Gruba ekle
  - `/lp editor` - Web editör
- **Web:** https://luckperms.net/editor
- **Boyut:** ~2 MB
- **Performans:** Düşük

#### 4. CoreProtect v22.4 ⭐ ÖNERİLEN
- Blok log sistemi
- Rollback/restore
- Grief koruması
- Chest log
- **Komutlar:**
  - `/co inspect` - İnceleme modu (sağ tıkla)
  - `/co rollback u:<user> t:<time>` - Geri al
  - `/co restore u:<user> t:<time>` - Geri yükle
  - `/co lookup` - Arama
- **Örnek:** `/co rollback u:Notch t:1h r:10`
- **Boyut:** ~1 MB
- **Performans:** Orta

---

### 🎮 Oynanış

#### 5. Citizens v2.0.35 ⭐ POPÜLER
- NPC sistemi
- Custom skin'ler
- Quest entegrasyonu
- Mağaza NPC'leri
- **Komutlar:**
  - `/npc create <isim>` - NPC oluştur
  - `/npc skin <isim>` - Skin değiştir
  - `/npc text <metin>` - Konuşma ekle
  - `/npc remove` - NPC sil
  - `/npc select` - NPC seç
- **Boyut:** ~2 MB
- **Performans:** Orta

#### 6. ChestShop v3.12.2 ⭐ POPÜLER
- Oyuncu mağazaları
- Ekonomi entegrasyonu
- Otomatik alım/satım
- **Kullanım:**
  - Chest + Sign ile mağaza yap
  - Sign formatı:
    ```
    [Oyuncu Adı]
    [Miktar]
    B [Alış] : S [Satış]
    [Item Adı]
    ```
- **Örnek:**
  ```
  SwxOgx
  64
  B 10 : S 5
  Diamond
  ```
- **Boyut:** ~200 KB
- **Performans:** Düşük

---

### 🌍 Dünya Yönetimi

#### 7. Multiverse-Core v4.3.12 ⭐ ÖNERİLEN
- Çoklu dünya desteği
- Portal sistemi
- Dünya oluşturma
- Dünya başına ayarlar
- **Komutlar:**
  - `/mv create <name> <type>` - Dünya oluştur
  - `/mv tp <world>` - Dünyaya ışınlan
  - `/mv list` - Dünya listesi
  - `/mv delete <world>` - Dünya sil
- **Dünya Tipleri:** NORMAL, NETHER, END, FLAT
- **Boyut:** ~1 MB
- **Performans:** Orta

#### 8. Dynmap v3.7-beta-6 ⭐ POPÜLER
- Web haritası
- Gerçek zamanlı oyuncu konumları
- 3D harita
- Marker sistemi
- **Erişim:** `http://YOUR_IP:8123`
- **Komutlar:**
  - `/dynmap hide` - Haritada gizlen
  - `/dynmap show` - Haritada görün
  - `/dmarker add <label>` - İşaret ekle
- **Boyut:** ~10 MB
- **Performans:** Yüksek ⚠️

---

### 🍺 Eğlence

#### 9. Brewery v3.3.1 ⭐ POPÜLER
- İçki yapma sistemi
- Fermantasyon süreci
- Yaşlandırma sistemi
- Sarhoşluk efekti
- **Nasıl Yapılır:**
  1. Malzemeleri cauldron'a at
  2. Su ile karıştır (sağ tıkla)
  3. Şişelere doldur
  4. Fıçıda yaşlandır
  5. İç ve sarhoş ol!
- **Tarifler:**
  - Bira: 3 Buğday + Cauldron (8 dakika)
  - Şarap: 5 Üzüm + Cauldron (5 dakika)
  - Votka: 10 Patates + Cauldron (15 dakika)
- **Boyut:** ~500 KB
- **Performans:** Düşük

---

### 🔗 Entegrasyon

#### 10. DiscordSRV v1.28.0 ⭐ ÖNERİLEN
- Discord entegrasyonu
- Chat senkronizasyonu
- Oyuncu durumu
- Komut senkronizasyonu
- **Kurulum:**
  1. Discord bot oluştur
  2. `plugins/DiscordSRV/config.yml` düzenle
  3. Bot token ve channel ID ekle
  4. Sunucuyu restart et
- **Config:** `plugins/DiscordSRV/config.yml`
- **Boyut:** ~5 MB
- **Performans:** Düşük

---

## 📊 Plugin Özeti

| Plugin | Kategori | Öncelik | Boyut | Performans | 1.21.1 Uyumlu |
|--------|----------|---------|-------|------------|---------------|
| Vault | API | ✅ Kurulu | ~500KB | Düşük | ✅ |
| Slimefun | Tech | ✅ Kurulu | ~5MB | Orta | ✅ |
| Essentials | Temel | ✅ Kurulu | ~2MB | Düşük | ✅ |
| SkinsRestorer | Skin | ✅ Kurulu | ~1MB | Düşük | ✅ |
| TimeHUD | Custom | ✅ Kurulu | ~10KB | Düşük | ✅ |
| WorldEdit | Düzenleme | ⭐⭐⭐ | ~3MB | Orta | ✅ |
| WorldGuard | Koruma | ⭐⭐⭐ | ~1MB | Düşük | ✅ |
| LuckPerms | İzinler | ⭐⭐⭐ | ~2MB | Düşük | ✅ |
| CoreProtect | Log | ⭐⭐⭐ | ~1MB | Orta | ✅ |
| Citizens | NPC | ⭐⭐ | ~2MB | Orta | ✅ |
| ChestShop | Ekonomi | ⭐⭐ | ~200KB | Düşük | ✅ |
| Multiverse | Dünya | ⭐⭐ | ~1MB | Orta | ✅ |
| Dynmap | Harita | ⭐ | ~10MB | Yüksek | ✅ |
| Brewery | Eğlence | ⭐ | ~500KB | Düşük | ✅ |
| DiscordSRV | Discord | ⭐ | ~5MB | Düşük | ✅ |

**Toplam:** 15 plugin (5 kurulu + 10 yüklenebilir)

---

## 🎯 Önerilen Kurulum

### Minimum (Zaten Kurulu - 5 plugin):
- Vault
- Slimefun
- Essentials
- SkinsRestorer
- TimeHUD

### Temel (Önerilen - 10 plugin):
Minimum + WorldEdit + WorldGuard + LuckPerms + CoreProtect + Citizens

### Tam (15 plugin):
Temel + ChestShop + Multiverse + Dynmap + Brewery + DiscordSRV

---

## 🔧 Kurulum Sonrası

### 1. Sunucuyu Restart Et
```bash
pm2 restart minecraft
```

### 2. Logları Kontrol Et
```bash
pm2 logs minecraft --lines 50
```

### 3. Plugin Listesini Kontrol Et
Oyun içinde: `/plugins`

### 4. Temel Ayarları Yap

#### LuckPerms Grupları:
```bash
/lp creategroup admin
/lp creategroup moderator
/lp creategroup vip
/lp user <player> parent set admin
```

#### WorldGuard Spawn Koruması:
```bash
/rg define spawn
/rg flag spawn pvp deny
/rg flag spawn mob-spawning deny
/rg flag spawn greeting &aSpawn bölgesine hoş geldin!
```

#### Dynmap Ayarları:
- Web: `http://194.105.5.37:8123`
- Config: `plugins/dynmap/configuration.txt`

---

## 📚 Dokümantasyon

- **WorldEdit:** https://worldedit.enginehub.org/
- **WorldGuard:** https://worldguard.enginehub.org/
- **LuckPerms:** https://luckperms.net/wiki
- **CoreProtect:** https://docs.coreprotect.net/
- **Citizens:** https://wiki.citizensnpcs.co/
- **Slimefun:** https://github.com/Slimefun/Slimefun4/wiki
- **Essentials:** https://essentialsx.net/wiki/
- **Dynmap:** https://github.com/webbukkit/dynmap/wiki

---

## ⚠️ Önemli Notlar

1. ✅ **Tüm pluginler 1.21.1 ile test edilmiştir**
2. ✅ **curl ile indirme wget'ten daha güvenilir**
3. ✅ **Boş dosyalar otomatik temizlenir**
4. ⚠️ **Dynmap performans etkisi yüksek (opsiyonel)**
5. ⚠️ **Bazı pluginler 1.21.1'de sınırlı destek verebilir**

---

## 🐛 Sorun Giderme

### Plugin yüklenmediyse:
```bash
cd /opt/minecraft/plugins
ls -lh *.jar
# Boş dosyaları sil
find . -name "*.jar" -size -1k -delete
```

### Manuel indirme gerekiyorsa:
```bash
# Lokal bilgisayardan VPS'ye
scp plugin.jar root@194.105.5.37:/opt/minecraft/plugins/
```

### Config hatası varsa:
```bash
cd /opt/minecraft/plugins/<PluginName>
nano config.yml
# Düzenle ve kaydet
pm2 restart minecraft
```

### Plugin çakışması varsa:
```bash
# Logları kontrol et
pm2 logs minecraft | grep -i "error"
# Çakışan plugini geçici olarak kaldır
mv plugins/Problem.jar plugins/Problem.jar.disabled
pm2 restart minecraft
```

---

**Son Güncelleme:** 1.21.1 upgrade
**Minecraft Versiyonu:** Paper 1.21.1 (build 129)
**Toplam Plugin:** 15 (5 kurulu + 10 yüklenebilir)
**Durum:** ✅ Hazır
