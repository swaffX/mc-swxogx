# 🎭 Real-Time Rol Yönetim Sistemi

## Genel Bakış

Web paneli ile Minecraft sunucusu arasında gerçek zamanlı rol yönetim sistemi. Roller web panelden atandığında, Minecraft sunucusunda anında renkli bildirim mesajı gönderilir.

## Özellikler

### ✅ Tamamlanan Özellikler

1. **Web Panel Rol Yönetimi**
   - Rol oluşturma, düzenleme, silme
   - Oyunculara rol atama
   - Rol izinlerini düzenleme
   - Varsayılan roller: Admin, Moderator, VIP, Player

2. **Real-Time Minecraft Entegrasyonu**
   - Rol atandığında RCON ile Minecraft'a bildirim gönderimi
   - Renkli chat mesajları (her rol için farklı renk)
   - Sunucu offline olsa bile rol kaydedilir

3. **Kalıcı Veri Saklama**
   - Roller `data/player-roles.json` dosyasında saklanır
   - Sunucu yeniden başlatılsa bile roller korunur
   - LocalStorage + Backend senkronizasyonu

## Kullanım

### Rol Atama

1. Dashboard'da "Role Manager" sekmesine git
2. "Player Roles" bölümünde online oyuncuları gör
3. Dropdown'dan rol seç
4. Onay dialogunda "OK" tıkla
5. Minecraft sunucusunda renkli bildirim görünür!

### Örnek Minecraft Bildirimi

```
[PANEL] SwxOgx oyuncusuna VIP rolü verildi!
```

Renk kodları:
- **Admin**: Kırmızı (red)
- **Moderator**: Altın (gold)
- **VIP**: Mor (light_purple)
- **Player**: Yeşil (green)

## API Endpoints

### POST `/api/roles/assign`

Oyuncuya rol atar ve Minecraft'a bildirim gönderir.

**Request:**
```json
{
  "playerName": "SwxOgx",
  "roleId": "vip",
  "roleName": "VIP"
}
```

**Response (Başarılı):**
```json
{
  "success": true,
  "message": "Role assigned and Minecraft notified",
  "playerName": "SwxOgx",
  "roleName": "VIP"
}
```

**Response (Sunucu Offline):**
```json
{
  "success": true,
  "message": "Role saved but server notification failed",
  "warning": "Server might be offline"
}
```

### GET `/api/roles/players`

Tüm oyuncu rollerini getirir.

**Response:**
```json
{
  "success": true,
  "roles": {
    "SwxOgx": {
      "roleId": "vip",
      "roleName": "VIP",
      "assignedAt": "2024-12-21T10:30:00.000Z"
    }
  }
}
```

## Teknik Detaylar

### RCON Entegrasyonu

Roller atandığında `tellraw` komutu kullanılır:

```javascript
const tellrawCommand = `tellraw @a {"text":"[PANEL] ${playerName} oyuncusuna ${roleName} rolü verildi!","color":"${color}","bold":true}`;
await rcon.send(tellrawCommand);
```

### Veri Yapısı

**data/player-roles.json:**
```json
{
  "SwxOgx": {
    "roleId": "vip",
    "roleName": "VIP",
    "assignedAt": "2024-12-21T10:30:00.000Z"
  },
  "Player2": {
    "roleId": "moderator",
    "roleName": "Moderator",
    "assignedAt": "2024-12-21T11:00:00.000Z"
  }
}
```

### Güvenlik

- Sadece `admin` ve `moderator` rolleri rol atayabilir
- Firebase token doğrulaması gerekli
- Whitelist kontrolü aktif

## Gelecek Özellikler

### 🚧 Planlanıyor

1. **WebSocket/SSE Entegrasyonu**
   - Panel ↔ Minecraft çift yönlü iletişim
   - Minecraft'tan panele gerçek zamanlı event'ler
   - Chat mesajlarını panelde gösterme

2. **Gelişmiş İzin Sistemi**
   - Minecraft plugin entegrasyonu (LuckPerms, PermissionsEx)
   - İzinleri Minecraft'a otomatik uygulama
   - Grup ve parent rol desteği

3. **Rol Geçmişi**
   - Kim, kime, ne zaman rol verdi?
   - Rol değişiklik logları
   - Audit trail

4. **Toplu İşlemler**
   - Birden fazla oyuncuya aynı anda rol atama
   - Rol şablonları
   - Import/Export

## Sorun Giderme

### Minecraft'ta Bildirim Görünmüyor

1. RCON bağlantısını kontrol et:
   ```bash
   telnet localhost 25575
   ```

2. `server.properties` dosyasında RCON ayarlarını kontrol et:
   ```properties
   enable-rcon=true
   rcon.port=25575
   rcon.password=SwxOgx2024Rcon!
   ```

3. Sunucu loglarını kontrol et:
   ```bash
   pm2 logs minecraft
   ```

### Roller Kaydedilmiyor

1. `data/` klasörünün yazma izinlerini kontrol et:
   ```bash
   ls -la data/
   chmod 755 data/
   ```

2. Backend loglarını kontrol et:
   ```bash
   pm2 logs server
   ```

## Dosya Yapısı

```
.
├── server.js                          # Backend API (rol endpoints)
├── public/
│   ├── scripts/
│   │   └── dashboard.js              # Frontend rol yönetimi
│   └── middleware/
│       └── auth.js                   # Yetkilendirme
├── data/
│   └── player-roles.json             # Rol veritabanı
└── docs/
    └── ROL_SISTEMI.md                # Bu dosya
```

## Katkıda Bulunma

Yeni özellik önerileri ve bug raporları için GitHub Issues kullanın.

---

**Son Güncelleme:** 21 Aralık 2024
**Versiyon:** 1.0.0
