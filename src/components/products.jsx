import React, { useState, useEffect, useRef } from 'react'
import RightSvg    from "../../public/assets/svg/right.svg"
import LeftSvg     from "../../public/assets/svg/left.svg"
import BgBodySvg   from "../../public/assets/svg/bg-body1.svg"
import Product1Img from "../../public/assets/img/product/product1.png"
import EbaySvg     from "../../public/assets/svg/EBay.svg"
import InstagramSvg from "../../public/assets/svg/instagram.svg"

const DEFAULT_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: `p${i+1}`, name: `Scented Candle ${i+1}`,
  description: "Natural Waxes & Essential Oils",
  image: Product1Img,
  instagramUrl: "https://www.instagram.com",
  ebayUrl: "https://www.ebay.com",
}))

const Products = ({ productsData }) => {
  const d     = productsData ?? { title: 'Products', items: DEFAULT_ITEMS }
  const items = (d.items ?? []).map(p => ({ ...p, image: p.image || Product1Img }))

  const [startIndex,   setStartIndex]   = useState(0)
  const [activeIndex,  setActiveIndex]  = useState(null)
  const [itemsToShow,  setItemsToShow]  = useState(4)
  const activeRef  = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768)  setItemsToShow(1)
      else if (window.innerWidth < 1024) setItemsToShow(2)
      else if (window.innerWidth < 1204) setItemsToShow(3)
      else setItemsToShow(4)
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

  const nextSlide = () => setStartIndex(p => (p + 1 >= items.length ? 0 : p + 1))
  const prevSlide = () => setStartIndex(p => (p - 1 < 0 ? items.length - 1 : p - 1))

  const getVisible = () => {
    const visible = []
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(items[(startIndex + i) % items.length])
    }
    return visible
  }

  const handleItemClick = (index) => {
    const next = activeIndex === index ? null : index
    setActiveIndex(next)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (next !== null) timeoutRef.current = setTimeout(() => setActiveIndex(null), 5000)
  }

  const visibleProducts = getVisible()

  return (
    <div className='About-Group FreeResponsive-Group Section-Slot' id='products'>
      <h1 className='Section-Title'>{d.title ?? 'Products'}</h1>

      <div className="Slider-Group">
        <div className="SubSlider">
          <button className='ButtonOff2' onClick={prevSlide}><img src={LeftSvg} alt="Left" /></button>

          <div className="ItemStacks">
            {visibleProducts.map((product, idx) => {
              const globalIndex = (startIndex + idx) % items.length
              return (
                <div
                  key={`${product.id}-${globalIndex}`}
                  className="ItemStack"
                  onClick={() => handleItemClick(globalIndex)}
                  ref={activeIndex === globalIndex ? activeRef : null}
                >
                  <img src={product.image} alt={product.name} onError={e => e.target.src = Product1Img} />
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <div className="ButtonInteract" onClick={e => { e.stopPropagation(); handleItemClick(globalIndex) }}>
                    <button className='ButtonOn'><p>Order Now</p></button>
                  </div>
                  <img className='ItemStackBg' src={BgBodySvg} alt="Background" />

                  {activeIndex === globalIndex && (
                    <div className="ItemStackActive">
                      <div className="ItemStackActiveItem">
                        <img src={InstagramSvg} alt="Instagram" />
                        <div className="ButtonInteract">
                          <button className='ButtonOn' onClick={() => window.open(product.instagramUrl || 'https://www.instagram.com', '_blank')}>
                            <p>Order in Instagram</p>
                          </button>
                        </div>
                        <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                      </div>
                      <div className="hr-line-y" />
                      <div className="ItemStackActiveItem">
                        <img src={EbaySvg} alt="eBay" />
                        <div className="ButtonInteract">
                          <button className='ButtonOn' onClick={() => window.open(product.ebayUrl || 'https://www.ebay.com', '_blank')}>
                            <p>Order in EBay</p>
                          </button>
                        </div>
                        <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <button className='ButtonOff2' onClick={nextSlide}><img src={RightSvg} alt="Right" /></button>
        </div>
      </div>
    </div>
  )
}

export default Products