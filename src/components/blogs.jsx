import React, { useState, useEffect, useRef } from 'react'
import RightSvg  from "../../public/assets/svg/right.svg"
import LeftSvg   from "../../public/assets/svg/left.svg"
import BgBodySvg from "../../public/assets/svg/bg-body1.svg"
import Blogs1Img from "../../public/assets/img/blogs/blogs1.png"

const DEFAULT_ITEMS = Array.from({ length: 4 }, (_, i) => ({
  id: `b${i+1}`,
  title: `Blog Post ${i+1}`,
  description: "Natural Waxes & Essential Oils",
  image: Blogs1Img,
}))

const Blogs = ({ blogsData }) => {
  const d     = blogsData ?? { title: 'Blogs', items: DEFAULT_ITEMS }
  const items = (d.items ?? []).map(b => ({ ...b, image: b.image || Blogs1Img }))

  const [startIndex,  setStartIndex]  = useState(0)
  const [activeIndex, setActiveIndex] = useState(null)
  const [itemsToShow, setItemsToShow] = useState(4)
  const activeRef  = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if      (window.innerWidth < 768)  setItemsToShow(1)
      else if (window.innerWidth < 1024) setItemsToShow(2)
      else if (window.innerWidth < 1204) setItemsToShow(3)
      else                               setItemsToShow(4)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeRef.current && !activeRef.current.contains(e.target)) {
        setActiveIndex(null)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const nextSlide = () => {
    setStartIndex(p => (p + 1 >= items.length ? 0 : p + 1))
    setActiveIndex(null)
  }
  const prevSlide = () => {
    setStartIndex(p => (p - 1 < 0 ? items.length - 1 : p - 1))
    setActiveIndex(null)
  }

  const getVisible = () => {
    const visible = []
    for (let i = 0; i < Math.min(itemsToShow, items.length); i++) {
      visible.push(items[(startIndex + i) % items.length])
    }
    return visible
  }

  const handleItemClick = (globalIndex) => {
    const next = activeIndex === globalIndex ? null : globalIndex
    setActiveIndex(next)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (next !== null) timeoutRef.current = setTimeout(() => setActiveIndex(null), 5000)
  }

  const visibleItems = getVisible()

  return (
    <div className='About-Group FreeResponsive-Group Section-Slot' id='blogs'>
      <h1 className='Section-Title'>{d.title ?? 'Blogs'}</h1>

      <div className="Slider-Group">
        <div className="SubSlider">
          <button className='ButtonOff2' onClick={prevSlide}>
            <img src={LeftSvg} alt="Left" />
          </button>

          <div className="ItemStacks">
            {visibleItems.map((item, idx) => {
              const globalIndex = (startIndex + idx) % items.length
              const isActive    = activeIndex === globalIndex

              return (
                <div
                  key={`${item.id}-${globalIndex}`}
                  className={`ItemStack ${isActive ? 'ItemStack--expanded' : ''}`}
                  onClick={() => handleItemClick(globalIndex)}
                  ref={isActive ? activeRef : null}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={e => { e.target.src = Blogs1Img }}
                  />
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>

                  {/* Expanded view: full text + image slider */}
                  {isActive && (
                    <div
                      className="BlogExpanded"
                      onClick={e => e.stopPropagation()}
                    >
                      <BlogDetail item={item} onClose={() => setActiveIndex(null)} />
                    </div>
                  )}

                  <div
                    className="ButtonInteract"
                    onClick={e => { e.stopPropagation(); handleItemClick(globalIndex) }}
                  >
                    <button className='ButtonOn'>
                      <p>{isActive ? 'Close' : 'Read More'}</p>
                    </button>
                  </div>
                  <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                </div>
              )
            })}
          </div>

          <button className='ButtonOff2' onClick={nextSlide}>
            <img src={RightSvg} alt="Right" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Blog Detail Overlay (image + text, same style as About slider) ── */
const BlogDetail = ({ item, onClose }) => {
  const images = item.images?.length
    ? item.images
    : [{ id: 'main', src: item.image || Blogs1Img, alt: item.title }]

  const [imgs, setImgs] = useState(images)

  const handleRight = () => setImgs(prev => { const a = [...prev]; a.push(a.shift()); return a })
  const handleLeft  = () => setImgs(prev => { const a = [...prev]; a.unshift(a.pop()); return a })

  return (
    <div className="BlogDetail">
      {/* Image slider */}
      <div className="BlogDetail-Slider">
        <button className='ButtonOff2 BlogDetail-Btn' onClick={handleLeft}>
          <img src={LeftSvg} alt="Left" />
        </button>
        <div className="BlogDetail-ImgStack">
          {imgs.map(img => (
            <img key={img.id} src={img.src || img.url || Blogs1Img} alt={img.alt || item.title} />
          ))}
        </div>
        <button className='ButtonOff2 BlogDetail-Btn' onClick={handleRight}>
          <img src={RightSvg} alt="Right" />
        </button>
      </div>

      {/* Body text */}
      <div className="BlogDetail-Text">
        <h3>{item.title}</h3>
        {(item.body || item.description || '').split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <button className='ButtonOn BlogDetail-Close' onClick={onClose}>
        Close
      </button>
    </div>
  )
}

export default Blogs