// Photo manager to allow Shishir's real photograph to be loaded from public/assets/
// or uploaded via the interface and shared across Navbar and HeroSection seamlessly.

const STORAGE_KEY = 'shishir_real_profile_photo';
const EVENT_NAME = 'shishir_photo_updated';

const SCHOOL_LOGO_KEY = 'shishir_school_logo_data';
const SCHOOL_LOGO_EVENT = 'shishir_school_logo_updated';

// Possible fallback paths if the user placed an image in the project
export const DEFAULT_PHOTO_PATHS = [
  '/assets/shishir-photo.jpg',
  '/assets/profile.jpg',
  '/shishir-photo.jpg',
  '/profile.jpg',
];

export function getStoredProfilePhoto(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function saveStoredProfilePhoto(dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dataUrl }));
  } catch (err) {
    console.error('Failed to save profile photo to localStorage', err);
  }
}

export function subscribeProfilePhoto(callback: (photoUrl: string | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<string>;
    callback(customEvent.detail || null);
  };

  window.addEventListener(EVENT_NAME, handleUpdate);
  return () => window.removeEventListener(EVENT_NAME, handleUpdate);
}

// ---------------------------------------------------------------------------
// SCHOOL LOGO MANAGER (ONLY ACCESSIBLE VIA AUTHENTICATED OWNER SEAT)
// ---------------------------------------------------------------------------

export function getStoredSchoolLogo(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SCHOOL_LOGO_KEY);
}

export function saveStoredSchoolLogo(dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHOOL_LOGO_KEY, dataUrl);
    window.dispatchEvent(new CustomEvent(SCHOOL_LOGO_EVENT, { detail: dataUrl }));
  } catch (err) {
    console.error('Failed to save school logo', err);
  }
}

export function removeStoredSchoolLogo(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SCHOOL_LOGO_KEY);
    window.dispatchEvent(new CustomEvent(SCHOOL_LOGO_EVENT, { detail: null }));
  } catch (err) {
    console.error('Failed to remove school logo', err);
  }
}

export function subscribeSchoolLogo(callback: (logoUrl: string | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<string | null>;
    callback(customEvent.detail || null);
  };

  window.addEventListener(SCHOOL_LOGO_EVENT, handleUpdate);
  return () => window.removeEventListener(SCHOOL_LOGO_EVENT, handleUpdate);
}

