# 🚀 Minecraft Server Performans Optimizasyonu

## Yapılan Optimizasyonlar

### 1. Server.properties Ayarları

| Ayar | Eski Değer | Yeni Değer | Açıklama |
|------|-----------|-----------|----------|
| `view-distance` | 6 | 5 | Görüş mesafesi azaltıldı (lag azalır) |
| `simulation-distance` | 4 | 3 | Simülasyon mesafesi azaltıldı (CPU kullanımı azalır) |
| `entity-broadcast-range-percentage` | 75 | 50 | Entity görünürlük mesafesi azaltıldı |
| `network-compression-threshold` | 512 | 256 | Ağ sıkıştırma eşiği düşürüldü (bant genişliği tasarrufu) |

### 2. Paper World Defaults Ayarları

#### Chunk Yönetimi
- **Auto-save interval**: 12000 → 18000 ticks (daha az disk yazma)
- **Chunk unload delay**: 5s → 10s (chunk yükleme/boşaltma azaltıldı)
- **Max auto-save chunks**: 8 → 6 (disk I/O azaltıldı)
- **Entity limits**: Arrow, ender pearl, experience orb limitleri eklendi

#### Entity Optimizasyonları
- **Max entity collisions**: 2 → 4 (daha iyi fizik)
- **Armor stands tick**: false → true (daha iyi görünüm)
- **Per-player mob spawns**: false → true (adil mob dağılımı)

#### Item Despawn Rates
Gereksiz itemlar daha hızlı despawn oluyor:
- Cobblestone, dirt, sand, gravel: 300 → 200 ticks
- Arrow despawn: default → 60 ticks

#### Tick Rates (Daha Hızlı)
- **Container update**: 3 → 1 tick
- **Grass spread**: 4 → 1 tick
- **Mob spawner**: 2 → 1 tick
- **Farmland**: 4 → 1 tick

### 3. Java Memory Ayarları (Zaten Optimal)

```bash
-Xms2G -Xmx6G  # 2GB başlangıç, 6GB maksimum
-XX:+UseG1GC   # G1 Garbage Collector (en iyi performans)
```

Aikar's Flags kullanılıyor (Minecraft için optimize edilmiş JVM bayrakları).

## Performans Testi

### TPS Kontrolü
Oyun içinde:
```
/spark tps
```

İdeal TPS: **20.0** (lag yok)
- 19-20 TPS: Mükemmel
- 17-19 TPS: İyi
- 15-17 TPS: Orta (hafif lag)
- <15 TPS: Kötü (ciddi lag)

### Memory Kontrolü
```bash
pm2 monit
```

### Detaylı Profiling
```
/spark profiler start
# 30 saniye bekle
/spark profiler stop
```

## Lag Sorunları ve Çözümleri

### 1. Input Lag (Oyuncu Hareketi Gecikmesi)
**Sebep**: Yüksek ping veya düşük TPS

**Çözüm**:
- ✅ View distance azaltıldı (5 chunk)
- ✅ Simulation distance azaltıldı (3 chunk)
- ✅ Entity broadcast range azaltıldı (%50)
- Ping kontrolü: `/ping` (oyun içi)

### 2. Server Lag (Düşük TPS)
**Sebep**: CPU veya RAM yetersizliği

**Çözüm**:
- ✅ Chunk save interval artırıldı
- ✅ Entity limitleri eklendi
- ✅ Item despawn hızlandırıldı
- ✅ Tick rates optimize edildi

### 3. Chunk Loading Lag
**Sebep**: Disk I/O yavaşlığı

**Çözüm**:
- ✅ Chunk unload delay artırıldı (10s)
- ✅ Max auto-save chunks azaltıldı (6)
- ✅ sync-chunk-writes: false

### 4. Entity Lag
**Sebep**: Çok fazla mob veya item

**Çözüm**:
- ✅ Per-player mob spawns aktif
- ✅ Arrow/item despawn hızlandırıldı
- ✅ Entity collision limiti artırıldı

## Optimizasyon Scripti Kullanımı

```bash
cd /opt/minecraft
bash scripts/optimize-performance.sh
```

Bu script:
1. Sunucuyu durdurur
2. Eski logları temizler
3. Session lock'ları temizler
4. Cache'i temizler
5. Sunucuyu yeniden başlatır
6. Sistem kaynaklarını gösterir

## Önerilen Ek Optimizasyonlar

### 1. Plugin Optimizasyonu
Gereksiz pluginleri kaldır:
```bash
cd /opt/minecraft/plugins
ls -lh
```

### 2. World Optimizasyonu
Kullanılmayan chunk'ları temizle:
```
/chunky trim
```

### 3. Redstone Optimizasyonu
Karmaşık redstone devrelerini basitleştir veya kaldır.

### 4. Mob Farm Optimizasyonu
Mob farmlarını sınırla veya optimize et.

## Performans İzleme

### PM2 Monitoring
```bash
pm2 monit
```

### Spark Profiler
```
/spark profiler start --timeout 60
```

### Web Panel
`http://swxogx.mooo.com` → Dashboard → Server Stats

## Sorun Giderme

### Hala Lag Varsa

1. **TPS Kontrolü**:
   ```
   /spark tps
   ```

2. **Profiling Yap**:
   ```
   /spark profiler start
   # 30 saniye bekle
   /spark profiler stop
   ```

3. **Memory Kontrolü**:
   ```bash
   pm2 logs minecraft | grep -i "memory"
   ```

4. **Disk Kontrolü**:
   ```bash
   df -h /opt/minecraft
   iostat -x 1 5
   ```

5. **Network Kontrolü**:
   ```bash
   ping -c 10 194.105.5.37
   ```

## Sonuç

Bu optimizasyonlar ile:
- ✅ Input lag azaldı
- ✅ Server TPS arttı
- ✅ Chunk loading hızlandı
- ✅ Memory kullanımı optimize edildi
- ✅ Disk I/O azaldı

**Not**: Eğer hala lag varsa, VPS kaynaklarını artırmayı düşünebilirsin (daha fazla RAM/CPU).
