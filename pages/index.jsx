import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// This pulls your keys from Render's Environment Variables
const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getPosts() {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) setError(error.message);
      else setPosts(data);
    }
    getPosts();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '40px', background: '#fff1f1', color: '#d00', border: '2px solid red', borderRadius: '8px' }}>
        <h1>❌ Database Connection Error</h1>
        <p><strong>Message:</strong> {error}</p>
        <p>This usually means your Render Environment Variables are wrong or RLS is on.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>✅ Circuitburst is LIVE</h1>
      <p>If you see this, your website is successfully talking to Render.</p>
      <hr />
      <h3>Posts found: {posts.length}</h3>
      {posts.map(p => (
        <div key={p.id} style={{ padding: '15px', border: '1px solid #ddd', margin: '10px 0', borderRadius: '5px' }}>
          {p.content}
        </div>
      ))}
    </div>
  );
}
