import React, { useState, useEffect } from 'react';
import ImageUploader from '../ImageUploader';

const Sec = ({ title, collapsible, children }) => {
  const [open, setOpen] = useState(!collapsible);
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        onClick={() => collapsible && setOpen(o => !o)}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.07em', color: 'var(--a-muted)',
          paddingBottom: 8, marginBottom: open ? 14 : 0,
          borderBottom: '1px solid var(--a-border)',
          cursor: collapsible ? 'pointer' : 'default',
        }}
      >
        {title}
        {collapsible && <span style={{ fontSize: 16, lineHeight: 1 }}>{open ? '▾' : '▸'}</span>}
      </div>
      {open && children}
    </div>
  );
};

const Card = ({ children, style }) => (
  <div style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: 8, padding: '16px 18px', marginBottom: 12, ...style }}>
    {children}
  </div>
);

const Lbl = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--a-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
);

// Dynamic import of ALL react-icons
const iconModules = {
  ai: () => import('react-icons/ai'),
  bi: () => import('react-icons/bi'),
  bs: () => import('react-icons/bs'),
  cg: () => import('react-icons/cg'),
  di: () => import('react-icons/di'),
  fa: () => import('react-icons/fa'),
  fi: () => import('react-icons/fi'),
  gi: () => import('react-icons/gi'),
  go: () => import('react-icons/go'),
  gr: () => import('react-icons/gr'),
  hi: () => import('react-icons/hi'),
  hi2: () => import('react-icons/hi2'),
  im: () => import('react-icons/im'),
  io: () => import('react-icons/io'),
  io5: () => import('react-icons/io5'),
  lia: () => import('react-icons/lia'),
  lib: () => import('react-icons/lib'),
  lu: () => import('react-icons/lu'),
  md: () => import('react-icons/md'),
  pi: () => import('react-icons/pi'),
  ri: () => import('react-icons/ri'),
  rx: () => import('react-icons/rx'),
  si: () => import('react-icons/si'),
  sl: () => import('react-icons/sl'),
  tb: () => import('react-icons/tb'),
  ti: () => import('react-icons/ti'),
  tfi: () => import('react-icons/tfi'),
  vsc: () => import('react-icons/vsc'),
  wi: () => import('react-icons/wi'),
};

