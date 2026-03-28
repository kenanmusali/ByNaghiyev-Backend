import React, { useState, useEffect } from 'react';

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'ebay',      label: 'eBay URL' },
  { key: 'whatsapp',  label: 'WhatsApp URL (wa.me link)' },
  { key: 'youtube',   label: 'YouTube URL' },
  { key: 'twitter',   label: 'X / Twitter URL' },
];

const FooterEditor = ({ data, onChange }) => {
  const defaultFooter = { tagline: '', copyright: '', termsLabel: '', privacyLabel: '', socials: {} };
  const [footer, setFooter] = useState(data?.footer || defaultFooter);

  useEffect(() => {
    if (data?.footer) setFooter(data.footer);
  }, [data?.footer]);

  const update = (patch) => {
    const next = { ...footer, ...patch };
    setFooter(next);
    onChange({ ...data, footer: next });
  };

  const updateSocial = (key, value) => {
    update({ socials: { ...(footer.socials || {}), [key]: value } });
  };

  return (
    <div>
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Footer Text</div>
            <div className="adm-card-subtitle">Tagline, copyright, and legal links</div>
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label">Tagline (under logo)</label>
          <textarea
            className="adm-textarea"
            value={footer.tagline || ''}
            onChange={e => update({ tagline: e.target.value })}
            placeholder="Turn your home into work of art…"
            style={{ minHeight: 70 }}
          />
        </div>
        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label">Copyright text</label>
            <input className="adm-input" value={footer.copyright || ''} onChange={e => update({ copyright: e.target.value })} placeholder="© 2026, By Naghiyev…" />
          </div>
        </div>
        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label">Terms of Use label</label>
            <input className="adm-input" value={footer.termsLabel || ''} onChange={e => update({ termsLabel: e.target.value })} />
          </div>
          <div className="adm-field">
            <label className="adm-label">Privacy Policy label</label>
            <input className="adm-input" value={footer.privacyLabel || ''} onChange={e => update({ privacyLabel: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <div className="adm-card-title">Social Links</div>
            <div className="adm-card-subtitle">URLs for each social icon in the footer</div>
          </div>
        </div>
        {SOCIAL_FIELDS.map(({ key, label }) => (
          <div className="adm-field" key={key}>
            <label className="adm-label">{label}</label>
            <input
              className="adm-input"
              value={(footer.socials || {})[key] || ''}
              onChange={e => updateSocial(key, e.target.value)}
              placeholder="https://…"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterEditor;