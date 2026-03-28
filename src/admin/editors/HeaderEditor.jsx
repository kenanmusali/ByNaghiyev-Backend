import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

const HeaderEditor = ({ data, onChange }) => {
  const defaultHeader = { subtitle: '', title: '', cta1Label: '', cta2Label: '', images: [] };
  const [header, setHeader] = useState(data?.header || defaultHeader);

  useEffect(() => {
    if (data?.header) setHeader(data.header);
  }, [data?.header]);

  const update = (patch) => {
    const next = { ...header, ...patch };
    setHeader(next);
    onChange({ ...data, header: next });
  };

  const updateImage = (id, field, value) => {
    const images = (header.images || []).map(img => img.id === id ? { ...img, [field]: value } : img);
    update({ images });
  };

  const addImage = () => {
    const newImg = { id: `h${Date.now()}`, url: '', alt: 'Header image' };
    update({ images: [...(header.images || []), newImg] });
  };

  const duplicateImage = (id) => {
    const images = [...(header.images || [])];
    const idx = images.findIndex(i => i.id === id);
    if (idx === -1) return;
    const copy = { ...images[idx], id: `h${Date.now()}` };
    images.splice(idx + 1, 0, copy);
    update({ images });
  };

  const removeImage = (id) => {
    update({ images: (header.images || []).filter(i => i.id !== id) });
  };

  return (
    <div>
      {/* Text content */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Hero Text</div>
            <div className="adm-card-subtitle">Headline, subheading, and button labels</div>
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Subtitle (small text above headline)</label>
          <input
            className="adm-input"
            value={header.subtitle || ''}
            onChange={e => update({ subtitle: e.target.value })}
            placeholder="HAND MADE LUXURY"
          />
        </div>
        <div className="adm-field">
          <label className="adm-label">Main Headline</label>
          <textarea
            className="adm-textarea"
            value={header.title || ''}
            onChange={e => update({ title: e.target.value })}
            placeholder="Transform your home…"
          />
        </div>
        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label">Button 1 Label (outlined)</label>
            <input
              className="adm-input"
              value={header.cta1Label || ''}
              onChange={e => update({ cta1Label: e.target.value })}
              placeholder="DISCOVER COLLECTION"
            />
          </div>
          <div className="adm-field">
            <label className="adm-label">Button 2 Label (filled)</label>
            <input
              className="adm-input"
              value={header.cta2Label || ''}
              onChange={e => update({ cta2Label: e.target.value })}
              placeholder="Order Now"
            />
          </div>
        </div>
      </div>

      {/* Slider images */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Slider Images</div>
            <div className="adm-card-subtitle">Upload or paste a direct image link / relative path like /assets/img/header/header1.png</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addImage}>+ Add Image</button>
        </div>

        <div className="adm-list">
          {(header.images || []).map((img) => (
            <div key={img.id} className="adm-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <ImageUploader
                currentUrl={img.url}
                onImageUploaded={(url) => updateImage(img.id, 'url', url)}
                folder="header"
                label="Image"
              />
              <div className="adm-field">
                <label className="adm-label">Alt text</label>
                <input
                  className="adm-input"
                  value={img.alt || ''}
                  onChange={e => updateImage(img.id, 'alt', e.target.value)}
                  placeholder="Header image"
                />
              </div>
              <div className="adm-list-item-actions">
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => duplicateImage(img.id)}>Duplicate</button>
                <button className="adm-btn adm-btn-danger adm-btn-sm adm-btn-icon" onClick={() => removeImage(img.id)} title="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="adm-add-strip" onClick={addImage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add slider image
        </button>
      </div>
    </div>
  );
};

export default HeaderEditor;