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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) alert("Error: " + error.message);
    else fetchAll(user.email);
  }

  const CircuitHeader = () => (
    <div style={{ width: '100%', background: '#0f172a', padding: '20px 0', textAlign: 'center', borderBottom: '3px solid #38bdf8', marginBottom: '10px' }}>
      <h1 style={{ color: '#38bdf8', margin: 0, fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '4px' }}>⚡ CIRCUITBURST</h1>
    </div>
  );

  if (!user) {
    return (
      <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <CircuitHeader />
        <center style={{ marginTop: '50px' }}>
          <form onSubmit={async (e) => { e.preventDefault(); await supabase.auth.signInWithOtp({ email }); alert("Link sent!"); }}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '8px', width: '200px' }} />
            <button type="submit" style={{ padding: '12px', marginLeft: '5px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
          </form>
        </center>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <CircuitHeader />
      
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('feed')} style={{ background: activeTab === 'feed' ? '#38bdf8' : '#1e293b', color: activeTab === 'feed' ? '#000' : '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Feed</button>
        <button onClick={() => setActiveTab('dms')} style={{ background: activeTab === 'dms' ? '#38bdf8' : '#1e293b', color: activeTab === 'dms' ? '#000' : '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>DMs</button>
      </nav>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 15px' }}>
        {activeTab === 'feed' && (
          <div>
            <form onSubmit={async (e) => { e.preventDefault(); await supabase.from('posts').insert([{ user_email: user.email, content: inputText }]); setInputText(''); fetchAll(user.email); }}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="What's happening?" style={{ width: '95%', height: '80px', borderRadius: '10px', padding: '10px', background: '#1e293b', color: '#fff' }} />
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>Post</button>
            </form>

            <div style={{ marginTop: '30px' }}>
              {posts.map(p => (
                <div key={p.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.8rem' }}>@{p.user_email?.split('@')[0]}</span>
                    
                    {/* BOLDER DELETE BUTTON */}
                    {p.user_email?.toLowerCase() === user.email?.toLowerCase() && (
                      <button 
                        onClick={() => handleDeletePost(p.id)} 
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                  <p style={{ margin: 0 }}>{p.content}</p>
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
