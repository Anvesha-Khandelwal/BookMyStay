import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getHotelById } from '../utils/api'
import './HotelDetails.css'

function HotelDetails({ showToast, user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  })

  useEffect(() => {
    loadHotel()
  }, [id])

  const loadHotel = async () => {
    try {
      setLoading(true)
      const data = await getHotelById(id)
      setHotel(data.hotel || data)
    } catch (error) {
      showToast('Failed to load hotel details', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!user) {
      showToast('Please login to book', 'error')
      navigate('/login')
      return
    }
    if (!bookingData.checkIn || !bookingData.checkOut) {
      showToast('Please select check-in and check-out dates', 'error')
      return
    }
    navigate(`/booking/${id}`, { state: bookingData })
  }

  if (loading) {
    return (
      <div className="hotel-details">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="hotel-details">
        <div className="container">
          <div className="no-hotel">
            <h2>Hotel not found</h2>
            <button onClick={() => navigate('/hotels')} className="btn btn-primary">
              Browse Hotels
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hotel-details">
      <div className="container">
        {/* Hotel Header */}
        <div className="hotel-header">
          <h1>{hotel.name}</h1>
          <p className="hotel-location">
            <i className="fas fa-map-marker-alt"></i> {hotel.location || hotel.city}
          </p>
          <div className="hotel-rating-badge">
            <i className="fas fa-star"></i>
            <span>{hotel.rating || 4.5}</span>
            <span className="reviews">({hotel.reviews || 0} reviews)</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="gallery-section">
          <div className="gallery-main">
            <img
              src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
              alt={hotel.name}
            />
          </div>
        </div>

        <div className="details-content">
          <div className="details-main">
            {/* Description */}
            <section className="description-section">
              <h2>About this property</h2>
              <p>{hotel.description || 'Experience luxury and comfort at this amazing property.'}</p>
            </section>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="amenities-section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {hotel.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-item">
                      <i className="fas fa-check-circle"></i>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Attractions */}
            {hotel.attractions && hotel.attractions.length > 0 && (
              <section className="attractions-section">
                <h2>Nearby Attractions</h2>
                <div className="attractions-list">
                  {hotel.attractions.map((attraction, idx) => (
                    <div key={idx} className="attraction-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{attraction}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking Card */}
          <aside className="booking-card">
            <div className="booking-header">
              <div className="price-display">
                <span className="price">₹{hotel.price?.toLocaleString() || '5000'}</span>
                <span className="period">/ night</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={(e) => { e.preventDefault(); handleBookNow(); }}>
              <div className="form-group">
                <label><i className="fas fa-calendar-alt"></i> Check-in</label>
                <input
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-calendar-check"></i> Check-out</label>
                <input
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                  min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fas fa-users"></i> Guests</label>
                <select
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><i className="fas fa-bed"></i> Rooms</label>
                <select
                  value={bookingData.rooms}
                  onChange={(e) => setBookingData({...bookingData, rooms: parseInt(e.target.value)})}
                >
                  {[1,2,3,4].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-book">
                <i className="fas fa-calendar-check"></i> Book Now
              </button>
            </form>

            <div className="booking-features">
              <div className="feature">
                <i className="fas fa-check-circle"></i>
                <span>Free cancellation</span>
              </div>
              <div className="feature">
                <i className="fas fa-wifi"></i>
                <span>Free WiFi</span>
              </div>
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <span>Secure booking</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default HotelDetails

