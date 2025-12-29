import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

// 1. Initialize Supabase (Fill these in from your Supabase Settings)
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Check if a user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your email for the login link!')
  }

  const handleStripe = () => {
    // Replace this with your Stripe Payment Link
    window.location.href = "https://buy.stripe.com/test_your_link"
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>⚡ Circuitburst</h1>
      
      {!user ? (
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <p>Enter your email to log in or sign up:</p>
          <input 
            type="email" 
            placeholder="email@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: 'none', width: '250px' }}
          />
          <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Send Magic Link
          </button>
        </form>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleStripe} style={{ padding: '15px 30px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}>
            Upgrade to Pro with Stripe
          </button>
          <br /><br />
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
