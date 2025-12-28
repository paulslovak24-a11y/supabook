import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [view, setView] = useState('feed'); // 'feed' or 'dms'
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recipient, setRecipient] = useState('');
  const MY_NAME = 'Founder';

  const loadData = async () => {
    const { data: p } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(p || []);
    const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    setMessages(m || []);
  };

  useEffect(() => { loadData(); }, []);

  const sendPost = async () => {
    await supabase.from('posts').insert([{ content: input, username: MY_NAME }]);
    setInput(''); loadData();
  };

  const sendDM = async () => {
    await supabase.from('messages').insert([{ sender_id: MY_NAME, receiver_id: recipient, content: input }]);
    setInput(''); loadData();
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#0070f3' }}>⚡ CIRCUITBURST</h1>
      
      {/* NAV BAR - This makes sure you can see the DM option */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setView('feed')} style={{ flex: 1, padding: '10px', background: view === 'feed' ? '#0070f3' : '#eee', color: view === 'feed' ? '#fff' : '#000', border: 'none', borderRadius: '5px' }}>Public Feed</button>
        <button onClick={() => setView('dms')} style={{ flex: 1, padding: '10px', background: view === 'dms' ? '#0070f3' : '#eee', color: view === 'dms' ? '#fff' : '#000', border: 'none', borderRadius: '5px' }}>Private DMs</button>
      </div>

      {view === 'feed' ? (
        <div>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="What's happening?" style={{ width: '100%', height: '60px' }} />
          <button onClick={sendPost} style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#0070f3', color: '#fff', border: 'none' }}>Post Globally</button>
          {posts.map(p => <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}><strong>@{p.username}:</strong> {p.content}</div>)}
        </div>
      ) : (
        <div>
          <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Who to message?" style={{ width: '100%', marginBottom: '5px' }} />
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type a secret message..." style={{ width: '100%', height: '60px' }} />
          <button onClick={sendDM} style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#333', color: '#fff', border: 'none' }}>Send Private DM</button>
          <div style={{ marginTop: '20px' }}>
            {messages.map(m => (
              <div key={m.id} style={{ marginBottom: '10px', textAlign: m.sender_id === MY_NAME ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', background: m.sender_id === MY_NAME ? '#0070f3' : '#eee', color: m.sender_id === MY_NAME ? '#fff' : '#000' }}>
                  <small style={{ display: 'block', fontSize: '10px' }}>{m.sender_id === MY_NAME ? `To: ${m.receiver_id}` : `From: ${m.sender_id}`}</small>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
