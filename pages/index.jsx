import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env?.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch posts from Database
  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  // 2. Function to Send Post to Database
  const handlePost = async () => {
    if (!newPost) return;
    setLoading(true);
    
    const { error } = await supabase.from('posts').insert([{ content: newPost }]);
    
    if (error) {
      alert("Error posting: " + error.message);
    } else {
      setNewPost(''); // Clear the box
      fetchPosts();   // Refresh the list
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>⚡ Circuitburst Feed</h1>
      
      {/* THE POST BOX */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
        <textarea 
          placeholder="What's happening?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handlePost}
          disabled={loading}
          style={{ marginTop: '10px', padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Posting...' : 'Post to Circuitburst'}
        </button>
      </div>

      <hr />

      {/* THE FEED */}
      <h3>Recent Posts</h3>
      {posts.map(p => (
        <div key={p.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
          {p.content}
        </div>
      ))}
    </div>
  );
}
