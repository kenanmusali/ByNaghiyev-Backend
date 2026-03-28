import React, { useState, useEffect, useCallback } from 'react';
import { uploadImage, listRepoImages } from '../services/githubService';

// Folders available for browsing - updated to match your structure
const FOLDERS = ['all', 'header', 'about', 'product', 'blogs'];

const ImageUploader = ({ currentUrl, onImageUploaded, folder, label = 'Image' }) => {
  const [uploading,   setUploading]   = useState(false);
  const [preview,     setPreview]     = useState(currentUrl || '');
  const [showPicker,  setShowPicker]  = useState(false);
  const [images,      setImages]      = useState([]);
  const [loadingLib,  setLoadingLib]  = useState(false);
  const [activeTab,   setActiveTab]   = useState('library'); // 'library' | 'upload' | 'url'
  const [filterFolder, setFilterFolder] = useState(folder || 'all');
  const [search,      setSearch]      = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  // Keep preview in sync with parent prop changes
  useEffect(() => { setPreview(currentUrl || ''); }, [currentUrl]);

  // Load image library when picker opens
  useEffect(() => {
    if (!showPicker) return;
    let cancelled = false;
    const load = async () => {
      setLoadingLib(true);
      try {
        const imgs = await listRepoImages();
        if (!cancelled) setImages(imgs);
      } catch { /* ignore */ }
      if (!cancelled) setLoadingLib(false);
    };
    load();
    return () => { cancelled = true; };
  }, [showPicker]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress('Uploading to GitHub…');
    try {
      const url = await uploadImage(file, folder || 'about');
      setPreview(url);
      onImageUploaded(url);
      setUploadProgress('✓ Upload complete');
      setShowPicker(false);
      // Refresh library
      const imgs = await listRepoImages();
      setImages(imgs);
    } catch (err) {
      setUploadProgress('');
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleUrlInput = (url) => {
    setPreview(url);
    onImageUploaded(url);
  };

  const handlePickImage = (img) => {
    const url = img.localUrl;
    setPreview(url);
    onImageUploaded(url);
    setShowPicker(false);
  };

  // Filtered images for library
  const filteredImages = images.filter(img => {
    const matchFolder = filterFolder === 'all' || img.folder === filterFolder;
    const matchSearch = !search || img.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  return (
    <div className="adm-image-uploader">
      {/* ── URL bar + Browse button ── */}
      <div className="adm-field">
        <label className="adm-label">{label}</label>
        <div className="adm-row" style={{ gap: 8 }}>
          <input
            className="adm-input"
            value={preview}
            onChange={e => handleUrlInput(e.target.value)}
            placeholder="https://… or /assets/img/…"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="adm-btn adm-btn-secondary adm-btn-sm"
            onClick={() => setShowPicker(v => !v)}
          >
            {showPicker ? 'Close' : '📂 Browse'}
          </button>
        </div>
      </div>

      {/* ── Image picker panel ── */}
      {showPicker && (
        <div style={{
          border: '1px solid var(--a-border)', borderRadius: 10,
          background: 'var(--a-white)', marginTop: 8, overflow: 'hidden',
          boxShadow: 'var(--a-shadow)'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--a-border)' }}>
            {[['library', '🖼 Library'], ['upload', '⬆ Upload'], ['url', '🔗 URL']].map(([key, lbl]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                  background: activeTab === key ? 'var(--a-lime)' : 'transparent',
                  color: activeTab === key ? 'var(--a-green)' : 'var(--a-muted)',
                  fontWeight: activeTab === key ? 700 : 400, fontSize: 13,
                  borderBottom: activeTab === key ? '2px solid var(--a-green)' : '2px solid transparent',
                }}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* ── Library tab ── */}
          {activeTab === 'library' && (
            <div style={{ padding: 12 }}>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <input
                  className="adm-input"
                  placeholder="Search images…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, minWidth: 120 }}
                />
                <select
                  className="adm-select"
                  value={filterFolder}
                  onChange={e => setFilterFolder(e.target.value)}
                  style={{ minWidth: 100 }}
                >
                  {FOLDERS.map(f => (
                    <option key={f} value={f}>{f === 'all' ? 'All folders' : f}</option>
                  ))}
                </select>
              </div>

              {loadingLib ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--a-muted)' }}>
                  <span className="adm-spinner adm-spinner-dark" style={{ marginRight: 8 }} />
                  Loading images…
                </div>
              ) : filteredImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--a-muted)', fontSize: 13 }}>
                  No images found.{' '}
                  <button type="button" onClick={() => setActiveTab('upload')}
                    style={{ color: 'var(--a-green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    Upload one?
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                  gap: 8, maxHeight: 280, overflowY: 'auto'
                }}>
                  {filteredImages.map(img => (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => handlePickImage(img)}
                      style={{
                        border: preview === img.localUrl ? '2px solid var(--a-green)' : '2px solid var(--a-border)',
                        borderRadius: 8, padding: 4, cursor: 'pointer',
                        background: 'var(--a-bg)', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 4,
                      }}
                    >
                      <img
                        src={img.localUrl}
                        alt={img.name}
                        style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 5 }}
                        onError={e => { e.target.src = ''; e.target.style.background = '#ddd'; }}
                      />
                      <span style={{ fontSize: 10, color: 'var(--a-muted)', wordBreak: 'break-all', lineHeight: 1.2 }}>
                        {img.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Upload tab ── */}
          {activeTab === 'upload' && (
            <div style={{ padding: 16 }}>
              <div className="adm-field">
                <label className="adm-label">Choose file to upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="adm-input"
                />
              </div>
              {uploading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--a-muted)', fontSize: 13, marginTop: 8 }}>
                  <span className="adm-spinner adm-spinner-dark" />
                  {uploadProgress}
                </div>
              )}
              {!uploading && uploadProgress && (
                <div style={{ color: 'var(--a-success)', fontSize: 13, marginTop: 8 }}>{uploadProgress}</div>
              )}
              <p style={{ fontSize: 11, color: 'var(--a-muted)', marginTop: 10 }}>
                Image will be uploaded to <code>public/assets/img/{folder || 'about'}/</code> on GitHub and become available at <code>/assets/img/{folder || 'about'}/…</code>
              </p>
            </div>
          )}

          {/* ── URL tab ── */}
          {activeTab === 'url' && (
            <div style={{ padding: 16 }}>
              <div className="adm-field">
                <label className="adm-label">Paste an image URL</label>
                <input
                  className="adm-input"
                  placeholder="https://… or /assets/img/…"
                  value={preview}
                  onChange={e => handleUrlInput(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="adm-btn adm-btn-primary adm-btn-sm"
                style={{ marginTop: 8 }}
                onClick={() => setShowPicker(false)}
              >
                Use this URL
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Preview ── */}
      {preview && (
        <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '100%', maxHeight: 140, borderRadius: 8,
              border: '1px solid var(--a-border)', display: 'block'
            }}
            onError={e => { 
              console.error('Preview image failed to load:', preview);
              e.target.style.display = 'none'; 
            }}
          />
          <button
            type="button"
            onClick={() => { setPreview(''); onImageUploaded(''); }}
            style={{
              position: 'absolute', top: 4, right: 4,
              background: 'rgba(0,0,0,.55)', color: '#fff',
              border: 'none', borderRadius: '50%', width: 22, height: 22,
              cursor: 'pointer', fontSize: 13, lineHeight: '22px', textAlign: 'center'
            }}
            title="Remove image"
          >×</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;