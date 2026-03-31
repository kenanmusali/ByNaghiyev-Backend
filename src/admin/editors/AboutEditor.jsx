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

/* ── AboutEditor ─────────────────────────────────────────────────── */
const AboutEditor = ({ data, onChange }) => {
  const abt    = data.about  || {};
  const title  = abt.sectionTitle || {};
  const images = abt.images       || [];
  const texts  = abt.texts        || { en: [], az: [] };

  const upd  = (patch) => onChange({ ...data, about: { ...abt, ...patch } });
  const setT = (lang, val) => upd({ sectionTitle: { ...title, [lang]: val } });

  /* images */
  const setImg = (idx, val) => upd({ images: images.map((im, i) => i !== idx ? im : val) });
  const addImg = ()          => upd({ images: [...images, ''] });
  const delImg = (idx)       => upd({ images: images.filter((_, i) => i !== idx) });

  /* text paragraphs */
  const setPara  = (lang, idx, val) => {
    const arr  = [...(texts[lang] || [])];
    arr[idx]   = val;
    upd({ texts: { ...texts, [lang]: arr } });
  };
  const addPara  = ()     => {
    upd({ texts: { en: [...(texts.en || []), ''], az: [...(texts.az || []), ''] } });
  };
  const delPara  = (idx)  => {
    upd({ texts: { en: (texts.en || []).filter((_, i) => i !== idx), az: (texts.az || []).filter((_, i) => i !== idx) } });
  };

  const paraCount = Math.max((texts.en || []).length, (texts.az || []).length);

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

      {/* Logo text SVG */}
      <Sec title="Logo Text SVG" collapsible>
        <ImageUploader label="Logo Text SVG" value={abt.logoTextSvg} folder="svg" onChange={v => upd({ logoTextSvg: v })} />
      </Sec>

      {/* Images */}
      <Sec title={`Images (${images.length})`} collapsible>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {images.map((src, idx) => (
            <Card key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Lbl>Image {idx + 1}</Lbl>
                <button type="button" onClick={() => delImg(idx)} style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>
              <ImageUploader value={src} folder="img/about" onChange={v => setImg(idx, v)} />
            </Card>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginTop: 4 }} onClick={addImg}>
          + Add image
        </button>
      </Sec>

      {/* Text paragraphs */}
      <Sec title={`Text Paragraphs (${paraCount})`} collapsible>
        <p style={{ fontSize: 12, color: 'var(--a-muted)', marginBottom: 12 }}>
          Paragraphs are paired — each row is the same paragraph in both languages. The first paragraph is typically the brand name prefix.
        </p>
        {Array.from({ length: paraCount }, (_, idx) => (
          <Card key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--a-muted)' }}>Paragraph {idx + 1}</span>
              <button type="button" onClick={() => delPara(idx)} style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <Grid2>
              <div>
                <Lbl>🇬🇧 EN</Lbl>
                <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} value={(texts.en || [])[idx] || ''} onChange={e => setPara('en', idx, e.target.value)} />
              </div>
              <div>
                <Lbl>🇦🇿 AZ</Lbl>
                <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} value={(texts.az || [])[idx] || ''} onChange={e => setPara('az', idx, e.target.value)} />
              </div>
            </Grid2>
          </Card>
        ))}
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addPara}>
          + Add paragraph
        </button>
      </Sec>
    </div>
  );
};

export default AboutEditor;