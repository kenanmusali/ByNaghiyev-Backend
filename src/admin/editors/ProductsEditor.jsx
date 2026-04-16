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
      instagramUrl: '',
      ebayIcon:      prod.products?.[0]?.ebayIcon      || '',
      ebayUrl: '',
      hidden: false,
    }],
  });

  const delProduct = (idx) => upd({ products: products.filter((_, i) => i !== idx) });
  
  const toggleHidden = (idx) => {
    const product = products[idx];
    updateProd(idx, { hidden: !product.hidden });
  };

  // Filter visible products for display
  const visibleProducts = products.filter(p => !p.hidden);
  const hiddenProducts = products.filter(p => p.hidden);

  return (
    <div>
      {/* Section title */}
      <Sec title="Section Title" collapsible>
        <Grid2>
          <div><Lbl>🇬🇧 EN</Lbl><input className="adm-input" value={title.en || ''} onChange={e => setT('en', e.target.value)} /></div>
          <div><Lbl>🇦🇿 AZ</Lbl><input className="adm-input" value={title.az || ''} onChange={e => setT('az', e.target.value)} /></div>
        </Grid2>
      </Sec>

      {/* Button texts */}
      <Sec title="Button Texts" collapsible>
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

      {/* Products list - Visible */}
      <Sec title={`Visible Products (${visibleProducts.length})`} collapsible>
        {visibleProducts.map((p, idx) => {
          const originalIdx = products.findIndex(prod => prod.id === p.id);
          const isOpen = expanded === originalIdx;
          return (
            <Card key={p.id}>
              {/* Accordion header */}
              <div
                onClick={() => setExpanded(isOpen ? null : originalIdx)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {p.image && (
                    <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--a-border)' }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name?.en || `Product ${originalIdx + 1}`}</span>
                  {p.hidden && <span style={{ fontSize: 11, color: 'var(--a-danger,#e53e3e)', marginLeft: 8 }}>[HIDDEN]</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{isOpen ? '▾' : '▸'}</span>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); toggleHidden(originalIdx); }}
                    style={{ background: 'none', border: 'none', color: 'var(--a-warning,#f59e0b)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                    title="Hide/Show"
                  >
                    {p.hidden ? '☑' : '☐'}
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); delProduct(originalIdx); }}
                    style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
                    title="Delete"
                  >✕</button>
                </div>
              </div>

              {/* Accordion body */}
              {isOpen && (
                <div style={{ marginTop: 16, borderTop: '1px solid var(--a-border)', paddingTop: 16 }}>
                  <BilingualRow
                    label="Name"
                    enVal={p.name?.en} azVal={p.name?.az}
                    onEn={v => updateLang(originalIdx, 'name', 'en', v)}
                    onAz={v => updateLang(originalIdx, 'name', 'az', v)}
                  />
                  <BilingualRow
                    label="Description"
                    enVal={p.description?.en} azVal={p.description?.az}
                    onEn={v => updateLang(originalIdx, 'description', 'en', v)}
                    onAz={v => updateLang(originalIdx, 'description', 'az', v)}
                  />
                  <ImageUploader
                    label="Product Image"
                    value={p.image}
                    folder="img/product"
                    onChange={v => updateProd(originalIdx, { image: v })}
                  />
                  <Grid2>
                    <ImageUploader label="Instagram Icon (SVG)" value={p.instagramIcon} folder="svg" onChange={v => updateProd(originalIdx, { instagramIcon: v })} />
                    <ImageUploader label="eBay Icon (SVG)"      value={p.ebayIcon}      folder="svg" onChange={v => updateProd(originalIdx, { ebayIcon: v })} />
                  </Grid2>
                  
                  {/* URL Links Section - NEW */}
                  <div style={{ marginTop: 16 }}>
                    <Lbl>Order Links</Lbl>
                    <Grid2>
                      <div>
                        <Lbl>📸 Instagram URL</Lbl>
                        <input 
                          className="adm-input" 
                          value={p.instagramUrl || ''} 
                          onChange={e => updateProd(originalIdx, { instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <Lbl>🛒 eBay URL</Lbl>
                        <input 
                          className="adm-input" 
                          value={p.ebayUrl || ''} 
                          onChange={e => updateProd(originalIdx, { ebayUrl: e.target.value })}
                          placeholder="https://ebay.com/..."
                        />
                      </div>
                    </Grid2>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addProduct}>
          + Add product
        </button>
      </Sec>

      {/* Hidden Products Section */}
      {hiddenProducts.length > 0 && (
        <Sec title={`Hidden Products (${hiddenProducts.length})`} collapsible>
          {hiddenProducts.map((p, idx) => {
            const originalIdx = products.findIndex(prod => prod.id === p.id);
            const isOpen = expanded === originalIdx;
            return (
              <Card key={p.id} style={{ opacity: 0.7 }}>
                {/* Accordion header */}
                <div
                  onClick={() => setExpanded(isOpen ? null : originalIdx)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {p.image && (
                      <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--a-border)' }} />
                    )}
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name?.en || `Product ${originalIdx + 1}`}</span>
                    <span style={{ fontSize: 11, color: 'var(--a-danger,#e53e3e)', marginLeft: 8 }}>[HIDDEN]</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{isOpen ? '▾' : '▸'}</span>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); toggleHidden(originalIdx); }}
                      style={{ background: 'none', border: 'none', color: 'var(--a-warning,#f59e0b)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                      title="Show"
                    >
                      ☑
                    </button>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); delProduct(originalIdx); }}
                      style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
                      title="Delete"
                    >✕</button>
                  </div>
                </div>

                {/* Accordion body */}
                {isOpen && (
                  <div style={{ marginTop: 16, borderTop: '1px solid var(--a-border)', paddingTop: 16 }}>
                    <BilingualRow
                      label="Name"
                      enVal={p.name?.en} azVal={p.name?.az}
                      onEn={v => updateLang(originalIdx, 'name', 'en', v)}
                      onAz={v => updateLang(originalIdx, 'name', 'az', v)}
                    />
                    <BilingualRow
                      label="Description"
                      enVal={p.description?.en} azVal={p.description?.az}
                      onEn={v => updateLang(originalIdx, 'description', 'en', v)}
                      onAz={v => updateLang(originalIdx, 'description', 'az', v)}
                    />
                    <ImageUploader
                      label="Product Image"
                      value={p.image}
                      folder="img/product"
                      onChange={v => updateProd(originalIdx, { image: v })}
                    />
                    <Grid2>
                      <ImageUploader label="Instagram Icon (SVG)" value={p.instagramIcon} folder="svg" onChange={v => updateProd(originalIdx, { instagramIcon: v })} />
                      <ImageUploader label="eBay Icon (SVG)"      value={p.ebayIcon}      folder="svg" onChange={v => updateProd(originalIdx, { ebayIcon: v })} />
                    </Grid2>
                    
                    {/* URL Links Section - NEW */}
                    <div style={{ marginTop: 16 }}>
                      <Lbl>Order Links</Lbl>
                      <Grid2>
                        <div>
                          <Lbl>📸 Instagram URL</Lbl>
                          <input 
                            className="adm-input" 
                            value={p.instagramUrl || ''} 
                            onChange={e => updateProd(originalIdx, { instagramUrl: e.target.value })}
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div>
                          <Lbl>🛒 eBay URL</Lbl>
                          <input 
                            className="adm-input" 
                            value={p.ebayUrl || ''} 
                            onChange={e => updateProd(originalIdx, { ebayUrl: e.target.value })}
                            placeholder="https://ebay.com/..."
                          />
                        </div>
                      </Grid2>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </Sec>
      )}
    </div>
  );
};

export default ProductsEditor;