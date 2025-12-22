# 🎮 Minecraft Server Plugin Listesi

## Kurulu Pluginler

### 🌲 1. TreeAssist - Ağaç Kesme Sistemi
**Özellikler:**
- Ağacı kökünden kesince tüm ağaç düşer
- Animasyonlu düşme efekti
- Dayanıklılık kaybı ayarlanabilir
- Hangi ağaçlar için aktif olacağı seçilebilir

**Komutlar:**
- `/ta` - Ana menü
- `/ta reload` - Config yenile
- `/ta toggle` - Aç/kapat

**Config:** `plugins/TreeAssist/config.yml`

---

### ⚙️ 2. Slimefun4 - Teknik Modlar
**Özellikler:**
- 500+ yeni item ve makine
- Elektrik sistemi (jeneratörler, kablolar)
- Otomatik madenler (Quarry)
- Otomatik farmlar
- GPS sistemi
- Teleportasyon
- Jetpack ve zırh setleri
- Sihirli itemlar

**Komutlar:**
- `/sf guide` - Rehber kitabı al
- `/sf search <item>` - Item ara
- `/sf stats` - İstatistikler

**Başlangıç:**
1. `/sf guide` komutuyla rehber kitabı al
2. Kitabı aç ve kategorilere bak
3. Crafting tariflerini öğren
4. Temel makineleri yap

---

