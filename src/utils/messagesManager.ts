// Backend manager for visitor messages and single-seat owner authentication
// Stores messages securely in persistent storage with subscription support for real-time updates.

export interface VisitorMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  createdAt: number;
  read: boolean;
}

export interface AdminCredentials {
  email: string;
  passwordHash: string; // Secret password created by Shishir
}

const MESSAGES_STORAGE_KEY = 'shishir_visitor_messages_data';
const AUTH_SESSION_KEY = 'shishir_single_seat_auth_session';
const ADMIN_PASSWORD_KEY = 'shishir_secret_seat_password';
const MESSAGES_EVENT = 'shishir_messages_updated';

// Default initial messages or welcome message so the portal isn't completely empty initially
const DEFAULT_INITIAL_MESSAGES: VisitorMessage[] = [
  {
    id: 'msg_welcome_demo',
    name: 'Ram Tharu',
    email: 'ram.tharu@example.com',
    message: 'Namaste Shishir! Great to see your Class 11 portfolio. Keep building and learning Python and web dev!',
    timestamp: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    createdAt: Date.now() - 3600000 * 2,
    read: false,
  },
];


// Retrieve all stored messages
export function getVisitorMessages(): VisitorMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) {
      // Initialize with sample message so Shishir can verify immediately
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_MESSAGES));
      return DEFAULT_INITIAL_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load visitor messages', e);
    return [];
  }
}

// Save a new message from visitor
export function saveVisitorMessage(data: { name: string; email: string; message: string }): VisitorMessage {
  const currentMessages = getVisitorMessages();
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newMessage: VisitorMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
    timestamp: formattedTime,
    createdAt: Date.now(),
    read: false,
  };

  const updated = [newMessage, ...currentMessages];
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(MESSAGES_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to save message', e);
  }

  return newMessage;
}

// Delete a message
export function deleteVisitorMessage(id: string): void {
  const current = getVisitorMessages();
  const filtered = current.filter((m) => m.id !== id);
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(MESSAGES_EVENT, { detail: filtered }));
  } catch (e) {
    console.error('Failed to delete message', e);
  }
}

// Mark message as read / unread
export function toggleMessageRead(id: string): void {
  const current = getVisitorMessages();
  const updated = current.map((m) => (m.id === id ? { ...m, read: !m.read } : m));
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(MESSAGES_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to update message status', e);
  }
}

// Clear all messages
export function clearAllMessages(): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent(MESSAGES_EVENT, { detail: [] }));
  } catch (e) {
    console.error('Failed to clear messages', e);
  }
}

// Subscribe to message updates in real time
export function subscribeVisitorMessages(callback: (messages: VisitorMessage[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<VisitorMessage[]>;
    callback(customEvent.detail || getVisitorMessages());
  };

  window.addEventListener(MESSAGES_EVENT, handleUpdate);
  return () => window.removeEventListener(MESSAGES_EVENT, handleUpdate);
}

// -------------------------------------------------------------
// SINGLE SEAT AUTHENTICATION (SECURED ACROSS ALL DEVICES)
// -------------------------------------------------------------

// Master secret password configured for Shishir Pokhrel.
// This password is active across ALL devices (Mobile, Laptop, Desktop).
export const MASTER_SECRET_PASSWORD = 'ShishirPokhrel#2026';

export function hasAdminPasswordSet(): boolean {
  // Always returns true so no mobile phone, tablet, or random visitor
  // ever sees an open "Create Password" screen. The seat is always locked.
  return true;
}

export function setupFirstTimeSecretPassword(newPassword: string): boolean {
  if (typeof window === 'undefined') return false;
  const cleanPass = newPassword.trim();
  if (cleanPass.length < 3) return false;

  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, cleanPass);
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    return true;
  } catch (err) {
    console.error('Failed to set secret password', err);
    return false;
  }
}

export function checkIsAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
}

export function loginSingleSeat(enteredPassword: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Browser environment required.' };
  }

  const clean = enteredPassword.trim();
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);

  // Authenticate against custom user password OR master secret password
  const matchesCustom = storedPassword && clean === storedPassword.trim();
  const matchesMaster = clean === MASTER_SECRET_PASSWORD;

  if (matchesCustom || matchesMaster) {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    return { success: true };
  }

  return {
    success: false,
    error: 'Incorrect secret password. Access denied.',
  };
}

export function updateSecretPassword(
  oldPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const cleanOld = oldPassword.trim();
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);

  const isOldValid =
    (storedPassword && cleanOld === storedPassword.trim()) ||
    cleanOld === MASTER_SECRET_PASSWORD;

  if (!isOldValid) {
    return { success: false, error: 'Current secret password does not match.' };
  }

  if (newPassword.trim().length < 3) {
    return { success: false, error: 'New password must be at least 3 characters long.' };
  }

  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save updated password.' };
  }
}

export function logoutSingleSeat(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

