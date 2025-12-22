# 🚀 VPS'de Çalıştırılacak Komutlar

## ADIM 1: Sunucuyu Durdur ve Düzelt
```bash
pm2 stop minecraft
cd /opt/minecraft
chmod +x scripts/fix-downgrade-issues.sh
./scripts/fix-downgrade-issues.sh
```

## ADIM 2: Pluginleri Yükle (Seçeneklerden Birini)

### Seçenek A: Temel Pluginler (Önerilen - 8 plugin)
```bash
chmod +x scripts/install-essential-plugins.sh
./scripts/install-essential-plugins.sh
```

### Seçenek B: Tüm Pluginler (15 plugin)
```bash
chmod +x scripts/install-plugins-1.20.6.sh
./scripts/install-plugins-1.20.6.sh
```

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
✅ Boş plugin dosyaları temizlendi
✅ Sunucu başarıyla başladı

## Çalışan Pluginler

- ✅ Vault v1.7.3
- ✅ Slimefun vRC-37
- ✅ Essentials v2.21.2
- ✅ SkinsRestorer v15.9.1
- ✅ TimeHUD v1.0.0 (1.20.6 uyumlu)

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
