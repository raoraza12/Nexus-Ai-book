export const getApiBaseUrl = () => {
  // Check if we are in local development environment
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    return 'http://127.0.0.1:8000';
  }

  // Use Next.js server-side proxy route – bypasses CORS completely, works on all browsers
  return '/api/proxy';
};
