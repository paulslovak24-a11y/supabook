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
    // Fetch Newsfeed
    const { data: postData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (postData) setPosts(postData);
    
    // Fetch DMs (Messages sent TO me OR BY me)
    const { data: dmData } = await supabase.from('messages')
      .select('*')
      .or(`sender_email.eq.${myEmail.toLowerCase()},receiver_email.eq.${myEmail.toLowerCase()}`)
      .order('created_at', { ascending: true });
    if (dmData) setDms(dmData);
  }

  const handlePost = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await supabase.from('posts').insert([{ user_email: user.email.toLowerCase(), content: inputText }]);
    setInputText('');
    fetchAll(user.email);
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await supabase.from('posts').delete().eq('id', postId);
    fetchAll(user.email);
  }

  const handleSendDM = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !recipient.trim()) return;
    
    const { error } = await supabase.from('messages').insert([{ 
      sender_email: user.email.toLowerCase(), 
      receiver_email: recipient.toLowerCase().trim(), 
      message_content: inputText 
    }]);

    if (error) {
      alert("DM Failed: " + error.message);
    } else {
      setInputText('');
      setRecipient('');
      fetchAll(user.email);
      alert("Message sent successfully!");
    }
  }

  const CircuitHeader = () => (
    <div style={{ width: '100%', background: '#0f172a', padding: '20px 0', textAlign: 'center', borderBottom: '3px solid #38bdf8' }}>
      <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>⚡ Circuitburst</h1>
    </div>
  );

  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <CircuitHeader />
        <center style={{ marginTop: '50px' }}>
          <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithOtp({ email }); alert("Link sent!"); }}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px' }} />
            <button type="submit" style={{ padding: '12px', marginLeft: '5px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
          </form>
        </center>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <CircuitHeader />
      
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '15px' }}>
        <button onClick={() => setActiveTab('feed')} style={{ background: activeTab === 'feed' ? '#38bdf8' : '#1e293b', color: activeTab === 'feed' ? '#000' : '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Feed</button>
        <button onClick={() => setActiveTab('dms')} style={{ background: activeTab === 'dms' ? '#38bdf8' : '#1e293b', color: activeTab === 'dms' ? '#000' : '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>DMs</button>
      </nav>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 15px' }}>
        {activeTab === 'feed' ? (
          <div>
            <form onSubmit={handlePost}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Share an update..." style={{ width: '95%', height: '80px', borderRadius: '10px', padding: '10px', background: '#1e293b', color: '#fff' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>Post</button>
            </form>
            <div style={{ marginTop: '20px' }}>
              {posts.map(p => (
                <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', marginBottom: '10px', position: 'relative' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>@{p.user_email?.split('@')[0]}</span>
                  {p.user_email?.toLowerCase() === user.email?.toLowerCase() && (
                    <button onClick={() => handleDeletePost(p.id)} style={{ position: 'absolute', right: '15px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.6rem', padding: '4px 8px' }}>DELETE</button>
                  )}
                  <p>{p.content}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSendDM} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px' }}>
              <input type="email" placeholder="Recipient's EXACT Email" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ width: '95%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }} />
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Private message..." style={{ width: '95%', padding: '10px', borderRadius: '5px' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>Send Private Message</button>
            </form>
            <div style={{ marginTop: '20px' }}>
              {dms.map(m => (
                <div key={m.id} style={{ 
                  background: m.sender_email === user.email.toLowerCase() ? '#334155' : '#1e293b', 
                  padding: '10px', borderRadius: '10px', marginBottom: '10px',
                  textAlign: m.sender_email === user.email.toLowerCase() ? 'right' : 'left',
                  borderLeft: m.sender_email !== user.email.toLowerCase() ? '4px solid #38bdf8' : 'none'
                }}>
                  <small style={{ color: '#94a3b8' }}>{m.sender_email === user.email.toLowerCase() ? 'You' : m.sender_email}</small>
                  <p style={{ margin: '5px 0' }}>{m.message_content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
