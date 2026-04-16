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

/* ── Helper: darken / lighten a hex color by an amount ─────────────── */
const adjustHex = (hex, amount) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
};

/* Apply derived green shades to both root and admin CSS variables live */
const applyGreenColor = (hex) => {
  const root = document.documentElement;

  /* ── root.css variables (frontend) ── */
  root.style.setProperty('--green-color', hex);
  root.style.setProperty('--green-gradient-primary',
    `linear-gradient(180deg, ${adjustHex(hex, 30)} 0%, ${hex} 100%)`
  );

  /* ── admin.css variables (backend admin panel) ── */
  root.style.setProperty('--a-green',       hex);
  root.style.setProperty('--a-green-dark',  adjustHex(hex, -20));
  root.style.setProperty('--a-green-light', adjustHex(hex, 30));
};

/* ── NavList (lifted outside NavbarEditor to prevent remount on re-render) ── */
const NavList = ({ listKey, title, nav, onUpdate }) => {
  const list = nav[listKey] || [];

  const setLabel = (idx, lang, val) => {
    const updated = list.map((it, i) =>
      i !== idx ? it : { ...it, label: { ...it.label, [lang]: val } }
    );
    onUpdate({ [listKey]: updated });
  };

  const setField = (idx, field, val) => {
    const updated = list.map((it, i) =>
      i !== idx ? it : { ...it, [field]: val }
    );
    onUpdate({ [listKey]: updated });
  };

  const addItem = () =>
    onUpdate({
      [listKey]: [...list, { id: Date.now(), label: { en: 'New Item', az: 'Yeni Element' }, sectionId: '' }],
    });

  const delItem = (idx) =>
    onUpdate({ [listKey]: list.filter((_, i) => i !== idx) });

  return (
    <Sec title={title} collapsible>
      {list.map((item, idx) => (
        <Card key={item.id ?? idx}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 110 }}>
              <Lbl>🇬🇧 EN Label</Lbl>
              <input className="adm-input" value={item.label?.en || ''} onChange={e => setLabel(idx, 'en', e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 110 }}>
              <Lbl>🇦🇿 AZ Label</Lbl>
              <input className="adm-input" value={item.label?.az || ''} onChange={e => setLabel(idx, 'az', e.target.value)} />
            </div>
            <div style={{ flex: 1, minWidth: 90, display: 'none' }}>
              <Lbl>Section ID</Lbl>
              <input className="adm-input" value={item.sectionId || ''} onChange={e => setField(idx, 'sectionId', e.target.value)} placeholder="e.g. about" />
            </div>
            <button
              type="button" title="Delete"
              onClick={() => delItem(idx)}
              style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1, flexShrink: 0 }}
            >✕</button>
          </div>
        </Card>
      ))}
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addItem}>+ Add item</button>
    </Sec>
  );
};

/* ── NavbarEditor ───────────────────────────────────────────────────── */
const NavbarEditor = ({ data, onChange }) => {
  const nav         = data.navbar       || {};
  const logos       = nav.logos         || {};
  const icons       = nav.icons         || {};
  const themeColors = nav.themeColors   || { greenColor: '#1F4A44' };

  const upd  = (patch) => onChange({ ...data, navbar: { ...nav, ...patch } });

  /* theme colors */
  const setGreenColor = (hex) => {
    applyGreenColor(hex);
    upd({ themeColors: { ...themeColors, greenColor: hex } });
  };

  /* logos / icons */
  const setLogo = (k, v) => upd({ logos: { ...logos, [k]: v } });
  const setIcon = (k, v) => upd({ icons: { ...icons, [k]: v } });

  const iconLabel = {
    menu: 'Menu Icon', close: 'Close Icon', azFlag: 'AZ Flag', enFlag: 'EN Flag',
    autoTheme: 'Auto Theme', lightTheme: 'Light Theme', darkTheme: 'Dark Theme', bgPattern: 'BG Pattern',
  };

  const currentGreen = themeColors.greenColor || '#1F4A44';

  return (
    <div>

      {/* ── Theme Colors ── */}
      <Sec title="Theme Colors">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Color swatch + native picker */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Lbl>Green Color</Lbl>
              <div style={{ position: 'relative', width: 48, height: 48 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: currentGreen,
                  border: '2px solid var(--a-border)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                }} />
                <input
                  type="color"
                  value={currentGreen}
                  onChange={e => setGreenColor(e.target.value)}
                  style={{
                    position: 'absolute', inset: 0,
                    opacity: 0, cursor: 'pointer',
                    width: '100%', height: '100%',
                  }}
                />
              </div>
            </div>

            {/* Hex text input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Lbl>Hex Value</Lbl>
              <input
                className="adm-input"
                value={currentGreen}
                onChange={e => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setGreenColor(v);
                }}
                style={{ width: 110, fontFamily: 'monospace', letterSpacing: '0.05em' }}
                maxLength={7}
                placeholder="#1F4A44"
              />
            </div>

            {/* Live preview chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Lbl>Derived shades</Lbl>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { label: 'dark',  color: adjustHex(currentGreen, -20) },
                  { label: 'base',  color: currentGreen },
                  { label: 'light', color: adjustHex(currentGreen, 30) },
                ].map(({ label, color }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: color,
                      border: '1.5px solid var(--a-border)',
                    }} />
                    <div style={{ fontSize: 9, color: 'var(--a-muted)', marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Lbl>&nbsp;</Lbl>
              <button
                type="button"
                className="adm-btn adm-btn-ghost adm-btn-sm"
                onClick={() => setGreenColor('#1F4A44')}
                style={{ alignSelf: 'flex-start' }}
              >
                Reset default
              </button>
            </div>
          </div>

          {/* Variable reference note */}
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background: 'var(--a-bg)', borderRadius: 6,
            fontSize: 11, color: 'var(--a-muted)', lineHeight: 1.6,
            fontFamily: 'monospace',
          }}>
            Updates: <strong>--green-color</strong> · <strong>--green-gradient-primary</strong> · <strong>--a-green</strong> · <strong>--a-green-dark</strong> · <strong>--a-green-light</strong>
          </div>
        </Card>
      </Sec>

      {/* ── Logos ── */}
      <Sec title="Logos" collapsible>
        <Grid cols={2}>
          <ImageUploader label="Main Logo"  value={logos.logo}     folder="svg" onChange={v => setLogo('logo', v)} />
          <ImageUploader label="Logo Text"  value={logos.logoText} folder="svg" onChange={v => setLogo('logoText', v)} />
        </Grid>
      </Sec>

      {/* ── Icons ── */}
      <Sec title="Icons" collapsible>
        <Grid cols={2}>
          {Object.entries(icons).map(([k, v]) => (
            <ImageUploader key={k} label={iconLabel[k] || k} value={v} folder="svg" onChange={nv => setIcon(k, nv)} />
          ))}
        </Grid>
      </Sec>

      <NavList listKey="navItems"       title="Desktop Navigation Items" nav={nav} onUpdate={upd} />
      <NavList listKey="mobileNavItems" title="Mobile Navigation Items"  nav={nav} onUpdate={upd} />
    </div>
  );
};

export default NavbarEditor;