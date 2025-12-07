import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getHotels, searchHotels } from '../utils/api'
import ImageCarousel from '../components/ImageCarousel'
import './HotelList.css'

function HotelList({ showToast }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    sortBy: 'price-asc'
  })

  useEffect(() => {
    loadHotels()
  }, [])

  const loadHotels = async () => {
    try {
      setLoading(true)
      const city = searchParams.get('city')
      let data
      
      if (city) {
        data = await searchHotels(city)
      } else {
        data = await getHotels()
      }
      
      setHotels(data.hotels || data || [])
    } catch (error) {
      showToast('Failed to load hotels', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const filteredHotels = hotels
    .filter(hotel => {
      if (filters.city && !hotel.city?.toLowerCase().includes(filters.city.toLowerCase())) {
        return false
      }
      if (hotel.price < filters.minPrice || hotel.price > filters.maxPrice) {
        return false
      }
      if (hotel.rating < filters.minRating) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="hotel-list">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="hotel-list">
      <div className="container">
        <div className="listings-header">
          <h1>Find Your Perfect Stay</h1>
          <p>{filteredHotels.length} hotels found</p>
        </div>

        <div className="listings-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                placeholder="Search city..."
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}</label>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </aside>

          {/* Hotels Grid */}
          <div className="hotels-grid">
            {filteredHotels.length === 0 ? (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No hotels found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              filteredHotels.map((hotel, idx) => {
                // Generate multiple images for carousel
                const hotelImages = [
                  hotel.image || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format&sig=${idx}`,
                  `https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop&auto=format&sig=${idx + 10}`,
                  `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format&sig=${idx + 20}`
                ]

                return (
                  <div
                    key={hotel._id || hotel.id}
                    className="hotel-card"
                    onClick={() => navigate(`/hotel/${hotel._id || hotel.id}`)}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="hotel-image">
                      <ImageCarousel 
                        images={hotelImages} 
                        autoPlay={true} 
                        interval={3500}
                        key={hotel._id || hotel.id}
                      />
                      <div className="hotel-rating">
                        <i className="fas fa-star"></i>
                        <span>{hotel.rating || 4.5}</span>
                      </div>
                    </div>
                  <div className="hotel-info">
                    <h3>{hotel.name}</h3>
                    <p className="hotel-location">
                      <i className="fas fa-map-marker-alt"></i> {hotel.location || hotel.city}
                    </p>
                    <div className="hotel-amenities">
                      {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                    <div className="hotel-footer">
                      <div className="hotel-price">
                        <span className="price-amount">₹{hotel.price?.toLocaleString() || '5000'}</span>
                        <span className="price-period">/ night</span>
                      </div>
                      <button className="btn-view">View Details</button>
                    </div>
                  </div>
                </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelList

