import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import HotelList from './pages/HotelList'
import HotelDetails from './pages/HotelDetails'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/hotels" element={<HotelList showToast={showToast} />} />
          <Route path="/hotel/:id" element={<HotelDetails showToast={showToast} user={user} />} />
          <Route path="/booking/:hotelId" element={<Booking showToast={showToast} user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} showToast={showToast} />} />
          <Route path="/register" element={<Register setUser={setUser} showToast={showToast} />} />
          <Route path="/dashboard" element={<Dashboard user={user} showToast={showToast} />} />
        </Routes>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    </Router>
  )
}

export default App

