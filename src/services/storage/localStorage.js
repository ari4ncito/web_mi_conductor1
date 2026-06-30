const isBrowser = typeof window !== 'undefined';

export function getStorageItem(key, fallback = null) {
  if (!isBrowser) return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    console.warn(`No se pudo leer ${key}:`, error);
    return fallback;
  }
}

export function setStorageItem(key, value) {
  if (!isBrowser) return value;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.warn(`No se pudo guardar ${key}:`, error);
    return value;
  }
}

export function removeStorageItem(key) {
  if (!isBrowser) return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`No se pudo eliminar ${key}:`, error);
  }
}
