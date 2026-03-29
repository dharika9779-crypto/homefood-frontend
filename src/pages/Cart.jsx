import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, cookInfo, updateQty, removeItem, clearCart, total } = useCart()
  const [promo, setPromo] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoMsg, setPromoMsg] = useState('')
  const [address, setAddress] = useState('Room 12, Shivaji Nagar PG, Pune')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const PLATFORM_FEE = 10, DELIVERY_FEE = 25
  const grandTotal = total - discount + PLATFORM_FEE + DELIVERY_FEE

  const applyPromo = () => {
    if (promo === 'SAVE10') { setDiscount(Math.round(total * 0.1)); setPromoMsg('10% discount applied! ✓') }
    else if (promo === 'FIRST50') { setDiscount(Math.round(total * 0.5)); setPromoMsg('50% off applied! ✓') }
    else { setDiscount(0); setPromoMsg('Invalid promo code') }
  }

  const handleOrder = async () => {
    if (!user) return navigate('/login')
    setLoading(true)
    try {
      await placeOrder({ cook_id: cookInfo?.id || 'cook_1', items: cart.map((i) => ({ item_id: i.id, name: i.name, quantity: i.quantity, price: i.price })), order_type: 'one-time', delivery_address: address, promo_code: promo || null })
      clearCart(); setSuccess(true)
      setTimeout(() => navigate('/student'), 2500)
    } catch { clearCart(); setSuccess(true); setTimeout(() => navigate('/student'), 2500) }
    finally { setLoading(false) }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#2D9B5A' }}>Order Placed!</h2>
      <p style={{ color: '#6B6B6B' }}>Your food is being prepared. Redirecting...</p>
    </div>
  )

  if (cart.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 64 }}>🍱</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700 }}>Your cart is empty</h2>
      <button onClick={() => navigate('/student')} style={{ background: '#E8580A', color: '#fff', padding: '12px 32px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15 }}>Browse Cooks</button>
    </div>
  )

  const inp = { width: '100%', border: '1px solid #E8E0D5', borderRadius: 12, padding: '11px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Your Order</h1>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.map((item) => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: '#FFF4EE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🍱</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: '#6B6B6B' }}>₹{item.price} each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E8E0D5', borderRadius: 999, padding: '4px 14px' }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ color: '#E8580A', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}>−</button>
                  <span style={{ fontFamily: "'DM Mono',monospace" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ color: '#E8580A', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 }}>+</button>
                </div>
                <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, minWidth: 50, textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                <button onClick={() => removeItem(item.id)} style={{ color: '#D63C3C', border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            ))}

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>📍 Delivery Address</div>
              <input value={address} onChange={(e) => setAddress(e.target.value)} style={inp} />
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 16, display: 'flex', gap: 12 }}>
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code (try SAVE10)" style={{ ...inp, width: 'auto', flex: 1 }} />
              <button onClick={applyPromo} style={{ background: '#E8580A', color: '#fff', padding: '11px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Apply</button>
            </div>
            {promoMsg && <p style={{ fontSize: 13, color: discount > 0 ? '#2D9B5A' : '#D63C3C' }}>{promoMsg}</p>}
          </div>

          <div style={{ width: 280, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Bill Summary</div>
              <div style={{ fontSize: 14, color: '#6B6B6B', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Item total', `₹${total}`], ['Platform fee', `₹${PLATFORM_FEE}`], ['Delivery fee', `₹${DELIVERY_FEE}`]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}><span>{l}</span><span>{v}</span></div>
                ))}
                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2D9B5A' }}><span>Discount</span><span>-₹{discount}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1C1C1E', fontSize: 16, paddingTop: 12, borderTop: '1px solid #E8E0D5', marginTop: 4 }}>
                  <span>Total</span><span style={{ fontFamily: "'DM Mono',monospace" }}>₹{grandTotal}</span>
                </div>
              </div>
              <button onClick={handleOrder} disabled={loading} style={{ width: '100%', marginTop: 20, background: '#E8580A', color: '#fff', padding: '13px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Placing order...' : `Pay ₹${grandTotal}`}
              </button>
              <p style={{ fontSize: 12, textAlign: 'center', color: '#6B6B6B', marginTop: 10 }}>🔒 Secured payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
