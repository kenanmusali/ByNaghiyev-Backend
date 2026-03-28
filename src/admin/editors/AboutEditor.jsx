import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

const AboutEditor = ({ data, onChange }) => {
  const [about, setAbout] = useState(data?.about || { title: '', paragraphs: [], images: [] });

  useEffect(() => {
    if (data?.about) setAbout(data.about);
  }, [data?.about]);

  // Update about AND optionally sync title to matching navbar item
  const update = (patch) => {
    const next = { ...about, ...patch };
    setAbout(next);

    // If title changed, sync the navbar item whose target === 'about'
    let navbar = data?.navbar || { items: [] };
    if (patch.title !== undefined) {
      const navItems = (navbar.items || []).map(item =>
        item.target === 'about' ? { ...item, label: patch.title } : item
      );
      navbar = { ...navbar, items: navItems };
    }

    onChange({ ...data, about: next, navbar });
  };

  const updateParagraph = (idx, value) => {
    const paragraphs = (about.paragraphs || []).map((p, i) => i === idx ? value : p);
    update({ paragraphs });
  };

  const addParagraph    = ()    => update({ paragraphs: [...(about.paragraphs || []), ''] });
  const duplicateParagraph = (idx) => {
    const paragraphs = [...(about.paragraphs || [])];
    paragraphs.splice(idx + 1, 0, paragraphs[idx]);
    update({ paragraphs });
  };
  const removeParagraph = (idx) => update({ paragraphs: (about.paragraphs || []).filter((_, i) => i !== idx) });

  const updateImage = (id, field, value) => {
    const images = (about.images || []).map(img => img.id === id ? { ...img, [field]: value } : img);
    update({ images });
  };

  const addImage = () => update({ 
    images: [...(about.images || []), { id: `a${Date.now()}`, url: '', alt: 'About image' }] 
  });

  const duplicateImage = (id) => {
    const images = [...(about.images || [])];
    const idx = images.findIndex(i => i.id === id);
    if (idx === -1) return;
    const copy = { ...images[idx], id: `a${Date.now()}` };
    images.splice(idx + 1, 0, copy);
    update({ images });
  };

  const removeImage = (id) => update({ images: (about.images || []).filter(i => i.id !== id) });

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Section Title &amp; Text</div>
            <div className="adm-card-subtitle">Changing the title also updates the matching Navbar label.</div>
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Section Title</label>
          <input
            className="adm-input"
            value={about.title || ''}
            onChange={e => update({ title: e.target.value })}
          />
        </div>

        <div className="adm-card-header" style={{ marginTop: 16 }}>
          <div className="adm-card-title">Paragraphs</div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addParagraph}>+ Add Paragraph</button>
        </div>

        <div className="adm-list">
          {(about.paragraphs || []).map((para, idx) => (
            <div key={idx} className="adm-list-item" style={{ alignItems: 'flex-start' }}>
              <div className="adm-list-item-body">
                <label className="adm-label">Paragraph {idx + 1}</label>
                <textarea
                  className="adm-textarea"
                  value={para}
                  onChange={e => updateParagraph(idx, e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => duplicateParagraph(idx)}>Copy</button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeParagraph(idx)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <button className="adm-add-strip" onClick={addParagraph}>+ Add paragraph</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Slider Images</div>
            <div className="adm-card-subtitle">Images will be displayed in the about section slider</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addImage}>+ Add Image</button>
        </div>

        <div className="adm-list">
          {(about.images || []).map((img) => (
            <div key={img.id} className="adm-list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <ImageUploader
                currentUrl={img.url}
                onImageUploaded={(url) => updateImage(img.id, 'url', url)}
                folder="about"
                label="Image"
              />
              <div className="adm-field">
                <label className="adm-label">Alt text</label>
                <input
                  className="adm-input"
                  value={img.alt || ''}
                  onChange={e => updateImage(img.id, 'alt', e.target.value)}
                />
              </div>
              <div className="adm-list-item-actions">
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => duplicateImage(img.id)}>Duplicate</button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeImage(img.id)}>Delete Image</button>
              </div>
            </div>
          ))}
        </div>
        {(!about.images || about.images.length === 0) && (
          <div className="adm-empty-state">No images added yet. Click "Add Image" to get started.</div>
        )}
        <button className="adm-add-strip" onClick={addImage}>+ Add image</button>
      </div>
    </div>
  );
};

export default AboutEditor;