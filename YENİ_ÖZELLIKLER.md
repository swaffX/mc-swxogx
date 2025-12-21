# 🎨 Yeni Panel Özellikleri

## ✅ Tamamlanan Güncellemeler

### 1. 🎨 Mor-Pembe Gradient Tema
- **Renk Paleti:**
  - Primary: `#8b5cf6` (Mor)
  - Secondary: `#ec4899` (Pembe)
  - Gradient: Mor → Pembe geçişleri
  - Border: Mor tonlarında glow efekti
- **Görsel Değişiklikler:**
  - Sidebar active item: Mor-pembe gradient
  - Butonlar: Gradient arka planlar
  - Stat kartları: Mor, yeşil, turuncu, mavi
  - Background: Mor-pembe radial gradient animasyonları

### 2. 👤 Oyuncu Kafaları (Minecraft Skins)
- **API:** `https://mc-heads.net/avatar/{username}/size`
- **Kullanım Yerleri:**
  - Dashboard → Online Players (32x32px)
  - Players sayfası (40x40px)
  - Role Manager → Player Roles (40x40px)
- **Özellikler:**
  - Pixelated rendering (Minecraft tarzı)
  - Fallback placeholder (hata durumunda)
  - Rounded corners (8px border-radius)
  - Border glow efekti

### 3. 🏠 Gelişmiş Dashboard
**Yeni Layout:**
```
┌─────────────────────────────────────────┐
│  Stats Grid (4 kartlar)                 │
│  Status | Players | TPS | Memory        │
├──────────────────┬──────────────────────┤
│ Server Control   │ Online Players       │
│ Start/Stop/Rest  │ Player list + heads  │
├──────────────────┴──────────────────────┤
│ System Information                      │
│ CPU, RAM, Uptime, Platform              │
└─────────────────────────────────────────┘
```

**Server Control Kartı:**
- ▶️ Start butonu (yeşil)
- ⏹️ Stop butonu (kırmızı)
- 🔄 Restart butonu (turuncu)
- Uptime, CPU, Version bilgileri

**Online Players Kartı:**
- Oyuncu kafaları (32x32)
- Online status dot (yeşil)
- Real-time güncelleme
- Player count badge

### 4. 👑 Role Manager Sistemi

#### Özellikler:
- **Rol Oluşturma:** Yeni roller ekle
- **Rol Düzenleme:** İzinleri güncelle
- **Rol Silme:** Gereksiz rolleri kaldır
- **Oyuncu Rol Atama:** Online oyunculara rol ver

#### Varsayılan Roller:
1. **Admin** (Kırmızı)
   - Tüm yetkiler: `*`
   
2. **Moderator** (Turuncu)
   - İzinler: `kick, mute, warn, teleport`
   
3. **VIP** (Mor)
   - İzinler: `fly, kit.vip, home.3`
   
4. **Player** (Yeşil)
   - İzinler: `chat, build, break`

#### Rol Kartı Özellikleri:
- Renkli rol ikonu
- Rol adı ve izin sayısı
- İlk 10 izin gösterimi
- Edit ve Delete butonları
- Hover animasyonları

#### Player Roles Listesi:
- Oyuncu kafası (40x40)
- Oyuncu adı
- Mevcut rol (renkli)
- Rol değiştirme dropdown
- Real-time güncelleme

### 5. 📊 Stat Kartları Güncellemesi
**Yeni Renkler:**
- 🎮 Server Status: **Mor** gradient
- 👥 Online Players: **Yeşil** gradient
- ⚡ TPS: **Turuncu** gradient
- 💾 Memory: **Mavi** gradient

**Bilgiler:**
- Status: Online/Offline
- Players: X/20 formatı
- TPS: 20.0 formatı
- Memory: MB cinsinden

## 🎯 Kullanım

### VPS'te Uygula:
```bash
cd /path/to/mc-swxogx
git pull origin main
pm2 restart server
```

### Rol Yönetimi:
1. Dashboard'da **Role Manager** sekmesine git
2. **Create Role** ile yeni rol oluştur
3. **Edit** ile izinleri düzenle
4. **Player Roles** bölümünden oyunculara rol ata

### İzin Formatı:
```
chat, build, break, fly, teleport, kick, ban, op
kit.vip, home.3, warp.spawn
minecraft.command.gamemode
```

## 🎨 Tema Renkleri

### CSS Variables:
```css
--primary: #8b5cf6;           /* Mor */
--primary-dark: #7c3aed;      /* Koyu Mor */
--secondary: #ec4899;         /* Pembe */
--success: #10b981;           /* Yeşil */
--danger: #ef4444;            /* Kırmızı */
--warning: #f59e0b;           /* Turuncu */
--info: #06b6d4;              /* Mavi */
--gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
```

### Gradient Kullanımı:
- Butonlar: `var(--gradient-primary)`
- Active nav: `var(--gradient-primary)`
- Stat icons: Özel gradientler
- Background: Radial gradientler

## 📱 Responsive Tasarım
- Desktop: Tam özellikli
- Tablet: Daraltılabilir sidebar
- Mobile: Overlay sidebar
- Stats grid: Auto-fit layout

## 🔄 Real-time Güncellemeler
- Server status: 5 saniye
- Players list: 5 saniye
- TPS: 5 saniye
- Dashboard players: Otomatik

## 🎮 Minecraft Skin API
**Endpoint:** `https://mc-heads.net/`

**Formatlar:**
- `/avatar/{username}/{size}` - Kafa (isometric)
- `/head/{username}/{size}` - Kafa (flat)
- `/body/{username}/{size}` - Tam vücut

**Kullanılan:**
- Dashboard: 32px avatar
- Players: 40px avatar
- Roles: 40px avatar

## 💾 Veri Saklama
**LocalStorage:**
- `serverRoles` - Tüm roller
- `player_role_{username}` - Oyuncu rolleri
- `sidebarCollapsed` - Sidebar durumu

## 🚀 Performans
- Lazy loading: Sadece aktif sayfa yüklenir
- Image caching: Skin'ler cache'lenir
- Minimal re-renders: Sadece değişen veriler
- Optimized API calls: Paralel fetch'ler

## 🎉 Sonuç
Artık modern, mor-pembe temalı, oyuncu kafalarıyla ve gelişmiş rol yönetimiyle bir panel sisteminiz var!

**Özellikler:**
✅ Mor-pembe gradient tema
✅ Minecraft oyuncu kafaları
✅ Dashboard'da server control
✅ Dashboard'da online players
✅ Gelişmiş rol yönetim sistemi
✅ Rol oluşturma/düzenleme/silme
✅ Oyunculara rol atama
✅ İzin yönetimi
✅ Real-time güncellemeler
✅ Responsive tasarım
