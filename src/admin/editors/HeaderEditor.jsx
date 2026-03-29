import React from 'react';
import ImageUploader from '../ImageUploader';

/* shared helpers */
const Sec = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--a-muted)', paddingBottom: 8, marginBottom: 14, borderBottom: '1px solid var(--a-border)' }}>
      {title}
    </div>
    {children}
  </div>
);

const Card = ({ children }) => (
  <div style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: 8, padding: '14px 16px', marginBottom: 10 }}>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
);

const Lbl = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--a-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
    {children}
  </div>
);

const BilingualField = ({ labelPrefix, enVal, azVal, onEnChange, onAzChange, multiline }) => (
  <Grid2>
    <div>
      <Lbl>🇬🇧 {labelPrefix} (EN)</Lbl>
      {multiline
        ? <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} value={enVal || ''} onChange={e => onEnChange(e.target.value)} />
        : <input className="adm-input" value={enVal || ''} onChange={e => onEnChange(e.target.value)} />}
    </div>
    <div>
      <Lbl>🇦🇿 {labelPrefix} (AZ)</Lbl>
      {multiline
        ? <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} value={azVal || ''} onChange={e => onAzChange(e.target.value)} />
        : <input className="adm-input" value={azVal || ''} onChange={e => onAzChange(e.target.value)} />}
    </div>
  </Grid2>
);

/* ── HeaderEditor ─────────────────────────────────────────────────── */
const HeaderEditor = ({ data, onChange }) => {
  const hdr   = data.header || {};
  const images = hdr.images || [];
  const txt    = hdr.headerText   || {};
  const btns   = hdr.buttonTexts  || {};

  const upd = (patch) => onChange({ ...data, header: { ...hdr, ...patch } });

  /* Images */
  const setImgField = (idx, field, val) => {
    const next = images.map((img, i) => i !== idx ? img : { ...img, [field]: val });
    upd({ images: next });
  };
  const addImg = () => upd({
    images: [...images, { id: Date.now(), src: '', alt: `Header ${images.length + 1}` }],
  });
  const delImg = (idx) => upd({ images: images.filter((_, i) => i !== idx) });

  /* Text helpers */
  const setTxt = (field, lang, val) =>
    upd({ headerText: { ...txt, [field]: { ...(txt[field] || {}), [lang]: val } } });

  const setBtn = (field, lang, val) =>
    upd({ buttonTexts: { ...btns, [field]: { ...(btns[field] || {}), [lang]: val } } });

  return (
    <div>
      {/* Slider images */}
      <Sec title={`Slider Images (${images.length})`}>
        {images.map((img, idx) => (
          <Card key={img.id ?? idx}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: 200 }}>
                <ImageUploader
                  label={`Image ${idx + 1}`}
                  value={img.src}
                  folder="img/header"
                  onChange={v => setImgField(idx, 'src', v)}
                />
              </div>
              <div style={{ flex: 1, minWidth: 130 }}>
                <Lbl>Alt Text</Lbl>
                <input className="adm-input" value={img.alt || ''} onChange={e => setImgField(idx, 'alt', e.target.value)} />
              </div>
              <button
                type="button" onClick={() => delImg(idx)} title="Remove"
                style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
              >✕</button>
            </div>
          </Card>
        ))}
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addImg}>
          + Add image
        </button>
      </Sec>

      {/* Header text */}
      <Sec title="Header Text">
        <div style={{ marginBottom: 14 }}>
          <Lbl>Subtitle</Lbl>
          <BilingualField
            labelPrefix="Subtitle"
            enVal={txt.subtitle?.en} azVal={txt.subtitle?.az}
            onEnChange={v => setTxt('subtitle', 'en', v)}
            onAzChange={v => setTxt('subtitle', 'az', v)}
          />
        </div>
        <div>
          <Lbl>Main Title</Lbl>
          <BilingualField
            labelPrefix="Title"
            enVal={txt.title?.en} azVal={txt.title?.az}
            onEnChange={v => setTxt('title', 'en', v)}
            onAzChange={v => setTxt('title', 'az', v)}
            multiline
          />
        </div>
      </Sec>

      {/* Button texts */}
      <Sec title="Button Texts">
        <div style={{ marginBottom: 14 }}>
          <Lbl>Discover Collection Button</Lbl>
          <BilingualField
            labelPrefix="Button"
            enVal={btns.discoverCollection?.en} azVal={btns.discoverCollection?.az}
            onEnChange={v => setBtn('discoverCollection', 'en', v)}
            onAzChange={v => setBtn('discoverCollection', 'az', v)}
          />
        </div>
        <div>
          <Lbl>Order Now Button</Lbl>
          <BilingualField
            labelPrefix="Button"
            enVal={btns.orderNow?.en} azVal={btns.orderNow?.az}
            onEnChange={v => setBtn('orderNow', 'en', v)}
            onAzChange={v => setBtn('orderNow', 'az', v)}
          />
        </div>
      </Sec>
    </div>
  );
};

export default HeaderEditor;