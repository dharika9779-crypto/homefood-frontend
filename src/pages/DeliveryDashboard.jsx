import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailableDeliveries, updateOrderStatus } from '../api'
import { useAuth } from '../context/AuthContext'

const steps = ['Pickup', 'On the way', 'Delivered']

const fakeOrders = [
  { id: 'order_fake1', cook_name: 'Sunita Tai', pickup_location: 'Kalamboli', student_name: 'Riya Sharma', delivery_address: 'Shivaji Nagar PG, Room 12', delivery_earnings: 30 },
  { id: 'order_fake2', cook_name: 'Priya Didi', pickup_location: 'Kalamboli', student_name: 'Amit Verma', delivery_address: 'Kalyani Nagar PG, Room 5', delivery_earnings: 25 },
]

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([])
  const [active, setActive] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [online, setOnline] = useState(true)
  const [earnings, setEarnings] = useState(320)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getAvailableDeliveries()
      .then(({ data }) => setOrders(data.length ? data : fakeOrders))
      .catch(() => setOrders(fakeOrders))
  }, [])

  const acceptOrder = (order) => {
    setActive(order)
    setOrders((prev) => prev.filter((o) => o.id !== order.id))
    setActiveStep(0)
  }

  const nextStep = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1)
    } else {
      try { await updateOrderStatus({ order_id: active.id, status: 'delivered' }) } catch {}
      setEarnings((e) => e + active.delivery_earnings)
      setActive(null)
      setActiveStep(0)
    }
  }

  const sideBtn = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, fontSize: 14, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#6B6B6B', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FDF8F2' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #E8E0D5', display: 'flex', flexDirection: 'column', padding: 16, gap: 4 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#E8580A', padding: '8px 14px', marginBottom: 16 }}>🍱 HomeFood</div>
        {[['🏠', 'Dashboard'], ['📦', 'My Deliveries'], ['💰', 'Earnings']].map(([icon, label]) => (
          <button key={label} style={sideBtn}>{icon} {label}</button>
        ))}
        <button onClick={() => { logout(); navigate('/') }} style={{ ...sideBtn, color: '#D63C3C', marginTop: 'auto' }}>🚪 Logout</button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>Available Orders 🛵</h1>
            <p style={{ color: '#6B6B6B', fontSize: 14, marginTop: 4 }}>Accept deliveries in your area</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ background: '#DCFCE7', color: '#166534', padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500 }}>💰 ₹{earnings} earned today</span>
            <button onClick={() => setOnline(!online)} style={{ padding: '10px 24px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit', background: online ? '#22C55E' : '#9CA3AF', color: '#fff' }}>
              {online ? '● Online' : '● Offline'}
            </button>
          </div>
        </div>

        {/* Active Delivery */}
        {active && (
          <div style={{ background: '#fff', borderRadius: 20, border: '2px solid #E8580A', padding: 24, marginBottom: 28 }}>
            <h2 style={{ fontWeight: 700, fontSize: 17, color: '#E8580A', marginBottom: 20 }}>Active Delivery</h2>

            {/* Step Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              {steps.map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: i <= activeStep ? '#E8580A' : '#E8E0D5', color: i <= activeStep ? '#fff' : '#6B6B6B' }}>
                    {i < activeStep ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: i <= activeStep ? '#E8580A' : '#6B6B6B', fontWeight: i <= activeStep ? 600 : 400 }}>{step}</span>
                  {i < steps.length - 1 && <div style={{ width: 48, height: 2, background: i < activeStep ? '#E8580A' : '#E8E0D5', borderRadius: 999 }} />}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#FFF4EE', borderRadius: 14, padding: 16 }}>
                <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 6 }}>📍 Pickup from</p>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{active.cook_name}</p>
                <p style={{ fontSize: 13, color: '#6B6B6B' }}>{active.pickup_location}</p>
              </div>
              <div style={{ background: '#FFF4EE', borderRadius: 14, padding: 16 }}>
                <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 6 }}>🏠 Deliver to</p>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>{active.student_name}</p>
                <p style={{ fontSize: 13, color: '#6B6B6B' }}>{active.delivery_address}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 14, color: '#6B6B6B' }}>📞 Student: <span style={{ color: '#1C1C1E', fontWeight: 600 }}>+91 98765 43210</span></p>
              <button onClick={nextStep} style={{ background: '#E8580A', color: '#fff', padding: '10px 28px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>
                {activeStep < steps.length - 1 ? `Next: ${steps[activeStep + 1]} →` : '✓ Mark as Delivered'}
              </button>
            </div>
          </div>
        )}

        {/* Available Orders */}
        <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Available Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B6B6B' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛵</div>
            <p>No orders available right now. Stay online!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => (
              <div key={order.id} style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>📍 Pickup</p>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{order.cook_name}</p>
                    <p style={{ fontSize: 13, color: '#6B6B6B' }}>{order.pickup_location}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>🏠 Drop</p>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{order.student_name}</p>
                    <p style={{ fontSize: 13, color: '#6B6B6B' }}>{order.delivery_address}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 64 }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 700, color: '#E8580A' }}>₹{order.delivery_earnings}</div>
                  <div style={{ fontSize: 12, color: '#6B6B6B' }}>earnings</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setOrders((prev) => prev.filter((o) => o.id !== order.id))} style={{ border: '1px solid #E8E0D5', color: '#6B6B6B', padding: '9px 18px', borderRadius: 999, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Decline</button>
                  <button onClick={() => acceptOrder(order)} style={{ background: '#E8580A', color: '#fff', padding: '9px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>Accept</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