// Function to convert icon to SVG file
const iconToSVGFile = (iconValue, svgPath) => {
  const fileName = `${iconValue.replace(/\./g, '_')}.svg`;
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F4A44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="${svgPath}"/>
</svg>`;
  
  return new File([svgContent], fileName, { type: 'image/svg+xml' });
};

// SVG path mapping (you can add more paths as needed)
const getSvgPath = (iconValue) => {
  const pathMap = {
    'bs.BsBookmarkDash': 'M4 2a2 2 0 0 0-2 2v14l6-3 6 3V4a2 2 0 0 0-2-2H4zm0 2h8v12l-4-2-4 2V4zm5 3v2h-2v2h2v2h2V9h2V7h-2V5h-2z',
    'bs.BsBookmark': 'M4 2a2 2 0 0 0-2 2v14l6-3 6 3V4a2 2 0 0 0-2-2H4zm0 2h8v12l-4-2-4 2V4z',
    'bs.BsBookmarkPlus': 'M4 2a2 2 0 0 0-2 2v14l6-3 6 3V4a2 2 0 0 0-2-2H4zm0 2h8v12l-4-2-4 2V4zm5 3v2h2v2h-2v2H9V9H7V7h2V5h2z',
    'md.MdHome': 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    'md.MdShoppingCart': 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
    'md.MdPerson': 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    'md.MdSettings': 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.33-.02-.64-.06-.94l2.02-1.58c.18-.14.23-.38.12-.56l-1.89-3.28c-.12-.19-.36-.26-.56-.18l-2.38.96c-.5-.38-1.06-.68-1.66-.88L14.45 3.5c-.04-.2-.2-.34-.4-.34h-3.78c-.2 0-.36.14-.4.34l-.3 2.52c-.6.2-1.16.5-1.66.88l-2.38-.96c-.2-.08-.44-.01-.56.18l-1.89 3.28c-.12.19-.07.42.12.56l2.02 1.58c-.04.3-.06.61-.06.94 0 .33.02.64.06.94l-2.02 1.58c-.18.14-.23.38-.12.56l1.89 3.28c.12.19.36.26.56.18l2.38-.96c.5.38 1.06.68 1.66.88l.3 2.52c.04.2.2.34.4.34h3.78c.2 0 .36-.14.4-.34l.3-2.52c.6-.2 1.16-.5 1.66-.88l2.38.96c.2.08.44.01.56-.18l1.89-3.28c.12-.19.07-.42-.12-.56l-2.02-1.58zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
    'fa.FaHeart': 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  };
  
  return pathMap[iconValue] || 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5';
};

const ReactIconPicker = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allIcons, setAllIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(200);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  
  // Load ALL icons dynamically
  useEffect(() => {
    const loadAllIcons = async () => {
      setLoading(true);
      const icons = [];
      
      for (const [prefix, importFn] of Object.entries(iconModules)) {
        try {
          const module = await importFn();
          Object.keys(module).forEach(key => {
            if (key !== 'default' && typeof module[key] === 'function') {
              icons.push({
                name: key,
                component: module[key],
                value: `${prefix}.${key}`,
                searchKey: `${key} ${prefix}`.toLowerCase()
              });
            }
          });
        } catch (err) {
          console.error(`Failed to load ${prefix}:`, err);
        }
      }
      
      setAllIcons(icons);
      setLoading(false);
    };
    
    loadAllIcons();
  }, []);
  
  const filteredIcons = allIcons.filter(icon =>
    icon.searchKey.includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayedIcons = filteredIcons.slice(0, visibleCount);
  
  // Find current selected icon component
  let CurrentIcon = null;
  if (value && !value.startsWith('http') && !value.startsWith('/assets')) {
    const matchingIcon = allIcons.find(icon => icon.value === value);
    if (matchingIcon) {
      CurrentIcon = matchingIcon.component;
    }
  }
  
  // Handle icon selection
  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
    setShowUploader(true);
  };
  
  // Handle the upload from ImageUploader
  const handleUploadComplete = (uploadedUrl) => {
    onChange(uploadedUrl);
    setSelectedIcon(null);
    setShowUploader(false);
  };
  
  const handleCancel = () => {
    setSelectedIcon(null);
    setShowUploader(false);
  };
  
  return (
    <div style={{ marginTop: 16, borderTop: '1px solid var(--a-border)', paddingTop: 16 }}>
      <Lbl>OR Choose from React Icons Library ({allIcons.length.toLocaleString()} icons)</Lbl>
      
      {/* Current selected icon display */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16,
        marginBottom: 16,
        padding: 12,
        background: 'var(--a-surface)',
        border: '1px solid var(--a-border)',
        borderRadius: 8,
      }}>
        <div style={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          borderRadius: 8,
        }}>
          {CurrentIcon ? (
            <CurrentIcon style={{ fontSize: 48, color: '#1F4A44' }} />
          ) : value && (value.startsWith('http') || value.startsWith('/assets')) ? (
            <img src={value} alt="icon" style={{ width: 48, height: 48 }} />
          ) : (
            <span style={{ fontSize: 48, color: '#1F4A44' }}>🎨</span>
          )}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1F4A44' }}>
            {value ? (value.startsWith('http') || value.startsWith('/assets') ? 'Custom Icon' : value.split('.')[1]) : 'No icon selected'}
          </div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            Click any icon below to select, then upload to GitHub
          </div>
        </div>
      </div>
      
      {/* Uploader Section - shows when icon is selected */}
      {showUploader && selectedIcon && (
        <div style={{ 
          marginBottom: 16, 
          padding: 16,
          background: '#eff6ff',
          border: '2px solid #3b82f6',
          borderRadius: 12,
          animation: 'slideDown 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: 8,
              border: '1px solid #93c5fd',
            }}>
              <selectedIcon.component style={{ fontSize: 32, color: '#1F4A44' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e40af' }}>
                {selectedIcon.name}
              </div>
              <div style={{ fontSize: 11, color: '#3b82f6' }}>
                File: {selectedIcon.value.replace(/\./g, '_')}.svg
              </div>
            </div>
            <button
              onClick={handleCancel}
              style={{
                marginLeft: 'auto',
                padding: '4px 12px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Cancel
            </button>
          </div>
          
          {/* Use your existing ImageUploader component */}
          <ImageUploader
            label="Upload Icon to GitHub"
            value=""
            folder="svg/category"
            onChange={handleUploadComplete}
          />
          
          <div style={{ 
            marginTop: 12, 
            fontSize: 11, 
            color: '#6b7280',
            padding: 8,
            background: '#f9fafb',
            borderRadius: 6,
          }}>
            💡 Tip: Click "Choose file" above and select the SVG file you want to upload.
            The file will be automatically uploaded to GitHub and the icon will be updated.
          </div>
        </div>
      )}
      
      {/* Search input */}
      <input
        type="text"
        placeholder={`Search ${allIcons.length.toLocaleString()} icons...`}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setVisibleCount(200);
        }}
        style={{
          width: '100%',
          padding: '10px 12px',
          marginBottom: 12,
          border: '1px solid var(--a-border)',
          borderRadius: 6,
          fontSize: 13,
          boxSizing: 'border-box',
        }}
      />
      
      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          Loading {Object.keys(iconModules).length} icon packs...
        </div>
      )}
      
      {/* Icons grid */}
      {!loading && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            gap: 6,
            maxHeight: 360,
            overflowY: 'auto',
            padding: '8px',
            border: '1px solid var(--a-border)',
            borderRadius: 8,
            background: 'var(--a-surface)',
          }}>
            {displayedIcons.map((icon, idx) => {
              const IconComponent = icon.component;
              const isSelected = selectedIcon?.value === icon.value;
              return (
                <div
                  key={`${icon.value}-${idx}`}
                  onClick={() => handleIconClick(icon)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 4px',
                    cursor: 'pointer',
                    borderRadius: 6,
                    background: isSelected ? '#e0e7ff' : 'transparent',
                    border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <IconComponent style={{ fontSize: 28, color: '#1F4A44' }} />
                  <span style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', wordBreak: 'break-word' }}>
                    {icon.name.substring(0, 12)}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Load more button */}
          {visibleCount < filteredIcons.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 200)}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '8px',
                background: 'transparent',
                border: '1px solid var(--a-border)',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                color: '#1F4A44'
              }}
            >
              Load more icons ({filteredIcons.length - visibleCount} remaining)
            </button>
          )}
          
          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
            Showing {displayedIcons.length} of {filteredIcons.length} icons
          </div>
        </>
      )}
      
      {!loading && filteredIcons.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          No icons found
        </div>
      )}
      
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

/* ── CategoryEditor ──────────────────────────────────────────────── */
const CategoryEditor = ({ data, onChange }) => {
  const cat   = data.category || {};
  const title = cat.sectionTitle || {};
  const cats  = cat.categories  || [];

  const upd  = (patch) => onChange({ ...data, category: { ...cat, ...patch } });
  const setT = (lang, val) => upd({ sectionTitle: { ...title, [lang]: val } });

  const updateCat = (idx, patch) =>
    upd({ categories: cats.map((c, i) => i !== idx ? c : { ...c, ...patch }) });

  const updateLang = (idx, field, lang, val) =>
    upd({
      categories: cats.map((c, i) =>
        i !== idx ? c : { ...c, [field]: { ...(c[field] || {}), [lang]: val } }
      ),
    });

  const addCat = () => upd({
    categories: [...cats, {
      id: Date.now(),
      icon: '',
      name: { en: 'New Category', az: 'Yeni Kateqoriya' },
      description: { en: '', az: '' },
    }],
  });

  const delCat = (idx) => upd({ categories: cats.filter((_, i) => i !== idx) });

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Section title */}
      <Sec title="Section Title" collapsible>
        <Grid2>
          <div>
            <Lbl>🇬🇧 EN</Lbl>
            <input 
              className="adm-input" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={title.en || ''} 
              onChange={e => setT('en', e.target.value)} 
            />
          </div>
          <div>
            <Lbl>🇦🇿 AZ</Lbl>
            <input 
              className="adm-input" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={title.az || ''} 
              onChange={e => setT('az', e.target.value)} 
            />
          </div>
        </Grid2>
      </Sec>

      {/* Categories */}
      <Sec title={`Categories (${cats.length})`} collapsible>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
          {cats.map((c, idx) => (
            <Card key={c.id ?? idx}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {c.name?.en || `Category ${idx + 1}`}
                </span>
                <button
                  type="button" 
                  onClick={() => delCat(idx)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer', 
                    fontSize: 20, 
                    lineHeight: 1,
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >✕</button>
              </div>

              {/* Original SVG Uploader */}
              <ImageUploader
                label="Category Icon (SVG)"
                value={c.icon}
                folder="svg/category"
                onChange={v => updateCat(idx, { icon: v })}
              />

              {/* React Icon Picker - uses your existing ImageUploader */}
              <ReactIconPicker
                value={c.icon}
                onChange={(newIconUrl) => updateCat(idx, { icon: newIconUrl })}
              />

              {/* Name */}
              <div style={{ marginBottom: 12 }}>
                <Lbl>Name</Lbl>
                <Grid2>
                  <div>
                    <Lbl>🇬🇧 EN</Lbl>
                    <input 
                      className="adm-input" 
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      value={c.name?.en || ''} 
                      onChange={e => updateLang(idx, 'name', 'en', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Lbl>🇦🇿 AZ</Lbl>
                    <input 
                      className="adm-input" 
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      value={c.name?.az || ''} 
                      onChange={e => updateLang(idx, 'name', 'az', e.target.value)} 
                    />
                  </div>
                </Grid2>
              </div>

              {/* Description */}
              <div>
                <Lbl>Description</Lbl>
                <Grid2>
                  <div>
                    <Lbl>🇬🇧 EN</Lbl>
                    <textarea 
                      className="adm-input" 
                      rows={2} 
                      style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }} 
                      value={c.description?.en || ''} 
                      onChange={e => updateLang(idx, 'description', 'en', e.target.value)} 
                    />
                  </div>
                  <div>
                    <Lbl>🇦🇿 AZ</Lbl>
                    <textarea 
                      className="adm-input" 
                      rows={2} 
                      style={{ resize: 'vertical', width: '100%', boxSizing: 'border-box' }} 
                      value={c.description?.az || ''} 
                      onChange={e => updateLang(idx, 'description', 'az', e.target.value)} 
                    />
                  </div>
                </Grid2>
              </div>
            </Card>
          ))}
        </div>

        <button 
          type="button" 
          className="adm-btn adm-btn-ghost adm-btn-sm" 
          onClick={addCat}
          style={{ marginTop: 8 }}
        >
          + Add category
        </button>
      </Sec>
    </div>
  );
};

export default CategoryEditor;
