// Photo manager to allow Shishir's real photograph to be loaded from public/assets/
// or uploaded via the interface and shared across Navbar and HeroSection seamlessly.

const STORAGE_KEY = 'shishir_real_profile_photo';
const EVENT_NAME = 'shishir_photo_updated';

const SCHOOL_LOGO_KEY = 'shishir_school_logo_data';
const SCHOOL_LOGO_EVENT = 'shishir_school_logo_updated';

// Universal relative paths that work seamlessly on GitHub Pages (e.g. /Shishir-Pokhrel-Website/)
// as well as local preview and production root.
const baseUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : './';
const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

export const DEFAULT_PHOTO_PATHS = [
  `${prefix}assets/shishir-photo.jpg`,
  `${prefix}assets/shishir-photo.png`,
  `${prefix}assets/shishir-avatar.svg`,
  `${prefix}assets/profile.jpg`,
  './assets/shishir-photo.jpg',
  './assets/shishir-avatar.svg',
  'assets/shishir-photo.jpg',
];

export const DEFAULT_COLLEGE_LOGO_PATHS = [
  `${prefix}assets/college-logo.png`,
  `${prefix}assets/college-logo.jpg`,
  `${prefix}assets/everest-logo.svg`,
  `${prefix}assets/school-logo.png`,
  './assets/college-logo.png',
  './assets/everest-logo.svg',
  'assets/college-logo.png',
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

export function removeStoredProfilePhoto(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
  } catch (err) {
    console.error('Failed to remove profile photo', err);
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
// COLLEGE / SCHOOL LOGO MANAGER (ACCESSIBLE ACROSS ALL PAGES)
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

// Helper to trigger browser download of dataURL as a file for GitHub repository
export function downloadDataUrlFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

