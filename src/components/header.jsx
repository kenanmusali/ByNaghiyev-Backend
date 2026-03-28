import React, { useState, useEffect, useRef } from 'react'
import RightSvg from "../../public/assets/svg/right.svg"
import LeftSvg  from "../../public/assets/svg/left.svg"

// Fallback local images (still used if no remote data)
import Header1Img from "../../public/assets/img/header/header1.png"
import Header2Img from "../../public/assets/img/header/header2.png"

const DEFAULT_DATA = {
  subtitle:  "HAND MADE LUXURY",
  title:     "Transform your home WITH bY NAGHIYEV, Products and change the energy!",
  cta1Label: "DISCOVER COLLECTION",
  cta2Label: "Order Now",
  images: [
    { id: '1', src: Header1Img, alt: "Header 1" },
    { id: '2', src: Header2Img, alt: "Header 2" },
  ]
}

const Header = ({ headerData }) => {
  const d = headerData ?? DEFAULT_DATA

  // Normalise images: accept either .url or .src fields
  const images = (d.images ?? []).map(img => ({
    ...img,
    src: img.src || img.url || Header1Img,
  }))

  const [currentIdx,    setCurrentIdx]    = useState(0)
  const [nextIdx,       setNextIdx]       = useState(1)
  const [slideDir,      setSlideDir]      = useState('right')
  const [isAnimating,   setIsAnimating]   = useState(false)
  const timeoutRef = useRef(null)

  const nextImage = () => {
    if (isAnimating || images.length < 2) return
    setSlideDir('right')
    setNextIdx(currentIdx === images.length - 1 ? 0 : currentIdx + 1)
    setIsAnimating(true)
  }

  const prevImage = () => {
    if (isAnimating || images.length < 2) return
    setSlideDir('left')
    setNextIdx(currentIdx === 0 ? images.length - 1 : currentIdx - 1)
    setIsAnimating(true)
  }

  const goToImage = (index) => {
    if (isAnimating || index === currentIdx || images.length < 2) return
    setSlideDir(index > currentIdx ? 'right' : 'left')
    setNextIdx(index)
    setIsAnimating(true)
  }

  const handleAnimationEnd = () => {
    setCurrentIdx(nextIdx)
    setIsAnimating(false)
  }

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(nextImage, 5000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [currentIdx, isAnimating])

  if (!images.length) return null

  return (
    <div className='Header-Group' id='home'>
      <div className="Header-Text-Group">
        <button className='ButtonOff' onClick={prevImage}>
          <img src={LeftSvg} alt="Left" />
        </button>

        <div className="Text-Group">
          <p>{d.subtitle}</p>
          <h1>{d.title}</h1>
          <div className="Button-Group">
            <button className='ButtonOff'>{d.cta1Label}</button>
            <button className='ButtonOn'>{d.cta2Label}</button>
          </div>
          {images.length > 1 && (
            <div className="Carousel-Dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`Dot ${index === currentIdx ? 'Active' : ''}`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <button className='ButtonOff' onClick={nextImage}>
          <img src={RightSvg} alt="Right" />
        </button>
      </div>

      <div className="image-container">
        <img
          src={images[currentIdx].src}
          alt={images[currentIdx].alt}
          className="current-image"
        />
        {isAnimating && (
          <img
            src={images[nextIdx].src}
            alt={images[nextIdx].alt}
            className={`next-image slide-from-${slideDir}`}
            onAnimationEnd={handleAnimationEnd}
          />
        )}
      </div>
    </div>
  )
}

export default Header