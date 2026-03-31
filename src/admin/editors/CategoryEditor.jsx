import React, { useState } from 'react';
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
    <div>
      {/* Section title */}
      <Sec title="Section Title" collapsible>
        <Grid2>
          <div>
            <Lbl>🇬🇧 EN</Lbl>
            <input className="adm-input" value={title.en || ''} onChange={e => setT('en', e.target.value)} />
          </div>
          <div>
            <Lbl>🇦🇿 AZ</Lbl>
            <input className="adm-input" value={title.az || ''} onChange={e => setT('az', e.target.value)} />
          </div>
        </Grid2>
      </Sec>

      {/* Categories */}
      <Sec title={`Categories (${cats.length})`} collapsible>
        {cats.map((c, idx) => (
          <Card key={c.id ?? idx}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {c.name?.en || `Category ${idx + 1}`}
              </span>
              <button
                type="button" onClick={() => delCat(idx)}
                style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
              >✕</button>
            </div>

            {/* Icon */}
            <ImageUploader
              label="Category Icon (SVG)"
              value={c.icon}
              folder="svg/category"
              onChange={v => updateCat(idx, { icon: v })}
            />

            {/* Name */}
            <div style={{ marginBottom: 12 }}>
              <Lbl>Name</Lbl>
              <Grid2>
                <div>
                  <Lbl>🇬🇧 EN</Lbl>
                  <input className="adm-input" value={c.name?.en || ''} onChange={e => updateLang(idx, 'name', 'en', e.target.value)} />
                </div>
                <div>
                  <Lbl>🇦🇿 AZ</Lbl>
                  <input className="adm-input" value={c.name?.az || ''} onChange={e => updateLang(idx, 'name', 'az', e.target.value)} />
                </div>
              </Grid2>
            </div>

            {/* Description */}
            <div>
              <Lbl>Description</Lbl>
              <Grid2>
                <div>
                  <Lbl>🇬🇧 EN</Lbl>
                  <textarea className="adm-input" rows={2} style={{ resize: 'vertical' }} value={c.description?.en || ''} onChange={e => updateLang(idx, 'description', 'en', e.target.value)} />
                </div>
                <div>
                  <Lbl>🇦🇿 AZ</Lbl>
                  <textarea className="adm-input" rows={2} style={{ resize: 'vertical' }} value={c.description?.az || ''} onChange={e => updateLang(idx, 'description', 'az', e.target.value)} />
                </div>
              </Grid2>
            </div>
          </Card>
        ))}

        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addCat}>
          + Add category
        </button>
      </Sec>
    </div>
  );
};

export default CategoryEditor;