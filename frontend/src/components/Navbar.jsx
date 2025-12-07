import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-building"></i>
          <span>BookMyStay</span>
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/hotels">Hotels</Link></li>
          {user && (
            <li><Link to="/dashboard">Dashboard</Link></li>
          )}
          {user ? (
            <li className="user-menu">
              <span className="user-name">
                <i className="fas fa-user-circle"></i> {user.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn-login">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

