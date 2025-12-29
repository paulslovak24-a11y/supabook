import React from 'react'
import ReactDOM from 'react-dom/client'

// This is your entire app in one place to prevent "File Not Found" errors
function App() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#646cff' }}>⚡ Circuitburst Online</h1>
      <p>The build was successful!</p>
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
        <p>Your site is now running as a Web Service on Render.</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
