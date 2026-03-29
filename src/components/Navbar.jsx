import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const getDashboard = () => {
    if (!user) return '/login'
    if (user.role === 'cook') return '/cook-dashboard'
    if (user.role === 'delivery') return '/delivery-dashboard'
    return '/student'
  }

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #E8E0D5', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#E8580A', textDecoration: 'none' }}>
          🍱 HomeFood
        </Link>

        <input
          placeholder="Search cooks, dishes..."
          style={{ border: '1px solid #E8E0D5', borderRadius: 999, padding: '8px 16px', fontSize: 14, width: 300, outline: 'none' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <Link to={getDashboard()} style={{ fontSize: 14, color: '#6B6B6B', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/poll" style={{ fontSize: 14, color: '#6B6B6B', textDecoration: 'none' }}>Polls</Link>
              {user.role === 'student' && (
                <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', fontSize: 20 }}>
                  🛒
                  {cart.length > 0 && (
                    <span style={{ position: 'absolute', top: -8, right: -8, background: '#E8580A', color: '#fff', fontSize: 11, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
              <span style={{ fontSize: 14, fontWeight: 500 }}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} style={{ fontSize: 14, color: '#D63C3C', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, color: '#6B6B6B', textDecoration: 'none' }}>Login</Link>
              <Link to="/role-select" style={{ background: '#E8580A', color: '#fff', fontSize: 14, padding: '8px 20px', borderRadius: 999, textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
