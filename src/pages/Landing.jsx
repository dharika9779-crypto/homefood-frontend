import { Link } from 'react-router-dom'

const s = {
  page: { minHeight: '100vh', background: '#FDF8F2' },
  hero: { maxWidth: 1200, margin: '0 auto', padding: '80px 24px', textAlign: 'center' },
  badge: { display: 'inline-block', background: '#FFF4EE', color: '#E8580A', fontSize: 13, padding: '4px 16px', borderRadius: 999, border: '1px solid #F5C518', marginBottom: 24 },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 700, color: '#1C1C1E', lineHeight: 1.2, marginBottom: 16 },
  span: { color: '#E8580A' },
  sub: { color: '#6B6B6B', fontSize: 18, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' },
  btnRow: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { background: '#E8580A', color: '#fff', padding: '12px 32px', borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: 'none' },
  btnOutline: { border: '2px solid #E8580A', color: '#E8580A', padding: '12px 32px', borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: 'none', background: 'transparent' },
  section: { maxWidth: 1200, margin: '0 auto', padding: '48px 24px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #E8E0D5' },
  icon: { fontSize: 40, marginBottom: 16 },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 8 },
  cardDesc: { color: '#6B6B6B', fontSize: 14, lineHeight: 1.6 },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 40 },
  stepRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 },
  step: { display: 'flex', gap: 16 },
  stepNum: { fontFamily: "'DM Mono', monospace", fontSize: 32, fontWeight: 700, color: '#F5C518', minWidth: 48 },
  stepTitle: { fontWeight: 700, fontSize: 17, marginBottom: 6 },
  stepDesc: { color: '#6B6B6B', fontSize: 14 },
  footer: { borderTop: '1px solid #E8E0D5', textAlign: 'center', padding: '32px 24px', color: '#6B6B6B', fontSize: 14 },
}

export default function Landing() {
  return (
    <div style={s.page}>
      <div style={s.hero}>
        <span style={s.badge}>🏠 Hyperlocal · Homemade · Affordable</span>
        <h1 style={s.h1}>
          Ghar jaisa khana,<br />
          <span style={s.span}>paas mein</span>
        </h1>
        <p style={s.sub}>Connect with local home cooks near your PG or hostel. Fresh, affordable, homemade meals delivered to your door.</p>
        <div style={s.btnRow}>
          <Link to="/student" style={s.btnPrimary}>Find Cooks Near Me</Link>
          <Link to="/role-select" style={s.btnOutline}>Join as Cook</Link>
        </div>
      </div>

      <div style={s.section}>
        <div style={s.grid3}>
          {[
            { icon: '🎓', title: 'For Students', desc: 'Find affordable homemade meals from trusted cooks within 1-2 km of your PG or hostel.' },
            { icon: '👩‍🍳', title: 'For Home Cooks', desc: 'Turn your cooking into income. Set your menu, plans, and availability. We handle the rest.' },
            { icon: '🛵', title: 'For Delivery Partners', desc: 'Earn ₹20-40 per delivery in your local area. Flexible hours, no targets.' },
          ].map((f) => (
            <div key={f.title} style={s.card}>
              <div style={s.icon}>{f.icon}</div>
              <div style={s.cardTitle}>{f.title}</div>
              <div style={s.cardDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>How it works</h2>
        <div style={s.stepRow}>
          {[
            { num: '01', title: 'Find a cook', desc: 'Browse cooks near you, filter by veg/non-veg, price, and ratings.' },
            { num: '02', title: 'Place your order', desc: 'Choose a one-time meal or subscribe to a weekly/monthly plan.' },
            { num: '03', title: 'Get it delivered', desc: 'Your food arrives fresh from a neighbor\'s kitchen to your door.' },
          ].map((s2) => (
            <div key={s2.num} style={s.step}>
              <span style={s.stepNum}>{s2.num}</span>
              <div>
                <div style={s.stepTitle}>{s2.title}</div>
                <div style={s.stepDesc}>{s2.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={s.footer}>© 2026 HomeFood Connect · Made with ❤️ for students</footer>
    </div>
  )
}
