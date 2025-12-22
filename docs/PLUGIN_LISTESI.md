# 📦 Plugin Listesi - Minecraft 1.20.6

## 🚀 Hızlı Kurulum

### Temel Pluginler (Önerilen - 8 plugin)
```bash
cd /opt/minecraft
chmod +x scripts/install-essential-plugins.sh
./scripts/install-essential-plugins.sh
pm2 restart minecraft
```

### Tüm Pluginler (15 plugin)
```bash
cd /opt/minecraft
chmod +x scripts/install-plugins-1.20.6.sh
./scripts/install-plugins-1.20.6.sh
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

### 5. TimeHUD v1.0.0 ✅
- Oyuncu HUD'unda sunucu saati
- Custom plugin
- **Komut:** `/timehud`

---

## 📥 Yüklenebilir Pluginler (1.20.6 Uyumlu)

### 🏗️ Dünya Düzenleme

#### WorldEdit ⭐ ZORUNLU
- Hızlı yapı oluşturma
- Kopyala/yapıştır
- Terrain düzenleme
- **Komutlar:**
  - `//wand` - Seçim değneği
  - `//set <block>` - Blok doldur
  - `//copy` - Kopyala
  - `//paste` - Yapıştır

#### WorldGuard ⭐ ZORUNLU
- Bölge koruma
- PvP kontrolü
- Flag sistemi
- **Komutlar:**
  - `/rg define <isim>` - Bölge oluştur
  - `/rg flag <bölge> pvp deny` - PvP kapat

---

### 🛡️ Koruma ve Güvenlik

#### LuckPerms ⭐ ÖNERİLEN
- Modern izin sistemi
- Grup yönetimi
- Web editör
- **Komutlar:**
  - `/lp user <player> permission set <perm>`
  - `/lp creategroup <name>`
- **Web:** https://luckperms.net/editor

#### CoreProtect ⭐ ÖNERİLEN
- Blok log sistemi
- Rollback/restore
- Grief koruması
- **Komutlar:**
  - `/co inspect` - İnceleme modu
  - `/co rollback u:<user> t:<time>` - Geri al
  - `/co lookup` - Arama

#### GriefPrevention ⭐ ÖNERİLEN
- Otomatik arazi koruma
- Claim sistemi
- PvP koruması
- **Kullanım:**
  - Altın kürek ile claim yap
  - `/trust <player>` - Oyuncu ekle
  - `/abandonclaim` - Claim sil

---

### 🎮 Oynanış

#### Citizens ⭐ POPÜLER
- NPC sistemi
- Custom skin'ler
- Quest entegrasyonu
- **Komutlar:**
  - `/npc create <isim>` - NPC oluştur
  - `/npc skin <isim>` - Skin değiştir
  - `/npc text <metin>` - Konuşma ekle

#### TreeAssist ⭐ KULLANICI İSTEĞİ
- Ağacı kökünden kesince tüm ağaç düşer
- Animasyonlu düşme
- **Komutlar:**
  - `/ta` - Ana menü
  - `/ta toggle` - Aç/kapat

#### ChestShop ⭐ POPÜLER
- Oyuncu mağazaları
- Ekonomi entegrasyonu
- **Kullanım:**
  - Chest + Sign ile mağaza yap
  - Format: `[Quantity]`, `[Price]`, `Item`, `Player`

---

### 💼 Ekonomi ve İş

#### Jobs Reborn
- Meslek sistemi
- Para kazanma
- Seviye sistemi
- **Komutlar:**
  - `/jobs browse` - Meslek listesi
  - `/jobs join <job>` - Mesleğe katıl
  - `/jobs stats` - İstatistikler

#### mcMMO
- RPG yetenekleri
- Seviye sistemi
- Özel yetenekler
- **Komutlar:**
  - `/mcmmo help` - Yardım
  - `/mctop` - Sıralama
  - `/mcstats` - İstatistikler

#### QuickShop Hikari
- Hızlı mağaza sistemi
- Modern UI
- Ekonomi entegrasyonu
- **Komutlar:**
  - `/qs create <price>` - Mağaza oluştur
  - `/qs buy` - Satın al
  - `/qs sell` - Sat

---

### 🌍 Dünya Yönetimi

#### Multiverse-Core
- Çoklu dünya desteği
- Portal sistemi
- Dünya oluşturma
- **Komutlar:**
  - `/mv create <name> <type>` - Dünya oluştur
  - `/mv tp <world>` - Dünyaya ışınlan
  - `/mv list` - Dünya listesi

