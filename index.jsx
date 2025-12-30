import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [postText, setPostText] = useState('')
  const [email, setEmail] = useState('')

  // 1. HARD CHECK for user session on load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) fetchPosts()
    }
    checkUser()
  }, [])

  // 2. FETCH posts from Database
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error("Fetch error:", error)
    else setPosts(data || [])
  }

  // 3. LOGIN function
  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: { emailRedirectTo: 'https://circuitburst.onrender.com' }
    })
    if (error) alert("Login Error: " + error.message)
    else alert("Check your email for the magic link!")
  }

  // 4. POST function
  const handlePost = async (e) => {
    e.preventDefault()
    if (!postText) return
    
    const { error } = await supabase
      .from('posts')
      .insert([{ user_email: user.email, content: postText }])

    if (error) {
      alert("Post Error: " + error.message)
    } else {
      setPostText('')
      fetchPosts() // Immediately show the new post
    }
  }

  if (loading) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Loading Circuitburst...</div>

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#38bdf8' }}>⚡ Circuitburst</h1>

      {!user ? (
        /* LOGIN SCREEN */
        <div style={{ maxWidth: '400px', margin: '50px auto', background: '#1e293b', padding: '30px', borderRadius: '15px' }}>
          <h2>Sign In / Sign Up</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Send Magic Link</button>
          </form>
        </div>
      ) : (
        /* LOGGED IN CONTENT */
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p>Logged in as: <strong>{user.email}</strong> | <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{background: 'none', color: '#ef4444', border: 'none', cursor: 'pointer'}}>Sign Out</button></p>
          
          <form onSubmit={handlePost} style={{ marginBottom: '30px' }}>
            <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="What's on your mind?"
              style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#1e293b', color: 'white', border: '1px solid #334155' }} />
            <button type="submit" style={{ marginTop: '10px', padding: '10px 25px', backgroundColor: '#38bdf8', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Post</button>
          </form>

          {posts.map(p => (
            <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
              <small style={{ color: '#38bdf8' }}>{p.user_email}</small>
              <p>{p.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
