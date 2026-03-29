import React, { useState } from 'react';
import ImageUploader from '../ImageUploader';

const Sec = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--a-muted)', paddingBottom: 8, marginBottom: 14, borderBottom: '1px solid var(--a-border)' }}>
      {title}
    </div>
    {children}
  </div>
);

const Card = ({ children }) => (
  <div style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: 8, padding: '16px 18px', marginBottom: 12 }}>
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

const BilingualRow = ({ label, enVal, azVal, onEn, onAz }) => (
  <div style={{ marginBottom: 12 }}>
    <Lbl>{label}</Lbl>
    <Grid2>
      <div><Lbl>🇬🇧 EN</Lbl><input className="adm-input" value={enVal || ''} onChange={e => onEn(e.target.value)} /></div>
      <div><Lbl>🇦🇿 AZ</Lbl><input className="adm-input" value={azVal || ''} onChange={e => onAz(e.target.value)} /></div>
    </Grid2>
  </div>
);

/* ── ProductsEditor ──────────────────────────────────────────────── */
const ProductsEditor = ({ data, onChange }) => {
  const prod     = data.products || {};
  const title    = prod.sectionTitle        || {};
  const products = prod.products            || [];
  const [expanded, setExpanded] = useState(null);

  const upd  = (patch) => onChange({ ...data, products: { ...prod, ...patch } });
  const setT = (lang, val) => upd({ sectionTitle: { ...title, [lang]: val } });

  const updText = (field, lang, val) =>
    upd({ [field]: { ...(prod[field] || {}), [lang]: val } });

  const updateProd = (idx, patch) =>
    upd({ products: products.map((p, i) => i !== idx ? p : { ...p, ...patch }) });

  const updateLang = (idx, field, lang, val) =>
    upd({
      products: products.map((p, i) =>
        i !== idx ? p : { ...p, [field]: { ...(p[field] || {}), [lang]: val } }
      ),
    });

  const addProduct = () => upd({
    products: [...products, {
      id: Date.now(),
      name: { en: 'New Product', az: 'Yeni Məhsul' },
      description: { en: '', az: '' },
      image: '',
      instagramIcon: prod.products?.[0]?.instagramIcon || '',
      ebayIcon:      prod.products?.[0]?.ebayIcon      || '',
    }],
  });

  const delProduct = (idx) => upd({ products: products.filter((_, i) => i !== idx) });

  return (
    <div>
      {/* Section title */}
      <Sec title="Section Title">
        <Grid2>
          <div><Lbl>🇬🇧 EN</Lbl><input className="adm-input" value={title.en || ''} onChange={e => setT('en', e.target.value)} /></div>
          <div><Lbl>🇦🇿 AZ</Lbl><input className="adm-input" value={title.az || ''} onChange={e => setT('az', e.target.value)} /></div>
        </Grid2>
      </Sec>

      {/* Button texts */}
      <Sec title="Button Texts">
        {[
          ['orderNowText',       'Order Now Button'],
          ['orderInstagramText', 'Instagram Order Button'],
          ['orderEbayText',      'eBay Order Button'],
        ].map(([key, label]) => (
          <BilingualRow
            key={key}
            label={label}
            enVal={prod[key]?.en} azVal={prod[key]?.az}
            onEn={v => updText(key, 'en', v)}
            onAz={v => updText(key, 'az', v)}
          />
        ))}
      </Sec>

      {/* Products list */}
      <Sec title={`Products (${products.length})`}>
        {products.map((p, idx) => {
          const isOpen = expanded === idx;
          return (
            <Card key={p.id ?? idx}>
              {/* Accordion header */}
              <div
                onClick={() => setExpanded(isOpen ? null : idx)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {p.image && (
                    <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--a-border)' }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name?.en || `Product ${idx + 1}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{isOpen ? '▾' : '▸'}</span>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); delProduct(idx); }}
                    style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
                  >✕</button>
                </div>
              </div>

              {/* Accordion body */}
              {isOpen && (
                <div style={{ marginTop: 16, borderTop: '1px solid var(--a-border)', paddingTop: 16 }}>
                  <BilingualRow
                    label="Name"
                    enVal={p.name?.en} azVal={p.name?.az}
                    onEn={v => updateLang(idx, 'name', 'en', v)}
                    onAz={v => updateLang(idx, 'name', 'az', v)}
                  />
                  <BilingualRow
                    label="Description"
                    enVal={p.description?.en} azVal={p.description?.az}
                    onEn={v => updateLang(idx, 'description', 'en', v)}
                    onAz={v => updateLang(idx, 'description', 'az', v)}
                  />
                  <ImageUploader
                    label="Product Image"
                    value={p.image}
                    folder="img/product"
                    onChange={v => updateProd(idx, { image: v })}
                  />
                  <Grid2>
                    <ImageUploader label="Instagram Icon (SVG)" value={p.instagramIcon} folder="svg" onChange={v => updateProd(idx, { instagramIcon: v })} />
                    <ImageUploader label="eBay Icon (SVG)"      value={p.ebayIcon}      folder="svg" onChange={v => updateProd(idx, { ebayIcon: v })} />
                  </Grid2>
                </div>
              )}
            </Card>
          );
        })}

        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addProduct}>
          + Add product
        </button>
      </Sec>
    </div>
  );
};

export default ProductsEditor;