#### Dynmap
- Web haritası
- Gerçek zamanlı oyuncu konumları
- 3D harita
- **Erişim:** `http://YOUR_IP:8123`
- **Komutlar:**
  - `/dynmap hide` - Haritada gizlen
  - `/dynmap show` - Haritada görün

---

### 🍺 Eğlence

#### Brewery
- İçki yapma sistemi
- Fermantasyon
- Sarhoşluk efekti
- **Tarifler:**
  - Bira: Buğday + Maya
  - Şarap: Üzüm + Şeker
  - Votka: Patates + Maya

---

### 🔗 Entegrasyon

#### DiscordSRV
- Discord entegrasyonu
- Chat senkronizasyonu
- Oyuncu durumu
- **Config:** `plugins/DiscordSRV/config.yml`

---

## 📊 Plugin Karşılaştırması

| Plugin | Kategori | Öncelik | Boyut | Performans |
|--------|----------|---------|-------|------------|
| WorldEdit | Düzenleme | ⭐⭐⭐ | ~3MB | Orta |
| WorldGuard | Koruma | ⭐⭐⭐ | ~1MB | Düşük |
| LuckPerms | İzinler | ⭐⭐⭐ | ~2MB | Düşük |
| CoreProtect | Log | ⭐⭐⭐ | ~1MB | Orta |
| GriefPrevention | Koruma | ⭐⭐⭐ | ~500KB | Düşük |
| Citizens | NPC | ⭐⭐ | ~2MB | Orta |
| ChestShop | Ekonomi | ⭐⭐ | ~200KB | Düşük |
| TreeAssist | Oynanış | ⭐⭐ | ~100KB | Düşük |
| Jobs | Ekonomi | ⭐ | ~1MB | Orta |
| mcMMO | RPG | ⭐ | ~2MB | Yüksek |
| QuickShop | Ekonomi | ⭐ | ~3MB | Orta |
| Multiverse | Dünya | ⭐ | ~1MB | Orta |
| Brewery | Eğlence | ⭐ | ~500KB | Düşük |
| DiscordSRV | Entegrasyon | ⭐ | ~5MB | Düşük |
| Dynmap | Harita | ⭐ | ~10MB | Yüksek |

---

## 🎯 Önerilen Kurulum Sırası

### 1. Temel Altyapı (İlk Gün)
```bash
./scripts/install-essential-plugins.sh
```
- WorldEdit
- WorldGuard
- LuckPerms
- CoreProtect
- GriefPrevention
- Citizens
- ChestShop
- TreeAssist

### 2. Ekonomi ve RPG (2. Gün)
- Jobs Reborn
- mcMMO
- QuickShop

### 3. Ekstra Özellikler (3. Gün)
- Multiverse-Core
- Brewery
- DiscordSRV

### 4. Harita (Opsiyonel)
- Dynmap (performans etkisi yüksek)

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

#### LuckPerms:
```bash
/lp creategroup admin
/lp creategroup moderator
/lp creategroup vip
/lp user <player> parent set admin
```

#### WorldGuard:
```bash
/rg define spawn
/rg flag spawn pvp deny
/rg flag spawn mob-spawning deny
```

#### GriefPrevention:
```bash
/acb 100  # Başlangıç claim blokları
```

---

## 📚 Dokümantasyon Linkleri

- **WorldEdit:** https://worldedit.enginehub.org/
- **WorldGuard:** https://worldguard.enginehub.org/
- **LuckPerms:** https://luckperms.net/wiki
- **CoreProtect:** https://docs.coreprotect.net/
- **Citizens:** https://wiki.citizensnpcs.co/
- **Slimefun:** https://github.com/Slimefun/Slimefun4/wiki
- **Essentials:** https://essentialsx.net/wiki/

---

## ⚠️ Önemli Notlar

1. **Tüm pluginler 1.20.6 ile test edilmiştir**
2. **curl ile indirme wget'ten daha güvenilir**
3. **Boş dosyalar otomatik temizlenir**
4. **Her plugin restart sonrası yüklenir**
5. **Config dosyaları `plugins/<PluginName>/` içinde**

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

---

**Son Güncelleme:** 1.20.6 downgrade sonrası
**Toplam Plugin:** 20 (5 kurulu + 15 yüklenebilir)
**Önerilen Minimum:** 13 plugin (5 kurulu + 8 temel)
