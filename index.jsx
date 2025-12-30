import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qebchzrttfhkaufuolrt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYmNoenJ0dGZoa2F1ZnVvbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Mzg4NDAsImV4cCI6MjA4MjMxNDg0MH0.6eWlFuvxAVkFKOCzxs7jgkqijMoKQt5jMG0eESa0Uj0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); 
  const [posts, setPosts] = useState([]);
  const [dms, setDms] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { fetchAll(session.user.email); }
    });
  }, []);

  async function fetchAll(myEmail) {
    const { data: postData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (postData) setPosts(postData);
    const { data: dmData } = await supabase.from('messages').select('*').or(`sender_email.eq.${myEmail},receiver_email.eq.${myEmail}`).order('created_at', { ascending: true });
    if (dmData) setDms(dmData);
  }

  const handlePost = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([{ user_email: user.email, content: inputText }]);
    if (!error) { setInputText(''); fetchAll(user.email); }
  }

  const handleSendDM = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('messages').insert([{ sender_email: user.email, receiver_email: recipient, message_content: inputText }]);
    if (!error) { setInputText(''); setRecipient(''); fetchAll(user.email); alert("DM Sent!"); }
  }

  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '50px', textAlign: 'center' }}>
        <h1 style={{ color: '#38bdf8' }}>⚡ Circuitburst</h1>
        <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithOtp({ email }); alert("Check email!"); }}>
          <input type="email" placeholder="Enter Email" onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', width: '250px' }} />
          <button type="submit" style={{ padding: '12px 20px', marginLeft: '10px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px', background: '#1e293b', position: 'sticky', top: 0 }}>
        <button onClick={() => setActiveTab('feed')} style={{ background: activeTab === 'feed' ? '#38bdf8' : 'none', color: 'white', border: '1px solid #38bdf8', padding: '8px 15px', borderRadius: '5px' }}>Feed</button>
        <button onClick={() => setActiveTab('dms')} style={{ background: activeTab === 'dms' ? '#38bdf8' : 'none', color: 'white', border: '1px solid #38bdf8', padding: '8px 15px', borderRadius: '5px' }}>DMs</button>
        <button onClick={() => setActiveTab('premium')} style={{ background: activeTab === 'premium' ? '#6366f1' : 'none', color: 'white', border: '1px solid #6366f1', padding: '8px 15px', borderRadius: '5px' }}>Pro</button>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ background: 'none', color: '#ef4444', border: 'none', fontSize: '0.8rem' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '500px', margin: '20px auto', padding: '0 15px' }}>
        {activeTab === 'feed' && (
          <div>
            <form onSubmit={handlePost} style={{ marginBottom: '20px' }}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="What's happening?" style={{ width: '100%', borderRadius: '10px', padding: '10px', background: '#1e293b', color: 'white', border: '1px solid #334155', minHeight: '80px' }} />
              <button type="submit" style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Post</button>
            </form>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #334155' }}>
                <small style={{ color: '#38bdf8' }}>@{p.user_email?.split('@')[0]}</small>
                <p style={{ margin: '8px 0 0' }}>{p.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dms' && (
          <div>
            <form onSubmit={handleSendDM} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #6366f1' }}>
              <input type="email" placeholder="Recipient Email" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', background: '#0f172a', color: 'white', border: '1px solid #334155' }} />
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Message..." style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#0f172a', color: 'white', border: '1px solid #334155' }} />
              <button type="submit" style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Send Message</button>
            </form>
            {dms.map(m => (
              <div key={m.id} style={{ background: m.sender_email === user.email ? '#334155' : '#1e293b', padding: '12px', borderRadius: '10px', marginTop: '10px', textAlign: m.sender_email === user.email ? 'right' : 'left' }}>
                <small style={{ color: '#94a3b8' }}>{m.sender_email === user.email ? "Sent to " + m.receiver_email : "From " + m.sender_email}</small>
                <p style={{ margin: '5px 0 0' }}>{m.message_content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'premium' && (
          <div style={{ textAlign: 'center', background: 'linear-gradient(to bottom, #1e293b, #0f172a)', padding: '40px', borderRadius: '20px', border: '2px solid #6366f1' }}>
            <h2 style={{ color: '#6366f1' }}>Circuitburst Pro</h2>
            <p>Unlock verified badge & direct tech support.</p>
            <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>$6.99<span style={{ fontSize: '1rem' }}>/mo</span></h1>
            <button onClick={() => window.location.href = 'https://buy.stripe.com/your_link'} style={{ padding: '15px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>Get Pro Now</button>
          </div>
        )}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
