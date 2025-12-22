# 🚀 VPS'de Çalıştırılacak Komutlar

## ADIM 1: Sunucuyu Durdur ve Düzelt
```bash
pm2 stop minecraft
cd /opt/minecraft
chmod +x scripts/fix-downgrade-issues.sh
./scripts/fix-downgrade-issues.sh
```

## ADIM 2: Pluginleri Yükle

### Minimal Set (Sadece TreeAssist - ÖNERİLEN)
```bash
chmod +x scripts/install-minimal-plugins.sh
./scripts/install-minimal-plugins.sh
```
**Not:** Slimefun zaten kurulu (500+ custom item/silah)!

## ADIM 3: Sunucuyu Başlat
```bash
pm2 start minecraft
```

## ADIM 4: Logları İzle
```bash
pm2 logs minecraft --lines 50
```

## Beklenen Sonuç

✅ Config dosyaları yeniden oluşturuldu (1.20.6 uyumlu)
✅ TimeHUD 1.20.6 için rebuild edildi
✅ Eski world yedeklendi ve silindi
✅ Yeni world oluşturuldu
✅ TreeAssist yüklendi (ağaç kesme)
✅ Sunucu başarıyla başladı

## Kurulu Pluginler

- ✅ Vault v1.7.3 (ekonomi API)
- ✅ Slimefun vRC-37 (500+ custom item/silah)
- ✅ Essentials v2.21.2 (komutlar)
- ✅ SkinsRestorer v15.9.1 (skin)
- ✅ TimeHUD v1.0.0 (HUD)
- ✅ TreeAssist v7.0.0 (ağaç kesme)

## Slimefun Kullanımı

```bash
# Oyun içinde
/sf guide
```

**Slimefun Özellikleri:**
- 500+ custom item
- 20+ custom silah (kılıç, yay, balta)
- 10+ custom zırh seti
- 100+ makine (elektrik, otomasyon)
- Jetpack, grappling hook, parachute
- Sihirli itemlar

**Detaylı rehber:** `docs/SLIMEFUN_SILAHLAR.md`

## Sorun Çözme

### Eğer sunucu başlamazsa:
```bash
pm2 logs minecraft --lines 100
```

### Eğer hala config hatası varsa:
```bash
rm -rf config/
pm2 restart minecraft
```

### Eğer world hatası varsa:
```bash
rm -rf world world_nether world_the_end
pm2 restart minecraft
```

## Sonraki Adımlar

1. ✅ Sunucu çalışıyor
2. 🎮 Oyuna gir ve test et
3. 📦 Eksik pluginleri manuel indir ve yükle:
   - TreeAssist
   - WorldEdit
   - WorldGuard
   - Citizens
   - MythicMobs

### Manuel Plugin Yükleme

```bash
# Lokal bilgisayardan VPS'ye
scp plugin.jar root@194.105.5.37:/opt/minecraft/plugins/

# VPS'de sunucuyu restart et
pm2 restart minecraft
```
