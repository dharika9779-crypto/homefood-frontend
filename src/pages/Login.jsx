import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { registerUser, loginUser } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = location.state?.role || 'student'

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const redirect = (r) => {
    if (r === 'cook') navigate('/cook-dashboard')
    else if (r === 'delivery') navigate('/delivery-dashboard')
    else navigate('/student')
  }

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await loginUser({ phone: form.phone, password: form.password })
      login(data); redirect(data.role)
    } catch (err) { setError(err.response?.data?.detail || 'Login failed') }
    finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setLoading(true); setError('')
    try {
      const { data } = await registerUser({ name: form.name, phone: form.phone, email: form.email, password: form.password, role })
      login(data); redirect(data.role)
    } catch (err) { setError(err.response?.data?.detail || 'Registration failed') }
    finally { setLoading(false) }
  }

  const inp = { width: '100%', border: '1px solid #E8E0D5', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{ width: '50%', background: '#E8580A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🍱</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>HomeFood Connect</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>Ghar jaisa khana, paas mein</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 40, width: '100%', maxWidth: 280 }}>
          {['Dal Rice ₹60', 'Idli Sambar ₹50', 'Rajma Chawal ₹70', 'Misal Pav ₹55'].map((item) => (
            <div key={item} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 12px', fontSize: 13, color: '#fff', textAlign: 'center' }}>{item}</div>
          ))}
        </div>
      </div>

      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#FDF8F2' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 6 }}>
            {tab === 'login' ? 'Welcome back!' : 'Create account'}
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: 14, marginBottom: 24 }}>
            {tab === 'login' ? 'Login to continue' : `Registering as ${role}`}
          </p>

          <div style={{ display: 'flex', background: '#F5F0EA', borderRadius: 999, padding: 4, marginBottom: 24 }}>
            {['login', 'signup'].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '8px', borderRadius: 999, fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#E8580A' : '#6B6B6B',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
              }}>
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {error && <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: 12, fontSize: 14, marginBottom: 16 }}>{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', border: '1px solid #E8E0D5', borderRadius: 12, overflow: 'hidden' }}>
                <span style={{ background: '#F5F0EA', padding: '12px 14px', fontSize: 14, color: '#6B6B6B', display: 'flex', alignItems: 'center' }}>+91</span>
                <input name="phone" placeholder="Phone number" onChange={handle} required style={{ flex: 1, border: 'none', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <input name="password" type="password" placeholder="Password" onChange={handle} required style={inp} />
              <button type="submit" disabled={loading} style={{ background: '#E8580A', color: '#fff', padding: 14, borderRadius: 999, fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input name="name" placeholder="Full name" onChange={handle} required style={inp} />
              <div style={{ display: 'flex', border: '1px solid #E8E0D5', borderRadius: 12, overflow: 'hidden' }}>
                <span style={{ background: '#F5F0EA', padding: '12px 14px', fontSize: 14, color: '#6B6B6B', display: 'flex', alignItems: 'center' }}>+91</span>
                <input name="phone" placeholder="Phone number" onChange={handle} required style={{ flex: 1, border: 'none', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <input name="email" type="email" placeholder="Email (optional)" onChange={handle} style={inp} />
              <input name="password" type="password" placeholder="Password" onChange={handle} required style={inp} />
              <input name="confirm" type="password" placeholder="Confirm password" onChange={handle} required style={inp} />
              <button type="submit" disabled={loading} style={{ background: '#E8580A', color: '#fff', padding: 14, borderRadius: 999, fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
