import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

// REPLACE THESE with your actual keys from Supabase Settings -> API
const supabase = createClient('https://your-url.supabase.co', 'your-anon-key')

function App() {
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your email for a login link!')
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>⚡ Circuitburst</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Enter email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '10px', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '4px' }}>
          Login / Sign Up
        </button>
      </form>
      <hr style={{ margin: '30px 0', opacity: 0.2 }} />
      <button 
        onClick={() => window.location.href = 'https://buy.stripe.com/test_yourlink'}
        style={{ padding: '15px 30px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px' }}
      >
        Go to Payment
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
