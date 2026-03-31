import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookDashboard, toggleAvailability, updateOrderStatus } from '../api'
import { useAuth } from '../context/AuthContext'

const statusStyle = {
  preparing: { background: '#FEF9C3', color: '#854D0E' },
  ready: { background: '#DBEAFE', color: '#1E40AF' },
  delivered: { background: '#DCFCE7', color: '#166534' },
}

const fakeData = {
  cook: { id: 'cook_1', name: 'Sunita Tai', kitchen_name: "Sunita Tai's Kitchen", is_open: true, rating: 4.9, trust_score: 92, menu: [{ id: 'item_1', name: 'Dal Rice', available: true }, { id: 'item_2', name: 'Sabji Roti', available: true }, { id: 'item_3', name: 'Rajma Chawal', available: false }] },
  stats: { today_orders: 12, weekly_earnings: 3240, rating: 4.9, active_subscribers: 8 },
  orders: [
    { id: 'o1', student_name: 'Riya Sharma', items: [{ quantity: 2, name: 'Dal Rice' }], created_at: new Date().toISOString(), status: 'preparing' },
    { id: 'o2', student_name: 'Amit Verma', items: [{ quantity: 1, name: 'Sabji Roti' }], created_at: new Date().toISOString(), status: 'ready' },
  ]
}

export default function CookDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCookDashboard('cook_1').then(({ data: d }) => setData(d)).catch(() => setData(fakeData)).finally(() => setLoading(false))
  }, [])

  const handleToggle = async () => {
    try { await toggleAvailability(data.cook.id, { is_open: !data.cook.is_open }) } catch {}
    setData((prev) => ({ ...prev, cook: { ...prev.cook, is_open: !prev.cook.is_open } }))
  }

  const handleStatus = async (orderId, status) => {
    try { await updateOrderStatus({ order_id: orderId, status }) } catch {}
    setData((prev) => ({ ...prev, orders: prev.orders.map((o) => o.id === orderId ? { ...o, status } : o) }))
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>Loading...</div>

  const { cook, stats, orders } = data

  const sideBtn = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, fontSize: 14, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#6B6B6B', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FDF8F2' }}>
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #E8E0D5', display: 'flex', flexDirection: 'column', padding: 16, gap: 4 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#E8580A', padding: '8px 14px', marginBottom: 16 }}>🍱 HomeFood</div>
        {[['🏠', 'Dashboard'], ['📦', 'Orders'], ['🗳️', 'Polls'], ['👤', 'Profile']].map(([icon, label]) => (
          <button key={label} onClick={() => label === 'Polls' && navigate('/poll')} style={sideBtn}>{icon} {label}</button>
        ))}
        <button onClick={() => { logout(); navigate('/') }} style={{ ...sideBtn, color: '#D63C3C', marginTop: 'auto' }}>🚪 Logout</button>
      </div>

      <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>Namaste 🙏</h1>
            <p style={{ color: '#6B6B6B', fontSize: 14, marginTop: 4 }}>Here's your kitchen summary for today</p>
          </div>
          <button onClick={handleToggle} style={{ padding: '10px 24px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit', background: cook.is_open ? '#22C55E' : '#9CA3AF', color: '#fff' }}>
            {cook.is_open ? '● OPEN' : '● CLOSED'}
          </button>
        </div>

        
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Today's Orders</h2>
          {orders.length === 0 ? <p style={{ color: '#6B6B6B', textAlign: 'center', padding: '24px 0' }}>No active orders right now</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ color: '#6B6B6B', borderBottom: '1px solid #E8E0D5' }}>
                  {['Student', 'Items', 'Time', 'Status', 'Action'].map((h) => <th key={h} style={{ textAlign: 'left', paddingBottom: 12, fontWeight: 500 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #E8E0D5' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600 }}>{order.student_name}</td>
                    <td style={{ color: '#6B6B6B' }}>{order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</td>
                    <td style={{ color: '#6B6B6B' }}>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <span style={{ ...statusStyle[order.status], padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {order.status === 'preparing' && (
                        <button onClick={() => handleStatus(order.id, 'ready')} style={{ background: '#E8580A', color: '#fff', padding: '5px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Mark Ready</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Menu Items</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
            {cook.menu.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E8E0D5', borderRadius: 12, padding: '12px 16px' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: item.available ? '#DCFCE7' : '#F3F4F6', color: item.available ? '#166534' : '#6B7280' }}>
                  {item.available ? 'On' : 'Off'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
