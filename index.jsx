import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

// --- YOUR VERIFIED CONNECTION ---
const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('Sending magic link...')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage('Error: ' + error.message)
    else setMessage('Success! Check your email for the link.')
  }

  const handleStripe = () => {
    // Replace this with your actual Stripe Payment Link
    window.location.href = "https://buy.stripe.com/test_your_link_here"
  }

  return (
    <div style={{ 
      padding: '40px', textAlign: 'center', backgroundColor: '#0f172a', 
      color: 'white', minHeight: '100vh', fontFamily: 'sans-serif',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ 
        width: '100%', maxWidth: '400px', padding: '30px', 
        backgroundColor: '#1e293b', borderRadius: '20px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid #334155'
      }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '10px' }}>⚡ Circuitburst</h1>
        
        {!user ? (
          /* --- LOGIN VIEW --- */
          <form onSubmit={handleLogin}>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Login to access payments</p>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', padding: '12px', marginBottom: '15px', 
                borderRadius: '8px', border: '1px solid #334155', outline: 'none' 
              }}
            />
            <button type="submit" style={{ 
              width: '100%', padding: '12px', backgroundColor: '#38bdf8', 
              color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' 
            }}>
              Send Login Link
            </button>
            {message && <p style={{ fontSize: '0.8rem', marginTop: '15px', color: '#fbbf24' }}>{message}</p>}
          </form>
        ) : (
          /* --- PAID CONTENT VIEW --- */
          <div>
            <p style={{ color: '#94a3b8' }}>Welcome, {user.email}</p>
            <div style={{ margin: '25px 0', padding: '20px', background: '#0f172a', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0 }}>Unlock Full Access</h3>
              <button onClick={handleStripe} style={{ 
                width: '100%', padding: '16px', backgroundColor: '#6366f1', 
                color: 'white', border: 'none', borderRadius: '12px', 
                fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
              }}>
                Pay with Stripe
              </button>
            </div>
            <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(<App />)
}