### 👹 3. MythicMobs - Özel Moblar
**Özellikler:**
- Custom moblar (boss'lar, yaratıklar)
- Özel yetenekler ve AI
- Particle efektleri
- Custom loot tabloları
- Spawn sistemi

**Komutlar:**
- `/mm mobs` - Mob listesi
- `/mm spawn <mob>` - Mob spawn et
- `/mm reload` - Config yenile

**Örnek Moblar:**
- Ateş Ejderhası
- Buz Devi
- Karanlık Şövalye
- Orman Ruhu

---

### 👑 4. EliteMobs - Boss Sistemi
**Özellikler:**
- Seviye sistemi (moblar seviye kazanır)
- Boss dungeons (hazır yapılar)
- Custom loot ve itemlar
- Quest sistemi
- Arena sistemi
- Ekonomi entegrasyonu

**Komutlar:**
- `/em` - Ana menü
- `/em shop` - Item mağazası
- `/em quest` - Quest'ler
- `/em rank` - Sıralama

**Başlangıç:**
1. `/em` komutuyla menüyü aç
2. Quest'leri tamamla
3. Boss'ları yen
4. Özel itemlar kazan

---

### 🏗️ 5. WorldEdit - Yapı Düzenleme
**Özellikler:**
- Hızlı yapı oluşturma
- Kopyala/yapıştır
- Schematic sistemi
- Brush araçları
- Terrain düzenleme

**Komutlar:**
- `//wand` - Seçim değneği
- `//set <block>` - Blok doldur
- `//copy` - Kopyala
- `//paste` - Yapıştır
- `//undo` - Geri al

---

### 🛡️ 6. WorldGuard - Bölge Koruma
**Özellikler:**
- Bölge koruma
- PvP kontrolü
- Mob spawn kontrolü
- Flag sistemi

**Komutlar:**
- `/rg define <isim>` - Bölge oluştur
- `/rg flag <bölge> <flag> <değer>` - Flag ayarla
- `/rg addmember <bölge> <oyuncu>` - Üye ekle

---

### 🧑 7. Citizens - NPC Sistemi
**Özellikler:**
- NPC oluşturma
- Custom skin'ler
- Konuşma sistemi
- Quest entegrasyonu
- Mağaza NPC'leri

**Komutlar:**
- `/npc create <isim>` - NPC oluştur
- `/npc skin <isim>` - Skin değiştir
- `/npc text <metin>` - Konuşma ekle
- `/npc remove` - NPC sil

---

### 📜 8. Denizen - NPC Scripting
**Özellikler:**
- NPC scriptleri
- Quest sistemi
- Cutscene'ler
- Custom event'ler

**Kullanım:**
- Citizens ile birlikte çalışır
- Script dosyaları: `plugins/Denizen/scripts/`

---

### 🍺 9. Brewery - İçki Yapma
**Özellikler:**
- Gerçekçi içki yapma sistemi
- Fermantasyon süreci
- Yaşlandırma sistemi
- Sarhoşluk efekti
- Custom tarifler

**Nasıl Yapılır:**
1. Malzemeleri cauldron'a at
2. Su ile karıştır
3. Şişelere doldur
4. Fıçıda yaşlandır
5. İç ve sarhoş ol!

**Tarifler:**
- Bira: Buğday + Maya
- Şarap: Üzüm + Şeker
- Votka: Patates + Maya
- Rom: Şeker kamışı + Maya

---

### 🪑 10. Chairs - Oturma Sistemi
**Özellikler:**
- Merdivenlere oturma
- Basamaklara oturma
- Otomatik oturma
- Custom oturma yüksekliği

**Kullanım:**
- Merdiven veya basamağa sağ tıkla
- Otomatik olarak otur
- Shift + sağ tıkla = kalk

---

### 🔨 11. CustomCrafting - Özel Craft'lar
**Özellikler:**
- Custom crafting tarifleri
- Shapeless/shaped recipes
- Furnace recipes
- Brewing recipes
- Custom item özellikleri

**Komutlar:**
- `/cc` - Ana menü
- `/cc recipes` - Tarif listesi
- `/cc create` - Tarif oluştur

---

### 🔧 12. WolfyUtilities
**Açıklama:**
- CustomCrafting için gerekli kütüphane
- Arka planda çalışır

---

## 🎯 Önerilen Başlangıç

### Yeni Oyuncular İçin:
1. **TreeAssist** ile ağaç kesmeye başla
2. **Slimefun** rehber kitabını al (`/sf guide`)
3. **EliteMobs** quest'lerini yap (`/em`)
4. **Brewery** ile içki yap

### Yapı Yapanlar İçin:
1. **WorldEdit** değneğini al (`//wand`)
2. **WorldGuard** ile bölgeni koru
3. **Citizens** ile NPC'ler ekle

### Macera Sevenler İçin:
1. **EliteMobs** dungeon'larını keşfet
2. **MythicMobs** boss'larını yen
3. **Quest'leri** tamamla

---

## 📖 Detaylı Rehberler

### Slimefun Başlangıç Rehberi

1. **Temel Makineler:**
   - Enhanced Crafting Table (gelişmiş craft masası)
   - Ore Crusher (cevher kırıcı)
   - Compressor (sıkıştırıcı)
   - Smeltery (eritme fırını)

2. **Elektrik Sistemi:**
   - Solar Generator (güneş paneli)
   - Coal Generator (kömür jeneratörü)
   - Energy Connector (enerji kablosu)
   - Energy Regulator (enerji düzenleyici)

3. **Otomatik Sistemler:**
   - Auto-Breeder (otomatik hayvan üretici)
   - Crop Growth Accelerator (bitki hızlandırıcı)
   - Animal Growth Accelerator (hayvan büyütücü)

### EliteMobs Boss Rehberi

**Boss Seviyeleri:**
- Level 1-10: Kolay (yeni başlayanlar)
- Level 11-30: Orta (deneyimli oyuncular)
- Level 31-50: Zor (grup gerekli)
- Level 51+: Çok Zor (raid boss'ları)

**Boss Loot:**
- Özel silahlar ve zırhlar
- Büyülü itemlar
- Para ve kaynaklar
- Quest itemları

---

## ⚙️ Performans Notları

Bu pluginler optimize edilmiştir:
- Slimefun: Tick rate ayarlanabilir
- MythicMobs: Spawn limitleri var
- EliteMobs: Otomatik temizleme
- WorldEdit: Async işlemler

**Önerilen Ayarlar:**
- Max oyuncu: 20
- View distance: 5
- Simulation distance: 3

---

## 🔧 Sorun Giderme

### Plugin Yüklenmediyse:
```bash
cd /opt/minecraft
pm2 logs minecraft | grep -i "error"
```

### Config Düzenleme:
```bash
cd /opt/minecraft/plugins/<PluginName>
nano config.yml
# Düzenle ve kaydet
pm2 restart minecraft
```

### Plugin Listesi:
Oyun içinde: `/plugins`

---

## 📚 Ek Kaynaklar

- **Slimefun Wiki:** https://github.com/Slimefun/Slimefun4/wiki
- **MythicMobs Wiki:** https://git.mythiccraft.io/mythiccraft/MythicMobs/-/wikis/home
- **EliteMobs Wiki:** https://magmaguy.com/wiki.html
- **WorldEdit Docs:** https://worldedit.enginehub.org/
- **Citizens Wiki:** https://wiki.citizensnpcs.co/

---

## 🎮 Eğlenceli Kombinasyonlar

1. **Slimefun + EliteMobs:** Slimefun silahlarıyla boss'ları yen
2. **Citizens + Denizen:** Quest NPC'leri oluştur
3. **WorldEdit + WorldGuard:** Korumalı yapılar yap
4. **Brewery + Citizens:** İçki satan NPC'ler
5. **MythicMobs + EliteMobs:** Custom boss'lar ekle

---

**Not:** Tüm pluginler Paper 1.21.1 ile uyumludur ve test edilmiştir.
