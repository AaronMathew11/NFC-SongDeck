// Production configuration to ensure correct API URLs are used
const config = {
  API_BASE_URL: 'https://api-m2ugc4x7ma-uc.a.run.app/api',
  GOOGLE_CLIENT_ID: '766869568873-mcprcl4se790vf5tueeigo30em04va64.apps.googleusercontent.com',
  VAPID_KEY: 'BO10PIRfD-16y-bMkdyqHHtWNH8BR_j30zoM0mFYrD9v6mtwS3n-ZJv2lHeitVP42KCk67HWOEo-8F6kQY-sKuQ'
};

// Helper function to get config values with fallbacks
export const getConfig = (key) => {
  // First try environment variables (will work if Netlify env vars are set)
  const envValue = process.env[`REACT_APP_${key}`];
  if (envValue) {
    return envValue;
  }
  
  // Fall back to production config
  return config[key];
};

export default config;