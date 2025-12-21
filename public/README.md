# 🎨 Web Panel - Public Folder Structure

## 📁 Folder Organization

```
public/
├── middleware/          # Backend authentication
│   └── auth.js         # Firebase auth + whitelist (UID verification)
│
├── assets/             # Static assets
│   └── favicon.ico     # Site icon
│
├── styles/             # CSS files
│   ├── login.css       # Login page styles
│   ├── dashboard.css   # Dashboard styles (purple theme)
│   └── styles.css      # Legacy panel styles
│
├── scripts/            # JavaScript files
│   ├── auth.js         # Firebase authentication logic
│   ├── dashboard.js    # Dashboard functionality (role manager, player heads)
│   └── app.js          # Legacy panel functionality
│
└── pages/              # HTML pages
    ├── login.html      # 🔐 Login page (Google OAuth)
    ├── checking.html   # ⏳ Verification page
    ├── access-denied.html # 🚫 Access denied page
    ├── dashboard.html  # 🎮 Main dashboard (NEW - purple theme)
    ├── index.html      # 📊 Legacy panel
    ├── admin.html      # 👑 Admin panel (legacy)
    └── test.html       # 🧪 Test page
```

## 🔗 Page References & Flow

### Authentication Flow
```
login.html → checking.html → dashboard.html
     ↓
access-denied.html (if not authorized)
```

### Page Details

#### 🔐 `login.html`
- **Purpose:** Google OAuth login
- **CSS:** `login.css`
- **JS:** `auth.js`
- **Features:**
  - Google Sign-In button
  - Glassmorphism design
  - Firebase authentication
  - Whitelist check
- **Redirects to:** `checking.html` or `access-denied.html`

#### ⏳ `checking.html`
- **Purpose:** Verification animation
- **CSS:** Inline styles
- **JS:** Inline script
- **Features:**
  - 3-stage verification animation
  - Token check
  - Role verification
  - Auto-redirect (1.5s)
- **Redirects to:** `dashboard.html`

#### 🚫 `access-denied.html`
- **Purpose:** Unauthorized access page
- **CSS:** Inline styles
- **JS:** Inline script
- **Features:**
  - Shows user email
  - Shows user UID
  - Red theme
  - Auto-redirect to login (10s)
- **Data:** Uses localStorage

#### 🎮 `dashboard.html` (NEW - Main Panel)
- **Purpose:** Modern dashboard with sidebar navigation
- **CSS:** `dashboard.css`
- **JS:** `dashboard.js`
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

#### 📊 `index.html` (Legacy Panel)
- **Purpose:** Old dashboard
- **CSS:** `styles.css`
- **JS:** `app.js`
- **Features:**
  - Server status
  - Player list
  - Console
  - Logs
  - Charts
- **Status:** Still functional, kept for backup

#### 👑 `admin.html` (Legacy)
- **Purpose:** Old admin panel
- **Status:** Legacy, not actively used

#### 🧪 `test.html`
- **Purpose:** Testing page
- **Status:** Development only

## 🎨 CSS Files

### `login.css`
- Login page styles
- Glassmorphism effects
- Google button styling
- Responsive design

### `dashboard.css`
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

### `styles.css`
- Legacy panel styles
- Blue theme
- Old card designs

## 📜 JavaScript Files

### `auth.js`
- **Purpose:** Firebase authentication
- **Features:**
  - Firebase SDK initialization
  - Google Sign-In
  - Whitelist check (`AUTHORIZED_UIDS`)
  - Token management
  - User role fetching
- **Whitelist:** `P2xHD09hwFaXf6Ci2RE4zlZYYnc2`
- **Storage:** localStorage (authToken, userEmail, userName, userRole, userUID)

### `dashboard.js`
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

### `app.js`
- Legacy panel functionality
- Old API calls
- Chart.js integration

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
2. Edit HTML in `pages/` (or root for now)
3. Edit CSS in `styles/` (or root for now)
4. Edit JS in `scripts/` (or root for now)
5. Middleware stays in `middleware/`

### For Production (VPS)
1. `git pull origin main`
2. Ensure `middleware/auth.js` exists
3. `pm2 restart server`
4. Access: `http://your-ip:3000/login.html`

## 🚀 Quick Start

### Login Flow
1. Go to `/login.html`
2. Click "Sign in with Google"
3. Authenticate with Google
4. If authorized → `/checking.html` → `/dashboard.html`
5. If not authorized → `/access-denied.html`

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
Edit `auth.js` and `middleware/auth.js`:
```javascript
const AUTHORIZED_UIDS = [
    "P2xHD09hwFaXf6Ci2RE4zlZYYnc2", // Admin
    "YOUR_NEW_UID_HERE" // New user
];
```

### Change Theme Colors
Edit `dashboard.css`:
```css
:root {
    --primary: #8b5cf6;  /* Purple */
    --secondary: #ec4899; /* Pink */
}
```

### Add New Page
1. Create HTML in `public/`
2. Add nav item in `dashboard.html`
3. Add content function in `dashboard.js`
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
