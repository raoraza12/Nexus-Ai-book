export const getApiBaseUrl = () => {
  // Check if we are in local development environment
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    return 'http://127.0.0.1:8000';
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  return 'https://nexus-ai-api.vercel.app'; // Default production fallback
};
