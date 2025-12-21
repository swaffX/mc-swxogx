// Firebase Admin SDK
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Whitelist - Sadece bu UID'lere sahip kullanıcılar erişebilir
// Firebase Console > Authentication > Users bölümünden UID'leri alabilirsiniz
const AUTHORIZED_UIDS = [
    "P2xHD09hwFaXf6Ci2RE4zlZYYnc2" // Admin
];

// Firebase Admin'i başlat
let firebaseAdmin = null;

function initFirebaseAdmin() {
    try {
        const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
        
        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = require(serviceAccountPath);
            firebaseAdmin = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized');
            
            if (AUTHORIZED_UIDS.length === 0) {
                console.warn('⚠️  WARNING: Whitelist is empty! Add UIDs to AUTHORIZED_UIDS in middleware/auth.js');
            } else {
                console.log(`✅ Whitelist active with ${AUTHORIZED_UIDS.length} authorized UID(s)`);
            }
        } else {
            console.warn('⚠️  Firebase service account not found. Auth will be disabled.');
            console.warn('   Download from: Firebase Console > Project Settings > Service Accounts');
        }
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error.message);
    }
}

initFirebaseAdmin();

// Kullanıcı rolleri (Firebase Firestore veya JSON dosyasında saklanabilir)
const userRoles = new Map();

// JSON dosyasından rolleri yükle
function loadUserRoles() {
    try {
        const rolesPath = path.join(__dirname, '..', 'data', 'user-roles.json');
        if (fs.existsSync(rolesPath)) {
            const data = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));
            Object.entries(data).forEach(([email, role]) => {
                userRoles.set(email, role);
            });
            console.log(`✅ Loaded ${userRoles.size} user roles`);
        }
    } catch (error) {
        console.error('Error loading user roles:', error);
    }
}

// Rolleri kaydet
function saveUserRoles() {
    try {
        const rolesPath = path.join(__dirname, '..', 'data', 'user-roles.json');
        const dataDir = path.dirname(rolesPath);
        
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const data = Object.fromEntries(userRoles);
        fs.writeFileSync(rolesPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving user roles:', error);
    }
}

loadUserRoles();

// Token doğrulama middleware
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token bulunamadı' });
        }
        
        const token = authHeader.split('Bearer ')[1];
        
        if (!firebaseAdmin) {
            // Firebase Admin yoksa development mode
            console.warn('⚠️  Auth disabled - Firebase Admin not initialized');
            req.user = { email: 'dev@localhost', uid: 'dev', role: 'admin' };
            return next();
        }
        
        // Token'ı doğrula
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Whitelist kontrolü
        if (!isAuthorized(decodedToken.uid)) {
            console.warn(`🚫 Unauthorized access attempt: ${decodedToken.email} (UID: ${decodedToken.uid})`);
            return res.status(403).json({ 
                error: 'Access denied',
                message: 'Your account is not authorized to access this panel'
            });
        }
        
        // Kullanıcı bilgilerini request'e ekle
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email.split('@')[0],
            role: userRoles.get(decodedToken.email) || 'admin' // Whitelist'teki kullanıcılar varsayılan admin
        };
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Geçersiz token' });
    }
}

// Whitelist kontrolü
function isAuthorized(uid) {
    // GÜVENLIK: Whitelist boşsa ASLA izin verme!
    if (AUTHORIZED_UIDS.length === 0) {
        console.error('🚫 SECURITY: Whitelist is empty! Access denied to all users.');
        console.error('📝 Add UIDs to AUTHORIZED_UIDS array in middleware/auth.js');
        return false; // Whitelist boşsa kimseye izin verme
    }
    
    const isAllowed = AUTHORIZED_UIDS.includes(uid);
    
    if (!isAllowed) {
        console.warn(`🚫 Backend: Access denied for UID: ${uid}`);
    } else {
        console.log(`✅ Backend: Access granted for UID: ${uid}`);
    }
    
    return isAllowed;
}

// Rol kontrolü middleware
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Yetkilendirme gerekli' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
        }
        
        next();
    };
}

// Kullanıcı rolü ayarla (sadece admin)
function setUserRole(email, role) {
    const validRoles = ['admin', 'moderator', 'user'];
    if (!validRoles.includes(role)) {
        throw new Error('Geçersiz rol');
    }
    
    userRoles.set(email, role);
    saveUserRoles();
}

// Kullanıcı rolü al
function getUserRole(email) {
    return userRoles.get(email) || 'user';
}

module.exports = {
    verifyToken,
    requireRole,
    setUserRole,
    getUserRole,
    userRoles,
    AUTHORIZED_UIDS // Export whitelist for admin panel
};
