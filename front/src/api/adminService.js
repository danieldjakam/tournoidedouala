import bcrypt from 'bcryptjs';
import { toZonedTime } from 'date-fns-tz';

// Supabase Database Schema (for reference):
// admin_users: id, email, password_hash, otp_secret, is_2fa_enabled, created_at
// audit_logs: id, admin_id, action, details, timestamp
// Timezone: Africa/Douala (UTC+1)

const TIMEZONE = 'Africa/Douala';
const ADMIN_USERS_KEY = 'admin_users';
const CURRENT_ADMIN_KEY = 'current_admin';
const ADMIN_SESSION_KEY = 'admin_session';
const AUDIT_LOGS_KEY = 'audit_logs';
const VOTES_KEY = 'votes_motm';

// Allowlist of admin emails
const ADMIN_ALLOWLIST = [
  'admin@football2026.cm',
  'superadmin@football2026.cm'
];

// Initialize default admin (password: Admin123!)
const initializeDefaultAdmin = () => {
  const admins = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
  if (admins.length === 0) {
    const admin = {
      id: '1',
      email: 'admin@football2026.cm',
      password_hash: bcrypt.hashSync('Admin123!', 10),
      otp_secret: 'MOCK_SECRET_BASE32_PLACEHOLDER', 
      is_2fa_enabled: true,
      created_at: toZonedTime(new Date(), TIMEZONE).toISOString()
    };
    admins.push(admin);
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(admins));
  }
};

initializeDefaultAdmin();

export const loginAdmin = async (email, password) => {
  // Check allowlist
  if (!ADMIN_ALLOWLIST.includes(email)) {
    return { success: false, error: 'Accès non autorisé' };
  }
  
  const admins = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
  const admin = admins.find(a => a.email === email);
  
  if (!admin) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }
  
  const isValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isValid) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }
  
  // Store session (pending OTP)
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ email, verified: false }));
  
  return { success: true, requiresOTP: admin.is_2fa_enabled };
};

export const verifyOTP = async (email, otp) => {
  const admins = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
  const admin = admins.find(a => a.email === email);
  
  if (!admin) {
    return { success: false, error: 'Session expirée' };
  }
  
  // Verify TOTP (Mock implementation for browser environment)
  const isValid = otp === '123456';
  
  if (!isValid) {
    return { success: false, error: 'Code OTP invalide (Utilisez 123456 pour le test)' };
  }
  
  // Create admin session
  const adminData = {
    id: admin.id,
    email: admin.email
  };
  
  localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(adminData));
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ email, verified: true }));
  
  // Log successful login
  logAuditAction(admin.id, 'LOGIN', { timestamp: new Date().toISOString() });
  
  return { success: true, admin: adminData };
};

export const getCurrentAdmin = () => {
  const admin = localStorage.getItem(CURRENT_ADMIN_KEY);
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  
  if (!admin || !session) return null;
  
  const sessionData = JSON.parse(session);
  if (!sessionData.verified) return null;
  
  return JSON.parse(admin);
};

export const logoutAdmin = () => {
  const admin = getCurrentAdmin();
  if (admin) {
    logAuditAction(admin.id, 'LOGOUT', { timestamp: new Date().toISOString() });
  }
  localStorage.removeItem(CURRENT_ADMIN_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const logAuditAction = (adminId, action, details) => {
  const logs = JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');
  const logEntry = {
    id: Date.now().toString(),
    admin_id: adminId,
    action,
    details: JSON.stringify(details),
    timestamp: toZonedTime(new Date(), TIMEZONE).toISOString()
  };
  logs.push(logEntry);
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
};

export const getAuditLogs = () => {
  return JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');
};

export const submitMotmVote = (userId, matchId, playerId) => {
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '[]');
  
  // Check if user already voted for this match
  const existingIndex = votes.findIndex(v => v.user_id === userId && v.match_id === matchId);
  
  const voteData = {
    id: existingIndex !== -1 ? votes[existingIndex].id : Date.now().toString(),
    user_id: userId,
    match_id: matchId,
    player_id: playerId,
    voted_at: toZonedTime(new Date(), TIMEZONE).toISOString()
  };
  
  if (existingIndex !== -1) {
    votes[existingIndex] = voteData;
  } else {
    votes.push(voteData);
  }
  
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  return voteData;
};

export const getMatchVotes = (matchId) => {
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '[]');
  return votes.filter(v => v.match_id === matchId);
};

export const getUserVote = (userId, matchId) => {
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '[]');
  return votes.find(v => v.user_id === userId && v.match_id === matchId);
};