import { useState } from 'react'
import './ImageWithFallback.css'

function ImageWithFallback({ src, alt, className, fallback = 'https://via.placeholder.com/800x600/0d6e7c/ffffff?text=Hotel+Image' }) {
  const [imageSrc, setImageSrc] = useState(src)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleError = () => {
    if (imageSrc !== fallback) {
      setImageSrc(fallback)
      setError(true)
    }
    setLoading(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  return (
    <div className={`image-wrapper ${className || ''}`}>
      {loading && !error && (
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${loading ? 'loading' : 'loaded'}`}
        style={{ display: error && !imageSrc ? 'none' : 'block' }}
      />
    </div>
  )
}

export default ImageWithFallback

