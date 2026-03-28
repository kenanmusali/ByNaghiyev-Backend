import { GITHUB_CONFIG } from '../config/github';

const BASE = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`;

// ─── The real public path your project uses ──────────────────────────────────
// Files live at:  public/assets/img/<folder>/<file>
// Served at URL:  /assets/img/<folder>/<file>
const IMG_PUBLIC_PREFIX = 'public/assets/img';
const IMG_URL_PREFIX    = '/assets/img';

// ─── READ ────────────────────────────────────────────────────────────────────
export const fetchSiteData = async () => {
  const raw = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.dataFile}?t=${Date.now()}`;
  const res = await fetch(raw);
  if (!res.ok) throw new Error(`Failed to load site data (${res.status})`);
  return res.json();
};

// ─── LIST IMAGES FROM REPO ───────────────────────────────────────────────────
let _imageCache   = null;
let _imageCacheTs = 0;
const IMAGE_CACHE_TTL = 60_000;

export const listRepoImages = async () => {
  if (_imageCache && Date.now() - _imageCacheTs < IMAGE_CACHE_TTL) return _imageCache;
  if (!GITHUB_CONFIG.token) return getStaticImageList();

  try {
    const res = await fetch(
      `${BASE}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`,
      { headers: { Authorization: `token ${GITHUB_CONFIG.token}` } }
    );
    if (!res.ok) return getStaticImageList();
    const { tree } = await res.json();

    const images = tree
      .filter(f =>
        f.type === 'blob' &&
        f.path.startsWith(IMG_PUBLIC_PREFIX + '/') &&
        /\.(png|jpe?g|gif|webp|svg)$/i.test(f.path)
      )
      .map(f => {
        const relative = f.path.replace(IMG_PUBLIC_PREFIX + '/', '');
        const parts    = relative.split('/');
        const folder   = parts.length >= 2 ? parts[0] : 'other';
        const name     = parts[parts.length - 1];
        return {
          path:     f.path,
          localUrl: `${IMG_URL_PREFIX}/${relative}`,
          folder,
          name,
        };
      });

    _imageCache   = images;
    _imageCacheTs = Date.now();
    return images;
  } catch {
    return getStaticImageList();
  }
};

export const invalidateImageCache = () => { _imageCache = null; };

const getStaticImageList = () => [
  { path: `${IMG_PUBLIC_PREFIX}/header/header1.png`, localUrl: `${IMG_URL_PREFIX}/header/header1.png`, folder: 'header', name: 'header1.png' },
  { path: `${IMG_PUBLIC_PREFIX}/header/header2.png`, localUrl: `${IMG_URL_PREFIX}/header/header2.png`, folder: 'header', name: 'header2.png' },
  { path: `${IMG_PUBLIC_PREFIX}/about/about1.png`,   localUrl: `${IMG_URL_PREFIX}/about/about1.png`,   folder: 'about',  name: 'about1.png'  },
  { path: `${IMG_PUBLIC_PREFIX}/about/about2.png`,   localUrl: `${IMG_URL_PREFIX}/about/about2.png`,   folder: 'about',  name: 'about2.png'  },
  { path: `${IMG_PUBLIC_PREFIX}/about/about3.png`,   localUrl: `${IMG_URL_PREFIX}/about/about3.png`,   folder: 'about',  name: 'about3.png'  },
  { path: `${IMG_PUBLIC_PREFIX}/product/product1.png`, localUrl: `${IMG_URL_PREFIX}/product/product1.png`, folder: 'product', name: 'product1.png' },
  { path: `${IMG_PUBLIC_PREFIX}/blogs/blogs1.png`,   localUrl: `${IMG_URL_PREFIX}/blogs/blogs1.png`,   folder: 'blogs',  name: 'blogs1.png'  },
];

// ─── UPLOAD IMAGE TO GITHUB ──────────────────────────────────────────────────
export const uploadImage = async (file, folder) => {
  if (!GITHUB_CONFIG.token) throw new Error('GitHub token is not configured.');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64   = reader.result.split(',')[1];
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const repoPath = `${IMG_PUBLIC_PREFIX}/${folder}/${filename}`;
      const serveUrl = `${IMG_URL_PREFIX}/${folder}/${filename}`;

      try {
        const putRes = await fetch(`${BASE}/contents/${repoPath}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${GITHUB_CONFIG.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Upload image: ${filename}`,
            content: base64,
            branch: GITHUB_CONFIG.branch,
          }),
        });

        if (!putRes.ok) {
          const err = await putRes.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to upload image.');
        }

        invalidateImageCache();
        resolve(serveUrl);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// ─── WRITE ───────────────────────────────────────────────────────────────────
export const saveSiteData = async (data) => {
  if (!GITHUB_CONFIG.token) throw new Error('GitHub token is not configured.');

  const metaRes = await fetch(
    `${BASE}/contents/${GITHUB_CONFIG.dataFile}?ref=${GITHUB_CONFIG.branch}`,
    { headers: { Authorization: `token ${GITHUB_CONFIG.token}` } }
  );
  if (!metaRes.ok) throw new Error('Could not read file metadata from GitHub.');
  const meta = await metaRes.json();

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  const putRes = await fetch(`${BASE}/contents/${GITHUB_CONFIG.dataFile}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `chore: update site data via admin panel [${new Date().toISOString()}]`,
      content,
      sha: meta.sha,
      branch: GITHUB_CONFIG.branch,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save to GitHub.');
  }
  return putRes.json();
};