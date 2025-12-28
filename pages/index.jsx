import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || '',
  import.meta.env?.VITE_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // 1. Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email or try logging in!");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const sendPost = async () => {
    await supabase.from('posts').insert([{ content: input, username: session.user.email.split('@')[0] }]);
    setInput('');
    loadData();
  };

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>⚡ Circuitburst</h1>
        <p>Founder & Member Access</p>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>Login</button>
        <button onClick={handleSignUp} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>Create Account</button>
      </div>
    );
  }

  // --- THE ACTUAL SITE (Only visible if logged in) ---
  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>⚡ Circuitburst</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '5px 10px' }}>Logout</button>
      </div>
      
      <p>Welcome, <strong>{session.user.email}</strong></p>

      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="What's the status?" style={{ width: '100%', height: '60px' }} />
      <button onClick={sendPost} style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none' }}>Broadcast</button>

      {posts.map(p => (
        <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
          <strong>@{p.username}:</strong> {p.content}
        </div>
      ))}
    </div>
  );
}
