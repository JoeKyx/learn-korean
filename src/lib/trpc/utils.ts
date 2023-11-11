function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  return 'http://localhost:3000';
}

export function getUrl() {
  return getBaseUrl() + '/api/trpc';
}
