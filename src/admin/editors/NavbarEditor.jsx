import React, { useState, useEffect } from 'react';

const NavbarEditor = ({ data, onChange }) => {
  // Defensive: always fall back to empty array if data or navbar is missing
  const [items, setItems] = useState((data?.navbar?.items) || []);

  // Keep in sync if parent data changes
  useEffect(() => {
    setItems(data?.navbar?.items || []);
  }, [data?.navbar?.items]);

  const update = (newItems) => {
    setItems(newItems);
    onChange({ ...data, navbar: { ...(data?.navbar || {}), items: newItems } });
  };

  const addItem = () => {
    const newItem = { id: `n${Date.now()}`, label: 'New Link', target: 'section-id' };
    update([...items, newItem]);
  };

  const removeItem = (id) => update(items.filter(i => i.id !== id));

  const editItem = (id, field, value) => {
    update(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const moveItem = (idx, dir) => {
    const next = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    update(next);
  };

  // Sections in the site so admin knows valid targets
  const KNOWN_TARGETS = [
    { target: 'about',    label: 'About Us'  },
    { target: 'category', label: 'Category'  },
    { target: 'products', label: 'Products'  },
    { target: 'blogs',    label: 'Blogs'     },
    { target: 'footer',   label: 'Footer'    },
    { target: 'socials',  label: 'Socials'   },
  ];

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Navigation Items</div>
            <div className="adm-card-subtitle">Add, rename, or reorder navbar links. <strong>Target</strong> must match the section's HTML id on the page.</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>
            + Add Link
          </button>
        </div>

        <div className="adm-list">
          {items.map((item, idx) => (
            <div key={item.id} className="adm-list-item">
              {/* Up/down reorder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button
                  type="button"
                  className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon"
                  onClick={() => moveItem(idx, -1)}
                  disabled={idx === 0}
                  title="Move up"
                  style={{ padding: '2px 6px' }}
                >▲</button>
                <button
                  type="button"
                  className="adm-btn adm-btn-ghost adm-btn-sm adm-btn-icon"
                  onClick={() => moveItem(idx, 1)}
                  disabled={idx === items.length - 1}
                  title="Move down"
                  style={{ padding: '2px 6px' }}
                >▼</button>
              </div>

              <div className="adm-list-item-body">
                <div className="adm-row">
                  <div className="adm-field">
                    <label className="adm-label">Label (display text)</label>
                    <input
                      className="adm-input"
                      value={item.label}
                      onChange={e => editItem(item.id, 'label', e.target.value)}
                      placeholder="e.g. About us"
                    />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Section ID (scroll target)</label>
                    <input
                      className="adm-input"
                      list={`targets-${item.id}`}
                      value={item.target}
                      onChange={e => editItem(item.id, 'target', e.target.value)}
                      placeholder="e.g. about"
                    />
                    <datalist id={`targets-${item.id}`}>
                      {KNOWN_TARGETS.map(t => (
                        <option key={t.target} value={t.target}>{t.label}</option>
                      ))}
                    </datalist>
                    <span style={{ fontSize: 11, color: 'var(--a-muted)', marginTop: 3, display: 'block' }}>
                      Suggestions: {KNOWN_TARGETS.map(t => t.target).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="adm-list-item-actions">
                <button
                  className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon"
                  onClick={() => removeItem(item.id)}
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="adm-section-gap" />
        <button className="adm-add-strip" onClick={addItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add navigation link
        </button>
      </div>

      {/* Preview */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Preview</div>
            <div className="adm-card-subtitle">How the navbar links look</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '12px 0' }}>
          {items.map(i => (
            <span key={i.id} style={{
              padding: '6px 14px', borderRadius: 20,
              background: '#1F4A44', color: 'white',
              fontSize: 13, fontWeight: 600,
            }}>
              {i.label || '(empty)'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarEditor;