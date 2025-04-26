export function parseUrl(url: string): URL {
  try {
    return new URL(url);
  } catch {
    return new URL('https://news.ycombinator.com');
  }
}

export function formatUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname + parsed.pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
}