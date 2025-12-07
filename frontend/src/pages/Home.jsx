import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'
import AnimatedBackground from '../components/AnimatedBackground'
import './Home.css'

function Home({ showToast }) {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchData.city) {
      showToast('Please enter a city', 'error')
      return
    }
    if (!searchData.checkIn || !searchData.checkOut) {
      showToast('Please select check-in and check-out dates', 'error')
      return
    }
    navigate(`/hotels?city=${searchData.city}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}&rooms=${searchData.rooms}`)
  }

  const popularDestinations = [
    { 
      name: 'Goa', 
      images: [
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format'
      ],
      desc: 'Beach Paradise' 
    },
    { 
      name: 'Mumbai', 
      images: [
        'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&auto=format'
      ],
      desc: 'City of Dreams' 
    },
    { 
      name: 'Delhi', 
      images: [
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&h=600&fit=crop&auto=format'
      ],
      desc: 'Historic Capital' 
    },
    { 
      name: 'Bangalore', 
      images: [
        'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format'
      ],
      desc: 'Tech Hub' 
    },
    { 
      name: 'Dubai', 
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&auto=format'
      ],
      desc: 'Luxury Destination' 
    },
    { 
      name: 'Bali', 
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format'
      ],
      desc: 'Tropical Paradise' 
    }
  ]

  return (
    <div className="home">
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect Stay
            <span className="highlight"> Anywhere</span>
          </h1>
          <p className="hero-subtitle">
            Discover amazing hotels and resorts around the world. Book with confidence and enjoy unforgettable experiences.
          </p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-grid">
              <div className="search-field">
                <label><i className="fas fa-map-marker-alt"></i> Where to?</label>
                <input
                  type="text"
                  placeholder="Enter city or destination"
                  value={searchData.city}
                  onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                  required
                />
              </div>
              
              <div className="search-field">
                <label><i className="fas fa-calendar-alt"></i> Check-in</label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="search-field">
                <label><i className="fas fa-calendar-check"></i> Check-out</label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="search-field">
                <label><i className="fas fa-users"></i> Guests</label>
                <select
                  value={searchData.guests}
                  onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              
              <div className="search-field">
                <label><i className="fas fa-bed"></i> Rooms</label>
                <select
                  value={searchData.rooms}
                  onChange={(e) => setSearchData({...searchData, rooms: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i> Search Hotels
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          <div className="destinations-grid">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="destination-card"
                onClick={() => {
                  setSearchData({...searchData, city: dest.name})
                  navigate(`/hotels?city=${dest.name}`)
                }}
              >
                <div className="destination-image">
                  <ImageCarousel images={dest.images} autoPlay={true} interval={3000} />
                  <div className="destination-overlay">
                    <h3>{dest.name}</h3>
                    <p>{dest.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose BookMyStay?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Booking</h3>
              <p>Your data and payments are protected with industry-leading security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tag"></i>
              </div>
              <h3>Best Prices</h3>
              <p>We guarantee the best rates or we'll match the difference.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is available around the clock.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Verified Reviews</h3>
              <p>Read authentic reviews from verified guests.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

