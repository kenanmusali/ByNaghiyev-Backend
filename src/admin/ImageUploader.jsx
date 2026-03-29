import React, { useRef, useState, useEffect } from 'react';

const ImageUploader = ({ value, onChange, folder = 'img/uploads', label }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState('url');
  const [imageError, setImageError] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  // Clean up local object URL on unmount or when value changes
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous local preview
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    // Create new local preview
    const localUrl = URL.createObjectURL(file);
    setLocalPreview(localUrl);
    onChange(localUrl);
    setImageError(false);

    setUploading(true);
    try {
      const { uploadImage } = await import('../services/githubService');
      const path = `public/assets/${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const remoteUrl = await uploadImage(file, path);
      
      // Clean up local preview after successful upload
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
      }
      
      onChange(remoteUrl);
    } catch (err) {
      console.warn('GitHub upload failed, keeping local preview:', err.message);
      // Keep the local preview but show a warning
      setImageError(false); // Local preview should still work
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlChange = (newUrl) => {
    setImageError(false);
    onChange(newUrl);
  };

  const btnStyle = (active) => ({
    padding: '3px 10px',
    fontSize: 12,
    cursor: 'pointer',
    borderRadius: 6,
    border: '1px solid var(--a-border)',
    background: active ? 'var(--a-primary, #2563eb)' : 'transparent',
    color: active ? '#fff' : 'var(--a-muted)',
    fontWeight: active ? 600 : 400,
  });

  // Determine which URL to show in preview
  const previewUrl = localPreview || value;

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'var(--a-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
        }}>
          {label}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button type="button" style={btnStyle(mode === 'url')} onClick={() => setMode('url')}>🔗 URL</button>
        <button type="button" style={btnStyle(mode === 'file')} onClick={() => setMode('file')}>📁 Upload</button>
      </div>

      {mode === 'url' ? (
        <input
          className="adm-input"
          placeholder="https://raw.githubusercontent.com/… or /assets/…"
          value={value || ''}
          onChange={e => handleUrlChange(e.target.value)}
        />
      ) : (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.svg"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          <button
            type="button"
            className="adm-btn adm-btn-ghost adm-btn-sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading
              ? <><span className="adm-spinner" style={{ width: 12, height: 12, marginRight: 6 }} />Uploading…</>
              : 'Choose file'}
          </button>
          {uploading && (
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--a-muted)' }}>
              Uploading to GitHub...
            </span>
          )}
        </>
      )}

      {/* Image preview with better error handling */}
      {previewUrl && (
        <div style={{ marginTop: 10 }}>
          <img
            src={previewUrl}
            alt="preview"
            onError={() => {
              if (!imageError) {
                setImageError(true);
              }
            }}
            onLoad={() => {
              if (imageError) {
                setImageError(false);
              }
            }}
            style={{
              display: imageError ? 'none' : 'block',
              maxHeight: 110,
              maxWidth: '100%',
              borderRadius: 6,
              objectFit: 'contain',
              border: '1px solid var(--a-border)',
              background: 'var(--a-surface)',
              padding: 4,
            }}
          />
          {imageError && (
            <div style={{
              marginTop: 8,
              padding: 8,
              background: 'var(--a-warning-bg, #fff3e0)',
              border: '1px solid var(--a-warning, #ff9800)',
              borderRadius: 6,
              fontSize: 12,
              color: 'var(--a-warning-text, #e65100)',
            }}>
              ⚠️ Failed to load image. The URL might be invalid or inaccessible.
              {mode === 'file' && !uploading && (
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    marginLeft: 8,
                    padding: '2px 8px',
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  Try re-uploading
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;