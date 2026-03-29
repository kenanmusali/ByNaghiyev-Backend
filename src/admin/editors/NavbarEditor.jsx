import React, { useState } from 'react';
import ImageUploader from '../ImageUploader';

/* ── Layout helpers (shared pattern across all editors) ─────────────── */
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

const Card = ({ children }) => (
  <div style={{
    background: 'var(--a-surface)', border: '1px solid var(--a-border)',
    borderRadius: 8, padding: '14px 16px', marginBottom: 10,
  }}>{children}</div>
);

const Grid = ({ cols = 2, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 14 }}>
    {children}
  </div>
);

const Lbl = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--a-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
    {children}
  </div>
);

/* ── NavbarEditor ───────────────────────────────────────────────────── */
const NavbarEditor = ({ data, onChange }) => {
  const nav   = data.navbar  || {};
  const logos = nav.logos    || {};
  const icons = nav.icons    || {};

  const upd  = (patch) => onChange({ ...data, navbar: { ...nav, ...patch } });

  /* logos / icons */
  const setLogo = (k, v) => upd({ logos: { ...logos, [k]: v } });
  const setIcon = (k, v) => upd({ icons: { ...icons, [k]: v } });

  /* nav-item CRUD (works for both navItems & mobileNavItems) */
  const setLabel  = (listKey, idx, lang, val) => {
    const list    = (nav[listKey] || []).map((it, i) =>
      i !== idx ? it : { ...it, label: { ...it.label, [lang]: val } }
    );
    upd({ [listKey]: list });
  };
  const setField  = (listKey, idx, field, val) => {
    const list    = (nav[listKey] || []).map((it, i) =>
      i !== idx ? it : { ...it, [field]: val }
    );
    upd({ [listKey]: list });
  };
  const addItem   = (listKey) => upd({
    [listKey]: [...(nav[listKey] || []), { id: Date.now(), label: { en: 'New Item', az: 'Yeni Element' }, sectionId: '' }],
  });
  const delItem   = (listKey, idx) =>
    upd({ [listKey]: (nav[listKey] || []).filter((_, i) => i !== idx) });

  const NavList = ({ listKey, title }) => {
    const list = nav[listKey] || [];
    return (
      <Sec title={title}>
        {list.map((item, idx) => (
          <Card key={item.id ?? idx}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 110 }}>
                <Lbl>🇬🇧 EN Label</Lbl>
                <input className="adm-input" value={item.label?.en || ''} onChange={e => setLabel(listKey, idx, 'en', e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 110 }}>
                <Lbl>🇦🇿 AZ Label</Lbl>
                <input className="adm-input" value={item.label?.az || ''} onChange={e => setLabel(listKey, idx, 'az', e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 90 }}>
                <Lbl>Section ID</Lbl>
                <input className="adm-input" value={item.sectionId || ''} onChange={e => setField(listKey, idx, 'sectionId', e.target.value)} placeholder="e.g. about" />
              </div>
              <button
                type="button" title="Delete"
                onClick={() => delItem(listKey, idx)}
                style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1, flexShrink: 0 }}
              >✕</button>
            </div>
          </Card>
        ))}
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => addItem(listKey)}>+ Add item</button>
      </Sec>
    );
  };

  const iconLabel = { menu:'Menu Icon', close:'Close Icon', azFlag:'AZ Flag', enFlag:'EN Flag', autoTheme:'Auto Theme', lightTheme:'Light Theme', darkTheme:'Dark Theme', bgPattern:'BG Pattern' };

  return (
    <div>
      <Sec title="Logos">
        <Grid cols={2}>
          <ImageUploader label="Main Logo"   value={logos.logo}     folder="svg" onChange={v => setLogo('logo', v)} />
          <ImageUploader label="Logo Text"  value={logos.  logoText} folder="svg" onChange={v => setLogo('logoText', v)} />
        </Grid>
      </Sec>

      <Sec title="Icons" collapsible>
        <Grid cols={2}>
          {Object.entries(icons).map(([k, v]) => (
            <ImageUploader key={k} label={iconLabel[k] || k} value={v} folder="svg" onChange={nv => setIcon(k, nv)} />
          ))}
        </Grid>
      </Sec>

      <NavList listKey="navItems"       title="Desktop Navigation Items" />
      <NavList listKey="mobileNavItems" title="Mobile Navigation Items" />
    </div>
  );
};

export default NavbarEditor;