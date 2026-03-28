import React from 'react'
import Section1Svg from '../../public/assets/svg/footer-bg-1.svg'
import Section2Svg from '../../public/assets/svg/footer-bg-2.svg'
import Socail1Svg  from '../../public/assets/svg/ebayIcon.svg'
import Socail2Svg  from '../../public/assets/svg/instagramIcon.svg'
import Socail3Svg  from '../../public/assets/svg/xIcon.svg'
import Socail4Svg  from '../../public/assets/svg/whatsaapIcon.svg'
import Socail5Svg  from '../../public/assets/svg/youtubeIcon.svg'
import LogoSvg     from '../../public/assets/svg/logo.svg'

const DEFAULT_DATA = {
  tagline:      "Turn your home into work of art. The right address for aesthetic touch and positive energy",
  socials: {
    ebay:      "https://www.ebay.com",
    instagram: "https://www.instagram.com",
    twitter:   "https://x.com",
    whatsapp:  "https://wa.me/",
    youtube:   "https://www.youtube.com",
  },
  copyright:    "© 2026, By Naghiyev, All right reserved",
  termsLabel:   "Terms of use",
  privacyLabel: "Privacy Policy",
}

const Footer = ({ footerData }) => {
  const d = footerData ?? DEFAULT_DATA
  const s = d.socials ?? {}

  const openLink = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='Footer-Group' id='socials'>
      <div className='Footer-Section'>
        <div className="LogoSection">
          <img src={LogoSvg} alt="By Naghiyev" />
          <p>{d.tagline}</p>
        </div>

        <div className="SlotSection">
          <h2>Socials</h2>
          <div className="Socials-Group">
            <img src={Socail1Svg} alt="eBay"       style={{cursor:'pointer'}} onClick={() => openLink(s.ebay)}      />
            <img src={Socail2Svg} alt="Instagram"  style={{cursor:'pointer'}} onClick={() => openLink(s.instagram)} />
            <img src={Socail3Svg} alt="X/Twitter"  style={{cursor:'pointer'}} onClick={() => openLink(s.twitter)}   />
            <img src={Socail4Svg} alt="WhatsApp"   style={{cursor:'pointer'}} onClick={() => openLink(s.whatsapp)}  />
            <img src={Socail5Svg} alt="YouTube"    style={{cursor:'pointer'}} onClick={() => openLink(s.youtube)}   />
          </div>
        </div>

        <div className="SlotSection">
          <h2>Newsletter</h2>
          <div className="Socials-Group">
            <div className="Button-Group Social-Button-Group">
              <input type="email" className="ButtonOff InputOn" placeholder="Email address" />
              <button className='ButtonOn'>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className='Footer-Section'>
        <p>{d.copyright}</p>
        <p>{d.termsLabel}  |  {d.privacyLabel}</p>
      </div>
    </div>
  )
}

export default Footer