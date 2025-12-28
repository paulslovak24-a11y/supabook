import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// UNIVERSAL KEYS: This checks for every possible way Render stores your keys
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (e) {
        console.error("Auth error", e);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    loadData();
    return () => subscription?.unsubscribe();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handleLoginAction = async (type) => {
    setLoading(true);
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert(error.message);
    setLoading(false);
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>⚡ Connecting to Circuitburst...</div>;

  if (!session) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>⚡ Circuitburst</h1>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px' }} />
        <button onClick={() => handleLoginAction('login')} style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>Login</button>
        <button onClick={() => handleLoginAction('signup')} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>Create Account</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>⚡ Circuitburst</h2>
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Broadcast..." style={{ width: '100%', height: '60px' }} />
      <button onClick={async () => { 
        await supabase.from('posts').insert([{ content: input, username: session.user.email.split('@')[0] }]);
        setInput(''); loadData();
      }} style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none' }}>Post</button>
      {posts.map(p => (
        <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
          <strong>@{p.username}:</strong> {p.content}
        </div>
      ))}
    </div>
  );
}
