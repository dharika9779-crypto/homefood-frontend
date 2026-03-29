import { useState, useEffect } from 'react'
import { getPolls, votePoll } from '../api'

const fakePolls = [{
  id: 'poll_1', cook_name: 'Sunita Tai', title: "What should I cook this Sunday?", is_active: true, total_votes: 89,
  options: [
    { id: 'opt_1', dish: 'Pav Bhaji', description: 'Mumbai style buttery pav bhaji', votes: 34 },
    { id: 'opt_2', dish: 'Chole Bhature', description: 'Fluffy bhature with spicy chole', votes: 28 },
    { id: 'opt_3', dish: 'Misal Pav', description: 'Spicy Pune style misal', votes: 18 },
    { id: 'opt_4', dish: 'Pulao', description: 'Fragrant vegetable pulao with raita', votes: 9 },
  ]
}]

export default function Poll() {
  const [polls, setPolls] = useState([])
  const [voted, setVoted] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPolls().then(({ data }) => setPolls(data)).catch(() => setPolls(fakePolls)).finally(() => setLoading(false))
  }, [])

  const handleVote = async (pollId, optionId) => {
    if (voted[pollId]) return
    const updated = polls.map((p) => {
      if (p.id !== pollId) return p
      return { ...p, total_votes: p.total_votes + 1, options: p.options.map((o) => o.id === optionId ? { ...o, votes: o.votes + 1 } : o) }
    })
    setPolls(updated)
    setVoted((prev) => ({ ...prev, [pollId]: optionId }))
    try { await votePoll({ poll_id: pollId, option_id: optionId }) } catch {}
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>Loading polls...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F2' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Weekend Polls 🗳️</h1>
        <p style={{ color: '#6B6B6B', marginBottom: 32 }}>Vote for what you want to eat this weekend!</p>

        {polls.map((poll) => {
          const maxVotes = Math.max(...poll.options.map((o) => o.votes))
          return (
            <div key={poll.id} style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E0D5', padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>{poll.title}</h2>
                  <p style={{ fontSize: 13, color: '#6B6B6B' }}>by {poll.cook_name}</p>
                </div>
                <span style={{ background: '#E8580A', color: '#fff', fontSize: 12, padding: '4px 14px', borderRadius: 999 }}>⏰ 14h 32m left</span>
              </div>
              <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>{poll.total_votes} students voted</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {poll.options.map((opt) => {
                  const pct = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0
                  const isVoted = voted[poll.id] === opt.id
                  const isLeading = opt.votes === maxVotes && opt.votes > 0 && voted[poll.id]
                  return (
                    <div key={opt.id} style={{
                      borderRadius: 16, border: `2px solid ${isVoted ? '#E8580A' : isLeading ? '#F5C518' : '#E8E0D5'}`,
                      padding: 18, background: isVoted ? '#FFF4EE' : isLeading ? '#FEFCE8' : '#fff', transition: 'all 0.3s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700 }}>{opt.dish}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {isLeading && <span style={{ fontSize: 11, background: '#F5C518', color: '#78350F', padding: '2px 8px', borderRadius: 999 }}>🏆 Leading</span>}
                          {isVoted && <span style={{ fontSize: 11, color: '#E8580A' }}>✓ Voted</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 12 }}>{opt.description}</p>
                      {voted[poll.id] ? (
                        <>
                          <div style={{ height: 8, background: '#E8E0D5', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: '#E8580A', borderRadius: 999, transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: '#E8580A', fontSize: 14 }}>{pct}%</span>
                        </>
                      ) : (
                        <button onClick={() => handleVote(poll.id, opt.id)} style={{
                          width: '100%', border: '1px solid #E8580A', color: '#E8580A', padding: '8px', borderRadius: 999, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13
                        }}>Vote</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
