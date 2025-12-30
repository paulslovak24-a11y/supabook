import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

// --- YOUR VERIFIED CONNECTION ---
const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const handleStripe = () => {
    // Replace the link below with your actual Stripe Payment Link
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
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Your project is live and connected.</p>
        
        <button onClick={handleStripe} style={{ 
          width: '100%', padding: '16px', backgroundColor: '#6366f1', 
          color: 'white', border: 'none', borderRadius: '12px', 
          fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
          transition: 'transform 0.2s'
        }}>
          Pay Now with Stripe
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.75rem', color: '#475569' }}>
          Secure Checkout via Stripe
        </p>
      </div>
    </div>
  )
}

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(<App />)
}
