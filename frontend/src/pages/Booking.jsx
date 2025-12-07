import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getHotelById, createBooking, validateOffer } from '../utils/api'
import ImageWithFallback from '../components/ImageWithFallback'
import './Booking.css'

function Booking({ showToast, user }) {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({
    checkIn: location.state?.checkIn || '',
    checkOut: location.state?.checkOut || '',
    guests: location.state?.guests || 2,
    rooms: location.state?.rooms || 1,
    guestDetails: {
      name: user?.name || '',
      email: user?.email || '',
      phone: ''
    },
    offerCode: ''
  })
  const [offerValid, setOfferValid] = useState(null)
  const [calculations, setCalculations] = useState(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!user) {
      showToast('Please login to continue', 'error')
      navigate('/login')
      return
    }
    loadHotel()
  }, [hotelId])

  useEffect(() => {
    if (hotel && booking.checkIn && booking.checkOut) {
      calculateTotal()
    }
  }, [hotel, booking.checkIn, booking.checkOut, booking.rooms, booking.offerCode])

  const loadHotel = async () => {
    try {
      setLoading(true)
      const data = await getHotelById(hotelId)
      setHotel(data.hotel || data)
    } catch (error) {
      showToast('Failed to load hotel details', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!hotel || !booking.checkIn || !booking.checkOut) return

    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) {
      setCalculations(null)
      return
    }

    const basePrice = hotel.price * nights * booking.rooms
    const tax = basePrice * 0.18 // 18% GST
    const serviceFee = basePrice * 0.05 // 5% service fee
    
    // Calculate discount
    let discountAmount = 0
    if (offerValid) {
      if (offerValid.discount) {
        // Percentage discount
        discountAmount = (basePrice * offerValid.discount) / 100
        if (offerValid.offer?.maxDiscountAmount && discountAmount > offerValid.offer.maxDiscountAmount) {
          discountAmount = offerValid.offer.maxDiscountAmount
        }
      } else if (offerValid.discountAmount) {
        // Fixed discount
        discountAmount = offerValid.discountAmount
      }
    }
    
    const total = basePrice + tax + serviceFee - discountAmount

    setCalculations({
      nights,
      basePrice,
      tax,
      serviceFee,
      discount: offerValid?.discount || 0,
      discountAmount,
      total
    })
  }

  const handleOfferValidate = async () => {
    if (!booking.offerCode) {
      showToast('Please enter an offer code', 'error')
      return
    }
    try {
      const data = await validateOffer(booking.offerCode)
      setOfferValid(data)
      showToast(data.message || 'Offer applied successfully!', 'success')
    } catch (error) {
      setOfferValid(null)
      showToast(error.response?.data?.error || 'Invalid offer code', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!calculations) {
      showToast('Please check your booking dates', 'error')
      return
    }

    setProcessing(true)
    try {
      const bookingData = {
        hotelId,
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        numberOfRooms: booking.rooms,
        numberOfGuests: booking.guests,
        guestDetails: booking.guestDetails,
        offerCode: booking.offerCode || undefined
      }

      const data = await createBooking(bookingData)
      showToast('Booking confirmed successfully!', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error.response?.data?.error || 'Booking failed. Please try again.', 'error')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="booking-page">
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
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>

        <div className="booking-content">
          <div className="booking-main">
            {/* Hotel Summary */}
            <section className="hotel-summary">
              <div className="summary-image">
                <ImageWithFallback 
                  src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format'} 
                  alt={hotel.name} 
                />
              </div>
              <div className="summary-info">
                <h2>{hotel.name}</h2>
                <p><i className="fas fa-map-marker-alt"></i> {hotel.location || hotel.city}</p>
                <div className="summary-rating">
                  <i className="fas fa-star"></i> {hotel.rating || 4.5}
                </div>
              </div>
            </section>

            {/* Booking Form */}
            <form className="booking-form" onSubmit={handleSubmit}>
              <h3>Booking Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-calendar-alt"></i> Check-in</label>
                  <input
                    type="date"
                    value={booking.checkIn}
                    onChange={(e) => setBooking({...booking, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-calendar-check"></i> Check-out</label>
                  <input
                    type="date"
                    value={booking.checkOut}
                    onChange={(e) => setBooking({...booking, checkOut: e.target.value})}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-users"></i> Guests</label>
                  <select
                    value={booking.guests}
                    onChange={(e) => setBooking({...booking, guests: parseInt(e.target.value)})}
                    required
                  >
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label><i className="fas fa-bed"></i> Rooms</label>
                  <select
                    value={booking.rooms}
                    onChange={(e) => setBooking({...booking, rooms: parseInt(e.target.value)})}
                    required
                  >
                    {[1,2,3,4].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h3>Guest Information</h3>
              
              <div className="form-group">
                <label><i className="fas fa-user"></i> Full Name</label>
                <input
                  type="text"
                  value={booking.guestDetails.name}
                  onChange={(e) => setBooking({
                    ...booking,
                    guestDetails: {...booking.guestDetails, name: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-envelope"></i> Email</label>
                  <input
                    type="email"
                    value={booking.guestDetails.email}
                    onChange={(e) => setBooking({
                      ...booking,
                      guestDetails: {...booking.guestDetails, email: e.target.value}
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><i className="fas fa-phone"></i> Phone</label>
                  <input
                    type="tel"
                    value={booking.guestDetails.phone}
                    onChange={(e) => setBooking({
                      ...booking,
                      guestDetails: {...booking.guestDetails, phone: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>

              <h3>Special Offers</h3>
              
              <div className="offer-section">
                <div className="offer-input">
                  <input
                    type="text"
                    placeholder="Enter offer code"
                    value={booking.offerCode}
                    onChange={(e) => setBooking({...booking, offerCode: e.target.value})}
                  />
                  <button type="button" onClick={handleOfferValidate} className="btn-validate">
                    Apply
                  </button>
                </div>
                {offerValid && (
                  <div className="offer-success">
                    <i className="fas fa-check-circle"></i>
                    {offerValid.message} - {offerValid.discount}% off
                  </div>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={processing || !calculations}>
                {processing ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Price Summary */}
          <aside className="price-summary">
            <h3>Price Summary</h3>
            
            {calculations ? (
              <>
                <div className="summary-row">
                  <span>₹{hotel.price?.toLocaleString()} × {calculations.nights} nights × {booking.rooms} room(s)</span>
                  <span>₹{calculations.basePrice.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (18% GST)</span>
                  <span>₹{calculations.tax.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Service Fee</span>
                  <span>₹{calculations.serviceFee.toLocaleString()}</span>
                </div>
                
                {calculations.discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount {offerValid?.discount ? `(${offerValid.discount}%)` : ''}</span>
                    <span>-₹{calculations.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="summary-total">
                  <span>Total Amount</span>
                  <span>₹{calculations.total.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <p className="no-calculation">Select dates to see pricing</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Booking

