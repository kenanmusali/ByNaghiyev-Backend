import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

const EMPTY_BLOG = () => ({
  id: `b${Date.now()}`,
  title: '',
  description: '',
  body: '',
  image: '',
  images: [],
});

const BlogsEditor = ({ data, onChange }) => {
  const [blogs, setBlogs] = useState(data?.blogs || { title: 'Blogs', items: [] });
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (data?.blogs) setBlogs(data.blogs);
  }, [data?.blogs]);

  // Update blogs AND optionally sync title to matching navbar item
  const update = (patch) => {
    const next = { ...blogs, ...patch };
    setBlogs(next);

    let navbar = data?.navbar || { items: [] };
    if (patch.title !== undefined) {
      const navItems = (navbar.items || []).map(item =>
        item.target === 'blogs' ? { ...item, label: patch.title } : item
      );
      navbar = { ...navbar, items: navItems };
    }

    onChange({ ...data, blogs: next, navbar });
  };

  const updateItem = (id, field, value) => {
    update({ items: (blogs.items || []).map(b => b.id === id ? { ...b, [field]: value } : b) });
  };

  const addExtraImage = (id) => {
    const item = (blogs.items || []).find(b => b.id === id);
    if (!item) return;
    const images = [...(item.images || []), { id: `bi${Date.now()}`, url: '', alt: '' }];
    updateItem(id, 'images', images);
  };

  const updateExtraImage = (blogId, imgId, url) => {
    const item = (blogs.items || []).find(b => b.id === blogId);
    if (!item) return;
    const images = (item.images || []).map(img => img.id === imgId ? { ...img, url } : img);
    updateItem(blogId, 'images', images);
  };

  const removeExtraImage = (blogId, imgId) => {
    const item = (blogs.items || []).find(b => b.id === blogId);
    if (!item) return;
    updateItem(blogId, 'images', (item.images || []).filter(img => img.id !== imgId));
  };

  const addItem = () => {
    const item = EMPTY_BLOG();
    update({ items: [...(blogs.items || []), item] });
    setExpanded(e => ({ ...e, [item.id]: true }));
  };

  const duplicateItem = (id) => {
    const src = (blogs.items || []).find(b => b.id === id);
    if (!src) return;
    const copy = { ...src, id: `b${Date.now()}`, title: src.title + ' (copy)', images: [...(src.images || [])] };
    const items = [...(blogs.items || [])];
    const idx = items.findIndex(b => b.id === id);
    items.splice(idx + 1, 0, copy);
    update({ items });
    setExpanded(e => ({ ...e, [copy.id]: true }));
  };

  const removeItem = (id) => update({ items: (blogs.items || []).filter(b => b.id !== id) });
  const toggle     = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div className="adm-card-title">Section Title</div>
          <span style={{ fontSize: 11, color: 'var(--a-muted)' }}>Changing title also updates the Navbar label.</span>
        </div>
        <div className="adm-field">
          <label className="adm-label">Title</label>
          <input
            className="adm-input"
            value={blogs.title || ''}
            onChange={e => update({ title: e.target.value })}
          />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Blog Posts ({(blogs.items || []).length})</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>+ Add Post</button>
        </div>

        <div className="adm-items-grid">
          {(blogs.items || []).map((item) => (
            <div key={item.id} className="adm-item-card">
              <div className="adm-item-card-header" onClick={() => toggle(item.id)}>
                {item.image && (
                  <img src={item.image} alt={item.title} style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                )}
                <span className="adm-item-card-title">{item.title || '(untitled post)'}</span>
                <span style={{ marginLeft: 'auto' }}>{expanded[item.id] ? '▲' : '▼'}</span>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={e => { e.stopPropagation(); duplicateItem(item.id); }}>Duplicate</button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={e => { e.stopPropagation(); removeItem(item.id); }}>Delete</button>
              </div>

              <div className={`adm-item-card-body ${expanded[item.id] ? '' : 'collapsed'}`}>
                <div className="adm-field">
                  <label className="adm-label">Post Title</label>
                  <input className="adm-input" value={item.title || ''} onChange={e => updateItem(item.id, 'title', e.target.value)} />
                </div>

                <div className="adm-field">
                  <label className="adm-label">Short Description</label>
                  <input className="adm-input" value={item.description || ''} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                </div>

                <div className="adm-field">
                  <label className="adm-label">Full Body Text</label>
                  <textarea className="adm-textarea" value={item.body || ''} onChange={e => updateItem(item.id, 'body', e.target.value)} style={{ minHeight: 140 }} />
                </div>

                <ImageUploader
                  currentUrl={item.image}
                  onImageUploaded={(url) => updateItem(item.id, 'image', url)}
                  folder="blogs"
                  label="Cover Image"
                />

                <div className="adm-divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Detail Slider Images</div>
                    <div style={{ fontSize: 11, color: 'var(--a-muted)' }}>Additional images shown in expanded popup</div>
                  </div>
                  <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => addExtraImage(item.id)}>+ Add</button>
                </div>

                <div className="adm-list">
                  {(item.images || []).map(img => (
                    <div key={img.id} className="adm-list-item">
                      <ImageUploader
                        currentUrl={img.url}
                        onImageUploaded={(url) => updateExtraImage(item.id, img.id, url)}
                        folder="blogs"
                        label="Image URL"
                      />
                      <div className="adm-field" style={{ flex: 1 }}>
                        <label className="adm-label">Alt text</label>
                        <input className="adm-input" value={img.alt || ''} onChange={e => updateExtraImage(item.id, img.id, e.target.value)} />
                      </div>
                      <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeExtraImage(item.id, img.id)}>Delete</button>
                    </div>
                  ))}
                </div>
                {(!item.images || item.images.length === 0) && (
                  <button className="adm-add-strip" onClick={() => addExtraImage(item.id)}>+ Add slider image</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="adm-add-strip" onClick={addItem}>+ Add blog post</button>
      </div>
    </div>
  );
};

export default BlogsEditor;