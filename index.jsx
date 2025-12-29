import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

// PASTE YOUR KEYS HERE
const supabase = createClient(
  'https://your-project-id.supabase.co', // <--- 
  'your-anon-key-goes-here'              // <--- Paste anon public key here
)

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Success! Check your email for the magic login link.')
  }

  const handleStripe = () => {
    // Replace with your Stripe Link (from Stripe Dashboard -> Payment Links)
    window.location.href = "https://buy.stripe.com/test_your_link"
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#38bdf8' }}>⚡ Circuitburst</h1>
      
      {!user ? (
        <form onSubmit={handleLogin}>
          <p>Sign in to your account:</p>
          <input 
            type="email" 
            placeholder="email@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
          />
          <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#38bdf8', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      ) : (
        <div>
          <p>Logged in as {user.email}</p>
          <button onClick={handleStripe} style={{ padding: '15px 30px', backgroundColor: '#6366f1', color: 'white', borderRadius: '8px', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
            Upgrade with Stripe
          </button>
          <br /><br />
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Sign Out</button>
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
