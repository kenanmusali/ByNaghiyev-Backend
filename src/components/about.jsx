import React, { useState, useEffect } from 'react'
import RightSvg    from "../../public/assets/svg/right.svg"
import LeftSvg     from "../../public/assets/svg/left.svg"
import LogoTextSvg from "../../public/assets/svg/logo-text.svg"

const About = ({ aboutData }) => {
  const [title, setTitle] = useState('')
  const [paragraphs, setParagraphs] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || '')
      setParagraphs(aboutData.paragraphs || [])
      
      const normalizedImages = (aboutData.images || []).map((img, index) => ({
        id: img.id || index,
        src: img.url || img.src || '',
        alt: img.alt || 'About image'
      }));
      setImages(normalizedImages);
    }
  }, [aboutData]);

  const handleRight = () => {
    if (images.length === 0) return
    setImages(prev => {
      const a = [...prev]
      a.push(a.shift())
      return a
    })
  }

  const handleLeft = () => {
    if (images.length === 0) return
    setImages(prev => {
      const a = [...prev]
      a.unshift(a.pop())
      return a
    })
  }

  if (!aboutData || (!title && paragraphs.length === 0 && images.length === 0)) {
    return null
  }

  return (
    <div className='About-Group Section-Slot' id='about'>
      {title && <h1 className='Section-Title'>{title}</h1>}

      <div className="Slider-Group">
        <div className="SubSlider">
          {images.length > 0 && (
            <>
              <button className='ButtonOff2' onClick={handleLeft}>
                <img src={LeftSvg} alt="Left" />
              </button>

              <div className="ImageStacks">
                {images.map((img) => (
                  <img 
                    key={img.id} 
                    src={img.src} 
                    alt={img.alt}
                    onError={(e) => {
                      console.error(`Failed to load image: ${img.src}`);
                    }}
                  />
                ))}
              </div>

              <button className='ButtonOff2' onClick={handleRight}>
                <img src={RightSvg} alt="Right" />
              </button>
            </>
          )}
        </div>

        <div className="SubText">
          <p>The</p>
          <img src={LogoTextSvg} alt="By Naghiyev" />
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About