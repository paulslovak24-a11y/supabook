import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Setup connection
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    loadData();
    return () => subscription?.unsubscribe();
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setPosts(data);
  };

  const handleAuth = async (type) => {
    setLoading(true);
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert(error.message);
    setLoading(false);
  };

  const sendPost = async () => {
    if (!input.trim() || !session?.user) return;
    
    // Safety check for username
    const username = session.user.email?.split('@')[0] || 'User';
    
    const { error } = await supabase.from('posts').insert([
      { content: input, username: username }
    ]);
    
    if (!error) {
      setInput('');
      loadData();
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Initializing Circuitburst...</p>
      </div>
    );
  }

  // 2. Login Screen
  if (!session) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#0070f3' }}>⚡ Circuitburst</h1>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button onClick={() => handleAuth('login')} style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
        <button onClick={() => handleAuth('signup')} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>Create Account</button>
      </div>
    );
  }

  // 3. Authenticated App
  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0070f3', margin: 0 }}>⚡ Circuitburst</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="What's the status?" 
          style={{ width: '100%', height: '80px', padding: '10px', boxSizing: 'border-box', borderRadius: '8px' }} 
        />
        <button onClick={sendPost} style={{ width: '100%', padding: '12px', marginTop: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Broadcast</button>
      </div>

      <div>
        {posts.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
            <strong style={{ color: '#0070f3' }}>@{p.username}</strong>
            <p style={{ margin: '5px 0 0 0', color: '#444' }}>{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
