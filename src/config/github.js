// config/github.js

const requiredEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`Missing environment variable: ${key}`);
  }
  return value;
};

export const GITHUB_CONFIG = {
  owner: requiredEnv("VITE_GITHUB_OWNER"),
  repo: requiredEnv("VITE_GITHUB_REPO"),
  branch: requiredEnv("VITE_GITHUB_BRANCH") || "main",
  dataFile: requiredEnv("VITE_GITHUB_DATA_PATH") || "src/data/site-data.json",
  token: requiredEnv("VITE_GITHUB_TOKEN"), // ✅ ONLY from env, no fallback
};

export const ADMIN_CREDENTIALS = {
  email: requiredEnv("VITE_ADMIN_EMAIL"),
  password: requiredEnv("VITE_ADMIN_PASSWORD"),
};