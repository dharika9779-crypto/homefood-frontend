import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCooks } from '../api'
import { useAuth } from '../context/AuthContext'

const filters = ['All', 'Veg', 'Non-Veg', 'Top Rated', 'Under ₹80', 'Open Now']

export default function StudentHome() {
  const [cooks, setCooks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getCooks()
      .then(({ data }) => { setCooks(data); setFiltered(data) })
      .catch(() => {
        const fake = [
          { id: 'cook_1', kitchen_name: "Sunita Tai's Kitchen", name: 'Sunita Tai', cuisine_types: ['Maharashtrian'], food_type: 'veg', rating: 4.9, trust_score: 92, is_open: true, price_from: 60 },
          { id: 'cook_2', kitchen_name: "Priya's South Indian Kitchen", name: 'Priya Didi', cuisine_types: ['South Indian'], food_type: 'veg', rating: 4.7, trust_score: 85, is_open: true, price_from: 55 },
          { id: 'cook_3', kitchen_name: "Meena's Punjabi Dhaba", name: 'Meena Bai', cuisine_types: ['Punjabi'], food_type: 'non-veg', rating: 4.5, trust_score: 78, is_open: false, price_from: 80 },
        ]
        setCooks(fake); setFiltered(fake)
      })
      .finally(() => setLoading(false))
  }, [])

  const applyFilter = (f) => {
    setActive(f)
    let r = [...cooks]
    if (f === 'Veg') r = r.filter((c) => c.food_type === 'veg')
    else if (f === 'Non-Veg') r = r.filter((c) => c.food_type === 'non-veg')
    else if (f === 'Top Rated') r = r.filter((c) => c.rating >= 4.7)
    else if (f === 'Under ₹80') r = r.filter((c) => c.price_from < 80)
    else if (f === 'Open Now') r = r.filter((c) => c.is_open)
    setFiltered(r)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700 }}>
            Good afternoon, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ color: '#6B6B6B', marginTop: 4 }}>📍 Koregaon Park, Pune · {cooks.length} cooks near you</p>
        </div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 32 }}>
          {filters.map((f) => (
            <button key={f} onClick={() => applyFilter(f)} style={{
              whiteSpace: 'nowrap', padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all 0.2s', fontFamily: 'inherit',
              background: active === f ? '#E8580A' : '#fff', color: active === f ? '#fff' : '#6B6B6B', borderColor: active === f ? '#E8580A' : '#E8E0D5'
            }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>Loading cooks near you...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>No cooks found for this filter.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filtered.map((cook) => (
              <div key={cook.id} style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', background: cook.food_type === 'veg' ? '#2D9B5A' : '#E8580A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0,
                    boxShadow: `0 0 0 3px ${cook.trust_score > 80 ? '#F5C518' : '#E8E0D5'}`
                  }}>{cook.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{cook.kitchen_name}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {cook.cuisine_types.map((c) => (
                        <span key={c} style={{ background: '#FFF4EE', color: '#E8580A', fontSize: 12, padding: '2px 10px', borderRadius: 999 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, fontWeight: 500, background: cook.is_open ? '#DCFCE7' : '#F3F4F6', color: cook.is_open ? '#166534' : '#6B7280' }}>
                    {cook.is_open ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>
                  <span>⭐ {cook.rating}</span>
                  <span>📍 0.4 km</span>
                  <span style={{ color: cook.food_type === 'veg' ? '#2D9B5A' : '#D63C3C' }}>
                    {cook.food_type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: '#E8580A', fontSize: 15 }}>From ₹{cook.price_from}/meal</span>
                  <button onClick={() => navigate(`/cook/${cook.id}`)} style={{
                    fontSize: 13, color: '#E8580A', border: '1px solid #E8580A', padding: '6px 16px', borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit'
                  }}>View Menu →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
