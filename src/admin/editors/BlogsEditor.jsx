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

const BiRow = ({ label, enVal, azVal, onEn, onAz, multiline }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <Lbl>{label}</Lbl>}
    <Grid2>
      <div>
        <Lbl>🇬🇧 EN</Lbl>
        {multiline
          ? <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} value={enVal || ''} onChange={e => onEn(e.target.value)} />
          : <input className="adm-input" value={enVal || ''} onChange={e => onEn(e.target.value)} />}
      </div>
      <div>
        <Lbl>🇦🇿 AZ</Lbl>
        {multiline
          ? <textarea className="adm-input" rows={3} style={{ resize: 'vertical' }} value={azVal || ''} onChange={e => onAz(e.target.value)} />
          : <input className="adm-input" value={azVal || ''} onChange={e => onAz(e.target.value)} />}
      </div>
    </Grid2>
  </div>
);

/* ── BlogsEditor ─────────────────────────────────────────────────── */
const BlogsEditor = ({ data, onChange }) => {
  const bl    = data.blogs  || {};
  const title = bl.sectionTitle || {};
  const rdMore = bl.readMoreText || {};
  const blogs  = bl.blogs        || [];
  const [expanded, setExpanded] = useState(null);

  const upd  = (patch) => onChange({ ...data, blogs: { ...bl, ...patch } });
  const setT = (lang, val) => upd({ sectionTitle: { ...title,  [lang]: val } });
  const setR = (lang, val) => upd({ readMoreText: { ...rdMore, [lang]: val } });

  /* update blog item */
  const updBlog = (idx, patch) =>
    upd({ blogs: blogs.map((b, i) => i !== idx ? b : { ...b, ...patch }) });

  const updLang = (idx, field, lang, val) =>
    upd({
      blogs: blogs.map((b, i) =>
        i !== idx ? b : { ...b, [field]: { ...(b[field] || {}), [lang]: val } }
      ),
    });

  /* expanded content helpers */
  const updExpanded = (idx, patch) =>
    updBlog(idx, { expandedContent: { ...(blogs[idx]?.expandedContent || {}), ...patch } });

  const updExpTitle = (idx, lang, val) =>
    updExpanded(idx, { title: { ...(blogs[idx]?.expandedContent?.title || {}), [lang]: val } });

  const updExpImgs = (idx, images) => updExpanded(idx, { images });

  const updExpPara = (idx, lang, paraIdx, val) => {
    const paras = [...((blogs[idx]?.expandedContent?.paragraphs?.[lang]) || [])];
    paras[paraIdx] = val;
    updExpanded(idx, {
      paragraphs: { ...(blogs[idx]?.expandedContent?.paragraphs || {}), [lang]: paras },
    });
  };
  const addExpPara = (idx) => {
    const p = blogs[idx]?.expandedContent?.paragraphs || {};
    updExpanded(idx, {
      paragraphs: { en: [...(p.en || []), ''], az: [...(p.az || []), ''] },
    });
  };
  const delExpPara = (idx, paraIdx) => {
    const p = blogs[idx]?.expandedContent?.paragraphs || {};
    updExpanded(idx, {
      paragraphs: {
        en: (p.en || []).filter((_, i) => i !== paraIdx),
        az: (p.az || []).filter((_, i) => i !== paraIdx),
      },
    });
  };

  const addExpImg = (idx) =>
    updExpImgs(idx, [...(blogs[idx]?.expandedContent?.images || []), '']);
  const setExpImg = (idx, imgIdx, val) =>
    updExpImgs(idx, (blogs[idx]?.expandedContent?.images || []).map((im, i) => i !== imgIdx ? im : val));
  const delExpImg = (idx, imgIdx) =>
    updExpImgs(idx, (blogs[idx]?.expandedContent?.images || []).filter((_, i) => i !== imgIdx));

  const addBlog = () => upd({
    blogs: [...blogs, {
      id: Date.now(),
      name: { en: 'New Blog', az: 'Yeni Bloq' },
      time: { en: '', az: '' },
      description: { en: '', az: '' },
      image: '',
      expandedContent: {
        title: { en: '', az: '' },
        images: [],
        paragraphs: { en: [''], az: [''] },
      },
    }],
  });

  const delBlog = (idx) => upd({ blogs: blogs.filter((_, i) => i !== idx) });

  return (
    <div>
      {/* Section titles */}
      <Sec title="Labels" collapsible>
        <div style={{ marginBottom: 12 }}>
          <Lbl>Section Title</Lbl>
          <Grid2>
            <div><Lbl>🇬🇧 EN</Lbl><input className="adm-input" value={title.en || ''} onChange={e => setT('en', e.target.value)} /></div>
            <div><Lbl>🇦🇿 AZ</Lbl><input className="adm-input" value={title.az || ''} onChange={e => setT('az', e.target.value)} /></div>
          </Grid2>
        </div>
        <div>
          <Lbl>Read More Button</Lbl>
          <Grid2>
            <div><Lbl>🇬🇧 EN</Lbl><input className="adm-input" value={rdMore.en || ''} onChange={e => setR('en', e.target.value)} /></div>
            <div><Lbl>🇦🇿 AZ</Lbl><input className="adm-input" value={rdMore.az || ''} onChange={e => setR('az', e.target.value)} /></div>
          </Grid2>
        </div>
      </Sec>

      {/* Blogs */}
      <Sec title={`Blog Posts (${blogs.length})`} collapsible>
        {blogs.map((b, idx) => {
          const isOpen = expanded === idx;
          const exp    = b.expandedContent || {};
          const paraCount = Math.max((exp.paragraphs?.en || []).length, (exp.paragraphs?.az || []).length);

          return (
            <Card key={b.id ?? idx}>
              {/* Accordion header */}
              <div
                onClick={() => setExpanded(isOpen ? null : idx)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {b.image && (
                    <img src={b.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--a-border)' }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name?.en || `Blog ${idx + 1}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{isOpen ? '▾' : '▸'}</span>
                  <button
                    type="button" onClick={e => { e.stopPropagation(); delBlog(idx); }}
                    style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
                  >✕</button>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 16, borderTop: '1px solid var(--a-border)', paddingTop: 16 }}>
                  {/* Basic fields */}
                  <BiRow label="Name"        enVal={b.name?.en}        azVal={b.name?.az}        onEn={v => updLang(idx,'name','en',v)}        onAz={v => updLang(idx,'name','az',v)} />
                  <BiRow label="Date"        enVal={b.time?.en}        azVal={b.time?.az}        onEn={v => updLang(idx,'time','en',v)}        onAz={v => updLang(idx,'time','az',v)} />
                  <BiRow label="Description" enVal={b.description?.en} azVal={b.description?.az} onEn={v => updLang(idx,'description','en',v)} onAz={v => updLang(idx,'description','az',v)} />
                  <ImageUploader label="Card Image" value={b.image} folder="img/blog" onChange={v => updBlog(idx, { image: v })} />

                  {/* Expanded content */}
                  <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--a-surface-2, rgba(0,0,0,0.03))', borderRadius: 8, border: '1px dashed var(--a-border)' }}>
                    <Lbl>Expanded / Read More Content</Lbl>

                    <BiRow label="Expanded Title" enVal={exp.title?.en} azVal={exp.title?.az} onEn={v => updExpTitle(idx,'en',v)} onAz={v => updExpTitle(idx,'az',v)} />

                    {/* Expanded images */}
                    <div style={{ marginBottom: 14 }}>
                      <Lbl>Expanded Images ({(exp.images || []).length})</Lbl>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
                        {(exp.images || []).map((src, imgIdx) => (
                          <div key={imgIdx} style={{ position: 'relative', border: '1px solid var(--a-border)', borderRadius: 6, padding: 8, background: 'var(--a-surface)' }}>
                            <ImageUploader value={src} folder="img/blog" onChange={v => setExpImg(idx, imgIdx, v)} />
                            <button
                              type="button" onClick={() => delExpImg(idx, imgIdx)}
                              style={{ position: 'absolute', top: 4, right: 4, background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                            >✕</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" style={{ marginTop: 6 }} onClick={() => addExpImg(idx)}>
                        + Add image
                      </button>
                    </div>

                    {/* Expanded paragraphs */}
                    <Lbl>Paragraphs ({paraCount})</Lbl>
                    {Array.from({ length: paraCount }, (_, pIdx) => (
                      <div key={pIdx} style={{ marginBottom: 10, padding: '10px 12px', background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: 'var(--a-muted)' }}>Paragraph {pIdx + 1}</span>
                          <button type="button" onClick={() => delExpPara(idx, pIdx)} style={{ background: 'none', border: 'none', color: 'var(--a-danger,#e53e3e)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                        </div>
                        <BiRow
                          enVal={(exp.paragraphs?.en || [])[pIdx]} azVal={(exp.paragraphs?.az || [])[pIdx]}
                          onEn={v => updExpPara(idx,'en',pIdx,v)} onAz={v => updExpPara(idx,'az',pIdx,v)}
                          multiline
                        />
                      </div>
                    ))}
                    <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => addExpPara(idx)}>
                      + Add paragraph
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={addBlog}>
          + Add blog post
        </button>
      </Sec>
    </div>
  );
};

export default BlogsEditor;