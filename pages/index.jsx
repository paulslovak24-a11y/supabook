import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const handleCheckout = () => {
    // This sends the user to your Stripe payment page
    window.location.href = "https://buy.stripe.com/test_your_link_here";
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#38bdf8' }}>⚡ Circuitburst</h1>
      <p>Ready to start? Click below to subscribe.</p>
      
      <button 
        onClick={handleCheckout}
        style={{ 
          backgroundColor: '#6366f1', 
          color: 'white', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '6px', 
          fontSize: '1.1rem', 
          cursor: 'pointer',
          marginTop: '20px' 
        }}
      >
        Buy Now with Stripe
      </button>
    </div>
  )
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
