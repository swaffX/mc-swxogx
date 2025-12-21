// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBdyhYbAmYTbt8TavczHEa3nZ3vDVwiATs",
    authDomain: "swxogx-minecraft.firebaseapp.com",
    projectId: "swxogx-minecraft",
    storageBucket: "swxogx-minecraft.firebasestorage.app",
    messagingSenderId: "381702025860",
    appId: "1:381702025860:web:b67ebde82ce4444c4c48d1",
    measurementId: "G-SE2TCPZYFP"
};

// Whitelist - Sadece bu UID'lere sahip kullanıcılar erişebilir
// Firebase Console > Authentication > Users bölümünden UID'leri alabilirsiniz
const AUTHORIZED_UIDS = [
    // Buraya yetkili kullanıcıların Firebase UID'lerini ekleyin
    // Örnek: "abc123xyz456def789ghi012jkl345mno678"
];

// Firebase SDK'yı dinamik olarak yükle
let auth, googleProvider;

async function initFirebase() {
    try {
        // Firebase modüllerini import et
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Firebase'i başlat
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        
        // Google provider ayarları
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        // Auth state değişikliklerini dinle
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Kullanıcı giriş yapmış, whitelist kontrolü yap
                if (isAuthorized(user.uid)) {
                    // Yetkili kullanıcı, token al ve ana sayfaya yönlendir
                    const token = await user.getIdToken();
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
                    localStorage.setItem('userUID', user.uid);
                    
                    // Kullanıcı rolünü backend'den al
                    await fetchUserRole(token);
                    
                    showToast('Welcome, ' + user.displayName + '!', 'success');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    // Yetkisiz kullanıcı, çıkış yap ve hata göster
                    showAccessDenied();
                    await auth.signOut();
                    hideLoading();
                }
            } else {
                hideLoading();
            }
        });
        
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showToast('Firebase could not be loaded. Please refresh the page.', 'error');
        hideLoading();
    }
}

// Whitelist kontrolü
function isAuthorized(uid) {
    // Eğer whitelist boşsa, tüm kullanıcılara izin ver (ilk kurulum için)
    if (AUTHORIZED_UIDS.length === 0) {
        console.warn('⚠️  Whitelist is empty! All users will be allowed. Add UIDs to AUTHORIZED_UIDS array.');
        return true;
    }
    
    return AUTHORIZED_UIDS.includes(uid);
}

// Google Sign In
async function signInWithGoogle() {
    showLoading();
    hideAccessDenied();
    
    try {
        const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const result = await signInWithPopup(auth, googleProvider);
        
        // Whitelist kontrolü onAuthStateChanged'de yapılacak
        // Backend'e kullanıcıyı kaydet
        const token = await result.user.getIdToken();
        await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: result.user.displayName,
                email: result.user.email,
                uid: result.user.uid
            })
        });
        
    } catch (error) {
        console.error('Google sign in error:', error);
        hideLoading();
        
        if (error.code === 'auth/popup-closed-by-user') {
            showToast('Sign in cancelled', 'warning');
        } else if (error.code === 'auth/popup-blocked') {
            showToast('Popup blocked! Please allow popups for this site.', 'error');
        } else {
            showToast('Sign in failed: ' + error.message, 'error');
        }
    }
}

// Fetch User Role
async function fetchUserRole(token) {
    try {
        const res = await fetch('/api/auth/role', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        localStorage.setItem('userRole', data.role || 'user');
    } catch (error) {
        console.error('Role fetch error:', error);
        localStorage.setItem('userRole', 'user');
    }
}

// Show/Hide Loading
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Show/Hide Access Denied
function showAccessDenied() {
    document.getElementById('accessDenied').classList.add('active');
    showToast('Access denied! Your account is not authorized.', 'error');
}

function hideAccessDenied() {
    document.getElementById('accessDenied').classList.remove('active');
}

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Initialize
showLoading();
initFirebase();
