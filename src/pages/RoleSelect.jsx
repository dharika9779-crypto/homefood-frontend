import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const roles = [
  { id: 'student', icon: '🎓', title: 'Student / Customer', desc: 'Find affordable homemade meals from cooks near your PG or hostel.' },
  { id: 'cook', icon: '👩‍🍳', title: 'Home Cook', desc: 'Share your homemade food with nearby students and earn money.' },
  { id: 'delivery', icon: '🛵', title: 'Delivery Partner', desc: 'Earn by delivering food in your local area. Flexible hours.' },
]

export default function RoleSelect() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>I am a...</h1>
        <p style={{ color: '#6B6B6B', textAlign: 'center', marginBottom: 32 }}>Choose your role to get started</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {roles.map((r) => (
            <div key={r.id} onClick={() => setSelected(r.id)}
              style={{
                background: selected === r.id ? '#FFF4EE' : '#fff',
                border: `2px solid ${selected === r.id ? '#E8580A' : '#E8E0D5'}`,
                borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.2s'
              }}>
              <span style={{ fontSize: 36 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{r.title}</div>
                <div style={{ color: '#6B6B6B', fontSize: 13 }}>{r.desc}</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === r.id ? '#E8580A' : '#E8E0D5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selected === r.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E8580A' }} />}
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={() => navigate('/login', { state: { role: selected } })}
          style={{
            width: '100%', padding: '14px', borderRadius: 999, fontSize: 15, fontWeight: 500, border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
            background: selected ? '#E8580A' : '#E8E0D5', color: selected ? '#fff' : '#6B6B6B', transition: 'all 0.2s'
          }}>
          Continue →
        </button>
      </div>
    </div>
  )
}
