import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'dms'
  const [posts, setPosts] = useState([]);
  const [dms, setDms] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchPosts();
        fetchDMs(session.user.email);
      }
    });
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  }

  async function fetchDMs(myEmail) {
    const { data } = await supabase.from('messages')
      .select('*')
      .or(`sender_email.eq.${myEmail},receiver_email.eq.${myEmail}`)
      .order('created_at', { ascending: true });
    if (data) setDms(data);
  }

  const handlePost = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const { error } = await supabase.from('posts').insert([{ user_email: user.email, content: inputText }]);
    if (!error) { setInputText(''); fetchPosts(); }
  }

  const handleSendDM = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !recipient.trim()) return;
    const { error } = await supabase.from('messages').insert([
      { sender_email: user.email, receiver_email: recipient, message_content: inputText }
    ]);
    if (!error) { setInputText(''); fetchDMs(user.email); alert("Message sent!"); }
  }

  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '50px', textAlign: 'center' }}>
        <h1>⚡ Circuitburst</h1>
        <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithOtp({ email }); alert("Check email!"); }}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '5px' }} />
          <button type="submit" style={{ padding: '10px', marginLeft: '10px', background: '#38bdf8', border: 'none', borderRadius: '5px' }}>Login</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px', background: '#1e293b' }}>
        <button onClick={() => setActiveTab('feed')} style={{ background: activeTab === 'feed' ? '#38bdf8' : 'none', color: 'white', border: '1px solid #38bdf8', padding: '10px', borderRadius: '5px' }}>Newsfeed</button>
        <button onClick={() => setActiveTab('dms')} style={{ background: activeTab === 'dms' ? '#38bdf8' : 'none', color: 'white', border: '1px solid #38bdf8', padding: '10px', borderRadius: '5px' }}>DMs</button>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ background: 'none', color: '#ef4444', border: 'none' }}>Logout</button>
      </nav>

      <main style={{ maxWidth: '500px', margin: '20px auto', padding: '0 15px' }}>
        {activeTab === 'feed' ? (
          <div>
            <form onSubmit={handlePost}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Post to the feed..." style={{ width: '100%', borderRadius: '10px', padding: '10px', background: '#1e293b', color: 'white' }} />
              <button type="submit" style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#38bdf8', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Post</button>
            </form>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>
                <small style={{ color: '#38bdf8' }}>{p.user_email}</small>
                <p>{p.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <form onSubmit={handleSendDM} style={{ background: '#1e293b', padding: '15px', borderRadius: '10px' }}>
              <input type="email" placeholder="Recipient's Email" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ width: '95%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }} />
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Private message..." style={{ width: '95%', padding: '10px', borderRadius: '5px' }} />
              <button type="submit" style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px' }}>Send DM</button>
            </form>
            <h3 style={{ marginTop: '30px' }}>Your Conversations</h3>
            {dms.map(m => (
              <div key={m.id} style={{ background: m.sender_email === user.email ? '#334155' : '#1e293b', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                <small style={{ color: '#94a3b8' }}>{m.sender_email === user.email ? "You to " + m.receiver_email : m.sender_email + " to You"}</small>
                <p>{m.message_content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
