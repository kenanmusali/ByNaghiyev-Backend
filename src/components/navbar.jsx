import React, { useState, useEffect } from 'react'
import LogoSvg      from "../../public/assets/svg/logo.svg"
import LogoTextSvg  from "../../public/assets/svg/logo-text.svg"
import MenuSvg      from "../../public/assets/svg/menu.svg"
import CloseSvg     from "../../public/assets/svg/close.svg"
import AzImg        from "../../public/assets/img/navbar/az_i18n.png"
import bgSvg        from "../../public/assets/svg/bg-pattern.svg"
import EnImg        from "../../public/assets/img/navbar/en_i18n.png"
import AutoSvg      from "../../public/assets/svg/auto_theme.svg"
import LightSvg     from "../../public/assets/svg/light_theme.svg"
import DarkSvg      from "../../public/assets/svg/dark_theme.svg"

// navData shape: { items: [{ id, label, target }] }
const Navbar = ({ navData }) => {
  const [lang,      setLang]      = useState("az")
  const [theme,     setTheme]     = useState("auto")
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024)

  // Default nav items if no data provided
  const items = navData?.items ?? [
    { id: 'n1', label: 'About us',  target: 'about'    },
    { id: 'n2', label: 'Products',  target: 'products' },
    { id: 'n3', label: 'Blogs',     target: 'blogs'    },
    { id: 'n4', label: 'Socials',   target: 'socials'  },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 1024) setScrolled(window.scrollY > 50)
    }
    const handleResize = () => setIsDesktop(window.innerWidth > 1024)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const logoToShow = (!isDesktop || (isDesktop && scrolled)) ? LogoSvg : LogoTextSvg

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (!section) return
    if (window.scrollTimeouts) window.scrollTimeouts.forEach(clearTimeout)
    window.scrollTimeouts = []
    for (let i = 0; i < 7; i++) {
      const tid = setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: window.innerWidth > 1024 ? 'end' : 'start' })
        if (i === 6 && window.innerWidth < 1024) {
          setTimeout(() => window.scrollBy({ top: -110, behavior: 'smooth' }), 50)
        }
      }, i * 200)
      window.scrollTimeouts.push(tid)
    }
    setMenuOpen(false)
  }

  const handleNavClick = (e, target) => {
    e.preventDefault()
    e.stopPropagation()
    scrollToSection(target)
  }

  return (
    <>
      <div className={`Navbar-Group ${isDesktop && scrolled ? 'scrolled' : ''}`}>
        <div className="Navbar-Items-Menu Items-Left" onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}>
          <img src={menuOpen ? CloseSvg : MenuSvg} alt="Menu" />
          <p>MENU</p>
        </div>

        <div className="Navbar-Items Items-Left">
          {items.map(item => (
            <p key={item.id} onClick={(e) => handleNavClick(e, item.target)}>{item.label}</p>
          ))}
        </div>

        <p className="Navbar-Items Items-Center" onClick={(e) => handleNavClick(e, 'home')}>
          <img className='Navbar-Logo' src={logoToShow} alt="logo" />
        </p>

        <div className="Navbar-Items Items-Right">
          <div className="Navbar-i18n">
            <img src={AzImg} onClick={(e) => { e.stopPropagation(); setLang("az") }} className={lang === "az" ? "lang-active" : "lang-inactive"} alt="AZ" />
            <img src={EnImg} onClick={(e) => { e.stopPropagation(); setLang("en") }} className={lang === "en" ? "lang-active" : "lang-inactive"} alt="EN" />
          </div>
          <div className="Navbar-Theme">
            <img src={AutoSvg}  onClick={(e) => { e.stopPropagation(); setTheme("auto")  }} className={theme === "auto"  ? "theme-active" : "theme-inactive"} alt="Auto"  />
            <img src={LightSvg} onClick={(e) => { e.stopPropagation(); setTheme("light") }} className={theme === "light" ? "theme-active" : "theme-inactive"} alt="Light" />
            <img src={DarkSvg}  onClick={(e) => { e.stopPropagation(); setTheme("dark")  }} className={theme === "dark"  ? "theme-active" : "theme-inactive"} alt="Dark"  />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-fixed ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {items.map(item => (
            <p key={item.id} onClick={(e) => handleNavClick(e, item.target)}>{item.label}</p>
          ))}
          <div className="mobile-menu-bottom">
            <div className="Navbar-i18n">
              <img src={AzImg} onClick={(e) => { e.stopPropagation(); setLang("az"); setMenuOpen(false) }} className={lang === "az" ? "lang-active" : "lang-inactive"} alt="AZ" />
              <img src={EnImg} onClick={(e) => { e.stopPropagation(); setLang("en"); setMenuOpen(false) }} className={lang === "en" ? "lang-active" : "lang-inactive"} alt="EN" />
            </div>
            <div className="Navbar-Theme">
              <img src={AutoSvg}  onClick={(e) => { e.stopPropagation(); setTheme("auto");  setMenuOpen(false) }} className={theme === "auto"  ? "theme-active" : "theme-inactive"} alt="Auto"  />
              <img src={LightSvg} onClick={(e) => { e.stopPropagation(); setTheme("light"); setMenuOpen(false) }} className={theme === "light" ? "theme-active" : "theme-inactive"} alt="Light" />
              <img src={DarkSvg}  onClick={(e) => { e.stopPropagation(); setTheme("dark");  setMenuOpen(false) }} className={theme === "dark"  ? "theme-active" : "theme-inactive"} alt="Dark"  />
            </div>
          </div>
          <img className='bgPattern' src={bgSvg} alt="background pattern" />
        </div>
      </div>
      {menuOpen && <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}
    </>
  )
}

export default Navbar