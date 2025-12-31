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
    const { data: dmData } = await supabase.from('messages').select('*').or(`sender_email.eq.${myEmail.toLowerCase()},receiver_email.eq.${myEmail.toLowerCase()}`).order('created_at', { ascending: true });
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
    if (!window.confirm("Delete post?")) return;
    await supabase.from('posts').delete().eq('id', postId);
    fetchAll(user.email);
  }

  const handleSendDM = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !recipient.trim()) return;
    await supabase.from('messages').insert([{ sender_email: user.email.toLowerCase(), receiver_email: recipient.toLowerCase().trim(), message_content: inputText }]);
    setInputText(''); setRecipient(''); fetchAll(user.email); alert("Sent!");
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
          <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithOtp({ email }); alert("Check email!"); }}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', width: '200px' }} />
            <button type="submit" style={{ padding: '12px 20px', marginLeft: '5px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
          </form>
        </center>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <CircuitHeader />
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '15px' }}>
        <button onClick={() => setActiveTab('feed')} style={{ background: activeTab === 'feed' ? '#38bdf8' : '#1e293b', color: activeTab === 'feed' ? '#000' : '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px' }}>Feed</button>
        <button onClick={() => setActiveTab('dms')} style={{ background: activeTab === 'dms' ? '#38bdf8' : '#1e293b', color: activeTab === 'dms' ? '#000' : '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px' }}>DMs</button>
        <button onClick={() => setActiveTab('pro')} style={{ background: activeTab === 'pro' ? '#6366f1' : '#1e293b', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px' }}>Pro</button>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ background: 'none', color: '#ef4444', border: 'none', fontSize: '0.8rem' }}>Logout</button>
      </nav>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 15px' }}>
        {activeTab === 'feed' && (
          <div>
            <form onSubmit={handlePost}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="What's new?" style={{ width: '95%', height: '80px', borderRadius: '10px', padding: '10px', background: '#1e293b', color: '#fff' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>Post</button>
            </form>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', marginTop: '15px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>@{p.user_email?.split('@')[0]}</span>
                  {p.user_email?.toLowerCase() === 'paulslovak24@gmail.com' && <span style={{ background: '#f59e0b', color: '#000', padding: '2px 5px', borderRadius: '4px', fontSize: '0.6rem' }}>FOUNDER ⚡</span>}
                  {p.user_status === 'pro' && <span>✅</span>}
                </div>
                {p.user_email?.toLowerCase() === user.email?.toLowerCase() && <button onClick={() => handleDeletePost(p.id)} style={{ position: 'absolute', right: '10px', top: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.6rem' }}>DEL</button>}
                <p>{p.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dms' && (
          <div>
            <form onSubmit={handleSendDM}>
              <input type="email" placeholder="Recipient Email" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ width: '95%', padding: '10px', marginBottom: '10px' }} />
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Message..." style={{ width: '95%', padding: '10px' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px' }}>Send DM</button>
            </form>
            {dms.map(m => (
              <div key={m.id} style={{ background: m.sender_email === user.email.toLowerCase() ? '#334155' : '#1e293b', padding: '10px', marginTop: '10px', borderRadius: '10px' }}>
                <small>{m.sender_email === user.email.toLowerCase() ? 'You' : m.sender_email}</small>
                <p>{m.message_content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '30px', background: '#1e293b', borderRadius: '20px', border: '2px solid #6366f1' }}>
              <h2>Circuitburst Pro</h2>
              <h1 style={{ fontSize: '3rem' }}>$6.99</h1>
              <button onClick={() => window.location.href = 'https://buy.stripe.com/14A5kx16j6TF5qt8D57ss00'} style={{ width: '100%', padding: '15px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Upgrade Now</button>
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.7rem', opacity: 0.6 }}>
              <p>By upgrading, you agree to our Terms.</p>
              <button onClick={() => alert("Terms: Respect others. Subscriptions are monthly.")} style={{ color: '#38bdf8', background: 'none', border: 'none' }}>Terms</button>
              <button onClick={() => alert("Privacy: We don't sell your data.")} style={{ color: '#38bdf8', background: 'none', border: 'none' }}>Privacy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
