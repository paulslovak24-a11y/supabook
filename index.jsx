import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

// --- YOUR VERIFIED CONNECTION ---
const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('feed')
  const [postText, setPostText] = useState('')
  const [posts, setPosts] = useState([
    { id: 1, user: 'Admin', content: 'Welcome to the Circuitburst feed!' }
  ])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handlePost = (e) => {
    e.preventDefault()
    if (!postText) return
    const newPost = { id: Date.now(), user: user?.email || 'Guest', content: postText }
    setPosts([newPost, ...posts])
    setPostText('')
  }

  // --- STYLES ---
  const navStyle = { display: 'flex', justifyContent: 'center', gap: '20px', padding: '15px', background: '#1e293b' }
  const btnStyle = (tab) => ({
    background: activeTab === tab ? '#38bdf8' : 'none',
    color: activeTab === tab ? '#0f172a' : 'white',
    border: '1px solid #38bdf8', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
  })

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0, color: '#38bdf8' }}>⚡ Circuitburst</h1>
      </header>

      <nav style={navStyle}>
        <button style={btnStyle('feed')} onClick={() => setActiveTab('feed')}>Newsfeed</button>
        <button style={btnStyle('dms')} onClick={() => setActiveTab('dms')}>DMs</button>
        <button style={btnStyle('premium')} onClick={() => setActiveTab('premium')}>Premium</button>
      </nav>

      <main style={{ maxWidth: '500px', margin: '20px auto', padding: '0 15px' }}>
        
        {/* TAB 1: NEWSFEED */}
        {activeTab === 'feed' && (
          <div>
            <form onSubmit={handlePost} style={{ marginBottom: '20px' }}>
              <textarea 
                value={postText} onChange={(e) => setPostText(e.target.value)}
                placeholder="Share something..."
                style={{ width: '100%', borderRadius: '10px', padding: '10px', background: '#1e293b', color: 'white', border: '1px solid #334155' }}
              />
              <button type="submit" style={{ marginTop: '10px', background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold' }}>Post</button>
            </form>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '10px', textAlign: 'left' }}>
                <div style={{ color: '#38bdf8', fontSize: '0.8rem', marginBottom: '5px' }}>{p.user}</div>
                <div>{p.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DMs */}
        {activeTab === 'dms' && (
          <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h2>Messages</h2>
            <p style={{ color: '#94a3b8' }}>Connect with other users. (Login required)</p>
          </div>
        )}

        {/* TAB 3: PREMIUM */}
        {activeTab === 'premium' && (
          <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '20px', border: '2px solid #6366f1' }}>
            <h2>Circuitburst Premium</h2>
            <p style={{ fontSize: '1.2rem' }}>$6.99 / month</p>
            <ul style={{ textAlign: 'left', display: 'inline-block', marginBottom: '20px', color: '#94a3b8' }}>
              <li>✅ Blue Verification Badge</li>
              <li>✅ Ad-Free Experience</li>
              <li>✅ Priority DMs</li>
            </ul>
            <br />
            <button 
              onClick={() => window.location.href = 'https://buy.stripe.com/your_link_here'}
              style={{ padding: '15px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              Upgrade Now
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

const root = document.getElementById('root')
if (root) { ReactDOM.createRoot(root).render(<App />) }
