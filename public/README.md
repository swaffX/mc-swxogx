# 🎨 Web Panel - Public Folder Structure

## 📁 Organized Folder Structure

```
public/
├── middleware/          # 🔐 Backend authentication
│   └── auth.js         # Firebase Admin + UID whitelist
│
├── pages/              # 📄 HTML pages
│   ├── login.html      # 🔐 Login page (Google OAuth)
│   ├── checking.html   # ⏳ Verification page
│   ├── access-denied.html # 🚫 Access denied page
│   ├── dashboard.html  # 🎮 Main dashboard (NEW - purple theme)
│   ├── index.html      # 📊 Legacy panel
│   ├── admin.html      # 👑 Admin panel (legacy)
│   └── test.html       # 🧪 Test page
│
├── styles/             # 🎨 CSS files
│   ├── login.css       # Login page styles
│   ├── dashboard.css   # Dashboard styles (purple-pink theme)
│   └── styles.css      # Legacy panel styles
│
├── scripts/            # ⚙️ JavaScript files
│   ├── auth.js         # Firebase authentication logic
│   ├── dashboard.js    # Dashboard functionality (role manager, player heads)
│   └── app.js          # Legacy panel functionality
│
├── assets/             # 🖼️ Static assets
│   └── favicon.ico     # Site icon
│
└── README.md           # 📖 This file
```

## 🔗 Page References & Flow

### Authentication Flow
```
pages/login.html → pages/checking.html → pages/dashboard.html
     ↓
pages/access-denied.html (if not authorized)
```

### Page Details

#### 🔐 `pages/login.html`
- **Purpose:** Google OAuth login
- **CSS:** `styles/login.css`
- **JS:** `scripts/auth.js`
- **Features:**
  - Google Sign-In button
  - Glassmorphism design
  - Firebase authentication
  - Whitelist check
- **Redirects to:** `pages/checking.html` or `pages/access-denied.html`

#### ⏳ `pages/checking.html`
- **Purpose:** Verification animation
- **CSS:** Inline styles
- **JS:** Inline script
- **Features:**
  - 3-stage verification animation
  - Token check
  - Role verification
  - Auto-redirect (1.5s)
- **Redirects to:** `pages/dashboard.html`

#### 🚫 `pages/access-denied.html`
- **Purpose:** Unauthorized access page
- **CSS:** Inline styles
- **JS:** Inline script
- **Features:**
  - Shows user email
  - Shows user UID
  - Red theme
  - Auto-redirect to login (10s)
- **Data:** Uses localStorage

#### 🎮 `pages/dashboard.html` (NEW - Main Panel)
- **Purpose:** Modern dashboard with sidebar navigation
- **CSS:** `styles/dashboard.css`
- **JS:** `scripts/dashboard.js`
- **Features:**
  - Purple-pink gradient theme
  - Sidebar navigation (collapsible)
  - 6 pages: Dashboard, Server Control, Players, Console, Performance, Role Manager
  - Real-time updates
  - Player heads (Minecraft skins)
  - Role management system
  - Server control buttons
- **API Endpoints:**
  - `GET /api/status` - Server status
  - `GET /api/players` - Online players
  - `GET /api/tps` - TPS info
  - `GET /api/system-info` - System info
  - `POST /api/server/start` - Start server
  - `POST /api/server/stop` - Stop server
  - `POST /api/server/restart` - Restart server
  - `POST /api/command` - Send console command

#### 📊 `pages/index.html` (Legacy Panel)
- **Purpose:** Old dashboard
- **CSS:** `styles/styles.css`
- **JS:** `scripts/app.js`
- **Features:**
  - Server status
  - Player list
  - Console
  - Logs
  - Charts
- **Status:** Still functional, kept for backup

#### 👑 `pages/admin.html` (Legacy)
- **Purpose:** Old admin panel
- **Status:** Legacy, not actively used

#### 🧪 `pages/test.html`
- **Purpose:** Testing page
- **Status:** Development only

## 🎨 CSS Files

### `styles/login.css`
- Login page styles
- Glassmorphism effects
- Google button styling
- Responsive design

### `styles/dashboard.css`
- **Theme:** Purple-pink gradient
- **Variables:**
  - `--primary: #8b5cf6` (Purple)
  - `--secondary: #ec4899` (Pink)
  - `--gradient-primary: linear-gradient(135deg, #8b5cf6, #ec4899)`
