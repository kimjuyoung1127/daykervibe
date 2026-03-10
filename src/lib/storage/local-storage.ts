function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getItem<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silent fail
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

export function hasItem(key: string): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(key) !== null;
}
