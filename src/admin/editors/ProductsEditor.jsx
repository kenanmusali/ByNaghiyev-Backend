import React, { useState, useEffect } from 'react';
import ImageUploader from '../../components/ImageUploader';

const EMPTY_PRODUCT = () => ({
  id: `p${Date.now()}`,
  name: '',
  description: '',
  image: '',
  instagramUrl: 'https://www.instagram.com',
  ebayUrl: 'https://www.ebay.com',
});

const ProductsEditor = ({ data, onChange }) => {
  const [products, setProducts] = useState(data?.products || { title: 'Products', items: [] });
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (data?.products) setProducts(data.products);
  }, [data?.products]);

  // Update products AND optionally sync title to matching navbar item
  const update = (patch) => {
    const next = { ...products, ...patch };
    setProducts(next);

    let navbar = data?.navbar || { items: [] };
    if (patch.title !== undefined) {
      const navItems = (navbar.items || []).map(item =>
        item.target === 'products' ? { ...item, label: patch.title } : item
      );
      navbar = { ...navbar, items: navItems };
    }

    onChange({ ...data, products: next, navbar });
  };

  const updateItem = (id, field, value) => {
    update({ items: (products.items || []).map(p => p.id === id ? { ...p, [field]: value } : p) });
  };

  const addItem = () => {
    const item = EMPTY_PRODUCT();
    update({ items: [...(products.items || []), item] });
    setExpanded(e => ({ ...e, [item.id]: true }));
  };

  const duplicateItem = (id) => {
    const src = (products.items || []).find(p => p.id === id);
    if (!src) return;
    const copy = { ...src, id: `p${Date.now()}`, name: src.name + ' (copy)' };
    const items = [...(products.items || [])];
    const idx = items.findIndex(p => p.id === id);
    items.splice(idx + 1, 0, copy);
    update({ items });
    setExpanded(e => ({ ...e, [copy.id]: true }));
  };

  const removeItem = (id) => update({ items: (products.items || []).filter(p => p.id !== id) });
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
            value={products.title || ''}
            onChange={e => update({ title: e.target.value })}
          />
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Products ({(products.items || []).length})</div>
          </div>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={addItem}>+ Add Product</button>
        </div>

        <div className="adm-items-grid">
          {(products.items || []).map((item) => (
            <div key={item.id} className="adm-item-card">
              <div className="adm-item-card-header" onClick={() => toggle(item.id)}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                )}
                <span className="adm-item-card-title">{item.name || '(unnamed product)'}</span>
                <span style={{ marginLeft: 'auto' }}>{expanded[item.id] ? '▲' : '▼'}</span>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={e => { e.stopPropagation(); duplicateItem(item.id); }}>Duplicate</button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={e => { e.stopPropagation(); removeItem(item.id); }}>Delete</button>
              </div>

              <div className={`adm-item-card-body ${expanded[item.id] ? '' : 'collapsed'}`}>
                <div className="adm-row">
                  <div className="adm-field">
                    <label className="adm-label">Product Name</label>
                    <input className="adm-input" value={item.name || ''} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">Description</label>
                    <input className="adm-input" value={item.description || ''} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                  </div>
                </div>

                <ImageUploader
                  currentUrl={item.image}
                  onImageUploaded={(url) => updateItem(item.id, 'image', url)}
                  folder="product"
                  label="Product Image"
                />

                <div className="adm-row">
                  <div className="adm-field">
                    <label className="adm-label">Instagram URL</label>
                    <input className="adm-input" value={item.instagramUrl || ''} onChange={e => updateItem(item.id, 'instagramUrl', e.target.value)} />
                  </div>
                  <div className="adm-field">
                    <label className="adm-label">eBay URL</label>
                    <input className="adm-input" value={item.ebayUrl || ''} onChange={e => updateItem(item.id, 'ebayUrl', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="adm-add-strip" onClick={addItem}>+ Add product</button>
      </div>
    </div>
  );
};

export default ProductsEditor;