- **Components:**
  - Sidebar (260px, collapsible to 70px)
  - Topbar (70px height)
  - Cards (glassmorphism)
  - Buttons (gradient)
  - Stats grid
  - Role cards
  - Player avatars

### `styles/styles.css`
- Legacy panel styles
- Blue theme
- Old card designs

## 📜 JavaScript Files

### `scripts/auth.js`
- **Purpose:** Firebase authentication
- **Features:**
  - Firebase SDK initialization
  - Google Sign-In
  - Whitelist check (`AUTHORIZED_UIDS`)
  - Token management
  - User role fetching
- **Whitelist:** `P2xHD09hwFaXf6Ci2RE4zlZYYnc2`
- **Storage:** localStorage (authToken, userEmail, userName, userRole, userUID)

### `scripts/dashboard.js`
- **Purpose:** Dashboard functionality
- **Features:**
  - Page navigation
  - Server status updates
  - Player list with heads
  - Role management system
  - Server control actions
  - Console commands
  - Performance charts
- **API Integration:** Fetches from Express backend
- **Role System:**
  - Default roles: Admin, Moderator, VIP, Player
  - Create/Edit/Delete roles
  - Assign roles to players
  - Permission management
- **Player Heads:** `https://mc-heads.net/avatar/{username}/{size}`

### `scripts/app.js`
- Legacy panel functionality
- Old API calls
- Chart.js integration

## 🖼️ Assets

### `assets/favicon.ico`
- Site icon (16x16, 32x32, 48x48)
- Shows in browser tab

## 🔐 Middleware

### `middleware/auth.js`
- **Purpose:** Backend authentication
- **Features:**
  - Firebase Admin SDK
  - Token verification
  - Whitelist check
  - Role management
  - User roles storage (JSON)
- **Whitelist:** `P2xHD09hwFaXf6Ci2RE4zlZYYnc2`
- **Functions:**
  - `verifyToken()` - Middleware for protected routes
  - `requireRole()` - Role-based access control
  - `isAuthorized()` - UID whitelist check
  - `setUserRole()` - Assign role to user
  - `getUserRole()` - Get user's role

## 🎯 Usage

### For Development
1. All frontend files are in `public/`
2. Edit HTML in `pages/`
3. Edit CSS in `styles/`
4. Edit JS in `scripts/`
5. Middleware stays in `middleware/`

### For Production (VPS)
1. `git pull origin main`
2. Ensure `public/middleware/auth.js` exists
3. `pm2 restart server`
4. Access: `http://your-ip:3000/pages/login.html`

## 🚀 Quick Start

### Login Flow
1. Go to `/pages/login.html`
2. Click "Sign in with Google"
3. Authenticate with Google
4. If authorized → `/pages/checking.html` → `/pages/dashboard.html`
5. If not authorized → `/pages/access-denied.html`

### Dashboard Features
- **Dashboard:** Server stats, control, online players
- **Server Control:** Start/Stop/Restart buttons
- **Players:** List with Minecraft heads
- **Console:** Send commands
- **Performance:** TPS charts
- **Role Manager:** Create roles, assign to players

## 📝 Notes

- **Theme:** Purple-pink gradient (mor-pembe)
- **Auth:** Firebase + UID whitelist
- **Player Heads:** mc-heads.net API
- **Real-time:** 5-second updates
- **Responsive:** Mobile-friendly
- **Storage:** localStorage for client, JSON for server

## 🔧 Configuration

### Add User to Whitelist
Edit `scripts/auth.js` and `middleware/auth.js`:
```javascript
const AUTHORIZED_UIDS = [
    "P2xHD09hwFaXf6Ci2RE4zlZYYnc2", // Admin
    "YOUR_NEW_UID_HERE" // New user
];
```

### Change Theme Colors
Edit `styles/dashboard.css`:
```css
:root {
    --primary: #8b5cf6;  /* Purple */
    --secondary: #ec4899; /* Pink */
}
```

### Add New Page
1. Create HTML in `public/pages/`
2. Add nav item in `pages/dashboard.html`
3. Add content function in `scripts/dashboard.js`
4. Add initialization in `loadPage()`

## 🎉 Current Status

✅ Login system working
✅ Whitelist active
✅ Dashboard functional
✅ Purple theme applied
✅ Player heads showing
✅ Role manager ready
✅ Server control working
✅ Real-time updates active

**Ready to use!** 🚀
