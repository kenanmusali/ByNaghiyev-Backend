import React, { useState, useEffect } from 'react';
import Items1Svg from '../../../public/assets/svg/volunteer_activism.svg';
import Items2Svg from '../../../public/assets/svg/deployed_code.svg';
import Items3Svg from '../../../public/assets/svg/asterisk.svg';
import Items4Svg from '../../../public/assets/svg/psychiatry.svg';

const AVAILABLE_ICONS = [
  { id: 'icon1', svg: Items1Svg, name: 'Hand Made Icon' },
  { id: 'icon2', svg: Items2Svg, name: 'Premium Icon' },
  { id: 'icon3', svg: Items3Svg, name: 'Modern Icon' },
  { id: 'icon4', svg: Items4Svg, name: 'Eco Icon' },
];

// DEFAULT CATEGORIES - SAME AS YOUR CATEGORY.JSX
const DEFAULT_CATEGORIES = [
  { 
    id: '1', 
    title: 'Hand Made', 
    description: 'Carefully crafted by hand with attention to fine detail, ensuring every piece is unique.', 
    icon: 'icon1' 
  },
  { 
    id: '2', 
    title: 'Premium Materials', 
    description: 'We use high-quality wax, resin, and plaster for durability, safety, and refined finish.', 
    icon: 'icon2' 
  },
  { 
    id: '3', 
    title: 'Modern Design', 
    description: 'We use high-quality wax, resin, and plaster for durability, safety, and refined finish.', 
    icon: 'icon3' 
  },
  { 
    id: '4', 
    title: 'Eco Conscious', 
    description: 'Thoughtfully sourced materials and responsible production practices.', 
    icon: 'icon4' 
  },
];

const CategoryEditor = ({ data, onChange }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Load categories from data whenever it changes
useEffect(() => {
  console.log('=== CATEGORY EDITOR DEBUG ===');
  console.log('Received data prop:', data);

  let loadedCategories = null;

  if (data) {
    if (data.category?.items?.length) {
      loadedCategories = data.category.items;
      console.log('✅ Loaded from data.category.items');
    } else if (data.items?.length) {
      loadedCategories = data.items;
      console.log('✅ Loaded from data.items');
    } else if (Array.isArray(data) && data.length) {
      loadedCategories = data;
      console.log('✅ Loaded from direct array');
    }
  }

  // ✅ ONLY update if real data exists
  if (loadedCategories) {
    console.log('Setting categories to:', loadedCategories);
    setCategories(loadedCategories);
  }

  // ❌ REMOVE THIS (this is your bug)
  // else {
  //   setCategories(DEFAULT_CATEGORIES);
  // }

}, [data]);

  // Save to parent whenever categories change
  const updateCategories = (newCategories) => {
    setCategories(newCategories);
    if (onChange) {
      const updatedData = {
        ...data,
        category: {
          items: newCategories
        }
      };
      console.log('💾 Saving to parent:', updatedData);
      onChange(updatedData);
    }
  };

  const addCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      title: 'New Category',
      description: 'Enter description here',
      icon: 'icon1'
    };
    updateCategories([...categories, newCategory]);
  };

  const deleteCategory = (id) => {
    if (categories.length === 1) {
      alert('Cannot delete the last category');
      return;
    }
    updateCategories(categories.filter(cat => cat.id !== id));
  };

  const updateCategory = (id, field, value) => {
    const updated = categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    updateCategories(updated);
  };

  const getIconSvg = (iconId) => {
    const icon = AVAILABLE_ICONS.find(i => i.id === iconId);
    return icon?.svg || AVAILABLE_ICONS[0].svg;
  };

  return (
    <div className="category-editor" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Category Editor</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>
            {categories.length} categories loaded
          </p>
        </div>
        <button 
          onClick={addCategory}
          style={{
            padding: '8px 16px',
            background: '#1F4A44',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          + Add Category
        </button>
      </div>

      {/* Category List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {categories.map((category, index) => (
          <div 
            key={category.id} 
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              background: '#ffffff'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ 
                background: '#1F4A44', 
                padding: '4px 12px', 
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                color: 'white'
              }}>
                Category {index + 1}
              </span>
              <button
                onClick={() => deleteCategory(category.id)}
                style={{
                  padding: '6px 12px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete
              </button>
            </div>

            {/* Icon Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Icon
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px'
                }}>
                  <img 
                    src={getIconSvg(category.icon)} 
                    alt="icon"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <select
                  value={category.icon}
                  onChange={(e) => updateCategory(category.id, 'icon', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon.id} value={icon.id}>{icon.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Title
              </label>
              <input
                type="text"
                value={category.title}
                onChange={(e) => updateCategory(category.id, 'title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Description Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Description
              </label>
              <textarea
                value={category.description}
                onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Live Preview</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px'
        }}>
          {categories.map(category => (
            <div key={category.id} style={{
              flex: '1 1 200px',
              textAlign: 'center',
              padding: '20px',
              background: 'white',
              borderRadius: '8px'
            }}>
              <div style={{ width: '50px', height: '50px', margin: '0 auto 10px' }}>
                <img 
                  src={getIconSvg(category.icon)} 
                  alt={category.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <h4 style={{ margin: '10px 0' }}>{category.title}</h4>
              <p style={{ fontSize: '12px', color: '#666' }}>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;