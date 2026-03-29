import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { submitReview } from '../api'

const categories = [
  { key: 'taste', label: 'Taste', icon: '😋' },
  { key: 'hygiene', label: 'Hygiene', icon: '🧼' },
  { key: 'quantity', label: 'Quantity', icon: '📦' },
]

const quickTags = ['Fresh food', 'Good quantity', 'On time', 'Hygienic', 'Great taste', 'Would order again']

export default function Rating() {
  const { orderId } = useParams()
  const [stars, setStars] = useState({ overall: 0, taste: 0, hygiene: 0, quantity: 0 })
  const [tags, setTags] = useState([])
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const toggleTag = (tag) => setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])

  const handleSubmit = async () => {
    try {
      await submitReview({ cook_id: 'cook_1', order_id: orderId || 'order_1', rating: stars.overall, taste: stars.taste, hygiene: stars.hygiene, quantity: stars.quantity, comment, tags })
    } catch {}
    setSubmitted(true)
    setTimeout(() => navigate('/student'), 2500)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: '#2D9B5A' }}>Thank you!</h2>
      <p style={{ color: '#6B6B6B' }}>Your review helps other students find great food.</p>
    </div>
  )

  const StarPicker = ({ category }) => (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E0D5', padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{category.icon}</div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{category.label}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setStars((prev) => ({ ...prev, [category.key]: s }))}
            style={{ fontSize: 24, border: 'none', background: 'none', cursor: 'pointer', color: s <= stars[category.key] ? '#F5C518' : '#E8E0D5', transition: 'color 0.2s' }}>★</button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        {/* Cook Info */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E8580A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', fontWeight: 700, margin: '0 auto 12px' }}>S</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>How was Sunita Tai's food?</h1>
          <p style={{ color: '#6B6B6B', fontSize: 13 }}>Dal Rice, Sabji Roti · Today</p>
        </div>

        {/* Overall Stars */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ color: '#6B6B6B', fontSize: 13, marginBottom: 10 }}>Overall Rating</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setStars((prev) => ({ ...prev, overall: s }))}
                style={{ fontSize: 40, border: 'none', background: 'none', cursor: 'pointer', color: s <= stars.overall ? '#F5C518' : '#E8E0D5', transition: 'color 0.2s' }}>★</button>
            ))}
          </div>
        </div>

        {/* Category Ratings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
          {categories.map((cat) => <StarPicker key={cat.key} category={cat} />)}
        </div>

        {/* Quick Tags */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>What did you like?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {quickTags.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                padding: '8px 18px', borderRadius: 999, fontSize: 13, border: '1px solid', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                background: tags.includes(tag) ? '#E8580A' : '#fff', color: tags.includes(tag) ? '#fff' : '#6B6B6B', borderColor: tags.includes(tag) ? '#E8580A' : '#E8E0D5'
              }}>{tag}</button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Tell us more (optional)</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 200))}
            placeholder="Share your experience..."
            style={{ width: '100%', border: '1px solid #E8E0D5', borderRadius: 14, padding: '14px 16px', fontSize: 14, fontFamily: 'inherit', resize: 'none', height: 100, outline: 'none' }}
          />
          <p style={{ fontSize: 12, color: '#6B6B6B', textAlign: 'right', marginTop: 4 }}>{comment.length}/200</p>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} style={{ width: '100%', background: '#E8580A', color: '#fff', padding: '14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
          Submit Review
        </button>
        <button onClick={() => navigate('/student')} style={{ width: '100%', background: 'none', border: 'none', color: '#6B6B6B', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
          Skip for now
        </button>
      </div>
    </div>
  )
}
