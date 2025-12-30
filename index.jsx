import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('Sending link...')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email to sign in!')
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#38bdf8' }}>⚡ Circuitburst</h1>

      {/* --- SECTION 1: FREE TOOLS (Everyone sees this) --- */}
      <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #334155', borderRadius: '12px', maxWidth: '500px' }}>
        <h2>Free Tools</h2>
        <p>Basic circuit calculator is available to everyone.</p>
        <div style={{ padding: '20px', background: '#1e293b', borderRadius: '8px' }}>
           [ Your Free Calculator Tool Goes Here ]
        </div>
      </div>

      <hr style={{ border: '0.5px solid #334155', margin: '40px 0' }} />

      {/* --- SECTION 2: PREMIUM TOOLS ($6.99/mo) --- */}
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {!user ? (
          <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px' }}>
            <h3>Unlock Premium Features</h3>
            <p style={{ color: '#94a3b8' }}>Sign in to subscribe for $6.99/mo</p>
            <form onSubmit={handleLogin}>
              <input 
                type="email" placeholder="Your email" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px', width: '80%', borderRadius: '5px', border: 'none', marginBottom: '10px' }}
              />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                Login to Upgrade
              </button>
            </form>
            {message && <p style={{ color: '#fbbf24' }}>{message}</p>}
          </div>
        ) : (
          <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', border: '2px solid #6366f1' }}>
            <h3>Premium Dashboard</h3>
            <p>Logged in as: {user.email}</p>
            
            {/* THIS IS THE STRIPE BUTTON FOR $6.99 */}
            <button onClick={() => window.location.href = 'https://buy.stripe.com/your_699_link'} 
              style={{ padding: '15px 30px', backgroundColor: '#6366f1', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
              Subscribe for $6.99/mo
            </button>
            
            <br /><br />
            <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Sign Out</button>
          </div>
        )}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
