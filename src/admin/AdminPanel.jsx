import React, { useState, useEffect } from 'react';
import { saveSiteData } from '../services/githubService';

import NavbarEditor   from './editors/NavbarEditor';
import HeaderEditor   from './editors/HeaderEditor';
import AboutEditor    from './editors/AboutEditor';
import ProductsEditor from './editors/ProductsEditor';
import CategoryEditor from './editors/CategoryEditor';
import BlogsEditor    from './editors/BlogsEditor';
import FooterEditor   from './editors/FooterEditor';

import LogoSvg from '../../public/assets/svg/logo.svg';

/* ── Hex shade helper (mirrors NavbarEditor) ────────────────────── */
const adjustHex = (hex, amount) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
};

/* Apply all green-derived CSS variables to the document root */
const applyGreenVars = (hex) => {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const root = document.documentElement;
  /* root.css */
  root.style.setProperty('--green-color', hex);
  root.style.setProperty('--green-gradient-primary',
    `linear-gradient(180deg, ${adjustHex(hex, 30)} 0%, ${hex} 100%)`
  );
  /* admin.css */
  root.style.setProperty('--a-green',       hex);
  root.style.setProperty('--a-green-dark',  adjustHex(hex, -20));
  root.style.setProperty('--a-green-light', adjustHex(hex, 30));
};

/* ── icons ─────────────────────────────────────────────────────────── */
const Icon = ({ path, size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d={path} />
  </svg>
);
const ICONS = {
  navbar:   'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  header:   'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h14v2H5z',
  about:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  category: 'M12 2l-5.5 9h11L12 2zm0 3.84L14.93 10H9.07L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22 22 19.99 22 17.5 19.99 13 17.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5S16.12 15 17.5 15 20 16.12 20 17.5 18.88 20 17.5 20zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z',
  products: 'M20 4H4v2l8 5 8-5V4zM4 8.58V20h16V8.58l-8 5-8-5z',
  blogs:    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  footer:   'M20 20H4V4h16v16zM6 6v4h12V6H6zm0 6v2h12v-2H6zm0 4v2h7v-2H6z',
  logout:   'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
  external: 'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
  save:     'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z',
};

const SECTIONS = [
  { id: 'navbar',   label: 'Navbar',   icon: ICONS.navbar,   Component: NavbarEditor   },
  { id: 'header',   label: 'Header',   icon: ICONS.header,   Component: HeaderEditor   },
  { id: 'about',    label: 'About Us', icon: ICONS.about,    Component: AboutEditor    },
  { id: 'category', label: 'Category', icon: ICONS.category, Component: CategoryEditor },
  { id: 'products', label: 'Products', icon: ICONS.products, Component: ProductsEditor },
  { id: 'blogs',    label: 'Blogs',    icon: ICONS.blogs,    Component: BlogsEditor    },
  { id: 'footer',   label: 'Footer',   icon: ICONS.footer,   Component: FooterEditor   },
];

/* ── AdminPanel ─────────────────────────────────────────────────── */
const AdminPanel = ({ initialData }) => {
  const [activeSection, setActiveSection] = useState('navbar');
  const [data,    setData]    = useState(initialData);
  const [dirty,   setDirty]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [alert,   setAlert]   = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync when parent re-provides initialData and apply green color
  useEffect(() => {
    setData(initialData);
    setDirty(false);
    // Apply saved green color so admin panel UI reflects brand color
    const greenColor = initialData?.navbar?.themeColors?.greenColor;
    if (greenColor) applyGreenVars(greenColor);
  }, [initialData]);

  // Auto-dismiss alert after 4 s
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 4000);
    return () => clearTimeout(t);
  }, [alert]);

  const handleChange = (newData) => {
    setData(newData);
    setDirty(true);
    // Live-update green color while editing
    const greenColor = newData?.navbar?.themeColors?.greenColor;
    if (greenColor) applyGreenVars(greenColor);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteData(data);
      setDirty(false);
      setAlert({ type: 'success', message: '✓ Changes saved to GitHub successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: `✗ Save failed: ${err.message}` });
    }
    setSaving(false);
  };

  const handleDiscard = () => {
    if (window.confirm('Discard all unsaved changes?')) {
      setData(initialData);
      setDirty(false);
      // Restore original green on discard
      const greenColor = initialData?.navbar?.themeColors?.greenColor;
      if (greenColor) applyGreenVars(greenColor);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    window.location.href = '/';
  };

  if (!data) return null;

  const current = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="adm-root">
      {/* Mobile overlay */}
      <div
        className={`adm-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile menu toggle */}
      <button className="adm-menu-toggle" onClick={() => setSidebarOpen(o => !o)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          {sidebarOpen
            ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>}
        </svg>
      </button>

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar-header">
          <div className="adm-sidebar-logo">
            <img src={LogoSvg} alt="By Naghiyev" />
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-label">Site Sections</div>
          {SECTIONS.map(sec => (
            <div
              key={sec.id}
              className={`adm-nav-item ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(sec.id); setSidebarOpen(false); }}
            >
              <Icon path={sec.icon} />
              {sec.label}
              {dirty && activeSection === sec.id && (
                <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#F2FDFB', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <Icon path={ICONS.logout} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="adm-main">
        {/* Topbar */}
        <header className="adm-topbar">
          <h2>{current?.label}</h2>
          <div className="adm-topbar-right">
            {dirty
              ? <span className="adm-badge adm-badge-red">Unsaved changes</span>
              : <span className="adm-badge adm-badge-green">Up to date</span>}
            <a
              href="https://bynaghiyev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="adm-btn adm-btn-ghost adm-btn-sm"
            >
              <Icon path={ICONS.external} size={13} />
              View site
            </a>
          </div>
        </header>

        {/* Alert */}
        {alert && (
          <div style={{ padding: '0 28px', marginTop: 16 }}>
            <div className={`adm-alert adm-alert-${alert.type}`}>{alert.message}</div>
          </div>
        )}

        {/* Editor content */}
        <div className="adm-content">
          {current && data[current.id] !== undefined ? (
            <current.Component data={data} onChange={handleChange} />
          ) : current ? (
            <div style={{ padding: 24, color: 'var(--a-muted)' }}>
              Section data not found. Try saving defaults first.
            </div>
          ) : null}
        </div>

        {/* Save bar */}
        <div className="adm-save-bar">
          <span className="adm-save-bar-left">
            {dirty
              ? 'You have unsaved changes — remember to save to GitHub.'
              : 'All changes are saved to GitHub.'}
          </span>
          <div className="adm-save-bar-right">
            {dirty && (
              <button className="adm-btn adm-btn-ghost" onClick={handleDiscard}>
                Discard
              </button>
            )}
            <button
              className="adm-btn adm-btn-primary"
              onClick={handleSave}
              disabled={!dirty || saving}
            >
              {saving
                ? <><span className="adm-spinner" /> Saving…</>
                : <><Icon path={ICONS.save} size={15} /> Save to GitHub</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;