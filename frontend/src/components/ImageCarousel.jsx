import { useState, useEffect } from 'react'
import ImageWithFallback from './ImageWithFallback'
import './ImageCarousel.css'

function ImageCarousel({ images, autoPlay = true, interval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!autoPlay || isHovered || !images || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images, isHovered])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <div className="carousel-image">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format" 
            alt="Default hotel"
          />
        </div>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="image-carousel">
        <div className="carousel-image">
          <ImageWithFallback src={images[0]} alt="Hotel" />
        </div>
      </div>
    )
  }

  return (
    <div 
      className="image-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''} ${
              index < currentIndex ? 'prev' : 'next'
            }`}
          >
            <ImageWithFallback 
              src={image} 
              alt={`Hotel view ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel-btn prev-btn" onClick={goToPrevious}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-btn next-btn" onClick={goToNext}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="carousel-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ImageCarousel

