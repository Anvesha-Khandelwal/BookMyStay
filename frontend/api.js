const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('authToken');
}


const api = {
  
  getAllHotels: async () => {
    const response = await fetch(`${API_URL}/hotels`);
    return response.json();
  },
  
 
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },
  
 
  validateOffer: async (offerCode, bookingAmount) => {
    const response = await fetch(`${API_URL}/bookings/validate-offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerCode, bookingAmount })
    });
    return response.json();
  }
};