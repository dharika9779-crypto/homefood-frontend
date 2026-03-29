import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import RoleSelect from './pages/RoleSelect'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import CookProfile from './pages/CookProfile'
import Cart from './pages/Cart'
import Poll from './pages/Poll'
import CookDashboard from './pages/CookDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import Rating from './pages/Rating'

const HIDE_NAVBAR = ['/login', '/role-select', '/cook-dashboard', '/delivery-dashboard']

function AppContent() {
  const location = useLocation()
  const showNav = !HIDE_NAVBAR.some((p) => location.pathname.startsWith(p))

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentHome />} />
        <Route path="/cook/:id" element={<CookProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/poll" element={<Poll />} />
        <Route path="/cook-dashboard" element={<CookDashboard />} />
        <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
        <Route path="/rate/:orderId" element={<Rating />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
