function parseUrl(url?: string): URL | null {
  if (!url?.trim()) return null;

  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function isHttpUrl(url?: string): boolean {
  const parsed = parseUrl(url);
  return Boolean(parsed && ['http:', 'https:'].includes(parsed.protocol));
}

export function isPlaceholderContactUrl(url?: string): boolean {
  const parsed = parseUrl(url);
  if (!parsed) return true;

  const host = parsed.hostname.toLowerCase();
  const path = `${parsed.pathname}${parsed.search}`.toLowerCase();

  if (host === 'forms.gle' && /example/i.test(path)) return true;
  if (host === 'open.kakao.com' && /\/o\/example/i.test(path)) return true;
  if (host === 'example.com' || host.endsWith('.example.com')) return true;

  return false;
}

export function isValidPublicContactUrl(url?: string): boolean {
  return isHttpUrl(url) && !isPlaceholderContactUrl(url);
}
