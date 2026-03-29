import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCook } from '../api'
import { useCart } from '../context/CartContext'

const TABS = ['Menu', 'Plans', 'Reviews', 'About']

const fakeCook = {
  id: 'cook_1', name: 'Sunita Tai', kitchen_name: "Sunita Tai's Kitchen", location: 'Koregaon Park, Pune',
  cuisine_types: ['Maharashtrian', 'Home-style'], food_type: 'veg', rating: 4.9, total_orders: 234,
  trust_score: 92, is_open: true, bio: 'Cooking authentic Maharashtrian food for 10+ years.', cooking_since: '2013',
  ratings_breakdown: { taste: 4.9, hygiene: 4.8, quantity: 4.7 },
  menu: [
    { id: 'item_1', name: 'Dal Rice', description: 'Fresh dal with steamed rice and pickle', price: 60, food_type: 'veg' },
    { id: 'item_2', name: 'Sabji Roti', description: 'Seasonal vegetable curry with 3 rotis', price: 55, food_type: 'veg' },
    { id: 'item_3', name: 'Rajma Chawal', description: 'Classic rajma with basmati rice', price: 70, food_type: 'veg' },
    { id: 'item_4', name: 'Misal Pav', description: 'Spicy sprouted curry with pav', price: 50, food_type: 'veg' },
  ],
  plans: [
    { id: 'plan_1', name: 'Weekly Plan', meals_per_day: 2, days: 'Mon-Sat', price: 1200, original_price: 1500 },
    { id: 'plan_2', name: 'Weekly Plan', meals_per_day: 3, days: 'Mon-Sat', price: 1600, original_price: 2000 },
    { id: 'plan_3', name: 'Monthly Plan', meals_per_day: 2, days: 'Mon-Sat', price: 4000, original_price: 5000 },
  ],
  reviews: [
    { id: 'r1', student_name: 'Riya Sharma', rating: 5, comment: 'Absolutely loved the dal rice! Tastes just like home.', tags: ['Fresh food', 'Hygienic'] },
    { id: 'r2', student_name: 'Amit Verma', rating: 5, comment: 'Best homemade food in Pune!', tags: ['Great taste', 'Would order again'] },
  ]
}

