import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookings } from '../utils/api'
import './Dashboard.css'

function Dashboard({ user, showToast }) {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadBookings()
  }, [user])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await getBookings()
      setBookings(data.bookings || data || [])
    } catch (error) {
      showToast('Failed to load bookings', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.paymentStatus === 'CONFIRMED').length}</h3>
              <p>Confirmed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>{bookings.filter(b => b.paymentStatus === 'PENDING').length}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        <div className="bookings-section">
          <h2>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <i className="fas fa-calendar-times"></i>
              <h3>No bookings yet</h3>
              <p>Start exploring amazing hotels and book your stay!</p>
              <button onClick={() => navigate('/hotels')} className="btn btn-primary">
                Browse Hotels
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div>
                      <h3>{booking.hotelName || 'Hotel'}</h3>
                      <p className="booking-id">Booking ID: {booking.bookingId || booking._id}</p>
                    </div>
                    <div className={`status-badge ${booking.paymentStatus?.toLowerCase()}`}>
                      {booking.paymentStatus || 'PENDING'}
                    </div>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <div>
                        <span className="label">Check-in</span>
                        <span className="value">
                          {new Date(booking.checkIn || booking.checkInDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar-check"></i>
                      <div>
                        <span className="label">Check-out</span>
                        <span className="value">
                          {new Date(booking.checkOut || booking.checkOutDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-moon"></i>
                      <div>
                        <span className="label">Nights</span>
                        <span className="value">{booking.nights || booking.numberOfNights}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-users"></i>
                      <div>
                        <span className="label">Guests</span>
                        <span className="value">{booking.guests || booking.numberOfGuests}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-bed"></i>
                      <div>
                        <span className="label">Rooms</span>
                        <span className="value">{booking.rooms || booking.numberOfRooms}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-footer">
                    <div className="booking-total">
                      <span className="total-label">Total Amount</span>
                      <span className="total-amount">
                        ₹{(booking.totalPayable || booking.totalPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

