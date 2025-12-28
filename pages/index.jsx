import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || '',
  import.meta.env?.VITE_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // 1. Check for session safely
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    loadData();

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Signup successful! You can now log in.");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const sendPost = async () => {
    if (!input.trim() || !session) return;
    const userHandle = session.user.email ? session.user.email.split('@')[0] : 'Member';
    
    const { error } = await supabase.from('posts').insert([
      { content: input, username: userHandle }
    ]);
    
    if (!error) {
      setInput('');
      loadData();
    }
  };

  // 1. Show nothing or a spinner while checking the session
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Circuitburst...</div>;

  // 2. LOGIN SCREEN (If no user)
  if (!session) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#0070f3' }}>⚡ Circuitburst</h1>
        <p>Enter the Network</p>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
        <button onClick={handleSignUp} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>Create Founder Account</button>
      </div>
    );
  }

  // 3. MAIN APP (If logged in)
  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0070f3', margin: 0 }}>⚡ Circuitburst</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#eee', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <div style={{ background: '#f0f7ff', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        Welcome, <strong>{session.user.email}</strong>
      </div>

      <textarea 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Broadcast to the network..." 
        style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }} 
      />
      <button onClick={sendPost} style={{ width: '100%', padding: '12px', marginTop: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Broadcast</button>

      <div style={{ marginTop: '30px' }}>
        {posts.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
            <span style={{ color: '#0070f3', fontWeight: 'bold' }}>@{p.username || 'Anonymous'}</span>
            <p style={{ margin: '5px 0 0 0', color: '#333' }}>{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