export default function CookProfile() {
  const { id } = useParams()
  const [cook, setCook] = useState(null)
  const [tab, setTab] = useState('Menu')
  const [loading, setLoading] = useState(true)
  const { cart, addItem, updateQty, total } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    getCook(id).then(({ data }) => setCook(data)).catch(() => setCook(fakeCook)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>Loading...</div>
  if (!cook) return <div style={{ textAlign: 'center', padding: '80px 0' }}>Cook not found</div>

  const getQty = (itemId) => cart.find((i) => i.id === itemId)?.quantity || 0

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2' }}>
      <div style={{ background: 'linear-gradient(135deg,#E8580A,#F5C518)', height: 180, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -36, left: 40, width: 80, height: 80, borderRadius: '50%', background: '#E8580A', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff', fontWeight: 700, boxShadow: `0 0 0 4px ${cook.trust_score > 80 ? '#F5C518' : '#E8E0D5'}` }}>{cook.name[0]}</div>
        <div style={{ position: 'absolute', top: 16, right: 16, background: cook.is_open ? '#22C55E' : '#9CA3AF', color: '#fff', padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>{cook.is_open ? '● OPEN' : '● CLOSED'}</div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 32px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{cook.kitchen_name}</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {cook.cuisine_types.map((c) => <span key={c} style={{ background: '#FFF4EE', color: '#E8580A', fontSize: 12, padding: '3px 12px', borderRadius: 999 }}>{c}</span>)}
          <span style={{ background: cook.food_type === 'veg' ? '#DCFCE7' : '#FEE2E2', color: cook.food_type === 'veg' ? '#166534' : '#991B1B', fontSize: 12, padding: '3px 12px', borderRadius: 999 }}>{cook.food_type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#6B6B6B', marginBottom: 12 }}>
          <span>⭐ {cook.rating}</span><span>👥 {cook.total_orders} orders</span><span>📍 0.4 km</span><span>🏆 Trust {cook.trust_score}/100</span>
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          {Object.entries(cook.ratings_breakdown || {}).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#6B6B6B', textTransform: 'capitalize' }}>{k}</span>
              <div style={{ width: 80, height: 6, background: '#E8E0D5', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(v / 5) * 100}%`, background: '#E8580A', borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E8E0D5', marginBottom: 24 }}>
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '10px 20px', fontSize: 14, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  color: tab === t ? '#E8580A' : '#6B6B6B', borderBottom: tab === t ? '2px solid #E8580A' : '2px solid transparent', transition: 'all 0.2s'
                }}>{t}</button>
              ))}
            </div>

            {tab === 'Menu' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                {cook.menu.map((item) => (
                  <div key={item.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 16, display: 'flex', gap: 12 }}>
                    <div style={{ width: 64, height: 64, background: '#FFF4EE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🍱</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.food_type === 'veg' ? '#2D9B5A' : '#D63C3C' }} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 10, lineHeight: 1.4 }}>{item.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: '#E8580A' }}>₹{item.price}</span>
                        {getQty(item.id) === 0 ? (
                          <button onClick={() => addItem(item, cook)} style={{ fontSize: 12, border: '1px solid #E8580A', color: '#E8580A', padding: '4px 14px', borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add</button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #E8580A', borderRadius: 999, padding: '3px 10px' }}>
                            <button onClick={() => updateQty(item.id, getQty(item.id) - 1)} style={{ color: '#E8580A', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{getQty(item.id)}</span>
                            <button onClick={() => addItem(item, cook)} style={{ color: '#E8580A', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Plans' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                {cook.plans.map((plan, i) => (
                  <div key={plan.id} style={{ background: '#fff', borderRadius: 16, border: `2px solid ${i === 1 ? '#E8580A' : '#E8E0D5'}`, padding: 20, position: 'relative' }}>
                    {i === 1 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#E8580A', color: '#fff', fontSize: 11, padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>Most Popular</div>}
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 12 }}>{plan.meals_per_day} meals/day · {plan.days}</div>
                    <div style={{ marginBottom: 14 }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, color: '#E8580A' }}>₹{plan.price}</span>
                      <span style={{ fontSize: 12, color: '#6B6B6B', textDecoration: 'line-through', marginLeft: 8 }}>₹{plan.original_price}</span>
                    </div>
                    <button style={{ width: '100%', background: '#E8580A', color: '#fff', padding: '10px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Subscribe</button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(cook.reviews || []).map((r) => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>{r.student_name}</span>
                      <span>{'⭐'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 10 }}>{r.comment}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {r.tags.map((tag) => <span key={tag} style={{ background: '#FFF4EE', color: '#E8580A', fontSize: 12, padding: '2px 10px', borderRadius: 999 }}>{tag}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'About' && (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 24 }}>
                <p style={{ color: '#6B6B6B', marginBottom: 16 }}>{cook.bio}</p>
                <p style={{ fontSize: 14, marginBottom: 8 }}><strong>Location:</strong> {cook.location}</p>
                <p style={{ fontSize: 14 }}><strong>Cooking since:</strong> {cook.cooking_since}</p>
              </div>
            )}
          </div>

          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Your Order</div>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B6B6B' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🍱</div>
                  <p style={{ fontSize: 14 }}>Add items to start your order</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8E0D5', fontSize: 14 }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ fontFamily: "'DM Mono',monospace" }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, fontSize: 13, color: '#6B6B6B' }}>
                    {[['Subtotal', `₹${total}`], ['Platform fee', '₹10'], ['Delivery fee', '₹25']].map(([l, v]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>{l}</span><span>{v}</span></div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1C1C1E', fontSize: 15, paddingTop: 10, borderTop: '1px solid #E8E0D5', marginTop: 6 }}>
                      <span>Total</span><span style={{ fontFamily: "'DM Mono',monospace" }}>₹{total + 35}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/cart')} style={{ width: '100%', marginTop: 16, background: '#E8580A', color: '#fff', padding: '12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, fontSize: 14 }}>
                    Proceed to Order →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
