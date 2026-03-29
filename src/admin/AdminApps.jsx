// AdminApps.jsx
import React, { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';
import { fetchSiteData } from '../services/githubService';

// Import local fallback data
import navbarData   from '../data/navbar-data.json';
import headerData   from '../data/header-data.json';
import aboutData    from '../data/about-data.json';
import categoryData from '../data/category-data.json';
import productData  from '../data/product-data.json';
import blogData     from '../data/blog-data.json';
import footerData   from '../data/footer-data.json';

const LOCAL_DEFAULTS = {
  navbar:   navbarData,
  header:   headerData,
  about:    aboutData,
  category: categoryData,
  products: productData,
  blogs:    blogData,
  footer:   footerData,
};

const mergeWithDefaults = (fetched) => {
  if (!fetched || typeof fetched !== 'object') return LOCAL_DEFAULTS;

  return {
    navbar: { ...LOCAL_DEFAULTS.navbar, ...(fetched.navbar || {}) },
    header: { ...LOCAL_DEFAULTS.header, ...(fetched.header || {}) },
    about:  { ...LOCAL_DEFAULTS.about,  ...(fetched.about || {}) },
    category: { 
      ...LOCAL_DEFAULTS.category, 
      ...(fetched.category || {}),
      categories: Array.isArray(fetched.category?.categories) 
        ? fetched.category.categories 
        : LOCAL_DEFAULTS.category.categories
    },
    products: { 
      ...LOCAL_DEFAULTS.products, 
      ...(fetched.products || {}),
      products: Array.isArray(fetched.products?.products) 
        ? fetched.products.products 
        : LOCAL_DEFAULTS.products.products
    },
    blogs: { 
      ...LOCAL_DEFAULTS.blogs, 
      ...(fetched.blogs || {}),
      blogs: Array.isArray(fetched.blogs?.blogs) 
        ? fetched.blogs.blogs 
        : LOCAL_DEFAULTS.blogs.blogs
    },
    footer: { 
      ...LOCAL_DEFAULTS.footer, 
      ...(fetched.footer || {}),
      socials: Array.isArray(fetched.footer?.socials) 
        ? fetched.footer.socials 
        : LOCAL_DEFAULTS.footer.socials
    },
  };
};

const AdminApps = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { 
    loadData(); 
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const fetched = await fetchSiteData();
      console.log('Fetched data:', fetched);
      const mergedData = mergeWithDefaults(fetched);
      setData(mergedData);
    } catch (err) {
      console.error('GitHub fetch error:', err);
      // Use local defaults immediately
      setData(mergeWithDefaults(LOCAL_DEFAULTS));
      setError(
        '⚠️ Using local data. GitHub sync unavailable. ' +
        'Please check your VITE_GITHUB_TOKEN in .env file.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="adm-root" style={{ background: 'var(--a-bg)', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="adm-spinner adm-spinner-dark" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto 16px' }} />
            <div>Loading admin panel...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="adm-root" style={{ background: 'var(--a-bg)', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--a-danger)', marginBottom: 16 }}>Failed to load site data</div>
            <button onClick={loadData} className="adm-btn adm-btn-primary">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: '#fff3cd', color: '#856404',
          padding: '12px 16px', fontSize: 13,
          borderBottom: '1px solid #ffc107', textAlign: 'center',
        }}>
          ⚠️ {error}
        </div>
      )}
      <AdminPanel initialData={data} />
    </>
  );
};

export default AdminApps;