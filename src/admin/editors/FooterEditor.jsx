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

const Card = ({ children }) => (
  <div style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: 8, padding: '14px 16px', marginBottom: 10 }}>
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

const BiField = ({ label, enVal, azVal, onEn, onAz }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <Lbl>{label}</Lbl>}
    <Grid2>
      <div><Lbl>🇬🇧 EN</Lbl><input className="adm-input" value={enVal || ''} onChange={e => onEn(e.target.value)} /></div>
      <div><Lbl>🇦🇿 AZ</Lbl><input className="adm-input" value={azVal || ''} onChange={e => onAz(e.target.value)} /></div>
    </Grid2>
  </div>
);

const BiArea = ({ label, enVal, azVal, onEn, onAz }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <Lbl>{label}</Lbl>}
    <Grid2>
      <div><Lbl>🇬🇧 EN</Lbl><textarea className="adm-input" rows={2} style={{ resize: 'vertical' }} value={enVal || ''} onChange={e => onEn(e.target.value)} /></div>
      <div><Lbl>🇦🇿 AZ</Lbl><textarea className="adm-input" rows={2} style={{ resize: 'vertical' }} value={azVal || ''} onChange={e => onAz(e.target.value)} /></div>
    </Grid2>
  </div>
);

/* ── FooterEditor ────────────────────────────────────────────────── */
const FooterEditor = ({ data, onChange }) => {
  const ft      = data.footer  || {};
  const socials = Array.isArray(ft.socials) ? ft.socials : [];

  const upd   = (patch) => onChange({ ...data, footer: { ...ft, ...patch } });
  const setLK = (field, lang, val) => upd({ [field]: { ...(ft[field] || {}), [lang]: val } });

  /* socials CRUD */
  const updSocial = (idx, patch) =>
    upd({ socials: socials.map((s, i) => i !== idx ? s : { ...s, ...patch }) });
  const addSocial = () =>
    upd({ socials: [...socials, { name: 'New Social', icon: '', link: 'https://' }] });
  const delSocial = (idx) =>
    upd({ socials: socials.filter((_, i) => i !== idx) });

  return (
    <div>
      {/* Logo */}
      <Sec title="Logo" collapsible>
        <ImageUploader label="Footer Logo" value={ft.logo} folder="svg" onChange={v => upd({ logo: v })} />
      </Sec>

      {/* Text fields */}
      <Sec title="Text Content" collapsible>
        <BiArea
          label="Description"
          enVal={ft.description?.en} azVal={ft.description?.az}
          onEn={v => setLK('description','en',v)} onAz={v => setLK('description','az',v)}
        />
        <BiField
          label="Socials Section Title"
          enVal={ft.socialsTitle?.en} azVal={ft.socialsTitle?.az}
          onEn={v => setLK('socialsTitle','en',v)} onAz={v => setLK('socialsTitle','az',v)}
        />
        <BiField
          label="Newsletter Title"
          enVal={ft.newsletterTitle?.en} azVal={ft.newsletterTitle?.az}
          onEn={v => setLK('newsletterTitle','en',v)} onAz={v => setLK('newsletterTitle','az',v)}
        />
        <BiField
          label="Email Placeholder"
          enVal={ft.emailPlaceholder?.en} azVal={ft.emailPlaceholder?.az}
          onEn={v => setLK('emailPlaceholder','en',v)} onAz={v => setLK('emailPlaceholder','az',v)}
        />
        <BiField
          label="Subscribe Button"
          enVal={ft.subscribeText?.en} azVal={ft.subscribeText?.az}
          onEn={v => setLK('subscribeText','en',v)} onAz={v => setLK('subscribeText','az',v)}
        />
        <BiField
          label="Copyright Text"
          enVal={ft.copyrightText?.en} azVal={ft.copyrightText?.az}
          onEn={v => setLK('copyrightText','en',v)} onAz={v => setLK('copyrightText','az',v)}
        />
        <div>
          <Lbl>Terms / Privacy Text</Lbl>
          <input className="adm-input" value={ft.termsText || ''} onChange={e => upd({ termsText: e.target.value })} />
        </div>
      </Sec>

      {/* Social links */}
      <Sec title={`Social Links (${socials.length})`} collapsible>
        {socials.map((s, idx) => (
          <Card key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{s.name || `Social ${idx + 1}`}</span>
              <button
                type="button" onClick={() => delSocial(idx)}
                style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
              >✕</button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <Lbl>Name</Lbl>
              <input className="adm-input" value={s.name || ''} onChange={e => updSocial(idx, { name: e.target.value })} />
            </div>

            <div style={{ marginBottom: 10 }}>
              <Lbl>Link URL</Lbl>
              <input className="adm-input" value={s.link || ''} onChange={e => updSocial(idx, { link: e.target.value })} placeholder="https://..." />
            </div>

            <ImageUploader
              label="Icon (SVG)"
              value={s.icon}
              folder="svg"
              onChange={v => updSocial(idx, { icon: v })}
            />
          </Card>
        ))}

        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addSocial}>
          + Add social link
        </button>
      </Sec>
    </div>
  );
};

export default FooterEditor;